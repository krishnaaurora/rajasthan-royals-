with open('suprr-selector/scripts/generate_submission_pdf.js', encoding='utf-8') as f:
    text = f.read()

import re
sec5_pos = text.find('Supervised ML Model Architecture')
sec7_pos = text.find('Official Unstop Submission')

print("Sec 5 preview:\n", text[sec5_pos:sec5_pos+1000])
print("\n" + "="*50 + "\n")
print("Sec 7 preview:\n", text[sec7_pos:sec7_pos+1000])
