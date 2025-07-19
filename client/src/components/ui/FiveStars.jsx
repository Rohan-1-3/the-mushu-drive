import React from 'react';

function FiveStars({ value = 0, maxStars = 5 }) {
  // Clamp value between 0 and maxStars
  const clampedValue = Math.min(Math.max(value, 0), maxStars);

  const stars = [];

  for (let i = 0; i < maxStars; i++) {
    // Calculate how much this star should be filled (between 0 and 1)
    const fill = Math.min(Math.max(clampedValue - i, 0), 1);

    stars.push(<Star key={i} fill={fill} />);
  }

  return <div style={{ display: 'flex', gap: '4px' }}>{stars}</div>;
}

function Star({ fill }) {
  // fill is a number between 0 (empty) and 1 (full)
  return (
    <div style={{ position: 'relative', width: 24, height: 24, display: 'inline-block' }}>
      {/* Gray star as background */}
      <StarIcon color="#e0e0e0" />
      {/* Colored star clipped by fill percentage */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${fill * 100}%`,
          height: '100%',
          overflow: 'hidden',
          color: '#ffc107',
          pointerEvents: 'none',
        }}
      >
        <StarIcon color="#ffc107" />
      </div>
    </div>
  );
}

function StarIcon({ color }) {
  // Simple SVG star icon
  return (
    <svg
      height="24"
      width="24"
      viewBox="0 0 24 24"
      fill={color}
      stroke="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

export default FiveStars;
