import { useState } from 'react';
import { Droplets, Power } from 'lucide-react';
import { PumpState } from '../../data/mockData';

interface Props { pumpState: PumpState; pumpDuration: number; onToggle: () => void; }

export default function WaterPumpCard({ pumpState, pumpDuration, onToggle }: Props) {
  const spraying = pumpState === 'spraying';

  return (
    <div
      className="glass h-full flex flex-col p-4"
      style={spraying ? { border: '1px solid rgba(59,130,246,0.3)', boxShadow: '0 0 20px rgba(59,130,246,0.1)' } : {}}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold" style={{ color: '#F0F6FF' }}>Water Pump</h3>
        <span
          className="status-badge"
          style={{
            background: spraying ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${spraying ? 'rgba(59,130,246,0.35)' : 'rgba(255,255,255,0.1)'}`,
            color: spraying ? '#3B82F6' : 'rgba(240,246,255,0.4)',
          }}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${spraying ? 'animate-pulse-slow' : ''}`}
            style={{ background: spraying ? '#3B82F6' : 'rgba(240,246,255,0.3)' }} />
          {spraying ? 'Spraying' : 'Standby'}
        </span>
      </div>

      {/* Visualization */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative">
          <svg width="110" height="90" viewBox="0 0 110 90">
            {/* Pump body */}
            <rect x="30" y="30" width="50" height="45" rx="8" fill={spraying ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.06)'}
              stroke={spraying ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.15)'} strokeWidth="1.5"/>
            {/* Motor */}
            <circle cx="55" cy="52" r="14" fill={spraying ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)'}
              stroke={spraying ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.1)'} strokeWidth="1.5"/>
            {spraying && (
              <circle cx="55" cy="52" r="8" fill="none" stroke="rgba(59,130,246,0.6)" strokeWidth="1.5">
                <animateTransform attributeName="transform" type="rotate" from="0 55 52" to="360 55 52" dur="0.8s" repeatCount="indefinite"/>
              </circle>
            )}
            <circle cx="55" cy="52" r="4" fill={spraying ? '#3B82F6' : 'rgba(255,255,255,0.15)'}/>
            {/* Nozzle */}
            <line x1="80" y1="45" x2="100" y2="38" stroke={spraying ? 'rgba(59,130,246,0.6)' : 'rgba(255,255,255,0.15)'} strokeWidth="3" strokeLinecap="round"/>
            {/* Water spray */}
            {spraying && (
              <g opacity="0.7">
                {[0, 1, 2, 3].map(i => (
                  <line
                    key={i}
                    x1="100"
                    y1="38"
                    x2={105 + i * 2}
                    y2={32 + i * 5}
                    stroke="#60A5FA"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray="2,2"
                  >
                    <animate attributeName="opacity" values="0.8;0.2;0.8" dur={`${0.4 + i * 0.1}s`} repeatCount="indefinite"/>
                    <animate attributeName="x2" values={`${105 + i * 2};${108 + i * 2};${105 + i * 2}`} dur={`${0.4 + i * 0.1}s`} repeatCount="indefinite"/>
                  </line>
                ))}
              </g>
            )}
            {/* Inlet pipe */}
            <line x1="55" y1="30" x2="55" y2="15" stroke={spraying ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.1)'} strokeWidth="4" strokeLinecap="round"/>
            <rect x="45" y="8" width="20" height="10" rx="3" fill={spraying ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)'}
              stroke={spraying ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.08)'} strokeWidth="1"/>
          </svg>
        </div>
      </div>

      {/* Duration */}
      {spraying && pumpDuration > 0 && (
        <div className="text-center mb-3">
          <div className="text-xs" style={{ color: 'rgba(240,246,255,0.4)' }}>Spray Duration</div>
          <div className="text-lg font-bold" style={{ color: '#3B82F6', fontFamily: 'JetBrains Mono' }}>
            {pumpDuration}s
          </div>
        </div>
      )}

      {/* Manual toggle */}
      <button
        onClick={onToggle}
        className="w-full py-2 flex items-center justify-center gap-2 text-sm font-semibold rounded-xl transition-all"
        style={{
          background: spraying ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.06)',
          border: `1px solid ${spraying ? 'rgba(59,130,246,0.35)' : 'rgba(255,255,255,0.1)'}`,
          color: spraying ? '#3B82F6' : 'rgba(240,246,255,0.6)',
          cursor: 'pointer',
        }}
      >
        <Power size={13} />
        {spraying ? 'Deactivate Pump' : 'Manual Activate'}
      </button>
    </div>
  );
}
