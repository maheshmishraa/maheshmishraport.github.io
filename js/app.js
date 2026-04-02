/**
 * app.js — Portfolio Interactions
 * Custom cursor · GSAP animations · Typed.js · Terminal typewriter
 * Stat counters · Skill bars · Project filter · Magnetic buttons
 * Navbar scroll · Mobile menu · Metrics ticker · Contact form
 */
(function () {
  'use strict';

  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  /* ══════════════════════════════════════════════
     1. CUSTOM CURSOR
  ══════════════════════════════════════════════ */
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (dot && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    });

    (function lerp() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(lerp);
    })();

    document.querySelectorAll('a, button, .pj-card, .blog-card, .blog-arrow, .tool-tag, .dtab, .ptab, .skill-card, .kpi-tile').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
    });
  }

  /* ══════════════════════════════════════════════
     2. METRICS TICKER
  ══════════════════════════════════════════════ */
  const tickerItems = [
    { label: 'Revenue Growth',    value: '+18.3%',  cls: 'pos' },
    { label: 'EBITDA Margin',     value: '22.4%',   cls: 'pos' },
    { label: 'Customer LTV',      value: '$2,847',  cls: 'pos' },
    { label: 'CAC',               value: '$148',    cls: 'pos' },
    { label: 'ROAS',              value: '4.2×',    cls: 'pos' },
    { label: 'OEE',               value: '87.4%',   cls: '' },
    { label: 'OTIF Rate',         value: '94.1%',   cls: 'pos' },
    { label: 'Attrition Rate',    value: '8.2%',    cls: 'neg' },
    { label: 'Inventory Turns',   value: '8.3×',    cls: 'pos' },
    { label: 'Forecast Accuracy', value: '91.2%',   cls: 'pos' },
    { label: 'Fill Rate',         value: '96.8%',   cls: 'pos' },
    { label: 'Downtime',          value: '2.8%',    cls: 'neg' },
    { label: 'Training ROI',      value: '2.4×',    cls: 'pos' },
    { label: 'Working Capital',   value: '42 days', cls: 'pos' },
  ];

  const track = document.getElementById('ticker-track');
  if (track) {
    // Duplicate items for seamless loop
    const html = [...tickerItems, ...tickerItems].map(({ label, value, cls }) =>
      `<span class="tick-item ${cls}">${label}: <strong>${value}</strong></span><span class="tick-sep">|</span>`
    ).join('');
    track.innerHTML = html;
  }

  /* ══════════════════════════════════════════════
     3. TYPED.JS
  ══════════════════════════════════════════════ */
  if (document.getElementById('typed-roles') && typeof Typed !== 'undefined') {
    new Typed('#typed-roles', {
      strings: [
        'ML Pipelines',
        'Power BI Dashboards',
        'ETL Data Flows',
        'Predictive Models',
        'Data Science Solutions',
      ],
      typeSpeed:  52,
      backSpeed:  32,
      backDelay:  2400,
      startDelay: 700,
      loop:       true,
      cursorChar: '_',
    });
  }

  /* ══════════════════════════════════════════════
     4. HERO ENTRANCE
  ══════════════════════════════════════════════ */
  gsap.set(['.hero-badge','.hero-name','.hero-tagline','.hero-desc','.hero-actions','.hero-stats'], { y: 36 });
  gsap.set('.dashboard-card', { y: 24 });

  gsap.timeline({ delay: 0.05 })
    .to('.hero-badge',   { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 0)
    .to('.hero-name',    { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, 0.12)
    .to('.hero-tagline', { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 0.24)
    .to('.hero-desc',    { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 0.34)
    .to('.hero-actions', { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 0.44)
    .to('.hero-stats',   { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 0.54)
    .to('.dashboard-card',{ opacity: 1, y: 0, duration: 0.9,  ease: 'power3.out' }, 0.28);

  /* ══════════════════════════════════════════════
     5. STAT COUNTERS
  ══════════════════════════════════════════════ */
  document.querySelectorAll('.stat-n').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target, duration: 1.8, ease: 'power2.out',
          onUpdate: function () { el.textContent = Math.round(this.targets()[0].val); },
        });
      },
    });
  });

  /* ══════════════════════════════════════════════
     6. SKILL BAR REVEAL
  ══════════════════════════════════════════════ */
  document.querySelectorAll('.sk-fill').forEach(bar => {
    const w = bar.dataset.w;
    ScrollTrigger.create({
      trigger: bar, start: 'top 90%', once: true,
      onEnter: () => gsap.to(bar, { width: w + '%', duration: 1.3, ease: 'power3.out', delay: 0.1 }),
    });
  });

  /* ══════════════════════════════════════════════
     7. SCROLL REVEAL — sections & cards
  ══════════════════════════════════════════════ */
  gsap.utils.toArray('.section-header').forEach(el => {
    gsap.fromTo(el, { opacity: 0, y: 32 }, {
      opacity: 1, y: 0, duration: 0.75, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%' },
    });
  });

  // Cards with stagger
  ['.blog-card', '.skill-card', '.kpi-tile'].forEach(sel => {
    gsap.utils.toArray(sel).forEach((el, i) => {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.65,
        delay: (i % 4) * 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
      });
    });
  });

  // Domain stage
  gsap.fromTo('.domain-stage', { opacity: 0, y: 24 }, {
    opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
    scrollTrigger: { trigger: '.domain-stage', start: 'top 85%' },
  });

  /* ══════════════════════════════════════════════
     8. ABOUT BIO — fade in paragraphs on scroll
  ══════════════════════════════════════════════ */
  gsap.utils.toArray('.bio-p').forEach((el, i) => {
    gsap.fromTo(el, { opacity: 0, y: 20 }, {
      opacity: 1, y: 0, duration: 0.65,
      delay: i * 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  gsap.fromTo('.bio-facts', { opacity: 0, y: 16 }, {
    opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
    scrollTrigger: { trigger: '.bio-facts', start: 'top 90%' },
  });

  /* ══════════════════════════════════════════════
     9. PROJECT TABS
  ══════════════════════════════════════════════ */
  const ptabs  = document.querySelectorAll('.ptab');
  const panels = document.querySelectorAll('.proj-panel');

  ptabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Deactivate all tabs & panels
      ptabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      // Activate clicked tab + matching panel
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.panel);
      if (target) {
        target.classList.add('active');
        // Stagger-animate cards in the newly visible panel
        const cards = target.querySelectorAll('.pj-card');
        gsap.fromTo(cards,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.38, ease: 'power3.out',
            stagger: 0.045, clearProps: 'transform' }
        );
      }
    });
  });

  // Animate cards in the default active panel on load
  const defaultPanel = document.querySelector('.proj-panel.active');
  if (defaultPanel) {
    const cards = defaultPanel.querySelectorAll('.pj-card');
    gsap.fromTo(cards,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.38, ease: 'power3.out',
        stagger: 0.045, delay: 0.6, clearProps: 'transform' }
    );
  }

  /* ══════════════════════════════════════════════
     10. MAGNETIC BUTTONS
  ══════════════════════════════════════════════ */
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r  = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width  / 2);
      const dy = e.clientY - (r.top  + r.height / 2);
      gsap.to(el, { x: dx * 0.25, y: dy * 0.25, duration: 0.3, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.4)' });
    });
  });

  /* ══════════════════════════════════════════════
     11. NAVBAR SCROLL
  ══════════════════════════════════════════════ */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════
     11b. BLOG CAROUSEL
  ══════════════════════════════════════════════ */
  (function () {
    const track    = document.querySelector('.blog-track');
    const wrap     = document.querySelector('.blog-track-wrap');
    const prevBtn  = document.querySelector('.blog-prev');
    const nextBtn  = document.querySelector('.blog-next');
    if (!track || !prevBtn || !nextBtn) return;

    let current = 0;

    function visibleCount() {
      const ww = window.innerWidth;
      if (ww < 640)  return 1;
      if (ww < 960)  return 2;
      return 3;
    }

    function cardWidth() {
      const cards = track.querySelectorAll('.blog-card');
      if (!cards.length) return 0;
      const gap = parseFloat(getComputedStyle(track).gap) || 22.4;
      return cards[0].offsetWidth + gap;
    }

    function totalCards() {
      return track.querySelectorAll('.blog-card').length;
    }

    function maxIndex() {
      return Math.max(0, totalCards() - visibleCount());
    }

    function update(animate) {
      const offset = current * cardWidth();
      if (animate === false) {
        track.style.transition = 'none';
      } else {
        track.style.transition = 'transform .45s cubic-bezier(0.4,0,0.2,1)';
      }
      track.style.transform = `translateX(-${offset}px)`;
      prevBtn.disabled = current === 0;
      nextBtn.disabled = current >= maxIndex();
    }

    prevBtn.addEventListener('click', () => {
      if (current > 0) { current--; update(); }
    });

    nextBtn.addEventListener('click', () => {
      if (current < maxIndex()) { current++; update(); }
    });

    window.addEventListener('resize', () => {
      current = Math.min(current, maxIndex());
      update(false);
    });

    update(false);
  })();

  /* ══════════════════════════════════════════════
     12. MOBILE MENU
  ══════════════════════════════════════════════ */
  const burger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobile-drawer');

  if (burger && drawer) {
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      drawer.classList.toggle('open', open);
    });
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        drawer.classList.remove('open');
      });
    });
  }

  /* ══════════════════════════════════════════════
     13. SMOOTH SCROLL
  ══════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ══════════════════════════════════════════════
     14. CONTACT FORM (Formspree AJAX)
  ══════════════════════════════════════════════ */
  const form    = document.getElementById('contact-form');
  const fBtn    = document.getElementById('form-submit');

  if (form && fBtn) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const label = fBtn.querySelector('.fbtn-label');
      const arr   = fBtn.querySelector('.fbtn-arr');

      fBtn.disabled = true;
      if (label) label.textContent = 'Sending…';
      if (arr)   arr.textContent   = '⏳';

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form),
        });

        if (res.ok) {
          if (label) label.textContent = 'Message Sent!';
          if (arr)   arr.textContent   = '✓';
          fBtn.style.background = '#10b981';
          fBtn.style.color      = '#fff';
          form.reset();
        } else {
          if (label) label.textContent = 'Failed — try again';
          fBtn.style.background = '#f43f5e';
        }
      } catch {
        if (label) label.textContent = 'Failed — try again';
        fBtn.style.background = '#f43f5e';
      }

      setTimeout(() => {
        fBtn.disabled = false;
        fBtn.style.background = '';
        fBtn.style.color = '';
        if (label) label.textContent = 'Send Message';
        if (arr)   arr.textContent   = '→';
      }, 3500);
    });
  }

})();
