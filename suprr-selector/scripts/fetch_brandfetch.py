import urllib.request
import re

url = 'https://brandfetch.com/rajasthanroyals.com'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8')
    matches = re.findall(r'https://asset\.brandfetch\.io/[a-zA-Z0-9_\-\./]+', html)
    print('Found asset matches:', len(matches))
    for m in set(matches)[:10]:
        print(m)
except Exception as e:
    print('Error:', e)

