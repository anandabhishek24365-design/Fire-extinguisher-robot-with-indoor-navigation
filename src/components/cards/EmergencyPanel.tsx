import { useState } from 'react';
import { AlertTriangle, CheckCircle, Phone, Truck, Droplets, Bell, Volume2 } from 'lucide-react';
import { AlertItem, formatTimeAgo } from '../../data/mockData';

interface Props {
  alerts: AlertItem[];
  emergency: boolean;
  robot: { buzzerActive: boolean; oledAlert: boolean };
  onAcknowledge: (id: string) => void;
}

export default function EmergencyPanel({ alerts, emergency, robot, onAcknowledge }: Props) {
  const [history] = useState([
    { id: 'h1', time: new Date(Date.now() - 3600000), message: 'Patrol completed — Sector A', severity: 'info' as const },
    { id: 'h2', time: new Date(Date.now() - 7200000), message: 'Battery low warning cleared', severity: 'warning' as const },
    { id: 'h3', time: new Date(Date.now() - 86400000), message: 'Gas elevated — 160 ppm (auto-resolved)', severity: 'warning' as const },
  ]);

  const unackAlerts = alerts.filter(a => !a.acknowledged);
  const isFireAlert = unackAlerts.some(a => a.message.includes('FIRE'));
  const isGasAlert = unackAlerts.some(a => a.message.includes('GAS'));

  return (
    <div
      className="glass h-full flex flex-col"
      style={emergency ? {
        border: '1px solid rgba(255,46,46,0.4)',
        animation: 'border-flash 1s ease-in-out infinite',
      } : {}}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 className="text-sm font-semibold" style={{ color: '#F0F6FF' }}>Emergency Alert Panel</h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Main alert banner */}
        {!emergency ? (
          <div
            className="mx-4 mt-3 px-4 py-3 rounded-xl flex items-center gap-3"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}
          >
            <CheckCircle size={18} style={{ color: '#22C55E', flexShrink: 0 }} />
            <div>
              <div className="text-sm font-semibold" style={{ color: '#22C55E' }}>All Systems Normal</div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(240,246,255,0.4)' }}>No active alerts · Robot patrolling</div>
            </div>
          </div>
        ) : (
          <div className="mx-4 mt-3 space-y-2">
            {isFireAlert && (
              <div
                className="px-4 py-3 rounded-xl animate-fire-pulse"
                style={{ background: 'rgba(255,46,46,0.12)', border: '1px solid rgba(255,46,46,0.4)' }}
              >
                <div className="flex items-start gap-2 mb-2">
                  <AlertTriangle size={16} style={{ color: '#FF2E2E', flexShrink: 0, marginTop: 1 }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold" style={{ color: '#FF2E2E' }}>FIRE DETECTED</div>
                    <div className="text-xs mt-0.5" style={{ color: 'rgba(240,246,255,0.6)' }}>
                      Flame sensor triggered — Temp 68.5°C — MQ-2 at 420 ppm
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'rgba(240,246,255,0.35)', fontFamily: 'JetBrains Mono' }}>
                      {formatTimeAgo(alerts[0]?.timestamp || new Date())}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <ActionBtn icon={<Truck size={11} />} label="Dispatch Robot" color="#FF6B2C" />
                  <ActionBtn icon={<Droplets size={11} />} label="Activate Pump" color="#3B82F6" />
                  <ActionBtn icon={<CheckCircle size={11} />} label="Acknowledge" color="#22C55E" onClick={() => alerts[0] && onAcknowledge(alerts[0].id)} />
                  <ActionBtn icon={<Phone size={11} />} label="Call Emergency" color="#FF2E2E" />
                </div>
              </div>
            )}
            {isGasAlert && (
              <div
                className="px-4 py-3 rounded-xl"
                style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)' }}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} style={{ color: '#FBBF24', flexShrink: 0 }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold" style={{ color: '#FBBF24' }}>GAS LEAK DETECTED</div>
                    <div className="text-xs mt-0.5" style={{ color: 'rgba(240,246,255,0.5)' }}>
                      MQ-2 above danger threshold (420 ppm &gt; 300 ppm)
                    </div>
                  </div>
                  <button
                    onClick={() => alerts[1] && onAcknowledge(alerts[1].id)}
                    className="btn-glass px-2 py-1 text-xs flex-shrink-0"
                    style={{ color: '#FBBF24' }}
                  >
                    ACK
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Local alarm status */}
        <div className="mx-4 mt-3 grid grid-cols-2 gap-2">
          <div
            className="rounded-lg px-3 py-2 flex items-center gap-2"
            style={{
              background: robot.buzzerActive ? 'rgba(255,107,44,0.1)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${robot.buzzerActive ? 'rgba(255,107,44,0.25)' : 'rgba(255,255,255,0.07)'}`,
            }}
          >
            <Volume2 size={12} style={{ color: robot.buzzerActive ? '#FF6B2C' : 'rgba(240,246,255,0.3)' }} />
            <span className="text-xs font-medium" style={{ color: robot.buzzerActive ? '#FF6B2C' : 'rgba(240,246,255,0.35)' }}>
              Buzzer {robot.buzzerActive ? 'ON' : 'Off'}
            </span>
          </div>
          <div
            className="rounded-lg px-3 py-2 flex items-center gap-2"
            style={{
              background: robot.oledAlert ? 'rgba(255,107,44,0.1)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${robot.oledAlert ? 'rgba(255,107,44,0.25)' : 'rgba(255,255,255,0.07)'}`,
            }}
          >
            <Bell size={12} style={{ color: robot.oledAlert ? '#FF6B2C' : 'rgba(240,246,255,0.3)' }} />
            <span className="text-xs font-medium" style={{ color: robot.oledAlert ? '#FF6B2C' : 'rgba(240,246,255,0.35)' }}>
              OLED {robot.oledAlert ? 'Alert' : 'Clear'}
            </span>
          </div>
        </div>

        {/* Alert history */}
        <div className="mx-4 mt-3 mb-4">
          <div className="text-xs font-medium mb-2" style={{ color: 'rgba(240,246,255,0.4)' }}>Alert History</div>
          <div className="space-y-1.5">
            {history.map(h => (
              <div key={h.id} className="flex items-start gap-2 py-1.5 px-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div
                  className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: h.severity === 'warning' ? '#FBBF24' : '#3B82F6' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs" style={{ color: 'rgba(240,246,255,0.6)' }}>{h.message}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgba(240,246,255,0.3)', fontFamily: 'JetBrains Mono' }}>
                    {formatTimeAgo(h.time)}
                  </div>
                </div>
                <span
                  className="text-xs px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{
                    background: h.severity === 'warning' ? 'rgba(251,191,36,0.1)' : 'rgba(59,130,246,0.1)',
                    color: h.severity === 'warning' ? '#FBBF24' : '#3B82F6',
                    fontSize: 9,
                  }}
                >
                  {h.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ icon, label, color, onClick }: { icon: React.ReactNode; label: string; color: string; onClick?: () => void }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={() => { setPressed(true); onClick?.(); setTimeout(() => setPressed(false), 1000); }}
      className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all"
      style={{
        background: pressed ? `${color}25` : `${color}12`,
        border: `1px solid ${color}30`,
        color: pressed ? color : `${color}cc`,
        cursor: 'pointer',
      }}
    >
      {icon}
      {label}
    </button>
  );
}
