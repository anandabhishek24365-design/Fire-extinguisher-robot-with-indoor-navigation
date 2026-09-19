import { Thermometer, Droplets } from 'lucide-react';
import { HistoryPoint, THRESHOLDS } from '../../data/mockData';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface Props {
  temperature: number;
  humidity: number;
  history: HistoryPoint[];
  lastUpdated: number;
}

export default function TempHumidityCard({ temperature, humidity, history, lastUpdated }: Props) {
  const tempHigh = temperature >= THRESHOLDS.temperatureHigh;
  const tempColor = temperature >= THRESHOLDS.temperatureHigh
    ? '#FF2E2E'
    : temperature >= 40 ? '#FBBF24' : '#00E5FF';
  const tempPct = Math.min((temperature / 80) * 100, 100);
  const humPct = humidity;

  return (
    <div className="glass h-full flex flex-col p-4">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold" style={{ color: '#F0F6FF' }}>Temp & Humidity</h3>
        <span className="text-xs" style={{ color: 'rgba(240,246,255,0.4)' }}>DHT11</span>
      </div>

      {/* Temperature */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${tempColor}18`, border: `1px solid ${tempColor}30` }}
        >
          <Thermometer size={18} style={{ color: tempColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1 mb-1">
            <span
              className="text-2xl font-bold text-glow-cyan"
              style={{ color: tempColor, fontFamily: 'JetBrains Mono', lineHeight: 1, filter: `drop-shadow(0 0 8px ${tempColor}80)` }}
            >
              {temperature.toFixed(1)}
            </span>
            <span className="text-sm" style={{ color: 'rgba(240,246,255,0.5)' }}>°C</span>
            {tempHigh && (
              <span className="ml-1 text-xs font-semibold animate-pulse-slow" style={{ color: '#FF2E2E' }}>HIGH</span>
            )}
          </div>
          {/* Threshold bar */}
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${tempPct}%`, background: `linear-gradient(90deg, #00E5FF, ${tempColor})` }}
            />
          </div>
          <div className="flex justify-between mt-0.5">
            <span className="text-xs" style={{ color: 'rgba(240,246,255,0.3)', fontSize: 9 }}>0°C</span>
            <span className="text-xs" style={{ color: '#FBBF24', fontSize: 9 }}>Alert: {THRESHOLDS.temperatureHigh}°C</span>
            <span className="text-xs" style={{ color: 'rgba(240,246,255,0.3)', fontSize: 9 }}>80°C</span>
          </div>
        </div>
      </div>

      {/* Humidity */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)' }}
        >
          <Droplets size={18} style={{ color: '#3B82F6' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-2xl font-bold" style={{ color: '#3B82F6', fontFamily: 'JetBrains Mono', lineHeight: 1 }}>
              {humidity.toFixed(1)}
            </span>
            <span className="text-sm" style={{ color: 'rgba(240,246,255,0.5)' }}>%</span>
          </div>
          {/* Humidity gauge */}
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${humPct}%`, background: 'linear-gradient(90deg, #3B82F6, #60A5FA)' }}
            />
          </div>
          <div className="flex justify-between mt-0.5">
            <span className="text-xs" style={{ color: 'rgba(240,246,255,0.3)', fontSize: 9 }}>0%</span>
            <span className="text-xs" style={{ color: 'rgba(240,246,255,0.3)', fontSize: 9 }}>100%</span>
          </div>
        </div>
      </div>

      {/* Sparkline */}
      <div className="flex-1" style={{ minHeight: 48 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history.slice(-20)} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={tempColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={tempColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="temperature" stroke={tempColor} strokeWidth={1.5} fill="url(#tempGrad)" dot={false} isAnimationActive={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-1 text-xs text-right" style={{ color: 'rgba(240,246,255,0.3)', fontFamily: 'JetBrains Mono' }}>
        Updated {lastUpdated}s ago
      </div>
    </div>
  );
}
