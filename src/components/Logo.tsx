import React from 'react';

export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Hexagon Top Face */}
      <path d="M50 12 L85 32 L50 52 L15 32 Z" fill="#9A6A15" />
      {/* Hexagon Left Face */}
      <path d="M15 32 L50 52 V90 L15 70 Z" fill="#F59E0B" />
      {/* Hexagon Right Face */}
      <path d="M50 52 L85 32 V70 L50 90 Z" fill="#FBBF24" />
      
      {/* The E with speech bubble tail */}
      <path d="
        M 35 26 
        H 68 
        C 71 26, 73 28, 73 31 
        V 39 
        C 73 42, 71 44, 68 44 
        H 48 
        V 52 
        H 62 
        C 65 52, 67 54, 67 57 
        V 61 
        C 67 64, 65 66, 62 66 
        H 48 
        V 74 
        H 68 
        C 71 74, 73 76, 73 79 
        V 87 
        C 73 90, 71 92, 68 92 
        H 50 
        L 50 100 
        L 35 88 
        Z
      " fill="white" />
      
      {/* 3D Shadow on the right side of the E */}
      <path d="
        M 68 44 C 71 44, 73 42, 73 39 V 42 C 73 45, 71 47, 68 47 H 48 V 44 H 68 Z
        M 62 66 C 65 66, 67 64, 67 61 V 64 C 67 67, 65 69, 62 69 H 48 V 66 H 62 Z
        M 68 92 C 71 92, 73 90, 73 87 V 90 C 73 93, 71 95, 68 95 H 50 L 50 92 H 68 Z
        M 50 100 L 53 103 L 35 91 L 35 88 L 50 100 Z
      " fill="#B45309" opacity="0.15" />
    </svg>
  );
}
