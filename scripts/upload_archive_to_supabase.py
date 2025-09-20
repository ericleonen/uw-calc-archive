import os, json, mimetypes, concurrent.futures
from dotenv import load_dotenv
from supabase import create_client, Client
from tqdm import tqdm
from pathlib import Path

load_dotenv()
URL = os.environ["SUPABASE_URL"]
KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

supabase: Client = create_client(URL, KEY)

def upload_file(local_path: Path, storage_path: str):
    ctype = mimetypes.guess_type(local_path.name)[0] or "application/octet-stream"

    with open(local_path, "rb") as file:
        supabase.storage \
            .from_("archive") \
            .upload(
                file=file,
                path=storage_path,
                file_options={"cache-control": "3600", "upsert": "true", "content-type": ctype}
            )

def upload_archive(archive_dir: Path):
    paths = [
        p for p in archive_dir.rglob("*")
        if p.is_file() and not p.name == "metadata.json"
    ]

    if not paths:
        print("Nothing to upload.")
        return
    
    errors = []

    with concurrent.futures.ThreadPoolExecutor(max_workers=32) as executor:
        with tqdm(total=len(paths), desc="Uploading .png's", unit="file") as pbar:
            fut_to_path = {}
            for p in paths:
                storage_path = p.relative_to(archive_dir).as_posix()
                fut = executor.submit(upload_file, p, storage_path)
                fut_to_path[fut] = (p, storage_path)

            for fut in concurrent.futures.as_completed(fut_to_path):
                try:
                    fut.result()
                except Exception as e:
                    local, dest = fut_to_path[fut]
                    errors.append((local, dest, e))
                finally:
                    pbar.update(1)

    if errors:
        print(f"\n{len(errors)} errors during upload:")
        for local, dest, e in errors[:10]:
            print(f"  - {local} -> {dest}: {e}")
        if len(errors) > 10:
            print(f"  ... and {len(errors) - 10} more")

def get_test_question_rows(archive_dir: Path):
    test_rows = []
    question_rows = []

    for test_dir in archive_dir.iterdir():
        if not test_dir.is_dir():
            continue

        test_metadata = json.loads((test_dir / "metadata.json").read_text())
        quarter_items = test_metadata["quarter"].split(" ")
        
        test_row = {
            "id": test_metadata["id"],
            "class": test_metadata["class"],
            "exam": test_metadata["type"],
            "test_pdf": test_metadata["test_pdf"],
            "answers_pdf": test_metadata["answers_pdf"],
            "archive_url": test_metadata["archive_url"],
            "year": int(quarter_items[1]),
            "quarter": quarter_items[0]
        }

        test_rows.append(test_row)

        for question_dir in test_dir.iterdir():
            if not question_dir.is_dir():
                continue

            question_metadata = json.loads((question_dir / "metadata.json").read_text())
            
            question_row = {
                "test_id": test_metadata["id"],
                "number": int(question_dir.name[1:]),
                "topics": question_metadata["topics"]
            }

            question_rows.append(question_row)

    return test_rows, question_rows

def chunked(iterable, size):
    for i in range(0, len(iterable), size):
        yield iterable[i:i+size]

def upsert_rows(table: str, rows: list):
    for batch in tqdm(list(chunked(rows, 500)), desc=f"Upserting {table}"):
        supabase.table(table).upsert(batch).execute()

if __name__ == "__main__":
    upload_archive(Path("data/archive").resolve())

    test_rows, question_rows = get_test_question_rows(Path("data/archive"))

    upsert_rows("tests", test_rows)
    upsert_rows("questions", question_rows)