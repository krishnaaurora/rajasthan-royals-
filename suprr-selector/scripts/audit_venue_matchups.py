import pandas as pd
import numpy as np

# Load deliveries
df = pd.read_parquet('suprr-selector/data/processed/cleaned_deliveries.parquet')
df_press = pd.read_parquet('suprr-selector/data/processed/pressure_features.parquet')
df_wp = pd.read_parquet('suprr-selector/data/processed/win_probability_features.parquet')

print("Loaded datasets successfully.")
print(f"Total deliveries: {len(df)}")

# Check venues
print("\nTop 10 Venues by deliveries:")
print(df['venue_id'].value_counts().head(10))

# Check Jaipur specifically
# Search for Jaipur in matches_clean
df_matches = pd.read_parquet('suprr-selector/data/processed/matches_clean.parquet')
jaipur_matches = df_matches[df_matches['venue_country'].str.contains('India', na=False)]
print("\nUnique venues sample:")
print(df_matches[['venue_id', 'venue_country']].drop_duplicates().head(15))

# Check pace vs spin under pressure
hp_mask = df_press['is_pressure_ball']
df_hp = df[hp_mask].copy()
print(f"\nHigh Pressure Deliveries count: {len(df_hp)}")

if 'pace_or_spin' in df_hp.columns:
    print("\nPace vs Spin in High Pressure:")
    p_s_stats = df_hp.groupby('pace_or_spin').agg(
        balls=('is_legal', 'sum'),
        runs=('runs_total', 'sum'),
        wickets=('is_wicket', 'sum'),
        dots=('runs_total', lambda x: (x == 0).sum()),
        boundaries=('runs_total', lambda x: (x >= 4).sum())
    )
    p_s_stats['econ'] = (p_s_stats['runs'] * 6.0) / p_s_stats['balls']
    p_s_stats['dot_pct'] = (p_s_stats['dots'] / p_s_stats['balls']) * 100
    p_s_stats['bnd_pct'] = (p_s_stats['boundaries'] / p_s_stats['balls']) * 100
    print(p_s_stats[['balls', 'econ', 'dot_pct', 'bnd_pct', 'wickets']])

# Innings 1 vs Innings 2 in High Pressure
inn_stats = df_hp.groupby('innings').agg(
    balls=('is_legal', 'sum'),
    runs=('runs_total', 'sum'),
    wickets=('is_wicket', 'sum'),
    dots=('runs_total', lambda x: (x == 0).sum()),
    boundaries=('runs_total', lambda x: (x >= 4).sum())
)
inn_stats['econ'] = (inn_stats['runs'] * 6.0) / inn_stats['balls']
inn_stats['dot_pct'] = (inn_stats['dots'] / inn_stats['balls']) * 100
inn_stats['bnd_pct'] = (inn_stats['boundaries'] / inn_stats['balls']) * 100
print("\nInnings 1 vs Innings 2 under High Pressure:")
print(inn_stats[['balls', 'econ', 'dot_pct', 'bnd_pct', 'wickets']])
