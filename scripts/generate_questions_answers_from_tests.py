"""
Script to parse questions and answers from test PDFs and answer key PDFs respectively.
Error-free parsing (152/280 ≈ 54%)

=== VOCAB ===
- Section: a series of blocks in a document that may span multiple pages. Shares the width of the
           page.
- Numbered section: a section that starts with a "numbered" prefix like "1." or "2)"
- Bounds: the upper and lower y-coordinates (and possibly pages) of a section or block
- Undesirable (block): a block on a document that shouldn't be shown to the user (i.e. page numbers
                       or headers) with whitespace above it
"""

from pathlib import Path
import fitz
from PIL import Image
from fitz import Document
import numpy as np
import re
from re import Pattern
import shutil
import argparse
import json

ARCHIVE_DIR = Path("data/archive")
RAW_DIR = Path("data/raw")
PROCESSED_DIR = Path("data/processed")

NUMBERED_1_SECTION_REGEXES = [
    r"^1\.",
    r"^#\s*1",
    r"^problem\s+1",
    r"^question\s+1",
    r"^q1+\.",
    r"^1+\s*\(",
    r"^exercise\s+1"
]
UNDESIRABLES_REGEXES = [
    r"math 12[456]",
    r"(fall|spring|winter|summer)\s+20(0|1|2)\d",
    r"page\s+\d+\s+of\s+\d+",
    r"^\d\s+of\s+\d",
    r"next\s+page",
    r"^answers$",
    r"page\s+\d",
    r"final\s+examination",
    r"page\s+is\s+blank",
    r"scratch\s+paper",
    r"scratch\s+work",
    r"scratch-work",
    r"all\s+work\s+on\s+this\s+page\s+will\s+be\s+ignored"
]
INSTRUCTIONS_PAGE_REGEXES = [
    r"honor\s+statement",
    r"good\s+luck",
    r"electronic\s+devices",
    r"calculator"
]

def get_numbered_sections_and_undesirable_block_bounds(
    doc: Document,
    look_for_pair: bool = False,
    numbered_1_section_regexes: list[Pattern[str]] = NUMBERED_1_SECTION_REGEXES,
    undesirables_regexes: list[Pattern[str]] = UNDESIRABLES_REGEXES,
    undesirables_min_whitespace_margin: float = 4,
    instructions_page_regexes: list[str] = INSTRUCTIONS_PAGE_REGEXES
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
    numbered_1_section_regexes: list[Pattern[str]], optional
        A list of regex patterns that define a numbered section. Default NUMBERED_1_SECTION_REGEXES.
    undesirables_regexes: list[Pattern[str]], optional
        A list of regex patterns that define an undesirable block. Default UNDESIRABLES_REGEXES
    undesirables_min_whitespace_margin: float, optional
        The minimum height (in PDF pixels) of whitespace above a block that makes it eligible to
        be undesirable. Default 16
    instructions_page_regexes: list[str], optional
        A list of regex patterns that define an instructions page (to be skipped in searching for
        numbered sections). Default INSTRUCTIONS_PAGE_REGEXES

    Returns
    -------
    sections_bounds_1: list
        A list of sections bounds, where each section bounds follows the schema:
        ```
        {
            p0: int,
            y0: float,
            p1: int,
            y1: float
        }
        ```
    sections_bounds_2: list | None
        If look_for_pair, a list of section bounds with the same schema as sections_bounds_2,
        otherwise, None.
    undesirables_bounds: list
        A list of blocks bounds, where each block bound follows the schema:
        ```
        {
            p: int,
            y0: float,
            y1: float
        }
        ```
    """
    def regex_search(text: str, regex: str) -> bool:
        return re.compile(regex, re.IGNORECASE).search(text)

    def get_matching_regex(text: str, regexes: list[str]) -> str | None:
        for regex in regexes:
            if regex_search(text, regex):
                return regex
            
        return None

    q = 1
    numbered_q_section_regex = None

    sections_bounds_1, sections_bounds_2 = [], [] if look_for_pair else None
    sections_bounds = sections_bounds_1
    undesirables_bounds = []

    page_count = doc.page_count

    for p, page in enumerate(doc):
        dict_ = page.get_text("dict")

        page_height = page.rect.height
        prev_block_y1 = 0

        for block in dict_.get("blocks", []):
            _, y0, _, y1 = block["bbox"]

            if (
                len(sections_bounds) > 0 \
                and sections_bounds[-1]["p0"] == p \
                and sections_bounds[-1]["y0"] > y0
            ):
                # block inside last numbered section lies above its start bound
                sections_bounds[-1]["y0"] = y0 

                if len(sections_bounds) > 1 and sections_bounds[-2]["p1"] == p:
                    # block inside last numbered section lies above the penultimate numbered
                    # section's end bound
                    sections_bounds[-2]["y1"] = y0

            block_text = "".join(
                span["text"] for line in block.get("lines", []) for span in line.get("spans", [])
            ).lstrip()
            
            if p == 0 and any(regex_search(block_text, r) for r in instructions_page_regexes):
                sections_bounds.clear()
                undesirables_bounds.clear()
                q = 1
                numbered_q_section_regex = None

                break

            # print(block_text)
            
            if numbered_q_section_regex is None:
                numbered_q_section_regex = \
                    get_matching_regex(block_text, numbered_1_section_regexes)

            if (
                y0 >= prev_block_y1 and \
                numbered_q_section_regex is not None and \
                regex_search(block_text, numbered_q_section_regex)
            ):
                # current block starts a numbered section
                if len(sections_bounds) > 0:
                    sections_bounds[-1]["p1"] = p
                    sections_bounds[-1]["y1"] = min(y0, page_height)

                sections_bounds.append({
                    "p0": p,
                    "y0": max(y0, 0),
                    "p1": page_count - 1,
                    "y1": doc[-1].rect.height
                })

                numbered_q_section_regex = numbered_q_section_regex.replace(str(q), str(q + 1))
                q += 1
            elif (
                look_for_pair and \
                sections_bounds is sections_bounds_1 and \
                len(sections_bounds_1) > 1
            ):
                numbered_q_section_regex_tmp = \
                    get_matching_regex(block_text, numbered_1_section_regexes)
                
                
                if numbered_q_section_regex_tmp is not None:
                    # current block starts the second set of numbered sections
                    sections_bounds = sections_bounds_2
                    numbered_q_section_regex = numbered_q_section_regex_tmp
                    q = 1
                    
                    sections_bounds_1[-1]["p1"] = p
                    sections_bounds_1[-1]["y1"] = min(y0, page_height)

                    sections_bounds.append({
                        "p0": p,
                        "y0": y0,
                        "p1": doc.page_count - 1,
                        "y1": doc[-1].rect.height
                    })

                    numbered_q_section_regex = numbered_q_section_regex.replace(str(q), str(q + 1))
                    q += 1

            if (
                (
                    prev_block_y1 == 0 or \
                    y0 - prev_block_y1 >= undesirables_min_whitespace_margin
                ) and any(regex_search(block_text, r) for r in undesirables_regexes)
            ):
                # current block is undesirable
                undesirables_bounds.append({
                    "p": p,
                    "y0": y0,
                    "y1": y1
                })
            elif (
                regex_search(block_text, r"^\d+$") and \
                y0 - prev_block_y1 >= undesirables_min_whitespace_margin and \
                y0 / page_height >= 0.9
            ):
                undesirables_bounds.append({
                    "p": p,
                    "y0": y0,
                    "y1": y1
                })
            else:
                prev_block_y1 = y1

                while (
                    len(undesirables_bounds) > 0 and \
                    undesirables_bounds[-1]["p"] == p and \
                    y0 - undesirables_bounds[-1]["y1"] < undesirables_min_whitespace_margin
                ):
                    undesirables_bounds.pop()

        if prev_block_y1 == 0:
            # only undesirable blocks on this page
            if len(sections_bounds) > 0 and sections_bounds[-1]["p1"] >= p:
                sections_bounds[-1]["p1"] = p - 1
                sections_bounds[-1]["y1"] = doc[p - 1].rect.height

    return sections_bounds_1, sections_bounds_2, undesirables_bounds

def erase_horizontal_lines(
    canvas: Image.Image,
    min_line_percentage_width: float = 0.7,
    white_threshold: int = 245,
) -> Image.Image:
    rgb = canvas.convert("RGB")
    arr = np.array(rgb, dtype=np.uint8)

    gray = np.array(rgb.convert("L"), dtype=np.uint8)
    H, W = gray.shape
    non_white = gray < white_threshold

    # pad with False so runs at edges close cleanly
    padded = np.pad(non_white, ((0,0),(1,1)), mode="constant", constant_values=False)
    d = np.diff(padded.astype(np.int8), axis=1)  # +1 starts, -1 ends

    s_r, s_c = np.where(d == 1)   # start rows/cols
    e_r, e_c = np.where(d == -1)  # end rows/cols

    # If no runs anywhere, return early
    if s_c.size == 0 and e_c.size == 0:
        return Image.fromarray(arr)

    # Count starts/ends per row
    s_count = np.bincount(s_r, minlength=H)
    e_count = np.bincount(e_r, minlength=H)

    # Fix asymmetries: add synthetic ends at W or starts at 0 per row
    add_end_rows   = np.repeat(np.arange(H), np.maximum(s_count - e_count, 0))
    add_start_rows = np.repeat(np.arange(H), np.maximum(e_count - s_count, 0))

    if add_end_rows.size:
        e_r = np.concatenate([e_r, add_end_rows])
        e_c = np.concatenate([e_c, np.full(add_end_rows.size, W, dtype=int)])
    if add_start_rows.size:
        s_r = np.concatenate([s_r, add_start_rows])
        s_c = np.concatenate([s_c, np.zeros(add_start_rows.size, dtype=int)])

    # Sort starts and ends by (row, col) so pairs align within each row
    s_order = np.lexsort((s_c, s_r))
    e_order = np.lexsort((e_c, e_r))
    s_r, s_c = s_r[s_order], s_c[s_order]
    e_r, e_c = e_r[e_order], e_c[e_order]

    # Now runs are paired within rows: lengths = end - start
    lengths = e_c - s_c  # >= 0

    # Reduce to per-row maxima without a Python loop
    # Compute segment starts in the starts array where row changes
    seg_starts = np.r_[0, np.flatnonzero(s_r[1:] != s_r[:-1]) + 1]
    row_of_seg = s_r[seg_starts]

    max_run = np.zeros(H, dtype=int)
    # maximum over each contiguous block (row segment)
    seg_max = np.maximum.reduceat(lengths, seg_starts)
    max_run[row_of_seg] = seg_max

    # Build mask of rows to whiten
    row_mask = (max_run.astype(float) / W) >= min_line_percentage_width
    if row_mask.any():
        arr[row_mask, :, :3] = 255

    return Image.fromarray(arr)

def cap_whitespace_from_canvas(
    canvas: Image,
    max_whitespace_height: int = 32,
    max_whitespace_width: int = 32,
    white_threshold: int = 245,
    min_whitespace_pixels_ratio: float = 0.998,
) -> Image:
    """
    Caps the height and width of whitespace rectangles in a canvas.

    Parameters
    ----------
    canvas: Image
        The original canvas.
    max_whitespace_height: int, optional
        Maximum allowed height (in image pixels) of a whitespace rectangle that is the width of the
        page. Default 32.
    max_whitespace_width: int, optional
        Maximum allowed width (in image pixels) of a whitespace rectangle that is the height of the
        page. Default 32.
    ink_threshold: float, optional
        Minimum value of a grayscale pixel (0-255) to be considered "white". Default 245.
    min_whitespace_pixels_ratio: float, optional
        Minimum ratio of "white" pixels in a row or column to consider the whole row or column
        white.

    Returns
    -------
    canvas: Image
        A new image with capped whitespaces.
    """
    rgb_canvas = canvas.convert("RGB")
    arr_rgb = np.array(rgb_canvas, dtype=np.uint8)

    # --- ROWS ---
    arr_gray = np.array(canvas.convert("L"), dtype=np.uint8)
    arr_height, arr_width = arr_gray.shape

    white_mask = arr_gray >= white_threshold
    row_is_white = white_mask.mean(axis=1) >= min_whitespace_pixels_ratio

    out_rows_rgb = []
    consecutive_whitespace_rows = 0

    for r in range(arr_height):
        if row_is_white[r]:
            if consecutive_whitespace_rows < max_whitespace_height:
                out_rows_rgb.append(arr_rgb[r:r + 1, :, :])

            consecutive_whitespace_rows += 1
        else:
            consecutive_whitespace_rows = 0
            out_rows_rgb.append(arr_rgb[r:r + 1, :, :])

    arr_rgb = np.vstack(out_rows_rgb).astype(np.uint8)

    # --- COLUMNS ---
    arr_gray = np.array(Image.fromarray(arr_rgb).convert("L"), dtype=np.uint8)
    arr_height, arr_width = arr_gray.shape

    white_mask = arr_gray >= white_threshold
    col_is_white = white_mask.mean(axis=0) >= min_whitespace_pixels_ratio

    out_cols_rgb = []
    consecutive_whitespace_cols = 0

    for c in range(arr_width):
        if col_is_white[c]:
            if consecutive_whitespace_cols < max_whitespace_width:
                out_cols_rgb.append(arr_rgb[:, c : c + 1, :])

            consecutive_whitespace_cols += 1
        else:
            consecutive_whitespace_cols = 0
            out_cols_rgb.append(arr_rgb[:, c : c + 1, :])

    arr_rgb = np.concatenate(out_cols_rgb, axis=1).astype(np.uint8)
    return Image.fromarray(arr_rgb)

def slice_doc(
    doc: Document, 
    sections_bounds: list,
    undesirables_bounds: list,
    dpi: int = 200,
) -> list[Image.Image]:
    """
    Slices the given doc into sections defined by sections and undesirables bounds.

    Parameters
    ----------
    doc: Document, 
    sections_bounds: list
        The list of sections bounds to define sections.
    undesirables_bounds: list
        The list of undesirables bounds to crop out of images.
    dpi: int, optional
        The density of the saved images. Default 200.

    Returns
    -------
    sections: list[Image]
        List of doc sections.
    """

    sections = []

    def get_slice(p, y0, y1):
        page = doc[p]
        page_width, page_height = page.rect.width, page.rect.height

        if y0 > y1:
            raise ValueError("y0 is below y1")
        elif y0 < 0 or y1 > page_height:
            raise ValueError("Slice goes out of the page")
        
        rect = fitz.Rect(0, y0, page_width, y1)
        pix = page.get_pixmap(clip=rect, dpi=dpi)

        return Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

    undesirables_by_page = {}
    for b in undesirables_bounds:
        lst = undesirables_by_page.setdefault(b["p"], [])
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

    for bounds in sections_bounds:
        slices = []
        curr_p = bounds["p0"]

        while True:
            curr_page = doc[curr_p]
            page_height = curr_page.rect.height

            if curr_p == bounds["p0"] and curr_p == bounds["p1"]:
                base_segments = [(bounds["y0"], bounds["y1"])]
                cuts = undesirables_by_page.get(curr_p, [])
                segs = sum((subtract_intervals(a, b, cuts) for a, b in base_segments), [])
                for a, b in segs:
                    slices.append(get_slice(curr_p, a, b))
                break
            elif curr_p == bounds["p0"]:
                base_segments = [(bounds["y0"], page_height)]
                cuts = undesirables_by_page.get(curr_p, [])
                segs = sum((subtract_intervals(a, b, cuts) for a, b in base_segments), [])
                for a, b in segs:
                    slices.append(get_slice(curr_p, a, b))
            elif curr_p == bounds["p1"]:
                base_segments = [(0, bounds["y1"])]
                cuts = undesirables_by_page.get(curr_p, [])
                segs = sum((subtract_intervals(a, b, cuts) for a, b in base_segments), [])
                for a, b in segs:
                    slices.append(get_slice(curr_p, a, b))
                break
            else:
                base_segments = [(0, page_height)]
                cuts = undesirables_by_page.get(curr_p, [])
                segs = sum((subtract_intervals(a, b, cuts) for a, b in base_segments), [])
                for a, b in segs:
                    slices.append(get_slice(curr_p, a, b))

            curr_p += 1

        if not slices:
            continue

        img_height = sum(slice_.height for slice_ in slices)
        img_width = max(slice_.width for slice_ in slices)
        canvas = Image.new("RGB", (img_width, img_height))

        curr_y = 0
        for slice_ in slices:
            canvas.paste(slice_, (0, curr_y))
            curr_y += slice_.height

        sections.append(cap_whitespace_from_canvas(erase_horizontal_lines(canvas)))
        # sections.append(cap_whitespace_from_canvas(canvas))

    return sections

def doc_to_img(doc: Document, dpi: int = 200) -> Image.Image:
    pixmaps = []
    widths, heights = [], []
    for page in doc:
        pix = page.get_pixmap(dpi=dpi, alpha=False)
        pixmaps.append(pix)
        widths.append(pix.width)
        heights.append(pix.height)

    W = max(widths)
    H = sum(heights)
    canvas = Image.new("RGB", (W, H))

    y = 0
    for pix in pixmaps:
        img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
        canvas.paste(img, (0, y))
        y += pix.height

    return canvas 

def generate_questions_answers_from_test(test_dir: Path, full=False):
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

    if len(questions_bounds) <= 1 and not full:
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
        elif not full:
            raise Exception(f"Test {test_id} has a shorter test.pdf than answers.pdf")
    else:
        if answers_bounds is None:
            raise Exception(f"Test {test_id} has neither answers.pdf nor answers attatched to the end of its test.pdf")
        else:   
            answers_doc = test_doc
            answers_undesirables_bounds = test_undesirables_bounds

    if len(answers_bounds) != len(questions_bounds) and not full:
        raise Exception(f"There are {len(questions_bounds)} questions and {len(answers_bounds)} answers in test {test_id}")
    
    processed_test_dir = PROCESSED_DIR / test_id
    processed_test_dir.mkdir(parents=True, exist_ok=False)

    shutil.copy(metadata_json, processed_test_dir / "metadata.json")

    if full and answers_pdf_exists:
        questions_img = doc_to_img(test_doc)
        questions_img.save(processed_test_dir / "questions.png")
        answers_img = doc_to_img(answers_doc)
        answers_img.save(processed_test_dir / "answers.png")

    question_images = slice_doc(test_doc, questions_bounds, test_undesirables_bounds)

    for q, question_image in enumerate(question_images):
        question_dir = processed_test_dir / f"Q{q + 1}"
        question_dir.mkdir(exist_ok=False)

        question_image.save(question_dir / "question.png")

    answer_images = slice_doc(answers_doc, answers_bounds, answers_undesirables_bounds)

    for q, answer_image in enumerate(answer_images):
        question_dir = processed_test_dir / f"Q{q + 1}"
        question_dir.mkdir(exist_ok=True)

        answer_image.save(question_dir / "answer.png")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-parse", type=str, required=False, default=None)
    parser.add_argument("-testId", type=str, required=False, default=None)
    parser.add_argument("-full", type=bool, required=False, default=False)
    args = parser.parse_args()

    if args.parse is not None and args.testId is not None:
        raise Exception("You must provide parse or testId. Not both.")
    elif args.parse is None and args.testId is None:
        raise Exception("You must provide parse or testId. Not neither.")
    elif args.testId is not None:
        generate_questions_answers_from_test(RAW_DIR / args.testId, full=args.full)
    else:
        tests_to_parse_num = None
        if args.parse != "all":
            if args.parse.isdigit() and int(args.parse) > 0:
                tests_to_parse_num = int(args.parse)
            else:
                raise Exception("parse must be 'all' or an integer")
            

        parsed_tests_num, err_tests_num = 0, 0

        tests_num = len(list(RAW_DIR.iterdir())) - len(list(ARCHIVE_DIR.iterdir()))

        for f, folder in enumerate(RAW_DIR.iterdir()):
            if (ARCHIVE_DIR / folder.name).exists():
                continue

            if json.loads((folder / "metadata.json").read_text())["class"] == "MATH 126":
                continue

            try:
                generate_questions_answers_from_test(folder, full=args.full)
                parsed_tests_num += 1
            except Exception as e:
                err_tests_num += 1

            if tests_to_parse_num is None:
                print(f"{parsed_tests_num} parsed vs. {err_tests_num} errors, ({parsed_tests_num + err_tests_num}/{tests_num})")
            else:
                print(f"{parsed_tests_num}/{tests_to_parse_num} parsed vs. "
                    f"{err_tests_num} errors, ({parsed_tests_num + err_tests_num}/{tests_num})")

                if parsed_tests_num == tests_to_parse_num:
                    break
                