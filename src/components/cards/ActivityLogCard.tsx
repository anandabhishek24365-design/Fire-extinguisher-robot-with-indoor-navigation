import { LogEntry, formatTimeAgo } from '../../data/mockData';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';

interface Props { logs: LogEntry[]; }

export default function ActivityLogCard({ logs }: Props) {
  return (
    <div className="glass h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold" style={{ color: '#F0F6FF' }}>Activity Log</h3>
        <span className="text-xs" style={{ color: 'rgba(240,246,255,0.3)', fontFamily: 'JetBrains Mono' }}>
          {logs.length} events
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-0" style={{ minHeight: 0 }}>
        {logs.map((log, idx) => {
          const color = log.severity === 'critical' ? '#FF2E2E' : log.severity === 'warning' ? '#FBBF24' : 'rgba(240,246,255,0.3)';
          const Icon = log.severity === 'critical' ? AlertCircle : log.severity === 'warning' ? AlertTriangle : Info;
          return (
            <div
              key={log.id}
              className="flex items-start gap-2.5 py-2.5"
              style={{ borderBottom: idx < logs.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
            >
              {/* Timeline line */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: `${color}18`, border: `1px solid ${color}30` }}
                >
                  <Icon size={10} style={{ color }} />
                </div>
                {idx < logs.length - 1 && (
                  <div className="w-px flex-1 mt-1" style={{ minHeight: 12, background: 'rgba(255,255,255,0.06)' }} />
                )}
              </div>

              <div className="flex-1 min-w-0 pb-1">
                <div className="text-xs leading-relaxed" style={{ color: log.severity === 'critical' ? 'rgba(240,246,255,0.85)' : 'rgba(240,246,255,0.6)' }}>
                  {log.event}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(240,246,255,0.25)', fontFamily: 'JetBrains Mono' }}>
                  {formatTimeAgo(log.time)}
                </div>
              </div>

              <span
                className="text-xs px-1.5 py-0.5 rounded flex-shrink-0"
                style={{
                  background: `${color}12`,
                  color,
                  fontSize: 9,
                  fontFamily: 'JetBrains Mono',
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                }}
              >
                {log.severity}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
