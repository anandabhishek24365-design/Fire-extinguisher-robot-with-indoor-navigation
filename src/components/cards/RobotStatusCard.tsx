import { Wifi, MapPin, Clock } from 'lucide-react';
import { RobotState, getRobotStatusLabel, getRobotStatusColor, formatDuration } from '../../data/mockData';

interface Props { robot: RobotState; lastUpdated: number; }

export default function RobotStatusCard({ robot, lastUpdated }: Props) {
  const statusColor = getRobotStatusColor(robot.status);
  const statusLabel = getRobotStatusLabel(robot.status);

  return (
    <div className="glass h-full flex flex-col p-4">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold" style={{ color: '#F0F6FF' }}>Robot Status</h3>
        <span
          className="status-badge"
          style={{
            background: `${statusColor}18`,
            border: `1px solid ${statusColor}40`,
            color: statusColor,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse-slow" style={{ background: statusColor }} />
          {statusLabel}
        </span>
      </div>

      {/* Robot SVG */}
      <div className="flex-1 flex items-center justify-center py-2">
        <div className="animate-robot-bob relative">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${statusColor}20 0%, transparent 70%)`,
              transform: 'scale(1.5)',
            }}
          />
          <RobotSVG statusColor={statusColor} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mt-3">
        <StatItem icon={<Clock size={11} />} label="Mission" value={formatDuration(robot.missionDuration)} />
        <StatItem
          icon={<Wifi size={11} />}
          label="WiFi"
          value={`${robot.wifiStrength} dBm`}
          color={robot.wifiStrength > -70 ? '#22C55E' : robot.wifiStrength > -80 ? '#FBBF24' : '#FF2E2E'}
        />
        <StatItem
          icon={<MapPin size={11} />}
          label="GPS"
          value={robot.gpsLock ? 'Locked' : 'No Fix'}
          color={robot.gpsLock ? '#22C55E' : '#FF2E2E'}
        />
      </div>

      <div className="mt-2 text-xs text-right" style={{ color: 'rgba(240,246,255,0.3)', fontFamily: 'JetBrains Mono' }}>
        Updated {lastUpdated}s ago
      </div>
    </div>
  );
}

function StatItem({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color?: string }) {
  return (
    <div
      className="rounded-lg px-2 py-2 text-center"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex justify-center mb-1" style={{ color: 'rgba(240,246,255,0.3)' }}>{icon}</div>
      <div className="text-xs font-medium" style={{ color: color || '#F0F6FF', fontFamily: 'JetBrains Mono' }}>{value}</div>
      <div className="text-xs mt-0.5" style={{ color: 'rgba(240,246,255,0.35)', fontSize: 9 }}>{label}</div>
    </div>
  );
}

function RobotSVG({ statusColor }: { statusColor: string }) {
  return (
    <svg width="100" height="90" viewBox="0 0 100 90" fill="none">
      {/* Tracks */}
      <rect x="5" y="62" width="90" height="22" rx="11" fill="none" stroke={statusColor} strokeWidth="1.5" opacity="0.7"/>
      <circle cx="20" cy="73" r="7" fill="none" stroke={statusColor} strokeWidth="1.5" opacity="0.5"/>
      <circle cx="80" cy="73" r="7" fill="none" stroke={statusColor} strokeWidth="1.5" opacity="0.5"/>
      <circle cx="40" cy="73" r="4" fill="none" stroke={statusColor} strokeWidth="1" opacity="0.4"/>
      <circle cx="60" cy="73" r="4" fill="none" stroke={statusColor} strokeWidth="1" opacity="0.4"/>
      {/* Body */}
      <rect x="18" y="32" width="64" height="34" rx="7" fill={`${statusColor}15`} stroke={statusColor} strokeWidth="1.5" opacity="0.8"/>
      {/* Head */}
      <rect x="30" y="8" width="40" height="27" rx="6" fill={`${statusColor}12`} stroke={statusColor} strokeWidth="1.5" opacity="0.9"/>
      {/* Eyes */}
      <rect x="36" y="14" width="10" height="7" rx="2" fill={statusColor} opacity="0.8"/>
      <rect x="54" y="14" width="10" height="7" rx="2" fill={statusColor} opacity="0.8"/>
      {/* Camera / sensor */}
      <circle cx="50" cy="49" r="8" fill="none" stroke={statusColor} strokeWidth="1.5" opacity="0.6"/>
      <circle cx="50" cy="49" r="3" fill={statusColor} opacity="0.4"/>
      {/* Nozzle */}
      <path d="M78 45 L90 38 L92 42 L80 50" fill="none" stroke={statusColor} strokeWidth="1.5" opacity="0.5" strokeLinecap="round"/>
      {/* Antenna */}
      <line x1="50" y1="8" x2="50" y2="2" stroke={statusColor} strokeWidth="1.5" opacity="0.6"/>
      <circle cx="50" cy="1" r="2" fill={statusColor} opacity="0.8"/>
    </svg>
  );
}
