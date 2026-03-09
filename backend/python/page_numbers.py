import sys
import fitz

def add_page_numbers(input_path, output_path, position, start_number, font_size):
    doc = fitz.open(input_path)
    start_number = int(start_number)
    font_size = float(font_size)

    for i, page in enumerate(doc):
        number = str(start_number + i)
        w, h = page.rect.width, page.rect.height
        margin = 30

        if position == 'top-left':
            pos = fitz.Point(margin, margin)
        elif position == 'top-center':
            pos = fitz.Point(w / 2 - 10, margin)
        elif position == 'top-right':
            pos = fitz.Point(w - margin - 20, margin)
        elif position == 'bottom-left':
            pos = fitz.Point(margin, h - margin)
        elif position == 'bottom-right':
            pos = fitz.Point(w - margin - 20, h - margin)
        else:  # bottom-center
            pos = fitz.Point(w / 2 - 10, h - margin)

        page.insert_text(
            pos,
            number,
            fontsize=font_size,
            color=(0, 0, 0),
            overlay=True
        )

    doc.save(output_path)
    doc.close()
    print("Page numbers added successfully")

if __name__ == '__main__':
    add_page_numbers(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5])