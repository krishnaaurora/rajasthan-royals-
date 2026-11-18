import pandas as pd
df_b = pd.read_parquet('suprr-selector/data/processed/pri_rankings_batters.parquet')
df_bw = pd.read_parquet('suprr-selector/data/processed/pri_rankings_bowlers.parquet')

print("--- BATTERS ---")
for p in ['Ashutosh Sharma', 'Namboori Tilak Varma', 'Rahul Tewatia', 'Ramandeep Singh']:
    r = df_b[df_b['name'] == p].iloc[0]
    print(f"{p:<22} | ID: {r['id']:<5} | Balls: {r['hp_balls']:<4} | HP SR: {r['hp_sr']:>6.2f} | Base SR: {r['norm_sr']:>6.2f} | dSR: {r['sr_delta']:>+6.2f} | Avg: {r['hp_avg']:>5.2f} | WPA: {r['hp_wpa']:>+6.3f} | Bnd%: {r['boundary_pct']:>4.1f}% | Dot%: {r['dot_pct']:>4.1f}%")

print("\n--- BOWLERS ---")
for p in ['Kuldeep Yadav', 'Axar Patel', 'Yuzvendra Chahal', 'Harshit Rana', 'Shardul Thakur', 'Arshdeep Singh']:
    r = df_bw[df_bw['name'] == p].iloc[0]
    print(f"{p:<22} | ID: {r['id']:<5} | Balls: {r['hp_balls']:<4} | HP Econ: {r['hp_econ']:>5.2f} | Base Econ: {r['norm_econ']:>5.2f} | dEcon: {r['econ_delta']:>+5.2f} | Wkts: {r['hp_wkts']:<2} | WPA: {r['hp_wpa']:>+6.3f} | Bnd%: {r['boundary_pct']:>4.1f}% | Dot%: {r['dot_pct']:>4.1f}%")
