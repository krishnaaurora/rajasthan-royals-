import urllib.request
import re

url = 'https://en.wikipedia.org/wiki/File:Rajasthan_Royals_Logo.svg'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8')
    
    # look for upload.wikimedia.org link
    matches = re.findall(r'(https://upload\.wikimedia\.org/wikipedia/en/[^"\']+\.svg)', html)
    if not matches:
        matches = re.findall(r'(//upload\.wikimedia\.org/wikipedia/en/[^"\']+\.svg)', html)
        matches = ['https:' + m for m in matches]
    
    print('Found matches:', matches)
    if matches:
        svg_url = matches[0]
        print('Downloading SVG from:', svg_url)
        svg_req = urllib.request.Request(svg_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(svg_req) as svg_resp:
            svg_data = svg_resp.read().decode('utf-8')
        with open(r'C:\Users\krish\Desktop\rajastha\suprr-selector\frontend\public\official_rr_logo.svg', 'w', encoding='utf-8') as f:
            f.write(svg_data)
        print('Saved official_rr_logo.svg successfully, length:', len(svg_data))
except Exception as e:
    print('Error:', e)

