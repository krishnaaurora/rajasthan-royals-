with open(r'C:\Users\krish\Desktop\rajastha\suprr-selector\frontend\public\official_rr_logo.svg', 'r', encoding='utf-8') as f:
    text = f.read()

print('Length:', len(text))
# Let's inspect where paths are defined
import xml.etree.ElementTree as ET
tree = ET.parse(r'C:\Users\krish\Desktop\rajastha\suprr-selector\frontend\public\official_rr_logo.svg')
root = tree.getroot()
for i, elem in enumerate(root.iter()):
    if elem.tag.endswith('path'):
        print(f"Index {i}: len(d)={len(elem.attrib.get('d', ''))}")

