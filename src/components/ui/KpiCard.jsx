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
 * Inline SVG sparkline — no extra library.
 */
function Sparkline({ data, color = '#4F46E5' }) {
  if (!data || data.length < 2) return null;
  const width = 100;
  const height = 36;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);

  const points = data.map((v, i) => [
    i * step,
    height - ((v - min) / range) * (height - 4) - 2,
  ]);

  const pathD = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const areaD = `${pathD} L${width},${height} L0,${height} Z`;
  const gradId = `sg${color.replace(/[^a-z0-9]/gi, '')}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none"
      style={{ width: '100%', height: 36, display: 'block', marginTop: 10, overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gradId})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={points[points.length-1][0]} cy={points[points.length-1][1]} r="2.5" fill={color} />
    </svg>
  );
}

/**
 * KPI Card with icon, animated count, label, trend, and optional sparkline.
 */
export default function KpiCard({ icon: Icon, value, label, color, trend, trendLabel, style, sparkData, sparkColor }) {
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

      {sparkData && <Sparkline data={sparkData} color={sparkColor || '#4F46E5'} />}
    </div>
  );
}
