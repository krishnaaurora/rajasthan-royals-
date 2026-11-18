import json
import random

# Seed for perfect reproducibility
random.seed(42)

with open('suprr-selector/frontend/src/data/app_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

batters = data['batters'][:10]
bowlers = data['bowlers'][:10]

print("Simulating 2,500 Monte Carlo runs for each Top 10 Batter...")
# Standard Death Chase Scenario: 42 runs needed off 18 balls, 5 wkts lost
batter_sims = {}
for b in batters:
    hp_sr = float(b['hp_sr'])
    hp_bnd = float(b.get('hp_boundary_pct', 25.0))
    hp_dot = float(b.get('hp_dot_pct', 25.0))
    
    # 2500 Monte Carlo trials
    neutral_wins = 0
    jaipur_wins = 0
    N = 2500
    
    for venue in ['neutral', 'jaipur']:
        b_factor = 0.88 if venue == 'jaipur' else 1.00
        p_factor = 1.18 if venue == 'jaipur' else 1.00
        adj_sr = hp_sr * b_factor
        
        wins = 0
        for _ in range(N):
            runs = 0
            wkts = 0
            for ball in range(18):
                if wkts >= 5: # 5 wickets in hand left
                    break
                if runs > 42:
                    break
                
                # Draw outcome
                roll = random.random()
                wkt_prob = 0.055
                bnd_prob = min(0.38, max(0.12, (adj_sr / 600.0) * b_factor))
                dot_prob = min(0.40, max(0.15, (hp_dot / 100.0) * p_factor))
                
                if roll < wkt_prob:
                    wkts += 1
                elif roll < wkt_prob + dot_prob:
                    pass
                elif roll < wkt_prob + dot_prob + bnd_prob:
                    runs += 6 if random.random() > 0.65 else 4
                else:
                    runs += 2 if random.random() > 0.80 else 1
            if runs > 42:
                wins += 1
            elif runs == 42:
                wins += 0.5
        
        if venue == 'neutral':
            neutral_wins = round((wins / N) * 100, 1)
        else:
            jaipur_wins = round((wins / N) * 100, 1)
            
    batter_sims[b['id']] = {
        'name': b['name'],
        'hp_balls': b.get('sample_balls') or b.get('hp_balls'),
        'hp_sr': b['hp_sr'],
        'delta_sr': b.get('delta_sr') or b.get('sr_delta'),
        'pri_score': b['pri_score'],
        'sim_win_rate': neutral_wins,
        'jaipur_sim_win_rate': jaipur_wins
    }

print("\nSimulating 2,500 Monte Carlo runs for each Top 10 Bowler...")
# Death Defense Scenario: Defending 14 runs off 6 balls, 6 wkts lost
bowler_sims = {}
for bw in bowlers:
    hp_econ = float(bw['hp_econ'])
    hp_dot = float(bw.get('hp_dot_pct', 40.0))
    hp_wkt_rate = float(bw.get('hp_sr', 12.0))
    is_spin = any(x in bw['name'].lower() for x in ['kuldeep', 'varun', 'chahal', 'axar', 'narine', 'rashid', 'abrar'])
    
    neutral_def = 0
    jaipur_def = 0
    N = 2500
    
    for venue in ['neutral', 'jaipur']:
        spin_f = 1.18 if (venue == 'jaipur' and is_spin) else 1.00
        bnd_f = 0.88 if venue == 'jaipur' else 1.00
        eff_econ = hp_econ * (0.86 if (venue == 'jaipur' and is_spin) else 1.00)
        
        defenses = 0
        for _ in range(N):
            runs_conc = 0
            wkts_taken = 0
            for ball in range(6):
                if wkts_taken >= 4: # 4 wickets to all-out
                    break
                if runs_conc >= 14:
                    break
                
                roll = random.random()
                wkt_p = min(0.18, max(0.05, 6.0 / (hp_wkt_rate * 6.0)))
                dot_p = min(0.55, max(0.20, (hp_dot / 100.0) * spin_f))
                bnd_p = min(0.35, max(0.08, (eff_econ / 12.0) * 0.28 * bnd_f))
                
                if roll < wkt_p:
                    wkts_taken += 1
                elif roll < wkt_p + dot_p:
                    pass
                elif roll < wkt_p + dot_p + bnd_p:
                    runs_conc += 6 if random.random() > 0.70 else 4
                else:
                    runs_conc += 2 if random.random() > 0.85 else 1
            if runs_conc < 14:
                defenses += 1
            elif runs_conc == 14:
                defenses += 0.5
                
        if venue == 'neutral':
            neutral_def = round((defenses / N) * 100, 1)
        else:
            jaipur_def = round((defenses / N) * 100, 1)
            
    bowler_sims[bw['id']] = {
        'name': bw['name'],
        'hp_balls': bw.get('sample_balls') or bw.get('hp_balls'),
        'hp_econ': bw['hp_econ'],
        'delta_econ': bw.get('delta_econ') or bw.get('econ_delta'),
        'pri_score': bw['pri_score'],
        'sim_defense_rate': neutral_def,
        'jaipur_sim_defense_rate': jaipur_def
    }

print("\n--- BATTERS ---")
for k, v in batter_sims.items():
    print(f"{v['name']}: Balls={v['hp_balls']}, HP_SR={v['hp_sr']}, PRI={v['pri_score']}, SimWin={v['sim_win_rate']}%, JaipurWin={v['jaipur_sim_win_rate']}%")

print("\n--- BOWLERS ---")
for k, v in bowler_sims.items():
    print(f"{v['name']}: Balls={v['hp_balls']}, HP_Econ={v['hp_econ']}, PRI={v['pri_score']}, SimDef={v['sim_defense_rate']}%, JaipurDef={v['jaipur_sim_defense_rate']}%")

with open('suprr-selector/scripts/simulation_results_top10.json', 'w') as out:
    json.dump({'batters': batter_sims, 'bowlers': bowler_sims}, out, indent=2)
print("Saved to suprr-selector/scripts/simulation_results_top10.json")
