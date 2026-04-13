/**
 * background.js — Refined Three.js Network Background
 * Subtle, professional — navy/gold/steel-blue palette.
 * Nodes float gently; lines connect nearby ones.
 * Mouse parallax on camera.
 */
(function () {
  'use strict';

  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCompactScreen = window.innerWidth < 900;

  /* ── Scene ───────────────────────────────────────────── */
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 2000);
  
  window._bgScene  = scene;
  window._bgCamera = camera;
  camera.position.z = 580;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isCompactScreen ? 1 : 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);

  /* ── Config ──────────────────────────────────────────── */
  const COUNT        = prefersReducedMotion ? 18 : (isCompactScreen ? 28 : 42);
  const SPREAD       = { x: 900, y: 700, z: 400 };
  const CONNECT_DIST = prefersReducedMotion ? 130 : 160;
  const MAX_PAIRS    = prefersReducedMotion ? 80 : (isCompactScreen ? 180 : 260);

  // Experimental palette: Executive Data — deep navy/indigo/gold-accent
  const COLORS = [0x4338CA, 0x6366F1, 0x4F46E5, 0x10B981];

  /* ── Nodes ───────────────────────────────────────────── */
  const meshes = [], vels = [];
  const geo    = new THREE.SphereGeometry(1.2, 6, 6);

  for (let i = 0; i < COUNT; i++) {
    const mat  = new THREE.MeshBasicMaterial({
      color:       COLORS[i % COLORS.length],
      transparent: true,
      opacity:     0.4 + Math.random() * 0.4,
    });
    const m = new THREE.Mesh(geo, mat);
    const ox = (Math.random() - 0.5) * SPREAD.x;
    const oy = (Math.random() - 0.5) * SPREAD.y;
    const oz = (Math.random() - 0.5) * SPREAD.z;
    m.position.set(ox, oy, oz);
    vels.push({
      x: 0, y: 0, z: 0,
      ox: ox, oy: oy, oz: oz,
      seed: Math.random() * Math.PI * 2
    });
    scene.add(m);
    meshes.push(m);
  }

  /* ── Line buffer ─────────────────────────────────────── */
  const linePos  = new Float32Array(MAX_PAIRS * 6);
  const lineGeo  = new THREE.BufferGeometry();
  const posAttr  = new THREE.BufferAttribute(linePos, 3);
  posAttr.setUsage(THREE.DynamicDrawUsage);
  lineGeo.setAttribute('position', posAttr);
  lineGeo.setDrawRange(0, 0);

  const lineMat = new THREE.LineBasicMaterial({
    color: 0x6366F1,   // deep indigo lines
    transparent: true,
    opacity: 0.1,
  });
  scene.add(new THREE.LineSegments(lineGeo, lineMat));

  /* ── Mouse & Physics ─────────────────────────────────── */
  let tx = 0, ty = 0;
  let mouseWorld = { x: 0, y: 0, active: false };
  let scrollVelocity = 0;
  let lastScrollY = window.scrollY;
  
  if (!prefersReducedMotion) document.addEventListener('mousemove', e => {
    tx =  (e.clientX / window.innerWidth  - 0.5) * 60;
    ty = -(e.clientY / window.innerHeight - 0.5) * 45;
    
    // Calculate world position
    const vM = new THREE.Vector3(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1,
      0.5
    );
    vM.unproject(camera);
    vM.sub(camera.position).normalize();
    const distance = -camera.position.z / vM.z;
    const pos = camera.position.clone().add(vM.multiplyScalar(distance));
    
    mouseWorld.x = pos.x;
    mouseWorld.y = pos.y;
    mouseWorld.active = true;
  });

  document.addEventListener('mouseleave', () => mouseWorld.active = false);

  window.addEventListener('scroll', () => {
    const cur = window.scrollY;
    scrollVelocity = Math.min(Math.abs(cur - lastScrollY) * 0.08, 8);
    lastScrollY = cur;
  }, { passive: true });

  /* ── Animation ───────────────────────────────────────── */
  let frame = 0;
  let isDocumentHidden = false;
  document.addEventListener('visibilitychange', () => {
    isDocumentHidden = document.hidden;
  });

  (function animate() {
    requestAnimationFrame(animate);
    if (isDocumentHidden) return;
    frame++;

    const sV = scrollVelocity;
    scrollVelocity *= 0.94; // Decay

    for (let i = 0; i < COUNT; i++) {
      const m = meshes[i], v = vels[i];
      
      const t = frame * 0.008;
      
      // 1. Calculate target drifting position (orbiting closely around origin)
      const targetX = v.ox + Math.sin(t + v.seed) * 30;
      const targetY = v.oy + Math.cos(t + v.seed * 2) * 30;
      const targetZ = v.oz + Math.sin(t * 0.5 + v.seed) * 30;
      
      // 2. Spring force pulling node softly to its target
      const springK = 0.015;
      v.x += (targetX - m.position.x) * springK;
      v.y += (targetY - m.position.y) * springK;
      v.z += (targetZ - m.position.z) * springK;
      
      // Affect by scroll
      if (!prefersReducedMotion && sV > 0.1) {
        v.y += (Math.random() - 0.5) * sV;
        v.z += (Math.random() - 0.5) * sV;
      }
      
      // 3. Swarm Physics - Repel from mouse violently
      if (!prefersReducedMotion && mouseWorld.active) {
        const dx = m.position.x - mouseWorld.x;
        const dy = m.position.y - mouseWorld.y;
        const distSq = dx*dx + dy*dy;
        const radiusSq = 220 * 220; // Repel radius
        if (distSq < radiusSq && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const force = (220 - dist) / 220; // 0 to 1 scaling
          v.x += (dx / dist) * force * 5.0;
          v.y += (dy / dist) * force * 5.0;
        }
      }
      
      // 4. Apply velocity + damping (friction)
      v.x *= 0.85; 
      v.y *= 0.85; 
      v.z *= 0.85; 

      m.position.x += v.x;
      m.position.y += v.y;
      m.position.z += v.z;
    }

    if (frame % 3 === 0) {
      let idx = 0;
      outer: for (let i = 0; i < COUNT; i++) {
        const pi = meshes[i].position;
        for (let j = i + 1; j < COUNT; j++) {
          if (idx >= MAX_PAIRS) break outer;
          const pj = meshes[j].position;
          const d2 = (pi.x-pj.x)**2 + (pi.y-pj.y)**2 + (pi.z-pj.z)**2;
          if (d2 < CONNECT_DIST * CONNECT_DIST) {
            const b = idx * 6;
            linePos[b]=pi.x; linePos[b+1]=pi.y; linePos[b+2]=pi.z;
            linePos[b+3]=pj.x; linePos[b+4]=pj.y; linePos[b+5]=pj.z;
            idx++;
          }
        }
      }
      lineGeo.setDrawRange(0, idx * 2);
      posAttr.needsUpdate = true;
    }

    camera.position.x += (tx - camera.position.x) * (prefersReducedMotion ? 0.012 : 0.02);
    camera.position.y += (ty - camera.position.y) * (prefersReducedMotion ? 0.012 : 0.02);
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  })();

  /* ── Resize ──────────────────────────────────────────── */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
