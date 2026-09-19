import { Flame } from 'lucide-react';

interface Props { irFlame: number; lastUpdated: number; }

export default function FlameSensorCard({ irFlame, lastUpdated }: Props) {
  const detected = irFlame === 1;

  return (
    <div
      className="glass h-full flex flex-col p-4"
      style={detected ? {
        border: '1px solid rgba(255,46,46,0.4)',
        boxShadow: '0 0 30px rgba(255,46,46,0.15), inset 0 0 30px rgba(255,46,46,0.05)',
      } : {}}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold" style={{ color: '#F0F6FF' }}>Flame Sensor</h3>
        <span className="text-xs" style={{ color: 'rgba(240,246,255,0.4)' }}>IR Detector</span>
      </div>

      {/* Main indicator */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <div className="relative">
          {detected && (
            <>
              <div
                className="absolute inset-0 rounded-full animate-pulse-slow"
                style={{ background: 'rgba(255,46,46,0.2)', transform: 'scale(1.8)', filter: 'blur(8px)' }}
              />
              <div
                className="absolute inset-0 rounded-full"
                style={{ background: 'rgba(255,107,44,0.15)', transform: 'scale(1.4)' }}
              >
                <div className="w-full h-full rounded-full animate-pulse-ring" style={{ background: 'rgba(255,46,46,0.3)' }} />
              </div>
            </>
          )}
          <div
            className="relative w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: detected
                ? 'linear-gradient(135deg, rgba(255,107,44,0.3), rgba(255,46,46,0.2))'
                : 'rgba(255,255,255,0.05)',
              border: `2px solid ${detected ? 'rgba(255,107,44,0.6)' : 'rgba(255,255,255,0.1)'}`,
            }}
          >
            <Flame size={28} style={{ color: detected ? '#FF6B2C' : 'rgba(240,246,255,0.2)' }} />
          </div>
        </div>

        <div className="text-center">
          <div
            className={`text-lg font-bold ${detected ? 'animate-pulse-slow' : ''}`}
            style={{ color: detected ? '#FF2E2E' : '#22C55E', fontFamily: 'JetBrains Mono' }}
          >
            {detected ? 'FLAME DETECTED' : 'No Flame'}
          </div>
          {detected && (
            <div className="text-xs mt-1" style={{ color: '#FF6B2C' }}>Flame within ~1 m</div>
          )}
        </div>

        {/* Signal bars */}
        <div className="flex items-end gap-1">
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className="rounded-sm transition-all duration-300"
              style={{
                width: 6,
                height: 6 + i * 4,
                background: detected
                  ? (i <= 5 ? '#FF6B2C' : 'rgba(255,255,255,0.1)')
                  : (i <= 2 ? '#22C55E' : 'rgba(255,255,255,0.1)'),
                opacity: detected ? 1 : i <= 2 ? 1 : 0.2,
              }}
            />
          ))}
        </div>
        <div className="text-xs" style={{ color: 'rgba(240,246,255,0.4)', fontFamily: 'JetBrains Mono' }}>
          Signal: {detected ? 'HIGH (Triggered)' : 'LOW (Clear)'}
        </div>
      </div>

      <div className="mt-2 text-xs text-right" style={{ color: 'rgba(240,246,255,0.3)', fontFamily: 'JetBrains Mono' }}>
        Updated {lastUpdated}s ago
      </div>
    </div>
  );
}
