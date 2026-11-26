// Savings goals: what the family is putting money aside for, how far along
// each one is, adding funds, and creating a new goal.

import { escape, money, newId, pct } from './format.js';
import { addGoal, addGoalFunds, state } from './store.js';

export function renderGoals(app) {
  const totalSaved = state.goals.reduce((a, g) => a + g.saved, 0);
  const totalTarget = state.goals.reduce((a, g) => a + g.target, 0);

  app.innerHTML = `
<h1>Savings goals</h1>
<p class="lede">What the Hartleys are saving for, and how close each pot is. Money left over
at the end of the month goes here first — the emergency fund before anything else.</p>

<div class="card">
  <div class="grid three">
    <div class="stat"><div class="label">Saved in total</div><div class="value good">${money(totalSaved)}</div></div>
    <div class="stat"><div class="label">Target in total</div><div class="value">${money(totalTarget)}</div></div>
    <div class="stat"><div class="label">Still to save</div><div class="value">${money(totalTarget - totalSaved)}</div></div>
  </div>
</div>

<div class="grid two">
  ${state.goals
    .map((g) => {
      const ratio = g.target > 0 ? g.saved / g.target : 0;
      const done = g.saved >= g.target;
      return `<div class="card">
      <div class="goal-head">
        <h3>${escape(g.name)}</h3>
        <span class="goal-amt"><strong>${money(g.saved)}</strong> of ${money(g.target)}</span>
      </div>
      <p class="muted small">${escape(g.note)}</p>
      <div class="bar"><span style="width:${Math.min(100, ratio * 100).toFixed(1)}%"></span></div>
      <p class="bar-note">${pct(ratio * 100)} there &middot; ${money(Math.max(0, g.target - g.saved))} to go${done ? ' &middot; <strong>Reached!</strong>' : ''}</p>
      <div class="goal-actions">
        <label class="small" for="add-${g.id}">Add funds (£)</label>
        <input type="number" id="add-${g.id}" data-goal-input="${g.id}" min="1" step="1" placeholder="25">
        <button data-goal-add="${g.id}">Add to goal</button>
      </div>
    </div>`;
    })
    .join('')}
</div>

<div class="card">
  <h2>Start a new goal</h2>
  <form id="goal-form">
    <div class="form-row">
      <div class="grow"><label for="g-name">Goal name</label>
        <input id="g-name" required maxlength="80" placeholder="e.g. New sofa"></div>
      <div><label for="g-target">Target (£)</label>
        <input id="g-target" type="number" min="1" step="1" required placeholder="500"></div>
      <div><label for="g-saved">Already saved (£)</label>
        <input id="g-saved" type="number" min="0" step="1" value="0"></div>
      <div><label for="g-note">Why are we saving for it?</label>
        <input id="g-note" maxlength="140" placeholder="e.g. The old one sags in the middle"></div>
      <div><button type="submit">Create goal</button></div>
    </div>
  </form>
</div>`;

  app.querySelectorAll('[data-goal-add]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const goalId = btn.dataset.goalAdd;
      const input = app.querySelector(`[data-goal-input="${goalId}"]`);
      const amount = Number(input.value);
      if (!(amount > 0)) {
        input.focus();
        return;
      }
      addGoalFunds(goalId, amount);
      renderGoals(app);
      window.__shotReady = true;
    });
  });

  app.querySelector('#goal-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = app.querySelector('#g-name').value.trim();
    const target = Number(app.querySelector('#g-target').value);
    const saved = Number(app.querySelector('#g-saved').value) || 0;
    const note = app.querySelector('#g-note').value.trim() || 'A new goal for the family.';
    if (!name || !(target > 0)) return;
    addGoal({ id: newId('g'), name, note, saved: Math.min(saved, target), target });
    renderGoals(app);
    window.__shotReady = true;
  });
}
