/**
 * domains.js — MBA Domain Analytics Charts
 *
 * Canvas-drawn interactive charts for:
 *   Finance   · Marketing   · Operations
 *   HR Analytics  · Supply Chain
 *
 * Each chart animates on first render (draw progress 0→1).
 * Also draws the hero sparkline dashboard card.
 */
(function () {
  'use strict';

  /* ══════════════════════════════════════════════════
     COLOR TOKENS  (match CSS variables)
  ══════════════════════════════════════════════════ */
  const C = {
    gold:    '#d4940a',
    goldLt:  '#f0ad3a',
    blue:    '#3574e0',
    teal:    '#0d9488',
    emerald: '#10b981',
    rose:    '#f43f5e',
    violet:  '#7c3aed',
    text:    '#dce4f0',
    text2:   '#8496b0',
    text3:   '#4a5a70',
    border:  'rgba(255,255,255,0.07)',
    card:    'rgba(255,255,255,0.04)',
  };

  /* ══════════════════════════════════════════════════
     DATA
  ══════════════════════════════════════════════════ */
  const DATA = {
    finance: {
      months:  ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      revenue: [480, 520, 490, 610, 580, 640, 700, 720, 680, 740, 780, 850],
      ebitda:  [ 82,  93,  78, 122, 108, 131, 161, 166, 139, 174, 193, 221],
    },
    marketing: {
      stages: ['Awareness','Reach','Engagement','Leads','MQL','SQL','Customers'],
      values: [50000, 28000, 14200, 5800, 2100, 840, 312],
    },
    operations: {
      gauges: [
        { label: 'OEE',       value: 87, color: C.teal   },
        { label: 'Utilization',value: 78, color: C.blue   },
        { label: 'On-Time',   value: 94, color: C.gold   },
        { label: 'Quality',   value: 96, color: C.emerald },
      ],
    },
    hr: {
      departments: ['Engineering','Sales','Marketing','Operations','Finance','HR'],
      attrition:   [8.2, 14.6, 11.3, 6.8, 5.4, 4.1],
    },
    supply: {
      months:    ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      demand:    [320, 340, 380, 420, 460, 500, 480, 520, 560, 590, 640, 700],
      inventory: [410, 395, 420, 450, 440, 480, 460, 490, 530, 555, 580, 610],
    },
  };

  /* ══════════════════════════════════════════════════
     ANIMATION ENGINE
  ══════════════════════════════════════════════════ */
  const animRafs = {};

  function animateChart(id, drawFn, duration) {
    if (animRafs[id]) cancelAnimationFrame(animRafs[id]);
    const start = performance.now();
    const dur   = duration || 900;

    function step(now) {
      const p = Math.min(1, (now - start) / dur);
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; // easeInOut
      drawFn(eased);
      if (p < 1) animRafs[id] = requestAnimationFrame(step);
    }

    animRafs[id] = requestAnimationFrame(step);
  }

  /* ══════════════════════════════════════════════════
     HELPERS
  ══════════════════════════════════════════════════ */
  function setHiDpi(canvas) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    if (!rect.width) return dpr;
    canvas.width  = rect.width  * dpr;
    canvas.height = rect.height * dpr;
    canvas.getContext('2d').scale(dpr, dpr);
    return dpr;
  }

  function hexAlpha(hex, a) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${a})`;
  }

  function drawGrid(ctx, x0, y0, w, h, steps) {
    ctx.strokeStyle = C.border;
    ctx.lineWidth = 1;
    for (let i = 0; i <= steps; i++) {
      const y = y0 + (i / steps) * h;
      ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + w, y); ctx.stroke();
    }
  }

  function drawYLabels(ctx, x, y0, h, steps, max, fmt, color) {
    ctx.fillStyle   = color || C.text2;
    ctx.font        = '10px JetBrains Mono, monospace';
    ctx.textAlign   = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= steps; i++) {
      const val = Math.round(max * (steps - i) / steps);
      ctx.fillText(fmt(val), x, y0 + (i / steps) * h);
    }
  }

  function drawXLabels(ctx, labels, x0, y, w, skip) {
    ctx.fillStyle   = C.text2;
    ctx.font        = '10px JetBrains Mono, monospace';
    ctx.textAlign   = 'center';
    ctx.textBaseline = 'top';
    const step = w / (labels.length - 1);
    labels.forEach((l, i) => {
      if (skip && i % skip !== 0 && i !== labels.length - 1) return;
      ctx.fillText(l, x0 + i * step, y);
    });
  }

  function getCanvasSize(canvas) {
    // Use CSS size for layout math (pre hi-dpi scaling)
    const r = canvas.getBoundingClientRect();
    return { w: r.width || canvas.offsetWidth || 540, h: r.height || canvas.offsetHeight || 210 };
  }

  /* ══════════════════════════════════════════════════
     1. FINANCE — Revenue & EBITDA area/line chart
  ══════════════════════════════════════════════════ */
  function drawFinance(progress) {
    const canvas = document.getElementById('chart-finance');
    if (!canvas) return;

    const { w, h } = getCanvasSize(canvas);
    const dpr = setHiDpi(canvas);
    const ctx = canvas.getContext('2d');

    // Apply DPR scaling only once per animateChart call
    ctx.save();
    const pad = { t: 18, r: 18, b: 38, l: 52 };
    const cw = w - pad.l - pad.r;
    const ch = h - pad.t - pad.b;

    ctx.clearRect(0, 0, w * dpr, h * dpr);

    const rev = DATA.finance.revenue;
    const ebt = DATA.finance.ebitda;
    const mths = DATA.finance.months;
    const maxVal = Math.max(...rev) * 1.12;

    const tx = i => pad.l + (i / (mths.length - 1)) * cw;
    const ty = v => pad.t + ch - (v / maxVal) * ch;

    // Grid
    drawGrid(ctx, pad.l, pad.t, cw, ch, 4);
    drawYLabels(ctx, pad.l - 6, pad.t, ch, 4, maxVal, v => '$' + v + 'M');
    drawXLabels(ctx, mths, pad.l, pad.t + ch + 8, cw, 2);

    // Clipping rect for progress
    ctx.save();
    ctx.rect(pad.l, 0, cw * progress, h);
    ctx.clip();

    // Revenue area
    const revGrad = ctx.createLinearGradient(0, pad.t, 0, pad.t + ch);
    revGrad.addColorStop(0, hexAlpha(C.gold, 0.28));
    revGrad.addColorStop(1, hexAlpha(C.gold, 0.02));

    ctx.beginPath();
    ctx.moveTo(tx(0), ty(rev[0]));
    rev.forEach((v, i) => ctx.lineTo(tx(i), ty(v)));
    ctx.lineTo(tx(rev.length - 1), pad.t + ch);
    ctx.lineTo(tx(0), pad.t + ch);
    ctx.closePath();
    ctx.fillStyle = revGrad;
    ctx.fill();

    // Revenue line
    ctx.beginPath();
    ctx.moveTo(tx(0), ty(rev[0]));
    rev.forEach((v, i) => ctx.lineTo(tx(i), ty(v)));
    ctx.strokeStyle = C.gold;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // EBITDA line (dashed)
    ctx.beginPath();
    ctx.moveTo(tx(0), ty(ebt[0]));
    ebt.forEach((v, i) => ctx.lineTo(tx(i), ty(v)));
    ctx.strokeStyle = C.teal;
    ctx.lineWidth = 1.8;
    ctx.setLineDash([5, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.restore();

    // Dot markers at last visible point
    const lastIdx = Math.min(rev.length - 1, Math.floor((mths.length - 1) * progress));
    [{ data: rev, color: C.gold }, { data: ebt, color: C.teal }].forEach(({ data, color }) => {
      ctx.beginPath();
      ctx.arc(tx(lastIdx), ty(data[lastIdx]), 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });

    ctx.restore();
  }

  /* ══════════════════════════════════════════════════
     2. MARKETING — Funnel chart
  ══════════════════════════════════════════════════ */
  function drawMarketing(progress) {
    const canvas = document.getElementById('chart-marketing');
    if (!canvas) return;

    const { w, h } = getCanvasSize(canvas);
    const dpr = setHiDpi(canvas);
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, w * dpr, h * dpr);

    const { stages, values } = DATA.marketing;
    const n    = stages.length;
    const rowH = h / n;
    const maxV = values[0];
    const maxBarW = w * 0.55;
    const pad = { l: 96, r: 60 };

    stages.forEach((stage, i) => {
      const fillFrac = (values[i] / maxV) * progress;
      const barW = fillFrac * maxBarW;
      const bh   = rowH * 0.62;
      const y    = i * rowH + (rowH - bh) / 2;
      const x    = (w - maxBarW) / 2 + pad.l / 2;

      // Background track
      ctx.fillStyle = hexAlpha('#ffffff', 0.04);
      roundRect(ctx, x, y, maxBarW - pad.r, bh, 4);
      ctx.fill();

      // Filled bar — gold fading to blue down funnel
      const t     = i / (n - 1);
      const color = lerpColor(C.gold, C.blue, t);
      ctx.fillStyle = hexAlpha(color, 0.65 * progress);
      roundRect(ctx, x, y, barW, bh, 4);
      ctx.fill();

      // Stage label (left)
      ctx.fillStyle   = C.text2;
      ctx.font        = '11px Space Grotesk, sans-serif';
      ctx.textAlign   = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(stage, x - 8, y + bh / 2);

      // Value (right)
      if (progress > 0.1) {
        ctx.fillStyle   = color;
        ctx.font        = 'bold 11px JetBrains Mono, monospace';
        ctx.textAlign   = 'left';
        ctx.fillText(values[i].toLocaleString(), x + barW + 8, y + bh / 2);
      }

      // Conversion rate arrow
      if (i > 0 && progress > 0.3) {
        const rate = ((values[i] / values[i - 1]) * 100).toFixed(1) + '%';
        ctx.fillStyle   = C.text3;
        ctx.font        = '9px JetBrains Mono, monospace';
        ctx.textAlign   = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText('↓ ' + rate, x + maxBarW / 2 - pad.r / 2, y);
      }
    });
  }

  /* ══════════════════════════════════════════════════
     3. OPERATIONS — Arc gauge charts
  ══════════════════════════════════════════════════ */
  function drawOperations(progress) {
    const canvas = document.getElementById('chart-operations');
    if (!canvas) return;

    const { w, h } = getCanvasSize(canvas);
    const dpr = setHiDpi(canvas);
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, w * dpr, h * dpr);

    const gauges = DATA.operations.gauges;
    const n      = gauges.length;
    const gW     = w / n;
    const r      = Math.min(gW * 0.38, h * 0.42);

    gauges.forEach((g, i) => {
      const cx = gW * i + gW / 2;
      const cy = h * 0.52;
      const sA = Math.PI * 0.75;
      const eA = Math.PI * 2.25;
      const fill = sA + (g.value / 100) * (eA - sA) * progress;

      // Track arc
      ctx.beginPath();
      ctx.arc(cx, cy, r, sA, eA);
      ctx.strokeStyle = hexAlpha('#ffffff', 0.06);
      ctx.lineWidth   = 12;
      ctx.lineCap     = 'round';
      ctx.stroke();

      // Fill arc
      ctx.beginPath();
      ctx.arc(cx, cy, r, sA, fill);
      ctx.strokeStyle = g.color;
      ctx.lineWidth   = 12;
      ctx.lineCap     = 'round';
      ctx.stroke();

      // Value text
      ctx.fillStyle    = C.text;
      ctx.font         = `bold ${Math.round(r * 0.5)}px Space Grotesk, sans-serif`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(Math.round(g.value * progress) + '%', cx, cy);

      // Label
      ctx.fillStyle    = C.text2;
      ctx.font         = '11px Space Grotesk, sans-serif';
      ctx.textBaseline = 'top';
      ctx.fillText(g.label, cx, cy + r * 0.85);

      // Subtle glow ring behind
      if (progress > 0.5) {
        ctx.beginPath();
        ctx.arc(cx, cy, r - 2, sA, fill);
        ctx.strokeStyle = hexAlpha(g.color, 0.12);
        ctx.lineWidth   = 22;
        ctx.stroke();
      }
    });
  }

  /* ══════════════════════════════════════════════════
     4. HR ANALYTICS — Horizontal bar chart
  ══════════════════════════════════════════════════ */
  function drawHR(progress) {
    const canvas = document.getElementById('chart-hr');
    if (!canvas) return;

    const { w, h } = getCanvasSize(canvas);
    const dpr = setHiDpi(canvas);
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, w * dpr, h * dpr);

    const { departments: depts, attrition } = DATA.hr;
    const n      = depts.length;
    const pad    = { t: 10, b: 24, l: 100, r: 55 };
    const barAreaW = w - pad.l - pad.r;
    const barH   = (h - pad.t - pad.b) / n;
    const maxVal = Math.max(...attrition) * 1.2;

    // X-axis label
    ctx.fillStyle    = C.text3;
    ctx.font         = '9px JetBrains Mono, monospace';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Attrition Rate (%)', pad.l + barAreaW / 2, h);

    depts.forEach((dept, i) => {
      const bw   = (attrition[i] / maxVal) * barAreaW * progress;
      const bh   = barH * 0.58;
      const y    = pad.t + i * barH + (barH - bh) / 2;
      const x    = pad.l;

      // Color by risk level
      let color = C.emerald;
      if (attrition[i] > 10) color = C.gold;
      if (attrition[i] > 13) color = C.rose;

      // Background
      ctx.fillStyle = hexAlpha('#ffffff', 0.035);
      ctx.fillRect(x, y, barAreaW, bh);

      // Bar
      ctx.fillStyle = hexAlpha(color, 0.55);
      ctx.fillRect(x, y, bw, bh);

      // Accent left border
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 3, bh);

      // Dept label
      ctx.fillStyle    = C.text2;
      ctx.font         = '11px Space Grotesk, sans-serif';
      ctx.textAlign    = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(dept, x - 8, y + bh / 2);

      // Value
      if (progress > 0.1) {
        ctx.fillStyle    = color;
        ctx.font         = 'bold 11px JetBrains Mono, monospace';
        ctx.textAlign    = 'left';
        ctx.fillText(attrition[i] + '%', x + bw + 8, y + bh / 2);
      }
    });
  }

  /* ══════════════════════════════════════════════════
     5. SUPPLY CHAIN — Demand vs Inventory area chart
  ══════════════════════════════════════════════════ */
  function drawSupply(progress) {
    const canvas = document.getElementById('chart-supply');
    if (!canvas) return;

    const { w, h } = getCanvasSize(canvas);
    const dpr = setHiDpi(canvas);
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, w * dpr, h * dpr);

    const { months, demand, inventory } = DATA.supply;
    const pad = { t: 18, r: 18, b: 38, l: 52 };
    const cw  = w - pad.l - pad.r;
    const ch  = h - pad.t - pad.b;
    const all = [...demand, ...inventory];
    const maxV = Math.max(...all) * 1.12;

    const tx = i => pad.l + (i / (months.length - 1)) * cw;
    const ty = v => pad.t + ch - (v / maxV) * ch;

    drawGrid(ctx, pad.l, pad.t, cw, ch, 4);
    drawYLabels(ctx, pad.l - 6, pad.t, ch, 4, maxV, v => v + 'K');
    drawXLabels(ctx, months, pad.l, pad.t + ch + 8, cw, 2);

    ctx.save();
    ctx.rect(pad.l, 0, cw * progress, h);
    ctx.clip();

    // Inventory area
    const invGrad = ctx.createLinearGradient(0, pad.t, 0, pad.t + ch);
    invGrad.addColorStop(0, hexAlpha(C.blue, 0.2));
    invGrad.addColorStop(1, hexAlpha(C.blue, 0.02));

    ctx.beginPath();
    ctx.moveTo(tx(0), ty(inventory[0]));
    inventory.forEach((v, i) => ctx.lineTo(tx(i), ty(v)));
    ctx.lineTo(tx(inventory.length - 1), pad.t + ch);
    ctx.lineTo(tx(0), pad.t + ch);
    ctx.closePath();
    ctx.fillStyle = invGrad;
    ctx.fill();

    // Demand area
    const demGrad = ctx.createLinearGradient(0, pad.t, 0, pad.t + ch);
    demGrad.addColorStop(0, hexAlpha(C.gold, 0.2));
    demGrad.addColorStop(1, hexAlpha(C.gold, 0.02));

    ctx.beginPath();
    ctx.moveTo(tx(0), ty(demand[0]));
    demand.forEach((v, i) => ctx.lineTo(tx(i), ty(v)));
    ctx.lineTo(tx(demand.length - 1), pad.t + ch);
    ctx.lineTo(tx(0), pad.t + ch);
    ctx.closePath();
    ctx.fillStyle = demGrad;
    ctx.fill();

    // Lines
    [{ data: demand, color: C.gold }, { data: inventory, color: C.blue }].forEach(({ data, color }) => {
      ctx.beginPath();
      ctx.moveTo(tx(0), ty(data[0]));
      data.forEach((v, i) => ctx.lineTo(tx(i), ty(v)));
      ctx.strokeStyle = color;
      ctx.lineWidth   = 2;
      ctx.lineJoin    = 'round';
      ctx.stroke();
    });

    ctx.restore();
  }

  /* ══════════════════════════════════════════════════
     UTILITY FUNCTIONS
  ══════════════════════════════════════════════════ */
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function lerpColor(a, b, t) {
    const ra = parseInt(a.slice(1,3),16), ga = parseInt(a.slice(3,5),16), ba_ = parseInt(a.slice(5,7),16);
    const rb = parseInt(b.slice(1,3),16), gb = parseInt(b.slice(3,5),16), bb_ = parseInt(b.slice(5,7),16);
    const r = Math.round(ra + (rb - ra) * t).toString(16).padStart(2,'0');
    const g = Math.round(ga + (gb - ga) * t).toString(16).padStart(2,'0');
    const bl= Math.round(ba_+(bb_-ba_)* t).toString(16).padStart(2,'0');
    return `#${r}${g}${bl}`;
  }

  /* ══════════════════════════════════════════════════
     CHART MAP
  ══════════════════════════════════════════════════ */
  const CHART_FNS = {
    finance:    drawFinance,
    marketing:  drawMarketing,
    operations: drawOperations,
    hr:         drawHR,
    supply:     drawSupply,
  };

  /* ══════════════════════════════════════════════════
     DOM INIT — tabs + first render
  ══════════════════════════════════════════════════ */
  function initDomainTabs() {
    const tabs   = document.querySelectorAll('.dtab');
    const panels = document.querySelectorAll('.domain-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const domain = tab.dataset.domain;

        tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
        panels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        tab.setAttribute('aria-selected','true');

        const panel = document.getElementById('dp-' + domain);
        if (panel) panel.classList.add('active');

        const fn = CHART_FNS[domain];
        if (fn) animateChart('chart-' + domain, fn, 900);
      });
    });

    // Initial render — finance
    animateChart('chart-finance', drawFinance, 1000);
  }

  /* ══════════════════════════════════════════════════
     INTERSECTION OBSERVER (trigger on scroll into view)
  ══════════════════════════════════════════════════ */
  function observeDomains() {
    const section = document.getElementById('domains');
    if (!section) return;

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        // Re-draw the active chart when section comes into view
        const active = document.querySelector('.dtab.active');
        if (active) {
          const fn = CHART_FNS[active.dataset.domain];
          if (fn) animateChart('chart-' + active.dataset.domain, fn, 1000);
        }
      }
    }, { threshold: 0.15 });

    obs.observe(section);
  }

  /* ══════════════════════════════════════════════════
     RESIZE — redraw visible chart
  ══════════════════════════════════════════════════ */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const active = document.querySelector('.dtab.active');
      if (active) {
        const fn = CHART_FNS[active.dataset.domain];
        if (fn) fn(1);
      }
    }, 200);
  });

  /* ══════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initDomainTabs();
      observeDomains();
    });
  } else {
    initDomainTabs();
    observeDomains();
  }

  // Expose for app.js if needed
  window.portfolioDomains = { CHART_FNS, animateChart };

})();
