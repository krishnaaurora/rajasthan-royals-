import xml.etree.ElementTree as ET
import re

tree = ET.parse(r'C:\Users\krish\Desktop\rajastha\suprr-selector\frontend\public\official_rr_logo.svg')
root = tree.getroot()

ns = {'svg': 'http://www.w3.org/2000/svg'}
paths = root.findall('.//svg:path', ns) or root.findall('.//path')

for i, p in enumerate(paths):
    d = p.attrib.get('d', '')
    # extract all numbers to get bounds
    nums = [float(x) for x in re.findall(r'[-+]?\d*\.?\d+', d)]
    # every pair of x, y approximately
    print(f"Path {i}: total numbers in d: {len(nums)}, d_length: {len(d)}")

# Let's save a clean React-friendly JSON or TS component with these 4 exact paths!

