import sys
import fitz

def merge_pdfs(input_paths_str, output_path):
    input_paths = input_paths_str.split(',')
    merged = fitz.open()
    
    for path in input_paths:
        path = path.strip()
        doc = fitz.open(path)
        merged.insert_pdf(doc)
        doc.close()
    
    merged.save(output_path)
    merged.close()
    print("Merged successfully")

if __name__ == '__main__':
    merge_pdfs(sys.argv[1], sys.argv[2])