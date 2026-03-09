import sys
import fitz
from PIL import Image

def jpg_to_pdf(input_paths_str, output_path):
    input_paths = input_paths_str.split(',')
    doc = fitz.open()

    for img_path in input_paths:
        img_path = img_path.strip()
        img = Image.open(img_path)
        width, height = img.size
        # Convert to RGB if needed
        if img.mode != 'RGB':
            img = img.convert('RGB')
        img_path_jpg = img_path + '_converted.jpg'
        img.save(img_path_jpg, 'JPEG')

        page = doc.new_page(width=width, height=height)
        page.insert_image(page.rect, filename=img_path_jpg)

    doc.save(output_path)
    doc.close()
    print("Converted successfully")

if __name__ == '__main__':
    jpg_to_pdf(sys.argv[1], sys.argv[2])