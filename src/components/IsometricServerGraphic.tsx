import React from 'react';

interface IsometricServerProps {
  variant?: 'banner' | 'card';
  className?: string;
}

export default function IsometricServerGraphic({
  variant = 'banner',
  className = '',
}: IsometricServerProps) {
  if (variant === 'card') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        {/* Floating particles */}
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping opacity-75" />
        <div className="absolute top-2 -left-2 w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
        <div className="absolute bottom-2 -right-2 w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-300" />
        <div className="absolute -bottom-1 left-2 w-1.5 h-1.5 rounded-full bg-purple-400" />

        <svg
          viewBox="0 0 160 140"
          className="w-24 h-24 filter drop-shadow-[0_10px_20px_rgba(59,130,246,0.35)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base Glow Ring */}
          <ellipse cx="80" cy="115" rx="55" ry="18" fill="url(#cardGlow)" opacity="0.6" />
          <path
            d="M25 115 C25 105 135 105 135 115 C135 125 25 125 25 115 Z"
            stroke="#00E5FF"
            strokeWidth="2"
            fill="none"
            opacity="0.8"
          />

          {/* Isometric Server Cube */}
          <g transform="translate(0, -10)">
            {/* Top Face */}
            <polygon
              points="80,30 118,50 80,70 42,50"
              fill="url(#cardTopGrad)"
              stroke="#00E5FF"
              strokeWidth="2"
            />
            {/* Top inner rim */}
            <polygon
              points="80,36 110,51 80,66 50,51"
              fill="#0F172A"
              stroke="#38BDF8"
              strokeWidth="1.5"
            />

            {/* Left Face */}
            <polygon
              points="42,50 80,70 80,115 42,95"
              fill="url(#cardLeftGrad)"
              stroke="#1E3A8A"
              strokeWidth="1.5"
            />
            {/* Left Face Accent lines */}
            <line x1="50" y1="60" x2="50" y2="95" stroke="#38BDF8" strokeWidth="1.5" opacity="0.6" />
            <line x1="58" y1="64" x2="58" y2="99" stroke="#38BDF8" strokeWidth="1.5" opacity="0.4" />
            <line x1="66" y1="68" x2="66" y2="103" stroke="#38BDF8" strokeWidth="1.5" opacity="0.4" />

            {/* Right Face (Screen) */}
            <polygon
              points="80,70 118,50 118,95 80,115"
              fill="url(#cardRightGrad)"
              stroke="#3B82F6"
              strokeWidth="1.5"
            />

            {/* Right Face Glowing UI Screen */}
            <polygon
              points="85,73 113,58 113,87 85,102"
              fill="#061226"
              stroke="#00E5FF"
              strokeWidth="1.5"
            />
            {/* Screen digital lines */}
            <line x1="89" y1="76" x2="109" y2="66" stroke="#00E5FF" strokeWidth="1.5" strokeDasharray="3 2" />
            <line x1="89" y1="82" x2="109" y2="72" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="2 1" />
            <line x1="89" y1="88" x2="105" y2="80" stroke="#00E5FF" strokeWidth="1.5" strokeDasharray="4 2" />
            <line x1="89" y1="94" x2="101" y2="88" stroke="#38BDF8" strokeWidth="1.5" />
          </g>

          {/* Gradients */}
          <defs>
            <radialGradient id="cardGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="cardTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="cardLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0C1B33" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="cardRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // Large banner variant
  return (
    <div className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}>
      {/* Ambient background blur */}
      <div className="absolute w-48 h-48 rounded-full bg-cyan-400/20 blur-2xl -top-6 -right-6 animate-pulse" />
      <div className="absolute w-40 h-40 rounded-full bg-indigo-500/30 blur-2xl bottom-0 left-0" />

      <svg
        viewBox="0 0 280 240"
        className="w-64 h-56 md:w-80 md:h-64 filter drop-shadow-[0_15px_30px_rgba(0,229,255,0.25)] animate-robot-bob"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Glowing Isometric Holographic Base Plate */}
        <g id="hologramBase">
          <ellipse cx="140" cy="180" rx="100" ry="34" fill="url(#bannerBaseGlow)" opacity="0.65" />
          {/* Base outer neon ring */}
          <ellipse
            cx="140"
            cy="180"
            rx="92"
            ry="30"
            stroke="url(#neonRingGrad)"
            strokeWidth="3"
            fill="none"
            opacity="0.9"
          />
          {/* Base inner neon ring */}
          <ellipse
            cx="140"
            cy="180"
            rx="75"
            ry="24"
            stroke="#00E5FF"
            strokeWidth="1.5"
            strokeDasharray="8 6"
            fill="none"
            opacity="0.75"
          />
          {/* Base guide rays */}
          <line x1="48" y1="180" x2="70" y2="180" stroke="#00E5FF" strokeWidth="2" opacity="0.8" />
          <line x1="210" y1="180" x2="232" y2="180" stroke="#00E5FF" strokeWidth="2" opacity="0.8" />
          <line x1="140" y1="150" x2="140" y2="162" stroke="#00E5FF" strokeWidth="2" opacity="0.8" />
          <line x1="140" y1="198" x2="140" y2="210" stroke="#00E5FF" strokeWidth="2" opacity="0.8" />
        </g>

        {/* Isometric 3D Server Tower Unit */}
        <g id="serverTower" transform="translate(0, -18)">
          {/* Main Top Face */}
          <polygon
            points="140,24 204,58 140,92 76,58"
            fill="url(#towerTopGrad)"
            stroke="#00E5FF"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Recessed Top Inset Socket */}
          <polygon
            points="140,36 188,60 140,84 92,60"
            fill="#050C1B"
            stroke="#38BDF8"
            strokeWidth="2"
          />
          <polygon
            points="140,44 176,61 140,78 104,61"
            fill="url(#socketCoreGrad)"
            stroke="#00E5FF"
            strokeWidth="1.5"
          />

          {/* Left Shaded Face */}
          <polygon
            points="76,58 140,92 140,172 76,138"
            fill="url(#towerLeftGrad)"
            stroke="#1E40AF"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Left Vertical Ventilation Fins */}
          <g opacity="0.75">
            <line x1="90" y1="76" x2="90" y2="136" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="102" y1="82" x2="102" y2="142" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="114" y1="88" x2="114" y2="148" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="126" y1="94" x2="126" y2="154" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Right Illuminated Face */}
          <polygon
            points="140,92 204,58 204,138 140,172"
            fill="url(#towerRightGrad)"
            stroke="#2563EB"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Glowing Digital Telemetry Screen Frame */}
          <polygon
            points="148,96 196,71 196,126 148,151"
            fill="#030712"
            stroke="#00E5FF"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Neon Telemetry Screen Code / Graphs */}
          <g>
            {/* Horizontal code/data lines */}
            <line x1="154" y1="101" x2="188" y2="84" stroke="#00E5FF" strokeWidth="2" strokeDasharray="5 3" />
            <line x1="154" y1="110" x2="184" y2="95" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4 2" />
            <line x1="154" y1="119" x2="190" y2="101" stroke="#00E5FF" strokeWidth="2" strokeDasharray="6 3" />
            <line x1="154" y1="128" x2="178" y2="116" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 2" />
            <line x1="154" y1="137" x2="188" y2="120" stroke="#00E5FF" strokeWidth="2" strokeDasharray="7 2" />
            <line x1="154" y1="144" x2="172" y2="135" stroke="#38BDF8" strokeWidth="2" />
          </g>

          {/* Isometric Edge Highlighting */}
          <line x1="140" y1="92" x2="140" y2="172" stroke="#67E8F9" strokeWidth="2" opacity="0.9" />
          <line x1="76" y1="58" x2="140" y2="92" stroke="#67E8F9" strokeWidth="1.5" opacity="0.6" />
          <line x1="140" y1="92" x2="204" y2="58" stroke="#67E8F9" strokeWidth="1.5" opacity="0.6" />
        </g>

        {/* Floating Sparks / Hologram Dots */}
        <circle cx="60" cy="40" r="3" fill="#00E5FF" opacity="0.8" />
        <circle cx="215" cy="45" r="2.5" fill="#E879F9" opacity="0.9" />
        <circle cx="230" cy="95" r="3.5" fill="#38BDF8" opacity="0.7" />
        <circle cx="55" cy="115" r="2" fill="#818CF8" opacity="0.8" />
        <circle cx="140" cy="10" r="2.5" fill="#00E5FF" opacity="0.9" />

        {/* Gradients */}
        <defs>
          <radialGradient id="bannerBaseGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#2563EB" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="neonRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>

          <linearGradient id="towerTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>

          <linearGradient id="socketCoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="towerLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#09142A" />
            <stop offset="100%" stopColor="#152648" />
          </linearGradient>

          <linearGradient id="towerRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#172F66" />
            <stop offset="100%" stopColor="#224490" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
