import sys
import os
import fitz

def parse_ranges(pages_str, total_pages):
    pages = set()
    parts = pages_str.split(',')
    for part in parts:
        part = part.strip()
        if '-' in part:
            start, end = part.split('-')
            for i in range(int(start), int(end) + 1):
                pages.add(i - 1)
        else:
            pages.add(int(part) - 1)
    return sorted(p for p in pages if 0 <= p < total_pages)

def split_pdf(input_path, output_dir, pages='all'):
    doc = fitz.open(input_path)
    total = len(doc)

    if pages == 'all':
        page_list = list(range(total))
    else:
        page_list = parse_ranges(pages, total)

    for i in page_list:
        new_doc = fitz.open()
        new_doc.insert_pdf(doc, from_page=i, to_page=i)
        new_doc.save(f"{output_dir}page_{i+1}.pdf")
        new_doc.close()

    doc.close()
    print("Split successfully")

if __name__ == '__main__':
    split_pdf(sys.argv[1], sys.argv[2], sys.argv[3])