import pandas as pd

df_b = pd.read_parquet('suprr-selector/data/processed/pri_rankings_batters.parquet')
df_bw = pd.read_parquet('suprr-selector/data/processed/pri_rankings_bowlers.parquet')

non_indian_nations = {
    'South Africa', 'Australia', 'England', 'West Indies', 'New Zealand', 
    'Pakistan', 'Sri Lanka', 'Afghanistan', 'Bangladesh', 'Zimbabwe', 
    'Ireland', 'Netherlands', 'Scotland', 'Namibia', 'USA', 'Oman', 'UAE', 'Nepal', 'Canada'
}

def is_strictly_indian(teams):
    t_set = set(teams)
    if 'India' in t_set or 'India A' in t_set or 'India Under-19s' in t_set:
        return True
    if not (t_set & non_indian_nations):
        return True
    return False

ind_b = df_b[df_b['teams'].apply(is_strictly_indian)].copy()
ind_bw = df_bw[df_bw['teams'].apply(is_strictly_indian)].copy()

print(f"Total Indian Batters: {len(ind_b)}")
print(f"Total Indian Bowlers: {len(ind_bw)}")

print("\n--- TOP 15 INDIAN BATTERS ---")
for _, r in ind_b.head(15).iterrows():
    print(f"Rank {r['rank']} | ID {r['id']} | {r['name']:<22} | HP Balls: {r['hp_balls']:<4} | HP SR: {r['hp_sr']:>6.2f} | dSR: {r['sr_delta']:>+6.2f} | WPA: {r['hp_wpa']:>+6.3f} | PRI: {r['pri_score']:>5.2f}")

print("\n--- TOP 15 INDIAN BOWLERS ---")
for _, r in ind_bw.head(15).iterrows():
    print(f"Rank {r['rank']} | ID {r['id']} | {r['name']:<22} [{r['pace_or_spin']:<4}] | HP Balls: {r['hp_balls']:<4} | HP Econ: {r['hp_econ']:>5.2f} | dEcon: {r['econ_delta']:>+5.2f} | WPA: {r['hp_wpa']:>+6.3f} | PRI: {r['pri_score']:>5.2f}")
