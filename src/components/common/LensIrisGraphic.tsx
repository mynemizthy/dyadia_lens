/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LensIrisGraphicProps {
  colorName: string;
  className?: string;
  size?: number;
}

export const LensIrisGraphic: React.FC<LensIrisGraphicProps> = ({
  colorName,
  className = '',
  size = 180,
}) => {
  // Map lens color name to authentic Korean aesthetic cosmetic lens palette
  const getColorGradients = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('gray') || n.includes('sapphire') || n.includes('light gray')) {
      return {
        outer: '#64748B',
        mid: '#94A3B8',
        inner: '#CBD5E1',
        highlight: '#E2E8F0',
        ring: '#334155',
      };
    }
    if (n.includes('choco') || n.includes('paw')) {
      return {
        outer: '#451A03',
        mid: '#78350F',
        inner: '#B45309',
        highlight: '#D97706',
        ring: '#291002',
      };
    }
    if (n.includes('lavender')) {
      return {
        outer: '#6B21A8',
        mid: '#9333EA',
        inner: '#C084FC',
        highlight: '#E9D5FF',
        ring: '#3B0764',
      };
    }
    if (n.includes('pink') || n.includes('pretty')) {
      return {
        outer: '#9F1239',
        mid: '#E11D48',
        inner: '#FB7185',
        highlight: '#FFE4E6',
        ring: '#4C0519',
      };
    }
    if (n.includes('olive') || n.includes('green')) {
      return {
        outer: '#365314',
        mid: '#4D7C0F',
        inner: '#84CC16',
        highlight: '#D9F99D',
        ring: '#1A2E05',
      };
    }
    if (n.includes('beige') || n.includes('lady')) {
      return {
        outer: '#78350F',
        mid: '#A16207',
        inner: '#CA8A04',
        highlight: '#FEF08A',
        ring: '#451A03',
      };
    }
    if (n.includes('black') || n.includes('teary')) {
      return {
        outer: '#0F172A',
        mid: '#334155',
        inner: '#475569',
        highlight: '#94A3B8',
        ring: '#020617',
      };
    }
    // Default Brown / Amber
    return {
      outer: '#713F12',
      mid: '#92400E',
      inner: '#B45309',
      highlight: '#FDE68A',
      ring: '#451A03',
    };
  };

  const palette = getColorGradients(colorName);
  const gradId = `lens-grad-${colorName.replace(/[^a-zA-Z0-9]/g, '')}-${size}`;

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-sm filter"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main Iris Gradient */}
          <radialGradient id={`${gradId}-iris`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0B0F19" />
            <stop offset="28%" stopColor="#1E293B" />
            <stop offset="45%" stopColor={palette.inner} stopOpacity="0.9" />
            <stop offset="70%" stopColor={palette.mid} />
            <stop offset="92%" stopColor={palette.outer} />
            <stop offset="100%" stopColor={palette.ring} />
          </radialGradient>

          {/* Highlight Shimmer */}
          <linearGradient id={`${gradId}-shimmer`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.highlight} stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor={palette.highlight} stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Outer lens curvature translucent rim */}
        <circle cx="100" cy="100" r="95" fill="none" stroke="rgba(203, 213, 225, 0.45)" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="0.8" />

        {/* Colored Iris Body */}
        <circle cx="100" cy="100" r="82" fill={`url(#${gradId}-iris)`} />

        {/* Iris delicate petal striations */}
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={i}
            x1="100"
            y1="40"
            x2="100"
            y2="70"
            stroke={palette.highlight}
            strokeWidth="1"
            strokeOpacity="0.35"
            strokeLinecap="round"
            transform={`rotate(${i * 15} 100 100)`}
          />
        ))}

        {/* Limbal soft outer ring */}
        <circle cx="100" cy="100" r="82" fill="none" stroke={palette.ring} strokeWidth="3" opacity="0.6" />

        {/* Center Pupil */}
        <circle cx="100" cy="100" r="26" fill="#090D16" />

        {/* Organic Light Reflections / Crystalline Catchlights */}
        <ellipse cx="82" cy="74" rx="8" ry="5" fill="#FFFFFF" opacity="0.75" transform="rotate(-30 82 74)" />
        <circle cx="118" cy="120" r="3" fill="#FFFFFF" opacity="0.45" />
      </svg>
    </div>
  );
};
