import xml.etree.ElementTree as ET

tree = ET.parse(r'C:\Users\krish\Desktop\rajastha\suprr-selector\frontend\public\official_rr_logo.svg')
root = tree.getroot()
print('ViewBox:', root.attrib.get('viewBox'))

# namespace
ns = {'svg': 'http://www.w3.org/2000/svg'}
paths = root.findall('.//svg:path', ns)
if not paths:
    paths = root.findall('.//path')

print('Total paths:', len(paths))
for i, p in enumerate(paths):
    cls = p.attrib.get('class', '')
    fill = p.attrib.get('fill', '')
    d = p.attrib.get('d', '')
    print(f"Path {i}: class='{cls}', fill='{fill}', d_len={len(d)}, d_preview={d[:40]}")

