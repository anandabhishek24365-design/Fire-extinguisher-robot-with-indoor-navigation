import { THRESHOLDS } from '../../data/mockData';

interface Props { distance: number; lastUpdated: number; }

export default function ObstacleCard({ distance, lastUpdated }: Props) {
  const warning = distance <= THRESHOLDS.obstacleWarning;
  const color = distance <= THRESHOLDS.obstacleWarning ? '#FF2E2E' : distance <= 50 ? '#FBBF24' : '#00E5FF';
  const maxDist = 200; // cm
  const robotY = 150;
  const obstacleY = robotY - Math.min((distance / maxDist) * 120, 120);

  return (
    <div
      className="glass h-full flex flex-col p-4"
      style={warning ? { border: '1px solid rgba(255,46,46,0.3)', boxShadow: '0 0 20px rgba(255,46,46,0.08)' } : {}}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-semibold" style={{ color: '#F0F6FF' }}>Obstacle Distance</h3>
        <span className="text-xs" style={{ color: 'rgba(240,246,255,0.4)' }}>HC-SR04</span>
      </div>

      {/* Radar arc visualization */}
      <div className="flex-1 flex items-center justify-center">
        <svg width="160" height="120" viewBox="0 0 160 130">
          {/* Radar arcs */}
          {[30, 55, 80, 105].map((r, i) => (
            <path
              key={r}
              d={`M ${80 - r} 120 A ${r} ${r} 0 0 1 ${80 + r} 120`}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          ))}
          {/* Sweep line */}
          <line x1="80" y1="120" x2="80" y2="20" stroke={`${color}30`} strokeWidth="1.5" strokeDasharray="3,3"/>
          <line x1="80" y1="120" x2="20" y2="50" stroke={`${color}15`} strokeWidth="1" strokeDasharray="3,3"/>
          <line x1="80" y1="120" x2="140" y2="50" stroke={`${color}15`} strokeWidth="1" strokeDasharray="3,3"/>

          {/* Obstacle marker */}
          {distance < maxDist && (
            <>
              <circle
                cx="80"
                cy={obstacleY}
                r="7"
                fill={`${color}30`}
                stroke={color}
                strokeWidth="1.5"
              >
                {warning && <animate attributeName="r" values="7;11;7" dur="1s" repeatCount="indefinite"/>}
              </circle>
              {warning && (
                <circle cx="80" cy={obstacleY} r="14" fill="none" stroke={color} strokeWidth="1" opacity="0.4">
                  <animate attributeName="r" values="14;22;14" dur="1s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="1s" repeatCount="indefinite"/>
                </circle>
              )}
            </>
          )}

          {/* Robot position */}
          <rect x="72" y="112" width="16" height="10" rx="2" fill={`${color}60`} stroke={color} strokeWidth="1.5"/>
          <circle cx="80" cy="117" r="2" fill={color}/>

          {/* Distance line */}
          {distance < maxDist && (
            <line x1="80" y1={robotY} x2="80" y2={obstacleY} stroke={color} strokeWidth="1.5" strokeDasharray="3,2" opacity="0.6"/>
          )}

          {/* Range labels */}
          <text x="130" y="105" fill="rgba(255,255,255,0.15)" fontSize="6" fontFamily="JetBrains Mono">30cm</text>
          <text x="130" y="80" fill="rgba(255,255,255,0.15)" fontSize="6" fontFamily="JetBrains Mono">80cm</text>
          <text x="130" y="55" fill="rgba(255,255,255,0.15)" fontSize="6" fontFamily="JetBrains Mono">130cm</text>
        </svg>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span
            className="text-2xl font-bold"
            style={{ color, fontFamily: 'JetBrains Mono', filter: `drop-shadow(0 0 8px ${color}60)` }}
          >
            {distance}
          </span>
          <span className="text-sm ml-1" style={{ color: 'rgba(240,246,255,0.5)' }}>cm</span>
        </div>
        {warning && (
          <span className="text-xs font-semibold animate-pulse-slow" style={{ color: '#FF2E2E' }}>
            ⚠ Obstacle Near
          </span>
        )}
      </div>

      <div className="mt-1 text-xs text-right" style={{ color: 'rgba(240,246,255,0.3)', fontFamily: 'JetBrains Mono' }}>
        Updated {lastUpdated}s ago
      </div>
    </div>
  );
}
