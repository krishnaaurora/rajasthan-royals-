import re

with open('suprr-selector/scripts/generate_submission_pdf.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace section 7 with the complete dual Unstop Top 10 lists + RR Unified Shortlist
sec7_replacement = """<!-- SECTION 7 -->
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
"""

# Pattern to locate section 7 up to section 8
pattern = re.compile(r'<!-- SECTION 7 -->.*?<!-- SECTION 8 -->', re.DOTALL)
if pattern.search(code):
    code = pattern.sub(sec7_replacement + '\n<!-- SECTION 8 -->', code)
    print("Replaced Section 7 with official 3-table format.")
else:
    print("Could not find section 7 pattern.")

with open('suprr-selector/scripts/generate_submission_pdf.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated generate_submission_pdf.js successfully!")
