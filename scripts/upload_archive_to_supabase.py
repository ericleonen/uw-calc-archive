import os, json, mimetypes, concurrent.futures
from dotenv import load_dotenv
from supabase import create_client, Client
from tqdm import tqdm
from pathlib import Path
import time
import random

load_dotenv()
URL = os.environ["SUPABASE_URL"]
KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

supabase: Client = create_client(URL, KEY)

def object_exists(storage_path: str) -> bool:
    """
    Check if object already exists in the bucket by listing its parent folder.
    Works without downloading the file.
    """
    from posixpath import dirname, basename
    folder = dirname(storage_path)
    filename = basename(storage_path)
    # list() with folder path; some SDKs support 'search=filename'
    try:
        entries = supabase.storage.from_("archive").list(path=folder or "")
    except Exception:
        # If list fails (e.g., folder missing), treat as not existing
        return False
    return any(getattr(e, "name", None) == filename or (isinstance(e, dict) and e.get("name") == filename)
               for e in entries)

def upload_file(local_path: Path, storage_path: str, retries: int = 5):
    # Skip if already present
    if object_exists(storage_path):
        return

    ctype = mimetypes.guess_type(local_path.name)[0] or "application/octet-stream"

    for attempt in range(1, retries + 1):
        try:
            with open(local_path, "rb") as f:
                supabase.storage.from_("archive").upload(
                    path=storage_path,
                    file=f,
                    # no overwrite — if it exists due to race, we'll catch/ignore 409
                    file_options={"cache-control": "31536000", "upsert": False, "content-type": ctype},
                )
            return
        except Exception as e:
            msg = str(e).lower()

            # ignore "already exists" conflicts from races
            if "conflict" in msg or "already exists" in msg or "409" in msg:
                return

            # don’t retry permission/auth errors
            if "unauthorized" in msg or "forbidden" in msg:
                raise

            if attempt == retries:
                raise

            # jittered exponential backoff
            time.sleep(min(2 ** attempt, 16) + random.uniform(0, 0.3))

def upload_archive(archive_dir: Path):
    paths = [
        p for p in archive_dir.rglob("*")
        if p.is_file() and not p.name == "metadata.json"
    ]

    if not paths:
        print("Nothing to upload.")
        return
    
    errors = []

    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
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