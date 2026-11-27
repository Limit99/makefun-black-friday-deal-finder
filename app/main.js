// DealHunt: a real Black Friday deal finder. The deals live in data.js, so
// the site needs no network to show them; each deal links out to its store.
//
//   #/            all deals, with search, category chips, store, discount and sort
//   #/best        the 10 biggest discounts
//   #/stores      per-store summary
//   #/method      how each price was checked
//   #/deal/<id>   one deal, with its verdict, source and check time
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { deals } from './data.js';
import { bestPage, controls, dealPage, hero, listPage, methodPage, missing, rows, storesPage } from './views.js';

const app = document.getElementById('app');

const state = { query: '', category: 'All', store: 'All stores', minOff: 0, sort: 'off' };

function pctOff(d) {
  return Math.round((1 - d.price / d.was) * 100);
}

function applyFilters() {
  const q = state.query.trim().toLowerCase();
  let shown = deals.filter((d) => {
    if (state.category !== 'All' && d.category !== state.category) return false;
    if (state.store !== 'All stores' && d.store !== state.store) return false;
    if (pctOff(d) < state.minOff) return false;
    if (q !== '' && !`${d.title} ${d.store} ${d.category}`.toLowerCase().includes(q)) return false;
    return true;
  });
  if (state.sort === 'off') shown.sort((a, b) => pctOff(b) - pctOff(a) || (b.was - b.price) - (a.was - a.price));
  else if (state.sort === 'saved') shown.sort((a, b) => (b.was - b.price) - (a.was - a.price));
  else if (state.sort === 'price-asc') shown.sort((a, b) => a.price - b.price);
  else if (state.sort === 'price-desc') shown.sort((a, b) => b.price - a.price);
  else if (state.sort === 'az') shown.sort((a, b) => a.title.localeCompare(b.title));
  return shown;
}

function renderList() {
  const shown = applyFilters();
  app.innerHTML = listPage(shown, deals, state);
  const search = document.getElementById('search');
  const count = document.querySelector('.result-count');
  const grid = document.querySelector('.deals, .empty');
  const refresh = () => {
    const next = applyFilters();
    const target = document.querySelector('.result-count');
    if (target) target.innerHTML = `Showing <b>${next.length}</b> of <b>${deals.length}</b> deals`;
    const holder = grid.parentNode;
    const fresh = document.createElement('div');
    fresh.innerHTML = rows(next);
    holder.replaceChild(fresh.firstChild, grid);
  };
  search.addEventListener('input', () => {
    state.query = search.value;
    // Re-render only the grid + count so the search box keeps focus.
    const next = applyFilters();
    const target = document.querySelector('.result-count');
    if (target) target.innerHTML = `Showing <b>${next.length}</b> of <b>${deals.length}</b> deals`;
    const oldGrid = document.querySelector('.deals, .empty');
    if (oldGrid) {
      const fresh = document.createElement('div');
      fresh.innerHTML = rows(next);
      oldGrid.replaceWith(fresh.firstChild);
    }
  });
  document.querySelectorAll('[data-category]').forEach((chip) => {
    chip.addEventListener('click', () => {
      state.category = chip.dataset.category;
      renderList();
    });
  });
  document.getElementById('store-filter').addEventListener('change', (e) => {
    state.store = e.target.value;
    renderList();
  });
  document.getElementById('discount-filter').addEventListener('change', (e) => {
    state.minOff = Number(e.target.value);
    renderList();
  });
  document.getElementById('sort').addEventListener('change', (e) => {
    state.sort = e.target.value;
    renderList();
  });
  void refresh;
  void count;
}

function setNav(route) {
  document.querySelectorAll('.main-nav a').forEach((a) => {
    a.classList.toggle('active', a.dataset.nav === route);
  });
}

function render() {
  window.__shotReady = false;
  const hash = location.hash || '#/';
  const dealMatch = hash.match(/^#\/deal\/([^/?]+)/);
  if (dealMatch) {
    const found = deals.find((d) => d.id === decodeURIComponent(dealMatch[1]));
    document.title = `${found ? found.title : 'Not found'} | DealHunt`;
    app.innerHTML = found ? dealPage(found, deals) : missing();
    setNav('');
  } else if (hash === '#/best') {
    document.title = 'Best deals | DealHunt';
    app.innerHTML = bestPage(deals);
    setNav('best');
  } else if (hash === '#/stores') {
    document.title = 'Stores | DealHunt';
    app.innerHTML = storesPage(deals);
    setNav('stores');
  } else if (hash === '#/method') {
    document.title = 'How we check | DealHunt';
    app.innerHTML = methodPage(deals);
    setNav('method');
  } else {
    document.title = 'DealHunt — Real Black Friday Deals 2026';
    renderList();
    setNav('home');
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();
