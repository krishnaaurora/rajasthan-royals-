with open('suprr-selector/scripts/generate_submission_pdf.js', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'dhoni' in line.lower():
        print(f"Line {i+1}: {line.strip()}")
