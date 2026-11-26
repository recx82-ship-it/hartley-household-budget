// Small SVG charts, drawn from the site's own figures. No libraries, no
// network: everything is a string of SVG built from numbers passed in.

// Horizontal bars: rows of {label, value, display} with the longest at 100%.
export function hbarChart(rows, { alt = false } = {}) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return rows
    .map(
      (r) => `<div class="chart-row">
  <span>${r.label}</span>
  <span class="chart-track"><span class="${alt ? 'alt' : ''}" style="width:${((r.value / max) * 100).toFixed(1)}%"></span></span>
  <span class="chart-amt">${r.display}</span>
</div>`,
    )
    .join('');
}

// Grouped vertical bars: groups of {label, bars: [{label, value, color}]}.
// Returns an SVG with a simple value scale; heights are proportional.
export function groupedBars(groups, { height = 220, colors = ['#2e7d4f', '#b45309'] } = {}) {
  const max = Math.max(1, ...groups.flatMap((g) => g.bars.map((b) => b.value)));
  const W = 560;
  const H = height;
  const padB = 26;
  const padT = 12;
  const plotH = H - padT - padB;
  const groupW = W / groups.length;
  const barW = Math.min(52, (groupW - 28) / groups[0].bars.length);
  let svg = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Bar chart" style="display:block">`;
  // gridlines at 0, half and max
  for (const f of [0, 0.5, 1]) {
    const y = padT + plotH * (1 - f);
    svg += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#e6ebe4" stroke-width="1"/>`;
    svg += `<text x="4" y="${y - 4}" font-size="11" fill="#5c6b60">£${Math.round((max * f)).toLocaleString('en-GB')}</text>`;
  }
  groups.forEach((g, gi) => {
    const cx = groupW * gi + groupW / 2;
    g.bars.forEach((b, bi) => {
      const h = (b.value / max) * plotH;
      const x = cx - (g.bars.length * barW) / 2 + bi * barW + 2;
      const y = padT + plotH - h;
      svg += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW - 4}" height="${h.toFixed(1)}" rx="3" fill="${colors[bi % colors.length]}"><title>${b.label}: £${b.value.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</title></rect>`;
    });
    svg += `<text x="${cx}" y="${H - 8}" font-size="12" text-anchor="middle" fill="#1d2b22">${g.label}</text>`;
  });
  svg += '</svg>';
  const legend = groups[0].bars
    .map((b, i) => `<span style="margin-right:14px"><span style="display:inline-block;width:12px;height:12px;background:${colors[i % colors.length]};border-radius:3px;margin-right:5px"></span>${b.label}</span>`)
    .join('');
  return `<div>${legend}</div>${svg}`;
}
