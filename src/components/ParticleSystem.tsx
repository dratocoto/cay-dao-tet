import { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  width: number;
  height: number;
  fallSpeed: number;
  wind: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  // New properties for "pro" effect
  swayOffset: number;
  swaySpeed: number;
  opacity: number;
  blur: number;
}

interface ParticleSystemProps {
  width: number;
  height: number;
  petalCount: number;
  windStrength: number;
  enabled: boolean;
}

const PETAL_COLORS = [
  '#FFB6C1', // Light pink
  '#FF69B4', // Hot pink
  '#FFC0CB', // Pink
  '#FFA0B4', // Deep pink
];

export function ParticleSystem({
  width,
  height,
  petalCount,
  windStrength,
  enabled,
}: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const petalsRef = useRef<Petal[]>([]);

  useEffect(() => {
    if (!enabled || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    // Initialize petals - spawn from top, fall to 2/3 of height
    // Petal size scaled to match tree flowers (increased further)
    const maxFallHeight = height * (0.8); // Increased fall range slightly
    // Increase petal count by 50% based on user feedback, ensure minimum
    const actualPetalCount = Math.max(Math.floor((petalCount || 50) * 1.5), 30);
    console.log('ParticleSystem: Init', { petalCount, actualPetalCount, width, height });
    
    const initializePetal = (): Petal => ({
      x: Math.random() * width,
      y: Math.random() * -150 - 50, // Start higher
      width: Math.random() * 1.5 + 2.5, // Reduced from 3.0+3.5
      height: Math.random() * 1.0 + 2.5, // Reduced from 2.0+3.5
      fallSpeed: Math.random() * 1.5 + 0.8, // Slightly faster variation
      wind: (Math.random() - 0.5) * windStrength * 0.4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2.0,
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      // New props initialization
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.02 + 0.01,
      opacity: Math.random() * 0.4 + 0.5, // 0.5 to 0.9 opacity
      blur: Math.random() < 0.3 ? Math.random() * 1.5 : 0, // 30% chance of being blurred for depth
    });

    petalsRef.current = Array.from({ length: actualPetalCount }, initializePetal);

    let frameCount = 0;

    const animate = () => {
      if (!ctx) return;
      frameCount++;

      // Clear canvas (transparent)
      ctx.clearRect(0, 0, width, height);

      // Update and draw each petal
      petalsRef.current.forEach((petal) => {
        // Apply gravity
        petal.y += petal.fallSpeed;

        // Apply wind + sine wave sway
        // Add swaying motion using sine wave
        const sway = Math.sin(frameCount * petal.swaySpeed + petal.swayOffset);
        petal.x += petal.wind + sway * 0.5;

        // Apply rotation
        petal.rotation += petal.rotationSpeed;

        // Reset if off-screen (both vertically and horizontally) or max height
        const isOutOfBounds = 
          petal.y > maxFallHeight || 
          petal.x < -20 || 
          petal.x > width + 20;

        if (isOutOfBounds) {
          // Reset
          petal.y = Math.random() * -150 - 50;
          petal.x = Math.random() * width;
          petal.fallSpeed = Math.random() * 1.5 + 0.8;
          petal.wind = (Math.random() - 0.5) * windStrength * 0.4;
          petal.width = Math.random() * 1.5 + 2.5; // Reduced size
          petal.height = Math.random() * 1.0 + 2.5; // Reduced size
          petal.swayOffset = Math.random() * Math.PI * 2;
          petal.opacity = Math.random() * 0.4 + 0.5;
          petal.blur = Math.random() < 0.3 ? Math.random() * 1.5 : 0;
        }

        // Only draw petal if within bounds
        if (petal.x >= -20 && petal.x <= width + 20 && petal.y >= -200 && petal.y <= maxFallHeight) {
          ctx.save();
          ctx.translate(petal.x, petal.y);
          ctx.rotate((petal.rotation * Math.PI) / 180);
          ctx.fillStyle = petal.color;
          ctx.globalAlpha = petal.opacity;
          
          if (petal.blur > 0) {
            ctx.filter = `blur(${petal.blur}px)`;
          }

          ctx.beginPath();
          ctx.ellipse(0, 0, petal.width / 2, petal.height / 2, 0, 0, 2 * Math.PI);
          ctx.fill();
          ctx.restore();
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [width, height, petalCount, windStrength, enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
