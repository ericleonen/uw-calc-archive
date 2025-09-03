from pathlib import Path
import fitz
from PIL import Image
from fitz import Document

RAW_DIR = Path("data/raw")
PROCESSED_DIR = Path("data/processed")

NUMBERED_BLOCK_PREFIXES = ["_.", "problem _.", "question _.", "q_.", "_ ("]

def get_numbered_block_bounds(
    doc: Document, 
    margin: int = 4,
    look_for_pair: bool = False
) -> tuple[list, list | None]:
    curr_question_num = 1
    all_bounds_1, all_bounds_2 = [], [] if look_for_pair else None
    all_bounds = all_bounds_1

    for page_idx, page in enumerate(doc):
        dict_ = page.get_text("dict")

        page_height = page.rect.height

        for block in dict_["blocks"]:
            for line in block.get("lines", []):
                _, y0, _, _ = line["bbox"]
                line_text = "".join(span["text"] for span in line["spans"]).strip().lower()

                if any([
                    line_text.startswith(prefix.replace("_", str(curr_question_num))) 
                    for prefix in NUMBERED_BLOCK_PREFIXES
                ]):
                    if len(all_bounds) > 0:
                        all_bounds[-1]["end"] = {
                            "page_idx": page_idx,
                            "y": min(y0 + margin, page_height)
                        }

                    all_bounds.append({
                        "start": {
                            "page_idx": page_idx,
                            "y": max(y0 - margin, 0)
                        },
                        "end": {
                            "page_idx": doc.page_count - 1,
                            "y": doc[-1].rect.height
                        }
                    })
                    curr_question_num += 1
                elif look_for_pair and all_bounds is all_bounds_1 and len(all_bounds_1) > 1 and any([
                    line_text.startswith(prefix.replace("_", "1")) 
                    for prefix in NUMBERED_BLOCK_PREFIXES
                ]):
                    all_bounds = all_bounds_2
                    curr_question_num = 1
                    
                    all_bounds_1[-1]["end"] = {
                            "page_idx": page_idx,
                            "y": min(y0 + margin, page_height)
                        }
                    all_bounds.append({
                        "start": {
                            "page_idx": page_idx,
                            "y": max(y0 - margin, 0)
                        },
                        "end": None
                    })
                    curr_question_num += 1

    return all_bounds_1, all_bounds_2

def slice_doc_and_save(
    doc: Document, 
    all_bounds: list, 
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
        
        rect = fitz.Rect(0, y0, page_width, y1)
        pix = page.get_pixmap(clip=rect, dpi=dpi)

        return Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

    for bounds_idx, bounds in enumerate(all_bounds):
        slices = []
        curr_page_idx = bounds["start"]["page_idx"]

        while True:
            curr_page = doc[curr_page_idx]
            page_height = curr_page.rect.height

            if curr_page_idx == bounds["start"]["page_idx"] and curr_page_idx == bounds["end"]["page_idx"]:
                slices.append(get_slice(curr_page_idx, bounds["start"]["y"], bounds["end"]["y"]))
                break
            elif curr_page_idx == bounds["start"]["page_idx"]:
                slices.append(get_slice(curr_page_idx, bounds["start"]["y"], page_height))
            elif curr_page_idx == bounds["end"]["page_idx"]:
                slices.append(get_slice(curr_page_idx, 0, bounds["end"]["y"]))
                break
            else:
                slices.append(get_slice(curr_page_idx, 0, page_height))

            curr_page_idx += 1

        img_height = sum(slice_.height for slice_ in slices)
        img_width = max(slice_.width for slice_ in slices)
        canvas = Image.new("RGB", (img_width, img_height))

        curr_y = 0

        for slice_ in slices:
            canvas.paste(slice_, (0, curr_y))
            curr_y += slice_.height

        canvas.save(save_to_path / f"Q{bounds_idx + 1}.png")

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
    questions_bounds, answers_bounds = get_numbered_block_bounds(test_doc, look_for_pair=not answers_pdf_exists)

    if len(questions_bounds) <= 1:
        raise Exception(f"Only found {len(questions_bounds)} questions in test {test_id}")
    
    if answers_pdf_exists:
        answers_doc = fitz.open(str(answers_pdf))

        if answers_doc.page_count == test_doc.page_count:
            # answers are filled out in test
            answers_bounds = questions_bounds
        elif answers_doc.page_count < test_doc.page_count:
            # answers are compact
            answers_bounds, _ = get_numbered_block_bounds(answers_doc)
        else:
            raise Exception(f"Test {test_id} has a shorter test.pdf than answers.pdf")
    else:
        if answers_bounds is None:
            raise Exception(f"Test {test_id} has answers.pdf nor answers attatched to the end of its test.pdf")
        else:   
            answers_doc = test_doc
        
    processed_test_dir = PROCESSED_DIR / test_id    
    slice_doc_and_save(test_doc, questions_bounds, processed_test_dir / "questions")
    slice_doc_and_save(answers_doc, answers_bounds, processed_test_dir / "answers")
    
if __name__ == "__main__":
    for folder in RAW_DIR.iterdir():
        if folder.is_dir():
            generate_questions_answers_from_test(folder)
                