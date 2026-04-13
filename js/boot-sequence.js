/**
 * boot-sequence.js — Biometric System Diagnostics
 * High-speed terminal sequence with Session Memory.
 */
(function () {
  'use strict';

  const preloader = document.getElementById('diagnostics-preloader');
  const loaderContainer = preloader?.querySelector('.terminal-loader');
  if (!preloader || !loaderContainer) return;

  // SESSION MEMORY CHECK
  const SHOULD_SKIP = sessionStorage.getItem('MAHESH_BOOT_COMPLETE');

  if (SHOULD_SKIP) {
    preloader.style.display = 'none';
    preloader.style.visibility = 'hidden';
    preloader.style.pointerEvents = 'none';
    preloader.style.opacity = '0';
    window.dispatchEvent(new CustomEvent('bootComplete', { detail: { instant: true } }));
    return;
  }

  const logs = [
    { text: '[SYS] INITIALIZING_NEURAL_LINK...', color: 'terminal-green' },
    { text: '[MEM] SYNCING_MAHESH_DATA_REGISTRY...', color: '' },
    { text: '[SEC] BYPASSING_FIREWALL... [OK]', color: 'terminal-green' },
    { text: '[UI] RENDERING_GLASSPHORMIC_LAYER...', color: '' },
    { text: '[AUTH] IDENTITY_VERIFIED: MAHESH_MISHRA', color: 'terminal-gold' },
    { text: '[BOOT] LOADING_EXECUTIVE_V2_OS...', color: 'terminal-green' },
  ];

  // Force page to top so it doesn't reveal middle on refresh
  window.scrollTo(0, 0);

  let currentLine = 0;

  function typeLog() {
    if (currentLine >= logs.length) {
      setTimeout(finishBoot, 400); // Shorter final delay
      return;
    }

    const { text, color } = logs[currentLine];
    const line = document.createElement('div');
    line.className = `loader-line ${color}`;
    line.innerHTML = `<span class="prompt">&gt;</span> <span class="txt"></span><span class="cursor">_</span>`;
    loaderContainer.appendChild(line);

    const txtSpan = line.querySelector('.txt');
    const cursor = line.querySelector('.cursor');
    
    let charIdx = 0;
    const speed = 15; // FASTER: 15ms instead of 25ms

    function typeChar() {
      if (charIdx < text.length) {
        txtSpan.textContent += text.charAt(charIdx);
        charIdx++;
        setTimeout(typeChar, speed);
      } else {
        cursor.remove();
        currentLine++;
        setTimeout(typeLog, 80); // Shorter line delay
      }
    }

    typeChar();
  }

  function finishBoot() {
    // Record boot completion for session
    sessionStorage.setItem('MAHESH_BOOT_COMPLETE', 'true');

    // Reveal site
    preloader.classList.add('slide-up');

    // Dispatch custom event for app.js to trigger intro animations
    window.dispatchEvent(new CustomEvent('bootComplete', { detail: { instant: false } }));

    setTimeout(() => {
      preloader.style.display = 'none';
      preloader.style.visibility = 'hidden';
      preloader.style.pointerEvents = 'none';
    }, 1000);
  }

  // Start the sequence
  if (preloader) {
    setTimeout(typeLog, 150);
  }
})();
