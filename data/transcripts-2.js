/* Model interview transcripts, part 2 (G021–G040). Format: see transcripts-1.js. */
window.TRANSCRIPTS = window.TRANSCRIPTS || {};
Object.assign(window.TRANSCRIPTS, {
  G021: {
    answer: "About 700 college canteens in Delhi.",
    takeaway: "Count facilities via the institutions that host them: students → colleges → canteens per college.",
    turns: [
      ["I", "Estimate the number of college canteens operating in Delhi."],
      ["C", "Canteens inside higher-education institutions (colleges, universities and standalone institutes) in Delhi NCT? Counting each food outlet separately?"],
      ["I", "Yes, each canteen counts."],
      ["C", "Structure: **students on campus → number of institutions → canteens per institution**."],
      ["I", "How many students?"],
      ["C", "- 18–23-year-olds: ~11% of 20 M = 2.2 M\n- Delhi's enrolment rate is high, ~45% → ~1 M, plus ~0.2 M from other states = 1.2 M\n- Excluding distance and open-learning students (~0.4 M), **~0.8 M attend a campus**"],
      ["C", "A DU college has 3,000–5,000 students, but many private institutes have under 1,000, so the average is ~1,500. That's 0.8 M ÷ 1,500 ≈ **530 institutions**."],
      ["I", "Canteens per institution?"],
      ["C", "Big campuses (~20%) have 2–3 outlets, say 2.5; the rest have one. Weighted: 0.2 × 2.5 + 0.8 × 1 = 1.3, so 530 × 1.3 ≈ **~700 canteens**."],
      ["I", "Sanity check?"],
      ["C", "That's about one canteen per 1,150 students. At ~40% of students buying something daily, that's ~460 customers a canteen a day, which is plausible. My answer is **~700**."]
    ]
  },

  G022: {
    answer: "About 2.4–2.5 billion pairs of footwear a year.",
    takeaway: "Replacement-driven consumer goods: pairs per person per year by urban/rural and income.",
    turns: [
      ["I", "Estimate the number of pairs of footwear sold in India in a year."],
      ["C", "All types (shoes, sandals, slippers, sports shoes) sold in India? Pairs per year?"],
      ["I", "Yes."],
      ["C", "Structure: **population by urban/rural × income → pairs bought per person per year**."],
      ["I", "Numbers?"],
      ["C", "Urban, 490 M:\n- High 20% (98 M) × 4 pairs = 392 M\n- Middle 50% (245 M) × 2.5 = 612 M\n- Low 30% (147 M) × 1.5 = 221 M\n\nRural, 910 M:\n- High 10% (91 M) × 2.5 = 228 M\n- Middle 40% (364 M) × 1.5 = 546 M\n- Low 50% (455 M) × 1 = 455 M"],
      ["C", "Urban ≈ 1.23 B and rural ≈ 1.23 B, so **~2.45 B pairs a year**."],
      ["I", "Children?"],
      ["C", "They're included in the per-person averages. Children outgrow shoes fast, which pushes the average up even in lower-income homes."],
      ["C", "Check: that's ~1.75 pairs per person a year. India is often cited as the world's second-largest footwear consumer at around 2.5 B pairs, so we're in range."]
    ]
  },

  G023: {
    answer: "About 10–11 million weddings a year.",
    takeaway: "Life-event questions: size the age cohort that reaches the event each year, apply the incidence, and fix the unit (people vs events).",
    turns: [
      ["I", "Estimate the number of weddings taking place in India in a year."],
      ["C", "All weddings, including remarriages, counting each wedding once (not each person)?"],
      ["I", "Yes."],
      ["C", "Structure: **people reaching marriageable age each year × share who marry ÷ 2 people per wedding**, plus remarriages."],
      ["I", "Cohort size?"],
      ["C", "India has ~23 M people in each single-year age group around age 25. Roughly 95% of Indians marry at some point, so **~22 M people** marry for the first time each year."],
      ["C", "Dividing by 2 gives ~11 M weddings. Remarriages add perhaps 3%, but the timing of marriage is also slowly shifting later, so I'll call it **~10–11 M weddings a year**."],
      ["I", "Anything interesting to add?"],
      ["C", "They're concentrated in ~60 auspicious days, mostly from November to February, so that's ~175,000 weddings on a peak day. That's why venues, jewellers and caterers see such sharp seasonality."]
    ]
  },

  G024: {
    answer: "About 1.4–1.5 million electric two-wheelers next year.",
    takeaway: "Forecasts: anchor on today's base, apply market growth and share gain, then cross-check bottom-up.",
    turns: [
      ["I", "Estimate the number of electric two-wheelers that will be sold in India next year."],
      ["C", "Units sold domestically, scooters and motorcycles, over the next 12 months?"],
      ["I", "Yes."],
      ["C", "I'll anchor on today: **total two-wheeler market × EV share**, then project growth in both."],
      ["I", "Current numbers?"],
      ["C", "About 19–20 M two-wheelers are sold a year, and EVs are ~6%, so **~1.15 M this year**."],
      ["C", "Next year:\n- Market grows ~5% → ~20.6 M\n- EV share rises ~1.5 points to ~7.5% as more models launch and battery costs fall\n\n20.6 M × 7.5% ≈ **1.55 M**."],
      ["I", "What if subsidies are cut?"],
      ["C", "A subsidy cut would slow share gains. At +0.5 points, it's ~6.5% × 20.6 M ≈ 1.34 M. So my range is **1.35–1.55 M**, with a base case of **~1.45 M**."],
      ["C", "Bottom-up check: about 8 M two-wheelers a year go to urban buyers; if ~18% of them choose electric, that's ~1.4 M. Consistent."]
    ]
  },

  G025: {
    answer: "About 150 workers (~17 pickers/packers, ~120 riders, ~6 store staff).",
    takeaway: "Staffing questions: size the peak, convert to worker-hours by role, then to people via shifts plus a buffer.",
    turns: [
      ["I", "Estimate the number of workers required to fulfil 3,000 Zepto orders a day."],
      ["C", "Is that one dark store doing 3,000 orders a day? And workers meaning pickers/packers, delivery riders and store staff?"],
      ["I", "Yes, one store, all roles."],
      ["C", "Capacity is set by the peak, so I'll build hour by hour. Open 20 hours; the 4-hour evening peak takes 35% of orders: **1,050 orders, ~260 an hour**. The other 1,950 orders spread over 16 hours at **~120 an hour**."],
      ["I", "Pickers first."],
      ["C", "Picking and packing takes ~2.5 min an order, so 24 orders an hour per picker: ~11 pickers at peak, ~5 off-peak. That's 5 × 20 + 6 × 4 = 124 picker-hours ÷ 9-hour shifts ≈ 14 people, +20% for days off → **~17**."],
      ["I", "Riders?"],
      ["C", "A round trip is ~25 min and some orders are batched (1.2 per trip), so ~2.9 orders an hour per rider.\n- Peak: 260 ÷ 2.9 ≈ 90 riders\n- Off-peak: 120 ÷ 2.9 ≈ 42\n\nRider-hours: 42 × 16 + 90 × 4 = 1,032 ÷ 10-hour shifts ≈ 103, +15% buffer → **~120 riders**."],
      ["C", "Add ~6 store staff (managers, inventory and receiving). Total ≈ **~145, call it 150**."],
      ["I", "Where's the risk?"],
      ["C", "Riders dominate. If delivery distances grow or batching drops, rider needs rise quickly: at 2 orders an hour, we'd need ~170 riders."]
    ]
  },

  G026: {
    answer: "About 12 rides a day (range 10–14).",
    takeaway: "Per-unit throughput: available hours ÷ full cycle time (pickup + ride + idle), adjusted for utilisation.",
    turns: [
      ["I", "Estimate the number of rides a cab driver takes in a day."],
      ["C", "A full-time app-cab driver in a big Indian city, on a typical weekday?"],
      ["I", "Yes."],
      ["C", "Structure: **driving hours ÷ time per ride cycle × utilisation**."],
      ["I", "Hours?"],
      ["C", "A 12-hour shift with ~1.5 hours of breaks leaves **10.5 hours**."],
      ["C", "One ride cycle:\n- Reaching the pickup: ~10 min\n- The ride itself: ~25 min average in city traffic\n- Idle before the next request: ~10 min\n\nThat's **~45 min**, so 630 ÷ 45 = 14 rides at full demand."],
      ["I", "Is demand always there?"],
      ["C", "No. Mid-morning and afternoon are slow, so apply ~85% utilisation: 14 × 0.85 ≈ **12 rides**. An airport run or two can take 2 hours each and push it to ~10, while a peak-heavy day with short trips can reach ~14."]
    ]
  },

  G027: {
    answer: "About 1 million car crossings a month.",
    takeaway: "Bridges and roads: traffic by time band and direction, the vehicle-mix filter, then weekday/weekend to get to a month.",
    turns: [
      ["I", "Estimate the number of cars on the Bandra–Worli Sea Link per month."],
      ["C", "Car crossings, counting each trip, both directions, over a typical month?"],
      ["I", "Yes."],
      ["C", "Structure: **vehicles per hour by time band × hours, per direction → × 2 directions → × car share → weekdays and weekends**."],
      ["I", "Traffic flow?"],
      ["C", "It's 8 lanes, but the toll plaza and connecting roads cap the flow. Per direction:\n- Peak, 6 hours × 1,500 an hour = 9,000\n- Normal, 12 hours × 700 = 8,400\n- Night, 6 hours × 150 = 900\n\nThat's ~18,300 per direction, **~36,600 vehicles a day**."],
      ["C", "Two-wheelers are banned and there are few heavy vehicles, so ~90% are cars: **~33,000 cars on a weekday**."],
      ["I", "Weekends?"],
      ["C", "Less commuting, some leisure trips: ~85% of weekday traffic, ~28,000.\n\n22 weekdays × 33k + 8 weekend days × 28k ≈ 726k + 224k = **~950k, call it ~1 M a month**."],
      ["C", "Check: if ~25,000 regular commuters make ~40 crossings a month each, that's 1 M on its own, so the answer is plausible."]
    ]
  },

  G028: {
    answer: "About 0.8 million air conditioners a year in Delhi.",
    takeaway: "Durables with rising penetration: installed base × (1 ÷ life) for replacement + base growth for new demand; include commercial users.",
    turns: [
      ["I", "Estimate annual air-conditioner sales in Delhi."],
      ["C", "Units sold in Delhi NCT, homes plus offices, shops and hospitals, new units only?"],
      ["I", "Yes, all buyers."],
      ["C", "Structure: **installed base (households by income × ownership × units per home, plus commercial) → replacement + growth**."],
      ["I", "Households?"],
      ["C", "About 4.5 M households:\n- High 15% (0.68 M): 90% own, 2.5 units each → 1.5 M\n- Upper-middle 25% (1.13 M): 70%, 1.3 units → 1.0 M\n- Lower-middle 30% (1.35 M): 25%, 1 unit → 0.34 M\n- Low 30%: ~2% → 0.03 M\n\nThat's **~2.9 M ACs in homes**."],
      ["I", "Commercial?"],
      ["C", "Offices, shops, restaurants and hospitals add roughly 40% on top: ~1.2 M. The total installed base is **~4.1 M**."],
      ["C", "- Replacement: 9-year life → 4.1 M ÷ 9 ≈ 0.46 M\n- Growth: the base grows ~8% a year → 0.33 M\n\nTotal ≈ **0.8 M a year**."],
      ["I", "Check?"],
      ["C", "India sells roughly 12–14 M room ACs a year, and Delhi taking ~6% is sensible given its heat and incomes. A very hot summer can swing this by ±20%."]
    ]
  },

  G029: {
    answer: "About ₹45,000–50,000 Cr a year of EV sales.",
    takeaway: "Multi-segment markets: size each vehicle type separately, because volumes and prices differ by orders of magnitude.",
    turns: [
      ["I", "Estimate the market size of electric vehicles in India."],
      ["C", "Annual sales value of new EVs (two-wheelers, three-wheelers including e-rickshaws, cars and buses), excluding charging infrastructure?"],
      ["I", "Yes."],
      ["C", "Structure by segment: **annual vehicle sales × EV share × average price**."],
      ["I", "Go through each."],
      ["C", "- Two-wheelers: 20 M × 6% = 1.2 M × ₹1.1 lakh = ₹13,200 Cr\n- Three-wheelers incl. e-rickshaws: ~0.7 M EVs × ₹1.8 lakh average = ₹12,600 Cr\n- Cars: 4.3 M × 2.5% ≈ 0.11 M × ₹15 lakh = ₹16,500 Cr\n- Buses: ~4,000 × ₹1.2 Cr = ₹4,800 Cr"],
      ["C", "Total ≈ **₹47,000 Cr** (~US$5.5 B)."],
      ["I", "What stands out?"],
      ["C", "Cars are only ~5% of EV units but about a third of the value, while electric three-wheelers already dominate their category. The fastest value growth will come from cars as prices fall and more models launch."]
    ]
  },

  G030: {
    answer: "About 60–65 litres of milk a day per coffee shop.",
    takeaway: "Input-consumption questions: output (drinks) × product mix × input per unit, plus wastage.",
    turns: [
      ["I", "Estimate the milk required by each coffee shop in Connaught Place in a day."],
      ["C", "A typical café chain outlet in CP, milk for drinks only, on an average day?"],
      ["I", "Yes."],
      ["C", "Structure: **coffees a day (dine-in + takeaway) × drink mix × ml of milk per drink**, plus wastage."],
      ["I", "How many coffees?"],
      ["C", "A 40-seat café open 9 am–11 pm:\n- Peak, 4 hours: 60% occupancy × 1.5 turns an hour × 0.9 coffees per person → 40 × 0.6 × 1.5 × 4 × 0.9 ≈ 130\n- Off-peak, 10 hours at 25% → ≈ 135\n- Takeaway adds ~30% → **~345 on a weekday**\n\nWeekends run ~30% higher (~450). Weekly average: **~375 coffees a day**."],
      ["C", "Mix:\n- Black/espresso, 20%: 0 ml\n- Cappuccino/latte, 60%: ~180 ml\n- Cold coffee/frappé, 20%: ~250 ml\n\nAverage ≈ 108 + 50 = **~158 ml a drink**."],
      ["I", "Total?"],
      ["C", "375 × 0.158 ≈ 59 L, plus ~10% steaming wastage → **~65 L a day**, about 16 of the 4-litre cans used at the counter. That's plausible for a busy CP outlet."]
    ]
  },

  G031: {
    answer: "About 320 trains in service at peak (~350 in the fleet).",
    takeaway: "Transit fleet = round-trip time ÷ headway, line by line, plus a maintenance spare.",
    turns: [
      ["I", "Estimate the number of operational metro trains in Delhi-NCR."],
      ["C", "Trains running at the busiest hour across the network, and should I also give the total fleet including spares?"],
      ["I", "Both would be good."],
      ["C", "Supply formula per line: **trains needed = round-trip time ÷ peak headway**. I'll group ~12 lines into major, medium and small."],
      ["I", "Go ahead."],
      ["C", "- 4 major lines, ~35 km: at ~33 km/h that's ~60 min one way, so a ~140-min round trip with turnarounds. At a 3-min headway → ~47 trains each → **~190**\n- 5 medium lines, ~25 km: ~110-min round trip, 5-min headway → ~22 each → **~110**\n- 3 small lines, ~15 km: ~70 min, 8-min headway → ~9 each → **~27**\n\nThat's **~325 trains in service at peak**."],
      ["I", "And the fleet?"],
      ["C", "Add ~10% for maintenance and standby: **~350 trains**."],
      ["C", "Check: ~320 trains × ~8 cars × ~300 passengers per car at peak crowding is ~770k people aboard at once, which fits a system carrying ~6–7 M journeys a day."]
    ]
  },

  G032: {
    answer: "About 4–5 million Spotify Premium subscribers in India.",
    takeaway: "Freemium products: users are easy to get; paid conversion (by income) is the number that matters.",
    turns: [
      ["I", "Estimate the number of Spotify Premium subscribers in India."],
      ["C", "Paying accounts, counting each member of a family or student plan?"],
      ["I", "Count each paying member."],
      ["C", "Funnel: **internet users → music streamers → Spotify's share → premium conversion by income**."],
      ["I", "Numbers?"],
      ["C", "- Active internet users: ~886 M\n- Stream music on an app at least monthly: ~40% → ~354 M\n- Spotify's share, against YouTube Music, JioSaavn, Gaana and Wynk: ~30% → **~106 M Spotify users**"],
      ["I", "How many pay?"],
      ["C", "Conversion depends heavily on income, since free tiers and cheap alternatives are good enough for most:\n- Top 20% by income (~21 M users): 15% pay → 3.2 M\n- The rest (~85 M): 1.5% → 1.3 M\n\nTotal ≈ **4.5 M premium subscribers**."],
      ["C", "Check: that's ~4% conversion, far below Spotify's global ~40%, which reflects India's low willingness to pay for music and strong free options. My answer is **~4–5 M**."]
    ]
  },

  G033: {
    answer: "About ₹6,000 Cr a year.",
    takeaway: "Niche categories: define the niche first, then find the small, affluent, health-aware consumer base that buys it.",
    turns: [
      ["I", "Estimate the market size of the healthy biscuit industry in India."],
      ["C", "“Healthy” meaning digestive, oats, multigrain, high-fibre and sugar-free biscuits? Annual retail value?"],
      ["I", "Yes."],
      ["C", "Structure: **health-aware buyers (urban adults by income) × packs a year × price per pack**."],
      ["I", "Who buys?"],
      ["C", "Urban adults aged 25+: ~60% of 490 M ≈ 294 M.\n- High income, 20% (59 M): 40% buy → 23.5 M\n- Middle, 50% (147 M): 12% → 17.6 M\n- Low: negligible\n- Affluent rural buyers add ~3 M\n\nThat's **~44 M buyers**."],
      ["C", "Consumption: one ~150 g pack (~₹40) every 10 days → 36 packs a year.\n\n44 M × 36 × ₹40 ≈ **₹6,300 Cr**."],
      ["I", "Cross-check?"],
      ["C", "India's biscuit market is roughly ₹45,000–50,000 Cr, and a healthy-segment share of ~12–13% gives ₹6,000 Cr. Consistent, so **~₹6,000 Cr**."]
    ]
  },

  G034: {
    answer: "About 4,600 departures a week from Delhi.",
    takeaway: "Weekly questions: build a typical day, adjust for day-of-week patterns, and sum.",
    turns: [
      ["I", "Estimate the number of flights taking off from Delhi in a week."],
      ["C", "Departures from IGI airport, all scheduled passenger and cargo flights, over a normal week?"],
      ["I", "Yes."],
      ["C", "I'll estimate a typical weekday from runway capacity, then adjust for weekends."],
      ["I", "Weekday?"],
      ["C", "About 70 movements an hour at peak:\n- Peak, 8 hours × 72 = 576\n- Shoulder, 8 hours × 60 = 480\n- Night, 8 hours × 30 = 240\n\nThat's ~1,300 movements, so **~650 departures**."],
      ["I", "Are weekends different?"],
      ["C", "Business routes thin out, but leisure and international traffic peaks, so it nets out slightly higher: say +5%, ~680.\n\nWeek: 5 × 650 + 2 × 680 = 3,250 + 1,360 = **~4,600 departures**."],
      ["C", "Check: ~75 M passengers a year means ~720k departing passengers a week; at ~150 per flight that's ~4,800 departures. Close enough, so **~4,600–4,800**."]
    ]
  },

  G035: {
    answer: "About ₹4.5–5 Cr a year.",
    takeaway: "Service businesses: capacity (chair-hours) × occupancy × revenue per occupied hour, with the service mix done properly.",
    turns: [
      ["I", "Estimate the annual revenue of a premium salon."],
      ["C", "A single premium outlet in a metro, with services plus product retail?"],
      ["I", "Yes."],
      ["C", "Structure: **chair-hours × occupancy × revenue per occupied chair-hour**, weekday vs weekend, plus retail."],
      ["I", "Capacity?"],
      ["C", "12 chairs × 11 hours = **132 chair-hours a day**. Occupancy: ~55% on weekdays, ~80% at weekends."],
      ["C", "Service mix (by clients):\n- Men, 50%: ~45 min, ₹900\n- Women, 50%: ~90 min, ₹2,500\n\nAverage client: 1.125 hours and ₹1,700 → **~₹1,500 per occupied chair-hour**."],
      ["I", "Annualise it."],
      ["C", "- Weekdays: 132 × 55% × ₹1,500 ≈ ₹1.1 lakh a day × 256 days ≈ ₹2.8 Cr\n- Weekends: 132 × 80% × ₹1,500 ≈ ₹1.6 lakh × 104 ≈ ₹1.66 Cr\n- Product retail: ~10% → ₹0.45 Cr\n\nTotal ≈ **₹4.9 Cr a year**."],
      ["C", "Check: ~₹40 lakh a month for a 12-chair premium salon is in line with what large chains report per outlet."]
    ]
  },

  G036: {
    answer: "About ₹6,500 Cr of platform revenue a year on ~₹36,000 Cr of entry fees (as of FY24, before the 2025 ban).",
    takeaway: "Marketplaces: separate gross transaction value from what the platform keeps (the take rate), and flag regulation.",
    turns: [
      ["I", "Estimate the market size of fantasy sports in India."],
      ["C", "An important caveat: India banned real-money online games, including paid fantasy contests, in 2025. Should I size the market as it was before the ban?"],
      ["I", "Yes, size it as of FY24. Platform revenue, please."],
      ["C", "Structure: **smartphone users → sports fans → paying fantasy players × contests a year × entry fee → × platform take rate**."],
      ["I", "Numbers?"],
      ["C", "- Smartphone users: ~650 M\n- Follow cricket or other sports closely: ~60% → ~390 M\n- Have played fantasy: ~30% → ~117 M registered\n- Pay regularly: roughly 1 in 6 → **~20 M paying users**"],
      ["C", "A paying user joins several contests per match, ~120 a year (IPL-heavy), at ~₹150 on average: 20 M × 120 × ₹150 ≈ **₹36,000 Cr in entry fees**. Platforms keep ~18% after prizes, so revenue is **~₹6,500 Cr**."],
      ["I", "Anything else?"],
      ["C", "This makes it a fairly concentrated, IPL-driven business, and after the ban paid contests stopped, so today's real-money market is essentially zero. That's a good example of why regulation belongs in the clarifying questions."]
    ]
  },

  G037: {
    answer: "About 10 litres of paint materials (~2.6 US gallons) to repaint a hatchback's exterior.",
    takeaway: "Physical estimation: approximate the shape with simple solids, subtract non-painted areas, then coats ÷ coverage.",
    turns: [
      ["I", "Estimate the amount of paint required to paint a car."],
      ["C", "A standard hatchback, exterior body only, with the usual layers: primer, base coat and clear coat? In litres?"],
      ["I", "Yes."],
      ["C", "I'll model the car as **two cuboids**, a lower body and a cabin, work out the painted surface area, then multiply by coats and divide by coverage."],
      ["I", "Surface area?"],
      ["C", "Lower body, 3.8 × 1.7 × 0.8 m:\n- Top not covered by the cabin: 6.5 − 3.0 = 3.5 m²\n- Sides: 2 × 3.8 × 0.8 = 6.1 m²\n- Front and back: 2 × 1.7 × 0.8 = 2.7 m²\n\nCabin, 2.0 × 1.5 × 0.7 m: roof 3.0 m², plus 40% of its sides, front and back (the rest is glass) ≈ 2.0 m².\n\nSubtract ~1.2 m² for lights, grille and bumper trim. That's **~16 m²**."],
      ["I", "Coverage?"],
      ["C", "After spray loss, about 8 m² per litre per coat. Coats: 1 primer + 2 base + 2 clear = 5.\n\n16 × 5 ÷ 8 = **~10 L** of material."],
      ["C", "Check: body shops typically quote around a gallon each of base and clear plus primer for a full respray, which is about 10–11 litres. Consistent."]
    ]
  },

  G038: {
    answer: "About 220 Hindi films released in theatres a year (~300 including OTT premieres).",
    takeaway: "Release-slot supply: the calendar (Fridays and holidays) × releases per slot, split by budget tier.",
    turns: [
      ["I", "Estimate the number of Bollywood movies released in India in a year."],
      ["C", "Hindi feature films released in cinemas? Should I also count films that go straight to streaming?"],
      ["I", "Theatrical first, then mention OTT."],
      ["C", "Supply-side: **release slots (Fridays + holidays) × films per slot by budget tier**."],
      ["I", "Films per Friday?"],
      ["C", "- Big-budget: about one every other week → 0.5\n- Mid-budget: ~1\n- Small independent films: ~2.5\n\nThat's **~4 a Friday**; × 52 = 208. Add ~12 holiday releases on other days (Diwali, Eid, Independence Day): **~220 theatrical releases**."],
      ["I", "And OTT?"],
      ["C", "Streaming platforms premiere roughly 1–2 Hindi films a week, ~80 a year, so **~300 in total**."],
      ["C", "Check: more films are certified each year than reach cinemas, since many small films get very limited releases, so ~220 theatrical releases is a sensible middle figure."]
    ]
  },

  G039: {
    answer: "About ₹1 lakh Cr a year.",
    takeaway: "Big industrial markets: OEM fitment + replacement by vehicle type; commercial vehicles dominate value despite lower volumes.",
    turns: [
      ["I", "Estimate the market size of the tyre industry in India in revenue terms."],
      ["C", "Domestic sales of new tyres (fitted to new vehicles plus replacements) across all vehicle types? Excluding exports and retreads?"],
      ["I", "Yes."],
      ["C", "By segment: **(new vehicles × tyres) + (vehicles in use × tyres ÷ tyre life) × price**."],
      ["I", "Walk me through it."],
      ["C", "- Two-wheelers: 19.6 M new × 2 = 39 M; ~180 M in use × 2 ÷ 5 years = 72 M → 111 M × ₹1,500 ≈ ₹16,700 Cr\n- Cars: 4.3 M × 5 (incl. spare) = 21.5 M; 35 M × 4 ÷ 4 years = 35 M → 56.5 M × ₹4,500 ≈ ₹25,400 Cr\n- Three-wheelers: ~14 M tyres × ₹1,500 ≈ ₹2,100 Cr\n- Trucks and buses: ~7.6 M new; 6 M × 8 ÷ 1.5 years = 32 M → ~40 M × ₹13,000 ≈ ₹52,000 Cr\n- Tractors: ~9 M × ₹8,000 ≈ ₹7,200 Cr"],
      ["C", "Total ≈ **₹1.03 lakh Cr**."],
      ["I", "Insight?"],
      ["C", "Trucks and buses are only ~17% of tyre units but about half the value, and replacement is ~70% of demand. That's why tyre makers focus on truck radials and the replacement dealer network. The industry's reported turnover of roughly ₹1 lakh Cr matches."]
    ]
  },

  G040: {
    answer: "About ₹15,000 a day for a single-dentist clinic.",
    takeaway: "Clinics: available chair hours × utilisation ÷ time per appointment × fee, with simple vs complex procedures.",
    turns: [
      ["I", "Estimate the revenue of a dentist in Delhi in a day."],
      ["C", "A single-dentist neighbourhood clinic in a middle-income area, gross revenue on a weekday?"],
      ["I", "Yes."],
      ["C", "Structure: **clinic hours × utilisation ÷ time per appointment × average fee**, splitting simple and complex procedures."],
      ["I", "Hours and mix?"],
      ["C", "Open 10 am–8 pm with an hour's break: **9 hours**.\n\n- Simple (check-ups, cleaning, fillings), 75% of visits: ~30 min, ~₹800\n- Complex (root canal sittings, extractions, crowns), 25%: ~60 min, ~₹4,000\n\nAverage: ~0.63 hours and ~₹1,600 a patient."],
      ["C", "At 65% utilisation: 9 × 0.65 ≈ 5.9 booked hours ÷ 0.63 ≈ **~9 patients** × ₹1,600 ≈ **₹15,000 a day**."],
      ["I", "What would change it most?"],
      ["C", "The complex share. Crowns and implants cost ₹15,000+, so one implant patient can double the day. A premium South Delhi clinic could easily do ₹40,000+."]
    ]
  }
});
