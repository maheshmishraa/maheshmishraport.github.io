/**
 * scroll-effects.js — Immersive infinite-scroll experience
 *
 * 1.  Scroll progress bar
 * 2.  Hero parallax exit  (left/right at different speeds)
 * 3.  Section slide-up    (scrub-linked — feels physical)
 * 4.  Section header word-drop reveal
 * 5.  Section tag slide-in from left
 * 6.  Hero domain cards   (continuous floating bob)
 * 7.  Blog / Skill / KPI card entrances with back-ease
 * 8.  Bio paragraphs      (staggered slide from left)
 * 9.  Contact split entrance (left panel ← | form panel →)
 * 10. Certificate cards   (stagger + slight rotation)
 * 11. Domain stage dramatic entrance
 * 12. Skill section header counter glow
 */
(function () {
  'use strict';
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ══════════════════════════════════════════════
     1. SCROLL PROGRESS BAR
  ══════════════════════════════════════════════ */
  const bar = document.getElementById('scroll-progress');
  if (bar) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const total    = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${total > 0 ? scrolled / total : 0})`;
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════
     2. HERO PARALLAX EXIT
     hero-left  rises faster → feels like it's rushing away
     hero-right drifts slower → depth illusion
  ══════════════════════════════════════════════ */
  const heroEl = document.getElementById('hero');
  if (heroEl && !prefersReducedMotion) {
    // Left column — fast upward drift + fade
    gsap.to('.hero-left', {
      y: -90,
      opacity: 0.25,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
      },
    });

    // Right column — slower, slight scale shrink
    gsap.to('.hero-right', {
      y: -36,
      opacity: 0.45,
      scale: 0.96,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.8,
      },
    });

  }

  /* ══════════════════════════════════════════════
     3. SECTION SLIDE-UP (scrub-linked)
     Each section rises smoothly into view as you
     scroll — purely y-based so inner-element
     opacity animations don't conflict.
  ══════════════════════════════════════════════ */
  document.querySelectorAll('section[id]:not(#hero)').forEach(section => {
    const inner = section.querySelector('.container') || section;
    gsap.fromTo(inner,
      { y: prefersReducedMotion ? 0 : 30, opacity: prefersReducedMotion ? 1 : 0 },
      {
        y: 0,
        opacity: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 88%',
          toggleActions: 'play none none none',
          once: true,
        },
      }
    );
  });

  /* ══════════════════════════════════════════════
     4. SECTION HEADER — word-by-word drop reveal
     Uses a DOM-safe splitter that preserves any
     inner <span> elements (e.g. .text-gold)
  ══════════════════════════════════════════════ */
  function splitH2(h2) {
    const nodes = Array.from(h2.childNodes);
    const words = [];

    h2.innerHTML = '';

    nodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split(/(\s+)/).forEach(chunk => {
          if (!chunk) return;
          if (/^\s+$/.test(chunk)) {
            h2.appendChild(document.createTextNode(chunk));
          } else {
            const wrap  = document.createElement('span');
            wrap.className = 'word-wrap';
            const inner = document.createElement('span');
            inner.className = 'word';
            inner.textContent = chunk;
            wrap.appendChild(inner);
            h2.appendChild(wrap);
            words.push(inner);
          }
        });
      } else {
        // Preserve element nodes (e.g. <span class="text-gold">)
        const wrap  = document.createElement('span');
        wrap.className = 'word-wrap';
        const inner = document.createElement('span');
        inner.className = 'word';
        inner.appendChild(node.cloneNode(true));
        wrap.appendChild(inner);
        h2.appendChild(wrap);
        words.push(inner);
      }
    });

    return words;
  }

  document.querySelectorAll('.section-header h2').forEach(h2 => {
    const words = splitH2(h2);
    if (!words.length) return;

    gsap.fromTo(words,
      { y: '115%', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        duration: 0.85,
        stagger: 0.07,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: h2,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });


  /* ══════════════════════════════════════════════
     5. SECTION TAG (// PROFILE, // SKILLS …)
        slides in from the left like a terminal prompt
  ══════════════════════════════════════════════ */
  document.querySelectorAll('.section-tag').forEach(tag => {
    gsap.fromTo(tag,
      { x: -36, opacity: 0 },
      {
        x: 0,
        opacity: 0.85,
        duration: 0.65,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: tag,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  /* ══════════════════════════════════════════════
     6. HERO DOMAIN CARDS — continuous floating bob
        Each card bobs at a different speed + phase
        so the whole group feels alive
  ══════════════════════════════════════════════ */
  document.querySelectorAll('.hd-card').forEach((card, i) => {
    gsap.to(card, {
      y:        i % 2 === 0 ? -14 : -9,
      x:        i % 3 === 0 ?   4 : -4,
      rotation: i % 2 === 0 ?  0.7 : -0.7,
      duration: 2.4 + i * 0.35,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: i * 0.55,
    });
  });

  /* ══════════════════════════════════════════════
     7a. BLOG CARDS — scale + opacity cascade
  ══════════════════════════════════════════════ */
  gsap.utils.toArray('.blog-card').forEach((card, i) => {
    gsap.fromTo(card,
      { y: 55, opacity: 0, scale: 0.93 },
      {
        y: 0, opacity: 1, scale: 1,
        duration: 0.72,
        delay: (i % 3) * 0.13,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 93%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  /* ══════════════════════════════════════════════
     7b. SKILL CARDS — back-ease spring pop
  ══════════════════════════════════════════════ */
  gsap.utils.toArray('.skill-card').forEach((card, i) => {
    gsap.fromTo(card,
      { y: 52, opacity: 0, scale: 0.88 },
      {
        y: 0, opacity: 1, scale: 1,
        duration: 0.65,
        delay: (i % 4) * 0.09,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: card,
          start: 'top 93%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  /* ══════════════════════════════════════════════
     7c. KPI TILES — pop up with bounce
  ══════════════════════════════════════════════ */
  gsap.utils.toArray('.kpi-tile').forEach((tile, i) => {
    gsap.fromTo(tile,
      { y: 44, opacity: 0, scale: 0.85 },
      {
        y: 0, opacity: 1, scale: 1,
        duration: 0.58,
        delay: (i % 4) * 0.08,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: tile,
          start: 'top 91%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  /* ══════════════════════════════════════════════
     8. BIO PARAGRAPHS — slide in from left + fade
  ══════════════════════════════════════════════ */
  gsap.utils.toArray('.bio-p').forEach((el, i) => {
    gsap.fromTo(el,
      { x: -28, opacity: 0 },
      {
        x: 0, opacity: 1,
        duration: 0.75,
        delay: i * 0.13,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 89%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  gsap.fromTo('.bio-facts',
    { y: 24, opacity: 0 },
    {
      y: 0, opacity: 1,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.bio-facts',
        start: 'top 91%',
        toggleActions: 'play none none none',
      },
    }
  );

  /* ══════════════════════════════════════════════
     9. CONTACT — split entrance (← info | form →)
  ══════════════════════════════════════════════ */
  const cgrid = document.querySelector('.contact-grid');
  if (cgrid) {
    const children = Array.from(cgrid.children);
    if (children[0]) {
      gsap.fromTo(children[0],
        { x: -60, opacity: 0 },
        {
          x: 0, opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cgrid,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
    if (children[1]) {
      gsap.fromTo(children[1],
        { x: 60, opacity: 0 },
        {
          x: 0, opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cgrid,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }

  /* ══════════════════════════════════════════════
     10. CERTIFICATE CARDS — stagger + slight rotation
  ══════════════════════════════════════════════ */
  gsap.utils.toArray('.cert-card').forEach((card, i) => {
    gsap.fromTo(card,
      {
        y: 55,
        opacity: 0,
        scale: 0.90,
        rotation: i % 2 === 0 ? 2.5 : -2.5,
      },
      {
        y: 0, opacity: 1, scale: 1, rotation: 0,
        duration: 0.70,
        delay: (i % 4) * 0.10,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: card,
          start: 'top 93%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  /* ══════════════════════════════════════════════
     11. DOMAIN STAGE — scale + fade in
  ══════════════════════════════════════════════ */
  gsap.fromTo('.domain-stage',
    { opacity: 0, y: 44, scale: 0.96 },
    {
      opacity: 1, y: 0, scale: 1,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.domain-stage',
        start: 'top 86%',
        toggleActions: 'play none none none',
      },
    }
  );

  gsap.fromTo('.domain-tabs',
    { x: -50, opacity: 0 },
    {
      x: 0, opacity: 1,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.domain-tabs',
        start: 'top 87%',
        toggleActions: 'play none none none',
      },
    }
  );

  /* ══════════════════════════════════════════════
     12. ABOUT-CONTACT PILLS — pop up with spring
  ══════════════════════════════════════════════ */
  gsap.utils.toArray('.contact-pill').forEach((pill, i) => {
    gsap.fromTo(pill,
      { y: 30, opacity: 0, scale: 0.88 },
      {
        y: 0, opacity: 1, scale: 1,
        duration: 0.6,
        delay: i * 0.12,
        ease: 'back.out(1.6)',
        scrollTrigger: {
          trigger: pill,
          start: 'top 93%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  /* ══════════════════════════════════════════════
     13. LEARNING ACCORDIONS — stagger reveal
  ══════════════════════════════════════════════ */
  gsap.utils.toArray('.learn-card, .accord-item').forEach((el, i) => {
    gsap.fromTo(el,
      { y: 35, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.6,
        delay: (i % 5) * 0.07,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 93%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  /* ══════════════════════════════════════════════
     14. GLOBAL BENTO GRIDS & PROJECT CARDS (Stagger)
  ══════════════════════════════════════════════ */
  gsap.utils.toArray('.bento-card').forEach((card, i) => {
    gsap.fromTo(card,
      { y: 40, opacity: 0, scale: 0.95 },
      {
        y: 0, opacity: 1, scale: 1,
        duration: 0.65,
        delay: (i % 6) * 0.1,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: card,
          start: 'top 92%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.fromTo(card,
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.7,
        delay: (i % 3) * 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

})();
