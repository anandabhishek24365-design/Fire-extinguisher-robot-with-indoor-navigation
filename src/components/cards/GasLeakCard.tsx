import { Wind } from 'lucide-react';
import { getGasZone, THRESHOLDS } from '../../data/mockData';

interface Props { gas: number; lastUpdated: number; }

export default function GasLeakCard({ gas, lastUpdated }: Props) {
  const zone = getGasZone(gas);
  const maxPPM = 500;
  const pct = Math.min(gas / maxPPM, 1);

  // Arc SVG
  const r = 48, cx = 70, cy = 70;
  const startAngle = -210, totalDeg = 240;
  const fillDeg = pct * totalDeg;
  function polar(deg: number) {
    const rad = deg * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }
  const s = polar(startAngle);
  const e = polar(startAngle + fillDeg);
  const end = polar(startAngle + totalDeg);
  const bgArc = `M ${s.x} ${s.y} A ${r} ${r} 0 1 1 ${end.x} ${end.y}`;
  const fillArc = fillDeg > 0 ? `M ${s.x} ${s.y} A ${r} ${r} 0 ${fillDeg > 180 ? 1 : 0} 1 ${e.x} ${e.y}` : '';

  return (
    <div
      className="glass h-full flex flex-col p-4"
      style={zone.label === 'Danger' ? {
        border: '1px solid rgba(255,46,46,0.3)',
        boxShadow: '0 0 20px rgba(255,46,46,0.08)',
      } : zone.label === 'Elevated' ? {
        border: '1px solid rgba(251,191,36,0.25)',
      } : {}}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-semibold" style={{ color: '#F0F6FF' }}>Gas Sensor</h3>
        <span className="text-xs" style={{ color: 'rgba(240,246,255,0.4)' }}>MQ-2</span>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <svg width="140" height="110" viewBox="0 0 140 110">
          {/* Background arc */}
          <path d={bgArc} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" strokeLinecap="round"/>
          {/* Safe zone marker */}
          <path
            d={`M ${polar(startAngle).x} ${polar(startAngle).y} A ${r} ${r} 0 0 1 ${polar(startAngle + (THRESHOLDS.gasElevated / maxPPM) * totalDeg).x} ${polar(startAngle + (THRESHOLDS.gasElevated / maxPPM) * totalDeg).y}`}
            fill="none" stroke="rgba(34,197,94,0.15)" strokeWidth="10" strokeLinecap="round"
          />
          {/* Elevated zone marker */}
          <path
            d={`M ${polar(startAngle + (THRESHOLDS.gasElevated / maxPPM) * totalDeg).x} ${polar(startAngle + (THRESHOLDS.gasElevated / maxPPM) * totalDeg).y} A ${r} ${r} 0 0 1 ${polar(startAngle + (THRESHOLDS.gasDanger / maxPPM) * totalDeg).x} ${polar(startAngle + (THRESHOLDS.gasDanger / maxPPM) * totalDeg).y}`}
            fill="none" stroke="rgba(251,191,36,0.12)" strokeWidth="10"
          />
          {/* Danger zone */}
          <path
            d={`M ${polar(startAngle + (THRESHOLDS.gasDanger / maxPPM) * totalDeg).x} ${polar(startAngle + (THRESHOLDS.gasDanger / maxPPM) * totalDeg).y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`}
            fill="none" stroke="rgba(255,46,46,0.1)" strokeWidth="10" strokeLinecap="round"
          />
          {/* Fill arc */}
          {fillArc && (
            <path d={fillArc} fill="none" stroke={zone.color} strokeWidth="10" strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 6px ${zone.color}60)`, transition: 'all 0.7s ease' }}/>
          )}
          {/* Value */}
          <text x={cx} y={cy - 2} textAnchor="middle" fill={zone.color} fontSize="20" fontFamily="JetBrains Mono" fontWeight="600">
            {gas}
          </text>
          <text x={cx} y={cy + 14} textAnchor="middle" fill="rgba(240,246,255,0.4)" fontSize="7" fontFamily="JetBrains Mono">
            PPM
          </text>
          {/* Zone labels */}
          <text x="18" y="105" fill="rgba(34,197,94,0.5)" fontSize="6" fontFamily="JetBrains Mono">Safe</text>
          <text x="56" y="115" fill="rgba(251,191,36,0.5)" fontSize="6" fontFamily="JetBrains Mono">Elev.</text>
          <text x="104" y="105" fill="rgba(255,46,46,0.5)" fontSize="6" fontFamily="JetBrains Mono">Danger</text>
        </svg>
      </div>

      {/* Zone badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Wind size={12} style={{ color: zone.color }} />
          <span className="text-sm font-semibold" style={{ color: zone.color }}>{zone.label}</span>
        </div>
        <div className="text-xs" style={{ color: 'rgba(240,246,255,0.4)' }}>
          Threshold: {THRESHOLDS.gasDanger} ppm
        </div>
      </div>

      <div className="mt-2 text-xs text-right" style={{ color: 'rgba(240,246,255,0.3)', fontFamily: 'JetBrains Mono' }}>
        Updated {lastUpdated}s ago
      </div>
    </div>
  );
}
