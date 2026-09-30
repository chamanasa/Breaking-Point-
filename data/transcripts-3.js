/* Model interview transcripts, part 3 (G041–G060). Format: see transcripts-1.js. */
window.TRANSCRIPTS = window.TRANSCRIPTS || {};
Object.assign(window.TRANSCRIPTS, {
  G041: {
    answer: "About ₹85–90 lakh a year for a mid-size laundry outlet.",
    takeaway: "Service revenue: orders × items per order × blended price per item, then a capacity check.",
    turns: [
      ["I", "Estimate the annual revenue of a laundry service in Delhi."],
      ["C", "One mid-size outlet offering wash, ironing and dry cleaning with pickup and delivery? Annual revenue?"],
      ["I", "Yes."],
      ["C", "Structure: **orders a day × items per order × average price per item × working days**."],
      ["I", "Orders and items?"],
      ["C", "About 60 orders a day from walk-ins and app pickups, ~12 items each: **720 items a day**."],
      ["C", "Service mix and prices:\n- Wash & iron, 60%: ₹25 an item\n- Iron only, 25%: ₹10\n- Dry cleaning, 15%: ₹150\n\nBlended: 15 + 2.5 + 22.5 = **₹40 an item**, so ~₹480 an order."],
      ["I", "Annual?"],
      ["C", "60 × ₹480 = ₹28,800 a day × 26 days × 12 months ≈ **₹90 lakh a year**."],
      ["C", "Capacity check: ~430 washable items at ~0.25 kg ≈ 110 kg a day, which four commercial machines handle easily. Demand is the constraint, not capacity. My answer is **~₹85–90 lakh**."]
    ]
  },

  G042: {
    answer: "About ₹2 Cr a week across all food-court stalls.",
    takeaway: "Mall F&B: footfall × food-court conversion × spend per diner, checked against seating capacity.",
    turns: [
      ["I", "Estimate the weekly revenue from the food stalls in a mall food court in Delhi."],
      ["C", "A large Delhi mall, all ~20 stalls combined, food court only (not sit-down restaurants)?"],
      ["I", "Yes."],
      ["C", "Structure: **mall footfall × share who eat at the food court × spend per diner**, with a seating check."],
      ["I", "Footfall?"],
      ["C", "About 30,000 visitors a weekday and 60,000 a weekend day: 5 × 30k + 2 × 60k = **270,000 a week**."],
      ["C", "About 25% eat at the food court: ~67,500 diners × ~₹300 each ≈ **₹2 Cr a week**, roughly ₹10 lakh a stall."],
      ["I", "Can the food court seat that many?"],
      ["C", "That's ~9,600 diners a day. With 600 seats over 12 hours at ~1.3 turns an hour, capacity is ~9,400. It's tight at weekends, which matches the queues you see. My answer is **~₹2 Cr a week**."]
    ]
  },

  G043: {
    answer: "About 150 books over a lifetime for the average Indian (roughly 70% of them textbooks).",
    takeaway: "Life-stage models: split life into age bands with different behaviour, then weight by who participates (literacy, education).",
    turns: [
      ["I", "Estimate the number of books an Indian reads in a lifetime."],
      ["C", "Should I count school and college textbooks, or only books read outside the syllabus?"],
      ["I", "Include textbooks, and tell me the split."],
      ["C", "Structure: **life stages × books per year in each × years**, adjusted for literacy and education."],
      ["I", "Stages?"],
      ["C", "- School, ages 5–14 (10 years): ~8 textbooks + ~3 other books a year → ~110\n- Ages 15–22 (8 years): ~60% are still studying (~8 books a year); the rest read ~1 → ~5 a year → ~42\n- Working life, 23–60 (38 years): ~40% read ~1.5 books a year → ~0.6 a year → ~23\n- 60–70 (10 years): ~0.4 a year → ~4"],
      ["C", "A literate Indian reads ~180 books. Adjusting for adult literacy of ~77% and some children leaving school early, the average across all Indians is **~150 books**, about 70% of them textbooks."],
      ["I", "What does that tell you?"],
      ["C", "Beyond education, Indians read fewer than one book a year on average, which is a useful fact for sizing publishing or reading apps."]
    ]
  },

  G044: {
    answer: "About ₹10,000 Cr of government spending on the 2024 Lok Sabha elections.",
    takeaway: "Public-spending questions: find the operational unit (the polling booth), cost it bottom-up, then add central costs.",
    turns: [
      ["I", "Estimate the expenditure incurred by the Government of India on the 2024 Lok Sabha elections."],
      ["C", "Only government spending on conducting the election (Election Commission, states and security), excluding party and candidate campaign spending?"],
      ["I", "Correct."],
      ["C", "The natural unit is the **polling booth**. India has ~97 crore voters and about 10.5 lakh booths, roughly 900 voters each. I'll cost one booth, then add central costs."],
      ["I", "Cost per booth?"],
      ["C", "- Polling staff: 5 people × 3 days × ~₹1,500 ≈ ₹22,500\n- Security: ~₹20,000\n- EVMs/VVPATs: ~1.5 sets × ₹35,000, used over ~3 elections ≈ ₹17,500\n- Transport and logistics: ~₹15,000\n- Booth setup: ~₹5,000\n\nThat's **~₹80,000 a booth** × 10.5 lakh ≈ **₹8,400 Cr**."],
      ["I", "What else?"],
      ["C", "Central costs: electoral roll updates, voter awareness, counting, administration and moving central forces between phases, ~₹1,500–2,000 Cr. Total ≈ **₹10,000 Cr**, about ₹100 per voter."],
      ["C", "Check: ₹100 per voter for the world's largest election is modest, but plausible given how much staffing comes from existing government employees."]
    ]
  },

  G045: {
    answer: "About ₹7,000 Cr a year of alcohol retail value in Mumbai.",
    takeaway: "Regulated consumption: legal-age adults × drinking incidence by gender × spend by income segment.",
    turns: [
      ["I", "Estimate the market size for an alco-beverage firm in Mumbai."],
      ["C", "Is this the total alcoholic beverage market in Mumbai (beer, spirits and wine, at retail and in bars) in annual value? The firm's own share would come after that."],
      ["I", "Size the total market."],
      ["C", "Structure: **legal-age adults × drinkers (by gender) × monthly spend by income**. Maharashtra's legal age is 25 for spirits, so I'll use adults aged 25+."],
      ["I", "Drinkers?"],
      ["C", "Mumbai has ~20 M people; ~60% are 25+ → 12 M. About 45% of men and 10% of women drink, averaging ~27.5% → **~3.3 M drinkers**."],
      ["C", "Monthly spend by income:\n- High, 20% (0.66 M): ₹4,000 → ₹264 Cr\n- Middle, 50% (1.65 M): ₹1,500 → ₹248 Cr\n- Low, 30% (0.99 M): ₹800, mostly country liquor → ₹79 Cr\n\nThat's ~₹590 Cr a month, **~₹7,100 Cr a year**."],
      ["I", "How would the firm use this?"],
      ["C", "Premium spirits come almost entirely from the high-income segment, about 45% of value. A premium brand should target that ~₹3,200 Cr pool, not the headline number."]
    ]
  },

  G046: {
    answer: "About 1.2 lakh red cars in Delhi.",
    takeaway: "Attribute questions: size the base (cars) carefully, then apply one simple share (colour), and say where that share comes from.",
    turns: [
      ["I", "Estimate the number of red cars in Delhi."],
      ["C", "All red cars registered and in use in Delhi NCT, private and commercial? Including maroon shades?"],
      ["I", "Yes, reds and maroons."],
      ["C", "Structure: **cars in Delhi (households by income × ownership × cars per home, plus commercial) × share that are red**."],
      ["I", "Cars?"],
      ["C", "About 4.5 M households:\n- High, 15% (0.68 M): 90% own × 1.6 cars ≈ 0.97 M\n- Upper-middle, 25% (1.13 M): 50% × 1.1 ≈ 0.62 M\n- Lower-middle, 30% (1.35 M): 8% × 1 ≈ 0.11 M\n\nThat's ~1.7 M private cars, plus ~0.15 M taxis and cabs → **~1.85 M cars**."],
      ["I", "What share are red?"],
      ["C", "Indian car colours skew heavily to white (~40%) and grey/silver (~30%), then black (~10%), with red at **~7%**. Cabs are almost never red, so I'll apply it to private cars only: 1.7 M × 7% ≈ **~1.2 lakh red cars**. Red was more popular a decade ago, so the true figure could be slightly higher."]
    ]
  },

  G047: {
    answer: "About 29 million chairs in Delhi households.",
    takeaway: "Household inventory: households by income × units owned, adding up room by room.",
    turns: [
      ["I", "Estimate the number of chairs in households in Delhi."],
      ["C", "Every kind of chair in homes (dining, study, plastic, easy chairs), but not sofas or stools?"],
      ["I", "Yes."],
      ["C", "Structure: **households by income × chairs per household**, built room by room."],
      ["I", "Go ahead."],
      ["C", "About 4.5 M households:\n- High, 15% (0.68 M): ~14 chairs (6 dining, 2 study, 2 balcony, 4 plastic) → 9.5 M\n- Upper-middle, 25% (1.13 M): ~9 → 10.2 M\n- Lower-middle, 30% (1.35 M): ~5 → 6.8 M\n- Low, 30% (1.35 M): ~2 plastic chairs → 2.7 M"],
      ["C", "Total ≈ **29 M chairs**, about 1.5 per person."],
      ["I", "Plausible?"],
      ["C", "With average household size ~4.4, 6–7 chairs per home seems right: enough to seat the family plus a guest or two. My answer is **~29 M**."]
    ]
  },

  G048: {
    answer: "About 1,700 students a day.",
    takeaway: "Commute-mode questions: in-scope people → present that day → mode share, with reasons for each share.",
    turns: [
      ["I", "Estimate the number of students at a Delhi University college who travel by metro every day."],
      ["C", "One college of about 5,000 students, on a typical teaching day?"],
      ["I", "Yes."],
      ["C", "Structure: **students → day scholars → attending that day → metro mode share**."],
      ["I", "Numbers?"],
      ["C", "- Day scholars: 85% (hostels and nearby PGs take the rest) → 4,250\n- Attend on a given day: ~80% → 3,400"],
      ["C", "Mode share, based on where students live and the college's distance from a station:\n- Metro: 50%\n- Bus: 20%\n- Own two-wheeler/car: 10%\n- Cab/auto: 10%\n- Walk: 10%\n\nMetro users: 3,400 × 50% ≈ **1,700 a day**."],
      ["I", "Why so high?"],
      ["C", "Students come from all over the city, and the metro is cheap, predictable and usually within walking distance of DU colleges. A college far from a station might see 30%."]
    ]
  },

  G049: {
    answer: "About 50 million bottles of wine a year (~37 million litres).",
    takeaway: "Premium niche products: the funnel narrows fast by legal age, drinking, category preference and income.",
    turns: [
      ["I", "Estimate the number of wine bottles sold in India in a year."],
      ["C", "Standard 750 ml bottles, grape wine only, domestic and imported, sold in India across retail, restaurants and hotels?"],
      ["I", "Yes."],
      ["C", "Funnel: **adults of legal age → drinkers → wine drinkers (by income) → bottles a year**."],
      ["I", "Numbers?"],
      ["C", "- Adults above drinking age: ~60% of 1.4 B → 840 M\n- Drink alcohol: ~25% → 210 M\n- High-income drinkers, 10% (21 M): 25% drink wine → 5.3 M\n- Middle-income drinkers, 40% (84 M): 3% → 2.5 M\n- Low income: negligible"],
      ["C", "Bottles a year: high-income wine drinkers ~8 → 42 M; middle ~3 → 7.5 M. Total **~50 M bottles**, about 37 M litres."],
      ["I", "Sanity check?"],
      ["C", "That's about 0.03 litres per Indian a year, tiny next to beer and whisky. It matches India's reputation as a small wine market, concentrated in a few metros and tourist states like Goa and Maharashtra."]
    ]
  },

  G050: {
    answer: "About 1–1.5 lakh visitors a day (~1.1 lakh on weekdays, ~2.3 lakh at weekends).",
    takeaway: "Landmark footfall: annual visits from residents, regional visitors and tourists ÷ 365, then shape by weekday and weekend.",
    turns: [
      ["I", "Estimate the number of people who visit India Gate in a day."],
      ["C", "Everyone who visits the India Gate lawns and Kartavya Path area, residents and tourists, on an average day?"],
      ["I", "Yes."],
      ["C", "I'll build **annual visits by visitor type**, divide by 365, then split weekdays and weekends."],
      ["I", "Go ahead."],
      ["C", "- Delhi residents: 20 M × ~1.5 visits a year (evening outings, winter picnics) → 30 M\n- Rest of NCR: 13 M × 0.5 → 6.5 M\n- Domestic tourists to Delhi: ~30 M a year × 50% visit → 15 M\n- Foreign tourists: ~2.5 M × 70% → 1.75 M\n\nTotal ≈ **53 M visits a year → ~145,000 a day**."],
      ["I", "Every day the same?"],
      ["C", "No. Weekends and holidays run about double: ~110,000 on a weekday and ~230,000 on a weekend day. Winter evenings are busier than summer afternoons, so my answer is **~1–1.5 lakh a day**."]
    ]
  },

  G051: {
    answer: "About 20,000–22,000 students a day.",
    takeaway: "Same funnel as any commute question, applied to a bigger catchment: students → present → day scholars → metro share.",
    turns: [
      ["I", "Estimate the number of students who commute by metro to North Campus colleges in Delhi."],
      ["C", "All students of North Campus colleges and departments, on a typical teaching day?"],
      ["I", "Yes."],
      ["C", "Structure: **enrolled students → attending that day → day scholars → metro share**."],
      ["I", "How many students?"],
      ["C", "About 20 colleges averaging ~3,000 regular students is 60,000, plus ~20,000 in postgraduate departments: **~80,000**."],
      ["C", "- Attend on a given day: ~75% → 60,000\n- Day scholars (not in hostels or nearby PGs): ~80% → 48,000\n- Metro share: ~45%, since the Yellow Line stops right at the campus → **~21,600**"],
      ["I", "Check?"],
      ["C", "Peak arrivals of ~15,000 students in a 2-hour morning window, i.e. about 7,500 an hour, is well within one metro station's handling capacity. My answer is **~20,000–22,000 a day**."]
    ]
  },

  G052: {
    answer: "About ₹1.6–1.8 Cr a month for a busy central Delhi outlet.",
    takeaway: "Restaurants: seats × table turns × occupancy by meal period × average bill, plus takeaway.",
    turns: [
      ["I", "Estimate the monthly revenue of a Saravana Bhavan outlet."],
      ["C", "A large outlet in a central location like Connaught Place, dine-in plus takeaway?"],
      ["I", "Yes."],
      ["C", "Structure: **seats × turns an hour × occupancy by meal period → diners × average bill**, plus takeaway and sweets."],
      ["I", "Capacity?"],
      ["C", "About 120 seats, open 8 am–11 pm. South Indian meals are quick (~40 min), so ~1.5 turns an hour.\n\nOccupancy by period:\n- Breakfast, 3 hours: 50%\n- Lunch, 3 hours: 90%\n- Evening snacks, 3 hours: 40%\n- Dinner, 4 hours: 85%\n- Lull, 2 hours: 15%\n\nOccupied seat-hours ≈ 120 × 9.1 ≈ 1,090 × 1.5 turns ≈ **~1,640 diners on a weekday**."],
      ["C", "Weekends run ~25% higher (~2,050). Month: 22 × 1,640 + 8 × 2,050 ≈ **52,500 diners** × ₹300 average bill ≈ ₹1.57 Cr. Takeaway and sweets add ~15%: **~₹1.8 Cr a month**."],
      ["I", "What drives it most?"],
      ["C", "Lunch and dinner occupancy. The low ₹300 bill means the model depends on volume and very fast table turns."]
    ]
  },

  G053: {
    answer: "About ₹40,000–45,000 Cr of quick-commerce GMV a year (~US$5 billion).",
    takeaway: "New-category sizing: limit to the serviceable market (dark-store cities), then adoption and frequency by income.",
    turns: [
      ["I", "Estimate the market size of quick commerce in India."],
      ["C", "Gross merchandise value of 10–30 minute deliveries (Blinkit, Zepto, Instamart and others) over a year?"],
      ["I", "Yes, annual GMV."],
      ["C", "Quick commerce only works where there are dark stores, so I'll restrict to **households in ~40 serviceable cities**, then adoption and order frequency by income."],
      ["I", "Serviceable households?"],
      ["C", "About **50 M households** across metros, Tier-1 and larger Tier-2 cities.\n- High income, 20% (10 M): 60% use it → 6 M × 8 orders a month = 48 M\n- Upper-middle, 30% (15 M): 30% → 4.5 M × 4 = 18 M\n- Rest, 50% (25 M): 5% → 1.25 M × 2 = 2.5 M\n\nThat's **~68.5 M orders a month**."],
      ["C", "At an average order value of ~₹500: ~₹3,400 Cr a month, **~₹41,000 Cr a year**."],
      ["I", "What's the growth story?"],
      ["C", "Two levers: expanding into more Tier-2 cities (the base), and larger baskets as platforms add electronics and beauty (order value). Both are moving fast, so this could double in 2–3 years."]
    ]
  },

  G054: {
    answer: "About ₹45,000–50,000 Cr a year.",
    takeaway: "Ad markets: users on each platform × annual ad revenue per user (ARPU), summed by channel.",
    turns: [
      ["I", "Estimate the size of India's advertising market on non-traditional platforms: OTT, apps, social media and e-commerce."],
      ["C", "Annual ad spend on those four, excluding search ads and traditional media like TV, print and radio?"],
      ["I", "Yes."],
      ["C", "Structure by platform: **users × annual ad revenue per user**."],
      ["I", "Go through them."],
      ["C", "- Social media: ~460 M users × ~₹650 a year ≈ ₹30,000 Cr\n- Ad-supported OTT: ~450 M viewers × ~₹120 ≈ ₹5,400 Cr\n- E-commerce retail media (sponsored listings): ~250 M shoppers × ~₹300 ≈ ₹7,500 Cr\n- Other apps and mobile games: ~500 M users × ~₹100 ≈ ₹5,000 Cr"],
      ["C", "Total ≈ **₹48,000 Cr**."],
      ["I", "Where is the growth?"],
      ["C", "Retail media is growing fastest, because brands pay to appear right where people buy. Social still dominates, with ~60% of the pool. With search added, India's digital ad market would be comfortably above ₹60,000 Cr."]
    ]
  },

  G055: {
    answer: "About ₹11,000–12,000 Cr a year (~US$1.4 billion).",
    takeaway: "Industries that serve both domestic and export demand: size each separately; exports are often the bigger half.",
    turns: [
      ["I", "Estimate the size of the animation and VFX market in India."],
      ["C", "Revenue earned by Indian animation and VFX studios, including outsourced work for global films and shows? Annual?"],
      ["I", "Yes, domestic and export work."],
      ["C", "Structure: **domestic demand by content type + export services**."],
      ["I", "Domestic first."],
      ["C", "- Films: ~100 big films × ~₹10 Cr of VFX + ~300 mid-size × ~₹1 Cr ≈ ₹1,300 Cr\n- OTT and TV series: ~500 × ~₹50 lakh ≈ ₹250 Cr\n- Kids' animation (TV and YouTube): ~₹1,000 Cr\n- Advertising animation and VFX: ~₹1,000 Cr\n- Game art and animation: ~₹500 Cr\n\nDomestic ≈ **₹4,000 Cr**."],
      ["C", "Exports: Indian studios do a large share of global VFX and animation work, worth roughly **₹7,500–8,000 Cr**. Total ≈ **₹11,500 Cr**."],
      ["I", "Insight?"],
      ["C", "Exports are about two-thirds of the market, so the industry's fortunes depend as much on Hollywood production cycles as on Indian box office."]
    ]
  },

  G056: {
    answer: "About 350 litres of paint for an A320-size aircraft.",
    takeaway: "Break complex shapes into cylinders and flat plates (fuselage, wings, tail, engines), then coats ÷ coverage.",
    turns: [
      ["I", "Estimate the volume of paint required to paint an Airbus aircraft."],
      ["C", "A narrow-body like the A320, full exterior livery (primer, base and clear coats)? In litres?"],
      ["I", "Yes."],
      ["C", "I'll approximate the fuselage as a cylinder, the wings and tail as flat plates painted on both sides, and the engines as cylinders, then apply coats and coverage."],
      ["I", "Surface area?"],
      ["C", "- Fuselage: ~37.6 m long, ~4 m diameter → π × 4 × 37.6 ≈ 470 m²\n- Wings: ~122 m² planform × 2 sides ≈ 245 m²\n- Horizontal tail: ~31 m² × 2 ≈ 62 m²\n- Vertical fin: ~21.5 m² × 2 ≈ 43 m²\n- Engine nacelles: 2 × ~25 m² ≈ 50 m²\n\nTotal ≈ **870 m²**."],
      ["C", "After spray loss, ~10 m² per litre per coat, with 4 coats (primer + 2 base + clear): 870 × 4 ÷ 10 ≈ **~350 L**."],
      ["I", "Anything to adjust?"],
      ["C", "Wings are often only partly painted, and liveries vary, so it could be 250–350 L. A detail worth mentioning: 350 L of dried paint weighs a few hundred kg, which is why airlines care about paint weight for fuel burn."]
    ]
  },

  G057: {
    answer: "About 2 crore pens a day (~7 billion a year).",
    takeaway: "Consumables: users by segment × units per month; students are the anchor for stationery.",
    turns: [
      ["I", "Estimate the number of pens bought in India in a day."],
      ["C", "Ballpoint, gel and fountain pens, by individuals and institutions, on an average day?"],
      ["I", "Yes."],
      ["C", "Structure: **users by segment × pens a month ÷ 30**, plus institutional bulk buying."],
      ["I", "Segments?"],
      ["C", "- Primary students (~120 M), who mostly use pencils: 0.3 a month → 36 M\n- Secondary students (~130 M): 2 a month → 260 M\n- College students (~43 M): 2 a month → 86 M\n- Working adults who use pens (~30% of ~500 M workers): 1 a month → 150 M"],
      ["C", "That's ~530 M a month; adding ~10% for offices buying in bulk gives **~585 M a month ≈ 2 crore a day**."],
      ["I", "Sanity check?"],
      ["C", "That's ~7 B pens a year, about 5 per Indian, which fits India being one of the world's largest pen markets with low prices of ₹5–10 a pen."]
    ]
  },

  G058: {
    answer: "About 1.2 billion Gold Flake cigarettes a year in Mumbai (~6 crore packs of 20).",
    takeaway: "Top-down brand demand: total category volume × brand share, with the share borrowed from comparable markets.",
    turns: [
      ["I", "Estimate the annual demand for Gold Flake cigarettes in Mumbai."],
      ["C", "Number of cigarettes (sticks) of all Gold Flake variants sold in Mumbai in a year?"],
      ["I", "Yes."],
      ["C", "Top-down: **size the cigarette market in Mumbai, then apply Gold Flake's share**."],
      ["I", "Market size?"],
      ["C", "- Mumbai: ~20 M people; adults ~75% → 15 M\n- Cigarette smokers (not bidi or chewing tobacco): ~20% of men and ~2% of women → ~11% average → **1.65 M smokers**\n- ~8 cigarettes a day each → 13.2 M sticks a day → **~4.8 B a year**"],
      ["I", "Gold Flake's share?"],
      ["C", "No direct data, so I'll borrow from similar metros where it's a leading mid-premium brand: say **~25%**. That gives ~1.2 B cigarettes, **~6 crore packs of 20**."],
      ["C", "Check: India sells roughly 100 B cigarettes a year, and Mumbai at ~5% of that (with ~1.5% of the population) reflects the urban, higher-income skew of cigarettes. The share assumption is the biggest uncertainty."]
    ]
  },

  G059: {
    answer: "About 34 billion kWh (units) a month.",
    takeaway: "Utility demand: households by urban/rural × income mix × units per month; appliances drive the income gradient.",
    turns: [
      ["I", "Estimate the monthly residential electricity consumption in India."],
      ["C", "Households only, not commercial or industrial? In kWh (units)?"],
      ["I", "Yes, residential only."],
      ["C", "Structure: **households by urban/rural and income × units a month**, adjusting rural for homes without reliable supply."],
      ["I", "Urban?"],
      ["C", "~100 M urban households:\n- Low, 30%: ~100 units a month (lights, fans, TV)\n- Middle, 50%: ~170 (plus fridge, cooler, some AC)\n- High, 20%: ~400 (multiple ACs, geyser)\n\nAverage ≈ 195 → **~19.5 B units**."],
      ["C", "~200 M rural households:\n- Low, 50%: ~40 units\n- Middle, 40%: ~90\n- High, 10%: ~200\n\nAverage ≈ 76 × 97% with supply → **~14.7 B units**.\n\nTotal ≈ **34 B units a month**, ~410 TWh a year."],
      ["I", "Seasonality?"],
      ["C", "Big: summer months could be 40% above winter because of ACs and coolers, so a summer month is ~40 B and a winter month ~28 B. The annual total is consistent with households being about a quarter of India's electricity use."]
    ]
  },

  G060: {
    answer: "About 4 million hours of ads watched on YouTube a day in India.",
    takeaway: "Ad-exposure questions: viewers × videos watched × ad load × average watched ad length, splitting by ad format.",
    turns: [
      ["I", "Estimate the total duration of ads streamed on YouTube daily."],
      ["C", "Can I scope it to India? And count the time ads actually play, including skippable ads skipped after 5 seconds?"],
      ["I", "India is fine. Yes, time actually played."],
      ["C", "Structure: **daily viewers (non-Premium) × videos a day × share of videos with an ad × average watched ad duration**."],
      ["I", "Viewers?"],
      ["C", "About 470 M monthly YouTube users in India, ~60% on a given day → **~280 M daily viewers**; ~97% are not on Premium."],
      ["C", "Each watches ~45 min a day. At ~6 min per video that's ~7.5 videos, and ~60% carry an ad: **~4.5 ads a day**.\n\nAd formats:\n- Non-skippable, 50%: 15 s\n- Skippable but skipped, 40%: ~5 s\n- Skippable, watched in full, 10%: ~30 s\n\nWeighted: 7.5 + 2 + 3 = **12.5 s an ad**."],
      ["I", "Total?"],
      ["C", "4.5 × 12.5 ≈ 56 s per viewer a day. 280 M × 97% × 56 s ≈ 15 B seconds ≈ **~4.2 M hours of ads a day**, about 2% of viewing time, which matches the light ad load people notice on YouTube compared with TV."]
    ]
  }
});
