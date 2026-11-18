import json

with open(r'C:\Users\krish\Desktop\rajastha\suprr-selector\frontend\src\data\rr_logo_paths.json', 'r') as f:
    data = json.load(f)

svg_lines = [
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{data["viewBox"]}" width="556" height="600" style="background:#e50693;">',
    '<g fill="#ffffff" fill-rule="evenodd" stroke="#ffffff" stroke-width="1">'
]

for p in data['paths']:
    svg_lines.append(f'  <path d="{p["d"]}" />')

svg_lines.append('</g>')
svg_lines.append('</svg>')

output_path = r'C:\Users\krish\Desktop\rajastha\suprr-selector\frontend\public\test_logo.svg'
with open(output_path, 'w') as f:
    f.write('\n'.join(svg_lines))

print('Wrote test_logo.svg successfully')

