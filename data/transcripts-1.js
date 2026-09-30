/*
 * Model interview transcripts, part 1 (G001–G020).
 * Each: { answer, takeaway, turns: [[speaker, text], ...] } where speaker is
 * "I" (interviewer) or "C" (candidate). Text supports **bold**, "- " bullets
 * and blank-line paragraphs. All numbers are illustrative working assumptions.
 */
window.TRANSCRIPTS = window.TRANSCRIPTS || {};
Object.assign(window.TRANSCRIPTS, {
  G001: {
    answer: "About 16–17 million refrigerators a year, worth roughly ₹33,000 Cr.",
    takeaway: "For durables, annual sales = replacement demand (owners ÷ life) + first-time buyers; get ownership right by income and geography.",
    turns: [
      ["I", "Estimate the market size of the Indian refrigerator industry."],
      ["C", "A few clarifications first. Are we sizing annual sales in value terms? Should I include commercial refrigeration like shop coolers, or only household refrigerators?"],
      ["I", "Annual sales value, household refrigerators only."],
      ["C", "Then my structure is:\n\n- **Units sold per year** = replacement demand + first-time buyers\n- **Market size** = units × average selling price\n\nI'll estimate ownership by splitting India's ~300 M households into urban and rural, and each by income."],
      ["I", "Go ahead."],
      ["C", "Urban, 100 M households:\n- High income 20% (20 M), nearly all own one: 20 M\n- Middle 50% (50 M), 80% own: 40 M\n- Low 30% (30 M), 30% own: 9 M\n\nRural, 200 M households:\n- High 10% (20 M), 80% own: 16 M\n- Middle 40% (80 M), 35% own: 28 M\n- Low 50% (100 M), 5% own: 5 M\n\nThat's about 118 M, so call it **120 M refrigerators in use**, roughly 40% of households."],
      ["I", "Seems reasonable. How long does a refrigerator last?"],
      ["C", "About 10 years, so replacement is 120 M ÷ 10 = **12 M a year**. For first-time buyers, ownership is rising by around 1.5 percentage points a year as incomes grow and new households form: 300 M × 1.5% ≈ **4.5 M**. Total: about **16.5 M units a year**."],
      ["I", "And the value?"],
      ["C", "The mix matters. Say 60% are single-door models at about ₹15,000 and 40% are frost-free or double-door at about ₹28,000. The blended price is 0.6 × 15k + 0.4 × 28k ≈ **₹20,000**.\n\n16.5 M × ₹20,000 ≈ **₹33,000 Cr a year**."],
      ["I", "Sanity check?"],
      ["C", "That's one refrigerator for every ~18 households each year. With 40% ownership and a 10-year life, that feels right. The answer is most sensitive to rural ownership and the price mix."]
    ]
  },

  G002: {
    answer: "About 6.5 million tonnes of wheat a month (~80 MT a year) for food use.",
    takeaway: "Regional diets drive staple consumption: split wheat-eating and rice-eating regions before applying per-capita intake.",
    turns: [
      ["I", "Estimate the consumption of wheat in India per month."],
      ["C", "Should I measure tonnes of wheat eaten as food, including processed products like bread and biscuits, or also seed, animal feed and wastage?"],
      ["I", "Food use only, including bakery and processed foods."],
      ["C", "The key driver is diet by region. I'll split India's 1.4 B people into a **wheat-eating belt** (the north, west and centre) and a **rice-eating belt** (the south and east), then multiply by per-capita daily intake."],
      ["I", "How do you split the population?"],
      ["C", "Roughly 60% in the wheat belt, 840 M people, and 40% in the rice belt, 560 M. These per-capita figures already average across children and adults:\n\n- Wheat belt: 4–5 rotis a day at ~35 g of flour each, plus bread and biscuits: about **230 g a day**\n- Rice belt: occasional chapati, bread and biscuits: about **50 g a day**"],
      ["I", "230 g seems high for a child."],
      ["C", "It's an average: an adult man may eat 350 g and a young child 80 g. If you prefer, I can use 200 g, which would reduce the answer by about 12%."],
      ["I", "Keep 230 g. Continue."],
      ["C", "Daily:\n- Wheat belt: 840 M × 0.23 kg ≈ 193 M kg\n- Rice belt: 560 M × 0.05 kg = 28 M kg\n\nThat's about 220 M kg, or **220,000 tonnes a day**. Over 30 days: **~6.6 M tonnes a month**."],
      ["I", "Does that make sense?"],
      ["C", "Annualised it's about 80 MT. India produces roughly 110 MT of wheat, and the rest goes to seed, feed, exports, stocks and losses, so the numbers are consistent. My answer is about **6.5 M tonnes a month**."]
    ]
  },

  G003: {
    answer: "About 1.1 million monthly packs a year: ~95,000 patients on therapy at any time, ~190,000 over the year.",
    takeaway: "Healthcare funnels shrink fast: prevalence → diagnosis → prescription → affordability → adherence → company share.",
    turns: [
      ["I", "Estimate the number of weight-loss drugs sold by a pharma company in India in a year."],
      ["C", "Some scoping first. Do you mean prescription anti-obesity drugs, like the newer injectable therapies? Is it one company, and in what unit: patients, doses or packs?"],
      ["I", "Prescription anti-obesity drugs. One leading company with about 30% market share. Count monthly packs."],
      ["C", "My funnel:\n\n1. Adults → clinically obese\n2. → consult a doctor about weight\n3. → prescribed a drug\n4. → can afford it\n5. × months of therapy a year\n6. × company share"],
      ["I", "Put numbers on it."],
      ["C", "- Adults (20+): 65% of 1.4 B ≈ 910 M\n- Clinically obese: ~8% ≈ 70 M\n- Treatment is mostly urban, which has about 40% of obese adults: 28 M\n- Consult a doctor about weight: 30% → 8.4 M\n- Prescribed a drug: 25% → 2.1 M\n- Can afford ₹10–20k a month: 30% → **~630,000 patients start therapy**"],
      ["I", "Do patients stay on it all year?"],
      ["C", "No. Cost and side effects cause drop-off, so assume an average of 6 months on therapy. 630k × 6 ≈ **3.8 M patient-months** for the market."],
      ["C", "At a 30% share, the company sells about 3.8 M × 0.3 ≈ **1.1 M monthly packs a year**."],
      ["I", "Sanity check it."],
      ["C", "1.1 M packs ÷ 12 is about 95,000 packs a month, so ~95,000 of the company's patients are on therapy at any time, or ~190,000 different patients over the year at 6 months each. For an early, expensive category in a country of 1.4 B, that seems plausible. The biggest lever is affordability, which could double quickly as cheaper generics launch."]
    ]
  },

  G004: {
    answer: "About 55–60 million candles during Diwali week.",
    takeaway: "Festival demand = celebrating households × adoption of the product (vs substitutes) × units per household.",
    turns: [
      ["I", "Estimate the number of candles sold in Assam during Diwali."],
      ["C", "Just to confirm: wax candles only, not clay diyas or electric lights? And sales in the Diwali week?"],
      ["I", "Yes, wax candles, Diwali week, all buyers."],
      ["C", "Structure: Assam households → households that celebrate Diwali → households that use candles, split urban vs rural → candles per household, plus a small add-on for shops and temples."],
      ["I", "Numbers?"],
      ["C", "Assam has about 36 M people, and at ~4.5 per household that's **8 M households**. Roughly 62% are Hindu and celebrate Diwali or Kali Puja, giving **~5 M households**.\n\n- Urban (~20%): 1 M households, 70% use candles → 0.7 M\n- Rural: 4 M households, 40% use candles (diyas and cost matter more) → 1.6 M"],
      ["I", "Why only 40% in rural areas?"],
      ["C", "Clay diyas are traditional and cheaper, and many rural households use only diyas. Candles are convenient but an extra cost."],
      ["C", "Candles per household for the week: urban ~30, rural ~20.\n\n0.7 M × 30 = 21 M and 1.6 M × 20 = 32 M, which is **53 M**. Adding ~10% for shops, offices and temples gives **~58 M**."],
      ["I", "Anything to check against?"],
      ["C", "It works out to about 12 candles per celebrating household across the state, or 2–3 packets each. That feels right. My answer is **55–60 million candles**."]
    ]
  },

  G005: {
    answer: "About 7–8 million pizzas a month.",
    takeaway: "Convert people-servings into the unit asked for: here, pizzas shared between people.",
    turns: [
      ["I", "Estimate the number of pizzas sold in Delhi per month."],
      ["C", "Is that Delhi NCT, with about 20 M people? And restaurant, takeaway and delivery pizzas, excluding frozen supermarket pizza?"],
      ["I", "Yes to both."],
      ["C", "I'll segment eaters by age and income, estimate servings per month, then convert servings to pizzas, since a medium pizza is usually shared."],
      ["I", "Go on."],
      ["C", "People aged roughly 10–50 eat pizza: 60% of 20 M = **12 M**.\n\n- High income 15%: 1.8 M × 3 servings a month = 5.4 M\n- Middle 45%: 5.4 M × 1.5 = 8.1 M\n- Low 40%: 4.8 M × 0.3 = 1.4 M\n\nThat's about **15 M servings a month**."],
      ["I", "How do servings become pizzas?"],
      ["C", "A medium pizza feeds about two people, so 15 M ÷ 2 ≈ **7.5 M pizzas a month**."],
      ["I", "Cross-check it."],
      ["C", "From the supply side: Delhi has perhaps 1,500 pizza outlets across chains and local shops. 7.5 M ÷ 1,500 ÷ 30 ≈ **170 pizzas per outlet per day**. That's plausible for a busy chain outlet, a bit high for small shops, so the truth is probably 6–8 M. My answer is **about 7.5 M a month**."]
    ]
  },

  G006: {
    answer: "About 70,000–80,000 Ola and Uber cabs on an average day.",
    takeaway: "For fleet-size questions, estimate demand (trips) and divide by one vehicle's capacity, then check the peak.",
    turns: [
      ["I", "Estimate the number of Ola and Uber cabs running in Delhi-NCR in a day."],
      ["C", "Cars only, not autos or bike taxis? And unique cabs active on a given day, across both platforms combined?"],
      ["I", "Correct."],
      ["C", "Approach: **daily ride demand ÷ rides per cab per day**, then a peak-hour check.\n\nNCR has ~33 M people making about 1.5 trips each a day, roughly **50 M trips**."],
      ["I", "What share goes to app cabs?"],
      ["C", "It's small, since walking, buses, metro, autos and personal vehicles dominate. Say **1.5%**, which is ~750,000 rides a day."],
      ["C", "A driver on a 12-hour shift completes about 10 rides once pickups and idle time are included. 750k ÷ 10 = **75,000 cabs**."],
      ["I", "What about peak hours?"],
      ["C", "Say 40% of rides, 300k, fall in 4 peak hours. At about 2 rides an hour, a cab does 8 peak rides, so ~37,500 cabs must be on the road at peak. Many drivers work partial shifts, so ~75k unique cabs across the day is consistent with that.\n\nMy answer is **70,000–80,000 cabs**."]
    ]
  },

  G007: {
    answer: "About 6 million tyres discarded in Delhi each year (~17,000 a day).",
    takeaway: "Proxy chains work well: vehicle stock × tyres per vehicle ÷ tyre life, done by vehicle type.",
    turns: [
      ["I", "Estimate the number of used tyres in Delhi."],
      ["C", "“Used” could mean tyres currently on roads, or tyres worn out and discarded each year. Which one?"],
      ["I", "Tyres discarded each year."],
      ["C", "Then: **vehicles by type × tyres per vehicle ÷ tyre life**.\n\nDelhi has about 8 M registered vehicles, of which ~6 M are actually on the road:\n- Two-wheelers: 4 M\n- Cars: 1.6 M\n- Autos (three-wheelers): 0.1 M\n- Trucks and buses: 0.3 M"],
      ["I", "Tyre lives?"],
      ["C", "- Two-wheelers: 2 tyres, ~3 years → 4 M × 2 ÷ 3 ≈ 2.7 M\n- Cars: 4 tyres, ~4 years → 1.6 M\n- Autos: 3 tyres, ~1.5 years (heavy use) → 0.2 M\n- Trucks and buses: ~8 tyres, ~1.5 years → 1.6 M\n\nTotal ≈ **6.1 M tyres a year**."],
      ["I", "Anything missing?"],
      ["C", "Spare tyres rarely wear out, and outside trucks that pass through leave tyres elsewhere, so I've left both out. As a check, it's about one tyre per active vehicle a year, which fits with typical tyre lives of 3–4 years. My answer is **~6 M a year**."]
    ]
  },

  G008: {
    answer: "About 350 million new users in the last year (~1 million sign-ups a day).",
    takeaway: "New users = net growth + users replacing those who churned; don't forget markets where the product isn't available.",
    turns: [
      ["I", "Estimate the number of users who joined Instagram in the last year."],
      ["C", "Globally, and counting genuinely new people, not duplicate or bot accounts?"],
      ["I", "Yes, global unique new users."],
      ["C", "I'll first size the current user base, then say new joiners = **net growth + replacement of users who left**."],
      ["I", "Size the base."],
      ["C", "- World internet users: ~5.4 B\n- Minus China, where it's blocked (~1.05 B): ~4.35 B reachable\n- Instagram adoption among reachable users: ~45%, higher among 15–35s and lower among older users\n\nThat gives about **2 B monthly users**."],
      ["I", "And growth?"],
      ["C", "Say the base grows ~10% a year: **+200 M net**. On top of that, about 8% of users stop using it each year, and those have to be replaced for the net figure to hold: 2 B × 8% = **160 M**. So new joiners ≈ 360 M."],
      ["I", "Sanity check?"],
      ["C", "That's about 1 M sign-ups a day globally. Teens coming of age and fast-growing internet markets like India, Indonesia and Brazil make that plausible. My answer is **~350 M**."]
    ]
  },

  G009: {
    answer: "About ₹35,000 Cr (~US$4 billion) a year.",
    takeaway: "Personal-care sizing: segment users by geography and gender, then use annual spend per user rather than unit counts.",
    turns: [
      ["I", "Estimate the market size of the skin care industry in India."],
      ["C", "Which categories count? I'd include face wash, moisturisers, sunscreen, serums and creams, but exclude bar soap and cosmetics. Annual retail value?"],
      ["I", "That works."],
      ["C", "Structure: **users by urban/rural and gender × usage rate × annual spend per user**. Ages 15–60 are 60% of 1.4 B, about 840 M people: ~294 M urban and ~546 M rural."],
      ["I", "Why split by gender?"],
      ["C", "Usage and spend differ a lot: women use more products at higher price points.\n\n- Urban women: 147 M × 90% use = 132 M × ₹1,500 a year = ₹19,800 Cr\n- Urban men: 147 M × 75% = 110 M × ₹600 = ₹6,600 Cr\n- Rural women: 273 M × 60% = 164 M × ₹400 = ₹6,560 Cr\n- Rural men: 273 M × 40% = 109 M × ₹200 = ₹2,180 Cr"],
      ["C", "Total ≈ **₹35,000 Cr**, about US$4 B."],
      ["I", "Where could this be wrong?"],
      ["C", "Urban women's spend is the biggest lever, since premium serums and sunscreen are growing fast. If it's ₹2,000 rather than ₹1,500, the market is ~₹42,000 Cr. Published estimates of $3–4 B suggest we're in the right range."]
    ]
  },

  G010: {
    answer: "About ₹25 lakh a week for a 3-screen urban cinema.",
    takeaway: "Cinema revenue = seats × shows × occupancy × ticket price, plus F&B per head; weekday and weekend differ sharply.",
    turns: [
      ["I", "Estimate the weekly revenue of an average urban Indian cinema."],
      ["C", "Is this a multiplex or a single screen? And revenue from tickets, food and beverage, and on-screen ads?"],
      ["I", "A typical 3-screen multiplex; include all three."],
      ["C", "Capacity: 3 screens × ~220 seats × 5 shows = **3,300 seat-shows a day**. I'll split the week into 4 weekdays and a 3-day weekend (Friday–Sunday), when new releases open."],
      ["I", "Occupancy?"],
      ["C", "Weekdays ~20%, weekends ~40%.\n\n- Weekdays: 4 × 3,300 × 0.2 = 2,640 tickets\n- Weekend: 3 × 3,300 × 0.4 = 3,960 tickets\n\nThat's **~6,600 tickets a week**."],
      ["C", "Revenue:\n- Tickets: 6,600 × ₹230 ≈ ₹15.2 lakh\n- Food and beverage: ₹130 per head → ₹8.6 lakh\n- Ads: ~₹1 lakh\n\nTotal ≈ **₹25 lakh a week**."],
      ["I", "Does that hold up annually?"],
      ["C", "×52 ≈ ₹13 Cr a year, or about ₹4.3 Cr per screen. Listed multiplex chains report roughly ₹3.5–4 Cr per screen, so I'm slightly high, possibly on weekend occupancy. I'd say **₹22–25 lakh a week**."]
    ]
  },

  G011: {
    answer: "About ₹9–10 lakh of food revenue a week.",
    takeaway: "For ancillary revenue, first size footfall from the core activity's capacity, then apply attach rate × spend.",
    turns: [
      ["I", "Estimate the weekly food revenue of a bowling alley in Delhi."],
      ["C", "Is this a mall-based alley with its own café, counting only food and drinks, not games?"],
      ["I", "Yes."],
      ["C", "Structure: **lanes × hours × occupancy → lane-hours → visitors → share who order × average food bill**."],
      ["I", "Capacity?"],
      ["C", "12 lanes, open 11 am to 11 pm (12 hours). A group of ~5 uses a lane for about an hour.\n\n- Weekdays: 12 × 12 × 35% ≈ 50 lane-hours a day × 5 days = 252\n- Weekends: 12 × 12 × 75% = 108 a day × 2 = 216\n\nThat's **~470 lane-hours a week** → × 5 players ≈ 2,340 bowlers, plus ~20% non-playing friends, so **~2,800 visitors**."],
      ["I", "How many eat?"],
      ["C", "Games last a while and people snack, so ~70% order: ~1,960 visitors × ₹450 (fries, burgers, soft drinks) ≈ **₹8.8 lakh**. Add walk-in café customers at ~₹70k, for about **₹9.5 lakh a week**."],
      ["I", "Sanity check?"],
      ["C", "Food works out to about ₹340 per visitor, against a bowling spend of ~₹600, so food is about a third of the total bill. That's typical for entertainment venues. My answer is **~₹9–10 lakh a week**."]
    ]
  },

  G012: {
    answer: "About 26 million person-hours a week (~6 hours per office-goer).",
    takeaway: "Time-use questions: people in scope × days × time per day, with mode and work-pattern splits.",
    turns: [
      ["I", "Estimate the weekly commute time for office-goers in Delhi."],
      ["C", "Is that the total across all office-goers in Delhi NCT, in person-hours, for round trips?"],
      ["I", "Yes, total person-hours."],
      ["C", "Structure: **office-goers × office days a week × round-trip time**, splitting commute time by mode."],
      ["I", "How many office-goers?"],
      ["C", "Delhi has ~20 M people. About 35% are employed, **7 M workers**. Excluding shopkeepers working where they live, home-based work and full-time remote workers, ~60% commute to a fixed workplace: **4.2 M**."],
      ["C", "Office days: ~25% are hybrid at 3 days, and 75% work 5–6 days (average 5.5). The weighted average is 0.25 × 3 + 0.75 × 5.5 ≈ **5 days**."],
      ["I", "And time per day?"],
      ["C", "By mode, round trip:\n- Metro/bus, 40% of commuters: ~100 min\n- Car/two-wheeler, 40%: ~70 min\n- Walk/cycle/short trips, 20%: ~30 min\n\nWeighted: 40 + 28 + 6 = **74 min ≈ 1.25 hours**.\n\nTotal: 4.2 M × 5 × 1.25 ≈ **26 M person-hours a week**, about 6 hours per office-goer."],
      ["I", "Reasonable?"],
      ["C", "An hour and a quarter a day is in line with commute surveys for large Indian cities. My answer is **~26 M hours**."]
    ]
  },

  G013: {
    answer: "About ₹1 crore a day.",
    takeaway: "Toll plazas are capacity problems: lanes × throughput by time band × toll by vehicle type, with an effective toll after passes.",
    turns: [
      ["I", "Estimate the revenue of the Delhi–Gurgaon toll plaza in a day."],
      ["C", "Is that one plaza on the expressway, both directions, on a typical weekday?"],
      ["I", "Yes."],
      ["C", "Structure: **lanes × vehicles per lane per hour × hours, by time band → split by vehicle type → × toll**."],
      ["I", "Traffic?"],
      ["C", "Say 24 lanes across both directions. With FASTag, a lane handles ~300 vehicles an hour at peak.\n\n- Peak, 6 hours: 24 × 300 × 6 = 43,200\n- Normal, 12 hours at 120 an hour: 34,560\n- Night, 6 hours at 40 an hour: 5,760\n\nThat's **~84,000 vehicles a day**."],
      ["I", "Many cars use monthly passes."],
      ["C", "Good point, so I'll use an effective car toll of ~₹70 rather than the ₹100 single-trip rate.\n\n- Cars, 75%: 63k × ₹70 ≈ ₹44 lakh\n- Buses/LCVs, 10%: 8.4k × ₹160 ≈ ₹13 lakh\n- Trucks, 15%: 12.6k × ₹350 ≈ ₹44 lakh\n\nTotal ≈ **₹1 Cr a day**."],
      ["I", "Sanity check?"],
      ["C", "That's ~₹370 Cr a year for one of India's busiest urban plazas, which seems plausible. Trucks are 15% of vehicles but ~45% of revenue, so the truck share is the key sensitivity."]
    ]
  },

  G014: {
    answer: "About 4 lakh Swiggy orders a day in Delhi.",
    takeaway: "Platform orders = market orders × platform share; build the market from active ordering users by income.",
    turns: [
      ["I", "Estimate the number of orders placed on Swiggy in Delhi in a day."],
      ["C", "Only food delivery, not Instamart groceries? And Delhi NCT?"],
      ["I", "Food delivery, Delhi NCT."],
      ["C", "Structure: **people who order food online × orders a month → market orders → × Swiggy's share**."],
      ["I", "Who orders?"],
      ["C", "Of Delhi's 20 M people:\n- High income, 15% (3 M): 80% order online → 2.4 M\n- Middle, 45% (9 M): 35% → 3.15 M\n- Low income: negligible\n\nThat's about **5.5 M ordering users**."],
      ["C", "Orders a month: high income ~8, middle ~3 → 19.2 M + 9.5 M ≈ **29 M orders a month**, ~0.96 M a day across platforms."],
      ["I", "Swiggy's share?"],
      ["C", "About 45%, with Zomato slightly ahead, so **~430,000 orders a day**."],
      ["I", "Cross-check?"],
      ["C", "Swiggy does roughly 2 M food orders a day nationally, and Delhi being ~20% of that is plausible for its largest market. My answer is **~4 lakh a day**."]
    ]
  },

  G015: {
    answer: "About 100 million credit cards (held by ~65 million people).",
    takeaway: "Separate holders from cards: eligibility is by income, and wealthier holders carry multiple cards.",
    turns: [
      ["I", "Estimate the number of credit cards in India."],
      ["C", "Active cards issued in India, counting multiple cards per person separately?"],
      ["I", "Yes, total cards."],
      ["C", "Structure: **adults by income → share who hold a card → cards per holder**. Eligibility depends on formal income and credit history."],
      ["I", "Go ahead."],
      ["C", "Adults (20+) ≈ 900 M.\n\n- Top 3% by income (27 M): 90% hold → 24 M holders × 2.2 cards = 53 M\n- Upper-middle 12% (108 M): 30% → 32 M × 1.3 = 42 M\n- Lower-middle 30% (270 M): 3% → 8 M × 1 = 8 M\n- The rest: negligible"],
      ["I", "Why so few in the lower-middle segment?"],
      ["C", "Many are informally employed without documented income, and UPI and debit cards already meet most payment needs."],
      ["C", "Total: ~64 M holders and **~103 M cards**. That's roughly 7% of adults, which fits India being under-penetrated versus markets like the US. My answer is **~100 M cards**."]
    ]
  },

  G016: {
    answer: "About 2.5 million education loan accounts outstanding.",
    takeaway: "Stock = annual flow × average time outstanding; estimate new loans each year, then how long they stay on the books.",
    turns: [
      ["I", "Estimate the number of outstanding education loans in India."],
      ["C", "Number of loan accounts, not value? Including loans for study abroad?"],
      ["I", "Accounts, including study abroad."],
      ["C", "It's a stock, so: **new loans a year × average years a loan stays outstanding**."],
      ["I", "New loans?"],
      ["C", "- Domestic: ~43 M students in higher education; with ~3.5-year courses, ~12 M new entrants a year. About 2% borrow, mostly for professional courses → **~240k**\n- Abroad: ~750k students leave each year; ~35% borrow → **~260k**\n\nThat's **~500k new loans a year**."],
      ["I", "How long do they stay outstanding?"],
      ["C", "A loan runs through the course plus a moratorium, then repayment. Big loans take 7+ years to repay, but many small ones are prepaid quickly. On average, **~5 years**."],
      ["C", "500k × 5 = **~2.5 M outstanding loans**."],
      ["I", "Check?"],
      ["C", "At an average of ₹5 lakh per loan, that's ~₹1.25 lakh Cr of outstanding education credit, which is about the size bank data suggests. My answer is **~2.5 M**."]
    ]
  },

  G017: {
    answer: "About 1 million burgers a day in Delhi.",
    takeaway: "Frequency by income segment does most of the work in food-consumption guesstimates.",
    turns: [
      ["I", "Estimate the number of burgers consumed per day in Delhi."],
      ["C", "All burgers, from chains like McDonald's to street stalls and home-made ones? Delhi NCT?"],
      ["I", "Everything, Delhi NCT."],
      ["C", "Structure: **burger-eating population × burgers per week by income ÷ 7**."],
      ["I", "Who eats burgers?"],
      ["C", "Mostly people aged ~10–45, which is ~55% of 20 M = **11 M**.\n\n- High income, 15% (1.65 M): 2 a week → 3.3 M\n- Middle, 45% (4.95 M): 0.7 a week → 3.5 M\n- Low, 40% (4.4 M): 0.15 a week (street aloo-tikki burgers) → 0.66 M\n\nThat's **~7.4 M a week**, about **1.06 M a day**."],
      ["I", "Is 2 a week realistic for high income?"],
      ["C", "It's an average: some teens eat four, many adults none. Even at 1.5 a week, the total only drops by ~11%."],
      ["C", "Cross-check: Delhi has perhaps 2,500 places selling burgers, from chains to street carts. 1 M ÷ 2,500 = 400 a day each, which is high for small carts but fine for chains. My answer is **~1 M a day**."]
    ]
  },

  G018: {
    answer: "About 1,900 viewing hours a day (~0.4 hours per student).",
    takeaway: "Usage-time questions: access × daily active share × hours per active day, weekday vs weekend.",
    turns: [
      ["I", "Estimate the daily Netflix viewing hours of students at a Delhi University college."],
      ["C", "One college of about 5,000 students? Total hours across all students on an average day, Netflix only?"],
      ["I", "Yes."],
      ["C", "Structure: **students with access × share who watch on a given day × hours per viewing day**."],
      ["I", "Access?"],
      ["C", "Many share a family or friend's login. Say 45% have access: **2,250 students**."],
      ["C", "Daily viewers: ~50% of them on weekdays (classes, other apps) and ~70% at weekends. Weighted: (5 × 0.5 + 2 × 0.7) ÷ 7 ≈ 56% → **~1,250 viewers a day**.\n\nHours: ~1.2 on weekdays and ~2.2 at weekends, averaging **~1.5 hours**."],
      ["I", "Total?"],
      ["C", "1,250 × 1.5 ≈ **1,900 hours a day**, or ~0.4 hours per student across the whole college."],
      ["I", "Believable?"],
      ["C", "Students split screen time between YouTube, Instagram and other OTT apps, so under half an hour of Netflix per student is sensible. The access share is the swing factor."]
    ]
  },

  G019: {
    answer: "About 650–700 departures a day from Delhi airport.",
    takeaway: "Airport questions: runway movements by time band, halve for departures, and cross-check with passenger traffic.",
    turns: [
      ["I", "Estimate the number of flights that take off from Delhi airport in a day."],
      ["C", "IGI airport, departures only, passenger and cargo, on a typical day?"],
      ["I", "Yes."],
      ["C", "Supply-side: **runway movements per hour by time band → total movements → half are departures**."],
      ["I", "Capacity?"],
      ["C", "With three main runways operating together, IGI handles ~70 movements an hour at peak.\n\n- Peak, 8 hours × 72 = 576\n- Shoulder, 8 hours × 60 = 480\n- Night, 8 hours × 30 = 240\n\nThat's **~1,300 movements**, so **~650 departures**."],
      ["I", "Can you check that another way?"],
      ["C", "Demand side: IGI handles ~75 M passengers a year, ~205k a day, of which ~102k are departing. With an average aircraft of ~180 seats at ~85% load, that's ~150 passengers a flight, so 102k ÷ 150 ≈ **680 departures**."],
      ["C", "The two methods agree. My answer is **650–700 departures a day**."]
    ]
  },

  G020: {
    answer: "About 30 million cups of tea a day in Delhi.",
    takeaway: "Age-based segmentation plus a check against per-capita commodity consumption.",
    turns: [
      ["I", "Estimate the number of tea cups consumed in Delhi each day."],
      ["C", "All tea, at home, office and street stalls, in Delhi NCT?"],
      ["I", "Yes."],
      ["C", "Structure: **population by age → share who drink tea → cups a day**, plus daily commuters coming in from NCR."],
      ["I", "Numbers?"],
      ["C", "Delhi has ~20 M people:\n- Under 15 (25%, 5 M): 10% drink, 0.5 cups → 0.25 M\n- 15–60 (65%, 13 M): 80% drink, 2.5 cups → 26 M\n- 60+ (10%, 2 M): 90% drink, 2.5 cups → 4.5 M\n\nThat's **~31 M cups**. Add ~2 M daily commuters from NCR at one cup each: **~33 M**."],
      ["I", "Sanity check?"],
      ["C", "Using tea leaves: Indians consume roughly 1 kg of tea a year each. 20 M × 1 kg ÷ 365 ≈ 55,000 kg a day. At ~2.5 g per cup, that's ~22 M cups. Delhi likely drinks more than the national average, so **~30 M cups a day** is a fair answer."]
    ]
  }
});
