import json

with open('suprr-selector/frontend/src/data/app_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("Top level keys in app_data.json:", list(data.keys()))
for k in data.keys():
    if isinstance(data[k], list):
        print(f"  {k}: list with {len(data[k])} items")
    elif isinstance(data[k], dict):
        print(f"  {k}: dict with keys {list(data[k].keys())}")
    else:
        print(f"  {k}: {type(data[k])}")
