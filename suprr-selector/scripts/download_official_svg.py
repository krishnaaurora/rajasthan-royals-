import urllib.request

url = 'https://upload.wikimedia.org/wikipedia/en/5/5c/This_is_the_logo_for_Rajasthan_Royals%2C_a_cricket_team_playing_in_the_Indian_Premier_League_%28IPL%29.svg'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

try:
    with urllib.request.urlopen(req) as resp:
        svg_text = resp.read().decode('utf-8')
    with open(r'C:\Users\krish\Desktop\rajastha\suprr-selector\frontend\public\official_rr_logo.svg', 'w', encoding='utf-8') as f:
        f.write(svg_text)
    print('SUCCESS! Downloaded official_rr_logo.svg, length:', len(svg_text))
except Exception as e:
    print('Error:', e)

