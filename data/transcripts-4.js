/* Model interview transcripts, part 4 (G061–G077). Format: see transcripts-1.js. */
window.TRANSCRIPTS = window.TRANSCRIPTS || {};
Object.assign(window.TRANSCRIPTS, {
  G061: {
    answer: "About 1.2 lakh pairs of footwear a day in Mumbai.",
    takeaway: "Daily-sales questions: build annually (pairs per person per year) and divide by 365; cross-check with shops × sales per shop.",
    turns: [
      ["I", "Estimate the number of pairs of shoes sold in Mumbai daily."],
      ["C", "All footwear (shoes, sandals, chappals, sports shoes)? Mumbai metro, ~20 M people?"],
      ["I", "Yes, all footwear."],
      ["C", "It's easier to think annually: **people by income × pairs bought a year ÷ 365**."],
      ["I", "Numbers?"],
      ["C", "- High income, 20% (4 M): ~4 pairs a year → 16 M\n- Middle, 50% (10 M): ~2 → 20 M\n- Low, 30% (6 M): ~1.2 → 7.2 M\n\nThat's **~43 M pairs a year → ~1.2 lakh a day**."],
      ["I", "Cross-check it."],
      ["C", "Supply side: Mumbai has perhaps 15,000 footwear shops and street stalls selling ~8 pairs a day each, which is ~1.2 lakh. The two methods match.\n\nAt ~2.2 pairs per person a year, Mumbai is above the national average of ~1.75, as you'd expect for a richer city."]
    ]
  },

  G062: {
    answer: "About ₹5,000–5,500 Cr a year.",
    takeaway: "Lumpy, infrequent spend: convert to an annual expected spend per household (cost ÷ years between events), by income.",
    turns: [
      ["I", "Estimate the size of the home renovation market in Hyderabad."],
      ["C", "Annual spend on renovating existing homes (repainting, repairs, kitchen and bathroom upgrades, flooring), excluding new construction and furniture?"],
      ["I", "Yes."],
      ["C", "Renovation is infrequent, so I'll convert it to **expected annual spend per household = major cost ÷ years between major jobs + minor cost ÷ years between minor jobs**, by income. Mainly owners renovate."],
      ["I", "How many owners?"],
      ["C", "Hyderabad has ~11 M people → ~2.75 M households; ~55% own → **1.5 M owner households**."],
      ["C", "Major work every ~12 years, minor (painting, repairs) every ~4:\n- High income (0.23 M): ₹8 L major + ₹1 L minor → ~₹92k a year → ₹2,060 Cr\n- Middle (0.68 M): ₹3 L + ₹40k → ~₹35k a year → ₹2,360 Cr\n- Low (0.6 M): ₹80k + ₹15k → ~₹10k a year → ₹620 Cr\n\nThat's ~₹5,050 Cr, plus ~10% from landlords refreshing rentals → **~₹5,500 Cr a year**."],
      ["I", "What would a renovation start-up take from this?"],
      ["C", "High-income owners are only ~15% of households but ~40% of spend, and they're the most likely to use organised platforms, so they're the beachhead."]
    ]
  },

  G063: {
    answer: "About ₹2,500–3,000 Cr a year.",
    takeaway: "Event-driven markets: the event count (births) sets the ceiling; adoption and spend by urban/rural do the rest.",
    turns: [
      ["I", "Estimate the size of the maternity wear market in India."],
      ["C", "Clothing specifically for pregnancy and nursing (dresses, kurtas, leggings, nursing tops), at annual retail value?"],
      ["I", "Yes."],
      ["C", "Structure: **pregnancies a year → share who buy maternity wear (urban vs rural) × spend per pregnancy**, plus nursing wear."],
      ["I", "Pregnancies?"],
      ["C", "India has ~24 M births a year, so ~24 M pregnancies reaching term.\n- Urban, 35% (8.4 M): 60% buy maternity wear → 5 M × ~₹4,000 ≈ ₹2,000 Cr\n- Rural, 65% (15.6 M): 10% → 1.56 M × ~₹1,200 ≈ ₹190 Cr"],
      ["C", "Nursing and post-partum wear adds ~25%: **~₹2,750 Cr a year**."],
      ["I", "What stands out?"],
      ["C", "Over 90% of value is urban, and adoption is the big lever: many women still adapt their regular clothes. Each +10 points of urban adoption adds ~₹420 Cr (with nursing wear), so awareness-led brands can grow the category itself."]
    ]
  },

  G064: {
    answer: "About ₹22 Cr a year for a 5-screen metro multiplex.",
    takeaway: "Annual cinema revenue: daily capacity × blended occupancy × 365 × ticket price, plus F&B and ads.",
    turns: [
      ["I", "Estimate the annual revenue of a multiplex."],
      ["C", "A 5-screen multiplex in a metro mall, with tickets, food and beverage, and advertising?"],
      ["I", "Yes."],
      ["C", "Structure: **seats × shows × occupancy × 365 → tickets × average price**, plus F&B per head and ads."],
      ["I", "Capacity and occupancy?"],
      ["C", "5 screens × 200 seats × 5 shows = **5,000 seat-shows a day**. Occupancy: ~20% on 4 weekdays and ~40% on 3 weekend days → blended **~28%**.\n\n5,000 × 28% ≈ 1,430 tickets a day → **~5.2 lakh a year**."],
      ["C", "Revenue:\n- Tickets: 5.2 lakh × ₹250 ≈ ₹13 Cr\n- F&B: ₹140 per head → ₹7.3 Cr\n- Ads and other income: ~₹1.5 Cr\n\nTotal ≈ **₹22 Cr a year**."],
      ["I", "Sanity check?"],
      ["C", "That's ~₹4.4 Cr per screen, in line with what listed chains report. F&B is a third of revenue at much higher margins than tickets, which is why multiplexes push combos so hard."]
    ]
  },

  G065: {
    answer: "About ₹15 Cr a month.",
    takeaway: "Subscription revenue: households → TV → pay-TV mode (DTH vs cable vs OTT-only) → operator share × ARPU.",
    turns: [
      ["I", "Estimate the monthly revenue from Tata Play subscribers in Delhi."],
      ["C", "Subscription revenue from Tata Play DTH customers in Delhi NCT, per month?"],
      ["I", "Yes."],
      ["C", "Funnel: **households → own a TV → use DTH → Tata Play's share × average monthly bill (ARPU)**."],
      ["I", "Go ahead."],
      ["C", "- Households: ~4.5 M\n- Own a TV: 90% → 4.05 M\n- How they watch: DTH 45%, cable 35%, free/OTT-only 20% → **1.82 M DTH homes**\n- Tata Play's share of DTH (vs Airtel and Dish): ~35% → **~640k subscribers**"],
      ["C", "At an ARPU of ~₹230 a month: 640k × ₹230 ≈ **₹14.7 Cr a month**."],
      ["I", "What's the trend?"],
      ["C", "Downward. Cord-cutting to OTT is shrinking the DTH share by a few points a year, and ARPU is under pressure. The strategic question is how fast the 20% OTT-only segment grows."]
    ]
  },

  G066: {
    answer: "About ₹70,000 Cr a year in toll collections.",
    takeaway: "National aggregates: number of facilities × average traffic × average charge, with the average built from the vehicle mix.",
    turns: [
      ["I", "Estimate the total toll tax collected annually across India."],
      ["C", "Tolls on national and state highways and expressways combined, per year?"],
      ["I", "Yes."],
      ["C", "Structure: **toll plazas × average vehicles a day × average toll per vehicle × 365**."],
      ["I", "How many plazas?"],
      ["C", "About 45,000 km of highways are tolled. With plazas every ~60 km on national highways, plus state highways and expressways, that's **~1,000 plazas**."],
      ["C", "Traffic varies hugely, from ~80,000 a day near metros to ~8,000 on rural stretches, so say an average of **~13,000 vehicles a day**.\n\nAverage toll by mix:\n- Cars, 60%: ₹80 → ₹48\n- Buses/LCVs, 15%: ₹150 → ₹22.5\n- Trucks, 25%: ₹300 → ₹75\n\nBlended **~₹145 a vehicle**."],
      ["I", "Total?"],
      ["C", "1,000 × 13,000 × ₹145 × 365 ≈ **₹69,000 Cr a year**. Trucks are a quarter of traffic but over half the revenue, so freight activity drives toll growth more than car ownership."]
    ]
  },

  G067: {
    answer: "About ₹1.3–1.5 Cr of Nestlé coffee consumed on a weekday in Mumbai.",
    takeaway: "Brand consumption value: drinkers × cups × format share (instant) × brand share × value per cup.",
    turns: [
      ["I", "Estimate the revenue from consumption of Nestlé coffee on a weekday in Mumbai."],
      ["C", "Nescafé instant coffee (jars, sachets, office machines), valued at retail, excluding milk and sugar? One weekday in Mumbai?"],
      ["I", "Yes."],
      ["C", "Structure: **coffee drinkers × cups a day × share that's instant × Nescafé's share × value of coffee per cup**."],
      ["I", "Drinkers?"],
      ["C", "- Mumbai: ~20 M; aged 15+: 75% → 15 M\n- Mumbai leans towards tea; ~25% drink coffee → **3.75 M**\n- ~1.5 cups a day → 5.6 M cups\n- Instant, vs filter and café coffee: 60% → 3.4 M cups\n- Nescafé's share of instant (vs Bru and others): ~55% → **~1.85 M cups**"],
      ["C", "Each cup uses ~1.8 g of coffee at ~₹4 a gram (₹400 per 100 g jar) ≈ ₹7.2 a cup → **~₹1.33 Cr**. Office vending machines add ~15% → **~₹1.5 Cr** on a weekday."],
      ["I", "Why specify weekday?"],
      ["C", "Office consumption. At weekends vending volume drops but home consumption rises slightly, so a weekend day is probably ~10% lower."]
    ]
  },

  G068: {
    answer: "About 480 million streak snaps a day in India (~240 million active streaks).",
    takeaway: "Social-behaviour counts: daily active users × share doing the behaviour × intensity, and be precise about double counting.",
    turns: [
      ["I", "Estimate the number of Snapchat streaks shared in a day."],
      ["C", "Scoped to India? And do you mean snaps sent to keep streaks alive (each user's side), or unique streaks between pairs of friends?"],
      ["I", "India. Give me both."],
      ["C", "Structure: **Snapchat users → daily active → streak keepers × active streaks each**, then halve for unique pairs."],
      ["I", "Users?"],
      ["C", "India is Snapchat's biggest market, with ~200 M monthly users, heavily aged 13–30. About 60% open it daily → **~120 M daily users**."],
      ["C", "- Actively maintain streaks: ~50% → 60 M\n- Average active streaks per person: ~8\n\nThat's **~480 M streak snaps sent a day**. Each streak needs both friends, so unique streaks are **~240 M**."],
      ["I", "Sensitivity?"],
      ["C", "Streaks per keeper is the big one: teenagers often run 20+, while casual users have 2–3. Median and average differ a lot here, so I'd say 400–600 M snaps."]
    ]
  },

  G069: {
    answer: "About 35 million litres of paint a year for private cars.",
    takeaway: "Industrial consumption: new production (factory painting) + aftermarket (repairs and resprays) with different paint per job.",
    turns: [
      ["I", "Estimate the litres of paint used annually in India to paint private cars."],
      ["C", "Both factory painting of new cars and aftermarket work (accident repairs, panel paint, full resprays)? All coatings: primer, base and clear?"],
      ["I", "Yes, both."],
      ["C", "Structure: **new cars × paint per car (factory) + car parc × repair incidence × paint per job + full resprays**."],
      ["I", "New cars?"],
      ["C", "~4.3 M cars a year × ~5 L each. Factories are efficient, with robotic spraying and little overspray → **~21.5 M L**."],
      ["C", "Aftermarket, on a car parc of ~35 M:\n- Panel repairs: ~20% of cars a year × ~1.5 L → **~10.5 M L**\n- Full resprays (resale or restoration): ~1% × ~10 L → **~3.5 M L**\n\nTotal ≈ **35 M L a year**."],
      ["I", "What's uncertain?"],
      ["C", "Factory paint per car: I've used ~5 L, but premium finishes and SUVs use more. At 7 L, the total rises to ~44 M L. The split also matters commercially: factory paint is a handful of large contracts, while refinish is fragmented across thousands of body shops."]
    ]
  },

  G070: {
    answer: "About 600 million rounds of ammunition a year (range 500–700 million).",
    takeaway: "Unusual questions: stay calm and segment by who does the activity; training usually dwarfs operational use.",
    turns: [
      ["I", "Estimate the number of bullets fired in India annually."],
      ["C", "Live rounds from firearms (military, police, sport and civilian), excluding air-gun pellets and ceremonial blanks?"],
      ["I", "Yes."],
      ["C", "Structure by user type: **number of people who shoot × rounds fired per person per year**. Training should dominate."],
      ["I", "Go ahead."],
      ["C", "- Armed forces: ~1.45 M × ~250 rounds a year → ~360 M\n- Central armed police forces: ~1 M × ~150 → ~150 M\n- State police: ~2 M × ~30 (limited practice) → ~60 M\n- Sport shooters with firearms: ~5,000 serious × ~3,000 → ~15 M\n- Licensed civilians: ~3.5 M × ~5 → ~17.5 M\n- Operational use: ~20 M"],
      ["C", "Total ≈ **620 M, call it ~600 M rounds a year**."],
      ["I", "What would you ask to refine it?"],
      ["C", "Two things: the training rounds per soldier by role, since infantry fire far more than support units, and whether exercises with machine guns are included. Those could move the answer ±100 M."]
    ]
  },

  G071: {
    answer: "About 1 billion chess moves a day in India (online ~70%, offline ~30%).",
    takeaway: "Activity counts: active players × sessions × units per session, with a clear definition of the unit (a move by each player).",
    turns: [
      ["I", "Estimate the total number of chess moves played in a day in India."],
      ["C", "Counting each player's move separately (half-moves), online and over-the-board?"],
      ["I", "Yes."],
      ["C", "Structure: **active players × games a day × moves per game**, separately for online and offline."],
      ["I", "Online?"],
      ["C", "Chess has boomed in India. Across Chess.com and Lichess, say **~2.5 M daily active Indian players**, each playing ~4 fast games (bullet, blitz, rapid). A fast game averages ~70 half-moves.\n\n2.5 M × 4 × 70 = **~700 M moves**."],
      ["C", "Offline: school clubs, academies, tournaments and casual home games, say ~3 M people play on a given day, ~1.5 games each, ~60 moves a game → **~270 M**.\n\nTotal ≈ **~1 B moves a day**."],
      ["I", "Insight?"],
      ["C", "Online bullet and blitz generate most of the moves: a one-minute game packs dozens of moves into a minute, so move counts track fast-format popularity more than player numbers."]
    ]
  },

  G072: {
    answer: "About 1.5–2 lakh injections a day in Ahmedabad, most of them insulin.",
    takeaway: "Segment by clinical use; a chronic, high-frequency use (insulin) can dwarf everything episodic.",
    turns: [
      ["I", "Estimate the number of injections administered in Ahmedabad in a day."],
      ["C", "All injections: vaccines, clinical injections in OPDs and wards, and self-administered insulin? Should blood draws count?"],
      ["I", "Include insulin; exclude blood draws."],
      ["C", "Structure by use: **routine immunisation + outpatient injections + inpatient injections + insulin**. Ahmedabad has ~8.5 M people."],
      ["I", "Go through them."],
      ["C", "- Immunisation: ~145k births a year × ~15 injections by age 2 ≈ 2.2 M a year → **~6k a day**\n- Outpatient: ~4 doctor visits per person a year = 34 M; ~10% get an injection → **~9k a day**\n- Inpatient: ~600k admissions a year × ~8 injections each → **~13k a day**"],
      ["C", "Insulin: ~10% of adults (~590k) are diabetic, ~12% of them use insulin (~70k), injecting about twice a day → **~140k a day**.\n\nTotal ≈ **~170k a day**."],
      ["I", "Interesting. What's the implication?"],
      ["C", "Over 80% of injections happen at home, not in hospitals. For a syringe or insulin-pen company, pharmacies and chronic-care channels matter far more than hospital procurement."]
    ]
  },

  G073: {
    answer: "About 1,800–1,900 burgers a day for a busy outlet.",
    takeaway: "Restaurants: dine-in from seats × turns × occupancy by time band, plus takeaway/delivery; check against kitchen throughput at peak.",
    turns: [
      ["I", "Estimate the number of burgers a McDonald's outlet sells in a day."],
      ["C", "A typical busy outlet in a mall or high street? Dine-in, takeaway and delivery? Only burgers, not wraps or fries?"],
      ["I", "Yes."],
      ["C", "Structure: **dine-in = seats × turns an hour × occupancy by time band × burgers per diner**, plus takeaway and delivery. Then I'll check kitchen capacity at peak."],
      ["I", "Dine-in?"],
      ["C", "80 seats, open 10 am–11 pm. People stay ~25 min, so ~2.4 turns an hour.\n- Lunch, 3 hours: 80% occupancy\n- Dinner, 4 hours: 70%\n- Other, 6 hours: 25%\n\nDiners ≈ 80 × 2.4 × (2.4 + 2.8 + 1.5) ≈ **1,290**. At ~0.9 burgers each (some just have fries or ice cream): **~1,160 burgers**."],
      ["C", "Takeaway and delivery add ~60% of dine-in volume: **~700**. Total ≈ **~1,860 burgers a day**."],
      ["I", "Can the kitchen make that many?"],
      ["C", "At lunch peak, ~140 dine-in burgers plus ~80 delivery is ~220 an hour, about 3.7 a minute. A line of three assemblers at ~1.5 a minute each can do ~4.5, so peak demand is close to kitchen capacity. That's realistic: at lunch you do see the kitchen running flat out."]
    ]
  },

  G074: {
    answer: "About 250–300 aircraft for the Air India group.",
    takeaway: "Fleet = total block hours needed ÷ block hours per aircraft per day, separately for narrow-bodies and wide-bodies, plus spares.",
    turns: [
      ["I", "Estimate the fleet size of Air India."],
      ["C", "The Air India group including Air India Express after the merger? Aircraft in the fleet?"],
      ["I", "Yes, the group."],
      ["C", "Supply-side: **daily flights × block hours per flight → total block hours ÷ hours each aircraft flies a day**, split into narrow-body and wide-body because their missions differ."],
      ["I", "Flights?"],
      ["C", "- Domestic: India has ~3,200 domestic departures a day; the group has ~27% → **~860**, averaging ~1.8 block hours\n- Short-haul international (Gulf, South-East Asia): **~150 a day** at ~4 hours\n- Long-haul wide-body (Europe, North America): **~60 a day** at ~10 hours"],
      ["C", "- Narrow-bodies: 860 × 1.8 + 150 × 4 ≈ 2,150 hours ÷ ~12 hours a day each ≈ **~180 aircraft**\n- Wide-bodies: 60 × 10 = 600 hours ÷ ~14 hours each ≈ **~43 aircraft**\n\nThat's ~225 flying daily; with ~10% spares and maintenance, **~250**, and more including aircraft awaiting parts."],
      ["I", "Good. Final answer?"],
      ["C", "**~250–300 aircraft**. The group is also taking delivery of hundreds more under its large orders, so this number will grow quickly."]
    ]
  },

  G075: {
    answer: "About 3,000–3,500 schools in Mumbai.",
    takeaway: "Facility counts: students ÷ average students per facility, done by school type because sizes vary a lot.",
    turns: [
      ["I", "Estimate the number of schools in Mumbai."],
      ["C", "Greater Mumbai (~13 M people), all schools from primary to Class 12: municipal, private and budget schools?"],
      ["I", "Yes."],
      ["C", "Structure: **school-age children × enrolment → split by school type → ÷ average school size**."],
      ["I", "Students?"],
      ["C", "Ages 5–17 are ~20% of 13 M → 2.6 M; ~95% enrolled → **~2.5 M students**."],
      ["C", "By school type:\n- Large private schools, 50% of students (1.24 M) ÷ ~1,500 each ≈ 820\n- Municipal (BMC) schools, 30% (0.74 M) ÷ ~500 ≈ 1,480\n- Small budget private schools, 20% (0.49 M) ÷ ~600 ≈ 820\n\nTotal ≈ **3,100 schools**."],
      ["I", "Sanity check?"],
      ["C", "Mumbai is ~600 km², so that's ~5 schools per km², about one every 450 m. For a city this dense, where many schools share buildings or run shifts, that feels right. I'd say **3,000–3,500**."]
    ]
  },

  G076: {
    answer: "About 0.9 million tons of AC capacity sold a year (~6 lakh units at 1.5 tons).",
    takeaway: "Capacity units (tons) behave like any durable: installed base in tons ÷ life + base growth; include commercial users.",
    turns: [
      ["I", "Estimate the market size for air conditioners in Mumbai, in tonnage."],
      ["C", "Tons of cooling capacity sold per year in Mumbai, room ACs (split and window) plus smaller commercial VRF systems, excluding large central chillers? New units only?"],
      ["I", "Yes."],
      ["C", "Structure: **installed base in tons (homes + commercial) → annual demand = replacement (base ÷ life) + growth**."],
      ["I", "Homes?"],
      ["C", "Mumbai metro, ~20 M people → ~4.6 M households:\n- High, 15% (0.69 M): 90% own × 2.2 units → 1.37 M\n- Upper-middle, 25% (1.15 M): 55% × 1.2 → 0.76 M\n- Lower-middle, 30% (1.38 M): 12% × 1 → 0.17 M\n\n~2.3 M units × ~1.5 tons ≈ **3.45 M tons**."],
      ["C", "Commercial (offices, shops, restaurants, hospitals) adds ~1.5 M tons, for **~5 M tons installed**.\n\n- Replacement: 5 M ÷ 9 years ≈ 0.55 M tons\n- Growth: ~7% a year ≈ 0.35 M tons\n\nTotal ≈ **0.9 M tons a year**, about 6 lakh units."],
      ["I", "Why use tons?"],
      ["C", "Tonnage captures the shift to larger units and commercial systems that unit counts miss. It's how manufacturers plan production and how installers price jobs."]
    ]
  },

  G077: {
    answer: "About 30,000–40,000 kaali-peeli taxis.",
    takeaway: "Fleet from demand: daily trips × mode share ÷ trips per vehicle per day, then check that peak demand isn't the binding constraint.",
    turns: [
      ["I", "Estimate the number of taxis in Mumbai."],
      ["C", "The traditional black-and-yellow kaali-peeli taxis, not app cabs or autos? Taxis actively operating?"],
      ["I", "Kaali-peeli only."],
      ["C", "Structure: **daily trips in Mumbai × taxi share ÷ trips per taxi per day**, then a peak-hour check."],
      ["I", "Trips?"],
      ["C", "Greater Mumbai has ~13 M people making ~1.4 trips a day, **~18 M trips**. Trains and buses dominate, and app cabs have taken share, so kaali-peelis are ~2.5% → **~450,000 taxi trips a day**."],
      ["C", "Taxis often run two shifts over ~14 hours, doing short trips of ~15–20 minutes: ~15 trips a day each.\n\n450,000 ÷ 15 = **~30,000 taxis**."],
      ["I", "Does peak change anything?"],
      ["C", "Morning peak is ~20% of trips in 3 hours, ~90,000 trips. At ~3 trips an hour a taxi, only ~10,000 taxis are needed then, so peak isn't the constraint; the fleet is sized for all-day demand. Allowing for idle and older taxis still registered, **~30,000–40,000**, and the number has been shrinking as app cabs grow."]
    ]
  }
});
