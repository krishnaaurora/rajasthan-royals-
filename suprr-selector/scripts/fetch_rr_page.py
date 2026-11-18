import urllib.request
import re

url = 'https://en.wikipedia.org/wiki/Rajasthan_Royals'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8')
    
    # look for logo image in infobox
    matches = re.findall(r'src="([^"]+Rajasthan_Royals[^"]+)"', html)
    print('Found logo matches:', matches)
    for m in matches:
        print('Match:', m)
except Exception as e:
    print('Error:', e)

