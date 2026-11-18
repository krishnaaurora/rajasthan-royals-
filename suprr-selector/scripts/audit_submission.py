import pandas as pd
import json

mapping = pd.read_csv('6af458274c1e8_data_pack/Data Pack/competition_team_player_mapping.csv')
with open('suprr-selector/data/processed/top10_batters.json') as f:
    batters = json.load(f)
with open('suprr-selector/data/processed/top10_bowlers.json') as f:
    bowlers = json.load(f)

print('=== AUDIT TOP 10 BATTERS ===')
for b in batters:
    match = mapping[mapping['player_id'] == b['id']]
    canonical_name = match['player_name'].iloc[0] if len(match) > 0 else 'NOT FOUND'
    teams = match['team_name'].unique().tolist() if len(match) > 0 else []
    print(f"Rank #{b['rank']}: ID={b['id']} | Name='{b['name']}' | Canonical='{canonical_name}' | Match={b['name'] == canonical_name} | Teams={teams[:2]}")

print('\n=== AUDIT TOP 10 BOWLERS ===')
for bw in bowlers:
    match = mapping[mapping['player_id'] == bw['id']]
    canonical_name = match['player_name'].iloc[0] if len(match) > 0 else 'NOT FOUND'
    teams = match['team_name'].unique().tolist() if len(match) > 0 else []
    print(f"Rank #{bw['rank']}: ID={bw['id']} | Name='{bw['name']}' | Canonical='{canonical_name}' | Match={bw['name'] == canonical_name} | Teams={teams[:2]}")
