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
  const canUseFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initial states for Boot Sequence Reveal
  gsap.set(['.hero-badge', '.hero-name', '.hero-tagline', '.hero-desc', '.hero-actions', '.hero-stats', '.bento-card'], { opacity: 0, y: 36 });

  /* ══════════════════════════════════════════════
     0. DATA ENGINE (The "Prodigy" Foundations)
     Separates content from view to enable scale.
  ══════════════════════════════════════════════ */
  (function initDataEngine() {
    if (typeof MAHESH_DATA === 'undefined') return;

    // A. Hero Stats
    const heroMount = document.getElementById('hero-stats-mount');
    if (heroMount) {
      heroMount.innerHTML = `
        <div class="stat">
          <span class="stat-n" data-count="${MAHESH_DATA.stats.projects}">${MAHESH_DATA.stats.projects}</span><span class="stat-plus">+</span>
          <span class="stat-l">High-Stake Projects</span>
        </div>
        <span class="stat-sep"></span>
        <div class="stat">
          <span class="stat-n" data-count="${MAHESH_DATA.stats.experience_years}">${MAHESH_DATA.stats.experience_years}</span><span class="stat-plus"></span>
          <span class="stat-l">Years analytical exp.</span>
        </div>
        <span class="stat-sep"></span>
        <div class="stat">
          <span class="stat-n" data-count="${MAHESH_DATA.stats.domains}">${MAHESH_DATA.stats.domains}+</span>
          <span class="stat-l">Global Domains</span>
        </div>
      `;
    }

    // B. Bento Stats
    const bentoImpact = document.getElementById('bento-stat-impact');
    const bentoData = document.getElementById('bento-stat-data');
    if (bentoImpact) {
      bentoImpact.innerHTML = `
        <div class="bs-icon">🚀</div>
        <div class="bs-val">${MAHESH_DATA.stats.efficiency_lift}</div>
        <div class="bs-lab">Reporting Efficiency Lift</div>
      `;
    }
    if (bentoData) {
      bentoData.innerHTML = `
        <div class="bs-icon">💾</div>
        <div class="bs-val">${MAHESH_DATA.stats.hours_saved}hr</div>
        <div class="bs-lab">Saved / Week via Automation</div>
      `;
    }

    // C. Timeline Injection
    const timelineMount = document.getElementById('timeline-mount');
    if (timelineMount) {
      timelineMount.innerHTML = MAHESH_DATA.timeline.map((item, idx) => `
        <div class="tl-item tl-${item.cat} ${item.current ? 'tl-current' : ''}">
          <div class="tl-left">
            <div class="tl-badge tl-badge-${item.cat}">
              <img src="${item.logo}" alt="Logo" class="badge-logo">
            </div>
            ${item.current ? '' : '<div class="tl-spine"></div>'}
          </div>
          <div class="tl-content">
            <span class="tl-type ${item.current ? 'tl-type-now' : ''}">${item.type}</span>
            <p class="tl-title">${item.title}</p>
            <p class="tl-org">${item.org}</p>
            <span class="tl-date">${item.date}</span>
            <span class="tl-detail">${item.detail}</span>
          </div>
        </div>
      `).join('');
    }

    // D. Skills Injection
    const skillsMount = document.getElementById('skills-mount');
    if (skillsMount) {
      skillsMount.innerHTML = MAHESH_DATA.skills.map(cat => `
        <div class="skill-card">
          <div class="skill-card-hd">
            <span class="sk-icon">${cat.icon}</span>
            <h3>${cat.category}</h3>
          </div>
          <div class="skill-list">
            ${cat.items.map(sk => `
              <div class="sk-row">
                <div class="sk-labels"><span>${sk.name}</span><span>${sk.val}%</span></div>
                <div class="sk-track">
                  <div class="sk-fill" data-w="${sk.val}" style="--c:${sk.color}"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('');
    }
  })();

  /* ══════════════════════════════════════════════
     1. CUSTOM CURSOR
  ══════════════════════════════════════════════ */
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (dot && ring && canUseFinePointer) {
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

    document.querySelectorAll('a, button, .pj-card, .blog-card, .blog-arrow, .tool-tag, .dtab, .ptab, .ltab, .skill-card, .kpi-tile').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
    });
  } else {
    if (dot) dot.style.display = 'none';
    if (ring) ring.style.display = 'none';
  }


  /* ══════════════════════════════════════════════
     3. TYPED.JS
  ══════════════════════════════════════════════ */
  if (document.getElementById('typed-roles') && typeof Typed !== 'undefined') {
    new Typed('#typed-roles', {
      strings: [
        'Scientist by Root (Biotech)',
        'Analyst by Trade (WNS Global)',
        'Strategist by Design (GIM Big Data)',
        'Data Storytelling Specialist',
      ],
      typeSpeed:      40,
      backSpeed:      20,
      backDelay:     2800,
      startDelay:     600,
      loop:           true,
      showCursor:     false,
      smartBackspace: false,
    });
  }

  /* ══════════════════════════════════════════════
     0. SYSTEM SYNC & MICRO-HAPTICS
  ══════════════════════════════════════════════ */
  window.addEventListener('bootComplete', (e) => {
    const isInstant = e.detail && e.detail.instant;

    if (isInstant) {
      // Instant reveal - no delay, no movement
      gsap.set(['.hero-badge', '.hero-name', '.hero-tagline', '.hero-desc', '.hero-actions', '.hero-stats', '.bento-card'], { opacity: 1, y: 0 });
    } else {
      // Staggered cinematic reveal
      gsap.timeline({ delay: 0.1 })
        .to('.hero-badge',   { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 0)
        .to('.hero-name',    { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, 0.12)
        .to('.hero-tagline', { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 0.24)
        .to('.hero-desc',    { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 0.34)
        .to('.hero-actions', { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 0.44)
        .to('.hero-stats',   { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 0.54)
        .to('.bento-card',   { opacity: 1, y: 0, duration: 0.8,  ease: 'power3.out', stagger: 0.1 }, 0.3);
    }
  });

  /* ── DATA VISUALIZATION REVEALS ── */
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

  /* sections 7 & 8 — scroll reveals handled by scroll-effects.js */

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
  if (canUseFinePointer && !prefersReducedMotion) {
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r  = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width  / 2);
        const dy = e.clientY - (r.top  + r.height / 2);
        gsap.to(el, { x: dx * 0.18, y: dy * 0.18, duration: 0.22, ease: 'power2.out' });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.35, ease: 'power2.out' });
      });
    });
  }

  /* ══════════════════════════════════════════════
     11. SCROLL-BASED NAVIGATION
  ══════════════════════════════════════════════ */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('[data-page]');
  const sections = Array.from(document.querySelectorAll('section[id]'));

  const navOffset = () => (navbar?.offsetHeight || 68) + 34; // nav + ticker

  // Smooth-scroll on nav / data-page link click
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(link.dataset.page);
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - navOffset();
        window.scrollTo({ top, behavior: 'smooth' });
      }
      const burger = document.getElementById('hamburger');
      const drawer = document.getElementById('mobile-drawer');
      if (burger && drawer) {
        burger.classList.remove('open');
        drawer.classList.remove('open');
      }
    });
  });

  // Active nav highlight + navbar style on scroll
  let lastActiveId = 'hero';
  function updateActiveNav() {
    const scrollY  = window.scrollY;
    const offset   = navOffset() + 60;
    let currentId  = sections[0]?.id || 'hero';

    for (const section of sections) {
      if (section.offsetTop - offset <= scrollY) {
        currentId = section.id;
      }
    }

    if (currentId !== lastActiveId) {
      lastActiveId = currentId;
      navLinks.forEach(l => l.classList.toggle('active', l.dataset.page === currentId));
      document.dispatchEvent(new CustomEvent('pageswitch', { detail: { to: currentId } }));
    }

    if (navbar) navbar.classList.toggle('scrolled', scrollY > 20);
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

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
  }

  /* ══════════════════════════════════════════════
     13. ANCHOR LINKS → smooth scroll
  ══════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    const href = a.getAttribute('href');
    if (href === '#' || href === '#hero') return;
    const targetId = href.replace('#', '');
    const target = document.getElementById(targetId);
    if (target) {
      a.addEventListener('click', e => {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - navOffset();
        window.scrollTo({ top, behavior: 'smooth' });
      });
    }
  });

  /* ══════════════════════════════════════════════
     14. LEARNING — TABS + ACCORDIONS
  ══════════════════════════════════════════════ */

  // Topic tabs
  document.querySelectorAll('.ltab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.ltab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.learn-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('ltab-' + tab.dataset.ltab);
      if (panel) panel.classList.add('active');
    });
  });

  /* ══════════════════════════════════════════════
     15. CONTACT FORM (Formspree AJAX)
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

  /* ══════════════════════════════════════════════
     16. SQL SECRET SAUCE TYPEWRITER
  ══════════════════════════════════════════════ */
  /* ══════════════════════════════════════════════
     16. INTERACTIVE SQL TERMINAL ENGINE
  ══════════════════════════════════════════════ */
  (function () {
    const codeEl       = document.getElementById('code-secret-sauce');
    const terminalBody = document.getElementById('terminal-body');
    const historyEl    = document.getElementById('term-history');
    const promptLine   = document.getElementById('term-prompt-line');
    const displayInput = document.getElementById('term-current-input');
    const hiddenInput  = document.getElementById('term-hidden-input');

    if (!codeEl || !hiddenInput) return;

    const introQuery = [
      'WITH CustomerLTV AS (',
      '  SELECT user_id, SUM(rev) as ltv',
      '  FROM analytics.orders',
      '  GROUP BY 1',
      ')',
      'SELECT *, PERCENT_RANK() OVER (',
      '  ORDER BY ltv DESC',
      ') as p_score',
      'FROM CustomerLTV',
      'WHERE ltv > 50000;'
    ].join('\n');

    let charIdx = 0;
    let isIntroFinished = false;

    function typeIntro() {
      if (charIdx < introQuery.length) {
        codeEl.textContent += introQuery.charAt(charIdx);
        charIdx++;
        const delay = introQuery.charAt(charIdx-1) === '\n' ? 300 : (Math.random() * 25 + 15);
        setTimeout(typeIntro, delay);
        terminalBody.scrollTop = terminalBody.scrollHeight;
      } else {
        finishIntro();
      }
    }

    function finishIntro() {
      isIntroFinished = true;
      promptLine.style.display = 'flex';
      hiddenInput.focus();
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    // ScrollTrigger to start typing
    ScrollTrigger.create({
      trigger: '.hero-bento',
      start: 'top 80%',
      onEnter: () => setTimeout(typeIntro, 800),
      once: true
    });

    // Interaction Listeners
    terminalBody.addEventListener('click', () => {
      if (isIntroFinished) hiddenInput.focus();
    });

    hiddenInput.addEventListener('input', () => {
      displayInput.textContent = hiddenInput.value;
    });

    hiddenInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = hiddenInput.value.trim().toLowerCase();
        if (cmd) processCommand(cmd);
        hiddenInput.value = '';
        displayInput.textContent = '';
      }
    });

    function addHistory(cmd, response) {
      const line = document.createElement('div');
      line.className = 'term-history-line';
      line.innerHTML = `<span class="term-prompt">mahesh@portfolio:~$</span> <span class="cmd">${cmd}</span><br><span class="res">${response}</span>`;
      historyEl.appendChild(line);
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function processCommand(cmd) {
      switch (cmd) {
        case 'help':
          addHistory(cmd, 'Available commands: [whoami, ls, clear, contact, help, skills]');
          break;
        case 'whoami':
          addHistory(cmd, 'Mahesh Mishra: Lead Analytics Professional. I turn raw data into strategic gold.');
          break;
        case 'ls':
          addHistory(cmd, '<span style="color:#58a6ff">resume.pdf</span>  <span style="color:#58a6ff">projects/</span>  <span style="color:#58a6ff">certifications.tx</span>');
          break;
        case 'clear':
          historyEl.innerHTML = '';
          codeEl.textContent = ''; // Also clear the intro for a fresh start
          break;
        case 'contact':
          addHistory(cmd, 'Initializing contact sequence...');
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          break;
        case 'skills':
          addHistory(cmd, 'Advanced SQL, Python (Pandas/Scikit), Tableau, Machine Learning, ETL Pipelines.');
          break;
        case 'sudo':
          addHistory(cmd, '<span style="color:#ff7b72">Error: Administrator privileges required. Nice try!</span>');
          break;
        case 'exit':
          addHistory(cmd, 'The matrix is everywhere, Neo. You cannot exit.');
          break;
        default:
          addHistory(cmd, `Command not found: ${cmd}. Type 'help' for options.`);
      }
    }
  })();

  /* ══════════════════════════════════════════════
     16b. PHOTO MAGNIFY TOOLTIP
  ══════════════════════════════════════════════ */
  (function () {
    if (!canUseFinePointer || prefersReducedMotion) return;
    const photo = document.querySelector('.id-photo');
    if (!photo) return;

    // Create floating tooltip img, appended to body to escape overflow:hidden
    const magnify = document.createElement('img');
    magnify.className = 'photo-magnify';
    magnify.src = photo.src;
    magnify.alt = 'Mahesh Mishra — Enlarged';
    document.body.appendChild(magnify);

    photo.addEventListener('mouseenter', () => {
      const rect = photo.getBoundingClientRect();
      // Position to the LEFT of the photo, vertically centered
      magnify.style.left = (rect.left - 320) + 'px';
      magnify.style.top  = (rect.top + rect.height / 2 - 150) + 'px';

      magnify.classList.add('visible');
    });

    photo.addEventListener('mouseleave', () => {
      magnify.classList.remove('visible');
    });
  })();


  /* ══════════════════════════════════════════════
     18. SPOTLIGHT HOVER EFFECT
  ══════════════════════════════════════════════ */
  (function () {
    if (!canUseFinePointer || prefersReducedMotion) return;
    const cards = document.querySelectorAll('.bento-card, .skill-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      });
    });
  })();

  /* ══════════════════════════════════════════════
     19. GLASSMORPHIC DEEP DIVE DRAWER
  ══════════════════════════════════════════════ */
  (function () {
    const drawer = document.getElementById('project-drawer');
    const overlay = document.getElementById('drawer-overlay');
    if (!drawer || !overlay) return;

    const closeBtn = document.getElementById('drawer-close');
    const drawerTitle = document.getElementById('drawer-title');
    const drawerImg = document.getElementById('drawer-img');
    const drawerTags = document.getElementById('drawer-tags');
    const drawerDesc = document.getElementById('drawer-desc');
    const drawerInsight = document.getElementById('drawer-insight');
    const drawerImpact = document.getElementById('drawer-impact');
    const drawerLink = document.getElementById('drawer-link');

    function openDrawer(card) {
      drawerTitle.textContent = card.querySelector('.pj-title')?.textContent || 'Project Review';
      
      const img = card.querySelector('.pj-img');
      if (img) {
        drawerImg.src = img.src;
        drawerImg.style.display = 'block';
      } else {
        drawerImg.style.display = 'none';
      }

      const tags = card.querySelector('.pj-tags');
      drawerTags.innerHTML = tags ? tags.innerHTML : '';

      drawerDesc.textContent = card.querySelector('.pj-desc')?.textContent || '';
      
      drawerInsight.textContent = card.querySelector('.pj-insight p')?.textContent || 'Analysis uncovered deep system optimizations leading to clear actionable deliverables without standard overhead execution parameters.';
      drawerImpact.textContent = card.querySelector('.pj-impact p')?.textContent || 'Drove systemic efficiencies through data infrastructure alignment generating substantial professional ROI.';

      const link = card.querySelector('.pj-link');
      if (link && link.href) {
        drawerLink.href = link.href;
        drawerLink.style.display = 'inline-block';
      } else {
        drawerLink.style.display = 'none';
      }

      drawer.classList.add('open');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('.pj-card').forEach(card => {
      card.style.cursor = 'pointer';
      
      // Stop underlying links
      const innerLinks = card.querySelectorAll('a');
      innerLinks.forEach(l => l.addEventListener('click', e => e.stopPropagation()));

      card.addEventListener('click', () => openDrawer(card));
    });

    closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);
  })();

  /* ══════════════════════════════════════════════
     20. THEME TOGGLE
  ══════════════════════════════════════════════ */
  (function() {
    const toggleBtn = document.getElementById('theme-toggle');
    if(!toggleBtn) return;
    
    // Check local storage or preference. Default is light mode.
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    toggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  })();


})();

/* ----------------------------------------------
   22. NARRATIVE WEAVE ENGINE (Storyteller)
---------------------------------------------- */
(function() { const hud = document.getElementById('hud-content'); const nodes = document.querySelectorAll('.milestone-node'); if (!hud) return;
const storyPoints = [
  { id: 'hero',     msg: '[SYS] INITIALIZING: Analyzing Data Strategist Profile...' },
  { id: 'about',    msg: '[SYS] RETRIEVING ARCHIVES: Biotech & Scientific Foundations detected.', node: 0 },
  { id: 'skills',   msg: '[SYS] CORE STACK: Advanced SQL, Python & ML Nodes synchronized.' },
  { id: 'projects', msg: '[SYS] ANALYZING IMPACT: Quantifiable business lift identified.', node: 1 },
  { id: 'learning', msg: '[SYS] DATA VECTOR: Advanced Big Data Architecture mapped.', node: 2 },
  { id: 'contact',  msg: '[SYS] UPLINK READY: Encryption secure. Awaiting communication.' }
];
storyPoints.forEach((point) => { const section = document.getElementById(point.id); if (!section) return; ScrollTrigger.create({ trigger: section, start: 'top 40%', end: 'bottom 40%', onEnter: () => updateNarrative(point), onEnterBack: () => updateNarrative(point) }); });
function updateNarrative(point) { gsap.to(hud, { opacity: 0, y: 5, duration: 0.2, onComplete: () => { hud.textContent = point.msg; gsap.to(hud, { opacity: 1, y: 0, duration: 0.3 }); } }); if (point.node !== undefined) { nodes.forEach((n, idx) => { if (idx === point.node) n.classList.add('active'); else n.classList.remove('active'); }); } else { nodes.forEach(n => n.classList.remove('active')); } }
})();
