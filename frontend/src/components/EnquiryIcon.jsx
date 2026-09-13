import React from 'react';

export default function EnquiryIcon({ size = 20, style = {} }) {
  const dimension = typeof size === 'number' ? `${size}px` : size;

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.12))', ...style }}
    >
      {/* White Speech Bubble Body (Transparent outer background) */}
      <path
        d="M 50 12 C 26 12 12 26 12 45 C 12 56 18 66 28 72 C 26 81 19 88 17 89 C 16 89.5 17 90.5 18 90.5 C 30 90.5 41 83 45 79.5 C 46.6 79.8 48.3 80 50 80 C 74 80 88 66 88 45 C 88 26 74 12 50 12 Z"
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth="3"
      />

      {/* Two Horizontal Black Chat Lines Inside */}
      <rect x="33" y="36" width="34" height="7.5" rx="3.75" fill="#000000" />
      <rect x="33" y="49" width="24" height="7.5" rx="3.75" fill="#000000" />
    </svg>
  );
}
