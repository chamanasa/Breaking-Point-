/* Firm profiles for Firm-Specific Prep.
 *
 * `bank` is the firm's name exactly as it appears in data/questions.js ("Asked at"),
 * so the profile can list that firm's questions. `color` and `mark` drive the logo
 * tile; to use an official logo instead, add `logo: "img/firms/<file>.svg"`.
 * `style` tells the AI interviewer how to run a mock in this firm's format.
 *
 * Formats change by office and year: profiles describe the typical process and
 * point candidates to the firm's careers page for the current one.
 */
window.FIRMS = [
  {
    id: "mckinsey", name: "McKinsey & Company", short: "McKinsey", bank: "McKinsey", group: "global",
    color: "#051c2c", mark: "McK",
    tagline: "Interviewer-led cases and a deep-dive personal experience interview.",
    caseStyle: "Interviewer-led",
    rounds: "Usually two rounds, each with two or three back-to-back interviews",
    test: "Solve, a digital problem-solving game, in many offices",
    fit: "Personal Experience Interview (PEI)",
    format: [
      "Each interview pairs a case with a Personal Experience Interview of about 10 to 15 minutes.",
      "The interviewer drives the case: you answer a sequence of focused questions on structure, an exhibit, a calculation, a brainstorm and a final synthesis.",
      "The PEI goes deep on one story, with follow-up questions about what you did, why and what changed as a result."
    ],
    assesses: ["Structured problem solving", "Quantitative accuracy under time pressure", "Creativity in brainstorms", "Crisp synthesis", "Personal impact, entrepreneurial drive, inclusive leadership and courageous change (PEI)"],
    tips: [
      "Treat each question as a mini-case: restate it, structure, then answer. Expect to be moved on before you finish.",
      "Brainstorms are scored on breadth and structure. Group ideas into buckets before listing them.",
      "Prepare one detailed story per PEI dimension, rich enough for five or six levels of follow-up.",
      "Close every case with a top-down recommendation, two supporting reasons and next steps."
    ],
    style: "Run the interview McKinsey-style, interviewer-led: you drive. After the opening, ask one focused question at a time (structure first, then a specific calculation, then a brainstorm, then a final synthesis), and move the candidate on once each part is answered. Expect crisp, hypothesis-driven answers."
  },
  {
    id: "bcg", name: "Boston Consulting Group", short: "BCG", bank: "BCG", group: "global",
    color: "#197a56", mark: "BCG",
    tagline: "Candidate-led cases with a strong eye for business judgement.",
    caseStyle: "Candidate-led",
    rounds: "Usually two or three rounds of two interviews each",
    test: "An online case or chatbot-based assessment in some offices",
    fit: "Short fit discussion at the start of each interview",
    format: [
      "Each interview opens with a few minutes on your CV and motivation, then a case of 25 to 35 minutes.",
      "You lead: clarify, propose a structure, decide which branch to explore first and ask for the data you need.",
      "Interviewers often go off-script to test business sense and creativity."
    ],
    assesses: ["Structured, hypothesis-driven thinking", "Business judgement and intuition", "Comfort with numbers and charts", "Clear, confident communication", "Motivation for consulting and BCG"],
    tips: [
      "State a hypothesis early and let it steer which branch you explore first.",
      "Say the so-what after every calculation: what the number means for the client.",
      "Expect open questions with no single right answer. Show judgement and commit.",
      "Have a crisp 'why consulting, why BCG' that ties to your own story."
    ],
    style: "Run the interview BCG-style, candidate-led: let the candidate drive. Answer their questions and share data only when they ask for it. Probe their business judgement with 'why' and 'so what' questions, and occasionally ask an open-ended creative question."
  },
  {
    id: "bain", name: "Bain & Company", short: "Bain", bank: "Bain", group: "global",
    color: "#cc0000", mark: "Bain",
    tagline: "Candidate-led cases, a results focus and a big emphasis on fit.",
    caseStyle: "Candidate-led",
    rounds: "Usually two rounds; some offices add a written or presentation case in the final round",
    test: "An online assessment in some offices",
    fit: "Fit and motivation questions in every interview",
    format: [
      "Interviews mix a case with fit questions about your experiences, teamwork and why Bain.",
      "Cases are candidate-led and practical: what should the client actually do?",
      "Some final rounds use a written case: read a data pack, then present a recommendation."
    ],
    assesses: ["Practical, results-oriented recommendations", "Structured and numerate problem solving", "Team fit and collaboration", "Ownership and drive", "Client-ready communication"],
    tips: [
      "Anchor every case on the client's goal and finish with an actionable recommendation.",
      "Practise a written case: 30 minutes on a data pack, then three slides of recommendation.",
      "Fit carries real weight. Prepare stories about teamwork, leadership and a setback.",
      "Show energy and warmth; interviewers ask themselves whether they'd enjoy working with you."
    ],
    style: "Run the interview Bain-style, candidate-led and practical: let the candidate drive, keep pulling them back to what the client should actually do, and push for an actionable, results-focused recommendation at the end."
  },
  {
    id: "kearney", name: "Kearney", short: "Kearney", bank: "Kearney", group: "global",
    color: "#5b21b6", mark: "K",
    tagline: "Candidate-led cases with an operations and value-creation flavour.",
    caseStyle: "Candidate-led",
    rounds: "Usually two to three rounds",
    test: "Varies by office",
    fit: "Behavioural questions alongside each case",
    format: [
      "Cases are candidate-led and often touch operations, procurement, supply chain or cost.",
      "Expect guesstimates and quantitative questions, especially in campus recruiting.",
      "Fit questions explore teamwork, leadership and motivation."
    ],
    assesses: ["Structured problem solving", "Quantitative rigour", "Operational and cost intuition", "Communication", "Fit with the team"],
    tips: [
      "Brush up on cost structures, supply chains and procurement levers.",
      "Quantify the impact of each recommendation where you can.",
      "Practise guesstimates with operational drivers (capacity, utilisation, throughput)."
    ],
    style: "Run the interview Kearney-style, candidate-led, and steer toward operational drivers such as capacity, utilisation, cost and supply chain when relevant."
  },
  {
    id: "accenture", name: "Accenture Strategy", short: "Accenture", bank: "Accenture", group: "global",
    color: "#a100ff", mark: "A",
    icon: "m.66 16.95 13.242-4.926L.66 6.852V0l22.68 9.132v5.682L.66 24Z",
    tagline: "Guesstimates and cases with a digital and technology lens.",
    caseStyle: "Mixed",
    rounds: "Usually two to three rounds of case and behavioural interviews",
    test: "Varies by office and programme",
    fit: "Behavioural and motivation questions",
    format: [
      "Campus interviews often open with a guesstimate, then a short business case.",
      "Cases frequently involve technology, digital transformation or operations.",
      "Behavioural questions test client focus, teamwork and learning agility."
    ],
    assesses: ["Structured thinking", "Comfort with estimation", "Understanding of technology's business impact", "Client presence", "Learning agility"],
    tips: [
      "Have a point of view on how AI, cloud and data change the industry in your case.",
      "Guesstimates are common: practise clean segmentation and quick sanity checks.",
      "Link recommendations to implementation: people, process and technology."
    ],
    style: "Run the interview Accenture Strategy-style: start with the guesstimate, then probe how technology or digital levers could change the answer or the client's business."
  },
  {
    id: "ey-parthenon", name: "EY-Parthenon", short: "EY-Parthenon", bank: "", group: "global",
    color: "#2e2e38", ink: "#ffe600", mark: "EY",
    tagline: "Commercial due diligence and market-sizing heavy cases.",
    caseStyle: "Candidate-led",
    rounds: "Usually two to three rounds",
    test: "Varies by office",
    fit: "Behavioural questions in each round",
    format: [
      "Cases often look like commercial due diligence: is this market attractive, and is this company well placed?",
      "Market sizing is central, so expect guesstimates inside cases.",
      "Some offices include a written or presentation exercise."
    ],
    assesses: ["Market sizing", "Investor mindset", "Structured analysis", "Synthesis", "Communication"],
    tips: [
      "Learn the due-diligence lens: market size and growth, competition, target's position, risks.",
      "Practise sizing markets top-down and bottom-up and reconciling the two.",
      "Frame answers as an investor would: would you buy this business, and at what risk?"
    ],
    style: "Run the interview EY-Parthenon-style, framed as commercial due diligence: ask how this market size would inform an investor's decision and probe growth drivers and risks."
  },
  {
    id: "strategyand", name: "Strategy& (PwC)", short: "Strategy&", bank: "", group: "global",
    color: "#d04a02", mark: "S&",
    tagline: "Candidate-led cases grounded in capabilities-driven strategy.",
    caseStyle: "Candidate-led",
    rounds: "Usually two to three rounds",
    test: "Online assessments are common in the PwC network",
    fit: "Behavioural questions in each round",
    format: [
      "Candidate-led business cases plus guesstimates, especially on campus.",
      "Behavioural questions draw on PwC's professional framework: leadership, relationships and business acumen."
    ],
    assesses: ["Structured problem solving", "Business acumen", "Quantitative skills", "Relationships and teamwork"],
    tips: [
      "Tie recommendations to what the client is distinctively good at.",
      "Prepare behavioural stories with clear situations, actions and results."
    ],
    style: "Run the interview Strategy&-style, candidate-led, and probe how the client's distinctive capabilities shape the answer."
  },
  {
    id: "oliver-wyman", name: "Oliver Wyman", short: "Oliver Wyman", bank: "", group: "global",
    color: "#0b3d91", mark: "OW",
    tagline: "Candidate-led cases, often with a financial-services angle.",
    caseStyle: "Candidate-led",
    rounds: "Usually two to three rounds",
    test: "Varies by office",
    fit: "Behavioural questions in each round",
    format: [
      "Candidate-led cases; financial services, risk and retail come up often.",
      "Some offices use a written case or group exercise in later rounds."
    ],
    assesses: ["Analytical rigour", "Commercial judgement", "Quantitative skills", "Communication"],
    tips: [
      "Know the basics of how banks and insurers make money.",
      "Practise reading exhibits quickly and stating the insight first."
    ],
    style: "Run the interview Oliver Wyman-style, candidate-led, with emphasis on analytical rigour and commercial judgement."
  },

  /* India-focused and specialist firms that appear in the question bank */
  {
    id: "redseer", name: "Redseer Strategy Consultants", short: "Redseer", bank: "Redseer", group: "india",
    color: "#c8102e", mark: "R",
    tagline: "Guesstimate-heavy interviews on India's consumer internet.",
    caseStyle: "Guesstimate and case",
    rounds: "Typically a few rounds of guesstimates, cases and fit",
    test: "Varies",
    fit: "Interest in digital businesses and research",
    format: [
      "Market sizing is the core of the work, so guesstimates on digital businesses are central.",
      "Expect questions on platforms, GMV, users, order frequency and unit economics."
    ],
    assesses: ["Market sizing", "Digital business acumen", "Numerical comfort", "Curiosity"],
    tips: [
      "Know the funnel of an Indian internet business: users, transacting users, orders, average order value, take rate.",
      "Use the India Numbers Bible for population, internet users and urban splits."
    ],
    style: "Run the interview like a consumer-internet research firm: push on users, frequency, order values and take rates, and ask how the estimate could be triangulated with app or industry data."
  },
  {
    id: "kepler-cannon", name: "Kepler Cannon", short: "Kepler Cannon", bank: "Kepler Cannon", group: "india",
    color: "#0e2a47", mark: "KC",
    tagline: "India-focused strategy boutique: guesstimates and business cases.",
    caseStyle: "Guesstimate and case",
    rounds: "Typically two to three rounds",
    test: "Varies",
    fit: "Fit and motivation questions",
    format: ["Guesstimates and business cases with an Indian market context."],
    assesses: ["Structured thinking", "Market sizing", "Business sense", "Communication"],
    tips: ["Ground assumptions in Indian demographics and consumption patterns.", "Practise moving from a guesstimate into a business implication."],
    style: "Run the interview like an India-focused strategy boutique: after the estimate, ask what it implies for a client's business decision."
  },
  {
    id: "indus-insights", name: "Indus Insights", short: "Indus Insights", bank: "Indus Insights", group: "india",
    color: "#0072bc", mark: "II",
    tagline: "Analytics-driven consulting: guesstimates, data and logic.",
    caseStyle: "Guesstimate and analytical",
    rounds: "Typically several rounds including guesstimates and analytical questions",
    test: "Aptitude or analytical tests are common",
    fit: "Interest in analytics and problem solving",
    format: ["Guesstimates sit alongside data interpretation and logic questions."],
    assesses: ["Quantitative ability", "Logical structuring", "Data interpretation", "Clarity"],
    tips: ["Drill mental maths until percentages and large multiplications are automatic.", "Explain how you'd validate each estimate with data."],
    style: "Run the interview analytics-style: probe the data the candidate would use to validate each assumption and check arithmetic closely."
  },
  {
    id: "trinity", name: "Trinity Life Sciences", short: "Trinity", bank: "Trinity Life Sciences", group: "india",
    color: "#00838f", mark: "T",
    tagline: "Life-sciences consulting: patient-funnel guesstimates.",
    caseStyle: "Guesstimate and case",
    rounds: "Typically two to three rounds",
    test: "Varies",
    fit: "Interest in healthcare and life sciences",
    format: ["Guesstimates often follow the patient funnel: prevalence, diagnosis, treatment, compliance."],
    assesses: ["Patient-funnel logic", "Healthcare intuition", "Quantitative skills", "Communication"],
    tips: ["Learn the patient funnel: population, prevalence, diagnosed, treated, on-therapy, compliant.", "Know a few headline Indian health numbers."],
    style: "Run the interview life-sciences style: push the candidate to build a patient funnel (prevalence, diagnosis, treatment, compliance) and challenge each conversion rate."
  },
  {
    id: "fti", name: "FTI Consulting", short: "FTI", bank: "FTI Consulting", group: "india",
    color: "#00467f", mark: "FTI",
    tagline: "Strategy and economic consulting: cases and guesstimates.",
    caseStyle: "Guesstimate and case",
    rounds: "Typically two to three rounds",
    test: "Varies",
    fit: "Fit and motivation questions",
    format: ["Business cases and guesstimates with an analytical bent."],
    assesses: ["Structured thinking", "Quantitative skills", "Business judgement"],
    tips: ["Be explicit about each assumption's source and sensitivity."],
    style: "Run the interview with an analytical bent: ask which assumption the answer is most sensitive to."
  },
  {
    id: "meesho", name: "Meesho", short: "Meesho", bank: "Meesho", group: "india",
    color: "#9f2089", mark: "M",
    tagline: "Business and product roles: e-commerce guesstimates and unit economics.",
    caseStyle: "Guesstimate and product case",
    rounds: "Typically several rounds across business, product and fit",
    test: "Varies by role",
    fit: "Ownership and bias for action",
    format: ["Guesstimates on e-commerce volumes, sellers and users, followed by product or business cases."],
    assesses: ["Market sizing", "Unit economics", "Product sense", "Ownership"],
    tips: ["Know the value-commerce funnel: users, buyers, orders, average order value, returns.", "Turn your estimate into a metric the business would track."],
    style: "Run the interview like a consumer-tech business role: after the estimate, ask about unit economics and which metric the business should track."
  },
  {
    id: "namo", name: "Nation with NaMo", short: "Nation with NaMo", bank: "Nation with NaMo", group: "india",
    color: "#e46e15", mark: "N",
    tagline: "Political consulting: guesstimates on voters, campaigns and public data.",
    caseStyle: "Guesstimate and case",
    rounds: "Typically a few rounds of guesstimates, cases and fit",
    test: "Varies",
    fit: "Interest in governance and public policy",
    format: ["Guesstimates on electorates, booths, campaigns and public programmes."],
    assesses: ["Market sizing with public data", "Structured thinking", "Awareness of India's administrative structure", "Motivation"],
    tips: ["Know India's administrative and electoral numbers: states, districts, constituencies, booths, voters.", "Use census-style segmentation by state, urban and rural."],
    style: "Run the interview like a political consulting firm: steer toward electoral and public-programme drivers and test the candidate's grasp of India's administrative structure."
  }
];
