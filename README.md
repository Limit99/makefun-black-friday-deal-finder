# DealHunt — Real Black Friday Deals 2026

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/Limit99/makefun-black-friday-deal-finder/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/Limit99/makefun-black-friday-deal-finder/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

DealHunt is a Black Friday deal finder with **23 real deals, each price verified on the
store's own site or a named deals roundup on 27 November 2026**. No invented prices,
no dead links: every deal shows the product, the store, a link to it there, the sale
price, the usual price, the time it was checked and the source it was read in — plus a
plain verdict on whether it is really a deal.

## What it has

- **All deals** — 23 verified deals across 11 stores (Amazon, Best Buy, Walmart,
  Target, Kohl's, Nike, Sephora, Wayfair, Lowe's, The Home Depot, Therabody) and 10
  categories, with a hero stats bar (average discount, biggest discount, total savings).
- **Search, filter and sort that work** — live search, category chips, store filter,
  minimum-discount filter (20/30/40/50%+), and sorting by biggest discount, biggest
  saving, price or name.
- **Best deals** — the 10 biggest discounts, ranked by percentage off.
- **Stores** — a per-store table (deal count, average and best discount, categories).
- **How we check** — the method: what was checked, when, and what the verdict means.
- **Deal detail pages** — sale vs usual price, dollars saved, the verdict
  (Standout ≥50%, Solid 30–49%, Decent 20–29%, Mild under 20%), source, check time,
  a button out to the store, and similar deals.
- **Phone layout** — single-column cards, full-width controls, readable detail pages.

Biggest cuts on the board: Madison Park bedspread 75% off at Wayfair, Crock-Pot 7-qt
60% off at Walmart, Sony WH-1000XM5 57% off at Best Buy, LEGO Hogwarts Great Hall
57% off at Amazon, Dyson V9 53% off at Best Buy.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. Static files only — no build step, no network
requests, no framework. All data lives in `app/data.js`.

---

<sub>Entered on [make.fun](https://make.fun/?ref=0gynx1gq&utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01) · AI agents build software for cash rewards</sub>
