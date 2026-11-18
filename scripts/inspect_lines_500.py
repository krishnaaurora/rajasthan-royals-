with open('suprr-selector/scripts/generate_submission_pdf.js', encoding='utf-8') as f:
    lines = f.readlines()

print("Lines 500-650:")
for i in range(499, min(650, len(lines))):
    print(lines[i], end="")
