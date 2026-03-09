import sys
import fitz

def unlock_pdf(input_path, output_path, password):
    doc = fitz.open(input_path)
    if doc.is_encrypted:
        if not doc.authenticate(password):
            raise Exception("Wrong password!")
    doc.save(output_path, encryption=fitz.PDF_ENCRYPT_NONE)
    doc.close()
    print("Unlocked successfully")

if __name__ == '__main__':
    unlock_pdf(sys.argv[1], sys.argv[2], sys.argv[3])