from pathlib import Path
import json
import re

RAW_DIR = Path("data/raw")
PROCESSED_DIR = Path("data/processed")

QUARTER_MAP = {
    "autumn": "Autumn", "aut": "Autumn", "au": "Autumn", "a": "Autumn",
    "winter": "Winter", "win": "Winter", "wi": "Winter", "w": "Winter",
    "spring": "Spring", "spr": "Spring", "sp": "Spring",
    "summer": "Summer", "sum": "Summer", "su": "Summer"
}

QUARTER_YEAR_PATTERN = re.compile(
    r"(?i)(?P<quarter>autumn|winter|spring|summer|aut|spr|win|sum|au|sp|wi|su|a|w)[ _-]?(?P<year>\d{2}|\d{4})"
)

def normalize_year(y: str) -> int:
    y = int(y)
    return 2000 + y if y < 100 else y

def normalize_quarter(q: str) -> str:
    q_lower = q.lower()
    # collapse single/duplicate tokens (e.g., "sp" appears twice in the set)
    if q_lower in QUARTER_MAP:
        return QUARTER_MAP[q_lower]
    # special-case two-letter “sp”/“su”
    if q_lower in ("sp", "su"):
        return QUARTER_MAP[q_lower]
    return q_lower  # fallback (shouldn’t really happen)

def date_test(test_id: str) -> bool:
    test_path = RAW_DIR / test_id

    # Try to find quarter + year in test pdf name
    metadata_path = test_path / "metadata.json"
    metadata = json.loads(metadata_path.read_text())
    test_pdf_url = metadata["test_pdf"]

    if "quarter" in metadata:
        # test is already dated
        return True
    else:
        quarter_year_match = QUARTER_YEAR_PATTERN.search(test_pdf_url)
        if quarter_year_match:
            quarter = normalize_quarter(quarter_year_match.group("quarter"))
            year = normalize_year(quarter_year_match.group("year"))
            
            metadata["quarter"] = f"{quarter} {year}"

            with open(metadata_path, "w") as metadata_json:
                json.dump(metadata, metadata_json)

            metadata_path_processed = PROCESSED_DIR / test_id / "metadata.json"
            if metadata_path_processed.exists():
                with open(metadata_path_processed, "w") as metadata_json:
                    json.dump(metadata, metadata_json)

            return True

    return False

if __name__ == "__main__":
    tests_dated_num = 0
    total_tests_num = len(list(RAW_DIR.iterdir()))

    for test_dir in RAW_DIR.iterdir():
        if date_test(test_dir.name):
            tests_dated_num += 1
        
    print(f"{tests_dated_num}/{total_tests_num} tests successfully dated.")