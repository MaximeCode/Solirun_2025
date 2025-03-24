//// ALERT ////
// Ce fichier ne sert plus !
// J'ai recréer les confettis grâce à l'outils ConfettiPage

// Ce composant n'est donc plus utilisé !

"use client";

import React, { useEffect, useState, useRef } from "react";

const Fireworks = () => {
  const [active, setActive] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const fireworksRef = useRef([]);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  // Configuration
  const config = {
    fireworkInterval: 800, // Time between launches in ms
    fireworkSpeed: { min: 5, max: 8 },
    fireworkAcceleration: 1.05,
    particleCount: { min: 50, max: 80 },
    particleLifespan: { min: 50, max: 100 },
    gravity: 0.1,
    explosionSize: { min: 20, max: 40 },
    colors: [
      { r: 255, g: 0, b: 0 }, // Red
      { r: 255, g: 165, b: 0 }, // Orange
      { r: 255, g: 255, b: 0 }, // Yellow
      { r: 0, g: 255, b: 0 }, // Green
      { r: 0, g: 255, b: 255 }, // Cyan
      { r: 0, g: 0, b: 255 }, // Blue
      { r: 255, g: 0, b: 255 }, // Magenta
      { r: 255, g: 255, b: 255 }, // White
    ],
    launchPositions: [
      { x: 0.3, y: 1 }, // Left side
      { x: 0.7, y: 1 }, // Right side
    ],
  };

  // Initialize and resize handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas to fill the screen
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    contextRef.current = canvas.getContext("2d");

    // Delay the start of fireworks
    const timer = setTimeout(() => {
      setActive(true);
      window.ConfettiPage.play();
    }, 6000); // Start after podium animations (5s + 1s buffer)

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Create fireworks when active
  useEffect(() => {
    if (!active) return;

    let lastFirework = 0;

    const launchNewFirework = (timestamp, width, height) => {
      if (timestamp - lastFirework <= config.fireworkInterval) return;

      const position =
        config.launchPositions[
          Math.floor(Math.random() * config.launchPositions.length)
        ];

      // Create a new firework
      fireworksRef.current.push({
        x: position.x * width,
        y: height,
        targetX: (position.x + (Math.random() * 0.3 - 0.15)) * width, // Random horizontal variation
        targetY: 500,
        speed:
          config.fireworkSpeed.min +
          Math.random() * (config.fireworkSpeed.max - config.fireworkSpeed.min),
        acceleration: config.fireworkAcceleration,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        trail: [],
      });

      lastFirework = timestamp;
    };

    const updateFirework = (firework, ctx) => {
      // Calculate direction to target
      const dx = firework.targetX - firework.x;
      const dy = firework.targetY - firework.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // If reached target, explode
      if (distance < 5) {
        createExplosion(firework.x, firework.y, firework.color);
        return null;
      }

      // Move toward target
      firework.speed /= firework.acceleration;
      firework.x += (dx / distance) * firework.speed;
      firework.y += (dy / distance) * firework.speed;

      // Add to trail
      firework.trail.push({ x: firework.x, y: firework.y, alpha: 1 });
      if (firework.trail.length > 10) {
        firework.trail.shift();
      }

      // Draw trail
      ctx.beginPath();
      let alpha = 0.1;
      for (const point of firework.trail) {
        ctx.strokeStyle = `rgba(${firework.color.r}, ${firework.color.g}, ${firework.color.b}, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.lineTo(point.x, point.y);
        alpha += 0.1;
      }
      ctx.stroke();

      // Draw firework
      ctx.beginPath();
      ctx.arc(firework.x, firework.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${firework.color.r}, ${firework.color.g}, ${firework.color.b})`;
      ctx.fill();

      return firework;
    };

    const updateParticle = (particle, ctx) => {
      // Apply gravity
      particle.vy += config.gravity;

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Update lifespan
      particle.lifespan--;

      if (particle.lifespan <= 0) return null;

      // Draw particle
      const alpha = particle.lifespan / particle.maxLifespan;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${alpha})`;
      ctx.fill();

      // Draw trail
      if (Math.random() > 0.5) {
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(particle.x - particle.vx * 2, particle.y - particle.vy * 2);
        ctx.strokeStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${
          particle.color.b
        }, ${alpha * 0.5})`;
        ctx.lineWidth = particle.size * alpha * 0.5;
        ctx.stroke();
      }

      return particle;
    };

    const animate = (timestamp) => {
      if (!contextRef.current) return;

      const ctx = contextRef.current;
      const width = canvasRef.current.width;
      const height = window.innerHeight;

      // Clear canvas with semi-transparent black for trails
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, width, height);

      // Launch new fireworks
      launchNewFirework(timestamp, width, height);

      // Update and draw fireworks
      const remainingFireworks = [];
      for (const firework of fireworksRef.current) {
        const updatedFirework = updateFirework(firework, ctx);
        if (updatedFirework) remainingFireworks.push(updatedFirework);
      }
      fireworksRef.current = remainingFireworks;

      // Update and draw particles
      const remainingParticles = [];
      for (const particle of particlesRef.current) {
        const updatedParticle = updateParticle(particle, ctx);
        if (updatedParticle) remainingParticles.push(updatedParticle);
      }
      particlesRef.current = remainingParticles;

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [active]);

  // Create an explosion effect
  const createExplosion = (x, y, baseColor) => {
    const particleCount =
      config.particleCount.min +
      Math.floor(
        Math.random() * (config.particleCount.max - config.particleCount.min)
      );

    const explosionType = Math.floor(Math.random() * 3); // 0: circle, 1: sphere, 2: custom pattern

    for (let i = 0; i < particleCount; i++) {
      // Color variation from base
      const colorVariation = 50;
      const color = {
        r: clamp(
          baseColor.r + Math.random() * colorVariation - colorVariation / 2,
          0,
          255
        ),
        g: clamp(
          baseColor.g + Math.random() * colorVariation - colorVariation / 2,
          0,
          255
        ),
        b: clamp(
          baseColor.b + Math.random() * colorVariation - colorVariation / 2,
          0,
          255
        ),
      };

      // Particle properties based on explosion type
      let angle, speed;

      switch (explosionType) {
        case 0: // Circle explosion
          angle = Math.random() * Math.PI * 2;
          speed = 1 + Math.random() * 3;
          break;
        case 1: // Sphere explosion (varying speeds)
          angle = Math.random() * Math.PI * 2;
          speed = 0.5 + Math.random() * 5;
          break;
        case 2: {
          // Custom pattern (like a star)
          const arms = 5 + Math.floor(Math.random() * 5);
          angle = (Math.floor(Math.random() * arms) / arms) * Math.PI * 2;
          angle += Math.random() * 0.2 - 0.1; // Small randomness
          speed = 1 + Math.random() * 4;
          break;
        }
      }

      // Create the particle
      particlesRef.current.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: color,
        size: 1 + Math.random() * 3,
        lifespan:
          config.particleLifespan.min +
          Math.floor(
            Math.random() *
              (config.particleLifespan.max - config.particleLifespan.min)
          ),
        maxLifespan: config.particleLifespan.max,
      });
    }

    // Add a bright flash at explosion point
    const ctx = contextRef.current;
    if (ctx) {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
      gradient.addColorStop(0, `rgba(255, 255, 255, 1)`);
      gradient.addColorStop(
        0.1,
        `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.8)`
      );
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // Helper function to clamp values
  const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
  };

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-dvh pointer-events-none -z-10"
      style={{ opacity: 0.8 }}
    />
  );
};

export default Fireworks;
