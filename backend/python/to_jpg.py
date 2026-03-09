import sys
import os
import fitz

def pdf_to_jpg(input_path, output_dir, quality):
    dpi_map = {'low': 72, 'medium': 150, 'high': 300}
    dpi = dpi_map.get(quality, 150)
    zoom = dpi / 72
    mat = fitz.Matrix(zoom, zoom)

    doc = fitz.open(input_path)
    for i in range(len(doc)):
        page = doc[i]
        pix = page.get_pixmap(matrix=mat)
        pix.save(f"{output_dir}page_{i+1}.jpg")
    doc.close()
    print("Converted successfully")

if __name__ == '__main__':
    pdf_to_jpg(sys.argv[1], sys.argv[2], sys.argv[3])