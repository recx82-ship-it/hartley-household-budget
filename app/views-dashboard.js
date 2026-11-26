// Dashboard: the month at a glance — income, spent, left, plan usage, the
// spending-by-category chart, budgets closest to their limit, upcoming bills
// and the most recent transactions.

import { escape, money, monthLabel, pct, shortDate } from './format.js';
import { hbarChart } from './charts.js';
import {
  CATEGORIES,
  categoryBreakdown,
  latestMonth,
  loadState,
  monthTotals,
  monthTransactions,
  monthsAvailable,
  resetState,
  state,
  totalBudget,
  upcomingBills,
} from './store.js';

let currentMonth = latestMonth();

export function setMonth(key) {
  currentMonth = key;
}

function catLabel(id) {
  return (CATEGORIES.find((c) => c.id === id) || { label: id }).label;
}

function pillFor(used, limit) {
  const ratio = limit > 0 ? used / limit : 0;
  if (ratio >= 1) return `<span class="pill over">Over limit</span>`;
  if (ratio >= 0.9) return `<span class="pill hot">Nearly there</span>`;
  if (ratio >= 0.75) return `<span class="pill hot">Watch it</span>`;
  return `<span class="pill">On track</span>`;
}

export function renderDashboard(app) {
  const months = monthsAvailable();
  const totals = monthTotals(currentMonth);
  const budgetTotal = totalBudget();
  const planUsed = budgetTotal > 0 ? (totals.spent / budgetTotal) * 100 : 0;
  const breakdown = categoryBreakdown(currentMonth);
  const closest = breakdown
    .filter((b) => b.limit > 0)
    .sort((a, b) => b.spent / b.limit - a.spent / a.limit)
    .slice(0, 3);
  const recent = monthTransactions(currentMonth).slice(0, 5);
  const bills = upcomingBills();
  const billsTotal = bills.reduce((a, b) => a + b.amount, 0);

  const idx = months.indexOf(currentMonth);
  const prev = idx > 0 ? months[idx - 1] : null;
  const next = idx < months.length - 1 ? months[idx + 1] : null;

  const chartRows = breakdown
    .filter((b) => b.spent > 0)
    .slice(0, 8)
    .map((b) => ({ label: b.label, value: b.spent, display: money(b.spent) }));

  app.innerHTML = `
<div class="month-bar">
  <h1>${escape(monthLabel(currentMonth))} budget</h1>
  <button class="ghost" data-shift="-1" ${prev ? '' : 'disabled'}>&larr; ${prev ? escape(monthLabel(prev)) : 'Earlier'}</button>
  <span class="month-name">${escape(monthLabel(currentMonth))}</span>
  <button class="ghost" data-shift="1" ${next ? '' : 'disabled'}>${next ? escape(monthLabel(next)) : 'Later'} &rarr;</button>
</div>
<p class="lede">The Hartley family &mdash; Marcus, Elena, Sophie and Leo. Money in, money out, and
what is left for the month, worked out from the transaction ledger.</p>

<div class="grid three">
  <div class="card stat">
    <div class="label">Money in</div>
    <div class="value good">${money(totals.income)}</div>
    <div class="sub">Salaries, overtime and Child Benefit</div>
  </div>
  <div class="card stat">
    <div class="label">Spent</div>
    <div class="value">${money(totals.spent)}</div>
    <div class="sub">Across ${breakdown.filter((b) => b.spent > 0).length} spending categories</div>
  </div>
  <div class="card stat">
    <div class="label">Left over</div>
    <div class="value ${totals.left >= 0 ? 'good' : 'bad'}">${money(totals.left)}</div>
    <div class="sub">${pct((totals.left / totals.income) * 100)} of this month's income kept</div>
  </div>
</div>

<div class="grid two">
  <div class="card">
    <h2>Monthly plan</h2>
    <p>Spent <strong>${money(totals.spent)}</strong> of the <strong>${money(budgetTotal)}</strong>
    planned for the month &mdash; <strong>${pct(planUsed)}</strong> used.</p>
    <div class="bar"><span class="${planUsed >= 100 ? 'over' : planUsed >= 90 ? 'hot' : ''}" style="width:${Math.min(100, planUsed).toFixed(1)}%"></span></div>
    <p class="bar-note">${planUsed >= 90
      ? 'Nearly all of the plan is used. Check the budgets page before any more big spends.'
      : 'Still inside the plan. The leftover goes to savings goals at the end of the month.'}</p>
    <p class="mt"><a href="#/budgets">See all twelve budgets &rarr;</a></p>
  </div>

  <div class="card">
    <h2>Budgets closest to the limit</h2>
    ${closest
      .map(
        (b) => `<div style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;gap:8px">
        <strong>${escape(b.label)}</strong> ${pillFor(b.spent, b.limit)}
      </div>
      <div class="bar"><span class="${b.spent >= b.limit ? 'over' : b.spent / b.limit >= 0.9 ? 'hot' : ''}" style="width:${Math.min(100, (b.spent / b.limit) * 100).toFixed(1)}%"></span></div>
      <div class="bar-note"><strong>${money(b.spent)}</strong> of ${money(b.limit)} &mdash; ${money(Math.max(0, b.limit - b.spent))} left</div>
    </div>`,
      )
      .join('')}
    <p class="mt"><a href="#/budgets">Adjust a budget &rarr;</a></p>
  </div>
</div>

<div class="grid two">
  <div class="card">
    <h2>Spending by category</h2>
    ${hbarChart(chartRows)}
    <p class="mt"><a href="#/reports">Compare months in Reports &rarr;</a></p>
  </div>

  <div class="card">
    <h2>Upcoming bills</h2>
    <ul class="clean">
      ${bills
        .map(
          (b) => `<li><span>${escape(b.desc)}<br><span class="due">due ${shortDate(b.due)} &middot; ${escape(catLabel(b.cat))}</span></span>
        <span class="amt">${money(b.amount)}</span></li>`,
        )
        .join('')}
    </ul>
    <p class="mt"><strong>${money(billsTotal)}</strong> due before the end of December.</p>
  </div>
</div>

<div class="card">
  <h2>Recent transactions</h2>
  <div class="table-scroll"><table>
    <thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th></tr></thead>
    <tbody>
      ${recent
        .map(
          (t) => `<tr class="${t.amount > 0 ? 'income' : 'expense'}">
        <td>${shortDate(t.date)}</td><td>${escape(t.desc)}</td><td>${escape(catLabel(t.cat))}</td>
        <td class="num">${t.amount > 0 ? '+' : '−'}${money(t.amount)}</td></tr>`,
        )
        .join('')}
    </tbody>
  </table></div>
  <p class="mt"><a href="#/transactions">Open the full ledger &rarr;</a></p>
</div>

<div class="card">
  <h2>Start over</h2>
  <p>Reset every transaction, budget and goal back to the family's original figures.
  Use it after trying things out.</p>
  <button class="danger" id="reset-data">Reset all data to the original figures</button>
</div>`;

  app.querySelectorAll('[data-shift]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const shift = Number(btn.dataset.shift);
      const i = months.indexOf(currentMonth);
      const target = months[i + shift];
      if (target) {
        currentMonth = target;
        renderDashboard(app);
        window.__shotReady = true;
      }
    });
  });

  app.querySelector('#reset-data').addEventListener('click', () => {
    if (!window.confirm('Reset everything back to the original Hartley figures? Your changes will be lost.')) return;
    resetState();
    Object.assign(state, loadState());
    currentMonth = latestMonth();
    renderDashboard(app);
    window.__shotReady = true;
  });
}
