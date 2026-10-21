import React, { useEffect, useRef } from 'react';

interface StardustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxLife: number;
  life: number;
  color: string;
  glowColor: string;
  shape: 'sparkle' | 'dust' | 'diamond';
  rotation: number;
  rotationSpeed: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

const COSMIC_COLORS = [
  { main: '#ffffff', glow: '#00f0ff' }, // Stellar White with Cyan Glow
  { main: '#00f0ff', glow: '#00f0ff' }, // Neon Cyan
  { main: '#b000ff', glow: '#b000ff' }, // Vivid Cosmic Purple
  { main: '#00ff88', glow: '#00ff88' }, // Electric Bio-Green
  { main: '#7000ff', glow: '#b000ff' }, // Deep Violet
  { main: '#e0f7ff', glow: '#00f0ff' }, // Ice Blue Stardust
];

export const StardustCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: StardustParticle[] = [];
    const MAX_PARTICLES = 180;

    let lastX = -1;
    let lastY = -1;
    let lastTime = performance.now();

    const createParticle = (
      x: number,
      y: number,
      speedMultiplier = 1,
      forceShape?: 'sparkle' | 'dust' | 'diamond'
    ) => {
      if (particles.length >= MAX_PARTICLES) {
        particles.shift();
      }

      const palette = COSMIC_COLORS[Math.floor(Math.random() * COSMIC_COLORS.length)];
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 1.6 + 0.3) * speedMultiplier;

      const shapes: ('sparkle' | 'dust' | 'diamond')[] = ['sparkle', 'dust', 'dust', 'diamond'];
      const shape = forceShape || shapes[Math.floor(Math.random() * shapes.length)];

      const isLargeSparkle = shape === 'sparkle' && Math.random() > 0.6;
      const size = isLargeSparkle ? Math.random() * 3.5 + 2.5 : Math.random() * 2 + 1;
      const maxLife = Math.random() * 35 + 25;

      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 0.4,
        vy: Math.sin(angle) * speed + (Math.random() - 0.5) * 0.4 - 0.2, // slight upward float
        size,
        maxLife,
        life: maxLife,
        color: palette.main,
        glowColor: palette.glow,
        shape,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        twinkleSpeed: Math.random() * 0.15 + 0.05,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    };

    const emitStardust = (currentX: number, currentY: number) => {
      if (lastX < 0 || lastY < 0) {
        lastX = currentX;
        lastY = currentY;
        return;
      }

      const dx = currentX - lastX;
      const dy = currentY - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Interpolate along movement vector for smooth trails even on fast flick gestures
      const steps = Math.min(Math.max(Math.floor(dist / 6), 1), 8);

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const interpX = lastX + dx * t + (Math.random() - 0.5) * 4;
        const interpY = lastY + dy * t + (Math.random() - 0.5) * 4;
        createParticle(interpX, interpY, 0.8);
      }

      // Occasional extra 4-point sparkle star
      if (Math.random() > 0.4) {
        createParticle(currentX, currentY, 1.2, 'sparkle');
      }

      lastX = currentX;
      lastY = currentY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      emitStardust(e.clientX, e.clientY);
      lastTime = performance.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        emitStardust(touch.clientX, touch.clientY);
        lastTime = performance.now();
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Cosmic stardust nova burst on click!
      const burstCount = 18;
      for (let i = 0; i < burstCount; i++) {
        createParticle(e.clientX, e.clientY, 2.8);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mousedown', handleClick, { passive: true });

    // Draw 4-pointed radiant star shape
    const drawFourPointStar = (
      x: number,
      y: number,
      outerR: number,
      innerR: number,
      rotation: number,
      alpha: number,
      mainColor: string,
      glowColor: string
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      // Halo
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = outerR * 4;
      ctx.globalAlpha = Math.min(1, alpha * 0.85);

      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2;
        const aNext = a + Math.PI / 4;
        if (i === 0) {
          ctx.moveTo(Math.cos(a) * outerR, Math.sin(a) * outerR);
        } else {
          ctx.lineTo(Math.cos(a) * outerR, Math.sin(a) * outerR);
        }
        ctx.lineTo(Math.cos(aNext) * innerR, Math.sin(aNext) * innerR);
      }
      ctx.closePath();
      ctx.fillStyle = mainColor;
      ctx.fill();

      // Bright inner core
      ctx.beginPath();
      ctx.arc(0, 0, innerR * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = Math.min(1, alpha);
      ctx.fill();

      ctx.restore();
    };

    // Draw diamond sparkle
    const drawDiamond = (
      x: number,
      y: number,
      size: number,
      rotation: number,
      alpha: number,
      color: string,
      glowColor: string
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = size * 3;
      ctx.globalAlpha = alpha;

      ctx.beginPath();
      ctx.moveTo(0, -size * 1.5);
      ctx.lineTo(size * 0.6, 0);
      ctx.lineTo(0, size * 1.5);
      ctx.lineTo(-size * 0.6, 0);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      ctx.restore();
    };

    // Main animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // If mouse is idle, emit a tiny resting shimmer stardust at last position occasionally
      const now = performance.now();
      if (lastX > 0 && lastY > 0 && now - lastTime < 3000 && Math.random() < 0.08) {
        createParticle(
          lastX + (Math.random() - 0.5) * 16,
          lastY + (Math.random() - 0.5) * 16,
          0.3,
          'dust'
        );
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 1;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96; // air drag
        p.vy *= 0.96;
        p.rotation += p.rotationSpeed;
        p.twinklePhase += p.twinkleSpeed;

        const baseAlpha = p.life / p.maxLife;
        // subtle twinkling pulsation
        const twinkle = 0.8 + 0.2 * Math.sin(p.twinklePhase);
        const alpha = Math.max(0, Math.min(1, baseAlpha * twinkle));

        if (p.shape === 'sparkle') {
          const outerRadius = p.size * (0.6 + 0.4 * (p.life / p.maxLife));
          const innerRadius = outerRadius * 0.28;
          drawFourPointStar(
            p.x,
            p.y,
            outerRadius,
            innerRadius,
            p.rotation,
            alpha,
            p.color,
            p.glowColor
          );
        } else if (p.shape === 'diamond') {
          drawDiamond(p.x, p.y, p.size, p.rotation, alpha, p.color, p.glowColor);
        } else {
          // Soft cosmic dust circle with glow
          ctx.save();
          ctx.shadowColor = p.glowColor;
          ctx.shadowBlur = p.size * 3.5;
          ctx.globalAlpha = alpha;

          // Outer halo
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();

          // Hot white center
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.45, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = Math.min(1, alpha * 1.2);
          ctx.fill();

          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mousedown', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="stardust-cursor-canvas"
      className="fixed inset-0 pointer-events-none z-40"
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  );
};
