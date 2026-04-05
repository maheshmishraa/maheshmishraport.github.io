/**
 * animations.js — anime.js powered effects
 *
 * 1. Page transition morph  — smooth crossfade + scale morph between pages
 * 2. Career timeline draw-in — spines draw, badges spring-pop on About enter
 * 3. Project card ripple    — water-drop ripple from cursor on hover
 * 4. Skill tags wave        — staggered wave when About section activates
 * 5. Nav active pill        — accent bar slides smoothly between nav items
 */
(function () {
  'use strict';

  if (typeof anime === 'undefined') return;

  /* ══════════════════════════════════════════════
     1. PAGE TRANSITION — smooth morph crossfade
  ══════════════════════════════════════════════ */
  let morphing = false;

  window.doPageWipe = function (current, next) {
    if (morphing) {
      if (current) current.classList.remove('active', 'page-out', 'morph-active');
      next.classList.add('active');
      next.scrollTop = 0;
      return;
    }

    morphing = true;

    // Suppress CSS transitions on both pages so anime.js has full control
    if (current) current.classList.add('morph-active');
    next.classList.add('morph-active');

    // Bring next page into the stack but invisible
    next.classList.add('active');
    next.scrollTop = 0;
    anime.set(next, { opacity: 0, scale: 1.03 });

    // Outgoing — fade out + shrink very slightly
    if (current) {
      anime({
        targets:  current,
        opacity:  [1, 0],
        scale:    [1, 0.97],
        duration: 260,
        easing:   'easeInCubic',
        complete() {
          current.classList.remove('active', 'page-out', 'morph-active');
          anime.set(current, { opacity: '', scale: '' });
        },
      });
    }

    // Incoming — fade in + settle to natural scale, slightly delayed for overlap feel
    anime({
      targets:  next,
      opacity:  [0, 1],
      scale:    [1.03, 1],
      duration: 480,
      delay:    60,
      easing:   'easeOutExpo',
      complete() {
        next.classList.remove('morph-active');
        anime.set(next, { opacity: '', scale: '' });
        morphing = false;
      },
    });
  };

  /* ══════════════════════════════════════════════
     2. CAREER TIMELINE DRAW-IN
  ══════════════════════════════════════════════ */
  let timelineAnimated = false;

  function animateTimeline() {
    if (timelineAnimated) return;
    timelineAnimated = true;

    const spines = document.querySelectorAll('.tl-spine');
    const badges = document.querySelectorAll('.tl-badge');

    // Set initial states
    anime.set(spines, { scaleY: 0 });
    anime.set(badges, { scale: 0, opacity: 0 });

    // Badges pop in with spring, staggered
    anime({
      targets:   badges,
      scale:     [0, 1],
      opacity:   [0, 1],
      duration:  700,
      delay:     anime.stagger(90, { start: 80 }),
      easing:    'spring(1, 80, 10, 0)',
    });

    // Spines draw downward after each badge
    anime({
      targets:   spines,
      scaleY:    [0, 1],
      duration:  420,
      delay:     anime.stagger(90, { start: 140 }),
      easing:    'easeOutCubic',
    });
  }

  /* ══════════════════════════════════════════════
     3. PROJECT CARD RIPPLE
  ══════════════════════════════════════════════ */
  document.querySelectorAll('.pj-card').forEach(card => {
    card.addEventListener('mousedown', function (e) {
      const rect   = card.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height) * 2.2;
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;

      const ripple = document.createElement('div');
      ripple.className = 'pj-ripple';
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
      card.appendChild(ripple);

      anime({
        targets:  ripple,
        scale:    [0, 1],
        opacity:  [0.55, 0],
        duration: 680,
        easing:   'easeOutQuart',
        complete() { ripple.remove(); },
      });
    });
  });

  /* ══════════════════════════════════════════════
     4. SKILL TAGS WAVE (About section enter)
  ══════════════════════════════════════════════ */
  let tagsAnimated = false;

  function animateTags() {
    if (tagsAnimated) return;
    tagsAnimated = true;

    const tags = document.querySelectorAll('.about-info .tool-tag');
    anime.set(tags, { opacity: 0, translateY: 14 });

    anime({
      targets:     tags,
      opacity:     [0, 1],
      translateY:  [14, 0],
      duration:    480,
      delay:       anime.stagger(45, { grid: [5, Math.ceil(tags.length / 5)], from: 'first' }),
      easing:      'easeOutBack',
    });
  }

  /* ══════════════════════════════════════════════
     5. NAV ACTIVE PILL
  ══════════════════════════════════════════════ */
  const pill    = document.getElementById('nav-pill');
  const navUl   = document.getElementById('nav-links-ul');

  function movePill(targetPage, animate) {
    if (!pill || !navUl) return;

    const activeLink = navUl.querySelector(`.nav-item[data-page="${targetPage}"]`);
    if (!activeLink) {
      // No matching nav item (e.g. hero) — hide pill
      anime({ targets: pill, width: 0, duration: 200, easing: 'easeOutQuad' });
      return;
    }

    const ulRect   = navUl.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    const left     = linkRect.left - ulRect.left;
    const width    = linkRect.width;

    if (!animate) {
      anime.set(pill, { left, width });
      return;
    }

    anime({
      targets:  pill,
      left:     left,
      width:    width,
      duration: 380,
      easing:   'easeOutExpo',
    });
  }

  // Initialise pill on load (hero page, no matching nav item → hidden)
  window.addEventListener('load', () => movePill('hero', false));

  /* ══════════════════════════════════════════════
     PAGE SWITCH EVENT — wire everything together
  ══════════════════════════════════════════════ */
  document.addEventListener('pageswitch', e => {
    const { to } = e.detail;

    // Move nav pill
    movePill(to, true);

    // Section-specific effects
    if (to === 'about') {
      // Small delay so the page is visible before animating
      setTimeout(animateTimeline, 420);
      setTimeout(animateTags,    420);
    }

    // Reset tag/timeline flags when leaving About (so they re-animate on return)
    if (e.detail.from === 'about') {
      tagsAnimated     = false;
      timelineAnimated = false;
    }
  });

})();
