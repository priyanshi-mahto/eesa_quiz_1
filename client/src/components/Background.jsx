import React, { useRef, useEffect } from "react";

const BackgroundLayout = ({ children }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
  
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    // define hexagons, particles, etc. here..
    let hexagons = [];
  let time = 0;
  const hexSize = 40; // you can tweak this for density
  const hexHeight = Math.sqrt(3) * hexSize;
  
  
  class Hexagon {
    constructor(x, y, col, row) {
      this.x = x;
      this.y = y;
      this.col = col;
      this.row = row;
      this.size = hexSize;
      this.opacity = 0;
      this.pulseSpeed = 0.02 + Math.random() * 0.02;
      this.pulseOffset = Math.random() * Math.PI * 2;
      this.glowIntensity = 0;
    }
  
    draw() {
      // Calculate pulse based on distance from center
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const distance = Math.sqrt(
        Math.pow(this.x - centerX, 2) +
        Math.pow(this.y - centerY, 2)
      );
  
      // Pulsing effect radiating from center
      const pulse = Math.sin(time * 2 - distance * 0.01 + this.pulseOffset);
      this.opacity = (pulse + 1) * 0.15;
      this.glowIntensity = Math.max(0, pulse * 0.3);
  
      // Draw hexagon
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const x = this.x + this.size * Math.cos(angle);
        const y = this.y + this.size * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
  
      // Fill with gradient
      if (this.glowIntensity > 0) {
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 1.5
        );
        gradient.addColorStop(0, `rgba(147, 51, 234, ${this.glowIntensity})`);
        gradient.addColorStop(1, 'rgba(147, 51, 234, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
      }
  
      // Stroke hexagon
      ctx.strokeStyle = `rgba(147, 51, 234, ${this.opacity})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
  
      // Draw center dot if glowing
      if (this.glowIntensity > 0.1) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(192, 132, 252, ${this.glowIntensity * 2})`;
        ctx.fill();
      }
    }
  }
  
  function createHexGrid() {
    hexagons.length = 0;
    const cols = Math.ceil(canvas.width / (hexSize * 1.5)) + 2;
    const rows = Math.ceil(canvas.height / hexHeight) + 2;
  
    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const x = col * hexSize * 1.5;
        const y = row * hexHeight + (col % 2 === 1 ? hexHeight / 2 : 0);
        hexagons.push(new Hexagon(x, y, col, row));
      }
    }
  }
  
  createHexGrid();
  
  // Floating particles for extra effect
  const particles = [];
  const particleCount = 40;
  
  class Particle {
    constructor() {
      this.reset();
    }
  
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.size = Math.random() * 2 + 1;
      this.opacity = Math.random() * 0.5 + 0.2;
    }
  
    update() {
      this.x += this.vx;
      this.y += this.vy;
  
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
  
    draw() {
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.size * 3
      );
      gradient.addColorStop(0, `rgba(192, 132, 252, ${this.opacity})`);
      gradient.addColorStop(1, 'rgba(192, 132, 252, 0)');
  
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  
    function animate() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      time += 0.02;
      hexagons.forEach(hex => hex.draw());
      particles.forEach(particle => { particle.update(); particle.draw(); });
      requestAnimationFrame(animate);
    }
  
    animate();
  
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createHexGrid();
    });
  
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createHexGrid();
    };
    window.addEventListener('resize', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  
  }, []);

  return (
    <div className="relative min-h-screen bg-hero-gradient overflow-hidden">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
      ></canvas>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default BackgroundLayout;
