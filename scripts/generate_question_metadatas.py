from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv
import os, base64, json, time, argparse
from pydantic import BaseModel
from typing import Literal, Any
from PIL import Image
import io
import shutil

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

ARCHIVE_DIR = Path("data/archive")
PROCESSED_DIR = Path("data/processed")

class QuestionMetadata(BaseModel):
    question_short: str
    answer_strategy: str
    difficulty: Literal[0, 1, 2]

class QuestionMetadataMATH124(QuestionMetadata):
    topics: list[Literal[
        "Tangent Lines",
        "Parametric Equations",
        "Limits",
        "Continuity",
        "Asymptotes",
        "Basic Derivatives",
        "Definition of a Derivative",
        "Product Rule",
        "Quotient Rule",
        "Chain Rule",
        "Trignometric Derivatives",
        "Exponential and Logarithmic Derivatives",
        "L'Hopital's Rule",
        "Implicit Differentiation",
        "Related Rates",
        "Linear Approximations",
        "Critical and Inflection Points",
        "Optimization",
        "Trigonometry",
        "Curve Sketching"
    ]]

class QuestionMetadataMATH125(QuestionMetadata):
    topics: list[Literal[
        "Indefinite Integrals",
        "Definite Integrals",
        "Basic Integrals",
        "Integrals by Substitution",
        "Integration by Parts",
        "Trigonometric Integrals",
        "Trigonometric Substitution",
        "Partial Fractions",
        "Improper Integrals",
        "Area Under/Between Curves",
        "Kinematics",
        "Work",
        "Numerical Integration",
        "Riemann Sums",
        "Fundamental Theorem of Calculus",
        "Volume by Disks/Washers",
        "Volume by Cylindrical Shells",
        "Average Value of a Function",
        "Arc Length",
        "Center of Mass",
        "Differential Equations"
    ]]

class QuestionMetadataMATH126(QuestionMetadata):
    topics: list[Literal[
        "Vector Operations",
        "3D Lines/Planes",
        "Quadric/Conic Surfaces",
        "Parameterized Curves",
        "Arc Length",
        "Curvature",
        "Tangent/Normal/Binormal Vectors",
        "Polar Coordinates",
        "Polar Curves",
        "Two-Variable Functions",
        "Partial Derivatives",
        "Tangent Planes",
        "Linear Approximations",
        "Gradients",
        "Critical Points",
        "Optimization",
        "Multivariable Riemann Sums",
        "Iterated Integrals",
        "Polar Form Integrals",
        "Center of Mass",
        "Taylor Series",
    ]]

SYSTEM_MSG = (
    "You extract metadata from calculus question/answer images. "
    "Write the question idea, not exact equations, briefly (ignore number/points). "
    "Summarize solution strategy in ~3 sentences (no full solution). "
    "Rate difficulty: 0=easy, 1=medium, 2=hard. "
    "List relevant topics from schema only."
)

USER_INSTRUCTIONS = (
    "Return ONLY JSON matching the schema. "
    "All string values must be ASCII only. Replace symbols with ASCII. No accents/diacritics. "
    "Input images: first=question, second=solution."
)

def get_b64_data_url(img_path: Path, max_size: int = 1200) -> str:
    """
    Grayscales and downscales a given image and then returns its base65 date URL.

    Parameters
    ----------
    img_path: Path
        Path to image.
    max_size: int, optional
        The maximum height or width to downscale to. Default 1200.

    Returns
    -------
    img_url: str
        The optimized data URL of the grayscaled and downscaled image.
    """
    mime = "image/png"

    with Image.open(img_path) as img:
        img = img.convert("L")
        img.thumbnail((max_size, max_size), Image.LANCZOS)

        buf = io.BytesIO()
        img.save(buf, format="PNG", optimize=True)
        b64 = base64.b64encode(buf.getvalue()).decode("utf-8")

    return f"data:{mime};base64,{b64}"

def generate_question_metadata(
    question_path: Path, 
    class_: Literal["MATH 124", "MATH 125", "MATH 126"], 
    max_retries: int = 2
) -> dict[str, Any]:
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
                text_format=(
                    QuestionMetadataMATH124 if class_ == "MATH 124" else
                    QuestionMetadataMATH125 if class_ == "MATH 125" else
                    QuestionMetadataMATH126
                ),
                input=[
                    {"role": "system", "content": SYSTEM_MSG},
                    {
                        "role": "user",
                        "content": [
                            {"type": "input_text", "text": USER_INSTRUCTIONS},
                            {"type": "input_image", "image_url": question_img_url},
                            {"type": "input_image", "image_url": answer_img_url},
                        ],
                    },
                ],
            )
            
            as_dict = resp.output_parsed.model_dump()
            return as_dict
        except Exception as e:
            if attempt == max_retries:
                raise e
            time.sleep(1.5 * attempt)

def write_metadata(question_path: Path, md: dict[str, Any]) -> Path:
    out_path = question_path / "metadata.json"
    out_path.write_text(json.dumps(md, ensure_ascii=False, indent=2))
    return out_path

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-testId", type=str, required=True)
    args = parser.parse_args()
    
    test_path = Path(__file__).resolve().parents[1] / PROCESSED_DIR / args.testId
    archive_path = Path(__file__).resolve().parents[1] / ARCHIVE_DIR / args.testId
    test_metadata_path = test_path / "metadata.json"
    class_ = json.loads(test_metadata_path.read_text(encoding="utf-8"))["class"]

    print(f"Generating question metadatas for test {args.testId}")

    for question_path in sorted(question_path for question_path in test_path.iterdir() if question_path.is_dir()):
        print(f"{question_path.name}:", end=" ")

        question_metadata = generate_question_metadata(question_path, class_)
        out = write_metadata(question_path, question_metadata)

        print("✅")

    shutil.move(str(test_path), str(archive_path))
