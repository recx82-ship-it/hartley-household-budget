// Router for the Hartley budget site: five hash routes, one per section.
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { renderDashboard } from './views-dashboard.js';
import { renderTransactions } from './views-transactions.js';
import { renderBudgets } from './views-budgets.js';
import { renderGoals } from './views-goals.js';
import { renderReports } from './views-reports.js';

const app = document.getElementById('app');
const navLinks = [...document.querySelectorAll('[data-nav]')];

const ROUTES = {
  '': { name: 'dashboard', title: 'Hartley Household Budget', render: renderDashboard },
  transactions: { name: 'transactions', title: 'Transactions | Hartley Household Budget', render: renderTransactions },
  budgets: { name: 'budgets', title: 'Budgets | Hartley Household Budget', render: renderBudgets },
  goals: { name: 'goals', title: 'Savings goals | Hartley Household Budget', render: renderGoals },
  reports: { name: 'reports', title: 'Reports | Hartley Household Budget', render: renderReports },
};

function render() {
  window.__shotReady = false;
  const match = location.hash.match(/^#\/([a-z]*)/);
  const key = match ? match[1] : '';
  const route = ROUTES[key] || ROUTES[''];
  document.title = route.title;
  navLinks.forEach((a) => a.classList.toggle('active', a.dataset.nav === route.name));
  route.render(app);
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();
