'use client';

import { useEffect, useRef } from 'react';

// Animated hero background, one scene per career track:
//   Java  — a "class graph": UML-style class boxes joined by dashed
//           connectors, with small "call" packets travelling between them.
//   AI    — a "neural net": a 4-7-7-5-2 network with signal pulses firing
//           layer to layer.
// Everything runs inside one effect (nothing during render, so SSR and
// hydration see only an empty canvas). Static geometry is pre-rendered to an
// offscreen canvas; each frame draws that plus the moving parts, capped at
// ~30fps, paused offscreen / in hidden tabs, one static frame under reduced
// motion.

const SEEDS = { 'java-developer': 7, 'ai-engineer': 11 };
const FRAME_MS = 30; // skip frames closer than this -> ~30fps on 60/120Hz
const STATIC_T = 1.5; // reduced motion: the single frame drawn

function mulberry32(seed) {
  let a = seed >>> 0;
  return function rng() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Integer hash (murmur3-style finaliser) so neighbouring grid cells get
// uncorrelated seeds.
function cellSeed(seed, r, c) {
  let h = Math.imul(seed, 0x9e3779b1) ^ Math.imul(r + 1, 0x85ebca6b) ^ Math.imul(c + 1, 0xc2b2ae35);
  h ^= h >>> 16;
  h = Math.imul(h, 0x7feb352d);
  h ^= h >>> 15;
  h = Math.imul(h, 0x846ca68b);
  h ^= h >>> 16;
  return h >>> 0;
}

const easeInOut =(k) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
const pick = (arr) => arr[(Math.random() * arr.length) | 0];

function readColors(track) {
  const cs = getComputedStyle(document.documentElement);
  const get = (name, fallback) => cs.getPropertyValue(name).trim() || fallback;
  // The track's own hue rather than --accent: identical at rest, and correct
  // while the old and new scenes cross-fade (--accent is mid-transition then).
  const accent = get(track === 'ai-engineer' ? '--ai' : '--java', get('--accent', '#2f5d3f'));
  return { ink: get('--ink', '#1d1a13'), paper2: get('--paper2', '#fffcf5'), accent };
}

// Polyline helpers (connector paths are 2-3 point orthogonal routes).
function measure(pts) {
  const lens = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    lens.push(l);
    total += l;
  }
  return { pts, lens, total };
}

function pointAt(path, k) {
  let d = k * path.total;
  for (let i = 0; i < path.lens.length; i++) {
    const l = path.lens[i];
    if (d <= l || i === path.lens.length - 1) {
      const f = l ? Math.min(d / l, 1) : 0;
      const [x0, y0] = path.pts[i];
      const [x1, y1] = path.pts[i + 1];
      return [x0 + (x1 - x0) * f, y0 + (y1 - y0) * f];
    }
    d -= l;
  }
  return path.pts[path.pts.length - 1];
}

function tracePath(ctx, pts) {
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
}

/* ---------------- Java: class graph ---------------- */

function createClassGraph(w, h, seed) {
  const CW = 120;
  const CH = 90;
  const BW = 34;
  const BH = 20;
  const boxes = [];

  // Each cell gets its own seeded stream, so widening the hero only adds
  // columns; existing boxes never move.
  const cols = Math.ceil(w / CW);
  const rows = Math.ceil(h / CH);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const rng = mulberry32(cellSeed(seed, r, c));
      if (rng() >= 0.45) continue;
      // Partial edge cells keep their box, nudged back inside the canvas.
      const x = Math.min(Math.round(c * CW + 14 + rng() * (CW - BW - 28)), w - BW - 8);
      const y = Math.min(Math.round(r * CH + 12 + rng() * (CH - BH - 24)), h - BH - 8);
      if (x < 4 || y < 4) continue;
      if (boxes.some((b) => Math.abs(b.x - x) < BW + 8 && Math.abs(b.y - y) < BH + 8)) continue;
      boxes.push({
        x,
        y,
        links: rng() < 0.5 ? 1 : 2,
        fields: [8 + Math.round(rng() * 16), rng() < 0.6 ? 6 + Math.round(rng() * 18) : 0],
        flash: -9,
      });
    }
  }

  // Orthogonal L-shaped connector from a to b (b lies to the right or below).
  function route(a, b) {
    const bcx = b.x + BW / 2;
    const bcy = b.y + BH / 2;
    if (b.x >= a.x + BW + 10) {
      const sx = a.x + BW;
      const sy = a.y + BH / 2;
      if (sy >= b.y + 3 && sy <= b.y + BH - 3) return [[sx, sy], [b.x, sy]];
      return [[sx, sy], [bcx, sy], [bcx, bcy > sy ? b.y : b.y + BH]];
    }
    const sx = a.x + BW / 2;
    const sy = a.y + BH;
    if (sx >= b.x + 3 && sx <= b.x + BW - 3) return [[sx, sy], [sx, b.y]];
    return [[sx, sy], [sx, bcy], [bcx > sx ? b.x : b.x + BW, bcy]];
  }

  const edges = [];
  const seen = new Set();
  boxes.forEach((a, ai) => {
    const near = boxes
      .map((b, bi) => ({ b, bi, d: Math.hypot(b.x - a.x, b.y - a.y) }))
      .filter(({ b, d }) => d < 240 && (b.x >= a.x + BW + 10 || b.y >= a.y + BH + 10))
      .sort((p, q) => p.d - q.d)
      .slice(0, a.links);
    near.forEach(({ b, bi }) => {
      const key = ai < bi ? ai + ':' + bi : bi + ':' + ai;
      if (seen.has(key)) return;
      seen.add(key);
      // Snap to the pixel grid (+0.5) so 1px strokes stay crisp.
      const pts = route(a, b).map(([x, y]) => [Math.round(x) + 0.5, Math.round(y) + 0.5]);
      edges.push({ ...measure(pts), from: a, to: b });
    });
  });

  const connectors = new Path2D();
  edges.forEach((e) => {
    connectors.moveTo(e.pts[0][0], e.pts[0][1]);
    for (let i = 1; i < e.pts.length; i++) connectors.lineTo(e.pts[i][0], e.pts[i][1]);
  });

  let packets = [];
  let nextSpawn = 0.6;

  return {
    paintBase(bctx, c) {
      bctx.lineWidth = 1;
      boxes.forEach((b) => {
        bctx.globalAlpha = 1;
        bctx.fillStyle = c.paper2;
        bctx.fillRect(b.x, b.y, BW, BH);
        bctx.strokeStyle = c.ink;
        bctx.globalAlpha = 0.18;
        bctx.strokeRect(b.x + 0.5, b.y + 0.5, BW, BH);
        bctx.beginPath();
        bctx.moveTo(b.x, b.y + 7.5);
        bctx.lineTo(b.x + BW, b.y + 7.5);
        bctx.stroke();
        // Two faint "field" lines under the header rule.
        bctx.globalAlpha = 0.1;
        bctx.beginPath();
        bctx.moveTo(b.x + 4, b.y + 11.5);
        bctx.lineTo(b.x + 4 + b.fields[0], b.y + 11.5);
        if (b.fields[1]) {
          bctx.moveTo(b.x + 4, b.y + 15.5);
          bctx.lineTo(b.x + 4 + b.fields[1], b.y + 15.5);
        }
        bctx.stroke();
      });
      bctx.globalAlpha = 1;
    },

    step(t) {
      if (t >= nextSpawn) {
        nextSpawn = t + 1.6;
        if (packets.length < 3 && edges.length) {
          packets.push({ e: pick(edges), start: t, back: Math.random() < 0.35 });
        }
      }
      packets = packets.filter((p) => {
        if (t - p.start < 1.2) return true;
        (p.back ? p.e.from : p.e.to).flash = p.start + 1.2;
        return false;
      });
    },

    draw(ctx, t, base, c, w2, h2) {
      // Connectors under the boxes, flowing slowly.
      ctx.lineWidth = 1;
      ctx.strokeStyle = c.ink;
      ctx.globalAlpha = 0.1;
      ctx.setLineDash([3, 5]);
      ctx.lineDashOffset = -t * 12;
      ctx.stroke(connectors);
      ctx.setLineDash([]);

      // The edge a call is travelling along warms up to the accent.
      ctx.strokeStyle = c.accent;
      packets.forEach((p) => {
        const k = Math.min((t - p.start) / 1.2, 1);
        ctx.globalAlpha = 0.28 * Math.sin(Math.PI * k);
        ctx.beginPath();
        tracePath(ctx, p.e.pts);
        ctx.stroke();
      });

      ctx.globalAlpha = 1;
      ctx.drawImage(base, 0, 0, w2, h2);

      // Arrival flash on the called class.
      boxes.forEach((b) => {
        const d = t - b.flash;
        if (d < 0 || d > 0.5) return;
        ctx.globalAlpha = 0.9 - 0.72 * (d / 0.5);
        ctx.strokeStyle = c.accent;
        ctx.strokeRect(b.x + 0.5, b.y + 0.5, BW, BH);
        ctx.beginPath();
        ctx.moveTo(b.x, b.y + 7.5);
        ctx.lineTo(b.x + BW, b.y + 7.5);
        ctx.stroke();
      });

      ctx.globalAlpha = 1;
      ctx.fillStyle = c.accent;
      packets.forEach((p) => {
        const k = easeInOut(Math.min((t - p.start) / 1.2, 1));
        const [x, y] = pointAt(p.e, p.back ? 1 - k : k);
        ctx.fillRect(Math.round(x) - 2, Math.round(y) - 2, 4, 4);
      });
    },
  };
}

/* ---------------- AI: neural net ---------------- */

function createNeuralNet(w, h, seed, intensity) {
  const LAYERS = [4, 7, 7, 5, 2];
  const R = 3.5;
  const rng = mulberry32(seed);
  const narrow = w < 640;
  const x0 = w * (narrow ? 0.08 : intensity === 'subtle' ? 0.1 : 0.4);
  const x1 = w * (narrow ? 0.92 : 0.95);
  const padY = Math.max(24, h * 0.12);

  const layers = LAYERS.map((n, l) =>
    Array.from({ length: n }, (_, j) => ({
      x: x0 + ((x1 - x0) * l) / (LAYERS.length - 1),
      y: padY + ((h - 2 * padY) * (j + 0.5)) / n + (rng() * 12 - 6),
      act: -9,
    }))
  );

  let pulses = [];
  let nextSpawn = 0;

  return {
    paintBase(bctx, c) {
      bctx.lineWidth = 1;
      bctx.strokeStyle = c.ink;
      bctx.globalAlpha = 0.07;
      bctx.beginPath();
      for (let l = 0; l < layers.length - 1; l++) {
        layers[l].forEach((a) =>
          layers[l + 1].forEach((b) => {
            bctx.moveTo(a.x, a.y);
            bctx.lineTo(b.x, b.y);
          })
        );
      }
      bctx.stroke();
      layers.flat().forEach((n) => {
        bctx.beginPath();
        bctx.arc(n.x, n.y, R, 0, Math.PI * 2);
        bctx.globalAlpha = 1;
        bctx.fillStyle = c.paper2;
        bctx.fill();
        bctx.globalAlpha = 0.3;
        bctx.stroke();
      });
      bctx.globalAlpha = 1;
    },

    step(t) {
      while (t >= nextSpawn) {
        if (pulses.length < 10) {
          pulses.push({ l: 0, from: pick(layers[0]), to: pick(layers[1]), start: nextSpawn });
        }
        nextSpawn += 0.35;
      }
      pulses = pulses.filter((p) => {
        while (t - p.start >= 0.55) {
          p.to.act = p.start + 0.55;
          if (p.l + 2 >= layers.length) return false;
          p.l += 1;
          p.from = p.to;
          p.to = pick(layers[p.l + 1]);
          p.start += 0.55;
        }
        return true;
      });
    },

    draw(ctx, t, base, c, w2, h2) {
      ctx.globalAlpha = 1;
      ctx.drawImage(base, 0, 0, w2, h2);

      ctx.lineWidth = 1;
      pulses.forEach((p) => {
        const k = Math.min((t - p.start) / 0.55, 1);
        const dx = p.to.x - p.from.x;
        const dy = p.to.y - p.from.y;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len;
        const uy = dy / len;

        // Active edge, boundary to boundary.
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = c.accent;
        ctx.beginPath();
        ctx.moveTo(p.from.x + ux * R, p.from.y + uy * R);
        ctx.lineTo(p.to.x - ux * R, p.to.y - uy * R);
        ctx.stroke();

        // Head + 24px fading trail.
        const hx = p.from.x + dx * k;
        const hy = p.from.y + dy * k;
        const tail = Math.min(24, len * k);
        const tx = hx - ux * tail;
        const ty = hy - uy * tail;
        if (tail > 1) {
          // Six segments stepping up in alpha read as a smooth fade at this
          // size, without gradient fringes from a "transparent" stop.
          const SEG = 6;
          ctx.lineWidth = 2;
          for (let i = 0; i < SEG; i++) {
            ctx.globalAlpha = (0.85 * (i + 1)) / SEG;
            ctx.beginPath();
            ctx.moveTo(tx + (hx - tx) * (i / SEG), ty + (hy - ty) * (i / SEG));
            ctx.lineTo(tx + (hx - tx) * ((i + 1) / SEG), ty + (hy - ty) * ((i + 1) / SEG));
            ctx.stroke();
          }
          ctx.lineWidth = 1;
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = c.accent;
        ctx.beginPath();
        ctx.arc(hx, hy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Activated nodes: fill with the accent, radius 3.5 -> 6 -> 3.5.
      ctx.fillStyle = c.accent;
      layers.forEach((layer) =>
        layer.forEach((n) => {
          const d = t - n.act;
          if (d < 0 || d > 0.45) return;
          const k = d / 0.45;
          ctx.globalAlpha = 1 - k * k * k;
          ctx.beginPath();
          ctx.arc(n.x, n.y, R + 2.5 * Math.sin(Math.PI * k), 0, Math.PI * 2);
          ctx.fill();
        })
      );
      ctx.globalAlpha = 1;
    },
  };
}

/* ---------------- Engine ---------------- */

export default function TrackBackground({ track = 'java-developer', intensity = 'full', className }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas && canvas.getContext('2d');
    if (!wrap || !ctx) return undefined;

    const base = document.createElement('canvas');
    const bctx = base.getContext('2d');
    const isAI = track === 'ai-engineer';
    const seed = SEEDS[track] || 7;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

    let w = 0;
    let h = 0;
    let dpr = 1;
    let colors = readColors(track);
    let scene = null;
    let simT = 0;
    let raf = 0;
    let last = 0;
    let running = false;
    let inView = true;

    const makeScene = () =>
      isAI ? createNeuralNet(w, h, seed, intensity) : createClassGraph(w, h, seed);

    function paintBase() {
      bctx.setTransform(1, 0, 0, 1, 0, 0);
      bctx.clearRect(0, 0, base.width, base.height);
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scene.paintBase(bctx, colors);
    }

    function render() {
      if (!scene) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      scene.draw(ctx, simT, base, colors, w, h);
    }

    // Reduced motion: replay the simulation to t=1.5s, draw once, stop.
    function renderStatic() {
      scene = makeScene();
      paintBase();
      for (simT = 0; simT < STATIC_T; simT += 1 / 30) scene.step(simT);
      simT = STATIC_T;
      scene.step(simT);
      render();
    }

    function resize() {
      const nw = wrap.clientWidth;
      const nh = wrap.clientHeight;
      const nd = Math.min(window.devicePixelRatio || 1, 2);
      if (!nw || !nh || (nw === w && nh === h && nd === dpr && scene)) return;
      w = nw;
      h = nh;
      dpr = nd;
      canvas.width = base.width = Math.round(w * dpr);
      canvas.height = base.height = Math.round(h * dpr);
      if (mq.matches) {
        renderStatic();
      } else {
        scene = makeScene();
        simT = 0;
        paintBase();
        render();
        sync();
      }
    }

    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (now - last < FRAME_MS) return;
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      simT += dt;
      scene.step(simT);
      render();
    }

    function start() {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    function sync() {
      if (scene && inView && !document.hidden && !mq.matches) start();
      else stop();
    }

    function onMotionPref() {
      if (mq.matches) {
        stop();
        if (w && h) renderStatic();
      } else {
        sync();
      }
    }

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const io = new IntersectionObserver((entries) => {
      inView = entries[entries.length - 1].isIntersecting;
      sync();
    });
    io.observe(wrap);

    const mo = new MutationObserver(() => {
      colors = readColors(track);
      if (!scene) return;
      paintBase();
      render();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-track'] });

    document.addEventListener('visibilitychange', sync);
    mq.addEventListener('change', onMotionPref);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener('visibilitychange', sync);
      mq.removeEventListener('change', onMotionPref);
    };
  }, [track, intensity]);

  return (
    <div
      ref={wrapRef}
      className={'track-bg track-bg-' + intensity + (className ? ' ' + className : '')}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
