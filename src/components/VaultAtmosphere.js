"use client";
import { useRef, useEffect } from 'react';

const BLUE = '59, 130, 246';

function initParticles(w, h) {
  return Array.from({ length: 55 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.28,
    vy: (Math.random() - 0.5) * 0.18,
    r: Math.random() * 1.8 + 0.4,
    a: Math.random() * 0.35 + 0.07,
  }));
}

function initShapes(w, h) {
  return Array.from({ length: 6 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    radius: Math.random() * 65 + 28,
    sides: [5, 6, 8][Math.floor(Math.random() * 3)],
    rot: Math.random() * Math.PI * 2,
    rotV: (Math.random() - 0.5) * 0.004,
    vy: (Math.random() - 0.5) * 0.14,
    a: Math.random() * 0.09 + 0.025,
  }));
}

function drawPoly(ctx, x, y, radius, sides, rot, a) {
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2 + rot;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.strokeStyle = `rgba(${BLUE}, ${a})`;
  ctx.lineWidth = 1;
  ctx.stroke();
}

export default function VaultAtmosphere() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w, h, particles, shapes;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
      particles = initParticles(w, h);
      shapes = initShapes(w, h);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let animId;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x = (p.x + p.vx + w) % w;
        p.y = (p.y + p.vy + h) % h;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${BLUE}, ${p.a})`;
        ctx.fill();
      }

      for (const s of shapes) {
        s.rot += s.rotV;
        s.y = ((s.y + s.vy + s.radius + h) % (h + s.radius * 2)) - s.radius;
        drawPoly(ctx, s.x, s.y, s.radius, s.sides, s.rot, s.a);
      }

      animId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      ro.disconnect();
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
}
