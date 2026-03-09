import sys
from docx2pdf import convert

def word_to_pdf(input_path, output_path):
    convert(input_path, output_path)
    print("Converted successfully")

if __name__ == '__main__':
    word_to_pdf(sys.argv[1], sys.argv[2])