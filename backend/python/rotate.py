import sys
import json
import fitz

def rotate_pdf(input_path, output_path, degrees_input):
    doc = fitz.open(input_path)
    
    # Check if it's a JSON object (per-page rotations) or a single number
    try:
        page_rotations = json.loads(degrees_input)
        # Per-page rotation mode
        for i, page in enumerate(doc):
            if str(i) in page_rotations:
                current = page.rotation
                new_rotation = (current + page_rotations[str(i)]) % 360
                page.set_rotation(new_rotation)
    except (json.JSONDecodeError, TypeError):
        # All pages rotation mode
        degrees = int(degrees_input)
        for page in doc:
            page.set_rotation(degrees)
    
    doc.save(output_path)
    doc.close()
    print("Rotated successfully")

if __name__ == '__main__':
    rotate_pdf(sys.argv[1], sys.argv[2], sys.argv[3])