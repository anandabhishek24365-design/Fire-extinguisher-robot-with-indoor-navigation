import { useState, useEffect } from 'react';
import { Bell, User, LogOut, Wifi, WifiOff } from 'lucide-react';
import { RobotState, SensorData, formatDuration } from '../data/mockData';

interface TopBarProps {
  robot: RobotState;
  sensor: SensorData;
  alertCount: number;
  emergency: boolean;
  connected: boolean;
  nextRefresh: number;
  onLogout: () => void;
  onToggleEmergency: () => void;
}

export default function TopBar({
  robot, sensor, alertCount, emergency, connected, nextRefresh, onLogout, onToggleEmergency,
}: TopBarProps) {
  const [time, setTime] = useState(new Date());
  const [showUser, setShowUser] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const robotOnline = robot.wifiStrength > -80;

  return (
    <header
      className="flex items-center gap-3 px-4 md:px-6 py-3 flex-shrink-0"
      style={{
        borderBottom: `1px solid ${emergency ? 'rgba(255,46,46,0.3)' : 'rgba(255,255,255,0.07)'}`,
        background: emergency
          ? 'rgba(255,46,46,0.04)'
          : 'rgba(7,11,20,0.6)',
        backdropFilter: 'blur(20px)',
        minHeight: 60,
      }}
    >
      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold leading-tight truncate" style={{ color: '#F0F6FF', letterSpacing: '-0.02em' }}>
          FireBot <span style={{ color: '#00E5FF' }}>Control Center</span>
        </h1>
        <div className="flex items-center gap-2 mt-0.5">
          {/* Connection pill */}
          <span
            className="status-badge"
            style={{
              background: connected ? 'rgba(34,197,94,0.12)' : 'rgba(255,46,46,0.12)',
              border: `1px solid ${connected ? 'rgba(34,197,94,0.3)' : 'rgba(255,46,46,0.3)'}`,
              color: connected ? '#22C55E' : '#FF2E2E',
            }}
          >
            {connected ? <Wifi size={9} /> : <WifiOff size={9} />}
            {connected ? 'ThingSpeak Connected' : 'Connection Lost'}
          </span>
          {/* Refresh countdown */}
          <span className="text-xs" style={{ color: 'rgba(240,246,255,0.3)', fontFamily: 'JetBrains Mono' }}>
            Refresh in {nextRefresh}s
          </span>
        </div>
      </div>

      {/* Robot status */}
      <div className="hidden md:flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${robotOnline ? 'animate-pulse-slow' : ''}`}
          style={{ background: robotOnline ? '#22C55E' : '#FF2E2E' }}
        />
        <span className="text-sm font-medium" style={{ color: robotOnline ? '#22C55E' : '#FF2E2E' }}>
          Robot {robotOnline ? 'Online' : 'Offline'}
        </span>
        <span className="text-xs ml-1" style={{ color: 'rgba(240,246,255,0.3)', fontFamily: 'JetBrains Mono' }}>
          {robot.wifiStrength} dBm
        </span>
      </div>

      {/* Clock */}
      <div className="hidden md:block text-right">
        <div
          className="text-sm font-medium"
          style={{ fontFamily: 'JetBrains Mono', color: '#F0F6FF', letterSpacing: '0.05em' }}
        >
          {time.toLocaleTimeString('en-US', { hour12: false })}
        </div>
        <div className="text-xs" style={{ color: 'rgba(240,246,255,0.4)', fontFamily: 'JetBrains Mono' }}>
          {time.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Demo toggle */}
      <button
        onClick={onToggleEmergency}
        className="btn-glass px-3 py-1.5 text-xs hidden md:block"
        style={{ color: emergency ? '#FF6B2C' : 'rgba(240,246,255,0.5)' }}
      >
        {emergency ? 'Normal Mode' : 'Simulate Emergency'}
      </button>

      {/* Bell */}
      <button
        className="relative p-2 rounded-lg"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}
      >
        <Bell size={16} style={{ color: alertCount > 0 ? '#FF6B2C' : 'rgba(240,246,255,0.5)' }} />
        {alertCount > 0 && (
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: '#FF2E2E', color: 'white', fontSize: 9 }}
          >
            {alertCount}
          </span>
        )}
      </button>

      {/* Avatar / logout */}
      <div className="relative">
        <button
          onClick={() => setShowUser(p => !p)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{
            background: 'linear-gradient(135deg, rgba(0,229,255,0.3), rgba(59,130,246,0.3))',
            border: '1px solid rgba(0,229,255,0.3)',
            color: '#00E5FF',
            cursor: 'pointer',
          }}
        >
          OP
        </button>
        {showUser && (
          <div
            className="absolute right-0 top-10 glass-sm p-2 z-50"
            style={{ minWidth: 160, boxShadow: '0 16px 40px rgba(0,0,0,0.4)' }}
          >
            <div className="px-3 py-2">
              <div className="text-sm font-medium" style={{ color: '#F0F6FF' }}>Operator</div>
              <div className="text-xs" style={{ color: 'rgba(240,246,255,0.4)' }}>operator@circuitech.io</div>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', margin: '4px 0' }} />
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
              style={{ color: '#FF6B2C', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <LogOut size={13} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
