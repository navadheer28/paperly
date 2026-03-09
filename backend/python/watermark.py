import sys
import fitz

def add_watermark(input_path, output_path, text, opacity, position, color):
    doc = fitz.open(input_path)
    opacity = float(opacity) / 100

    color_map = {
        'gray':   (0.6, 0.6, 0.6),
        'red':    (0.8, 0.1, 0.1),
        'blue':   (0.1, 0.3, 0.8),
        'green':  (0.1, 0.6, 0.2),
        'orange': (0.9, 0.4, 0.0),
    }
    rgb = color_map.get(color, (0.6, 0.6, 0.6))
    rgb = tuple(min(1.0, c + (1 - c) * (1 - opacity)) for c in rgb)

    for page in doc:
        w, h = page.rect.width, page.rect.height
        fontsize = min(w, h) * 0.07
        text_len = len(text) * fontsize * 0.5

        if position == 'diagonal':
            # Use 0 rotation but place diagonally using position
            pos = fitz.Point((w - text_len) / 2, h / 2)
            angle = 0
        elif position == 'top':
            pos = fitz.Point((w - text_len) / 2, 80)
            angle = 0
        elif position == 'bottom':
            pos = fitz.Point((w - text_len) / 2, h - 50)
            angle = 0
        else:  # center
            pos = fitz.Point((w - text_len) / 2, h / 2)
            angle = 0

        page.insert_text(
            pos,
            text,
            fontsize=fontsize,
            color=rgb,
            rotate=angle,
            overlay=True
        )

    doc.save(output_path)
    doc.close()
    print("Watermark added successfully")

if __name__ == '__main__':
    color = sys.argv[6] if len(sys.argv) > 6 else 'gray'
    add_watermark(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], color)