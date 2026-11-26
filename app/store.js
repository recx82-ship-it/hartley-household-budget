// State for the budget site: the seed data loaded from data.js, kept in
// localStorage so the family's edits survive a reload, and every figure the
// pages show, worked out from the transactions so nothing can disagree.
//
// State shape in localStorage under KEY:
//   { transactions: [...], budgets: {cat: limit}, goals: [...] }

import { BUDGET_LIMITS, CATEGORIES, GOALS, MONTHS, SEED_TRANSACTIONS, UPCOMING_BILLS } from './data.js';

export { CATEGORIES };

export const STORAGE_KEY = 'hartley-budget-v1';

function seedState() {
  return {
    transactions: SEED_TRANSACTIONS.map((t) => ({ ...t })),
    budgets: { ...BUDGET_LIMITS },
    goals: GOALS.map((g) => ({ ...g })),
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.transactions) || !parsed.budgets || !Array.isArray(parsed.goals)) {
      return seedState();
    }
    return parsed;
  } catch {
    return seedState();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  return seedState();
}

export const state = loadState();

// ---- Months ---------------------------------------------------------------

export function monthsAvailable() {
  const keys = new Set(state.transactions.map((t) => t.date.slice(0, 7)));
  return [...keys].sort();
}

export function latestMonth() {
  const months = monthsAvailable();
  return months[months.length - 1] || MONTHS[MONTHS.length - 1];
}

export function monthTransactions(monthKey) {
  return state.transactions
    .filter((t) => t.date.startsWith(monthKey))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

// ---- Totals, all worked out from the transactions -------------------------

export function monthTotals(monthKey) {
  let income = 0;
  let spent = 0;
  for (const t of state.transactions) {
    if (!t.date.startsWith(monthKey)) continue;
    if (t.amount > 0) income += t.amount;
    else spent += -t.amount;
  }
  return { income: round2(income), spent: round2(spent), left: round2(income - spent) };
}

export function categorySpent(monthKey, catId) {
  let total = 0;
  for (const t of state.transactions) {
    if (t.date.startsWith(monthKey) && t.cat === catId && t.amount < 0) total += -t.amount;
  }
  return round2(total);
}

export function categoryBreakdown(monthKey) {
  return CATEGORIES.map((c) => ({
    ...c,
    spent: categorySpent(monthKey, c.id),
    limit: state.budgets[c.id] ?? 0,
  })).sort((a, b) => b.spent - a.spent);
}

export function totalBudget() {
  return round2(Object.values(state.budgets).reduce((a, b) => a + b, 0));
}

export function round2(n) {
  return Math.round(n * 100) / 100;
}

// ---- Transactions ---------------------------------------------------------

export function addTransaction(tx) {
  state.transactions.push(tx);
  saveState(state);
}

export function updateTransaction(id, patch) {
  const tx = state.transactions.find((t) => t.id === id);
  if (!tx) return false;
  Object.assign(tx, patch);
  saveState(state);
  return true;
}

export function deleteTransaction(id) {
  const i = state.transactions.findIndex((t) => t.id === id);
  if (i === -1) return false;
  state.transactions.splice(i, 1);
  saveState(state);
  return true;
}

// ---- Budgets and goals ----------------------------------------------------

export function setBudgetLimit(catId, limit) {
  state.budgets[catId] = round2(Math.max(0, limit));
  saveState(state);
}

export function addGoalFunds(goalId, amount) {
  const g = state.goals.find((x) => x.id === goalId);
  if (!g) return false;
  g.saved = round2(Math.max(0, g.saved + amount));
  saveState(state);
  return true;
}

export function addGoal(goal) {
  state.goals.push(goal);
  saveState(state);
}

export function upcomingBills() {
  return UPCOMING_BILLS.slice().sort((a, b) => (a.due < b.due ? -1 : 1));
}
