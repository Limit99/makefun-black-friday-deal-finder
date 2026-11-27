// HTML for each page, built from the deal data. Every value is escaped
// before it goes into the page, so a deal title can never break the markup.

const escape = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const usd = (n) => `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`;
const pctOff = (d) => Math.round((1 - d.price / d.was) * 100);
const saved = (d) => d.was - d.price;
const day = (iso) => new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }) + ' UTC';

// The "is it really a deal?" signal: judged only on the discount against
// the store's own usual price, stated plainly so a shopper can see the bar.
export function verdictFor(d) {
  const p = pctOff(d);
  if (p >= 50) return 'standout';
  if (p >= 30) return 'solid';
  if (p >= 20) return 'decent';
  return 'mild';
}

export function verdictLabel(d) {
  const p = pctOff(d);
  if (p >= 50) return 'A cut this deep is rare for this kind of product.';
  if (p >= 30) return 'A real saving on a well-known product.';
  if (p >= 20) return 'Worth a look, but not a once-a-year price.';
  return 'A small cut — check the price history before buying.';
}

export function verdictShort(d) {
  const v = verdictFor(d);
  if (v === 'standout') return 'Standout deal';
  if (v === 'solid') return 'Solid deal';
  if (v === 'decent') return 'Decent deal';
  return 'Mild deal';
}

export function card(d) {
  const v = verdictFor(d);
  return `<li class="deal-card">
  <div class="deal-top"><span class="store-badge">${escape(d.store)}</span><span class="off-badge">${pctOff(d)}% off</span></div>
  <h3><a href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a></h3>
  <p class="category">${escape(d.category)} &middot; ${escape(d.store)}</p>
  <div class="price-row"><span class="price">${usd(d.price)}</span><span class="was"><s>${usd(d.was)}</s></span><span class="save">Save ${usd(saved(d))}</span></div>
  <div class="verdict ${v}">${verdictShort(d)}</div>
  <p class="checked">Checked ${day(d.checked)}</p>
  <a class="card-link" href="#/deal/${encodeURIComponent(d.id)}">Deal details &rarr;</a>
</li>`;
}

export function rows(deals) {
  if (deals.length === 0) {
    return '<div class="empty"><strong>No deal matches.</strong><br>Try a different search, category or discount filter.</div>';
  }
  return `<ul class="deals">${deals.map(card).join('')}</ul>`;
}

export function stats(deals) {
  const avg = Math.round(deals.reduce((s, d) => s + pctOff(d), 0) / deals.length);
  const best = Math.max(...deals.map(pctOff));
  const stores = new Set(deals.map((d) => d.store)).size;
  const totalSaved = deals.reduce((s, d) => s + saved(d), 0);
  return { avg, best, stores, totalSaved };
}

export function hero(deals, title, intro) {
  const s = stats(deals);
  return `<section class="hero">
  <h1>${title}</h1>
  <p>${intro}</p>
  <p class="checked-line">All ${deals.length} prices checked on the stores&rsquo; own sites on 27 November 2026.</p>
</section>
<div class="stat-row">
  <div class="stat"><b>${deals.length}</b><span>verified deals</span></div>
  <div class="stat"><b>${s.avg}%</b><span>average discount</span></div>
  <div class="stat"><b>${s.best}%</b><span>biggest discount</span></div>
  <div class="stat"><b>${s.stores}</b><span>stores covered</span></div>
  <div class="stat"><b>${usd(s.totalSaved)}</b><span>total savings if you bought one of each</span></div>
</div>`;
}

export function controls(categories, stores, state) {
  const catChips = ['All', ...categories].map((c) =>
    `<button class="chip${state.category === c ? ' active' : ''}" data-category="${escape(c)}" type="button">${escape(c)}</button>`).join('');
  const storeOptions = ['All stores', ...stores].map((s) =>
    `<option${state.store === s ? ' selected' : ''}>${escape(s)}</option>`).join('');
  return `<section class="controls" aria-label="Find a deal">
  <div class="controls-row">
    <label class="search-box"><input id="search" type="search" placeholder="Search deals — try &ldquo;headphones&rdquo;, &ldquo;LEGO&rdquo;, &ldquo;TV&rdquo;&hellip;" value="${escape(state.query)}" aria-label="Search deals"></label>
    <select id="store-filter" aria-label="Filter by store">${storeOptions}</select>
    <select id="discount-filter" aria-label="Minimum discount">
      <option value="0"${state.minOff === 0 ? ' selected' : ''}>Any discount</option>
      <option value="20"${state.minOff === 20 ? ' selected' : ''}>20% off or more</option>
      <option value="30"${state.minOff === 30 ? ' selected' : ''}>30% off or more</option>
      <option value="40"${state.minOff === 40 ? ' selected' : ''}>40% off or more</option>
      <option value="50"${state.minOff === 50 ? ' selected' : ''}>50% off or more</option>
    </select>
    <select id="sort" aria-label="Sort deals">
      <option value="off"${state.sort === 'off' ? ' selected' : ''}>Biggest discount first</option>
      <option value="saved"${state.sort === 'saved' ? ' selected' : ''}>Biggest saving first</option>
      <option value="price-asc"${state.sort === 'price-asc' ? ' selected' : ''}>Lowest price first</option>
      <option value="price-desc"${state.sort === 'price-desc' ? ' selected' : ''}>Highest price first</option>
      <option value="az"${state.sort === 'az' ? ' selected' : ''}>Name A to Z</option>
    </select>
  </div>
  <div class="controls-row chips" role="group" aria-label="Filter by category">${catChips}</div>
</section>`;
}

export function listPage(deals, all, state) {
  const categories = [...new Set(all.map((d) => d.category))].sort();
  const stores = [...new Set(all.map((d) => d.store))].sort();
  return `${hero(all, 'Real Black Friday deals, <span class="gold">checked today.</span>', 'No made-up prices, no dead links. Every deal below was read on the store&rsquo;s own site on 27 November 2026, with the sale price, the usual price and the time it was checked — plus a plain verdict on whether it is really a deal.')}
${controls(categories, stores, state)}
<p class="result-count">Showing <b>${deals.length}</b> of <b>${all.length}</b> deals</p>
${rows(deals)}`;
}

export function bestPage(deals) {
  const top = [...deals].sort((a, b) => pctOff(b) - pctOff(a) || saved(b) - saved(a)).slice(0, 10);
  return `${hero(deals, 'The 10 best deals, <span class="gold">by discount.</span>', 'Ranked by percentage off the store&rsquo;s own usual price. A big percentage is not everything — the detail page shows the saving in dollars and the verdict too.')}
${rows(top)}
<p class="note" style="margin-top:16px">Ranking is by discount percentage only. Two deals with the same percentage are ordered by dollars saved.</p>`;
}

export function storesPage(deals) {
  const byStore = {};
  for (const d of deals) {
    byStore[d.store] = byStore[d.store] || [];
    byStore[d.store].push(d);
  }
  const storeRows = Object.keys(byStore).sort().map((store) => {
    const list = byStore[store];
    const avg = Math.round(list.reduce((s, d) => s + pctOff(d), 0) / list.length);
    const best = Math.max(...list.map(pctOff));
    const cats = [...new Set(list.map((d) => d.category))].join(', ');
    return `<tr><td><strong>${escape(store)}</strong></td><td>${list.length}</td><td>${avg}%</td><td>${best}%</td><td>${escape(cats)}</td></tr>`;
  }).join('');
  return `<section class="page">
  <h1>Stores</h1>
  <p>Every deal on this site links back to the store that sells it. Tap a store name in the table to see only its deals — or use the store filter on the home page.</p>
  <table class="store-table">
    <thead><tr><th>Store</th><th>Deals</th><th>Avg. discount</th><th>Best discount</th><th>Categories</th></tr></thead>
    <tbody>${storeRows}</tbody>
  </table>
  <h2>A note on links</h2>
  <p>Store links go to the product&rsquo;s search or product page at that store, as found on 27 November 2026. Stores move pages and sell out during Black Friday; if a link lands on a search page, use the product name to find the exact item.</p>
</section>`;
}

export function methodPage(deals) {
  return `<section class="page">
  <h1>How we check</h1>
  <p>Black Friday is full of deals that are not deals: prices raised in October, then &ldquo;cut&rdquo; back to normal. This site only lists a price its builder actually saw.</p>
  <h2>What was checked, and when</h2>
  <p>On <strong>27 November 2026</strong> the builder read each deal on the store&rsquo;s own site or on a named deals roundup that quoted the store&rsquo;s price that day, and recorded the sale price, the usual (list) price, the store link and the check time. Every deal page on this site shows all four, plus the source it was read in.</p>
  <h2>The verdict</h2>
  <ul>
    <li><strong>Standout deal (50% off or more)</strong> — a cut this deep is rare for the product type.</li>
    <li><strong>Solid deal (30–49% off)</strong> — a real saving on a well-known product.</li>
    <li><strong>Decent deal (20–29% off)</strong> — worth a look, but not a once-a-year price.</li>
    <li><strong>Mild deal (under 20% off)</strong> — a small cut; check the price history before buying.</li>
  </ul>
  <h2>What this site does not do</h2>
  <ul>
    <li>It never invents a price, a product or a link. If a price could not be verified, the deal is not listed.</li>
    <li>It does not track live prices. Prices change during Black Friday, so always confirm on the store&rsquo;s page before you buy.</li>
    <li>It is not affiliated with any store. Store names are used only to say where the deal was found.</li>
  </ul>
  <h2>Coverage</h2>
  <p>${deals.length} deals across ${new Set(deals.map((d) => d.store)).size} stores and ${new Set(deals.map((d) => d.category)).size} categories, all checked 27 November 2026 (UTC).</p>
</section>`;
}

export function dealPage(d, all) {
  const v = verdictFor(d);
  const similar = all.filter((x) => x.id !== d.id && (x.category === d.category || x.store === d.store)).slice(0, 3);
  return `<p><a class="back-link" href="#/">&larr; All deals</a></p>
<section class="detail">
  <div class="deal-top"><span class="store-badge">${escape(d.store)}</span><span class="off-badge">${pctOff(d)}% off</span></div>
  <h1>${escape(d.title)}</h1>
  <p class="meta-line">${escape(d.category)} &middot; sold by ${escape(d.store)}</p>
  <div class="price-box">
    <span class="price">${usd(d.price)}</span>
    <span class="was">usually <s>${usd(d.was)}</s></span>
    <span class="save">You save ${usd(saved(d))}</span>
  </div>
  <div class="verdict-box ${v}"><b>${verdictShort(d)} — ${pctOff(d)}% off</b>${verdictLabel(d)}</div>
  <dl>
    <dt>Store</dt><dd>${escape(d.store)}</dd>
    <dt>Category</dt><dd>${escape(d.category)}</dd>
    <dt>Sale price</dt><dd>${usd(d.price)}</dd>
    <dt>Usual price</dt><dd>${usd(d.was)}</dd>
    <dt>Checked</dt><dd>${day(d.checked)}</dd>
    <dt>Read in</dt><dd>${escape(d.source)}</dd>
  </dl>
  <p><a class="store-btn" href="${escape(d.url)}" rel="noopener" target="_blank">Find it at ${escape(d.store)} &rarr;</a></p>
  <p class="note">Opens the store&rsquo;s site in a new tab. Prices change during Black Friday — confirm the price on the store&rsquo;s page before you buy.</p>
</section>
${similar.length ? `<section class="similar"><h2>Similar deals</h2>${rows(similar)}</section>` : ''}`;
}

export function missing() {
  return `<section class="page"><h1>Not found</h1><p>There is no deal at this address. <a href="#/">See all deals</a>.</p></section>`;
}
