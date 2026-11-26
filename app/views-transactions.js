// Transactions: the full ledger for both months, with add, edit, delete,
// search and filters. Everything is saved to localStorage as it changes.

import { escape, money, monthLabel, newId, shortDate } from './format.js';
import {
  CATEGORIES,
  addTransaction,
  deleteTransaction,
  latestMonth,
  monthsAvailable,
  state,
  updateTransaction,
} from './store.js';

let filterMonth = latestMonth();
let filterCat = '';
let searchText = '';
let editingId = null;

function catLabel(id) {
  if (id === 'income') return 'Income';
  return (CATEGORIES.find((c) => c.id === id) || { label: id }).label;
}

function catOptions(selected) {
  return CATEGORIES.map(
    (c) => `<option value="${c.id}" ${c.id === selected ? 'selected' : ''}>${escape(c.label)}</option>`,
  ).join('');
}

function filtered() {
  const q = searchText.trim().toLowerCase();
  return state.transactions
    .filter((t) => (filterMonth ? t.date.startsWith(filterMonth) : true))
    .filter((t) => (filterCat ? t.cat === filterCat : true))
    .filter((t) => (!q || t.desc.toLowerCase().includes(q)))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function renderTransactions(app) {
  const rows = filtered();
  const editing = editingId ? state.transactions.find((t) => t.id === editingId) : null;
  const months = monthsAvailable();

  app.innerHTML = `
<h1>Transactions</h1>
<p class="lede">Every pound in and out for the Hartley family, October and November 2026.
Add a transaction, or edit and delete one — the totals on every other page update straight away.</p>

<div class="card">
  <h2>${editing ? 'Edit transaction' : 'Add a transaction'}</h2>
  <form id="tx-form">
    <div class="form-row">
      <div class="grow"><label for="f-desc">What was it?</label>
        <input id="f-desc" required maxlength="120" placeholder="e.g. Tesco weekly shop" value="${editing ? escape(editing.desc) : ''}"></div>
      <div><label for="f-amount">Amount (£)</label>
        <input id="f-amount" type="number" step="0.01" min="0.01" required placeholder="0.00" value="${editing ? Math.abs(editing.amount).toFixed(2) : ''}"></div>
      <div><label for="f-kind">Type</label>
        <select id="f-kind">
          <option value="expense" ${!editing || editing.amount < 0 ? 'selected' : ''}>Spending</option>
          <option value="income" ${editing && editing.amount > 0 ? 'selected' : ''}>Income</option>
        </select></div>
      <div><label for="f-cat">Category</label>
        <select id="f-cat">${catOptions(editing ? editing.cat : 'groceries')}</select></div>
      <div><label for="f-date">Date</label>
        <input id="f-date" type="date" required value="${editing ? editing.date : '2026-11-26'}"></div>
      <div><button type="submit" id="tx-submit">${editing ? 'Save changes' : 'Add transaction'}</button>
      ${editing ? '<button type="button" class="ghost" id="tx-cancel">Cancel</button>' : ''}</div>
    </div>
    <p class="small muted">Income (salary, Child Benefit) counts as money in; spending counts as money out of its category.</p>
  </form>
</div>

<div class="card">
  <div class="toolbar">
    <div class="grow"><label for="f-search">Search</label>
      <input id="f-search" type="search" placeholder="Search descriptions, e.g. Tesco" value="${escape(searchText)}"></div>
    <div><label for="f-filter-cat">Category</label>
      <select id="f-filter-cat">
        <option value="">All categories</option>
        <option value="income" ${filterCat === 'income' ? 'selected' : ''}>Income</option>
        ${catOptions(filterCat)}
      </select></div>
    <div><label for="f-filter-month">Month</label>
      <select id="f-filter-month">
        <option value="">All months</option>
        ${months.map((m) => `<option value="${m}" ${filterMonth === m ? 'selected' : ''}>${escape(monthLabel(m))}</option>`).join('')}
      </select></div>
  </div>

  <p class="muted">${rows.length} transaction${rows.length === 1 ? '' : 's'} shown.</p>
  <div class="table-scroll"><table id="tx-list">
    <thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>
    <tbody>
      ${rows.length
        ? rows
            .map(
              (t) => `<tr class="${t.amount > 0 ? 'income' : 'expense'}">
          <td>${shortDate(t.date)}</td>
          <td>${escape(t.desc)}</td>
          <td>${escape(catLabel(t.cat))}</td>
          <td class="num">${t.amount > 0 ? '+' : '−'}${money(t.amount)}</td>
          <td style="white-space:nowrap">
            <button class="ghost small" data-edit="${t.id}">Edit</button>
            <button class="danger small" data-del="${t.id}">Delete</button>
          </td></tr>`,
            )
            .join('')
        : `<tr><td colspan="5">Nothing matches. Try clearing the search or choosing another month or category.</td></tr>`}
    </tbody>
  </table></div>
</div>`;

  const form = app.querySelector('#tx-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const desc = app.querySelector('#f-desc').value.trim();
    const amount = Number(app.querySelector('#f-amount').value);
    const kind = app.querySelector('#f-kind').value;
    const cat = kind === 'income' ? 'income' : app.querySelector('#f-cat').value;
    const date = app.querySelector('#f-date').value;
    if (!desc || !(amount > 0) || !date) return;
    const signed = kind === 'income' ? Math.abs(amount) : -Math.abs(amount);
    if (editingId) {
      updateTransaction(editingId, { desc, amount: signed, cat, date });
      editingId = null;
    } else {
      addTransaction({ id: newId('u'), date, desc, cat, amount: signed });
    }
    renderTransactions(app);
    window.__shotReady = true;
  });

  const cancel = app.querySelector('#tx-cancel');
  if (cancel) {
    cancel.addEventListener('click', () => {
      editingId = null;
      renderTransactions(app);
      window.__shotReady = true;
    });
  }

  // Income has no spending category, so hide the category picker for it.
  const kindSel = app.querySelector('#f-kind');
  const catSel = app.querySelector('#f-cat');
  const syncKind = () => {
    catSel.disabled = kindSel.value === 'income';
  };
  kindSel.addEventListener('change', syncKind);
  syncKind();

  app.querySelector('#f-search').addEventListener('input', (e) => {
    searchText = e.target.value;
    renderTransactions(app);
    const box = app.querySelector('#f-search');
    box.focus();
    box.setSelectionRange(box.value.length, box.value.length);
    window.__shotReady = true;
  });
  app.querySelector('#f-filter-cat').addEventListener('change', (e) => {
    filterCat = e.target.value;
    renderTransactions(app);
    window.__shotReady = true;
  });
  app.querySelector('#f-filter-month').addEventListener('change', (e) => {
    filterMonth = e.target.value;
    renderTransactions(app);
    window.__shotReady = true;
  });

  app.querySelectorAll('[data-edit]').forEach((btn) => {
    btn.addEventListener('click', () => {
      editingId = btn.dataset.edit;
      renderTransactions(app);
      window.scrollTo(0, 0);
      window.__shotReady = true;
    });
  });
  app.querySelectorAll('[data-del]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tx = state.transactions.find((t) => t.id === btn.dataset.del);
      if (!tx) return;
      if (!window.confirm(`Delete "${tx.desc}" (${money(tx.amount)})? This cannot be undone.`)) return;
      deleteTransaction(tx.id);
      if (editingId === tx.id) editingId = null;
      renderTransactions(app);
      window.__shotReady = true;
    });
  });
}
