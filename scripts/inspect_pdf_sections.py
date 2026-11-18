with open('suprr-selector/scripts/generate_submission_pdf.js', encoding='utf-8') as f:
    text = f.read()

import re
sections = re.findall(r'<div class="header-left">\s*<div class="section-num">(\d+)</div>\s*<div class="section-title">(.*?)</div>', text)
print("Sections found:", len(sections))
for num, title in sections:
    print(f"Section {num}: {title}")
