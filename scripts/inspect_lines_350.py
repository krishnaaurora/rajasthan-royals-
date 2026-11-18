with open('suprr-selector/scripts/generate_submission_pdf.js', encoding='utf-8') as f:
    lines = f.readlines()

print("Lines 350-480:")
for i in range(349, min(480, len(lines))):
    print(lines[i], end="")
