import json

with open('suprr-selector/frontend/src/data/app_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(json.dumps(data['batters'][0]['auction_strategy'], indent=2))
