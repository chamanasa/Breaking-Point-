# Breaking Point: Guesstimate Prep

An AI-powered consulting case-prep website, starting with guesstimates.

- **Learn**: a framework for solving guesstimates, with a worked example.
- **Question Bank**: guesstimates you can filter by difficulty, industry, type and approach.
- **AI Mode**: practise any question from the bank with a Gemini-powered interviewer, using your own API key.

The design follows [EconGraphs](https://www.econgraphs.org), which is built on Tufte CSS: the ET Book serif font, off-white paper (`#fffff8`) and near-black ink (`#111`).

## Run locally

It is a static site with no build step. Open `index.html` directly, or serve the folder:

```sh
python3 -m http.server 8000   # then visit http://localhost:8000
```

To deploy with GitHub Pages, go to **Settings → Pages → Deploy from branch** and select the root folder.

## Project layout

```
index.html          all three tabs (the Learn content lives here)
css/style.css       EconGraphs / Tufte-style theme
data/questions.js   the question bank (edit this to add questions)
js/app.js           tab routing and shared helpers
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
  tags: ["marriage"],              // optional, used by search
  hint: "…",                       // optional
  solution: "…"                    // optional; the AI uses it to judge answers
}
```

The filter dropdowns are built automatically from the values you use.

## AI Mode and privacy

Each user pastes their own Gemini API key, which they can create at <https://aistudio.google.com/apikey>. The key is stored only in that browser's `localStorage`. Requests go straight from the browser to `generativelanguage.googleapis.com`, and no backend is involved.
