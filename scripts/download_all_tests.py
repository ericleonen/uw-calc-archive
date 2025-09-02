from bs4 import BeautifulSoup
import requests
import urllib.parse
import uuid
import os

def download_test(test: dict):
    test_id = str(uuid.uuid4())
    dir_path = f"data/raw/{test_id}/"

    print(f"Downloading test (ID: {test_id}) to {dir_path}")

    os.makedirs(dir_path, exist_ok=True)

    print(f"  > Downloading test PDF:", end=" ")
    test_pdf_res = requests.get(test["test_pdf"])
    test_pdf_res.raise_for_status()

    with open(dir_path + "test.pdf", "wb") as f:
        f.write(res.content)

    for key in ["test_pdf", "answers_pdf"]:
        if key not in test:
            continue

        url = test[key]
        filename = f"tests/{test['class']}_{key}.pdf"

        print(f"Downloading {url} to {filename}...")

        res = requests.get(url)
        res.raise_for_status()

        with open(filename, "wb") as f:
            f.write(res.content)

def download_tests_from_archive(
    archive_url: str, 
    class_: str,
    test_type: str
):
    # Get soup of archive page
    archive_res = requests.get(archive_url)
    archive_res.raise_for_status()

    archive_soup = BeautifulSoup(archive_res.content)
        
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

        if "test" in test:
            download_test(test)