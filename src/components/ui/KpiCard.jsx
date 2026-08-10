import React, { useState, useEffect, useRef } from 'react';

/**
 * Animated KPI number that counts up from 0 on mount.
 */
function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    const start = 0;
    const end = value;
    const duration = 800;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value]);

  return <>{display.toLocaleString()}</>;
}

/**
 * KPI Card with icon, animated count, label, and trend.
 */
export default function KpiCard({ icon: Icon, value, label, color, trend, trendLabel, style }) {
  return (
    <div className={`kpi-card animate-fade-up ${color}`} style={style}>
      <div className={`kpi-icon-wrap ${color}`} aria-hidden="true">
        <Icon size={22} />
      </div>

      <div className="kpi-value" aria-label={`${label}: ${value}`}>
        <AnimatedNumber value={value} />
      </div>
      <div className="kpi-label">{label}</div>

      {trend && (
        <div className={`kpi-trend ${trend}`} aria-label={trendLabel}>
          {trend === 'up'   && '↑ '}
          {trend === 'down' && '↓ '}
          {trend === 'warn' && '⚠ '}
          {trendLabel}
        </div>
      )}
    </div>
  );
}
