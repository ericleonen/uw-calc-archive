from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv
import os, base64, json, time, argparse
from pydantic import BaseModel
from typing import Literal, Any

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

PROCESSED_DIR = Path("data/processed")

class QuestionMetadata(BaseModel):
    question_short: str
    diagrams: list[str]
    answer_strategy: str
    difficulty: Literal[0, 1, 2]

SYSTEM_MSG = (
    "You extract retrieval-friendly metadata from UW calculus question images. "
    "Transcribe math faithfully (prefer LaTeX). "
    "Capture the full idea of the question, but keep it short. Ignore the question number or points. "
    "For each diagram, describe it in a sentence. Each description is a separate list item. "
    "Summarize the strategy to get to the solution in ~3 sentences (no full solution). "
    "Rate difficulty (0 = easy, 1 = medium, 2 = hard) for an average freshman in calculus."
)
USER_INSTRUCTIONS = (
    "Return ONLY the JSON that matches the schema. "
    "Images: first is the question, second is the official solution/answer."
)

def get_b64_data_url(img_path: Path) -> str:
    mime = "image/png" if img_path.suffix.lower() == ".png" else "image/jpeg"
    b64 = base64.b64encode(img_path.read_bytes()).decode("utf-8")
    return f"data:{mime};base64,{b64}"

def generate_question_metadata(question_path: Path, max_retries: int = 2) -> dict[str, Any]:
    question_img_path = question_path / "question.png"
    answer_img_path = question_path / "answer.png"
    if not question_img_path.exists() or not answer_img_path.exists():
        raise FileNotFoundError("Missing question.png or answer.png")

    question_img_url = get_b64_data_url(question_img_path)
    answer_img_url = get_b64_data_url(answer_img_path)

    for attempt in range(1, max_retries + 1):
        try:
            resp = client.responses.parse(
                model="gpt-4o-mini",
                temperature=0,
                text_format=QuestionMetadata,
                input=[
                    {"role": "system", "content": SYSTEM_MSG},
                    {
                        "role": "user",
                        "content": [
                            {"type": "input_text", "text": USER_INSTRUCTIONS},
                            # IMPORTANT: image_url is a STRING, not {"url": ...}
                            {"type": "input_image", "image_url": question_img_url},
                            {"type": "input_image", "image_url": answer_img_url},
                        ],
                    },
                ],
            )
            # You can use either output_parsed (Pydantic object) or output_text (JSON string)
            as_dict = resp.output_parsed.model_dump()  # validated dict
            return as_dict
        except Exception as e:
            if attempt == max_retries:
                raise
            time.sleep(1.5 * attempt)

def write_metadata(question_path: Path, md: dict[str, Any]) -> Path:
    out_path = question_path / "metadata.json"
    out_path.write_text(json.dumps(md, ensure_ascii=False, indent=2))
    return out_path

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-testId", type=str, required=True)
    parser.add_argument("-question", type=int, required=True)
    args = parser.parse_args()

    q_path = PROCESSED_DIR / args.testId / f"Q{args.question}"
    metadata = generate_question_metadata(q_path)
    out = write_metadata(q_path, metadata)
    print(f"Wrote {out}")
