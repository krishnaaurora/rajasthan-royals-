import json
import pandas as pd

# Load pri_rankings_batters
df_bat = pd.read_parquet('suprr-selector/data/processed/pri_rankings_batters.parquet')

# Filter out MS Dhoni and other retired players from active rankings
RETIRED = {'Mahendra Singh Dhoni', 'MS Dhoni', 'Dinesh Karthik'}

# Mark is_retired
df_bat['is_retired'] = df_bat['name'].isin(RETIRED)
df_bat.to_parquet('suprr-selector/data/processed/pri_rankings_batters.parquet')

# Load app_data.json
with open('suprr-selector/frontend/src/data/app_data.json', 'r', encoding='utf-8') as f:
    app_data = json.load(f)

# Update batters list: exclude retired players (Dhoni) from active top rankings
active_batters = [b for b in app_data['batters'] if b['name'] not in RETIRED]

# Re-index ranks for active batters
for idx, b in enumerate(active_batters):
    b['rank'] = idx + 1

app_data['batters'] = active_batters

# Check unified shortlist - ensure no Dhoni
app_data['unified_shortlist'] = [p for p in app_data['unified_shortlist'] if p['name'] not in RETIRED]
for idx, p in enumerate(app_data['unified_shortlist']):
    p['rank'] = idx + 1

# Write back to app_data.json
with open('suprr-selector/frontend/src/data/app_data.json', 'w', encoding='utf-8') as f:
    json.dump(app_data, f, indent=2)

print(f"Updated app_data.json: {len(active_batters)} active batters remaining. MS Dhoni removed.")
print("Top 10 active batters now:")
for b in active_batters[:10]:
    print(f"  #{b['rank']} {b['name']} (HP SR: {b.get('hp_sr', '—')})")
