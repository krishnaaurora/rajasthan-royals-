import json

with open('suprr-selector/frontend/src/data/app_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("Keys in batter[0]:", list(data['batters'][0].keys()))
print("\nTilak Varma sample:")
for k, v in data['batters'][0].items():
    if not isinstance(v, (dict, list)):
        print(f"  {k}: {v}")
    elif isinstance(v, dict):
        print(f"  {k}: dict with {len(v)} keys -> {list(v.keys())[:5]}")

if 'scenarios' in data:
    print("\nScenarios keys:", list(data['scenarios'].keys()))
if 'simulations' in data:
    print("\nSimulations keys:", list(data['simulations'].keys()))
