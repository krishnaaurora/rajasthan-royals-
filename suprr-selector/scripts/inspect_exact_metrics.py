import json

with open('suprr-selector/data/processed/top10_batters.json') as f:
    batters = json.load(f)
with open('suprr-selector/data/processed/top10_bowlers.json') as f:
    bowlers = json.load(f)

print("=== VALIDATED SOURCE OF TRUTH: TOP 10 BATTERS ===")
for b in batters:
    m = b['metrics_summary']
    print(f"#{b['rank']:2d} {b['name']} (ID: {b['id']}) | PRI: {b['pri_score']} | HP_SR: {m['hp_sr']} | Base_SR: {m['norm_sr']} | Delta: {m['sr_delta']} | HP_WPA: {m['hp_wpa']} | Balls: {m['hp_balls']}")

print("\n=== VALIDATED SOURCE OF TRUTH: TOP 10 BOWLERS ===")
for bw in bowlers:
    m = bw['metrics_summary']
    print(f"#{bw['rank']:2d} {bw['name']} (ID: {bw['id']}) | PRI: {bw['pri_score']} | HP_Econ: {m['hp_econ']} | Base_Econ: {m['norm_econ']} | Delta: {m['econ_delta']} | HP_WPA: {m['hp_wpa']} | Wkts: {m['hp_wkts']} | Balls: {m['hp_balls']}")
