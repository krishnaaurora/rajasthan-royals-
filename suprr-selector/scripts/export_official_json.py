import xml.etree.ElementTree as ET
import json

tree = ET.parse(r'C:\Users\krish\Desktop\rajastha\suprr-selector\frontend\public\official_rr_logo.svg')
root = tree.getroot()

view_box = root.attrib.get('viewBox', '-787.0 530.6 151.7 237.4')

ns = {'svg': 'http://www.w3.org/2000/svg'}
paths_elem = root.findall('.//svg:path', ns) or root.findall('.//path')

# Path 3: Crown finial (top)
# Path 1: Crown dome & RR Monogram (middle)
# Path 2: Text detail
# Path 0: RAJASTHAN ROYALS (bottom)
raw_paths = [
    {
        "id": "crown_top",
        "name": "Crown Finial",
        "d": paths_elem[3].attrib.get('d', ''),
        "delay": 0.0,
        "duration": 0.8
    },
    {
        "id": "crown_and_monogram",
        "name": "Crown & RR Monogram",
        "d": paths_elem[1].attrib.get('d', ''),
        "delay": 0.3,
        "duration": 1.6
    },
    {
        "id": "text_accent",
        "name": "Text Accent",
        "d": paths_elem[2].attrib.get('d', ''),
        "delay": 1.0,
        "duration": 0.6
    },
    {
        "id": "typography",
        "name": "Rajasthan Royals Typography",
        "d": paths_elem[0].attrib.get('d', ''),
        "delay": 1.1,
        "duration": 1.4
    }
]

data = {
    "viewBox": view_box,
    "paths": raw_paths
}

with open(r'C:\Users\krish\Desktop\rajastha\suprr-selector\frontend\src\data\official_rr_logo.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print('Saved official_rr_logo.json with 4 official paths!')

