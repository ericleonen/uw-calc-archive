from bs4 import BeautifulSoup
import requests
import urllib.parse
import uuid
import os
import json
import pandas as pd

def download_test(test: dict):
    test_id = str(uuid.uuid4())
    dir_path = f"data/raw/{test_id}/"

    print(f"Downloading test to {dir_path}")

    os.makedirs(dir_path, exist_ok=True)

    print(f" > Downloading test PDF")
    test_pdf_res = requests.get(test["test_pdf"])
    test_pdf_res.raise_for_status()

    with open(dir_path + "test.pdf", "wb") as f:
        f.write(test_pdf_res.content)

    if "answers_pdf" in test:
        print(f" > Downloading answers PDF")

        try:
            answers_pdf_res = requests.get(test["answers_pdf"])
            answers_pdf_res.raise_for_status()

            with open(dir_path + "answers.pdf", "wb") as f:
                f.write(answers_pdf_res.content)
        except Exception as e:
            print(e)

    print(f" > Generating metadata")
    metadata = {
        "id": test_id,
        "class": test["class"],
        "type": test["type"]
    }

    with open(dir_path + "metadata.json", "w") as f:
        json.dump(metadata, f)

def download_tests_from_archive(
    archive_url: str, 
    class_: str,
    test_type: str
):
    # Get soup of archive page
    archive_res = requests.get(archive_url)
    archive_res.raise_for_status()

    archive_soup = BeautifulSoup(archive_res.content, "html5lib")
        
    # Get base URL for downloading tests
    archive_base = archive_url[:archive_url.rfind("/") + 1]

    archive_base_elem = archive_soup.find("base")
    if archive_base_elem is not None:
        archive_base = urllib.parse.urljoin(archive_url, archive_base_elem["href"])

    # Find and download test links
    for tr_elem in archive_soup.find_all("tr"):
        test = {
            "class": class_,
            "type": test_type
        }

        for a_elem in tr_elem.find_all("a"):
            href = a_elem.get("href", "")

            if not href.endswith(".pdf"):
                continue

            for key in ["test_pdf", "answers_pdf"]:
                if key not in test:
                    has_http = href.startswith("http")
                    test[key] = href if has_http else archive_base + href
                    break

        if "test_pdf" in test:
            download_test(test)

if __name__ == "__main__":
    test_archives = pd.read_excel("data/test_archives.xlsx")

    for _, archive in test_archives.iterrows():
        print(f"--- Reading from archive {archive.url} ---")
        download_tests_from_archive(
            archive_url=archive.url,
            class_=archive["class"],
            test_type=archive.type
        )