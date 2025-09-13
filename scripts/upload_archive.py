from pathlib import Path
import os, mimetypes, concurrent.futures
import boto3
from dotenv import load_dotenv

load_dotenv()

ACCOUNT_ID = os.getenv("R2_ACCOUNT_ID")
ACCESS_KEY = os.getenv("R2_ACCESS_KEY_ID")
SECRET_KEY = os.getenv("R2_SECRET_ACCESS_KEY")
BUCKET = os.getenv("R2_BUCKET")
ENDPOINT = f"https://{ACCOUNT_ID}.r2.cloudflarestorage.com"

s3 = boto3.client(
    "s3",
    endpoint_url=ENDPOINT,
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY,
    region_name="auto",
)

def upload_file(root: Path, file_path: Path):
    rel = file_path.relative_to(root).as_posix()
    key = f"{root.name}/{rel}"
    ctype, _ = mimetypes.guess_type(str(file_path))
    extra = {
        "ContentType": ctype or "application/octet-stream",
        "CacheControl": "no-cache"
    }
    s3.upload_file(str(file_path), BUCKET, key, ExtraArgs=extra)
    
    return key

def upload_archive(archive_path_str: str):
    root = Path(archive_path_str).resolve()
    if not root.is_dir():
        raise SystemExit(f"Not a folder: {root}")

    paths = [p for p in root.rglob("*") if p.is_file() and not p.name == "metadata.json"]

    with concurrent.futures.ThreadPoolExecutor(max_workers=32) as ex:
        for key in ex.map(lambda p: upload_file(root, p), paths):
            print("uploaded:", key)
        
if __name__ == "__main__":
    import sys
    upload_archive(sys.argv[1])