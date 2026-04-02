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

  /* ── Scene ───────────────────────────────────────────── */
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.z = 580;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  /* ── Config ──────────────────────────────────────────── */
  const COUNT        = 70;
  const SPREAD       = { x: 900, y: 700, z: 400 };
  const CONNECT_DIST = 170;
  const MAX_PAIRS    = 600;

  // Professional palette: navy/gold/steel-blue — very muted
  const COLORS = [0x2a4a7f, 0x8a6200, 0x1a5565, 0x3b4f7a];

  /* ── Nodes ───────────────────────────────────────────── */
  const meshes = [], vels = [];
  const geo    = new THREE.SphereGeometry(1.4, 5, 5);

  for (let i = 0; i < COUNT; i++) {
    const mat  = new THREE.MeshBasicMaterial({
      color:       COLORS[i % COLORS.length],
      transparent: true,
      opacity:     0.5 + Math.random() * 0.4,
    });
    const m = new THREE.Mesh(geo, mat);
    m.position.set(
      (Math.random() - 0.5) * SPREAD.x,
      (Math.random() - 0.5) * SPREAD.y,
      (Math.random() - 0.5) * SPREAD.z
    );
    vels.push({
      x: (Math.random() - 0.5) * 0.28,
      y: (Math.random() - 0.5) * 0.28,
      z: (Math.random() - 0.5) * 0.15,
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
    color: 0x1a3060,   // dark navy lines
    transparent: true,
    opacity: 0.18,
  });
  scene.add(new THREE.LineSegments(lineGeo, lineMat));

  /* ── Mouse ───────────────────────────────────────────── */
  let tx = 0, ty = 0;
  document.addEventListener('mousemove', e => {
    tx =  (e.clientX / window.innerWidth  - 0.5) * 55;
    ty = -(e.clientY / window.innerHeight - 0.5) * 40;
  });

  /* ── Animation ───────────────────────────────────────── */
  let frame = 0;

  (function animate() {
    requestAnimationFrame(animate);
    frame++;

    for (let i = 0; i < COUNT; i++) {
      const m = meshes[i], v = vels[i];
      m.position.x += v.x;
      m.position.y += v.y;
      m.position.z += v.z;
      if (Math.abs(m.position.x) > SPREAD.x * 0.5) v.x *= -1;
      if (Math.abs(m.position.y) > SPREAD.y * 0.5) v.y *= -1;
      if (Math.abs(m.position.z) > SPREAD.z * 0.5) v.z *= -1;
    }

    if (frame % 2 === 0) {
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

    camera.position.x += (tx - camera.position.x) * 0.022;
    camera.position.y += (ty - camera.position.y) * 0.022;
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
