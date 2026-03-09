import sys
import fitz
import pytesseract
from PIL import Image
import io

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def ocr_pdf(input_path, output_path):
    doc = fitz.open(input_path)
    full_text = ''
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        
        text = page.get_text()
        
        if not text.strip():
            mat = fitz.Matrix(2, 2)
            pix = page.get_pixmap(matrix=mat)
            img = Image.open(io.BytesIO(pix.tobytes('png')))
            text = pytesseract.image_to_string(img)
        
        full_text += f"\n--- Page {page_num + 1} ---\n{text}"
    
    doc.close()
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(full_text)
    
    print(full_text)

if __name__ == '__main__':
    ocr_pdf(sys.argv[1], sys.argv[2])