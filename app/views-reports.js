// Reports: October against November — income versus spending, where the
// money went, plain-English insights worked out from the ledger, and a CSV
// export of the current month.

import { escape, money, monthLabel, pct } from './format.js';
import { groupedBars, hbarChart } from './charts.js';
import {
  CATEGORIES,
  categoryBreakdown,
  latestMonth,
  monthTotals,
  monthsAvailable,
  state,
} from './store.js';

function round2local(n) {
  return Math.round(n * 100) / 100;
}

function catLabel(id) {
  return (CATEGORIES.find((c) => c.id === id) || { label: id }).label;
}

function buildInsights(current, previous) {
  const cur = monthTotals(current);
  const prev = previous ? monthTotals(previous) : null;
  const out = [];
  const breakdown = categoryBreakdown(current);
  const biggest = breakdown[0];
  const savingsRate = cur.income > 0 ? ((cur.left / cur.income) * 100).toFixed(1) : '0.0';

  out.push({
    text: `Biggest cost this month: <strong>${escape(biggest.label)}</strong> at ${money(biggest.spent)}, which is ${pct((biggest.spent / cur.spent) * 100)} of everything the family spent.`,
  });
  out.push({
    text: `Savings rate: the family kept <strong>${money(cur.left)}</strong> of ${money(cur.income)} coming in — a savings rate of <strong>${savingsRate}%</strong>. Anything above 20% is a strong month for a family of four.`,
  });
  if (prev) {
    const diff = round2local(cur.spent - prev.spent);
    const dir = diff >= 0 ? 'more' : 'less';
    out.push({
      text: `Compared with ${escape(monthLabel(previous))}, the family spent <strong>${money(Math.abs(diff))} ${dir}</strong> (${money(prev.spent)} then, ${money(cur.spent)} now).`,
    });
    // Biggest mover by category.
    let mover = null;
    let moverDiff = 0;
    for (const c of CATEGORIES) {
      const now = categoryBreakdown(current).find((b) => b.id === c.id).spent;
      const then = categoryBreakdown(previous).find((b) => b.id === c.id).spent;
      const d = round2local(now - then);
      if (Math.abs(d) > Math.abs(moverDiff)) {
        mover = c;
        moverDiff = d;
      }
    }
    if (mover) {
      out.push({
        text: `Biggest change by category: <strong>${escape(mover.label)}</strong> is ${moverDiff >= 0 ? 'up' : 'down'} ${money(Math.abs(moverDiff))} on ${escape(monthLabel(previous))} — ${moverDiff >= 0 ? 'worth a look before next month' : 'good news for the budget'}.`,
        warn: moverDiff > 0,
      });
    }
    const prevRate = prev.income > 0 ? (prev.left / prev.income) * 100 : 0;
    const curRate = cur.income > 0 ? (cur.left / cur.income) * 100 : 0;
    out.push({
      text: `The savings rate was ${prevRate.toFixed(1)}% in ${escape(monthLabel(previous))} and ${curRate.toFixed(1)}% in ${escape(monthLabel(current))} — ${curRate >= prevRate ? 'the family is keeping more of its income' : 'less is being kept this month, mostly because spending rose faster than income'}.`,
    });
  }
  const nearLimit = breakdown.filter((b) => b.limit > 0 && b.spent / b.limit >= 0.9);
  if (nearLimit.length) {
    out.push({
      text: `<strong>${nearLimit.length} budget${nearLimit.length === 1 ? ' is' : 's are'} at 90% or more</strong>: ${nearLimit.map((b) => `${escape(b.label)} (${pct((b.spent / b.limit) * 100)})`).join(', ')}. Treat the rest of the month as a no-spend week for those.`,
      warn: true,
    });
  }
  return out;
}

function csvFor(monthKey) {
  const rows = state.transactions
    .filter((t) => t.date.startsWith(monthKey))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
  const q = (s) => `"${String(s).replace(/"/g, '""')}"`;
  const lines = ['Date,Description,Category,Amount'];
  for (const t of rows) {
    lines.push(`${t.date},${q(t.desc)},${q(catLabel(t.cat))},${t.amount.toFixed(2)}`);
  }
  return lines.join('\n') + '\n';
}

export function renderReports(app) {
  const months = monthsAvailable();
  const current = latestMonth();
  const previous = months.length > 1 ? months[months.length - 2] : null;
  const cur = monthTotals(current);
  const prev = previous ? monthTotals(previous) : null;
  const breakdown = categoryBreakdown(current);
  const insights = buildInsights(current, previous);

  const chartGroups = [];
  if (prev) {
    chartGroups.push({
      label: monthLabel(previous),
      bars: [
        { label: 'Income', value: prev.income },
        { label: 'Spending', value: prev.spent },
      ],
    });
  }
  chartGroups.push({
    label: monthLabel(current),
    bars: [
      { label: 'Income', value: cur.income },
      { label: 'Spending', value: cur.spent },
    ],
  });

  const shareRows = breakdown
    .filter((b) => b.spent > 0)
    .map((b) => ({
      label: `${b.label} · ${pct((b.spent / cur.spent) * 100)}`,
      value: b.spent,
      display: money(b.spent),
    }));

  app.innerHTML = `
<h1>Reports</h1>
<p class="lede">October against November 2026: how much came in, how much went out, where it
went, and what the family should do about it — in plain English.</p>

<div class="grid two">
  <div class="card">
    <h2>Income vs spending</h2>
    ${groupedBars(chartGroups)}
    <p class="bar-note">Green is money in, amber is money out. In both months the family spent
    less than it earned — ${money(cur.left)} kept in ${escape(monthLabel(current))}.</p>
  </div>
  <div class="card">
    <h2>Where November's money went</h2>
    ${hbarChart(shareRows, { alt: true })}
    <p class="bar-note">Share of the ${money(cur.spent)} spent in ${escape(monthLabel(current))}.</p>
  </div>
</div>

<div class="card">
  <h2>What this means</h2>
  ${insights.map((i) => `<p class="insight${i.warn ? ' warn' : ''}">${i.text}</p>`).join('')}
</div>

<div class="card">
  <h2>Month by month</h2>
  <div class="table-scroll"><table>
    <thead><tr><th>Month</th><th class="num">Income</th><th class="num">Spent</th><th class="num">Left over</th><th class="num">Savings rate</th></tr></thead>
    <tbody>
      ${months
        .map((m) => {
          const t = monthTotals(m);
          const rate = t.income > 0 ? ((t.left / t.income) * 100).toFixed(1) : '0.0';
          return `<tr><td>${escape(monthLabel(m))}</td><td class="num">${money(t.income)}</td><td class="num">${money(t.spent)}</td><td class="num">${money(t.left)}</td><td class="num">${rate}%</td></tr>`;
        })
        .join('')}
    </tbody>
  </table></div>
  <p class="mt">
    <button id="export-csv">Download November 2026 as CSV</button>
    <span class="muted small" id="csv-note" style="margin-left:10px"></span>
  </p>
</div>`;

  app.querySelector('#export-csv').addEventListener('click', () => {
    const blob = new Blob([csvFor(current)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hartley-budget-${current}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    app.querySelector('#csv-note').textContent = `Downloaded hartley-budget-${current}.csv — ${state.transactions.filter((t) => t.date.startsWith(current)).length} transactions.`;
  });
}
