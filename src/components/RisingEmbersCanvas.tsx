import { useEffect, useRef } from 'react';

interface FlameParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  color: string;
  swaySpeed: number;
  swayOffset: number;
  life: number;
}

export default function RisingEmbersCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
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

    const emberColors = [
      '#FF3B00', // Fiery Red-Orange
      '#FF6B2C', // Flame Orange
      '#FF9F1C', // Amber Gold
      '#FFD166', // Bright Yellow Ember
      '#FF2A00', // Pure Flame Red
      '#FF7B00', // Deep Orange
    ];

    const random = (min: number, max: number) => min + Math.random() * (max - min);

    // Initialize 140 Rising Flame Embers
    const particles: FlameParticle[] = [];
    const particleCount = 140;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height, // Distributed across screen initially
        vx: random(-0.3, 0.3),
        vy: random(-1.2, -3.2), // Rising upward from bottom to top
        size: random(1.5, 5.5),
        alpha: random(0.2, 0.85),
        maxAlpha: random(0.4, 0.9),
        color: emberColors[Math.floor(Math.random() * emberColors.length)],
        swaySpeed: random(0.01, 0.03),
        swayOffset: Math.random() * Math.PI * 2,
        life: Math.random() * 1000,
      });
    }

    const render = () => {
      // 1. Dark Luxury Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#040711');
      bgGrad.addColorStop(0.5, '#070D1E');
      bgGrad.addColorStop(1, '#0A1226');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Ambient Fire Ambient Glow at Bottom Edge (Heat Energy)
      const bottomGlow = ctx.createLinearGradient(0, height, 0, height - 220);
      bottomGlow.addColorStop(0, 'rgba(255, 69, 0, 0.22)');
      bottomGlow.addColorStop(0.4, 'rgba(255, 107, 44, 0.10)');
      bottomGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = bottomGlow;
      ctx.fillRect(0, height - 220, width, 220);

      // 3. Render Rising Flame Ember Particles
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life += 1;

        // Move upward
        p.y += p.vy;
        // Natural heat drift sway
        p.x += Math.sin(p.life * p.swaySpeed + p.swayOffset) * 0.45;

        // Reset particle when it reaches above the top of the screen
        if (p.y < -15) {
          p.y = height + random(5, 40);
          p.x = Math.random() * width;
          p.vy = random(-1.2, -3.2);
          p.size = random(1.5, 5.5);
          p.alpha = random(0.2, 0.85);
          p.color = emberColors[Math.floor(Math.random() * emberColors.length)];
        }

        // Draw glowing ember dot
        const pGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        pGrad.addColorStop(0, p.color);
        pGrad.addColorStop(0.5, p.color);
        pGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = pGrad;
        ctx.globalAlpha = p.alpha * (0.8 + Math.sin(p.life * 0.05) * 0.2); // Soft flicker effect
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ display: 'block' }}
    />
  );
}
