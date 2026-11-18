"""
SupeRR Pressure Intelligence Lab — Real IPL Auction Ranker: All-Indian Targets
Applies the trained ML Auction Need Model to rank qualified Indian players,
accounting for official retentions, auction eligibility, and Rajasthan Royals' specific squad gaps.
"""

import sys
from pathlib import Path
import json
import joblib
import pandas as pd
import numpy as np

BASE_DIR = Path(__file__).resolve().parents[1]
PROCESSED_DIR = BASE_DIR / "data" / "processed"
MODELS_DIR = BASE_DIR / "models"
MODEL_PATH = MODELS_DIR / "rr_auction_need_model.joblib"

# Load Model
model = joblib.load(MODEL_PATH)

# Load Player Rankings
df_bat = pd.read_parquet(PROCESSED_DIR / "pri_rankings_batters.parquet")
df_bowl = pd.read_parquet(PROCESSED_DIR / "pri_rankings_bowlers.parquet")

# Retained players / Ineligible in Auction
RETAINED_OR_INELIGIBLE = {
    # Retained by RR itself
    "Sanju Samson": "Retained by Rajasthan Royals (Captain / Core)",
    "Yashasvi Jaiswal": "Retained by Rajasthan Royals (Core Opener)",
    "Riyan Parag": "Retained by Rajasthan Royals (Core No. 4)",
    "Dhruv Jurel": "Retained by Rajasthan Royals (Core Finisher / WK)",
    "Shimron Hetmyer": "Retained by Rajasthan Royals (Overseas Finisher)",
    "Sandeep Sharma": "Retained by Rajasthan Royals (Uncapped Indian Pacer)",
    
    # Retained by other franchises (Not available in auction pool)
    "Jasprit Bumrah": "Retained by Mumbai Indians (Marquee ₹18 Cr)",
    "Suryakumar Yadav": "Retained by Mumbai Indians (Marquee ₹16.35 Cr)",
    "Hardik Pandya": "Retained by Mumbai Indians (Captain ₹16.35 Cr)",
    "Rohit Sharma": "Retained by Mumbai Indians (₹16.30 Cr)",
    "Virat Kohli": "Retained by Royal Challengers Bengaluru (Marquee ₹21 Cr)",
    "Rajat Patidar": "Retained by Royal Challengers Bengaluru (₹11 Cr)",
    "Rinku Singh": "Retained by Kolkata Knight Riders (Marquee ₹13 Cr)",
    "Varun Chakravarthy": "Retained by Kolkata Knight Riders (Marquee ₹12 Cr)",
    "Ruturaj Gaikwad": "Retained by Chennai Super Kings (Captain ₹18 Cr)",
    "Ravindra Jadeja": "Retained by Chennai Super Kings (Marquee ₹18 Cr)",
    "Shivam Dube": "Retained by Chennai Super Kings (₹12 Cr)",
    "Mahendra Singh Dhoni": "Retained by Chennai Super Kings (Uncapped ₹4 Cr)",
    "Shubman Gill": "Retained by Gujarat Titans (Captain ₹16.5 Cr)",
    "Sai Sudharsan": "Retained by Gujarat Titans (₹8.5 Cr)",
    "Nicholas Pooran": "Retained by Lucknow Super Giants (Overseas ₹21 Cr)",
    "Mayank Yadav": "Retained by Lucknow Super Giants (₹11 Cr)",
    "Heinrich Klaasen": "Retained by Sunrisers Hyderabad (Overseas ₹23 Cr)",
    "Pat Cummins": "Retained by Sunrisers Hyderabad (Overseas Captain ₹18 Cr)",
    "Abhishek Sharma": "Retained by Sunrisers Hyderabad (₹14 Cr)",
    "Nitish Kumar Reddy": "Retained by Sunrisers Hyderabad (₹6 Cr)",
    
    # Officially Retired
    "Dinesh Karthik": "Retired from IPL (RCB Mentor / Batting Coach)"
}

OVERSEAS_PLAYERS = {
    'Sunil Narine', 'Andre Russell', 'Rashid Khan', 'Tim David', 'David Miller',
    'Jos Buttler', 'Glenn Maxwell', 'Dasun Shanaka', 'Tristan Stubbs', 'Quinton de Kock',
    'Kagiso Rabada', 'Trent Boult', 'Anrich Nortje', 'Marcus Stoinis', 'Nicholas Pooran',
    'Sam Curran', 'Liam Livingstone', 'Mitchell Starc', 'Pat Cummins', 'Travis Head',
    'Heinrich Klaasen', 'Faf du Plessis', 'Moeen Ali', 'Wanindu Hasaranga', 'Maheesh Theekshana',
    'Matheesha Pathirana', 'Mustafizur Rahman', 'Lungi Ngidi', 'Lockie Ferguson', 'Alzarri Joseph',
    'Fazalhaq Farooqi', 'Noor Ahmad', 'Naveen-ul-Haq', 'Azmatullah Omarzai', 'Rahmanullah Gurbaz',
    'Shimron Hetmyer', 'Rovman Powell', 'Romario Shepherd', 'Sherfane Rutherford', 'Kyle Mayers'
}

OVERSEAS_NATIONS = {
    'South Africa', 'Australia', 'England', 'West Indies', 'New Zealand', 
    'Pakistan', 'Sri Lanka', 'Afghanistan', 'Bangladesh', 'Zimbabwe', 
    'Ireland', 'Netherlands', 'Scotland', 'Namibia', 'USA', 'Oman', 'UAE', 'Nepal', 'Canada'
}

def is_indian_player(name, teams):
    if name in OVERSEAS_PLAYERS:
        return False
    t_set = set(teams) if isinstance(teams, (list, set, np.ndarray)) else set()
    if 'India' in t_set or 'India A' in t_set or 'India Under-19s' in t_set:
        return True
    if t_set & OVERSEAS_NATIONS:
        return False
    return True

# Build feature rows for scoring
scored_candidates = []

# Process Batters (Must have >= 120 HP balls)
for _, r in df_bat[df_bat['hp_balls'] >= 120].iterrows():
    name = r['name']
    if not is_indian_player(name, r['teams']):
        continue
    
    hp_balls = float(r['hp_balls'])
    hp_sr = float(r['hp_sr'])
    hp_wpa = float(r['hp_wpa'])
    wpa_per_ball = float(r['wpa_per_ball'])
    sr_delta = float(r['sr_delta'])
    dot_pct = float(r['dot_pct'])
    bnd_pct = float(r['boundary_pct'])
    extreme_balls = float(r['extreme_balls'])
    pri = float(r['pri_score'])
    
    if hp_sr >= 175 and sr_delta >= 40:
        role_scarcity = 1.40
        sub_role = "Domestic Finisher"
    elif hp_sr >= 160:
        role_scarcity = 1.25
        sub_role = "Middle-Order Bat"
    else:
        role_scarcity = 1.05
        sub_role = "Top-Order / Anchor"
        
    jaipur_fit = (bnd_pct / 30.0) * 0.6 + (max(0, 40 - dot_pct) / 20.0) * 0.4
    
    features = [
        hp_balls, hp_sr, 0.0, sr_delta, 0.0,
        hp_wpa, wpa_per_ball, dot_pct, bnd_pct,
        extreme_balls, pri, role_scarcity, jaipur_fit, 1
    ]
    
    pred_score = float(model.predict([features])[0])
    
    retention_info = RETAINED_OR_INELIGIBLE.get(name, "Available in Auction Pool")
    is_auction_eligible = (name not in RETAINED_OR_INELIGIBLE)
    
    scored_candidates.append({
        'id': int(r['id']),
        'name': name,
        'role_class': 'Batter',
        'sub_role': sub_role,
        'hp_balls': int(hp_balls),
        'metric_primary': f"{hp_sr:.1f} SR",
        'metric_delta': f"{sr_delta:+.1f} ΔSR",
        'hp_wpa': round(hp_wpa, 3),
        'dot_pct': round(dot_pct, 1),
        'boundary_pct': round(bnd_pct, 1),
        'pri_score': round(pri, 2),
        'predicted_need_score': round(pred_score, 2),
        'auction_status': retention_info,
        'is_auction_eligible': is_auction_eligible
    })

# Process Bowlers (Must have >= 100 HP balls)
for _, r in df_bowl[df_bowl['hp_balls'] >= 100].iterrows():
    name = r['name']
    if not is_indian_player(name, r['teams']):
        continue
        
    hp_balls = float(r['hp_balls'])
    hp_econ = float(r['hp_econ'])
    hp_wpa = float(r['hp_wpa'])
    wpa_per_ball = float(r['wpa_per_ball'])
    econ_delta = float(r['econ_delta'])
    dot_pct = float(r['dot_pct'])
    bnd_pct = float(r['boundary_pct'])
    extreme_balls = float(r['extreme_balls'])
    pri = float(r['pri_score'])
    pace_or_spin = r.get('pace_or_spin', 'Pace')
    
    if pace_or_spin == 'Spin':
        role_scarcity = 1.35
        sub_role = "Jaipur Wrist/Finger Spinner"
        jaipur_fit = max(0, 11.0 - hp_econ) / 5.0 * 0.7 + (dot_pct / 50.0) * 0.3
    else:
        role_scarcity = 1.30
        sub_role = "Death Fast Bowler"
        jaipur_fit = max(0, 12.0 - hp_econ) / 5.0 * 0.5 + (dot_pct / 50.0) * 0.5
        
    features = [
        hp_balls, 0.0, hp_econ, 0.0, econ_delta,
        hp_wpa, wpa_per_ball, dot_pct, bnd_pct,
        extreme_balls, pri, role_scarcity, jaipur_fit, 1
    ]
    
    pred_score = float(model.predict([features])[0])
    
    retention_info = RETAINED_OR_INELIGIBLE.get(name, "Available in Auction Pool")
    is_auction_eligible = (name not in RETAINED_OR_INELIGIBLE)
    
    scored_candidates.append({
        'id': int(r['id']),
        'name': name,
        'role_class': 'Bowler',
        'sub_role': sub_role,
        'hp_balls': int(hp_balls),
        'metric_primary': f"{hp_econ:.2f} Econ",
        'metric_delta': f"{econ_delta:+.2f} ΔEcon",
        'hp_wpa': round(hp_wpa, 3),
        'dot_pct': round(dot_pct, 1),
        'boundary_pct': round(bnd_pct, 1),
        'pri_score': round(pri, 2),
        'predicted_need_score': round(pred_score, 2),
        'auction_status': retention_info,
        'is_auction_eligible': is_auction_eligible
    })

df_scored = pd.DataFrame(scored_candidates)
df_scored = df_scored.sort_values(by='predicted_need_score', ascending=False)

print("=== ALL QUALIFIED INDIAN CANDIDATES (Ranked by ML Need Score) ===")
print(df_scored[['name', 'sub_role', 'metric_primary', 'hp_wpa', 'predicted_need_score', 'auction_status']].to_string())

print("\n=== CONFIRMED REAL-AUCTION ELIGIBLE INDIAN SHORTLIST (TOP 10) ===")
df_eligible = df_scored[df_scored['is_auction_eligible']].head(10).reset_index(drop=True)
df_eligible['rank'] = range(1, len(df_eligible) + 1)
print(df_eligible[['rank', 'id', 'name', 'sub_role', 'hp_balls', 'metric_primary', 'metric_delta', 'hp_wpa', 'predicted_need_score']].to_string())
