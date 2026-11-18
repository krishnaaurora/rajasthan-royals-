with open('suprr-selector/scripts/generate_submission_pdf.js', encoding='utf-8') as f:
    lines = f.readlines()

print("Last 50 lines:")
for l in lines[-50:]:
    print(l, end="")
