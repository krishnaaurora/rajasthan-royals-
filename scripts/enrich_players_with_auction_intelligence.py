import json
import os

APP_DATA_PATH = "suprr-selector/frontend/src/data/app_data.json"

with open(APP_DATA_PATH, "r", encoding="utf-8") as f:
    app_data = json.load(f)

# Comprehensive auction profiles for batters
BATTER_AUCTION_MAP = {
    7897: { # Tilak Varma
        "recommendation": "Tier 1 Marquee Target — Aggressive Paddle Push",
        "priority_tier": "Tier 1: Marquee Target",
        "target_bid_bracket": "₹9.0 Cr – ₹12.0 Cr",
        "walkaway_cap": "₹13.5 Cr",
        "nationality": "Indian",
        "quota_impact": "Indian Core — Consumes 0 overseas slots. Allows RR to play 3 foreign pacers/finishers.",
        "rr_squad_role": "No. 3/4 Left-Hand Anchor & Accelerator",
        "rr_gap_addressed": "Solves RR's middle-order left-right balance; counters leg-spin & left-arm orthodox choke in overs 7–15.",
        "plain_english_auction_plan": "Tilak is the #1 rated pressure batter in the entire tournament dataset with a staggering 201.09 HP Strike Rate (+65.34 elevation). RR should bid decisively against MI and SRH up to ₹12 Cr. His composure in crisis and clean hitting against spin make him the ideal long-term middle-order pillar for RR alongside Sanju Samson.",
        "match_deployment_phase": "Overs 7–16 during the middle collapse or accelerating from ball one in chases over 190.",
        "auction_table_tactic": "Open bid at ₹4 Cr, absorb counter-bids from MI, and hold paddle firmly until ₹12 Cr. Do not blink unless it exceeds ₹13.5 Cr.",
        "risks_and_backup": "Price inflation risk if MI exercises RTM. Fallback: Ashutosh Sharma + foreign middle-order bat."
    },
    6396: { # Tim David
        "recommendation": "Tier 1 Marquee Target — Dominant Overseas Finisher",
        "priority_tier": "Tier 1: Marquee Target",
        "target_bid_bracket": "₹7.5 Cr – ₹10.0 Cr",
        "walkaway_cap": "₹11.5 Cr",
        "nationality": "Overseas",
        "quota_impact": "Consumes 1 of 4 Overseas XI slots. Demands unconditional starter status.",
        "rr_squad_role": "No. 6 Pure Death-Overs Finisher",
        "rr_gap_addressed": "Relieves exclusive finishing pressure from Shimron Hetmyer; eliminates RR's vulnerability to wide yorkers at the death.",
        "plain_english_auction_plan": "Tim David possesses elite death-over boundary striking (199.49 HP SR, +3.274 Win Probability Added). He solves RR's historic death batting stalls. Because he consumes an overseas slot, RR should cap bids at ₹11.5 Cr and deploy him exclusively in high-leverage death scenarios.",
        "match_deployment_phase": "Overs 15–20 targeting 12+ RRR scenarios and defending totals at Jaipur.",
        "auction_table_tactic": "Wait for accelerated round or middle pool. Enter bid at ₹6 Cr when rival budgets dwindle.",
        "risks_and_backup": "High overseas slot commitment; spin choke risk. Fallback: David Miller or Rovman Powell."
    },
    20702: { # Tristan Stubbs
        "recommendation": "Tier 1 Strategic Target — 360° Multi-Role Weapon",
        "priority_tier": "Tier 1: Strategic Target",
        "target_bid_bracket": "₹8.0 Cr – ₹11.0 Cr",
        "walkaway_cap": "₹12.5 Cr",
        "nationality": "Overseas",
        "quota_impact": "Consumes 1 of 4 Overseas XI slots. Offers dual-utility as wicketkeeper and off-spin option.",
        "rr_squad_role": "No. 5/6 360° Middle/Death Striker & Backup WK",
        "rr_gap_addressed": "Destroys spin through sweeps and reverse-laps, neutralizing dry turning pitches at SMS Stadium Jaipur.",
        "plain_english_auction_plan": "Stubbs delivers a +58.30 SR elevation under pressure (194.47 HP SR) with 27.9% boundary rate. His rare ability to switch-hit spinners and punish 145kph yorkers provides RR with unmatched flexibility in the 12th to 20th overs.",
        "match_deployment_phase": "Overs 11–20; injected early if spinners are dominating the middle overs.",
        "auction_table_tactic": "Compete aggressively against DC/LSG. Push bids up to ₹11 Cr. If DC pursues aggressively beyond ₹12.5 Cr, pivot to David Miller.",
        "risks_and_backup": "DC likely to push hard. Fallback: Glenn Maxwell or Rovman Powell."
    },
    3926: { # Rahul Tewatia
        "recommendation": "Tier 1 Prime Target — High-Leverage Domestic Finisher & Spin AR",
        "priority_tier": "Tier 1: Prime Target",
        "target_bid_bracket": "₹6.0 Cr – ₹8.5 Cr",
        "walkaway_cap": "₹10.0 Cr",
        "nationality": "Indian",
        "quota_impact": "Indian Core — 0 overseas slot penalty. Deepens domestic balance.",
        "rr_squad_role": "No. 7 Ice-Cold Finisher & Leg-Spin Enforcer",
        "rr_gap_addressed": "Emotional and tactical homecoming. Guarantees clutch boundary-hitting in the final 12 balls without using an overseas spot.",
        "plain_english_auction_plan": "Tewatia is synonymous with miraculous final-over heists (179.47 HP SR, +60.40 Delta). For RR, signing Tewatia restores lower-order fear factor and provides 2 quality overs of leg-spin to complement Ravichandran Ashwin.",
        "match_deployment_phase": "Overs 17–20 needing 15+ runs per over; overs 8–12 with the ball against RHBs.",
        "auction_table_tactic": "Engage GT and PBKS in a disciplined paddle war. Lock in at ₹7–8 Cr. High emotional and tactical value.",
        "risks_and_backup": "GT might use RTM card. Fallback: Ramandeep Singh or Shahrukh Khan."
    },
    4708: { # Rinku Singh
        "recommendation": "Tier 1 Marquee Target — India's Premier Chase Finisher",
        "priority_tier": "Tier 1: Marquee Target",
        "target_bid_bracket": "₹10.0 Cr – ₹13.0 Cr",
        "walkaway_cap": "₹14.5 Cr",
        "nationality": "Indian",
        "quota_impact": "Indian Core — Zero foreign slot usage. Absolute franchise cornerstone.",
        "rr_squad_role": "No. 5/6 Designated Chase Master",
        "rr_gap_addressed": "Fixes RR's historic chase collapses when Samson/Buttler fall inside 10 overs.",
        "plain_english_auction_plan": "Rinku holds a legendary 191.72 HP SR with 70.03 PRI. He does not panic, calculates required run rates with mathematical precision, and hits boundaries when fielders are back. If KKR releases him or enters auction, RR must pursue him with top purse allocation.",
        "match_deployment_phase": "Overs 14–20 in any chase scenario requiring 10+ runs per over.",
        "auction_table_tactic": "Enter auction early. Signal aggressive intent with ₹1 Cr jumps to deter mid-tier franchises.",
        "risks_and_backup": "Extremely high market demand from KKR, CSK, and RCB. Fallback: Ashutosh Sharma + Tilak Varma."
    },
    1077: { # David Miller
        "recommendation": "Tier 1 Prime Value — Experienced Overseas Crisis Stabilizer",
        "priority_tier": "Tier 1: Prime Target",
        "target_bid_bracket": "₹4.0 Cr – ₹6.5 Cr",
        "walkaway_cap": "₹7.5 Cr",
        "nationality": "Overseas",
        "quota_impact": "Consumes 1 of 4 Overseas slots. Experienced veteran insurance.",
        "rr_squad_role": "No. 5 Middle Order Crisis Anchor / Accelerator",
        "rr_gap_addressed": "Provides left-handed stability when top order collapses; unmatched experience in playoff knockouts.",
        "plain_english_auction_plan": "David Miller has proven clutch pedigree across 12 IPL seasons (191.00 HP SR, +50.23 Delta). He represents the ultimate high-floor, low-volatility overseas acquisition at a reasonable ₹5 Cr budget.",
        "match_deployment_phase": "Overs 10–20; holds innings together if 3 wickets fall in Powerplay, then detonates after 15th over.",
        "auction_table_tactic": "Wait for other teams to blow budgets on younger batters; secure Miller in round 2 at ₹4.5–₹5.5 Cr.",
        "risks_and_backup": "Overseas spot management. Fallback: Dasun Shanaka or Rovman Powell."
    },
    8101: { # Ashutosh Sharma
        "recommendation": "Tier 1 Prime Target — High-Impact Domestic Finisher (Must Buy)",
        "priority_tier": "Tier 1: Prime Target",
        "target_bid_bracket": "₹4.0 Cr – ₹6.5 Cr",
        "walkaway_cap": "₹8.0 Cr",
        "nationality": "Indian",
        "quota_impact": "Indian Core — 0 overseas slot penalty. Massive tactical unlock.",
        "rr_squad_role": "No. 7 High-Impact Striker & Sweep Specialist",
        "rr_gap_addressed": "Fills RR's vacant Indian lower-order boundary-hitter position with zero overseas sacrifice.",
        "plain_english_auction_plan": "Ashutosh Sharma exploded with 191.76 HP SR (+52.77 Delta) hitting elite pacers (Bumrah, Siraj) over fine leg with inventive sweeps. He is RR's highest ROI domestic batting target for IPL 2027.",
        "match_deployment_phase": "Overs 16–20 needing 40 off 18 balls.",
        "auction_table_tactic": "Prioritize in Uncapped/Emerging pool. Bid persistently against PBKS up to ₹7 Cr.",
        "risks_and_backup": "PBKS might contest aggressively. Fallback: Ramandeep Singh or Nehal Wadhera."
    },
    1699: { # Suryakumar Yadav
        "recommendation": "Tier 1 Ultra-Marquee — World's Best 360° Boundary Striker",
        "priority_tier": "Tier 1: Ultra-Marquee",
        "target_bid_bracket": "₹14.0 Cr – ₹17.5 Cr",
        "walkaway_cap": "₹18.0 Cr",
        "nationality": "Indian",
        "quota_impact": "Indian Core — Zero foreign slot usage. Automatic franchise icon.",
        "rr_squad_role": "No. 3/4 Undisputed Game-Breaker",
        "rr_gap_addressed": "Transforms RR into the most lethal batting lineup in IPL history.",
        "plain_english_auction_plan": "SKY records the highest raw pressure SR in cricket history (219.88 HP SR, +57.02 Delta). If MI enters mega-auction without retaining him, RR should break the bank up to ₹18 Cr without hesitation.",
        "match_deployment_phase": "Overs 4–18 in any match condition.",
        "auction_table_tactic": "Go all-in with opening maximum bids. Be prepared to expend 20% of total purse.",
        "risks_and_backup": "Virtually guaranteed retention by MI. Fallback: Tilak Varma or Tristan Stubbs."
    },
    2436: { # Dasun Shanaka
        "recommendation": "Tier 2 Value Buy — Budget Pace All-Rounder & Death Striker",
        "priority_tier": "Tier 2: Value Core",
        "target_bid_bracket": "₹1.5 Cr – ₹3.0 Cr",
        "walkaway_cap": "₹4.0 Cr",
        "nationality": "Overseas",
        "quota_impact": "Consumes 1 Overseas slot as squad backup / rotational XI player.",
        "rr_squad_role": "No. 6/7 Pace-Hitting Finisher & 6th Bowler",
        "rr_gap_addressed": "Provides seam bowling balance and elite death batting (+57.17 Delta) at fraction of marquee cost.",
        "plain_english_auction_plan": "Shanaka boasts 180.49 HP SR and gives 2 overs of medium pace. Ideal tactical backup to cover overseas injury or workload management.",
        "match_deployment_phase": "Overs 16–20 against high-pace attacks.",
        "auction_table_tactic": "Bid base price ₹1.5 Cr; raise to ₹2.5 Cr if rival enters. Do not exceed ₹4 Cr.",
        "risks_and_backup": "Overseas slot cap. Fallback: Jason Holder or Jamie Overton."
    },
    813: { # Jos Buttler
        "recommendation": "Tier 1 Franchise Pillar — Top-Order Monster & Pressure King",
        "priority_tier": "Tier 1: Marquee Target",
        "target_bid_bracket": "₹9.0 Cr – ₹12.5 Cr",
        "walkaway_cap": "₹14.0 Cr",
        "nationality": "Overseas",
        "quota_impact": "Consumes 1 Overseas slot. Cornerstone match-winner.",
        "rr_squad_role": "Opening Batter / Match-Winner",
        "rr_gap_addressed": "Guarantees 200+ totals; holds the highest clutch peak in the dataset (236.36 HP SR, +83.84 Delta).",
        "plain_english_auction_plan": "Buttler is RR royalty. When matches tighten, his SR rockets by +83.84 points. RR must use retention or aggressive RTM paddle bids up to ₹13 Cr to ensure he never leaves Jaipur.",
        "match_deployment_phase": "Overs 1–20; anchor-to-assault transition.",
        "auction_table_tactic": "Use RTM card or opening power bid. Match highest bidder immediately.",
        "risks_and_backup": "High overseas slot commitment. Fallback: Tristan Stubbs or Phil Salt."
    },
    817: { # Rovman Powell
        "recommendation": "Tier 2 Tactical Power Asset — Spin-Hitting Finisher",
        "priority_tier": "Tier 2: Tactical Fit",
        "target_bid_bracket": "₹3.0 Cr – ₹5.0 Cr",
        "walkaway_cap": "₹6.0 Cr",
        "nationality": "Overseas",
        "quota_impact": "Consumes 1 Overseas slot. Rotational finisher.",
        "rr_squad_role": "No. 6/7 Boundary Striker",
        "rr_gap_addressed": "Destroys spin bowling in the 14th–18th overs; existing familiarity with RR dugout.",
        "plain_english_auction_plan": "Powell brings monstrous raw power under pressure. A reliable secondary overseas finisher if Tim David proves too expensive.",
        "match_deployment_phase": "Overs 15–20 against spin or medium pace.",
        "auction_table_tactic": "Buy back in round 2 at ₹3.5–₹4.5 Cr.",
        "risks_and_backup": "Vulnerable to high pace bouncers. Fallback: Dasun Shanaka."
    },
    842: { # Shimron Hetmyer
        "recommendation": "Tier 1 Core Retention / Buy-Back — RR's Trusted Finisher",
        "priority_tier": "Tier 1: Prime Target",
        "target_bid_bracket": "₹7.0 Cr – ₹9.5 Cr",
        "walkaway_cap": "₹11.0 Cr",
        "nationality": "Overseas",
        "quota_impact": "Consumes 1 Overseas slot. Proven franchise continuity.",
        "rr_squad_role": "No. 5/6 Primary LHB Finisher",
        "rr_gap_addressed": "Ensures uninterrupted death-over boundary output and left-hand match-up leverage.",
        "plain_english_auction_plan": "Hetmyer has won countless games for RR from impossible situations. Retention or immediate auction buy-back ensures psychological security in the lower middle order.",
        "match_deployment_phase": "Overs 14–20 chasing 11+ RRR.",
        "auction_table_tactic": "Use RTM or bid aggressively up to ₹9 Cr.",
        "risks_and_backup": "Price inflation from KKR/DC. Fallback: Tristan Stubbs."
    },
    825: { # Dhruv Jurel
        "recommendation": "Tier 1 Homegrown Pillar — Core Domestic Retention Priority",
        "priority_tier": "Tier 1: Prime Target",
        "target_bid_bracket": "₹6.0 Cr – ₹9.0 Cr",
        "walkaway_cap": "₹11.0 Cr",
        "nationality": "Indian",
        "quota_impact": "Indian Core — 0 overseas slot penalty. Wicketkeeper batter.",
        "rr_squad_role": "No. 5/6 Dynamic Finisher & Wicketkeeper",
        "rr_gap_addressed": "RR's internal discovery. Guarantees world-class temperament under extreme pressure.",
        "plain_english_auction_plan": "Jurel is ice under pressure. Retaining him is paramount; if in auction, RR must bid up to ₹10 Cr to keep their franchise future intact.",
        "match_deployment_phase": "Overs 13–20; handles both spin and express pace seamlessly.",
        "auction_table_tactic": "Retain pre-auction or aggressively exercise RTM.",
        "risks_and_backup": "High demand across all 10 franchises. Fallback: Ashutosh Sharma."
    },
    826: { # Ramandeep Singh
        "recommendation": "Tier 2 Domestic Value Steal — Fast-Batting All-Rounder",
        "priority_tier": "Tier 2: Value Core",
        "target_bid_bracket": "₹2.5 Cr – ₹4.5 Cr",
        "walkaway_cap": "₹6.0 Cr",
        "nationality": "Indian",
        "quota_impact": "Indian Core — 0 overseas slot penalty. High tactical utility.",
        "rr_squad_role": "No. 7 Finisher & 1–2 overs Seam",
        "rr_gap_addressed": "Provides extreme boundary hitting from ball 1 without consuming an overseas slot.",
        "plain_english_auction_plan": "Ramandeep strikes at 200+ against pace and spin from the first delivery. He provides the ideal low-cost high-upside backup to Ashutosh Sharma.",
        "match_deployment_phase": "Overs 18–20 facing 6–10 deliveries.",
        "auction_table_tactic": "Target in accelerated uncapped round at ₹3 Cr.",
        "risks_and_backup": "KKR will bid. Fallback: Shahrukh Khan."
    }
}

# Comprehensive auction profiles for bowlers
BOWLER_AUCTION_MAP = {
    3644: { # Kuldeep Yadav
        "recommendation": "Tier 1 Prime Target — India's Most Lethal Wrist Spinner",
        "priority_tier": "Tier 1: Prime Target",
        "target_bid_bracket": "₹8.0 Cr – ₹11.0 Cr",
        "walkaway_cap": "₹12.5 Cr",
        "nationality": "Indian",
        "quota_impact": "Indian Core — Zero foreign slot usage. Absolute tactical game-changer.",
        "rr_squad_role": "Lead Attacking Wrist Spinner (Overs 7–15 & 17)",
        "rr_gap_addressed": "Provides genuine wicket-taking mystery in the middle overs at Sawai Mansingh Stadium Jaipur.",
        "plain_english_auction_plan": "Kuldeep is the #1 ranked pressure bowler with a ridiculous 6.96 HP Economy and 28 pressure wickets. He creates dismissals when batters are forced to attack. Pairing Kuldeep with Ashwin gives RR an impenetrable spin choke.",
        "match_deployment_phase": "Overs 7–15 when opposition is rebuilding or over 17 when a set batter must be removed.",
        "auction_table_tactic": "Bid aggressively against DC and CSK up to ₹11 Cr. High conviction buy.",
        "risks_and_backup": "DC will push to retain. Fallback: Varun Chakravarthy or Yuzvendra Chahal."
    },
    6256: { # Varun Chakravarthy
        "recommendation": "Tier 1 Prime Target — Unreadable Mystery Spin Enforcer",
        "priority_tier": "Tier 1: Prime Target",
        "target_bid_bracket": "₹7.0 Cr – ₹9.5 Cr",
        "walkaway_cap": "₹11.0 Cr",
        "nationality": "Indian",
        "quota_impact": "Indian Core — Zero foreign slot usage. Huge domestic advantage.",
        "rr_squad_role": "Middle Overs & Death Enforcer",
        "rr_gap_addressed": "Concedes only 7.08 HP Economy (-1.09 Delta); batters cannot read his carrom ball under pressure.",
        "plain_english_auction_plan": "Varun induces extreme dot-ball pressure (44.2% dots) under pressure. In dew-affected chases, his variations remain lethal. A prime domestic target for RR's bowling spine.",
        "match_deployment_phase": "Overs 8, 11, 13, and 17.",
        "auction_table_tactic": "Open bid at ₹4 Cr and sustain steady bidding. Exit if price touches ₹11.5 Cr.",
        "risks_and_backup": "KKR RTM threat. Fallback: Kuldeep Yadav or Noor Ahmad."
    },
    2933: { # Jasprit Bumrah
        "recommendation": "Tier 1 Ultra-Marquee — World's Greatest All-Phase Bowler",
        "priority_tier": "Tier 1: Ultra-Marquee",
        "target_bid_bracket": "₹15.0 Cr – ₹18.0 Cr",
        "walkaway_cap": "₹18.0 Cr",
        "nationality": "Indian",
        "quota_impact": "Indian Core — Zero foreign slot usage. Absolute franchise cornerstone.",
        "rr_squad_role": "Opening Spell & Death Overs Executioner",
        "rr_gap_addressed": "Guarantees match wins single-handedly; 7.23 HP Economy across the hardest overs.",
        "plain_english_auction_plan": "Bumrah is the gold standard of bowling under pressure (+1.645 WPA). If MI does not retain him, RR should bid the maximum allowable purse allocation up to ₹18 Cr.",
        "match_deployment_phase": "Overs 1, 3, 17, and 19.",
        "auction_table_tactic": "Raise paddle continuously until auctioneer drops hammer or purse limit reached.",
        "risks_and_backup": "Virtually 100% retained by MI. Fallback: Harshit Rana + Trent Boult."
    },
    781: { # Sunil Narine
        "recommendation": "Tier 1 Marquee Target — The Ultimate Run-Choke Spinner",
        "priority_tier": "Tier 1: Marquee Target",
        "target_bid_bracket": "₹6.5 Cr – ₹9.0 Cr",
        "walkaway_cap": "₹10.5 Cr",
        "nationality": "Overseas",
        "quota_impact": "Consumes 1 Overseas slot. Dual utility as pinch hitter.",
        "rr_squad_role": "Powerplay & Death Containment Spinner",
        "rr_gap_addressed": "Lowest pressure economy in elite T20 cricket (5.80 HP Econ); impossible to hit for consecutive boundaries.",
        "plain_english_auction_plan": "Narine locks down an entire end under pressure. Conceding just 5.80 runs per over in crunch time makes defending 170 effortless. High value if KKR allows him into auction.",
        "match_deployment_phase": "Overs 5, 8, 14, and 18.",
        "auction_table_tactic": "Bid up to ₹8.5 Cr. If bidding reaches double digits, pivot to Indian spinners.",
        "risks_and_backup": "KKR loyalty and overseas spot. Fallback: Axar Patel or Mitchell Santner."
    },
    2876: { # Axar Patel
        "recommendation": "Tier 1 Prime Target — High-Reliability Left-Arm All-Rounder",
        "priority_tier": "Tier 1: Prime Target",
        "target_bid_bracket": "₹8.0 Cr – ₹10.5 Cr",
        "walkaway_cap": "₹12.0 Cr",
        "nationality": "Indian",
        "quota_impact": "Indian Core — 0 overseas slot penalty. Massive tactical balance.",
        "rr_squad_role": "Powerplay/Middle Spinner & No. 7 Clutch Batter",
        "rr_gap_addressed": "Solves two problems at once: tight spin bowling (7.35 HP Econ) and calm left-handed lower-order batting.",
        "plain_english_auction_plan": "Axar is the most complete Indian T20 all-rounder available. His defensive dart accuracy chokes right-handers in powerplays and middle overs, while his batting absorbs crisis situations.",
        "match_deployment_phase": "Overs 4, 6, 9, 13; bats whenever early wickets fall.",
        "auction_table_tactic": "Target as priority Indian all-rounder. Push bids aggressively up to ₹10.5 Cr.",
        "risks_and_backup": "DC will contest heavily. Fallback: Rahul Tewatia + Kuldeep Yadav."
    },
    5979: { # Abrar Ahmed
        "recommendation": "Tier 2 Smart Value Buy — Mystery Spin Lockdown",
        "priority_tier": "Tier 2: Value Core",
        "target_bid_bracket": "₹1.5 Cr – ₹3.0 Cr",
        "walkaway_cap": "₹4.0 Cr",
        "nationality": "Overseas",
        "quota_impact": "Consumes 1 Overseas slot as rotational mystery specialist.",
        "rr_squad_role": "Middle Overs Mystery Enforcer",
        "rr_gap_addressed": "Boasts the lowest pressure economy in the dataset (4.60 HP Econ, -2.49 Delta).",
        "plain_english_auction_plan": "Abrar represents an elite budget efficiency play. At ₹2 Cr, he provides unplayable mystery spin that strangulates run scoring in the middle overs.",
        "match_deployment_phase": "Overs 7–14 on turning or two-paced surfaces.",
        "auction_table_tactic": "Pick up in accelerated overseas round with minimal competition.",
        "risks_and_backup": "Overseas slot constraint. Fallback: Mitchell Santner or Noor Ahmad."
    },
    1612: { # Yuzvendra Chahal
        "recommendation": "Tier 1 Emotional & Tactical Homecoming — IPL's Wicket King",
        "priority_tier": "Tier 1: Prime Target",
        "target_bid_bracket": "₹7.0 Cr – ₹9.0 Cr",
        "walkaway_cap": "₹10.5 Cr",
        "nationality": "Indian",
        "quota_impact": "Indian Core — 0 overseas slot penalty. Deep franchise connection.",
        "rr_squad_role": "Attacking Leg-Spinner & Middle/Death Strike Bowler",
        "rr_gap_addressed": "Provides 30 pressure wickets; fearless in tossing the ball up when batters are swinging for boundaries.",
        "plain_english_auction_plan": "Chahal is RR's modern bowling hero. He thrives on high-risk bowling, enticing mis-hits in overs 14–18. RR must ensure he remains in pink by bidding up to ₹9 Cr.",
        "match_deployment_phase": "Overs 9, 12, 14, and 17.",
        "auction_table_tactic": "Open bid immediately. Use RTM card if available or outbid RCB/PBKS.",
        "risks_and_backup": "Heavy bidding from former franchise RCB. Fallback: Kuldeep Yadav or Varun Chakravarthy."
    },
    4722: { # Rashid Khan
        "recommendation": "Tier 1 Ultra-Marquee — Global T20 Match Winner",
        "priority_tier": "Tier 1: Ultra-Marquee",
        "target_bid_bracket": "₹12.0 Cr – ₹15.0 Cr",
        "walkaway_cap": "₹16.5 Cr",
        "nationality": "Overseas",
        "quota_impact": "Consumes 1 Overseas slot. Undisputed game-breaker.",
        "rr_squad_role": "Lead Strike Bowler & Lower-Order Power Finisher",
        "rr_gap_addressed": "Guarantees 4 suffocating overs (7.77 HP Econ) plus 200+ SR batting cameos at No. 8.",
        "plain_english_auction_plan": "Rashid is irreplaceable. In pressure situations, his quick-arm googlies are unhittable (+1.223 WPA). RR should bid up to ₹15 Cr if GT makes him available.",
        "match_deployment_phase": "Overs 8, 10, 16, and 18.",
        "auction_table_tactic": "Aggressive front-running bid strategy. Deter competitors early.",
        "risks_and_backup": "GT retention guaranteed. Fallback: Kuldeep Yadav or Sunil Narine."
    },
    6355: { # Shaheen Afridi
        "recommendation": "Tier 1 Marquee Target — High-Velocity Left-Arm Strike Weapon",
        "priority_tier": "Tier 1: Marquee Target",
        "target_bid_bracket": "₹8.0 Cr – ₹11.0 Cr",
        "walkaway_cap": "₹12.5 Cr",
        "nationality": "Overseas",
        "quota_impact": "Consumes 1 Overseas slot. Marquee opening and death spearhead.",
        "rr_squad_role": "Opening Swinging Pacer & Death Yorker Specialist",
        "rr_gap_addressed": "Replaces or partners Trent Boult to provide lethal early wickets and 7.35 HP Economy at the death.",
        "plain_english_auction_plan": "Shaheen swings the new ball at 145km/h and nails toe-crushing yorkers under pressure. Gives RR early breakthroughs and death control.",
        "match_deployment_phase": "Overs 1, 3, 18, and 20.",
        "auction_table_tactic": "Bid aggressively if available. Cap at ₹12 Cr due to foreign slot limit.",
        "risks_and_backup": "Availability/participation clearance. Fallback: Matheesha Pathirana or Kagiso Rabada."
    },
    8166: { # Harshit Rana
        "recommendation": "Tier 1 Prime Target — High-Pace Indian Death Enforcer",
        "priority_tier": "Tier 1: Prime Target",
        "target_bid_bracket": "₹5.0 Cr – ₹7.5 Cr",
        "walkaway_cap": "₹9.0 Cr",
        "nationality": "Indian",
        "quota_impact": "Indian Core — 0 overseas slot penalty. Top domestic fast bowling asset.",
        "rr_squad_role": "Overs 16–20 Death Overs Specialist & Middle Enforcer",
        "rr_gap_addressed": "Fixes RR's Indian pace bowling dependency; bowls with fearless aggression and deceptive slower balls.",
        "plain_english_auction_plan": "Harshit Rana demonstrated ice-cold death-over nerves in crunch IPL defenses. With 145kph velocity, sharp bouncers, and back-of-the-hand slower balls, he is RR's highest-priority domestic pacer for 2027.",
        "match_deployment_phase": "Overs 6, 15, 18, and 20.",
        "auction_table_tactic": "Bid aggressively against KKR and LSG up to ₹7.5 Cr. Uncapped/low-cap domestic gold.",
        "risks_and_backup": "KKR will bid hard. Fallback: Shardul Thakur or Mohit Sharma."
    },
    7696: { # Mohammad Wasim
        "recommendation": "Tier 2 Smart Overseas Buy — Reverse-Swing Yorker Specialist",
        "priority_tier": "Tier 2: Value Core",
        "target_bid_bracket": "₹2.0 Cr – ₹3.5 Cr",
        "walkaway_cap": "₹4.5 Cr",
        "nationality": "Overseas",
        "quota_impact": "Consumes 1 Overseas slot. Specialist death bowler backup.",
        "rr_squad_role": "Death-Overs Reverse Swing Executioner",
        "rr_gap_addressed": "6.17 HP Economy under extreme pressure (-3.03 suppression); tailors yorkers on dry subcontinental decks.",
        "plain_english_auction_plan": "Wasim has extraordinary death overs metrics (6.17 Econ). A tremendous value buy to bolster death bowling at a modest price.",
        "match_deployment_phase": "Overs 17 and 19.",
        "auction_table_tactic": "Buy in second round at ₹2–₹3 Cr.",
        "risks_and_backup": "Overseas quota restriction. Fallback: Jamie Overton."
    },
    8144: { # Matheesha Pathirana
        "recommendation": "Tier 1 Marquee Target — Lethal Searing Malinga-Action Yorker Machine",
        "priority_tier": "Tier 1: Marquee Target",
        "target_bid_bracket": "₹9.0 Cr – ₹12.0 Cr",
        "walkaway_cap": "₹13.5 Cr",
        "nationality": "Overseas",
        "quota_impact": "Consumes 1 Overseas slot. Undisputed death overs strike bowler.",
        "rr_squad_role": "Overs 12–20 Death & Middle Wicket-Taker",
        "rr_gap_addressed": "Complete lockdown of death overs; lowest boundary concession against top finishers.",
        "plain_english_auction_plan": "Pathirana's slingy release point makes his 148kph yorkers impossible to elevate. Acquiring him makes RR's death bowling virtually unassailable.",
        "match_deployment_phase": "Overs 13, 15, 18, and 20.",
        "auction_table_tactic": "Engage CSK in a high-stakes bidding war up to ₹12 Cr. Walk away only if CSK bids beyond ₹13.5 Cr.",
        "risks_and_backup": "CSK will exhaust purse to retain. Fallback: Shaheen Afridi or Gerald Coetzee."
    }
}

# Default generator for any remaining players
def generate_default_batter_strategy(b):
    is_ind = "India" in str(b.get("teams", [])) or b.get("team") in ["India", "Rajasthan Royals", "Mumbai Indians", "Punjab Kings", "Lucknow Super Giants"]
    rank = b.get("rank", 15)
    name = b.get("name", "Player")
    sr = b.get("hp_sr", 160)
    delta = b.get("sr_delta", 20)
    
    if is_ind:
        tier = "Tier 1: Prime Target" if rank <= 10 else "Tier 2: Value Core"
        rec = "Aggressive Paddle Push (Indian Core)" if rank <= 10 else "Smart Domestic Value Steal"
        bracket = "₹4.5 Cr – ₹7.0 Cr" if rank <= 10 else "₹2.0 Cr – ₹4.0 Cr"
        cap = "₹8.5 Cr" if rank <= 10 else "₹5.0 Cr"
        quota = "Indian Core — 0 overseas slot penalty. Maximizes Playing XI flexibility."
    else:
        tier = "Tier 1: Marquee Target" if rank <= 10 else "Tier 2: Tactical Fit"
        rec = "Strategic Overseas Buy" if rank <= 10 else "Rotational Overseas Asset"
        bracket = "₹5.0 Cr – ₹8.0 Cr" if rank <= 10 else "₹1.5 Cr – ₹3.5 Cr"
        cap = "₹9.5 Cr" if rank <= 10 else "₹4.5 Cr"
        quota = "Consumes 1 of 4 Overseas XI slots. Must offer superior match-winning value."
        
    return {
        "recommendation": rec,
        "priority_tier": tier,
        "target_bid_bracket": bracket,
        "walkaway_cap": cap,
        "nationality": "Indian" if is_ind else "Overseas",
        "quota_impact": quota,
        "rr_squad_role": f"No. {min(7, 3 + (rank % 5))} Crisis Striker",
        "rr_gap_addressed": f"Strengthens RR batting depth; delivers {sr} strike rate with +{delta} elevation when matches are on the line.",
        "plain_english_auction_plan": f"{name} brings proven pressure resilience. RR should target him within the {bracket} range to bolster finishing capability while protecting purse reserves.",
        "match_deployment_phase": "Overs 14–20 during chases requiring 10+ runs per over.",
        "auction_table_tactic": f"Enter bidding in middle rounds; maintain discipline and walk away if bidding exceeds {cap}.",
        "risks_and_backup": "Price inflation risk during multi-team bidding war. Fallback to secondary domestic targets."
    }

def generate_default_bowler_strategy(bw):
    is_ind = "India" in str(bw.get("teams", [])) or bw.get("team") in ["India", "Rajasthan Royals", "Mumbai Indians", "Punjab Kings", "Delhi Capitals", "Kolkata Knight Riders"]
    rank = bw.get("rank", 15)
    name = bw.get("name", "Player")
    econ = bw.get("hp_econ", 8.0)
    delta = bw.get("econ_delta", -0.5)
    
    if is_ind:
        tier = "Tier 1: Prime Target" if rank <= 10 else "Tier 2: Value Core"
        rec = "Primary Domestic Target" if rank <= 10 else "Tactical Domestic Steal"
        bracket = "₹5.0 Cr – ₹8.0 Cr" if rank <= 10 else "₹2.0 Cr – ₹4.0 Cr"
        cap = "₹9.5 Cr" if rank <= 10 else "₹5.0 Cr"
        quota = "Indian Core — 0 overseas slot penalty. Solves local bowling depth."
    else:
        tier = "Tier 1: Marquee Target" if rank <= 10 else "Tier 2: Tactical Fit"
        rec = "Strategic Overseas Enforcer" if rank <= 10 else "Budget Overseas Weapon"
        bracket = "₹4.5 Cr – ₹7.5 Cr" if rank <= 10 else "₹1.5 Cr – ₹3.0 Cr"
        cap = "₹8.5 Cr" if rank <= 10 else "₹4.0 Cr"
        quota = "Consumes 1 of 4 Overseas XI slots. Demands regular starter status."
        
    return {
        "recommendation": rec,
        "priority_tier": tier,
        "target_bid_bracket": bracket,
        "walkaway_cap": cap,
        "nationality": "Indian" if is_ind else "Overseas",
        "quota_impact": quota,
        "rr_squad_role": "Middle Overs & Death Phase Enforcer",
        "rr_gap_addressed": f"Locks down opposition scoring ({econ} HP Econ); suppresses boundary flow by {abs(delta)} rpo under pressure.",
        "plain_english_auction_plan": f"{name} excels when batters are aggressively swinging. Acquiring him in the {bracket} bracket fortifies RR's bowling spine without overpaying.",
        "match_deployment_phase": "Overs 7–15 or high-stakes death overs (17–20).",
        "auction_table_tactic": f"Bid calmly; let rivals exhaust purse on overseas big names, then secure {name} at {bracket}.",
        "risks_and_backup": "Overseas quota conflict or bidding spikes. Fallback to domestic spinners."
    }

# Enrich all batters
for b in app_data["batters"]:
    bid = b.get("id")
    if bid in BATTER_AUCTION_MAP:
        b["auction_strategy"] = BATTER_AUCTION_MAP[bid]
    else:
        b["auction_strategy"] = generate_default_batter_strategy(b)

# Enrich all bowlers
for bw in app_data["bowlers"]:
    bwid = bw.get("id")
    if bwid in BOWLER_AUCTION_MAP:
        bw["auction_strategy"] = BOWLER_AUCTION_MAP[bwid]
    else:
        bw["auction_strategy"] = generate_default_bowler_strategy(bw)

# Also ensure unified_shortlist players have auction_strategy synced
for u in app_data.get("unified_shortlist", []):
    uid = u.get("id")
    if uid in BATTER_AUCTION_MAP:
        u["auction_strategy"] = BATTER_AUCTION_MAP[uid]
    elif uid in BOWLER_AUCTION_MAP:
        u["auction_strategy"] = BOWLER_AUCTION_MAP[uid]
    else:
        if u.get("role") == "batter" or "Finisher" in str(u.get("role")):
            u["auction_strategy"] = generate_default_batter_strategy(u)
        else:
            u["auction_strategy"] = generate_default_bowler_strategy(u)

with open(APP_DATA_PATH, "w", encoding="utf-8") as f:
    json.dump(app_data, f, indent=2)

print("SUCCESS: Enriched all", len(app_data["batters"]), "batters and", len(app_data["bowlers"]), "bowlers with crystal-clear auction intelligence!")
