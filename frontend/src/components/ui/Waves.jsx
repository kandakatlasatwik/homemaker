import React, { useEffect, useRef } from 'react';

const Waves = ({
  lineColor = '#ffffff',
  backgroundColor = 'rgba(255, 255, 255, 0.2)',
  waveSpeedX = 0.0125,
  waveSpeedY = 0.01,
  waveAmpX = 40,
  waveAmpY = 20,
  friction = 0.9,
  tension = 0.01,
  maxCursorMove = 120,
  xGap = 12,
  yGap = 36,
}) => {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;

    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduceMotion = motionQuery.matches;
    let animationId;
    let cols = 0;
    let rows = 0;
    let width = 0;
    let height = 0;
    let points = [];

    const makeGrid = () => {
      points = [];
      cols = Math.max(2, Math.ceil(width / xGap) + 1);
      rows = Math.max(2, Math.ceil(height / yGap) + 1);

      for (let y = 0; y < rows; y += 1) {
        const row = [];
        for (let x = 0; x < cols; x += 1) {
          const bx = x * xGap;
          const by = y * yGap;
          row.push({
            bx,
            by,
            x: bx,
            y: by,
            vx: 0,
            vy: 0,
          });
        }
        points.push(row);
      }
    };

    const setCanvasSize = () => {
      const rect = wrapper.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeGrid();
    };

    const influencePoint = (p) => {
      const pointer = pointerRef.current;
      if (!pointer.active) return;

      const dx = p.x - pointer.x;
      const dy = p.y - pointer.y;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist > maxCursorMove) return;

      const strength = (1 - dist / maxCursorMove) * 2.2;
      p.vx += (dx / dist) * strength;
      p.vy += (dy / dist) * strength;
    };

    const draw = (time) => {
      const t = time * 0.001;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          const p = points[y][x];

          influencePoint(p);

          const targetX = p.bx + Math.sin(t * waveSpeedX * 60 + p.by * 0.02) * waveAmpX;
          const targetY = p.by + Math.cos(t * waveSpeedY * 60 + p.bx * 0.015) * waveAmpY;

          p.vx += (targetX - p.x) * tension;
          p.vy += (targetY - p.y) * tension;

          p.vx *= friction;
          p.vy *= friction;

          p.x += p.vx;
          p.y += p.vy;
        }
      }

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.55;

      for (let y = 0; y < rows; y += 1) {
        ctx.beginPath();
        for (let x = 0; x < cols; x += 1) {
          const p = points[y][x];
          if (x === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      for (let x = 0; x < cols; x += 1) {
        ctx.beginPath();
        for (let y = 0; y < rows; y += 1) {
          const p = points[y][x];
          if (y === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      if (!reduceMotion) {
        animationId = requestAnimationFrame(draw);
      }
    };

    const handleMotionPreference = (event) => {
      reduceMotion = event.matches;
      cancelAnimationFrame(animationId);
      if (reduceMotion) {
        draw(0);
      } else {
        animationId = requestAnimationFrame(draw);
      }
    };

    const handlePointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        active: true,
      };
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };

    const observer = new ResizeObserver(setCanvasSize);
    observer.observe(wrapper);

    setCanvasSize();
    if (reduceMotion) {
      draw(0);
    } else {
      animationId = requestAnimationFrame(draw);
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('blur', handlePointerLeave);
    motionQuery.addEventListener('change', handleMotionPreference);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('blur', handlePointerLeave);
      motionQuery.removeEventListener('change', handleMotionPreference);
    };
  }, [
    backgroundColor,
    friction,
    lineColor,
    maxCursorMove,
    tension,
    waveAmpX,
    waveAmpY,
    waveSpeedX,
    waveSpeedY,
    xGap,
    yGap,
  ]);

  return (
    <div ref={wrapperRef} className="w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full block" aria-hidden="true" />
    </div>
  );
};

export default Waves;
