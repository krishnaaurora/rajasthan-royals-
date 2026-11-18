import json

with open('suprr-selector/frontend/src/data/app_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('=== TOP 10 BATTERS ===')
for i, b in enumerate(data['batters'][:10]):
    balls = b.get('sample_balls') or b.get('hp_balls')
    delta = b.get('delta_sr') or b.get('sr_delta')
    wpa = b.get('hp_wpa')
    print(f"#{i+1}: {b['name']} (ID: {b['id']}) | Balls: {balls} | HP SR: {b['hp_sr']} | Base SR: {b['norm_sr']} | Delta: {delta} | PRI: {b['pri_score']} | Role: {b.get('role')} | Nat: {b.get('nationality')}")

print('\n=== TOP 10 BOWLERS ===')
for i, b in enumerate(data['bowlers'][:10]):
    balls = b.get('sample_balls') or b.get('hp_balls')
    delta = b.get('delta_econ') or b.get('econ_delta')
    wpa = b.get('hp_wpa')
    print(f"#{i+1}: {b['name']} (ID: {b['id']}) | Balls: {balls} | HP Econ: {b['hp_econ']} | Base Econ: {b['norm_econ']} | Delta: {delta} | PRI: {b['pri_score']} | Role: {b.get('role')} | Nat: {b.get('nationality')}")
