# Breaking Point: Guesstimate Prep

An AI-powered consulting case-prep website, starting with guesstimates.

- **Home**: a hub listing every prep module as a full-width row: Guesstimates (live), Market Entry, Profitability, Pricing, Growth, M&A and Due Diligence, Unconventional Cases, Mental Maths Driller, Firm-Specific Prep and Track Your Progress. Modules that aren't built yet show a "Coming soon" badge; to launch one, swap its `mod is-soon` row in `index.html` for an `is-live` row with links.
- **Mental Maths Driller** (`#drill`): six consulting maths skills (multiplication, division, percentages, growth and CAGR, Indian units, breakeven and margins) in sprint, set-of-10 or untimed mode. Each skill's level (1–3) adapts to your speed and accuracy; answers accept shorthand such as `4.2k`, `3l` or `12cr`.
- **Firm-Specific Prep** (`#firms`): profiles for 15 firms (interview format, what they assess, how to stand out), a week-by-week prep plan built from your interview date and weekly hours, the firm's questions from the bank, and AI mock interviews run in that firm's style. Firm data lives in `data/firms.js`; logos are brand-colour marks drawn from it, and adding `logo: "img/firms/<file>.svg"` to a firm swaps in an official logo file.
- **Track Your Progress** (`#progress`): a readiness score, interview score trend, scores by criterion, maths accuracy by skill, an activity heatmap, recommended next steps and recent sessions. Everything is stored in this browser (`bp.activity` in localStorage) and can be exported or imported as a backup.
- **Guesstimate guides**: an introduction and the five-step method, framework cards (what it is, when to use it, a worked example), pro tips, an interactive worked example you reveal step by step, and the India Numbers Bible (demographic, economic and miscellaneous figures, each with source and year).
- **Question Bank**: 77 guesstimates asked in consulting interviews, filterable by difficulty, industry, type, approach and firm. Each has a one-line hint and a full model interview transcript (clarifying questions, structure, push-back, calculation, sanity check, final answer).
- **AI Mode**: step-by-step setup for a free Gemini API key, then a full-page chat to practise any question with an AI interviewer, by typing or as a spoken voice interview (the interviewer speaks, listens, and replies by voice; uses the browser's built-in speech features in Chrome, Edge and Safari), ending with a scorecard.

The design is a clean product style: a white canvas, the Inter typeface, one blue accent (`#2457f5`), soft borders and shadows, and generous spacing. All colours live as tokens at the top of `css/style.css`.

## Run locally

It is a static site with no build step. Open `index.html` directly, or serve the folder:

```sh
python3 -m http.server 8000   # then visit http://localhost:8000
```

To deploy with GitHub Pages, go to **Settings → Pages → Deploy from branch** and select the root folder.

## Project layout

```
index.html          the three tabs; Home is the module hub, linking to learn/
learn/              one page per Learn topic: introduction, frameworks, pro-tips,
                    worked-example, numbers (each with its own illustrations)
css/style.css       Design system: tokens, components, responsive rules
data/questions.js   the question bank (edit this to add questions)
data/transcripts-*.js  model interview for each question, keyed by id
data/numbers.js     India Numbers Bible tables (value, source, year) and chart data
js/app.js           tab routing and shared helpers
js/learn.js         Learn pages: Numbers charts and tabs, step-by-step example
js/bank.js          filters and question list
js/ai.js            Gemini interviewer
fonts/              Inter variable font (SIL OFL)
```

## Adding questions

Append entries to `data/questions.js`:

```js
{
  id: "G009",
  title: "Estimate the number of weddings in India in a year.",
  difficulty: "Medium",            // Easy | Medium | Hard
  industry: "Events & Hospitality",
  type: "Count / volume",
  approach: "Population-based",
  geography: "India",              // optional
  firm: "Bain",                     // optional: where it was asked
  hint: "…"                         // optional one-line structure; the AI uses it to judge
}
```

The filter dropdowns are built automatically from the values you use.

## AI Mode and privacy

Each user pastes their own Gemini API key, which they can create at <https://aistudio.google.com/apikey>. The key is stored only in that browser's `localStorage`. Requests go straight from the browser to `generativelanguage.googleapis.com`, and no backend is involved.

## Publishing updates

`index.html` and the pages in `learn/` load CSS and JS with a version tag (`?v=15`). Increase the number whenever you change those files, so browsers fetch the new versions instead of cached ones. Also bump `BUILD` in `js/update.js` and the number in `version.txt` to the same value: returning visitors with an old cached page are then reloaded onto the new release automatically.
