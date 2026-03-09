import sys
from pdf2docx import Converter

def pdf_to_word(input_path, output_path):
    cv = Converter(input_path)
    cv.convert(output_path, start=0, end=None)
    cv.close()
    print("Converted successfully")

if __name__ == '__main__':
    pdf_to_word(sys.argv[1], sys.argv[2])