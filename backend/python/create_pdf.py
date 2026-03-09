import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer

def create_pdf(content_file, output_path):
    with open(content_file, 'r', encoding='utf-8-sig', errors='ignore') as f:
        content = f.read()

    doc = SimpleDocTemplate(output_path, pagesize=A4,
                            rightMargin=72, leftMargin=72,
                            topMargin=72, bottomMargin=72)

    styles = getSampleStyleSheet()
    story = []

    for line in content.split('\n'):
        line = line.strip()
        if not line:
            story.append(Spacer(1, 12))
        elif line.startswith('# '):
            story.append(Paragraph(line[2:], styles['Title']))
            story.append(Spacer(1, 12))
        elif line.startswith('## '):
            story.append(Paragraph(line[3:], styles['Heading2']))
            story.append(Spacer(1, 8))
        elif line.startswith('- ') or line.startswith('* '):
            story.append(Paragraph('• ' + line[2:], styles['Normal']))
            story.append(Spacer(1, 4))
        else:
            story.append(Paragraph(line, styles['Normal']))
            story.append(Spacer(1, 4))

    doc.build(story)
    print("PDF created successfully")

if __name__ == '__main__':
    create_pdf(sys.argv[1], sys.argv[2])