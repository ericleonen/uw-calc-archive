from pathlib import Path
import json

ARCHIVE_DIR = Path("data/archive")

def index_archive():
    index = {}

    for test_dir in ARCHIVE_DIR.iterdir():
        if not test_dir.is_dir():
            continue

        test_metadata = json.loads((test_dir / "metadata.json").read_text())
        test_metadata["questions"] = []

        for question_dir in test_dir.iterdir():
            if not question_dir.is_dir():
                continue

            question_metadata = json.loads((question_dir / "metadata.json").read_text())

            test_metadata["questions"].append(question_metadata)

        index[test_dir.name] = test_metadata

    with open(ARCHIVE_DIR / "index.json", "w") as index_file:
        json.dump(index, index_file)

if __name__ == "__main__":
    index_archive()