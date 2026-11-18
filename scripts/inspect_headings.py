with open('suprr-selector/scripts/generate_submission_pdf.js', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'<h[1-4][^>]*>(.*?)</h[1-4]>', text)
print("Found h1-h4 tags:", len(matches))
for m in matches[:30]:
    print(" -", m[:80])
