import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload;
    return (
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '8px 14px',
        boxShadow: 'var(--shadow-card)',
        fontSize: 13,
        color: 'var(--text-primary)',
      }}>
        <div style={{ fontWeight: 600 }}>{name}</div>
        <div style={{ color: 'var(--text-muted)' }}>{value.toLocaleString()} assets</div>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 16 }}>
    {payload.map(entry => (
      <div key={entry.value} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
        <span style={{
          width: 10, height: 10, borderRadius: '50%',
          background: entry.color, flexShrink: 0,
        }} />
        <span style={{ color: 'var(--text-muted)', flex: 1 }}>{entry.value}</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
          {entry.payload.value.toLocaleString()}
        </span>
      </div>
    ))}
  </div>
);

export default function DonutChart({ data, title, centerLabel }) {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div>
      {title && (
        <div className="section-header" style={{ marginBottom: 16 }}>
          <span className="section-title">{title}</span>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        <div style={{ width: 220, height: 220, position: 'relative', flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={96}
                paddingAngle={3}
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center Label */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center', pointerEvents: 'none',
          }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 26, fontWeight: 700,
              color: 'var(--text-primary)', lineHeight: 1,
            }}>
              {total.toLocaleString()}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              {centerLabel || 'Total'}
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <CustomLegend payload={data.map(d => ({ value: d.name, color: d.color, payload: d }))} />
        </div>
      </div>
    </div>
  );
}
