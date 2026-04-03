import React, { useEffect, useMemo, useState } from 'react';

const pickDirection = (index, total) => {
  const angle = (index / total) * Math.PI * 2;
  return {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };
};

export default function ClickSpark({
  sparkColor = '#294ddb',
  sparkSize = 10,
  sparkRadius = 87,
  sparkCount = 8,
  duration = 400,
  easing = 'ease-out',
  extraScale = 1,
}) {
  const [bursts, setBursts] = useState([]);

  const directions = useMemo(() => {
    return Array.from({ length: sparkCount }, (_, i) => pickDirection(i, sparkCount));
  }, [sparkCount]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (event.button !== 0) return;

      const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const burst = {
        id,
        x: event.clientX,
        y: event.clientY,
      };

      setBursts((prev) => [...prev, burst]);

      window.setTimeout(() => {
        setBursts((prev) => prev.filter((item) => item.id !== id));
      }, duration + 50);
    };

    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, [duration]);

  return (
    <div className="click-spark-layer" aria-hidden="true">
      {bursts.map((burst) => (
        <div
          key={burst.id}
          className="click-spark-burst"
          style={{
            left: `${burst.x}px`,
            top: `${burst.y}px`,
          }}
        >
          {directions.map((dir, index) => (
            <span
              key={`${burst.id}_${index}`}
              className="click-spark"
              style={{
                '--spark-color': sparkColor,
                '--spark-size': `${sparkSize}px`,
                '--spark-radius': `${sparkRadius}px`,
                '--spark-duration': `${duration}ms`,
                '--spark-easing': easing,
                '--spark-scale': extraScale,
                '--spark-x': dir.x,
                '--spark-y': dir.y,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
