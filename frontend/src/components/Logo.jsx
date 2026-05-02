import React from "react";

// Refined CS monogram — based on the original logo's interlocking C+S idea.
// Geometric, modern, scalable.
export default function Logo({ size = 40, light = false, className = "" }) {
  const ink = light ? "#f5f1ea" : "#2c3e50";
  const accent = "#0093c9";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-label="Clifford Santos"
      role="img"
    >
      {/* C — open arc */}
      <path
        d="M 38 14 A 18 18 0 1 0 38 50"
        fill="none"
        stroke={ink}
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* S — sigmoid */}
      <path
        d="M 44 18 C 32 18 32 30 40 32 C 48 34 48 46 36 46"
        fill="none"
        stroke={accent}
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Anchor dot */}
      <circle cx="50" cy="32" r="2.6" fill={accent} />
    </svg>
  );
}
