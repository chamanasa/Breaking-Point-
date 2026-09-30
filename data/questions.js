/*
 * Guesstimate question bank.
 *
 * Replace these SAMPLE entries with the full list. Each entry:
 *   id          unique string, shown as the question number
 *   title       the question as asked in the interview
 *   difficulty  "Easy" | "Medium" | "Hard"
 *   industry    free text; filter options are built from the values used here
 *   type        e.g. "Market sizing", "Revenue estimation", "Count / volume"
 *   approach    e.g. "Population-based", "Household-based", "Supply-side"
 *   geography   optional, e.g. "India", "Mumbai", "Global"
 *   tags        optional array of search keywords
 *   hint        optional one-line nudge, shown on the card and given to the AI
 *   solution    optional outline; shown on the card and used by the AI to judge
 *
 * Loaded as a plain script (not JSON) so the site also works when index.html
 * is opened directly from disk.
 */
window.GUESSTIMATES = [
  {
    id: "G001",
    title: "Estimate the number of pressure cookers sold in India in a year.",
    difficulty: "Easy",
    industry: "Consumer Durables",
    type: "Count / volume",
    approach: "Household-based",
    geography: "India",
    tags: ["kitchen", "appliances", "replacement"],
    hint: "Think replacement demand plus first-time buyers, split urban vs rural.",
    solution: "~300M households; urban 100M at 90% penetration, 7-yr life ≈ 13M; rural 200M at 50%, 10-yr life ≈ 10M; first-time buyers ≈ 1M. Total ≈ 24M units/yr."
  },
  {
    id: "G002",
    title: "How many cups of tea are consumed in Delhi every day?",
    difficulty: "Easy",
    industry: "FMCG / Food & Beverage",
    type: "Count / volume",
    approach: "Population-based",
    geography: "Delhi",
    tags: ["chai", "beverages"],
    hint: "Segment by age group and drinker vs non-drinker, then cups per day.",
    solution: "~20M people; ~70% adults, of whom ~80% drink tea at ~2.5 cups/day ≈ 28M; add out-of-home office/stall consumption already captured in cups/day. ≈ 25–30M cups/day."
  },
  {
    id: "G003",
    title: "Estimate the daily revenue of a petrol pump on a highway.",
    difficulty: "Medium",
    industry: "Energy & Oil",
    type: "Revenue estimation",
    approach: "Supply-side",
    geography: "India",
    tags: ["fuel", "highway", "retail"],
    hint: "Nozzles × vehicles served per hour × average fill × operating hours, split by vehicle type.",
    solution: "8 nozzles, 18 hrs; utilisation varies peak/off-peak; trucks (diesel, large fills) dominate on highways. Volume × price per litre ≈ revenue."
  },
  {
    id: "G004",
    title: "What is the annual market size (in ₹) of diapers in India?",
    difficulty: "Medium",
    industry: "FMCG / Food & Beverage",
    type: "Market sizing",
    approach: "Population-based",
    geography: "India",
    tags: ["baby care", "hygiene", "adult diapers"],
    hint: "Babies 0–2 years by income segment, usage per day, price per diaper. Don't forget adult diapers.",
    solution: "~25M births/yr → ~50M children aged 0–2; penetration by income (high 80%, mid 40%, low 5%); 3–4 diapers/day when used; ~₹12 each. Add a small adult segment."
  },
  {
    id: "G005",
    title: "How many flights take off from Mumbai airport in a day?",
    difficulty: "Medium",
    industry: "Aviation & Travel",
    type: "Count / volume",
    approach: "Supply-side",
    geography: "Mumbai",
    tags: ["airport", "runway", "airline"],
    hint: "Runway capacity: movements per hour × operating hours × utilisation, then half are departures.",
    solution: "~45 movements/hr at peak on the main runway, ~20 hrs of meaningful operations at varying utilisation ≈ 900 movements → ~450 departures/day."
  },
  {
    id: "G006",
    title: "Estimate the number of smartphones sold in India annually.",
    difficulty: "Medium",
    industry: "Technology & Telecom",
    type: "Count / volume",
    approach: "Population-based",
    geography: "India",
    tags: ["mobile", "electronics", "replacement"],
    hint: "Users by urban/rural and income, replacement cycle by segment, plus first-time buyers.",
    solution: "~700M smartphone users; replacement cycles 2–4 yrs by income ≈ 200M replacements… sanity check against ~150M reported shipments and refine."
  },
  {
    id: "G007",
    title: "Estimate the annual revenue of a Starbucks outlet in a Bengaluru mall.",
    difficulty: "Hard",
    industry: "Retail & QSR",
    type: "Revenue estimation",
    approach: "Supply-side",
    geography: "Bengaluru",
    tags: ["cafe", "coffee", "mall"],
    hint: "Hours × customers per hour (peak/off-peak, weekday/weekend) × average ticket size.",
    solution: "12 hrs/day; weekday ~30 orders/hr avg, weekend ~50; average ticket ~₹450; ~360 days. Reconcile against counter throughput capacity."
  },
  {
    id: "G008",
    title: "What is the market size of EV charging stations in India by 2030?",
    difficulty: "Hard",
    industry: "Automotive & Mobility",
    type: "Market sizing",
    approach: "Proxy / ratio",
    geography: "India",
    tags: ["electric vehicles", "infrastructure", "future"],
    hint: "Project the EV fleet by vehicle type, then vehicles-per-charger ratios for public charging.",
    solution: "Project 2W/3W/4W EV stock from sales × adoption curve; most 2W charge at home; apply ~10–20 EVs per public charger for 4W; multiply by capex per charger."
  }
];
