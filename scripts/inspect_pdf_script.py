import re

with open('suprr-selector/scripts/generate_submission_pdf.js', encoding='utf-8') as f:
    text = f.read()

headers = re.findall(r'<div class="section-title">(.*?)</div>|<div class="header-left">\s*<div class="section-num">(.*?)</div>\s*<div class="section-title">(.*?)</div>', text)
print("Found headers:", len(headers))
for h in headers[:25]:
    print("Header:", h)

# Check if Dhoni is mentioned in the JS script
dhoni_count = text.lower().count("dhoni")
print("Dhoni mentions in generate_submission_pdf.js:", dhoni_count)
