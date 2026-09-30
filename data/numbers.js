/*
 * India Numbers Bible: rounded working values for guesstimates.
 *
 * Structure: groups → sections → rows. Each row:
 *   metric   what the number is
 *   value    the working value (rounded for mental maths)
 *   source   where it comes from
 *   year     the reference year or period
 *   approx   optional; true marks a working assumption or low-precision figure
 *
 * Refresh these against the listed sources before each interview season.
 */
window.INDIA_NUMBERS = [
  {
    id: "demographic",
    label: "Demographic",
    sections: [
      {
        title: "Population",
        rows: [
          { metric: "World population", value: "~8.1 billion", source: "UN World Population Prospects", year: "2024" },
          { metric: "India population", value: "~1.44 billion (use 140 Cr)", source: "UN World Population Prospects", year: "2024" },
          { metric: "India households", value: "~300 million (use 30 Cr)", source: "Derived: population ÷ ~4.4 average household size (NFHS-5)", year: "2024 est." },
          { metric: "Male / female split", value: "~51% / ~49%", source: "Census of India (sex ratio 943 F per 1,000 M)", year: "2011" },
          { metric: "Life expectancy at birth", value: "~70 years", source: "SRS abridged life tables", year: "2016–20" },
          { metric: "Birth rate", value: "~19 per 1,000 people / year", source: "Sample Registration System bulletin", year: "2021" },
          { metric: "Death rate", value: "~7.5 per 1,000 people / year", source: "Sample Registration System bulletin", year: "2021" }
        ]
      },
      {
        title: "Age divide (working split)",
        rows: [
          { metric: "0–15 years", value: "~25%", source: "Rounded from UN WPP age distribution", year: "2024", approx: true },
          { metric: "15–35 years", value: "~35%", source: "Rounded from UN WPP age distribution", year: "2024", approx: true },
          { metric: "35–60 years", value: "~30%", source: "Rounded from UN WPP age distribution", year: "2024", approx: true },
          { metric: "60+ years", value: "~10%", source: "UNFPA India Ageing Report", year: "2023" }
        ]
      },
      {
        title: "Major city populations (urban agglomeration)",
        rows: [
          { metric: "Delhi", value: "~34 million", source: "UN World Urbanization Prospects (projection)", year: "2024" },
          { metric: "Mumbai", value: "~22 million", source: "UN World Urbanization Prospects (projection)", year: "2024" },
          { metric: "Kolkata", value: "~15.5 million", source: "UN World Urbanization Prospects (projection)", year: "2024" },
          { metric: "Bengaluru", value: "~14 million", source: "UN World Urbanization Prospects (projection)", year: "2024" },
          { metric: "Chennai", value: "~12 million", source: "UN World Urbanization Prospects (projection)", year: "2024" },
          { metric: "Hyderabad", value: "~11 million", source: "UN World Urbanization Prospects (projection)", year: "2024" },
          { metric: "Ahmedabad", value: "~9 million", source: "UN World Urbanization Prospects (projection)", year: "2024" },
          { metric: "Pune", value: "~7 million", source: "UN World Urbanization Prospects (projection)", year: "2024" }
        ]
      },
      {
        title: "Urban vs rural",
        rows: [
          { metric: "Population share", value: "Urban ~36% · Rural ~64%", source: "World Bank (UN Population Division estimates)", year: "2023" },
          { metric: "Literacy rate (age 7+)", value: "Urban ~88% · Rural ~74%", source: "NSS 75th round", year: "2017–18" },
          { metric: "Average household size", value: "Urban ~4 · Rural ~4.5", source: "NFHS-5", year: "2019–21", approx: true },
          { metric: "Internet penetration", value: "Urban ~75% · Rural ~50%", source: "Derived from IAMAI–Kantar Internet in India (397 M urban, 488 M rural users)", year: "2024", approx: true },
          { metric: "Smartphone penetration", value: "Urban ~70% · Rural ~40%", source: "Working assumption; cross-check with IAMAI / TRAI releases", year: "2024", approx: true }
        ]
      },
      {
        title: "Lifestyle",
        rows: [
          { metric: "Vegetarian / non-vegetarian", value: "~25–30% / ~70–75%", source: "NFHS-5 dietary questions (never eat meat, fish or eggs)", year: "2019–21", approx: true }
        ]
      }
    ]
  },
  {
    id: "economic",
    label: "Economic",
    sections: [
      {
        title: "GDP",
        rows: [
          { metric: "Nominal GDP", value: "~₹331 lakh crore (~US$3.9 trillion)", source: "MoSPI provisional estimates", year: "FY2024–25" },
          { metric: "Real GDP (2011–12 prices)", value: "~₹188 lakh crore", source: "MoSPI provisional estimates", year: "FY2024–25" },
          { metric: "Real GDP growth", value: "~6.5%", source: "MoSPI provisional estimates", year: "FY2024–25" },
          { metric: "GDP per capita", value: "~₹2.3 lakh (~US$2,700)", source: "Derived: nominal GDP ÷ population", year: "FY2024–25" }
        ]
      },
      {
        title: "Sector-wise split (share of GVA)",
        rows: [
          { metric: "Agriculture & allied", value: "~18%", source: "Economic Survey", year: "2023–24" },
          { metric: "Industry", value: "~28%", source: "Economic Survey", year: "2023–24" },
          { metric: "Services", value: "~54%", source: "Economic Survey", year: "2023–24" }
        ]
      },
      {
        title: "Household consumption",
        rows: [
          { metric: "Monthly per-capita consumption", value: "Rural ~₹4,100 · Urban ~₹7,000", source: "MoSPI Household Consumption Expenditure Survey", year: "2023–24" },
          { metric: "Food share of consumption", value: "Rural ~47% · Urban ~40%", source: "MoSPI HCES", year: "2023–24" },
          { metric: "Typical urban household budget", value: "Food & groceries 35% · Housing 15% · Savings 15% · Transport 10% · Education 8% · Utilities 7% · Health 5% · Misc 5%", source: "Working split for guesstimates, informed by HCES", year: "2023–24", approx: true }
        ]
      },
      {
        title: "Digital insights",
        rows: [
          { metric: "Active internet users", value: "~886 million", source: "IAMAI–Kantar Internet in India", year: "2024" },
          { metric: "Social media users", value: "~460 million", source: "DataReportal Digital India", year: "Jan 2024" },
          { metric: "Online shoppers", value: "~250 million", source: "Bain & Co / Flipkart, How India Shops Online", year: "2024", approx: true },
          { metric: "E-commerce GMV", value: "~US$60 billion", source: "Bain & Co / Flipkart, How India Shops Online", year: "2024", approx: true },
          { metric: "OTT audience / paid subscriptions", value: "~550 million / ~100 million", source: "Ormax Media OTT Audience Report", year: "2024", approx: true },
          { metric: "UPI transactions", value: "~18–20 billion per month", source: "NPCI monthly statistics", year: "2025" }
        ]
      },
      {
        title: "City tiers",
        rows: [
          { metric: "Tier 1 (HRA class X)", value: "Population 50 lakh+ · e.g. Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad, Pune, Ahmedabad", source: "Ministry of Finance HRA city classification (7th CPC)", year: "2017" },
          { metric: "Tier 2 (HRA class Y)", value: "Population 5–50 lakh · e.g. Jaipur, Lucknow, Indore, Bhopal, Chandigarh, Kochi", source: "Ministry of Finance HRA city classification (7th CPC)", year: "2017" },
          { metric: "Tier 3 (HRA class Z)", value: "Population below 5 lakh · e.g. most district towns", source: "Ministry of Finance HRA city classification (7th CPC)", year: "2017" },
          { metric: "Census town classes", value: "Class I 1 lakh+ · Class II 50k–1 lakh · Class III 20k–50k", source: "Census of India", year: "2011" }
        ]
      },
      {
        title: "Income brackets (households, annual income)",
        rows: [
          { metric: "Rich (above ₹30 lakh)", value: "~3%", source: "PRICE ICE 360° survey", year: "2020–21" },
          { metric: "Middle (₹5–30 lakh)", value: "~31%", source: "PRICE ICE 360° survey", year: "2020–21" },
          { metric: "Aspirers (₹1.25–5 lakh)", value: "~52%", source: "PRICE ICE 360° survey", year: "2020–21" },
          { metric: "Destitute (below ₹1.25 lakh)", value: "~15%", source: "PRICE ICE 360° survey", year: "2020–21" },
          { metric: "Quick working split", value: "High 10% · Upper-middle 20% · Lower-middle 40% · Low 30%", source: "Common interview simplification", year: "—", approx: true }
        ]
      }
    ]
  },
  {
    id: "misc",
    label: "Miscellaneous",
    sections: [
      {
        title: "Indian number system",
        rows: [
          { metric: "1 lakh", value: "100,000", source: "Standard", year: "—" },
          { metric: "1 crore", value: "10 million (100 lakh)", source: "Standard", year: "—" },
          { metric: "1 lakh crore", value: "1 trillion", source: "Standard", year: "—" },
          { metric: "1 billion", value: "100 crore", source: "Standard", year: "—" }
        ]
      },
      {
        title: "Unit conversions",
        rows: [
          { metric: "1 mile", value: "1.6 km", source: "Standard", year: "—" },
          { metric: "1 foot", value: "0.3 m", source: "Standard", year: "—" },
          { metric: "1 cubic metre", value: "1,000 litres", source: "Standard", year: "—" },
          { metric: "1 hectare", value: "10,000 m² ≈ 2.5 acres", source: "Standard", year: "—" },
          { metric: "1 US gallon", value: "3.8 litres", source: "Standard", year: "—" },
          { metric: "1 barrel of oil", value: "159 litres", source: "Standard", year: "—" },
          { metric: "°C to °F", value: "°F = °C × 9/5 + 32", source: "Standard", year: "—" },
          { metric: "1 m/s", value: "3.6 km/h", source: "Standard", year: "—" }
        ]
      },
      {
        title: "Standard formulae",
        rows: [
          { metric: "Market size (value)", value: "Users × purchase frequency × units per purchase × price", source: "Standard", year: "—" },
          { metric: "Revenue", value: "Price × quantity", source: "Standard", year: "—" },
          { metric: "Profit", value: "Revenue − COGS − operating expenses (SG&A, licensing) − interest − tax − D&A", source: "Standard", year: "—" },
          { metric: "Contribution per unit", value: "Price − variable cost per unit", source: "Standard", year: "—" },
          { metric: "Break-even volume", value: "Fixed costs ÷ contribution per unit", source: "Standard", year: "—" },
          { metric: "Growth projection", value: "Y = Y′ × (1 + r)^t · doubling time ≈ 72 ÷ r%", source: "Standard", year: "—" }
        ]
      },
      {
        title: "Vehicles",
        rows: [
          { metric: "Registered vehicles", value: "~330 million (includes inactive / scrapped)", source: "MoRTH Road Transport Year Book", year: "2019–20", approx: true },
          { metric: "Two-wheelers per 1,000 people", value: "~180", source: "Derived from MoRTH registrations (~75% two-wheelers)", year: "2019–20", approx: true },
          { metric: "Cars per 1,000 people", value: "~30", source: "Derived from MoRTH registrations", year: "2019–20", approx: true },
          { metric: "Private vs commercial", value: "~88% private · ~12% commercial", source: "Working split from MoRTH transport / non-transport registrations", year: "2019–20", approx: true },
          { metric: "Annual domestic sales", value: "Passenger vehicles ~4.3 M · Two-wheelers ~19.6 M · Three-wheelers ~0.7 M", source: "SIAM", year: "FY2024–25" }
        ]
      },
      {
        title: "Geography & society",
        rows: [
          { metric: "Area of India", value: "3.287 million km²", source: "Survey of India", year: "—" },
          { metric: "Religion split", value: "Hindu ~80% · Muslim ~14% · Christian ~2.3% · Sikh ~1.7% · Others ~2%", source: "Census of India", year: "2011" }
        ]
      },
      {
        title: "Smartphones",
        rows: [
          { metric: "Mobile OS split", value: "Android ~95% · iOS ~4%", source: "StatCounter", year: "2024" },
          { metric: "Smartphone shipments", value: "~150 million per year", source: "IDC India", year: "2024" }
        ]
      }
    ]
  }
];

/*
 * Charts shown above each Numbers tab. Values mirror the tables above.
 *   hbar  — one bar per row (single series)
 *   stack — parts of a whole (percentages summing to ~100)
 *   pair  — two series side by side per row (e.g. urban vs rural)
 */
window.INDIA_CHARTS = {
  demographic: [
    { type: "hbar", title: "Largest cities (urban agglomeration, million people)", wide: true, unit: " M",
      rows: [["Delhi", 34], ["Mumbai", 22], ["Kolkata", 15.5], ["Bengaluru", 14], ["Chennai", 12], ["Hyderabad", 11], ["Ahmedabad", 9], ["Pune", 7]] },
    { type: "stack", title: "Age divide (% of population)",
      rows: [["0–15", 25], ["15–35", 35], ["35–60", 30], ["60+", 10]] },
    { type: "stack", title: "Where people live (% of population)",
      rows: [["Urban", 36], ["Rural", 64]] },
    { type: "pair", title: "Urban vs rural (%)", wide: true, series: ["Urban", "Rural"],
      rows: [["Literacy", 88, 74], ["Internet", 75, 50], ["Smartphone", 70, 40]] }
  ],
  economic: [
    { type: "stack", title: "Economy by sector (% of GVA)",
      rows: [["Services", 54], ["Industry", 28], ["Agriculture", 18]] },
    { type: "stack", title: "Households by income (PRICE ICE 360°)",
      rows: [["Aspirers", 52], ["Middle", 31], ["Destitute", 15], ["Rich", 3]] },
    { type: "stack", title: "Typical urban household budget (%)", wide: true,
      rows: [["Food", 35], ["Housing", 15], ["Savings", 15], ["Transport", 10], ["Education", 8], ["Utilities", 7], ["Health", 5], ["Misc", 5]] },
    { type: "hbar", title: "Digital India (million users)", wide: true, unit: " M",
      rows: [["Internet users", 886], ["OTT audience", 550], ["Social media", 460], ["Online shoppers", 250], ["Paid OTT", 100]] }
  ],
  misc: [
    { type: "hbar", title: "Vehicles sold in FY2024–25 (million units)", unit: " M",
      rows: [["Two-wheelers", 19.6], ["Passenger vehicles", 4.3], ["Three-wheelers", 0.7]] },
    { type: "stack", title: "Religion (% of population, Census 2011)",
      rows: [["Hindu", 80], ["Muslim", 14], ["Christian", 2.3], ["Sikh", 1.7], ["Others", 2]] },
    { type: "stack", title: "Mobile OS share (%)", wide: true,
      rows: [["Android", 95], ["iOS", 4], ["Other", 1]] }
  ]
};
