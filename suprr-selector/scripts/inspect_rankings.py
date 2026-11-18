import json

with open("suprr-selector/data/processed/top10_batters.json") as f:
    batters = json.load(f)
with open("suprr-selector/data/processed/top10_bowlers.json") as f:
    bowlers = json.load(f)

print("=== TOP 10 BATTERS (top10_batters.json) ===")
for b in batters[:10]:
    print(f"#{b.get('rank')} ID:{b.get('id')} {b.get('name')} | PRI: {b.get('pri_score')} | HP Balls: {b.get('hp_balls')} | HP SR: {b.get('hp_sr')} | Base SR: {b.get('baseline_sr')} | Delta: {b.get('sr_delta')}")

print("\n=== TOP 10 BOWLERS (top10_bowlers.json) ===")
for bw in bowlers[:10]:
    print(f"#{bw.get('rank')} ID:{bw.get('id')} {bw.get('name')} | PRI: {bw.get('pri_score')} | HP Balls: {bw.get('hp_balls')} | HP Econ: {bw.get('hp_econ')} | Base Econ: {bw.get('baseline_econ')} | Delta: {bw.get('econ_delta')}")
