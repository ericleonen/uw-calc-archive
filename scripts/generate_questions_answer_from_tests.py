"""
Script to parse questions and answers from test PDFs and answer key PDFs respectively.

=== VOCAB ===
- Section: a series of blocks in a document that may span multiple pages. Shares the width of the
           page.
- Numbered section: a section that starts with a "numbered" prefix like "1." or "2)"
- Bounds: the upper and lower y-coordinates (and possibly pages) of a section or block
- Undesirable (block): a block on a document that shouldn't be shown to the user (i.e. page numbers
                       or headers)
"""

from pathlib import Path
import fitz
from PIL import Image
from fitz import Document
import numpy as np
import re
from re import Pattern
import shutil

RAW_DIR = Path("data/raw")
PROCESSED_DIR = Path("data/processed")

NUMBERED_SECTION_REGEXES = [re.compile(p, re.IGNORECASE) for p in [
    r"^\d+\.",
    r"^#\s*\d+",
    r"^problem\s+\d+\.",
    r"^question\s+\d+\.",
    r"^q\d+\.",
    r"^\d+\s*\("
]]
UNDESIRABLES_REGEXES = [re.compile(p, re.IGNORECASE) for p in [
    r"^\d+$",
    r"math 12[456]", re.I,
    r"(fall|spring|winter|summer)\s+20(0\d|1\d)",
    r"page\s+\d+\s+of\s+\d+"
]]

def get_numbered_sections_and_undesirable_block_bounds(
    doc: Document,
    look_for_pair: bool = False,
    numbered_section_regexes: list[Pattern[str]] = NUMBERED_SECTION_REGEXES,
    undesirables_regexes: list[Pattern[str]] = UNDESIRABLES_REGEXES
) -> tuple[list, list | None, list]:
    """
    Creates bounds of (1) numbered sections, (2) a possible second numbered sections, and (3)
    undesirable blocks.

    Parameters
    ----------
    doc: Document
        The document including sections.
    look_for_pair: bool, optional
        Flag to expect and look for a second pair of numbered sections. Default false.
    numbered_section_regexes: list[Pattern[str]], optional
        A list of regex patterns that define a numbered section. Default NUMBERED_SECTION_REGEXES.
    undesirables_regexes: list[Pattern[str]], optional
        A list of regex patterns that define an undesirable block.

    Returns
    -------
    sections_bounds_1: list
        A list of sections bounds, where each section bounds follows the schema:
        ```
        {
            start: {
                page_idx: int,
                y: float
            },
            end: {
                page_idx: int,
                y: float
            }
        }
        ```
    sections_bounds_2: list | None
        If look_for_pair, a list of section bounds with the same schema as sections_bounds_2,
        otherwise, None.
    undesirables_bounds: list
        A list of blocks bounds, where each block bound follows the schema:
        ```
        {
            page_idx: int,
            y0: float,
            y1: float
        }
        ```
    """
    if look_for_pair:
        numbered_section_regexes_1 = [
            re.compile(p.pattern.replace(r"\d", "1"), re.IGNORECASE)
            for p in numbered_section_regexes
        ]

    curr_question_num = 1

    sections_bounds_1, sections_bounds_2 = [], [] if look_for_pair else None
    sections_bounds = sections_bounds_1
    undesirables_bounds = []

    for page_idx, page in enumerate(doc):
        dict_ = page.get_text("dict")

        page_height = page.rect.height
        prev_block_y1 = 0

        for block in dict_["blocks"]:
            _, y0, _, y1 = block["bbox"]

            if len(sections_bounds) > 0 and sections_bounds[-1]["start"]["page_idx"] == page_idx and sections_bounds[-1]["start"]["y"] > y0:
                sections_bounds[-1]["start"]["y"] = y0 

                # LIKELY A CULPRIT FOR MISSING BOTTOMS
                if len(sections_bounds) > 1 and sections_bounds[-2]["end"]["page_idx"] == page_idx:
                    sections_bounds[-2]["end"]["y"] = y0

            block_text = "".join(span["text"] for line in block.get("lines", []) for span in line["spans"]).lower()
            
            is_empty_above = prev_block_y1 == 0 or y0 - prev_block_y1 >= 64

            if is_empty_above and any(r.search(block_text) for r in undesirables_regexes):
                undesirables_bounds.append({
                    "page_idx": page_idx,
                    "y0": y0,
                    "y1": y1
                })
            elif any(r.search(block_text) for r in numbered_section_regexes):
                if len(sections_bounds) > 0:
                    sections_bounds[-1]["end"] = {
                        "page_idx": page_idx,
                        "y": min(y0, page_height)
                    }

                sections_bounds.append({
                    "start": {
                        "page_idx": page_idx,
                        "y": max(y0, 0)
                    },
                    "end": {
                        "page_idx": doc.page_count - 1,
                        "y": doc[-1].rect.height
                    }
                })
                curr_question_num += 1
            elif look_for_pair and sections_bounds is sections_bounds_1 and len(sections_bounds_1) > 1 and any(
                r.search(block_text) for r in numbered_section_regexes_1
            ):
                sections_bounds = sections_bounds_2
                curr_question_num = 1
                
                sections_bounds_1[-1]["end"] = {
                        "page_idx": page_idx,
                        "y": min(y0, page_height)
                    }
                sections_bounds.append({
                    "start": {
                        "page_idx": page_idx,
                        "y": max(y0, 0)
                    },
                    "end": None
                })
                curr_question_num += 1

            prev_block_y1 = y1

    return sections_bounds_1, sections_bounds_2, undesirables_bounds

def cap_whitespace_from_canvas(
    canvas: Image,
    max_whitespace_height: int = 32,
    max_whitespace_width: int = 32,
    ink_threshold: int = 245,
    min_ink_pixels_ratio: float = 0.001,
) -> Image:
    gray_canvas = canvas.convert("L")
    arr = np.array(gray_canvas, dtype=np.uint8)
    arr_height, arr_width = arr.shape
    ink_mask = arr < ink_threshold
    row_thresh = max(1, int(min_ink_pixels_ratio * arr_width))
    row_has_ink = ink_mask.sum(axis=1) >= row_thresh

    out_rows = []
    consecutive_whitespace_rows = 0

    for r in range(arr_height):
        if row_has_ink[r]:
            if consecutive_whitespace_rows > 0:
                n_rows_keep = min(consecutive_whitespace_rows, max_whitespace_height)
                out_rows.extend(np.full(arr_width, 255, dtype=np.uint8) for _ in range(n_rows_keep))
                consecutive_whitespace_rows = 0
            out_rows.append(arr[r])
        else:
            consecutive_whitespace_rows += 1

    if consecutive_whitespace_rows > 0:
        n_rows_keep = min(consecutive_whitespace_rows, max_whitespace_height)
        out_rows.extend(np.full(arr_width, 255, dtype=np.uint8) for _ in range(n_rows_keep))

    out_arr = np.stack(out_rows, axis=0).astype(np.uint8)

    arr2 = out_arr
    arr2_height, arr2_width = arr2.shape
    ink_mask2 = arr2 < ink_threshold
    col_thresh = max(1, int(min_ink_pixels_ratio * arr2_height))
    col_has_ink = ink_mask2.sum(axis=0) >= col_thresh

    out_cols = []
    consecutive_whitespace_cols = 0

    for c in range(arr2_width):
        if col_has_ink[c]:
            if consecutive_whitespace_cols > 0:
                n_cols_keep = min(consecutive_whitespace_cols, max_whitespace_width)
                out_cols.extend(np.full(arr2_height, 255, dtype=np.uint8) for _ in range(n_cols_keep))
                consecutive_whitespace_cols = 0
            out_cols.append(arr2[:, c])
        else:
            consecutive_whitespace_cols += 1

    if consecutive_whitespace_cols > 0:
        n_cols_keep = min(consecutive_whitespace_cols, max_whitespace_width)
        out_cols.extend(np.full(arr2_height, 255, dtype=np.uint8) for _ in range(n_cols_keep))

    out_arr2 = np.stack(out_cols, axis=1).astype(np.uint8)
    return Image.fromarray(out_arr2).convert("RGB")

def slice_doc_and_save(
    doc: Document, 
    sections_bounds: list,
    undesirables_bounds: list, 
    save_to_path: Path,
    dpi: int = 200,
):
    save_to_path.mkdir(parents=True, exist_ok=False)

    def get_slice(page_idx, y0, y1):
        page = doc[page_idx]
        page_width, page_height = page.rect.width, page.rect.height

        if y0 > y1:
            raise ValueError("y0 is below y1")
        elif y0 < 0 or y1 > page_height:
            raise ValueError("Slice goes out of the page")
        
        rect = fitz.Rect(0, max(y0 - 2, 0), page_width, y1)
        pix = page.get_pixmap(clip=rect, dpi=dpi)

        return Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

    undesirables_by_page = {}
    for b in undesirables_bounds:
        lst = undesirables_by_page.setdefault(b["page_idx"], [])
        lst.append((b["y0"], b["y1"]))
    for k in undesirables_by_page:
        undesirables_by_page[k].sort()

    def subtract_intervals(y0, y1, cuts):
        segs = [(y0, y1)]
        for c0, c1 in cuts:
            new = []
            for a0, a1 in segs:
                if c1 <= a0 or c0 >= a1:
                    new.append((a0, a1))
                else:
                    if c0 > a0:
                        new.append((a0, min(c0, a1)))
                    if c1 < a1:
                        new.append((max(c1, a0), a1))
            segs = [(a0, a1) for a0, a1 in new if a1 > a0]
            if not segs:
                break
        return segs

    for bounds_idx, bounds in enumerate(sections_bounds):
        slices = []
        curr_page_idx = bounds["start"]["page_idx"]

        while True:
            curr_page = doc[curr_page_idx]
            page_height = curr_page.rect.height

            if curr_page_idx == bounds["start"]["page_idx"] and curr_page_idx == bounds["end"]["page_idx"]:
                base_segments = [(bounds["start"]["y"], bounds["end"]["y"])]
                cuts = undesirables_by_page.get(curr_page_idx, [])
                segs = sum((subtract_intervals(a, b, cuts) for a, b in base_segments), [])
                for a, b in segs:
                    slices.append(get_slice(curr_page_idx, a, b))
                break
            elif curr_page_idx == bounds["start"]["page_idx"]:
                base_segments = [(bounds["start"]["y"], page_height)]
                cuts = undesirables_by_page.get(curr_page_idx, [])
                segs = sum((subtract_intervals(a, b, cuts) for a, b in base_segments), [])
                for a, b in segs:
                    slices.append(get_slice(curr_page_idx, a, b))
            elif curr_page_idx == bounds["end"]["page_idx"]:
                base_segments = [(0, bounds["end"]["y"])]
                cuts = undesirables_by_page.get(curr_page_idx, [])
                segs = sum((subtract_intervals(a, b, cuts) for a, b in base_segments), [])
                for a, b in segs:
                    slices.append(get_slice(curr_page_idx, a, b))
                break
            else:
                base_segments = [(0, page_height)]
                cuts = undesirables_by_page.get(curr_page_idx, [])
                segs = sum((subtract_intervals(a, b, cuts) for a, b in base_segments), [])
                for a, b in segs:
                    slices.append(get_slice(curr_page_idx, a, b))

            curr_page_idx += 1

        if not slices:
            continue

        img_height = sum(slice_.height for slice_ in slices)
        img_width = max(slice_.width for slice_ in slices)
        canvas = Image.new("RGB", (img_width, img_height))

        curr_y = 0
        for slice_ in slices:
            canvas.paste(slice_, (0, curr_y))
            curr_y += slice_.height

        cap_whitespace_from_canvas(canvas).save(save_to_path / f"Q{bounds_idx + 1}.png")

def generate_questions_answers_from_test(test_dir: Path):
    test_id = test_dir.name
    test_pdf = test_dir / "test.pdf"
    answers_pdf = test_dir / "answers.pdf"
    metadata_json = test_dir / "metadata.json"

    if not test_pdf.exists():
        raise FileNotFoundError(f"Test {test_id} has no test.pdf")
    
    if not metadata_json.exists():
        raise FileNotFoundError(f"Test {test_id} has no metadata.json")
    
    answers_pdf_exists = answers_pdf.exists()

    test_doc = fitz.open(str(test_pdf))
    questions_bounds, answers_bounds, test_undesirables_bounds = get_numbered_sections_and_undesirable_block_bounds(test_doc, look_for_pair=not answers_pdf_exists)

    if len(questions_bounds) <= 1:
        raise Exception(f"Only found {len(questions_bounds)} questions in test {test_id}")
    
    if answers_pdf_exists:
        answers_doc = fitz.open(str(answers_pdf))

        if answers_doc.page_count == test_doc.page_count:
            # answers are filled out in test
            answers_bounds = questions_bounds
            answers_undesirables_bounds = test_undesirables_bounds
        elif answers_doc.page_count < test_doc.page_count:
            # answers are compact
            answers_bounds, _, answers_undesirables_bounds = get_numbered_sections_and_undesirable_block_bounds(answers_doc)
        else:
            raise Exception(f"Test {test_id} has a shorter test.pdf than answers.pdf")
    else:
        if answers_bounds is None:
            raise Exception(f"Test {test_id} has answers.pdf nor answers attatched to the end of its test.pdf")
        else:   
            answers_doc = test_doc
            answers_undesirables_bounds = test_undesirables_bounds

    if len(answers_bounds) != len(questions_bounds):
        raise Exception(f"There are {len(questions_bounds)} questions and {len(answers_bounds)} answers in test {test_id}")
        
    processed_test_dir = PROCESSED_DIR / test_id
    processed_test_dir.mkdir(parents=True, exist_ok=False)

    shutil.copy(metadata_json, processed_test_dir / "metadata.json")

    slice_doc_and_save(test_doc, questions_bounds, test_undesirables_bounds, processed_test_dir / "questions")
    slice_doc_and_save(answers_doc, answers_bounds, answers_undesirables_bounds, processed_test_dir / "answers")
    
if __name__ == "__main__":
    for i, folder in enumerate(RAW_DIR.iterdir()):
        # if i > 3:
        #     continue
        if folder.name == "027f9e1b-d76f-4fb9-ab3e-5a8831b965d3":

            if folder.is_dir():
                generate_questions_answers_from_test(folder)
                