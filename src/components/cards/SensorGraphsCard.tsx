import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { HistoryPoint } from '../../data/mockData';

interface Props { history: HistoryPoint[]; }

const TABS = [
  { key: 'temperature', label: 'Temp', unit: '°C', color: '#00E5FF', domain: [0, 80] as [number, number] },
  { key: 'humidity', label: 'Humidity', unit: '%', color: '#3B82F6', domain: [0, 100] as [number, number] },
  { key: 'gas', label: 'Gas', unit: 'ppm', color: '#FBBF24', domain: [0, 500] as [number, number] },
  { key: 'distance', label: 'Distance', unit: 'cm', color: '#22C55E', domain: [0, 200] as [number, number] },
  { key: 'flame', label: 'Flame', unit: '', color: '#FF6B2C', domain: [0, 1] as [number, number] },
] as const;

type TabKey = typeof TABS[number]['key'];

function CustomTooltip({ active, payload, label, unit }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="glass-sm px-3 py-2"
      style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
    >
      <div className="text-xs mb-1" style={{ color: 'rgba(240,246,255,0.5)', fontFamily: 'JetBrains Mono' }}>{label}</div>
      <div className="text-sm font-bold" style={{ color: payload[0].color, fontFamily: 'JetBrains Mono' }}>
        {typeof payload[0].value === 'number' ? payload[0].value.toFixed(1) : payload[0].value}{unit}
      </div>
    </div>
  );
}

export default function SensorGraphsCard({ history }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('temperature');
  const tab = TABS.find(t => t.key === activeTab)!;

  return (
    <div className="glass h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold" style={{ color: '#F0F6FF' }}>Real-Time Sensor Graphs</h3>
        <span className="text-xs" style={{ color: 'rgba(240,246,255,0.35)', fontFamily: 'JetBrains Mono' }}>
          Last 10 min · 15s intervals
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-3 overflow-x-auto pb-1">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 transition-all"
            style={{
              background: activeTab === t.key ? `${t.color}18` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${activeTab === t.key ? `${t.color}40` : 'rgba(255,255,255,0.07)'}`,
              color: activeTab === t.key ? t.color : 'rgba(240,246,255,0.4)',
              cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="flex-1" style={{ minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${activeTab}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={tab.color} stopOpacity={0.25}/>
                <stop offset="95%" stopColor={tab.color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
            <XAxis
              dataKey="time"
              tick={{ fill: 'rgba(240,246,255,0.25)', fontSize: 8, fontFamily: 'JetBrains Mono' }}
              tickLine={false}
              axisLine={false}
              interval={9}
            />
            <YAxis
              domain={tab.domain}
              tick={{ fill: 'rgba(240,246,255,0.25)', fontSize: 8, fontFamily: 'JetBrains Mono' }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip content={<CustomTooltip unit={tab.unit} />} />
            <Area
              type="monotone"
              dataKey={activeTab}
              stroke={tab.color}
              strokeWidth={2}
              fill={`url(#grad-${activeTab})`}
              dot={false}
              activeDot={{ r: 4, fill: tab.color, stroke: 'rgba(7,11,20,0.8)', strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
