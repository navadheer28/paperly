import sys
import fitz

def protect_pdf(input_path, output_path, password):
    doc = fitz.open(input_path)
    perm = fitz.PDF_PERM_PRINT | fitz.PDF_PERM_COPY
    doc.save(
        output_path,
        encryption=fitz.PDF_ENCRYPT_AES_256,
        user_pw=password,
        owner_pw=password + "_owner",
        permissions=perm
    )
    doc.close()
    print("Protected successfully")

if __name__ == '__main__':
    protect_pdf(sys.argv[1], sys.argv[2], sys.argv[3])