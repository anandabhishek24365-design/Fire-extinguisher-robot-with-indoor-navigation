interface Props { battery: number; voltage: number; lastUpdated: number; }

export default function BatteryCard({ battery, voltage, lastUpdated }: Props) {
  const color = battery > 50 ? '#00E5FF' : battery > 20 ? '#FBBF24' : '#FF2E2E';
  const runtime = Math.round((battery / 100) * 4 * 60); // minutes
  const hours = Math.floor(runtime / 60);
  const mins = runtime % 60;

  // Arc calculation
  const r = 52, cx = 70, cy = 75;
  const startAngle = -210, endAngle = 30;
  const totalDeg = endAngle - startAngle;
  const fillDeg = (battery / 100) * totalDeg;
  function polarToCart(deg: number) {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }
  const s = polarToCart(startAngle);
  const e = polarToCart(startAngle + fillDeg);
  const eEnd = polarToCart(endAngle);
  const arcPath = `M ${s.x} ${s.y} A ${r} ${r} 0 ${fillDeg > 180 ? 1 : 0} 1 ${e.x} ${e.y}`;
  const bgPath = `M ${s.x} ${s.y} A ${r} ${r} 0 1 1 ${eEnd.x} ${eEnd.y}`;

  return (
    <div className="glass h-full flex flex-col p-4">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-semibold" style={{ color: '#F0F6FF' }}>Battery</h3>
        <span className="text-xs" style={{ color: 'rgba(240,246,255,0.4)', fontFamily: 'JetBrains Mono' }}>12V Li-ion</span>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <svg width="140" height="100" viewBox="0 0 140 100">
          {/* Background arc */}
          <path d={bgPath} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" strokeLinecap="round"/>
          {/* Filled arc */}
          <path d={arcPath} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}/>
          {/* Center text */}
          <text x={cx} y={cy - 6} textAnchor="middle" fill={color} fontSize="22" fontFamily="JetBrains Mono" fontWeight="600"
            style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}>
            {battery}%
          </text>
          <text x={cx} y={cy + 12} textAnchor="middle" fill="rgba(240,246,255,0.5)" fontSize="8" fontFamily="JetBrains Mono">
            {voltage}V
          </text>
        </svg>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs" style={{ color: 'rgba(240,246,255,0.4)' }}>Est. Runtime</div>
          <div className="text-sm font-semibold mt-0.5" style={{ color: '#F0F6FF', fontFamily: 'JetBrains Mono' }}>
            {hours}h {mins}m
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs" style={{ color: 'rgba(240,246,255,0.4)' }}>Status</div>
          <div className="text-sm font-semibold mt-0.5" style={{ color }}>
            {battery > 50 ? 'Good' : battery > 20 ? 'Low' : 'Critical'}
          </div>
        </div>
      </div>

      <div className="mt-2 text-xs text-right" style={{ color: 'rgba(240,246,255,0.3)', fontFamily: 'JetBrains Mono' }}>
        Updated {lastUpdated}s ago
      </div>
    </div>
  );
}
