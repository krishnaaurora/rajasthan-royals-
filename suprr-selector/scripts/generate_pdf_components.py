"""
Update generate_submission_pdf.js to dynamically read unified_top10_auction_shortlist.json
and feature the ML Auction Need Model and All-Indian shortlist.
"""

import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
JSON_PATH = BASE_DIR / "reports" / "final_submission" / "unified_top10_auction_shortlist.json"
PDF_SCRIPT_PATH = BASE_DIR / "scripts" / "generate_submission_pdf.js"

with open(JSON_PATH, "r", encoding="utf-8") as f:
    candidates = json.load(f)

# Load benchmarks
BENCHMARKS_PATH = BASE_DIR / "models" / "benchmarks" / "auction_need_benchmarks.json"
with open(BENCHMARKS_PATH, "r", encoding="utf-8") as f:
    benchmarks = json.load(f)

# Build Section 7 Table HTML
table_rows = []
for c in candidates:
    is_hl = " class=\"highlight\"" if c["rank"] == 1 else ""
    tier = c["auction_intelligence"]["tier"]
    tag_class = "tag-prime" if "Prime" in tier else "tag-high" if "High" in tier else "tag-contingency"
    
    key_metric = f"<strong>{c['hp_sr']:.2f} SR</strong>" if "hp_sr" in c else f"<strong>{c['hp_econ']:.2f} Econ</strong>"
    delta = f"<strong>+{c['sr_delta']:.2f} SR</strong>" if "sr_delta" in c else f"<strong>+{c['econ_delta']:.2f} Econ</strong>"
    
    table_rows.append(f"""    <tr{is_hl}>
      <td class="text-center"><strong>#{c['rank']}</strong></td>
      <td><strong>{c['name']}</strong></td>
      <td class="text-center">{c['id']}</td>
      <td>{c['primary_role']}</td>
      <td class="text-center"><strong>{c['crpi_score']}</strong></td>
      <td class="text-center"><strong>{c.get('ml_need_score', c['crpi_score'])}</strong></td>
      <td class="text-right">{c['sample_balls']}</td>
      <td class="text-right">{key_metric}</td>
      <td class="text-right">{delta}</td>
      <td class="text-right"><strong>{c['hp_wpa']:+.3f}</strong></td>
      <td class="text-center">[{c['confidence_interval'][0]}, {c['confidence_interval'][1]}]</td>
      <td><span class="tag {tag_class}">{tier.split(':')[0]}</span></td>
    </tr>""")

section7_table_html = "\n".join(table_rows)

# Build Section 8 Dossiers HTML
dossier_cards = []
for c in candidates:
    tier = c["auction_intelligence"]["tier"]
    badge_tier = tier.split(":")[0]
    
    if "hp_sr" in c:
        perf_html = f"""      <strong>{c['hp_sr']:.2f} HP SR</strong> (+{c['sr_delta']:.2f} $\\Delta SR$)<br>
      HP Avg: {c.get('hp_avg', 'N/A')} | Balls: {c['sample_balls']}<br>
      <strong>{c['hp_wpa']:+.3f} WPA</strong> | Bnd%: {c['boundary_pct']}% | Dots: {c['dot_pct']}%"""
    else:
        perf_html = f"""      <strong>{c['hp_econ']:.2f} HP Econ</strong> (+{c['econ_delta']:.2f} $\\Delta Econ$)<br>
      Wickets: {c.get('hp_wkts', 'N/A')} | Balls: {c['sample_balls']}<br>
      <strong>{c['hp_wpa']:+.3f} WPA</strong> | Bnd%: {c['boundary_pct']}% | Dots: {c['dot_pct']}%"""
      
    tac = c["tactical_fit"]
    auc = c["auction_intelligence"]
    ven = c["venue_matchup_analysis"]
    
    card_html = f"""<div class="dossier-card">
  <div class="dossier-header">
    <span class="dossier-title">#{c['rank']} {c['name']} (ID: {c['id']}) · {c['primary_role']}</span>
    <span class="dossier-badge">ML Need: {c.get('ml_need_score', c['crpi_score'])} | {badge_tier}</span>
  </div>
  <div class="dossier-grid">
    <div class="dossier-box">
      <span class="dossier-box-title">Pressure Performance</span>
{perf_html}
    </div>
    <div class="dossier-box">
      <span class="dossier-box-title">RR Tactical Fit</span>
      <strong>Position:</strong> {tac.get('batting_position', tac.get('bowling_role', 'N/A'))}<br>
      {tac['rr_contribution'][:110]}...
    </div>
    <div class="dossier-box">
      <span class="dossier-box-title">Auction & Venue Intelligence</span>
      <strong>Status:</strong> {auc['availability_status']}.<br>
      <strong>Jaipur Fit:</strong> {ven['jaipur_fit'][:75]}...<br>
      <strong>Verdict:</strong> <strong>{auc['scouting_verdict'][:60]}</strong>
    </div>
  </div>
  <p style="font-size:7.2pt; margin:0; color:#475569;">
    <strong>Traceable Data Proof:</strong> {c['strengths'][0]}. Weakness: {c['weaknesses'][0]}.
  </p>
</div>"""
    dossier_cards.append(card_html)

section8_dossiers_html = "\n\n".join(dossier_cards)

# Build Section 9 Table HTML
sec9_rows = []
for c in candidates:
    sec9_rows.append(f"""    <tr>
      <td><strong>{c['name']}</strong></td>
      <td>{c['primary_role']}</td>
      <td>{c['tactical_fit']['rr_contribution']}</td>
      <td><span class="tag tag-prime">{c['auction_intelligence']['tier']}</span></td>
    </tr>""")
section9_table_html = "\n".join(sec9_rows)

print("HTML components generated successfully.")
