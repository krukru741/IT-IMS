import React from 'react';

/**
 * Avatar — initials-based, supports size variants
 * size: 'sm' | 'md' | 'lg' | 'xl'
 */
export default function Avatar({ name = '', size = 'md', src = null, style = {} }) {
  const initials = name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (src) {
    return (
      <img
        className={`avatar avatar-${size}`}
        src={src}
        alt={name}
        style={{ objectFit: 'cover', ...style }}
      />
    );
  }

  return (
    <div
      className={`avatar avatar-${size}`}
      style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)', ...style }}
      aria-label={name}
      title={name}
    >
      {initials}
    </div>
  );
}
