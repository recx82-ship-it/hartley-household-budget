// Seed data for the Hartley household budget. Every figure on the site is
// worked out from these transactions, so the dashboard, budgets and reports
// can never drift apart. Expenses are negative amounts, income positive.
// Amounts are pounds; dates are ISO, all in 2026.

export const HOUSEHOLD = {
  name: 'The Hartley Family',
  members: 'Marcus (warehouse supervisor), Elena (teaching assistant), Sophie (9) and Leo (6)',
  home: '14 Maple Terrace, Bristol',
  currency: 'GBP',
};

export const CATEGORIES = [
  { id: 'housing', label: 'Housing' },
  { id: 'groceries', label: 'Groceries' },
  { id: 'utilities', label: 'Utilities' },
  { id: 'transport', label: 'Transport' },
  { id: 'dining', label: 'Dining out' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'clothing', label: 'Clothing' },
  { id: 'health', label: 'Health' },
  { id: 'kids', label: 'Kids' },
  { id: 'subscriptions', label: 'Subscriptions' },
  { id: 'household', label: 'Household' },
  { id: 'personal', label: 'Personal' },
];

// Monthly spending limits, one per category. November's spending sits close
// to several of them on purpose: this is a household watching its budget.
export const BUDGET_LIMITS = {
  housing: 1150,
  groceries: 480,
  utilities: 210,
  transport: 230,
  dining: 120,
  entertainment: 60,
  clothing: 100,
  health: 50,
  kids: 90,
  subscriptions: 35,
  household: 50,
  personal: 70,
};

export const GOALS = [
  { id: 'emergency', name: 'Emergency fund', note: 'Three months of essential bills, kept in an easy-access saver.', saved: 2850, target: 4000 },
  { id: 'holiday', name: 'Summer holiday — Cornwall', note: 'A week in a cottage near St Ives, train there and back.', saved: 640, target: 1200 },
  { id: 'washer', name: 'New washing machine', note: 'The old one leaks on spin cycle; replacing it before it floods the kitchen.', saved: 180, target: 450 },
  { id: 'christmas', name: 'Christmas fund', note: 'Presents, the tree and the big food shop, spread across the year.', saved: 310, target: 600 },
];

// Bills that repeat and are due next, shown on the dashboard.
export const UPCOMING_BILLS = [
  { desc: 'Rent — 14 Maple Terrace', amount: 950.0, due: '2026-12-01', cat: 'housing' },
  { desc: 'Netflix', amount: 12.99, due: '2026-12-01', cat: 'subscriptions' },
  { desc: 'Spotify', amount: 11.99, due: '2026-12-01', cat: 'subscriptions' },
  { desc: 'Council tax', amount: 142.0, due: '2026-12-05', cat: 'housing' },
  { desc: 'Octopus Energy (estimate)', amount: 118.6, due: '2026-12-06', cat: 'utilities' },
  { desc: 'Water bill — Bristol Water', amount: 36.2, due: '2026-12-14', cat: 'utilities' },
  { desc: 'Broadband — Virgin Media', amount: 32.0, due: '2026-12-20', cat: 'utilities' },
  { desc: 'Car insurance — Direct Line', amount: 61.2, due: '2026-12-22', cat: 'transport' },
];

export const SEED_TRANSACTIONS = [
  // ---- October 2026 ----
  { id: 'o01', date: '2026-10-01', desc: 'Rent — 14 Maple Terrace', cat: 'housing', amount: -950.0 },
  { id: 'o02', date: '2026-10-01', desc: 'Netflix', cat: 'subscriptions', amount: -12.99 },
  { id: 'o03', date: '2026-10-01', desc: 'Spotify', cat: 'subscriptions', amount: -11.99 },
  { id: 'o04', date: '2026-10-02', desc: 'Marcus salary — Hartley Logistics', cat: 'income', amount: 2140.0 },
  { id: 'o05', date: '2026-10-02', desc: 'Tesco weekly shop', cat: 'groceries', amount: -79.6 },
  { id: 'o06', date: '2026-10-03', desc: 'Fuel — Shell', cat: 'transport', amount: -38.5 },
  { id: 'o07', date: '2026-10-04', desc: 'Cinema — Vue Bristol', cat: 'entertainment', amount: -24.0 },
  { id: 'o08', date: '2026-10-05', desc: 'Council tax', cat: 'housing', amount: -142.0 },
  { id: 'o09', date: '2026-10-06', desc: 'Swimming lessons — Sophie & Leo', cat: 'kids', amount: -32.0 },
  { id: 'o10', date: '2026-10-07', desc: 'Octopus Energy', cat: 'utilities', amount: -104.3 },
  { id: 'o11', date: '2026-10-08', desc: 'Pharmacy — Boots', cat: 'health', amount: -9.8 },
  { id: 'o12', date: '2026-10-09', desc: 'Aldi weekly shop', cat: 'groceries', amount: -51.2 },
  { id: 'o13', date: '2026-10-10', desc: 'Takeaway — Domino\u2019s', cat: 'dining', amount: -28.4 },
  { id: 'o14', date: '2026-10-11', desc: 'DIY store — B&Q', cat: 'household', amount: -27.45 },
  { id: 'o15', date: '2026-10-12', desc: 'Fuel — BP', cat: 'transport', amount: -41.2 },
  { id: 'o16', date: '2026-10-13', desc: 'Child Benefit', cat: 'income', amount: 182.2 },
  { id: 'o17', date: '2026-10-14', desc: 'Haircuts — Marcus & Elena', cat: 'personal', amount: -46.0 },
  { id: 'o18', date: '2026-10-15', desc: 'School uniforms', cat: 'clothing', amount: -63.0 },
  { id: 'o19', date: '2026-10-15', desc: 'Disney+', cat: 'subscriptions', amount: -7.99 },
  { id: 'o20', date: '2026-10-16', desc: 'Sainsbury\u2019s weekly shop', cat: 'groceries', amount: -68.45 },
  { id: 'o21', date: '2026-10-17', desc: 'After-school club — Sophie', cat: 'kids', amount: -25.0 },
  { id: 'o22', date: '2026-10-18', desc: 'Film rental — Amazon', cat: 'entertainment', amount: -5.99 },
  { id: 'o23', date: '2026-10-19', desc: 'Water bill — Bristol Water', cat: 'utilities', amount: -36.2 },
  { id: 'o24', date: '2026-10-20', desc: 'Marcus overtime — Hartley Logistics', cat: 'income', amount: 96.5 },
  { id: 'o25', date: '2026-10-21', desc: 'Broadband — Virgin Media', cat: 'utilities', amount: -32.0 },
  { id: 'o26', date: '2026-10-22', desc: 'Optician — Specsavers', cat: 'health', amount: -35.0 },
  { id: 'o27', date: '2026-10-23', desc: 'Tesco weekly shop', cat: 'groceries', amount: -84.3 },
  { id: 'o28', date: '2026-10-24', desc: 'Car insurance — Direct Line', cat: 'transport', amount: -61.2 },
  { id: 'o29', date: '2026-10-25', desc: 'Sunday lunch — Toby Carvery', cat: 'dining', amount: -46.0 },
  { id: 'o31', date: '2026-10-26', desc: 'Elena salary — St Mary\u2019s Primary', cat: 'income', amount: 1365.0 },
  { id: 'o30', date: '2026-10-30', desc: 'Aldi weekly shop', cat: 'groceries', amount: -44.15 },

  // ---- November 2026 ----
  { id: 'n01', date: '2026-11-01', desc: 'Rent — 14 Maple Terrace', cat: 'housing', amount: -950.0 },
  { id: 'n02', date: '2026-11-01', desc: 'Netflix', cat: 'subscriptions', amount: -12.99 },
  { id: 'n03', date: '2026-11-01', desc: 'Spotify', cat: 'subscriptions', amount: -11.99 },
  { id: 'n04', date: '2026-11-02', desc: 'Cinema — Vue Bristol', cat: 'entertainment', amount: -27.0 },
  { id: 'n05', date: '2026-11-03', desc: 'Marcus salary — Hartley Logistics', cat: 'income', amount: 2140.0 },
  { id: 'n06', date: '2026-11-03', desc: 'Tesco weekly shop', cat: 'groceries', amount: -86.4 },
  { id: 'n07', date: '2026-11-04', desc: 'Fuel — Shell', cat: 'transport', amount: -42.0 },
  { id: 'n08', date: '2026-11-05', desc: 'Council tax', cat: 'housing', amount: -142.0 },
  { id: 'n09', date: '2026-11-05', desc: 'Pharmacy — Boots', cat: 'health', amount: -12.4 },
  { id: 'n10', date: '2026-11-06', desc: 'Octopus Energy', cat: 'utilities', amount: -118.6 },
  { id: 'n11', date: '2026-11-07', desc: 'Aldi weekly shop', cat: 'groceries', amount: -54.18 },
  { id: 'n12', date: '2026-11-07', desc: 'Swimming lessons — Sophie & Leo', cat: 'kids', amount: -32.0 },
  { id: 'n13', date: '2026-11-08', desc: 'Domino\u2019s pizza night', cat: 'dining', amount: -31.5 },
  { id: 'n14', date: '2026-11-09', desc: 'Bus passes', cat: 'transport', amount: -38.0 },
  { id: 'n15', date: '2026-11-09', desc: 'Cleaning supplies — Wilko', cat: 'household', amount: -21.3 },
  { id: 'n16', date: '2026-11-10', desc: 'Child Benefit', cat: 'income', amount: 182.2 },
  { id: 'n17', date: '2026-11-10', desc: 'Kids\u2019 shoes — Sports Direct', cat: 'clothing', amount: -42.0 },
  { id: 'n18', date: '2026-11-11', desc: 'Tesco weekly shop', cat: 'groceries', amount: -73.25 },
  { id: 'n19', date: '2026-11-12', desc: 'Home insurance — Aviva', cat: 'housing', amount: -28.4 },
  { id: 'n20', date: '2026-11-12', desc: 'Haircut — Marcus', cat: 'personal', amount: -18.0 },
  { id: 'n21', date: '2026-11-13', desc: 'School trip — Sophie', cat: 'kids', amount: -18.5 },
  { id: 'n22', date: '2026-11-14', desc: 'Water bill — Bristol Water', cat: 'utilities', amount: -36.2 },
  { id: 'n23', date: '2026-11-14', desc: 'Fish & chips — The Golden Fryer', cat: 'dining', amount: -24.8 },
  { id: 'n24', date: '2026-11-15', desc: 'Sainsbury\u2019s weekly shop', cat: 'groceries', amount: -61.9 },
  { id: 'n25', date: '2026-11-15', desc: 'Disney+', cat: 'subscriptions', amount: -7.99 },
  { id: 'n26', date: '2026-11-16', desc: 'Fuel — BP', cat: 'transport', amount: -35.5 },
  { id: 'n27', date: '2026-11-17', desc: 'Board game — The Works', cat: 'entertainment', amount: -18.99 },
  { id: 'n28', date: '2026-11-18', desc: 'Dentist check-up — Elena', cat: 'health', amount: -24.0 },
  { id: 'n29', date: '2026-11-19', desc: 'Aldi weekly shop', cat: 'groceries', amount: -48.76 },
  { id: 'n30', date: '2026-11-19', desc: 'Haircut — Elena', cat: 'personal', amount: -34.0 },
  { id: 'n31', date: '2026-11-20', desc: 'Broadband — Virgin Media', cat: 'utilities', amount: -32.0 },
  { id: 'n32', date: '2026-11-21', desc: 'Family meal — Bella Italia', cat: 'dining', amount: -58.4 },
  { id: 'n33', date: '2026-11-21', desc: 'Leo\u2019s birthday present', cat: 'kids', amount: -29.99 },
  { id: 'n34', date: '2026-11-22', desc: 'Car insurance — Direct Line', cat: 'transport', amount: -61.2 },
  { id: 'n35', date: '2026-11-23', desc: 'Tesco weekly shop', cat: 'groceries', amount: -92.1 },
  { id: 'n36', date: '2026-11-24', desc: 'Winter coats — Primark', cat: 'clothing', amount: -56.0 },
  { id: 'n37', date: '2026-11-25', desc: 'Elena salary — St Mary\u2019s Primary', cat: 'income', amount: 1365.0 },
  { id: 'n38', date: '2026-11-25', desc: 'Light bulbs & batteries', cat: 'household', amount: -14.6 },
  { id: 'n39', date: '2026-11-26', desc: 'Fuel — Shell', cat: 'transport', amount: -28.75 },
  { id: 'n40', date: '2026-11-27', desc: 'Lidl weekly shop', cat: 'groceries', amount: -41.35 },
];

// Months the ledger covers, oldest first. The dashboard opens on the latest.
export const MONTHS = ['2026-10', '2026-11'];
