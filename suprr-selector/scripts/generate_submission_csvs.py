import json
import pandas as pd

with open('suprr-selector/data/processed/top10_batters.json', encoding='utf-8') as f:
    batters = json.load(f)

with open('suprr-selector/data/processed/top10_bowlers.json', encoding='utf-8') as f:
    bowlers = json.load(f)

# Format Batters
b_rows = []
for b in batters:
    ms = b['metrics_summary']
    b_rows.append({
        'Rank': b['rank'],
        'Player ID': b['id'],
        'Player Name': b['name'],
        'PRI Score': b['pri_score'],
        'HP Balls Faced': ms['hp_balls'],
        'HP Runs Scored': ms['hp_runs'],
        'HP Dismissals': ms['hp_outs'],
        'HP Strike Rate': ms['hp_sr'],
        'Baseline Strike Rate': ms['norm_sr'],
        'SR Delta (Elevation)': ms['sr_delta'],
        'HP Batting Avg': ms['hp_avg'],
        'Boundary %': ms['boundary_pct'],
        'Dot %': ms['dot_pct'],
        'Win Probability Added (WPA)': ms['hp_wpa'],
        'Teams': '; '.join(b['teams']),
        'Audited Rationale': b['why_ranked']
    })

df_b = pd.DataFrame(b_rows)
df_b.to_csv('suprr-selector/reports/final_submission/final_top10_batters.csv', index=False)
print("Saved final_top10_batters.csv")

# Format Bowlers
bw_rows = []
for bw in bowlers:
    ms = bw['metrics_summary']
    bw_rows.append({
        'Rank': bw['rank'],
        'Player ID': bw['id'],
        'Player Name': bw['name'],
        'PRI Score': bw['pri_score'],
        'HP Legal Balls Bowled': ms['hp_balls'],
        'HP Runs Conceded': ms['hp_runs'],
        'HP Bowler Wickets': ms['hp_wkts'],
        'HP Economy Rate': ms['hp_econ'],
        'Baseline Economy Rate': ms['norm_econ'],
        'Economy Delta (Tightening)': ms['econ_delta'],
        'HP Bowling Strike Rate': ms['hp_sr'],
        'Dot %': ms['dot_pct'],
        'Boundary Concession %': ms['boundary_pct'],
        'Win Probability Added (WPA)': ms['hp_wpa'],
        'Teams': '; '.join(bw['teams']),
        'Audited Rationale': bw['why_ranked']
    })

df_bw = pd.DataFrame(bw_rows)
df_bw.to_csv('suprr-selector/reports/final_submission/final_top10_bowlers.csv', index=False)
print("Saved final_top10_bowlers.csv")
