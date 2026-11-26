// Budgets: one monthly limit per category, with live progress against what
// the ledger actually spent. Limits are editable and saved.

import { escape, money, pct } from './format.js';
import { categoryBreakdown, setBudgetLimit, state, totalBudget } from './store.js';
import { latestMonth } from './store.js';

let month = latestMonth();
let editingCat = null;

export function renderBudgets(app) {
  const breakdown = categoryBreakdown(month);
  const totalLimit = totalBudget();
  const totalSpent = breakdown.reduce((a, b) => a + b.spent, 0);

  app.innerHTML = `
<h1>Budgets</h1>
<p class="lede">Twelve monthly limits for November 2026. Each bar shows what the family has
actually spent in that category, straight from the ledger. Change a limit any time —
the dashboard and reports follow it.</p>

<div class="card">
  <div class="grid three" style="margin-bottom:6px">
    <div class="stat"><div class="label">Total planned</div><div class="value">${money(totalLimit)}</div></div>
    <div class="stat"><div class="label">Spent so far</div><div class="value">${money(totalSpent)}</div></div>
    <div class="stat"><div class="label">Still to spend</div><div class="value ${totalLimit - totalSpent >= 0 ? 'good' : 'bad'}">${money(totalLimit - totalSpent)}</div></div>
  </div>
  <div class="bar"><span class="${totalSpent >= totalLimit ? 'over' : totalSpent / totalLimit >= 0.9 ? 'hot' : ''}" style="width:${Math.min(100, (totalSpent / totalLimit) * 100).toFixed(1)}%"></span></div>
  <p class="bar-note">${pct((totalSpent / totalLimit) * 100)} of the whole monthly plan used.</p>
</div>

<div class="card">
  ${breakdown
    .map((b) => {
      const ratio = b.limit > 0 ? b.spent / b.limit : 0;
      const left = b.limit - b.spent;
      const status = ratio >= 1 ? 'Over limit' : ratio >= 0.9 ? 'Nearly there' : ratio >= 0.75 ? 'Watch it' : 'On track';
      const pill = ratio >= 1 ? 'over' : ratio >= 0.9 || ratio >= 0.75 ? 'hot' : '';
      const isEditing = editingCat === b.id;
      return `<div class="budget-row" data-cat="${b.id}">
      <span class="cat-name">${escape(b.label)}</span>
      <span class="bar-wrap">
        <span class="bar"><span class="${ratio >= 1 ? 'over' : ratio >= 0.9 ? 'hot' : ''}" style="width:${Math.min(100, ratio * 100).toFixed(1)}%"></span></span>
        <span class="bar-note">${escape(status)} &middot; ${pct(ratio * 100)} used</span>
      </span>
      <span class="cat-fig"><strong>${money(b.spent)}</strong> of ${isEditing ? '' : money(b.limit)}${isEditing ? `<input type="number" min="0" step="1" value="${b.limit}" aria-label="Monthly limit for ${escape(b.label)}">` : ''}<br>
        <span class="muted small">${left >= 0 ? `${money(left)} left` : `${money(-left)} over`}</span></span>
      <span><button class="ghost small" data-edit-budget="${b.id}">${isEditing ? 'Save' : 'Edit limit'}</button></span>
    </div>`;
    })
    .join('')}
</div>

<p class="muted small">Housing is the biggest limit because rent and council tax land in it.
Groceries is set at £480 after October's shops came in under that; dining out is kept
small on purpose so the family cooks at home most nights.</p>`;

  app.querySelectorAll('[data-edit-budget]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const catId = btn.dataset.editBudget;
      if (editingCat === catId) {
        const input = app.querySelector(`.budget-row[data-cat="${catId}"] input[type=number]`);
        const value = Number(input.value);
        if (Number.isFinite(value) && value >= 0) setBudgetLimit(catId, value);
        editingCat = null;
      } else {
        editingCat = catId;
      }
      renderBudgets(app);
      window.__shotReady = true;
    });
  });
}
