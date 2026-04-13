/**
 * storyline.js — Immersive Scroll Synchronization
 * 1. The Golden Thread (SVG connector)
 * 2. Three.js camera/scene morphing based on scroll
 */
(function () {
  'use strict';
  if (typeof gsap === 'undefined') return;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCompactScreen = window.innerWidth < 900;

  /* ══════════════════════════════════════════════
     1. THREE.JS SCROLL SYNC
     Morphes the background based on page progress
  ══════════════════════════════════════════════ */
  function initThreeSync() {
    if (prefersReducedMotion || isCompactScreen) return;
    const camera = window._bgCamera;
    const scene  = window._bgScene;
    if (!camera || !scene) {
      // Retry if background isn't ready
      setTimeout(initThreeSync, 100);
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
      }
    });

    // Hero -> About (Section 1)
    tl.to(camera.position, { z: 400, duration: 1 }, 0);
    tl.to(scene.rotation, { y: Math.PI * 0.1, duration: 1 }, 0);

    // About -> Skills (Section 2)
    tl.to(camera.position, { z: 500, x: -50, y: 50, duration: 1 }, 1);
    tl.to(scene.rotation, { y: -Math.PI * 0.1, duration: 1 }, 1);

    // Skills -> Projects (Section 3)
    tl.to(camera.position, { z: 800, y: -50, duration: 1 }, 2);
    tl.to(scene.rotation, { x: -Math.PI * 0.05, duration: 1 }, 2);

    // Projects -> End (Section 4)
    tl.to(camera.position, { z: 580, x: 0, y: 0, duration: 1 }, 3);
    tl.to(scene.rotation, { y: 0, x: 0, duration: 1 }, 3);
  }

  /* ══════════════════════════════════════════════
     2. THE GOLDEN THREAD & DATA PIPELINE
     Dynamic SVG line connecting sections
  ══════════════════════════════════════════════ */
  function initGoldenThread() {
    if (prefersReducedMotion || isCompactScreen) return;
    const threadPath = document.getElementById('golden-thread-path');
    const dataPacket = document.getElementById('data-packet');
    if (!threadPath) return;

    const pathLength = threadPath.getTotalLength();
    
    // Draw the main subtle background thread
    gsap.set(threadPath, { 
      strokeDasharray: pathLength, 
      strokeDashoffset: pathLength 
    });

    gsap.to(threadPath, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
      }
    });

    // Draw the glowing data packet acting as a payload
    if (dataPacket) {
      gsap.set(dataPacket, {
        strokeDasharray: `60 ${pathLength}`,
        strokeDashoffset: pathLength
      });
      
      gsap.to(dataPacket, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        }
      });
    }
  }

  window.addEventListener('load', () => {
    initThreeSync();
    initGoldenThread();
  });

})();
