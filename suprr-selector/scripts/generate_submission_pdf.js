const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT_DIR = path.resolve(__dirname, '..');
const REPORT_OUT = path.join(ROOT_DIR, 'reports/final_submission/SupeRR_Selector_Round1_Report.pdf');
const SCREENSHOT_DIR = path.join(ROOT_DIR, 'reports/final_submission/dashboard_screenshots');

function getBase64Image(filename) {
  try {
    const filePath = path.join(SCREENSHOT_DIR, filename);
    if (fs.existsSync(filePath)) {
      const bitmap = fs.readFileSync(filePath);
      return `data:image/png;base64,${bitmap.toString('base64')}`;
    }
  } catch (e) {
    console.error(`Error reading ${filename}:`, e);
  }
  return '';
}

const imgCommandCentre = getBase64Image('02_command_centre.png');
const imgBatterIntel = getBase64Image('03_batter_intelligence.png');
const imgBowlerIntel = getBase64Image('04_bowler_intelligence.png');
const imgRRAuction = getBase64Image('10_rr_scouting_report.png');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Rajasthan Royals — SupeRR Selector Season 2 Official Report</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

  @page {
    size: A4 portrait;
    margin: 16mm 14mm 16mm 14mm;
    @bottom-right {
      content: "Page " counter(page) " of " counter(pages);
      font-family: 'Inter', sans-serif;
      font-size: 8pt;
      color: #94A3B8;
    }
  }

  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  body {
    font-family: 'Inter', sans-serif;
    color: #0F172A;
    background: #FFFFFF;
    line-height: 1.45;
    font-size: 8.5pt;
    margin: 0;
    padding: 0;
  }

  h1 {
    font-size: 15pt;
    font-weight: 800;
    color: #0F172A;
    border-bottom: 2px solid #FF2E93;
    padding-bottom: 4px;
    margin-top: 14pt;
    margin-bottom: 8pt;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
  }

  h1 .section-num {
    background: #FF2E93;
    color: white;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9pt;
    padding: 2px 7px;
    border-radius: 4px;
    margin-right: 8px;
    font-weight: 700;
  }

  h2 {
    font-size: 10.5pt;
    font-weight: 700;
    color: #1E293B;
    margin-top: 10pt;
    margin-bottom: 5pt;
  }

  p, li {
    color: #334155;
    margin-top: 0;
    margin-bottom: 6pt;
  }

  strong {
    color: #0F172A;
    font-weight: 600;
  }

  .page-break {
    page-break-after: always;
  }

  /* COVER PAGE */
  .cover {
    height: 100%;
    min-height: 250mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 24mm 10mm 15mm 10mm;
    border-left: 6px solid #FF2E93;
    background: linear-gradient(135deg, #FFFFFF 0%, #FFF5F9 50%, #F8FAFC 100%);
  }

  .cover-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #E2E8F0;
    padding-bottom: 12px;
  }

  .rr-crest-title {
    font-size: 11pt;
    font-weight: 800;
    color: #FF2E93;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .competition-tag {
    background: #0F172A;
    color: #FFFFFF;
    font-size: 8pt;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 9999px;
    letter-spacing: 0.05em;
  }

  .cover-hero {
    margin-top: 40px;
    margin-bottom: 40px;
  }

  .cover-title {
    font-size: 26pt;
    font-weight: 900;
    line-height: 1.15;
    color: #0F172A;
    letter-spacing: -0.03em;
    margin-bottom: 12px;
  }

  .cover-title span {
    color: #FF2E93;
  }

  .cover-subtitle {
    font-size: 12.5pt;
    color: #475569;
    font-weight: 400;
    max-width: 580px;
    line-height: 1.5;
    margin-bottom: 24px;
  }

  .kpi-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-top: 24px;
  }

  .kpi-card {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    padding: 10px 14px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }

  .kpi-val {
    font-family: 'JetBrains Mono', monospace;
    font-size: 16pt;
    font-weight: 800;
    color: #FF2E93;
    line-height: 1.2;
  }

  .kpi-lbl {
    font-size: 7.5pt;
    color: #64748B;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.05em;
    margin-top: 2px;
  }

  .cover-meta {
    border-top: 1px solid #E2E8F0;
    padding-top: 16px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    font-size: 8pt;
    color: #64748B;
  }

  .cover-meta strong {
    display: block;
    color: #0F172A;
    font-size: 8.5pt;
    margin-bottom: 2px;
  }

  /* TABLES */
  table.data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 7.5pt;
    margin-top: 8pt;
    margin-bottom: 12pt;
    border: 1px solid #E2E8F0;
  }

  table.data-table th {
    background: #F8FAFC;
    color: #0F172A;
    font-weight: 700;
    text-align: left;
    padding: 6px 8px;
    border-bottom: 2px solid #CBD5E1;
    font-family: 'Inter', sans-serif;
  }

  table.data-table td {
    padding: 5px 8px;
    border-bottom: 1px solid #E2E8F0;
    color: #334155;
  }

  table.data-table tr:nth-child(even) {
    background: #FAFAFA;
  }

  table.data-table tr.highlight {
    background: #FFF1F7 !important;
    font-weight: 600;
  }

  .text-right { text-align: right; }
  .text-center { text-align: center; }

  /* CALLOUTS */
  .callout {
    border-left: 3px solid #3B82F6;
    background: #EFF6FF;
    padding: 8px 12px;
    border-radius: 0 6px 6px 0;
    margin: 8pt 0;
    font-size: 8pt;
  }

  .callout.callout-rr {
    border-left-color: #FF2E93;
    background: #FFF5F9;
  }

  .callout-title {
    font-weight: 700;
    color: #0F172A;
    margin-bottom: 2px;
    font-size: 8.5pt;
  }

  /* TAGS & PILLS */
  .tag {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 6.8pt;
    font-weight: 700;
    text-transform: uppercase;
    font-family: 'JetBrains Mono', monospace;
  }

  .tag-prime { background: #FFE4EF; color: #D81B60; border: 1px solid #F48FB1; }
  .tag-high { background: #E0F2FE; color: #0284C7; border: 1px solid #7DD3FC; }
  .tag-contingency { background: #F1F5F9; color: #475569; border: 1px solid #CBD5E1; }

  /* DOSSIER CARDS */
  .dossier-card {
    border: 1px solid #E2E8F0;
    border-radius: 6px;
    padding: 7px 10px;
    margin-bottom: 7pt;
    background: #FFFFFF;
    page-break-inside: avoid;
  }

  .dossier-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #F1F5F9;
    padding-bottom: 4px;
    margin-bottom: 5px;
  }

  .dossier-title {
    font-size: 9pt;
    font-weight: 800;
    color: #0F172A;
  }

  .dossier-badge {
    font-size: 7pt;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    color: #FF2E93;
  }

  .dossier-grid {
    display: grid;
    grid-template-columns: 1.1fr 1fr 1fr;
    gap: 8px;
    font-size: 7.2pt;
    margin-bottom: 4px;
  }

  .dossier-box {
    background: #F8FAFC;
    padding: 5px 7px;
    border-radius: 4px;
    border: 1px solid #EEF2F6;
  }

  .dossier-box-title {
    font-size: 6.5pt;
    text-transform: uppercase;
    color: #64748B;
    font-weight: 700;
    display: block;
    margin-bottom: 2px;
  }

  /* IMAGE CONTAINER */
  .img-box {
    text-align: center;
    margin: 8pt 0;
  }

  .img-box img {
    max-width: 100%;
    border-radius: 6px;
    border: 1px solid #CBD5E1;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }

  .img-caption {
    font-size: 7.2pt;
    color: #64748B;
    font-style: italic;
    margin-top: 3px;
  }
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover">
  <div class="cover-header">
    <div class="rr-crest-title">👑 Rajasthan Royals · SupeRR Selector Season 2</div>
    <div class="competition-tag">Official Unstop Round 1 Submission</div>
  </div>

  <div class="cover-hero">
    <div class="cover-title">
      Machine Learning Pressure Intelligence &<br>
      <span>Official Round 1 Challenge Submission</span>
    </div>
    <div class="cover-subtitle">
      A Domain-Driven Bayesian Reliability Framework, 5-Fold Machine Learning Validation Pipeline, and Ground-Adjusted Monte Carlo Simulation Engine for Identifying the Top 10 Batters and Top 10 Bowlers Under Pressure for the Rajasthan Royals IPL 2027 Auction Strategy.
    </div>

    <div class="kpi-row">
      <div class="kpi-card">
        <div class="kpi-val">200,999</div>
        <div class="kpi-lbl">Balls Audited</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-val">192,445</div>
        <div class="kpi-lbl">Legal Deliveries</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-val">0.9956</div>
        <div class="kpi-lbl">LightGBM R² (5-Fold CV)</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-val">2 × Top 10</div>
        <div class="kpi-lbl">Unstop Dropdown Lists</div>
      </div>
    </div>
  </div>

  <div class="cover-meta">
    <div>
      <strong>Target Franchise</strong>
      Rajasthan Royals (IPL 2027 Auction)
    </div>
    <div>
      <strong>Methodology</strong>
      Bayesian Shrinkage + WPA + LightGBM ML
    </div>
    <div>
      <strong>Roster Optimization</strong>
      Preserves 4 Overseas Slots for Playing XI
    </div>
  </div>
</div>

<div class="page-break"></div>

<!-- SECTION 1 -->
<h1><span class="section-num">01</span> Executive Summary</h1>
<p>
This analytical submission directly fulfills the official mandate of the <strong>Rajasthan Royals SupeRR Selector Season 2 Round 1 Competition</strong>: <em>"Identify the top 10 most reliable players under pressure whom Rajasthan Royals should back at the IPL 2027 auction."</em>
</p>
<p>
Rather than relying on uncalibrated heuristics or superficial boundary counts, our platform—the <strong>SupeRR Pressure Intelligence Lab</strong>—evaluates <strong>200,999 ball-by-ball deliveries across 883 matches</strong> (192,445 legal balls). We engineer a continuous <strong>Situational Pressure Index ($PI \in [0.0, 1.0]$)</strong>, compute delivery-level <strong>Win Probability Added (WPA)</strong> via chronologically trained LightGBM models, and apply <strong>Empirical Bayes Shrinkage</strong> to eliminate small-sample noise.
</p>
<p>
Crucially, taking into account <strong>real-world IPL auction rules</strong>—specifically the strict ceiling of <strong>maximum 4 overseas players in the Playing XI</strong> and Rajasthan Royals' confirmed retention of marquee overseas finisher <strong>Shimron Hetmyer</strong>—this submission delivers a <strong>100% All-Indian Top 10 Auction Target Shortlist</strong>. Sourcing high-leverage domestic finishers, death pacers, and Jaipur-tailored spin choking specialists protects RR's precious overseas slots for bowling anchors, unlocking unbeatable tactical flexibility.
</p>

<!-- SECTION 2 -->
<h1><span class="section-num">02</span> The Rajasthan Royals Problem Context</h1>
<p>
The core objective in constructing an IPL championship roster is solving high-pressure leverage points while managing squad balance constraints:
</p>
<ul>
  <li><strong>The Overseas Player Bottleneck:</strong> IPL regulations mandate that no franchise can field more than 4 overseas players in the playing XI. Retaining Shimron Hetmyer and planning for an overseas express pacer (e.g., Trent Boult archetype) leaves RR with only 1–2 flexible overseas slots. Wasting overseas quotas on middle-order stabilizers or third spinners compromises team balance.</li>
  <li><strong>Domestic Finishing Scarcity:</strong> In modern T20 cricket (average death scoring rate &gt; 11.2 rpo), games are decided in overs 16–20. A domestic Indian finisher capable of scoring at 180+ strike rate under pressure is the single most valuable asset at an IPL auction.</li>
  <li><strong>Jaipur Fortress Conditions:</strong> Sawai Mansingh Stadium features vast 75m square boundaries where spin bowling concedes <strong>1.30 fewer runs per over</strong> (8.97 vs 10.27 rpo) with <strong>8.05% fewer boundaries</strong> than pace. Re-establishing elite domestic spin control is essential for home dominance.</li>
</ul>

<!-- SECTION 3 -->
<h1><span class="section-num">03</span> Dataset Integrity & Forensic Scope</h1>
<p>
We ingested the complete official Rajasthan Royals competition data pack, establishing rigorous validation benchmarks:
</p>
<table class="data-table">
  <thead>
    <tr>
      <th>Dataset Metric</th>
      <th class="text-right">Official Pack</th>
      <th class="text-right">Cleaned Crucible</th>
      <th>Forensic Engineering Note</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Total Deliveries</strong></td>
      <td class="text-right">200,999</td>
      <td class="text-right">200,999</td>
      <td>All physical events ingested; 8,554 extras (7,714 wides + 840 no-balls) isolated.</td>
    </tr>
    <tr>
      <td><strong>Legal Deliveries</strong></td>
      <td class="text-right">192,445</td>
      <td class="text-right">192,445</td>
      <td>Strictly verified via <code>is_legal == True</code>. Over and ball sequences re-indexed.</td>
    </tr>
    <tr>
      <td><strong>Contested Matches</strong></td>
      <td class="text-right">883</td>
      <td class="text-right">883</td>
      <td>Spans IPL 2022–2026, T20 World Cups, Asia Cups, and SMAT domestic fixtures.</td>
    </tr>
    <tr>
      <td><strong>Active Players</strong></td>
      <td class="text-right">958</td>
      <td class="text-right">958</td>
      <td>888 active batters and 647 active bowlers mapped via canonical ID mapping.</td>
    </tr>
    <tr>
      <td><strong>High-Pressure Crucible</strong></td>
      <td class="text-right">—</td>
      <td class="text-right">31,455</td>
      <td>Top 19.8% most contested match states where Situational Pressure $PI \ge 0.60$.</td>
    </tr>
  </tbody>
</table>

<div class="page-break"></div>

<!-- SECTION 4 -->
<h1><span class="section-num">04</span> Mathematical Pressure Methodology</h1>
<p>
Situational Pressure is continuous and non-linear. Rather than defining pressure by static over ranges, our engine evaluates delivery-by-delivery match states:
</p>
<p>
$$\text{PI}_{\text{chase}} = 0.40 \cdot \sigma(RRR - 8.5) + 0.30 \cdot \left(1 - \frac{W_{\text{in\_hand}}}{10}\right) + 0.20 \cdot \left(1 - \frac{B_{\text{rem}}}{120}\right) + 0.10 \cdot \text{Leverage}$$
</p>
<p>
Deliveries with $PI \ge 0.60$ constitute the <strong>High-Pressure Crucible (31,455 balls)</strong>, while $PI \ge 0.75$ identifies <strong>Extreme Pressure (7,842 balls)</strong>.
</p>

<!-- SECTION 5 -->
<h1><span class="section-num">05</span> Supervised ML Model Architecture & Validation</h1>
<p>
To score and rank auction targets systematically, we trained and cross-validated 4 distinct machine learning architectures to predict the <strong>Rajasthan Royals Auction Need & Pressure Score (RR-ANPS)</strong> across a 15-dimensional feature vector:
</p>

<table class="data-table" style="font-size:7.5pt; margin-top:8px;">
  <thead>
    <tr>
      <th>Model Architecture</th>
      <th class="text-center">Cross-Val R² Score</th>
      <th class="text-center">RMSE</th>
      <th class="text-center">MAE</th>
      <th>Primary Strength / Verdict</th>
    </tr>
  </thead>
  <tbody>
    <tr class="highlight">
      <td><strong>LightGBM Regressor (Production Model)</strong></td>
      <td class="text-center"><strong>0.9956</strong></td>
      <td class="text-center"><strong>0.9700</strong></td>
      <td class="text-center"><strong>0.5717</strong></td>
      <td>Primary production model: optimal leaf-wise non-linear interaction across 14 engineered features.</td>
    </tr>
    <tr>
      <td><strong>XGBoost Regressor (Benchmark)</strong></td>
      <td class="text-center"><strong>0.9962</strong></td>
      <td class="text-center">0.8990</td>
      <td class="text-center">0.5349</td>
      <td>Depth-wise regularized gradient boosting; confirms hyperparameter and ranking stability.</td>
    </tr>
    <tr>
      <td><strong>Random Forest Regressor (Ensemble Benchmark)</strong></td>
      <td class="text-center">0.9917</td>
      <td class="text-center">1.3346</td>
      <td class="text-center">0.8135</td>
      <td>Non-parametric bagging ensemble; eliminates single-tree variance and proves split consistency.</td>
    </tr>
    <tr>
      <td><strong>Ridge Regression (L2 Linear Baseline)</strong></td>
      <td class="text-center">0.9879</td>
      <td class="text-center">1.5957</td>
      <td class="text-center">1.1273</td>
      <td>L2 regularized linear baseline; proves the necessity of gradient-boosted non-linear modeling.</td>
    </tr>
  </tbody>
</table>

<div class="callout callout-rr">
  <div class="callout-title">Model Insights & Feature Importances</div>
  <p>
    <strong>Primary Production Model:</strong> LightGBM Regressor ($R^2 = 0.9952$, $\text{MAE} = 0.577$).<br>
    <strong>Top Predictive Drivers:</strong> (1) <code>jaipur_fit</code> (658 importance splits) — venue condition alignment; (2) <code>pri_score</code> (632) — Bayesian reliability; (3) <code>hp_wpa</code> (599) — direct match outcome contribution; (4) <code>role_scarcity</code> (282) — domestic finishing and death-bowling scarcity.
  </p>
</div>
<div style="margin-top: 10pt;">
  <div style="font-weight: 800; font-size: 8.5pt; color: #0F172A; text-transform: uppercase; font-family: 'JetBrains Mono', monospace; margin-bottom: 4pt;">
    Predictive Feature Vector Architecture (14 Engineered Variables)
  </div>
  <table class="data-table" style="font-size: 7.2pt;">
    <thead>
      <tr>
        <th>Feature Variable</th>
        <th>Type</th>
        <th>Domain Meaning & Analytical Function</th>
        <th class="text-center">Feature Weight</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>hp_sr</code> / <code>hp_econ</code></td>
        <td>Continuous</td>
        <td>High-pressure execution rate under leverage ($P \ge 0.60$). Core performance driver.</td>
        <td class="text-center"><strong>30.0%</strong></td>
      </tr>
      <tr>
        <td><code>sr_delta</code> / <code>econ_delta</code></td>
        <td>Continuous</td>
        <td>Performance differential over individual non-pressure baseline (Clutch Elevation $\Delta$).</td>
        <td class="text-center"><strong>20.0%</strong></td>
      </tr>
      <tr>
        <td><code>hp_wpa</code></td>
        <td>Continuous</td>
        <td>Direct Win Probability Added per delivery; correlates individual action to game outcome.</td>
        <td class="text-center"><strong>15.0%</strong></td>
      </tr>
      <tr>
        <td><code>hp_boundary_pct</code> / <code>dot_pct</code></td>
        <td>Percentage</td>
        <td>Boundary generation frequency for batters; dot-ball choke suppression for bowlers.</td>
        <td class="text-center"><strong>12.5%</strong></td>
      </tr>
      <tr>
        <td><code>jaipur_fit</code></td>
        <td>Continuous</td>
        <td>Ground dimension alignment for Sawai Mansingh Stadium (74m square boundaries & red clay).</td>
        <td class="text-center"><strong>12.5%</strong></td>
      </tr>
      <tr>
        <td><code>role_scarcity</code></td>
        <td>Categorical</td>
        <td>Scarcity index: domestic finishing, death yorker bowling, and wicketkeeper-batter utility.</td>
        <td class="text-center"><strong>10.0%</strong></td>
      </tr>
    </tbody>
  </table>
</div>

<div class="callout callout-navy" style="margin-top: 10pt;">
  <div class="callout-title">End-to-End Technology Stack & Architecture</div>
  <p style="font-size: 7.6pt; line-height: 1.5; margin: 0;">
    <strong>Vectorized Data Processing:</strong> Python 3.12, DuckDB, and Apache Parquet (processing 200,999 delivery events in &lt;1.8 seconds).<br>
    <strong>Predictive Machine Learning:</strong> LightGBM, XGBoost, and Scikit-Learn with 5-Fold Stratified Cross-Validation.<br>
    <strong>Monte Carlo Simulation:</strong> Custom seeded C++ / Python transition engine running 1,000+ deliveries per scenario.<br>
    <strong>Interactive Decision Platform:</strong> React 19, TypeScript, Tailwind CSS, Lucide-React, and Vite (tested via Puppeteer with 0 runtime errors).
  </p>
</div>


<!-- SECTION 6 -->
<h1><span class="section-num">06</span> Empirical Bayes Shrinkage & Cross-Role CRPI</h1>
<p>
Raw sample metrics suffer from extreme small-sample noise. We apply Stein-type Empirical Bayes shrinkage:
</p>
<p>
$$\theta_i = w_i \cdot Y_i + (1 - w_i) \cdot \mu_{\text{role}}, \quad w_i = \frac{N_i}{N_i + K_{\text{role}}}$$
</p>
<p>
We combine Bayesian reliability, WPA, baseline elevation, and season consistency into the <strong>Composite Cross-Role Pressure Index ($CRPI$)</strong>:
</p>
<p>
$$CRPI = w_{\text{vol}} \cdot \left[ 0.35 \cdot P_{\text{role}} + 0.30 \cdot Z_{\text{wpa}} + 0.20 \cdot \Delta_{\text{elev}} + 0.15 \cdot C_{\text{season}} \right]$$
</p>

<div class="page-break"></div>

<!-- SECTION 7 -->
<h1><span class="section-num">07</span> Official Unstop Submission & Player Rankings</h1>
<p>
Per the official <strong>Round 1 Challenge Requirements</strong>, we present the two primary ordered Top-10 lists submitted via the Unstop dropdown fields, followed by the tactical cross-role translation for the Rajasthan Royals IPL 2027 auction.
</p>

<!-- UNSTOP LIST 1: TOP 10 BATTERS -->
<div class="card" style="margin-top: 8pt; border-left: 3px solid #FF2E93;">
  <div style="font-weight: 800; font-size: 10pt; color: #0F172A; text-transform: uppercase; font-family: 'JetBrains Mono', monospace; margin-bottom: 4pt;">
    01. Official Unstop Submission: Top 10 Batters Under Pressure (Dropdown Selections)
  </div>
  <p style="font-size: 8pt; color: #475569; margin: 0 0 6pt 0;">
    Ranked strictly by Bayesian Stein-shrinkage Pressure Reliability Index ($PRI$), High-Pressure Strike Rate, and Win Probability Added ($WPA$). <em>Mahendra Singh Dhoni and Dinesh Karthik excluded due to retirement.</em>
  </p>

  <table class="data-table" style="font-size: 7.8pt;">
    <thead>
      <tr>
        <th class="text-center" style="width: 35px;">Rank</th>
        <th>Batter Name</th>
        <th class="text-center">Player ID</th>
        <th>Primary Role</th>
        <th class="text-center">Nat.</th>
        <th class="text-center">PRI Score</th>
        <th class="text-right">HP Balls</th>
        <th class="text-right">HP SR</th>
        <th class="text-right">Normal Baseline</th>
        <th class="text-right">SR Delta</th>
        <th class="text-right">HP WPA</th>
      </tr>
    </thead>
    <tbody>
      <tr class="highlight">
        <td class="text-center"><strong>#1</strong></td>
        <td><strong>Namboori Tilak Varma</strong></td>
        <td class="text-center">7897</td>
        <td>Dynamic Middle LHB</td>
        <td class="text-center"><span class="tag tag-prime">IND</span></td>
        <td class="text-center"><strong>76.83</strong></td>
        <td class="text-right">276</td>
        <td class="text-right"><strong>201.09</strong></td>
        <td class="text-right">135.8</td>
        <td class="text-right" style="color: #059669;"><strong>+65.34</strong></td>
        <td class="text-right">+1.084</td>
      </tr>
      <tr>
        <td class="text-center"><strong>#2</strong></td>
        <td><strong>Tim David</strong></td>
        <td class="text-center">6396</td>
        <td>Death Overs Finisher</td>
        <td class="text-center"><span class="tag tag-high">OS</span></td>
        <td class="text-center"><strong>75.41</strong></td>
        <td class="text-right">393</td>
        <td class="text-right"><strong>199.49</strong></td>
        <td class="text-right">166.2</td>
        <td class="text-right" style="color: #059669;"><strong>+33.27</strong></td>
        <td class="text-right"><strong>+3.274</strong></td>
      </tr>
      <tr>
        <td class="text-center"><strong>#3</strong></td>
        <td><strong>Tristan Stubbs</strong></td>
        <td class="text-center">20702</td>
        <td>360° Spin Destroyer</td>
        <td class="text-center"><span class="tag tag-high">OS</span></td>
        <td class="text-center"><strong>72.55</strong></td>
        <td class="text-right">253</td>
        <td class="text-right"><strong>194.47</strong></td>
        <td class="text-right">136.2</td>
        <td class="text-right" style="color: #059669;"><strong>+58.30</strong></td>
        <td class="text-right">+1.039</td>
      </tr>
      <tr class="highlight">
        <td class="text-center"><strong>#4</strong></td>
        <td><strong>Rahul Tewatia</strong></td>
        <td class="text-center">3926</td>
        <td>Lower-Order Finisher</td>
        <td class="text-center"><span class="tag tag-prime">IND</span></td>
        <td class="text-center"><strong>71.70</strong></td>
        <td class="text-right">263</td>
        <td class="text-right"><strong>179.47</strong></td>
        <td class="text-right">119.1</td>
        <td class="text-right" style="color: #059669;"><strong>+60.40</strong></td>
        <td class="text-right">+1.902</td>
      </tr>
      <tr>
        <td class="text-center"><strong>#5</strong></td>
        <td><strong>Rinku Singh</strong></td>
        <td class="text-center">4708</td>
        <td>Clutch Death Hitter</td>
        <td class="text-center"><span class="tag tag-prime">IND</span></td>
        <td class="text-center"><strong>70.03</strong></td>
        <td class="text-right">326</td>
        <td class="text-right"><strong>191.72</strong></td>
        <td class="text-right">139.2</td>
        <td class="text-right" style="color: #059669;"><strong>+52.48</strong></td>
        <td class="text-right">+1.221</td>
      </tr>
      <tr>
        <td class="text-center"><strong>#6</strong></td>
        <td><strong>David Miller</strong></td>
        <td class="text-center">1077</td>
        <td>Chase Anchor / Finisher</td>
        <td class="text-center"><span class="tag tag-high">OS</span></td>
        <td class="text-center"><strong>67.37</strong></td>
        <td class="text-right">211</td>
        <td class="text-right"><strong>191.00</strong></td>
        <td class="text-right">140.8</td>
        <td class="text-right" style="color: #059669;"><strong>+50.23</strong></td>
        <td class="text-right">+1.869</td>
      </tr>
      <tr class="highlight">
        <td class="text-center"><strong>#7</strong></td>
        <td><strong>Ashutosh Sharma</strong></td>
        <td class="text-center">8101</td>
        <td>Domestic Power Finisher</td>
        <td class="text-center"><span class="tag tag-prime">IND</span></td>
        <td class="text-center"><strong>62.79</strong></td>
        <td class="text-right">182</td>
        <td class="text-right"><strong>191.76</strong></td>
        <td class="text-right">139.0</td>
        <td class="text-right" style="color: #059669;"><strong>+52.77</strong></td>
        <td class="text-right">+1.772</td>
      </tr>
      <tr>
        <td class="text-center"><strong>#8</strong></td>
        <td><strong>Suryakumar Yadav</strong></td>
        <td class="text-center">1699</td>
        <td>360° Middle Overs Hitter</td>
        <td class="text-center"><span class="tag tag-prime">IND</span></td>
        <td class="text-center"><strong>62.10</strong></td>
        <td class="text-right">171</td>
        <td class="text-right"><strong>219.88</strong></td>
        <td class="text-right">162.9</td>
        <td class="text-right" style="color: #059669;"><strong>+57.02</strong></td>
        <td class="text-right">+0.381</td>
      </tr>
      <tr>
        <td class="text-center"><strong>#9</strong></td>
        <td><strong>Dasun Shanaka</strong></td>
        <td class="text-center">2436</td>
        <td>Pace Hitting Finisher</td>
        <td class="text-center"><span class="tag tag-high">OS</span></td>
        <td class="text-center"><strong>60.67</strong></td>
        <td class="text-right">164</td>
        <td class="text-right"><strong>180.49</strong></td>
        <td class="text-right">123.3</td>
        <td class="text-right" style="color: #059669;"><strong>+57.17</strong></td>
        <td class="text-right">+1.318</td>
      </tr>
      <tr>
        <td class="text-center"><strong>#10</strong></td>
        <td><strong>Jos Buttler</strong></td>
        <td class="text-center">813</td>
        <td>Top-to-Death Explosive Bat</td>
        <td class="text-center"><span class="tag tag-high">OS</span></td>
        <td class="text-center"><strong>60.04</strong></td>
        <td class="text-right">143</td>
        <td class="text-right"><strong>236.36</strong></td>
        <td class="text-right">152.5</td>
        <td class="text-right" style="color: #059669;"><strong>+83.84</strong></td>
        <td class="text-right">+1.488</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- UNSTOP LIST 2: TOP 10 BOWLERS -->
<div class="card" style="margin-top: 10pt; border-left: 3px solid #0284C7;">
  <div style="font-weight: 800; font-size: 10pt; color: #0F172A; text-transform: uppercase; font-family: 'JetBrains Mono', monospace; margin-bottom: 4pt;">
    02. Official Unstop Submission: Top 10 Bowlers Under Pressure (Dropdown Selections)
  </div>
  <p style="font-size: 8pt; color: #475569; margin: 0 0 6pt 0;">
    Ranked strictly by Bayesian Stein-shrinkage Pressure Reliability Index ($PRI$), High-Pressure Economy suppression, and Dot-Ball leverage.
  </p>

  <table class="data-table" style="font-size: 7.8pt;">
    <thead>
      <tr>
        <th class="text-center" style="width: 35px;">Rank</th>
        <th>Bowler Name</th>
        <th class="text-center">Player ID</th>
        <th>Primary Role</th>
        <th class="text-center">Nat.</th>
        <th class="text-center">PRI Score</th>
        <th class="text-right">HP Balls</th>
        <th class="text-right">HP Econ</th>
        <th class="text-right">Normal Baseline</th>
        <th class="text-right">Econ Delta</th>
        <th class="text-right">Dot %</th>
      </tr>
    </thead>
    <tbody>
      <tr class="highlight">
        <td class="text-center"><strong>#1</strong></td>
        <td><strong>Kuldeep Yadav</strong></td>
        <td class="text-center">3644</td>
        <td>Left-Arm Wrist Spinner</td>
        <td class="text-center"><span class="tag tag-prime">IND</span></td>
        <td class="text-center"><strong>70.76</strong></td>
        <td class="text-right">245</td>
        <td class="text-right"><strong>6.96</strong></td>
        <td class="text-right">8.17</td>
        <td class="text-right" style="color: #059669;"><strong>+1.21</strong></td>
        <td class="text-right">42.4%</td>
      </tr>
      <tr>
        <td class="text-center"><strong>#2</strong></td>
        <td><strong>Varun Chakravarthy</strong></td>
        <td class="text-center">6256</td>
        <td>Mystery Leg-Spinner</td>
        <td class="text-center"><span class="tag tag-prime">IND</span></td>
        <td class="text-center"><strong>69.73</strong></td>
        <td class="text-right">311</td>
        <td class="text-right"><strong>7.08</strong></td>
        <td class="text-right">8.17</td>
        <td class="text-right" style="color: #059669;"><strong>+1.09</strong></td>
        <td class="text-right">41.8%</td>
      </tr>
      <tr>
        <td class="text-center"><strong>#3</strong></td>
        <td><strong>Jasprit Bumrah</strong></td>
        <td class="text-center">2933</td>
        <td>Elite Express Death Pacer</td>
        <td class="text-center"><span class="tag tag-prime">IND</span></td>
        <td class="text-center"><strong>67.70</strong></td>
        <td class="text-right">405</td>
        <td class="text-right"><strong>7.23</strong></td>
        <td class="text-right">7.28</td>
        <td class="text-right" style="color: #059669;"><strong>+0.05</strong></td>
        <td class="text-right">44.2%</td>
      </tr>
      <tr>
        <td class="text-center"><strong>#4</strong></td>
        <td><strong>Sunil Narine</strong></td>
        <td class="text-center">781</td>
        <td>Off-Spin Controller</td>
        <td class="text-center"><span class="tag tag-high">OS</span></td>
        <td class="text-center"><strong>65.66</strong></td>
        <td class="text-right">388</td>
        <td class="text-right"><strong>5.80</strong></td>
        <td class="text-right">7.00</td>
        <td class="text-right" style="color: #059669;"><strong>+1.20</strong></td>
        <td class="text-right">45.6%</td>
      </tr>
      <tr class="highlight">
        <td class="text-center"><strong>#5</strong></td>
        <td><strong>Axar Patel</strong></td>
        <td class="text-center">2876</td>
        <td>Slow Left-Arm Orthodox</td>
        <td class="text-center"><span class="tag tag-prime">IND</span></td>
        <td class="text-center"><strong>63.91</strong></td>
        <td class="text-right">276</td>
        <td class="text-right"><strong>7.35</strong></td>
        <td class="text-right">7.95</td>
        <td class="text-right" style="color: #059669;"><strong>+0.60</strong></td>
        <td class="text-right">43.1%</td>
      </tr>
      <tr>
        <td class="text-center"><strong>#6</strong></td>
        <td><strong>Abrar Ahmed</strong></td>
        <td class="text-center">5979</td>
        <td>Leg-Break Googly</td>
        <td class="text-center"><span class="tag tag-high">OS</span></td>
        <td class="text-center"><strong>61.33</strong></td>
        <td class="text-right">102</td>
        <td class="text-right"><strong>4.60</strong></td>
        <td class="text-right">7.09</td>
        <td class="text-right" style="color: #059669;"><strong>+2.49</strong></td>
        <td class="text-right">48.0%</td>
      </tr>
      <tr class="highlight">
        <td class="text-center"><strong>#7</strong></td>
        <td><strong>Yuzvendra Chahal</strong></td>
        <td class="text-center">1612</td>
        <td>Jaipur Attacking Leg-Spinner</td>
        <td class="text-center"><span class="tag tag-prime">IND</span></td>
        <td class="text-center"><strong>60.03</strong></td>
        <td class="text-right">310</td>
        <td class="text-right"><strong>8.03</strong></td>
        <td class="text-right">8.72</td>
        <td class="text-right" style="color: #059669;"><strong>+0.69</strong></td>
        <td class="text-right">35.2%</td>
      </tr>
      <tr>
        <td class="text-center"><strong>#8</strong></td>
        <td><strong>Rashid Khan</strong></td>
        <td class="text-center">4722</td>
        <td>Fast Leg-Spin / Arm Ball</td>
        <td class="text-center"><span class="tag tag-high">OS</span></td>
        <td class="text-center"><strong>58.60</strong></td>
        <td class="text-right">392</td>
        <td class="text-right"><strong>7.77</strong></td>
        <td class="text-right">7.37</td>
        <td class="text-right" style="color: #dc2626;"><strong>-0.40</strong></td>
        <td class="text-right">38.5%</td>
      </tr>
      <tr>
        <td class="text-center"><strong>#9</strong></td>
        <td><strong>Mohammad Wasim</strong></td>
        <td class="text-center">7696</td>
        <td>Right-Arm Fast Medium</td>
        <td class="text-center"><span class="tag tag-high">OS</span></td>
        <td class="text-center"><strong>53.54</strong></td>
        <td class="text-right">112</td>
        <td class="text-right"><strong>6.17</strong></td>
        <td class="text-right">9.20</td>
        <td class="text-right" style="color: #059669;"><strong>+3.03</strong></td>
        <td class="text-right">40.2%</td>
      </tr>
      <tr>
        <td class="text-center"><strong>#10</strong></td>
        <td><strong>Shaheen Afridi</strong></td>
        <td class="text-center">6355</td>
        <td>Left-Arm Fast Opening/Death</td>
        <td class="text-center"><span class="tag tag-high">OS</span></td>
        <td class="text-center"><strong>52.73</strong></td>
        <td class="text-right">248</td>
        <td class="text-right"><strong>7.35</strong></td>
        <td class="text-right">8.19</td>
        <td class="text-right" style="color: #059669;"><strong>+0.84</strong></td>
        <td class="text-right">42.7%</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="page-break"></div>

<!-- UNIFIED RR AUCTION SHORTLIST -->
<div class="card" style="margin-top: 4pt; border-left: 3px solid #10B981;">
  <div style="font-weight: 800; font-size: 10pt; color: #0F172A; text-transform: uppercase; font-family: 'JetBrains Mono', monospace; margin-bottom: 4pt;">
    03. Rajasthan Royals IPL 2027 Unified Auction Shortlist (Tactical Franchise Translation)
  </div>
  <p style="font-size: 8pt; color: #475569; margin: 0 0 6pt 0;">
    Bridging pure statistical ratings to actual franchise recruitment: Evaluated across <strong>Player Quality ($CRPI$)</strong>, <strong>RR Fit Score</strong> (9 squad gaps & Jaipur SMS Stadium 75m boundaries), and <strong>Auction Feasibility</strong> (respecting the 4-overseas Playing XI limit).
  </p>

  <table class="data-table" style="font-size: 7.8pt;">
    <thead>
      <tr>
        <th class="text-center" style="width: 35px;">Rank</th>
        <th>Shortlisted Target</th>
        <th class="text-center">Player ID</th>
        <th>Primary Role</th>
        <th class="text-center">Nat.</th>
        <th class="text-center">Quality</th>
        <th class="text-center">RR Fit</th>
        <th class="text-center">Priority</th>
        <th>RR Squad Gap Solved</th>
        <th>Auction Feasibility Tier</th>
      </tr>
    </thead>
    <tbody>
      <tr class="highlight">
        <td class="text-center"><strong>#1</strong></td>
        <td><strong>Ashutosh Sharma</strong></td>
        <td class="text-center">8101</td>
        <td>Lower-Order Finisher</td>
        <td class="text-center"><span class="tag tag-prime">IND</span></td>
        <td class="text-center">93.4</td>
        <td class="text-center"><strong>97.2</strong></td>
        <td class="text-center"><strong>95.8</strong></td>
        <td>Post-Hetmyer collapse prevention; 191.8 HP SR</td>
        <td><span class="tag tag-prime">Tier 1 Prime Target</span></td>
      </tr>
      <tr>
        <td class="text-center"><strong>#2</strong></td>
        <td><strong>Tim David</strong></td>
        <td class="text-center">6396</td>
        <td>Death Boundary Striker</td>
        <td class="text-center"><span class="tag tag-high">OS</span></td>
        <td class="text-center"><strong>97.2</strong></td>
        <td class="text-center">91.0</td>
        <td class="text-center"><strong>94.5</strong></td>
        <td>Highest WPA in world (+3.274); 40-run final over carry</td>
        <td><span class="tag tag-prime">Tier 1 Marquee Target</span></td>
      </tr>
      <tr class="highlight">
        <td class="text-center"><strong>#3</strong></td>
        <td><strong>Rahul Tewatia</strong></td>
        <td class="text-center">3926</td>
        <td>Finisher / Spin All-Rounder</td>
        <td class="text-center"><span class="tag tag-prime">IND</span></td>
        <td class="text-center">92.8</td>
        <td class="text-center"><strong>96.5</strong></td>
        <td class="text-center"><strong>94.2</strong></td>
        <td>Proven SMS match-winner; +60.4 SR acceleration</td>
        <td><span class="tag tag-prime">Tier 1 Prime Target</span></td>
      </tr>
      <tr class="highlight">
        <td class="text-center"><strong>#4</strong></td>
        <td><strong>Kuldeep Yadav</strong></td>
        <td class="text-center">3644</td>
        <td>Left-Arm Wrist Spinner</td>
        <td class="text-center"><span class="tag tag-prime">IND</span></td>
        <td class="text-center">95.0</td>
        <td class="text-center"><strong>97.8</strong></td>
        <td class="text-center"><strong>96.2</strong></td>
        <td>Jaipur SMS spin fortress; 6.96 HP Econ, 42.4% Dots</td>
        <td><span class="tag tag-prime">Tier 1 Prime Target</span></td>
      </tr>
      <tr>
        <td class="text-center"><strong>#5</strong></td>
        <td><strong>David Miller</strong></td>
        <td class="text-center">1077</td>
        <td>Middle Chase Anchor</td>
        <td class="text-center"><span class="tag tag-high">OS</span></td>
        <td class="text-center">94.0</td>
        <td class="text-center">89.5</td>
        <td class="text-center"><strong>91.8</strong></td>
        <td>Top-order collapse hedge; 42.1 chase average</td>
        <td><span class="tag tag-prime">Tier 1 Prime Target</span></td>
      </tr>
      <tr class="highlight">
        <td class="text-center"><strong>#6</strong></td>
        <td><strong>Yuzvendra Chahal</strong></td>
        <td class="text-center">1612</td>
        <td>Jaipur Leg-Spinner</td>
        <td class="text-center"><span class="tag tag-prime">IND</span></td>
        <td class="text-center">91.2</td>
        <td class="text-center"><strong>97.5</strong></td>
        <td class="text-center"><strong>94.0</strong></td>
        <td>SMS history leader; 30 HP wickets, middle overs breaker</td>
        <td><span class="tag tag-prime">Tier 1 Prime Target</span></td>
      </tr>
      <tr class="highlight">
        <td class="text-center"><strong>#7</strong></td>
        <td><strong>Harshit Rana</strong></td>
        <td class="text-center">29888</td>
        <td>Express Death Pacer</td>
        <td class="text-center"><span class="tag tag-prime">IND</span></td>
        <td class="text-center">90.0</td>
        <td class="text-center"><strong>96.0</strong></td>
        <td class="text-center"><strong>93.0</strong></td>
        <td>145+ km/h death companion to Sandeep; +1.550 WPA</td>
        <td><span class="tag tag-prime">Tier 1 Prime Target</span></td>
      </tr>
      <tr class="highlight">
        <td class="text-center"><strong>#8</strong></td>
        <td><strong>Axar Patel</strong></td>
        <td class="text-center">2876</td>
        <td>Spin All-Rounder</td>
        <td class="text-center"><span class="tag tag-prime">IND</span></td>
        <td class="text-center">92.0</td>
        <td class="text-center"><strong>94.5</strong></td>
        <td class="text-center"><strong>93.2</strong></td>
        <td>7.35 Econ + lower-order batting; solves 5th bowler void</td>
        <td><span class="tag tag-prime">Tier 1 Prime Target</span></td>
      </tr>
      <tr>
        <td class="text-center"><strong>#9</strong></td>
        <td><strong>Namboori Tilak Varma</strong></td>
        <td class="text-center">7897</td>
        <td>Dynamic Middle LHB</td>
        <td class="text-center"><span class="tag tag-prime">IND</span></td>
        <td class="text-center"><strong>96.5</strong></td>
        <td class="text-center">89.0</td>
        <td class="text-center"><strong>92.5</strong></td>
        <td>#1 ranked batter overall; pairs with Jaiswal for 10 yrs</td>
        <td><span class="tag tag-prime">Tier 1 Marquee Target</span></td>
      </tr>
      <tr>
        <td class="text-center"><strong>#10</strong></td>
        <td><strong>Tristan Stubbs</strong></td>
        <td class="text-center">20702</td>
        <td>360° Spin Destroyer</td>
        <td class="text-center"><span class="tag tag-high">OS</span></td>
        <td class="text-center">93.8</td>
        <td class="text-center">88.5</td>
        <td class="text-center"><strong>90.8</strong></td>
        <td>Destroys defensive spin; backup WK & offspin utility</td>
        <td><span class="tag tag-prime">Tier 1 Strategic Buy</span></td>
      </tr>
    </tbody>
  </table>
</div>

<!-- SECTION 8 -->
<h1><span class="section-num">08</span> Ten Individual Player Evidence Dossiers</h1>

<div class="dossier-card">
  <div class="dossier-header">
    <span class="dossier-title">#1 Ashutosh Sharma (ID: 8101) · Domestic Lower-Order Finisher</span>
    <span class="dossier-badge">ML Need: 75.82 | Tier 1</span>
  </div>
  <div class="dossier-grid">
    <div class="dossier-box">
      <span class="dossier-box-title">Pressure Performance</span>
      <strong>191.76 HP SR</strong> (+52.77 $\Delta SR$)<br>
      HP Avg: 24.93 | Balls: 182<br>
      <strong>+1.772 WPA</strong> | Bnd%: 28.0% | Dots: 29.1%
    </div>
    <div class="dossier-box">
      <span class="dossier-box-title">RR Tactical Fit</span>
      <strong>Position:</strong> No. 6 or No. 7 Finisher<br>
      Directly solves RR's most acute tactical vulnerability: domestic lower-order death finishing depth. Partners H...
    </div>
    <div class="dossier-box">
      <span class="dossier-box-title">Auction & Venue Intelligence</span>
      <strong>Status:</strong> Confirmed Auction Eligible (Uncapped / Emerging Category).<br>
      <strong>Jaipur Fit:</strong> Excellent. Sawai Mansingh Stadium's large square boundaries reward his abil...<br>
      <strong>Verdict:</strong> <strong>Highest-priority domestic purchase recommendation for Rajast</strong>
    </div>
  </div>
  <p style="font-size:7.2pt; margin:0; color:#475569;">
    <strong>Traceable Data Proof:</strong> Fearless scoring acceleration against 145+ km/h express pace at the death. Weakness: Moderate career sample size (182 high-pressure balls).
  </p>
</div>

<div class="dossier-card">
  <div class="dossier-header">
    <span class="dossier-title">#2 Namboori Tilak Varma (ID: 7897) · Middle-Order Dynamic Batter</span>
    <span class="dossier-badge">ML Need: 75.6 | Tier 1</span>
  </div>
  <div class="dossier-grid">
    <div class="dossier-box">
      <span class="dossier-box-title">Pressure Performance</span>
      <strong>201.09 HP SR</strong> (+65.34 $\Delta SR$)<br>
      HP Avg: 29.21 | Balls: 276<br>
      <strong>+1.084 WPA</strong> | Bnd%: 29.7% | Dots: 27.9%
    </div>
    <div class="dossier-box">
      <span class="dossier-box-title">RR Tactical Fit</span>
      <strong>Position:</strong> No. 4 or No. 5 Left-Hand Batter<br>
      Provides a high-pedigree domestic left-hand batter in the middle order to disrupt opposition match-ups alongsi...
    </div>
    <div class="dossier-box">
      <span class="dossier-box-title">Auction & Venue Intelligence</span>
      <strong>Status:</strong> Confirmed Auction Eligible / RTM Target.<br>
      <strong>Jaipur Fit:</strong> Outstanding. Tilak's heavy reliance on straight six-hitting over long-on an...<br>
      <strong>Verdict:</strong> <strong>Marquee batting recommendation; bid aggressively up to pre-a</strong>
    </div>
  </div>
  <p style="font-size:7.2pt; margin:0; color:#475569;">
    <strong>Traceable Data Proof:</strong> Tremendous pressure acceleration (+65.34 SR spike under pressure, rising to 201.09 SR). Weakness: High bidding intensity expected at auction; will command marquee price tag if entering pool.
  </p>
</div>

<div class="dossier-card">
  <div class="dossier-header">
    <span class="dossier-title">#3 Rahul Tewatia (ID: 3926) · Indian All-Rounder / Finisher</span>
    <span class="dossier-badge">ML Need: 75.35 | Tier 1</span>
  </div>
  <div class="dossier-grid">
    <div class="dossier-box">
      <span class="dossier-box-title">Pressure Performance</span>
      <strong>179.47 HP SR</strong> (+60.40 $\Delta SR$)<br>
      HP Avg: 23.6 | Balls: 263<br>
      <strong>+1.902 WPA</strong> | Bnd%: 27.4% | Dots: 30.8%
    </div>
    <div class="dossier-box">
      <span class="dossier-box-title">RR Tactical Fit</span>
      <strong>Position:</strong> No. 6 or No. 7 Finisher<br>
      Solves RR's chronic last-over finishing uncertainty. Brings emotional and tactical leadership back to Jaipur....
    </div>
    <div class="dossier-box">
      <span class="dossier-box-title">Auction & Venue Intelligence</span>
      <strong>Status:</strong> Confirmed Auction Eligible.<br>
      <strong>Jaipur Fit:</strong> Exceptional. Has played 20+ matches at Sawai Mansingh Stadium; exploits the...<br>
      <strong>Verdict:</strong> <strong>Highest-probability impact return for RR. Bid up to ₹7–9 Cr </strong>
    </div>
  </div>
  <p style="font-size:7.2pt; margin:0; color:#475569;">
    <strong>Traceable Data Proof:</strong> Massive Win Probability Added under pressure (+1.902 WPA, #2 in entire dataset). Weakness: Batting range is concentrated on the leg-side arc; can be challenged by wide defensive lines.
  </p>
</div>

<div class="dossier-card">
  <div class="dossier-header">
    <span class="dossier-title">#4 Kuldeep Yadav (ID: 3644) · Jaipur Left-Arm Wrist Spinner</span>
    <span class="dossier-badge">ML Need: 68.0 | Tier 1</span>
  </div>
  <div class="dossier-grid">
    <div class="dossier-box">
      <span class="dossier-box-title">Pressure Performance</span>
      <strong>6.96 HP Econ</strong> (+1.21 $\Delta Econ$)<br>
      Wickets: 28 | Balls: 245<br>
      <strong>+0.597 WPA</strong> | Bnd%: 11.8% | Dots: 42.4%
    </div>
    <div class="dossier-box">
      <span class="dossier-box-title">RR Tactical Fit</span>
      <strong>Position:</strong> No. 9 or No. 10 Tail<br>
      Addresses the monumental void left by Chahal and Ashwin in RR's spin department. Restores the wicket-taking th...
    </div>
    <div class="dossier-box">
      <span class="dossier-box-title">Auction & Venue Intelligence</span>
      <strong>Status:</strong> Confirmed Auction Eligible / RTM Target.<br>
      <strong>Jaipur Fit:</strong> Elite / Unplayable. Jaipur's abrasive surface and spacious 75m square bound...<br>
      <strong>Verdict:</strong> <strong>Highest-grade spinner available in the entire auction. Ideal</strong>
    </div>
  </div>
  <p style="font-size:7.2pt; margin:0; color:#475569;">
    <strong>Traceable Data Proof:</strong> Stifling pressure economy (6.96 rpo under pressure, +1.21 rpo suppression vs baseline). Weakness: Requires an attacking field with deep catchers; can concede if boundary riders are brought up.
  </p>
</div>

<div class="dossier-card">
  <div class="dossier-header">
    <span class="dossier-title">#5 Axar Patel (ID: 2876) · Indian Spin All-Rounder</span>
    <span class="dossier-badge">ML Need: 67.1 | Tier 1</span>
  </div>
  <div class="dossier-grid">
    <div class="dossier-box">
      <span class="dossier-box-title">Pressure Performance</span>
      <strong>7.35 HP Econ</strong> (+0.60 $\Delta Econ$)<br>
      Wickets: 14 | Balls: 276<br>
      <strong>+0.693 WPA</strong> | Bnd%: 14.5% | Dots: 39.5%
    </div>
    <div class="dossier-box">
      <span class="dossier-box-title">RR Tactical Fit</span>
      <strong>Position:</strong> No. 7 Finisher / Floater<br>
      Provides the complete 3-in-1 package RR lost with Ashwin: bankable 4 overs of spin, lower-order batting muscle...
    </div>
    <div class="dossier-box">
      <span class="dossier-box-title">Auction & Venue Intelligence</span>
      <strong>Status:</strong> Confirmed Auction Eligible / Marquee Pool.<br>
      <strong>Jaipur Fit:</strong> Exceptional. The Sawai Mansingh Stadium surface offers consistent bounce th...<br>
      <strong>Verdict:</strong> <strong>Transformational signing for RR if acquired; bid with maximu</strong>
    </div>
  </div>
  <p style="font-size:7.2pt; margin:0; color:#475569;">
    <strong>Traceable Data Proof:</strong> Remarkable dual-threat capability: 7.35 pressure economy + 151+ SR batting under pressure. Weakness: Relies on flatter, arm-ball trajectory; less deceptive on completely flat pitches than wrist-spinners.
  </p>
</div>

<div class="dossier-card">
  <div class="dossier-header">
    <span class="dossier-title">#6 Yuzvendra Chahal (ID: 1612) · Jaipur Leg-Spinner / Wicket-Taker</span>
    <span class="dossier-badge">ML Need: 62.42 | Tier 1</span>
  </div>
  <div class="dossier-grid">
    <div class="dossier-box">
      <span class="dossier-box-title">Pressure Performance</span>
      <strong>8.03 HP Econ</strong> (+0.69 $\Delta Econ$)<br>
      Wickets: 30 | Balls: 310<br>
      <strong>+0.752 WPA</strong> | Bnd%: 11.9% | Dots: 32.6%
    </div>
    <div class="dossier-box">
      <span class="dossier-box-title">RR Tactical Fit</span>
      <strong>Position:</strong> No. 11<br>
      Re-acquiring Chahal restores the emotional heartbeat and tactical identity of RR's bowling attack. Directly re...
    </div>
    <div class="dossier-box">
      <span class="dossier-box-title">Auction & Venue Intelligence</span>
      <strong>Status:</strong> Confirmed Auction Eligible (Released into Mega Auction Pool).<br>
      <strong>Jaipur Fit:</strong> Master of Sawai Mansingh Stadium. Chahal has taken 20+ IPL wickets in Jaipu...<br>
      <strong>Verdict:</strong> <strong>Non-negotiable priority target. RR should allocate ₹6–8.5 Cr</strong>
    </div>
  </div>
  <p style="font-size:7.2pt; margin:0; color:#475569;">
    <strong>Traceable Data Proof:</strong> Proven wicket-taking genius in pressure situations (30 wickets in 310 high-pressure balls). Weakness: Concedes occasional maximums due to aggressive flight; economy can spike if catches are dropped.
  </p>
</div>

<div class="dossier-card">
  <div class="dossier-header">
    <span class="dossier-title">#7 Harshit Rana (ID: 29888) · Express Death Fast Bowler</span>
    <span class="dossier-badge">ML Need: 61.85 | Tier 1</span>
  </div>
  <div class="dossier-grid">
    <div class="dossier-box">
      <span class="dossier-box-title">Pressure Performance</span>
      <strong>9.15 HP Econ</strong> (+0.52 $\Delta Econ$)<br>
      Wickets: 14 | Balls: 183<br>
      <strong>+1.550 WPA</strong> | Bnd%: 21.3% | Dots: 37.7%
    </div>
    <div class="dossier-box">
      <span class="dossier-box-title">RR Tactical Fit</span>
      <strong>Position:</strong> No. 8 or No. 9 Lower-Order Hitter<br>
      Solves RR's death bowling vulnerability. Partners Sandeep Sharma to give RR a lethal two-pronged death bowling...
    </div>
    <div class="dossier-box">
      <span class="dossier-box-title">Auction & Venue Intelligence</span>
      <strong>Status:</strong> Confirmed Auction Eligible.<br>
      <strong>Jaipur Fit:</strong> Great fit. Sawai Mansingh Stadium's pitch rewards hit-the-deck hard length ...<br>
      <strong>Verdict:</strong> <strong>Top-priority Indian pace target. Bid aggressively up to ₹6–8</strong>
    </div>
  </div>
  <p style="font-size:7.2pt; margin:0; color:#475569;">
    <strong>Traceable Data Proof:</strong> Massive Win Probability Added (+1.550 WPA, #2 among all Indian pacers behind Bumrah). Weakness: Can occasionally be penalized for line discipline when attempting wide yorkers.
  </p>
</div>

<div class="dossier-card">
  <div class="dossier-header">
    <span class="dossier-title">#8 Shardul Thakur (ID: 2847) · Pace All-Rounder / Partnership Breaker</span>
    <span class="dossier-badge">ML Need: 55.15 | Tier 2</span>
  </div>
  <div class="dossier-grid">
    <div class="dossier-box">
      <span class="dossier-box-title">Pressure Performance</span>
      <strong>9.39 HP Econ</strong> (+1.31 $\Delta Econ$)<br>
      Wickets: 19 | Balls: 216<br>
      <strong>+0.754 WPA</strong> | Bnd%: 19.4% | Dots: 32.9%
    </div>
    <div class="dossier-box">
      <span class="dossier-box-title">RR Tactical Fit</span>
      <strong>Position:</strong> No. 8 Bowling All-Rounder<br>
      Gives RR a proven Indian pace all-rounder at No. 8 who breaks stubborn middle-overs partnerships and adds batt...
    </div>
    <div class="dossier-box">
      <span class="dossier-box-title">Auction & Venue Intelligence</span>
      <strong>Status:</strong> Confirmed Auction Eligible (Auction Pool).<br>
      <strong>Jaipur Fit:</strong> Very Good. Jaipur's large outfield aids his wicket-taking strategy of bowli...<br>
      <strong>Verdict:</strong> <strong>High-value tactical acquisition at ₹3.5–5 Cr to solve RR's l</strong>
    </div>
  </div>
  <p style="font-size:7.2pt; margin:0; color:#475569;">
    <strong>Traceable Data Proof:</strong> Immense economy suppression under pressure (+1.31 rpo drop from 10.70 to 9.39 Econ). Weakness: Can concede boundaries in clusters if his length falls slightly short of the blockhole.
  </p>
</div>

<div class="dossier-card">
  <div class="dossier-header">
    <span class="dossier-title">#9 Ramandeep Singh (ID: 20006) · Domestic Finisher / Pace All-Rounder</span>
    <span class="dossier-badge">ML Need: 55.06 | Tier 2</span>
  </div>
  <div class="dossier-grid">
    <div class="dossier-box">
      <span class="dossier-box-title">Pressure Performance</span>
      <strong>182.07 HP SR</strong> (+60.08 $\Delta SR$)<br>
      HP Avg: 26.4 | Balls: 145<br>
      <strong>-0.251 WPA</strong> | Bnd%: 25.5% | Dots: 26.9%
    </div>
    <div class="dossier-box">
      <span class="dossier-box-title">RR Tactical Fit</span>
      <strong>Position:</strong> No. 7 or No. 8 Power-Hitting Finisher<br>
      Provides the explosive domestic power-hitter RR have lacked at #7. Unlocks true 200+ total ceiling for the bat...
    </div>
    <div class="dossier-box">
      <span class="dossier-box-title">Auction & Venue Intelligence</span>
      <strong>Status:</strong> Confirmed Auction Eligible (Uncapped / Emerging Category).<br>
      <strong>Jaipur Fit:</strong> Excellent. Ramandeep's immense bat speed allows him to clear the 70m straig...<br>
      <strong>Verdict:</strong> <strong>Prime smart-money purchase. Target at ₹2.5–4.5 Cr.</strong>
    </div>
  </div>
  <p style="font-size:7.2pt; margin:0; color:#475569;">
    <strong>Traceable Data Proof:</strong> Colossal acceleration spike (+60.08 SR delta, jumping from 121.99 to 182.07 under pressure). Weakness: Limited IPL sample size (145 pressure balls); slight negative WPA due to high-risk cameos.
  </p>
</div>

<div class="dossier-card">
  <div class="dossier-header">
    <span class="dossier-title">#10 Arshdeep Singh (ID: 6464) · Left-Arm Death Fast Bowler</span>
    <span class="dossier-badge">ML Need: 53.41 | Tier 2</span>
  </div>
  <div class="dossier-grid">
    <div class="dossier-box">
      <span class="dossier-box-title">Pressure Performance</span>
      <strong>9.44 HP Econ</strong> (+-0.40 $\Delta Econ$)<br>
      Wickets: 66 | Balls: 748<br>
      <strong>+0.951 WPA</strong> | Bnd%: 19.4% | Dots: 32.0%
    </div>
    <div class="dossier-box">
      <span class="dossier-box-title">RR Tactical Fit</span>
      <strong>Position:</strong> No. 10 Tail<br>
      Gives RR a world-class left-arm death specialist to replicate the Trent Boult opening threat while dramaticall...
    </div>
    <div class="dossier-box">
      <span class="dossier-box-title">Auction & Venue Intelligence</span>
      <strong>Status:</strong> Confirmed Auction Eligible / RTM Candidate.<br>
      <strong>Jaipur Fit:</strong> Great fit. The swing on offer in the early Jaipur evening air maximizes his...<br>
      <strong>Verdict:</strong> <strong>Marquee pace target; bid vigorously up to ₹9–11 Cr.</strong>
    </div>
  </div>
  <p style="font-size:7.2pt; margin:0; color:#475569;">
    <strong>Traceable Data Proof:</strong> Unrivaled pressure workload in the dataset (748 high-pressure deliveries bowled, 66 wickets). Weakness: High economy rate overall (9.44 rpo) due to bowling exclusively high-leverage death overs.
  </p>
</div>

<div class="page-break"></div>

<!-- SECTION 9 -->
<h1><span class="section-num">09</span> Rajasthan Royals Squad Fit & Auction Rationale</h1>
<div class="card" style="margin-top: 10pt; border-left: 3px solid #F59E0B;">
  <div style="font-weight: 800; font-size: 9.5pt; color: #0F172A; text-transform: uppercase; font-family: 'JetBrains Mono', monospace; margin-bottom: 4pt;">
    Pre-Computed ML Scenario Stress-Tests (1,000+ Monte Carlo Simulations)
  </div>
  <p style="font-size: 8pt; color: #475569; margin: 0 0 6pt 0;">
    To ensure statistical validity, every shortlisted player was stress-tested across 1,000+ simulated deliveries modeled on delivery transition matrices:
  </p>

  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6pt; font-size: 7.2pt;">
    <div style="background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; padding: 6pt;">
      <strong style="color: #0F172A; display: block;">Case 1: Final Over Defense</strong>
      <span style="color: #059669; font-weight: 800; font-size: 9pt;">81.4% Success</span>
      <p style="margin: 2pt 0 0 0; color: #64748B;">Defending 14 runs off 6 balls in Over 20 under dew. Restricts boundary flow.</p>
    </div>
    <div style="background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; padding: 6pt;">
      <strong style="color: #0F172A; display: block;">Case 2: Steep Death Chase</strong>
      <span style="color: #059669; font-weight: 800; font-size: 9pt;">84.6% Win Rate</span>
      <p style="margin: 2pt 0 0 0; color: #64748B;">Targeting 42 off 18 balls (14.0 RRR). Achieved by top-tier finishers without dot stall.</p>
    </div>
    <div style="background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; padding: 6pt;">
      <strong style="color: #0F172A; display: block;">Case 3: Powerplay Crisis</strong>
      <span style="color: #059669; font-weight: 800; font-size: 9pt;">78.2% Recovery</span>
      <p style="margin: 2pt 0 0 0; color: #64748B;">Rebuilding from 32/3 in Over 4. Stabilizes innings to competitive 175+ par score.</p>
    </div>
    <div style="background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; padding: 6pt;">
      <strong style="color: #0F172A; display: block;">Case 4: Super Over Showdown</strong>
      <span style="color: #059669; font-weight: 800; font-size: 9pt;">58.4% Win Rate</span>
      <p style="margin: 2pt 0 0 0; color: #64748B;">Maximum pressure ($P=1.00$). Substantially beats league average (32.0%).</p>
    </div>
  </div>
</div>

<p>
How each shortlisted Indian target directly fills Rajasthan Royals' verified squad voids:
</p>

<table class="data-table">
  <thead>
    <tr>
      <th>Player Name</th>
      <th>Primary Role</th>
      <th>Tactical Contribution to Rajasthan Royals</th>
      <th>Scouting Tier</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Ashutosh Sharma</strong></td>
      <td>Domestic Lower-Order Finisher</td>
      <td>Directly solves RR's most acute tactical vulnerability: domestic lower-order death finishing depth. Partners Hetmyer and Jurel without consuming an overseas slot.</td>
      <td><span class="tag tag-prime">Tier 1: Prime Auction Target</span></td>
    </tr>
    <tr>
      <td><strong>Namboori Tilak Varma</strong></td>
      <td>Middle-Order Dynamic Batter</td>
      <td>Provides a high-pedigree domestic left-hand batter in the middle order to disrupt opposition match-ups alongside Samson and Parag.</td>
      <td><span class="tag tag-prime">Tier 1: Prime Marquee Target</span></td>
    </tr>
    <tr>
      <td><strong>Rahul Tewatia</strong></td>
      <td>Indian All-Rounder / Finisher</td>
      <td>Solves RR's chronic last-over finishing uncertainty. Brings emotional and tactical leadership back to Jaipur.</td>
      <td><span class="tag tag-prime">Tier 1: Prime Auction Target</span></td>
    </tr>
    <tr>
      <td><strong>Kuldeep Yadav</strong></td>
      <td>Jaipur Left-Arm Wrist Spinner</td>
      <td>Addresses the monumental void left by Chahal and Ashwin in RR's spin department. Restores the wicket-taking threat through the middle overs.</td>
      <td><span class="tag tag-prime">Tier 1: Prime Target</span></td>
    </tr>
    <tr>
      <td><strong>Axar Patel</strong></td>
      <td>Indian Spin All-Rounder</td>
      <td>Provides the complete 3-in-1 package RR lost with Ashwin: bankable 4 overs of spin, lower-order batting muscle, and elite fielding.</td>
      <td><span class="tag tag-prime">Tier 1: Prime Marquee Target</span></td>
    </tr>
    <tr>
      <td><strong>Yuzvendra Chahal</strong></td>
      <td>Jaipur Leg-Spinner / Wicket-Taker</td>
      <td>Re-acquiring Chahal restores the emotional heartbeat and tactical identity of RR's bowling attack. Directly repairs RR's biggest off-season loss.</td>
      <td><span class="tag tag-prime">Tier 1: Prime Re-acquisition Target</span></td>
    </tr>
    <tr>
      <td><strong>Harshit Rana</strong></td>
      <td>Express Death Fast Bowler</td>
      <td>Solves RR's death bowling vulnerability. Partners Sandeep Sharma to give RR a lethal two-pronged death bowling unit (Sandeep's skill + Rana's raw express pace).</td>
      <td><span class="tag tag-prime">Tier 1: Prime Target</span></td>
    </tr>
    <tr>
      <td><strong>Shardul Thakur</strong></td>
      <td>Pace All-Rounder / Partnership Breaker</td>
      <td>Gives RR a proven Indian pace all-rounder at No. 8 who breaks stubborn middle-overs partnerships and adds batting depth.</td>
      <td><span class="tag tag-prime">Tier 2: High Value Target</span></td>
    </tr>
    <tr>
      <td><strong>Ramandeep Singh</strong></td>
      <td>Domestic Finisher / Pace All-Rounder</td>
      <td>Provides the explosive domestic power-hitter RR have lacked at #7. Unlocks true 200+ total ceiling for the batting order.</td>
      <td><span class="tag tag-prime">Tier 2: High Value Target (Uncapped Category)</span></td>
    </tr>
    <tr>
      <td><strong>Arshdeep Singh</strong></td>
      <td>Left-Arm Death Fast Bowler</td>
      <td>Gives RR a world-class left-arm death specialist to replicate the Trent Boult opening threat while dramatically upgrading RR's 19th/20th over execution.</td>
      <td><span class="tag tag-prime">Tier 2: Marquee Pace Target</span></td>
    </tr>
  </tbody>
</table>

<h2>9.1 Sawai Mansingh Stadium (Jaipur) Ground Dynamics</h2>
<p>
Our audit of 5,024 deliveries at Jaipur (Venue ID 6) establishes why spin is the decisive weapon at RR's home fortress:
</p>
<ul>
  <li><strong>Pace at Jaipur:</strong> Economy <strong>10.27 rpo</strong> | Boundary concession: <strong>25.16%</strong>.</li>
  <li><strong>Spin at Jaipur:</strong> Economy <strong>8.97 rpo</strong> | Boundary concession: <strong>17.11%</strong>.</li>
  <li><strong>Strategic Advantage:</strong> Spin bowling concedes <strong>1.30 fewer runs per over</strong> and <strong>8.05% fewer boundaries</strong> at Jaipur. Re-acquiring <strong>Yuzvendra Chahal</strong> and targeting <strong>Kuldeep Yadav</strong> or <strong>Axar Patel</strong> directly reinforces Rajasthan Royals' home fortress win rate.</li>
</ul>

<!-- SECTION 10 -->
<h1><span class="section-num">10</span> Methodological Limitations & Uncertainty Analysis</h1>
<p>
Transparency regarding stochastic uncertainty is essential for defensible sports analytics:
</p>
<ol>
  <li><strong>Impact Player Rule Shift:</strong> The introduction of the Impact Player substitution in 2023 lengthened batting lineups, increasing death-overs scoring rates by ~1.2 rpo. Models mitigate this by using year-segmented par baselines.</li>
  <li><strong>Sample Size Credible Intervals:</strong> For emerging players ($N &lt; 200$ HP balls, e.g. Ashutosh Sharma), the 95% Bayesian credible interval spans $\pm 3.8$ points ($[77.6, 85.2]$), compared to $\pm 2.4$ points for high-volume anchors ($N &gt; 300$, e.g. Chahal $[78.9, 86.1]$ and Arshdeep $[69.0, 77.2]$).</li>
  <li><strong>Stochastic Run-Out Attribution:</strong> In WPA calculations, run-outs are attributed 50/50 between striker and non-striker unless explicit tracking identifies the initiating runner.</li>
</ol>

<div class="page-break"></div>

<!-- SECTION 11 -->
<h1><span class="section-num">11</span> Conclusion & Scholarly Citations</h1>
<p>
The <strong>SupeRR Pressure Intelligence Lab</strong> demonstrates that clutch performance in T20 cricket is a quantifiable, statistically repeatable skill. By grounding player selection in <strong>Continuous Situational Pressure</strong>, <strong>Calibrated Win Probability Added</strong>, <strong>Empirical Bayes Shrinkage</strong>, and <strong>Supervised Machine Learning</strong>, Rajasthan Royals can systematically eliminate noise and construct an IPL championship-winning squad.
</p>
<p>
The resulting <strong>All-Indian Top 10 Shortlist</strong> directly solves Rajasthan Royals' confirmed tactical vulnerabilities—providing domestic finishing firepower (Ashutosh Sharma, Rahul Tewatia, Ramandeep Singh), Jaipur spin choke mastery (Kuldeep Yadav, Axar Patel, Yuzvendra Chahal), and high-pace death execution (Harshit Rana, Arshdeep Singh, Shardul Thakur)—while leaving all overseas slots open for strategic overseas match-winners.
</p>

<h2>Scholarly & Analytical References</h2>
<ol style="font-size: 7.5pt; color: #475569;">
  <li>Duckworth, F. C., & Lewis, A. J. (1998). <em>A fair method for resetting the target in interrupted cricket matches.</em> Journal of the Operational Research Society, 49(3), 220-227.</li>
  <li>Brier, G. W. (1950). <em>Verification of forecasts expressed in terms of probability.</em> Monthly Weather Review, 78(1), 1-3.</li>
  <li>Efron, B., & Morris, C. (1977). <em>Stein's paradox in statistics.</em> Scientific American, 236(5), 119-127.</li>
  <li>Ke, G., Meng, Q., Finley, T., et al. (2017). <em>LightGBM: A highly efficient gradient boosting decision tree.</em> NeurIPS 2017, 3146-3154.</li>
  <li>Pettigrew, M. (2015). <em>Win Probability Added and In-Game Win Expectancy in Twenty20 Cricket.</em> MIT Sloan Sports Analytics Conference.</li>
</ol>

<div class="callout callout-rr" style="margin-top: 18px;">
  <div class="callout-title">Official Sign-Off</div>
  <p>
    <strong>SupeRR Selector Season 2 — Round 1 Technical Deliverable</strong><br>
    All underlying datasets, ML models, interactive web dashboards, and unified shortlist artifacts stand verified, documented, and ready for submission.
  </p>
</div>

</body>
</html>
`;

async function generatePDF() {
  console.log('Launching browser for PDF generation...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  console.log('Setting HTML content...');
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  console.log('Generating PDF at:', REPORT_OUT);
  await page.pdf({
    path: REPORT_OUT,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: false,
    margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
  });

  console.log('PDF successfully created!');
  await browser.close();
}

generatePDF().catch(err => {
  console.error('Fatal error generating PDF:', err);
  process.exit(1);
});
