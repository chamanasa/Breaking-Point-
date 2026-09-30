# Breaking Point: Guesstimate Prep

An AI-powered consulting case-prep website, starting with guesstimates.

- **Learn**: an introduction and the five-step method, framework cards (what it is, when to use it, a worked example), pro tips, an interactive worked example you reveal step by step, and the India Numbers Bible (demographic, economic and miscellaneous figures, each with source and year).
- **Question Bank**: 77 guesstimates from the 180DC SRCC Guesstimate Books (Vol. 1 & 2), the IIM Ahmedabad Casebook 2022–23 and Case Interviews Cracked, filterable by difficulty, industry, type, approach, firm and source. Only the questions are included, with our own one-line hints; the books' worked solutions are not reproduced.
- **AI Mode**: step-by-step setup for a free Gemini API key, then a chat interface to practise any question from the bank with an AI interviewer.

The design follows [EconGraphs](https://www.econgraphs.org), which is built on Tufte CSS: the ET Book serif font, off-white paper (`#fffff8`) and near-black ink (`#111`).

## Run locally

It is a static site with no build step. Open `index.html` directly, or serve the folder:

```sh
python3 -m http.server 8000   # then visit http://localhost:8000
```

To deploy with GitHub Pages, go to **Settings → Pages → Deploy from branch** and select the root folder.

## Project layout

```
index.html          the three tabs; Learn is a landing page linking to learn/
learn/              one page per Learn topic: introduction, frameworks, pro-tips,
                    worked-example, numbers (each with its own illustrations)
css/style.css       EconGraphs / Tufte-style theme
data/questions.js   the question bank (edit this to add questions)
data/numbers.js     India Numbers Bible tables (value, source, year) and chart data
js/app.js           tab routing and shared helpers
js/learn.js         Learn pages: Numbers charts and tabs, step-by-step example
js/bank.js          filters and question list
js/ai.js            Gemini interviewer
fonts/              ET Book (MIT, from tufte-css)
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
  source: "Your casebook",          // where the question comes from
  hint: "…"                         // optional one-line structure; the AI uses it to judge
}
```

The filter dropdowns are built automatically from the values you use.

## AI Mode and privacy

Each user pastes their own Gemini API key, which they can create at <https://aistudio.google.com/apikey>. The key is stored only in that browser's `localStorage`. Requests go straight from the browser to `generativelanguage.googleapis.com`, and no backend is involved.

## Publishing updates

`index.html` and the pages in `learn/` load CSS and JS with a version tag (`?v=6`). Increase the number whenever you change those files, so browsers fetch the new versions instead of cached ones.
