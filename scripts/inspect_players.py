import pandas as pd

b = pd.read_parquet('suprr-selector/data/processed/pri_rankings_batters.parquet')
bw = pd.read_parquet('suprr-selector/data/processed/pri_rankings_bowlers.parquet')

names_b = ['Ashutosh Sharma', 'Tim David', 'Rahul Tewatia', 'David Miller', 'Namboori Tilak Varma', 'Tristan Stubbs', 'Rinku Singh']
names_bw = ['Kuldeep Yadav', 'Yuzvendra Chahal', 'Harshit Rana', 'Axar Patel', 'Arshdeep Singh', 'Matheesha Pathirana']

print('--- BATTERS ---')
for n in names_b:
    m = b[b['name'].str.contains(n, case=False, na=False)]
    if not m.empty:
        r = m.iloc[0]
        print(f"{r['name']} (ID: {r['id']}): PRI={r['pri_score']:.1f}, HP_SR={r['hp_sr']:.1f}, Norm_SR={r['norm_sr']:.1f}, WPA={r['hp_wpa']:.3f}, Balls={r['hp_balls']}, Matches={r['matches_played']}")

print('\n--- BOWLERS ---')
for n in names_bw:
    m = bw[bw['name'].str.contains(n, case=False, na=False)]
    if not m.empty:
        r = m.iloc[0]
        print(f"{r['name']} (ID: {r['id']}): PRI={r['pri_score']:.1f}, HP_Econ={r['hp_econ']:.2f}, Norm_Econ={r['norm_econ']:.2f}, WPA={r['hp_wpa']:.3f}, Balls={r['hp_balls']}, Wkts={r['hp_wkts']}, Matches={r['matches_played']}")
