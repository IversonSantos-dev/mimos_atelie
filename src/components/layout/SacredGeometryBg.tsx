import React from 'react';

export const SacredGeometryBg: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* Brilho Radial Superior Ateliê Rosé */}
      <div className="absolute -top-48 left-1/2 -translate-x-1/2 h-[540px] w-[1100px] rounded-full bg-atelie-rose-300/30 blur-[140px]" />

      {/* Feixe Lateral Sutil */}
      <div className="absolute top-1/3 -right-64 h-[480px] w-[480px] rounded-full bg-atelie-rose-400/20 blur-[130px]" />
      <div className="absolute bottom-10 -left-64 h-[420px] w-[420px] rounded-full bg-atelie-brown-300/15 blur-[130px]" />

      {/* Geometria Sagrada Minimalista em SVG */}
      <svg
        className="absolute left-1/2 top-24 -translate-x-1/2 w-[900px] h-[900px] opacity-[0.06] text-atelie-rose-600"
        viewBox="0 0 800 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="400" cy="400" r="360" stroke="currentColor" strokeWidth="1" />
        <circle cx="400" cy="400" r="280" stroke="currentColor" strokeWidth="0.75" strokeDasharray="4 6" />
        <circle cx="400" cy="400" r="200" stroke="currentColor" strokeWidth="1" />
        <circle cx="400" cy="400" r="120" stroke="currentColor" strokeWidth="0.75" />
        <line x1="400" y1="20" x2="400" y2="780" stroke="currentColor" strokeWidth="0.75" />
        <line x1="20" y1="400" x2="780" y2="400" stroke="currentColor" strokeWidth="0.75" />
        <polygon
          points="400,60 740,400 400,740 60,400"
          stroke="currentColor"
          strokeWidth="0.75"
        />
        <rect
          x="160"
          y="160"
          width="480"
          height="480"
          stroke="currentColor"
          strokeWidth="0.75"
        />
      </svg>

      {/* Grade de Precisão Sutil */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(223,178,163,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(223,178,163,0.6) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />
    </div>
  );
};
