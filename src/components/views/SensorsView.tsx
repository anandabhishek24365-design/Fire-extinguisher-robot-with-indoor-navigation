import { useState } from 'react';
import {
  Thermometer,
  Droplets,
  Wind,
  Flame,
  Gauge,
  Ruler,
  Eye,
  Battery,
  Compass,
  MapPin,
  Waves,
  Clock,
  LineChart,
  Radio,
  ExternalLink,
  Plus,
  Zap,
} from 'lucide-react';
import { SensorData, RobotState } from '../../data/mockData';

interface SensorsViewProps {
  sensor: SensorData;
  robot: RobotState;
}

interface SensorItem {
  id: string;
  name: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical' | 'success';
  statusText: string;
  icon: React.ReactNode;
  updated: string;
  sparkline: number[];
}

export default function SensorsView({ sensor, robot }: SensorsViewProps) {
  const [timeFilter, setTimeFilter] = useState<'1M' | '5M' | '30M' | '1H'>('5M');
  const [activeChartTab, setActiveChartTab] = useState<'grid' | 'field1' | 'field2' | 'field3' | 'field4'>('grid');
  const [channelId, setChannelId] = useState('2768924');

  const sensors: SensorItem[] = [
    {
      id: 'temp',
      name: 'Temperature',
      value: sensor.temperature.toFixed(1),
      unit: '°C',
      status: sensor.temperature > 40 ? 'warning' : 'normal',
      statusText: sensor.temperature > 40 ? 'Elevated' : 'Optimal',
      icon: <Thermometer className="text-orange-500" size={20} />,
      updated: 'Just now',
      sparkline: [24.1, 24.5, 25.0, 26.2, 27.0, 28.4],
    },
    {
      id: 'humidity',
      name: 'Humidity',
      value: sensor.humidity.toString(),
      unit: '%',
      status: 'normal',
      statusText: 'Optimal',
      icon: <Droplets className="text-blue-500" size={20} />,
      updated: 'Just now',
      sparkline: [62, 63, 65, 64, 63, 64],
    },
    {
      id: 'smoke',
      name: 'Smoke Density',
      value: '12',
      unit: 'ppm',
      status: 'success',
      statusText: 'Clean Air',
      icon: <Wind className="text-slate-500" size={20} />,
      updated: 'Just now',
      sparkline: [10, 11, 12, 11, 13, 12],
    },
    {
      id: 'flame',
      name: 'Flame Sensor',
      value: sensor.irFlame ? '100' : '0',
      unit: '%',
      status: sensor.irFlame ? 'critical' : 'success',
      statusText: sensor.irFlame ? 'FIRE DETECTED' : 'No Flame',
      icon: <Flame className={sensor.irFlame ? 'text-red-600' : 'text-emerald-500'} size={20} />,
      updated: 'Just now',
      sparkline: [0, 0, 0, 0, sensor.irFlame ? 80 : 0, sensor.irFlame ? 100 : 0],
    },
    {
      id: 'gas',
      name: 'Combustible Gas',
      value: sensor.gas.toString(),
      unit: 'ppm',
      status: sensor.gas > 300 ? 'warning' : 'success',
      statusText: sensor.gas > 300 ? 'Elevated' : 'Safe Level',
      icon: <Gauge className="text-amber-500" size={20} />,
      updated: 'Just now',
      sparkline: [40, 42, 45, 43, 44, sensor.gas],
    },
    {
      id: 'dist',
      name: 'Ultrasonic Distance',
      value: sensor.distance.toString(),
      unit: 'cm',
      status: sensor.distance < 30 ? 'warning' : 'normal',
      statusText: sensor.distance < 30 ? 'Obstacle Near' : 'Clear Path',
      icon: <Ruler className="text-cyan-600" size={20} />,
      updated: 'Just now',
      sparkline: [120, 110, 95, 80, 60, sensor.distance],
    },
    {
      id: 'ir',
      name: 'IR Proximity Sensor',
      value: 'CLEAR',
      unit: 'state',
      status: 'success',
      statusText: 'Active Scan',
      icon: <Eye className="text-indigo-500" size={20} />,
      updated: 'Just now',
      sparkline: [1, 1, 1, 1, 1, 1],
    },
    {
      id: 'battery',
      name: 'LiFePO4 Battery',
      value: robot.battery.toString(),
      unit: '%',
      status: robot.battery < 20 ? 'warning' : 'success',
      statusText: robot.battery < 20 ? 'Low Charge' : 'Nominal (12.4V)',
      icon: <Battery className="text-emerald-600" size={20} />,
      updated: 'Just now',
      sparkline: [85, 83, 81, 80, 79, robot.battery],
    },
    {
      id: 'imu',
      name: 'IMU Orientation',
      value: '0.2° / 0.1°',
      unit: 'R/P',
      status: 'normal',
      statusText: 'Balanced',
      icon: <Compass className="text-purple-600" size={20} />,
      updated: 'Just now',
      sparkline: [0.1, 0.2, 0.1, 0.3, 0.2, 0.2],
    },
    {
      id: 'pos',
      name: 'Indoor Position',
      value: '24.5, 18.7',
      unit: 'X,Y m',
      status: 'normal',
      statusText: 'SLAM Tracking',
      icon: <MapPin className="text-blue-600" size={20} />,
      updated: 'Just now',
      sparkline: [12, 15, 18, 20, 22, 24.5],
    },
    {
      id: 'tank',
      name: 'Water Tank Level',
      value: '82',
      unit: '%',
      status: 'success',
      statusText: 'Full Capacity',
      icon: <Waves className="text-sky-500" size={20} />,
      updated: 'Just now',
      sparkline: [100, 95, 90, 88, 85, 82],
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-[1700px] mx-auto p-4 md:p-6">
      {/* Title & Time Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Real-Time Sensor Monitoring & ThingSpeak Live Charts
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Continuous telemetry feed from onboard sensor array via ThingSpeak IoT Channel #{channelId}
          </p>
        </div>

        {/* Time Filters */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1">
            <Clock size={13} /> Time Window:
          </span>
          {(['1M', '5M', '30M', '1H'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeFilter(tf)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                timeFilter === tf
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* ── 📊 DEDICATED THINGSPEAK LIVE CHARTS & GRAPH CONTAINER ── */}
      <div className="glass-card-light p-6 flex flex-col gap-4 border-2 border-blue-200/80 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/30">
              <LineChart size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">
                  ThingSpeak IoT Live Chart Panel
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold border border-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  CHANNEL {channelId} • LIVE SYNC
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Real-time cloud analytics iframe feed & field data graphs
              </p>
            </div>
          </div>

          {/* Field Selection Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold overflow-x-auto">
            {[
              { id: 'grid', label: 'All Charts Grid' },
              { id: 'field1', label: 'Field 1 (Temp)' },
              { id: 'field2', label: 'Field 2 (Humidity)' },
              { id: 'field3', label: 'Field 3 (Gas)' },
              { id: 'field4', label: 'Field 4 (Distance)' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveChartTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeChartTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Embed Display Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(activeChartTab === 'grid' || activeChartTab === 'field1') && (
            <ThingSpeakChartCard
              fieldNum={1}
              title="Field 1 — Temperature Stream (°C)"
              channelId={channelId}
              color="#2563EB"
              data={[24, 25, 26, 27, 28, sensor.temperature]}
            />
          )}

          {(activeChartTab === 'grid' || activeChartTab === 'field2') && (
            <ThingSpeakChartCard
              fieldNum={2}
              title="Field 2 — Relative Humidity (%)"
              channelId={channelId}
              color="#0284C7"
              data={[60, 62, 65, 64, 63, sensor.humidity]}
            />
          )}

          {(activeChartTab === 'grid' || activeChartTab === 'field3') && (
            <ThingSpeakChartCard
              fieldNum={3}
              title="Field 3 — MQ-2 Combustible Gas (ppm)"
              channelId={channelId}
              color="#F59E0B"
              data={[40, 42, 45, 48, 50, sensor.gas]}
            />
          )}

          {(activeChartTab === 'grid' || activeChartTab === 'field4') && (
            <ThingSpeakChartCard
              fieldNum={4}
              title="Field 4 — Ultrasonic Distance (cm)"
              channelId={channelId}
              color="#059669"
              data={[120, 100, 85, 70, 55, sensor.distance]}
            />
          )}
        </div>
      </div>

      {/* ── 11 SENSOR METRIC CARDS GRID ── */}
      <div>
        <h2 className="text-base font-extrabold text-slate-900 mb-3">
          Onboard Sensor Telemetry Array (11 Sensors)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sensors.map(s => (
            <div
              key={s.id}
              className="glass-card-light p-5 flex flex-col justify-between hover:shadow-xl transition-all duration-300"
            >
              {/* Top Bar: Icon + Name + Status Badge */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100/90 border border-slate-200">
                    {s.icon}
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                      {s.name}
                    </h3>
                    <span className="text-[10px] font-semibold text-slate-400">
                      Updated {s.updated}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                    s.status === 'critical'
                      ? 'bg-red-100 text-red-700 border-red-300 animate-pulse'
                      : s.status === 'warning'
                      ? 'bg-amber-100 text-amber-700 border-amber-300'
                      : 'bg-emerald-100 text-emerald-700 border-emerald-300'
                  }`}
                >
                  {s.statusText}
                </span>
              </div>

              {/* Value & Sparkline */}
              <div className="flex items-end justify-between gap-2 mt-2 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-3xl font-black text-slate-900 tracking-tight">
                    {s.value}
                  </span>
                  <span className="text-xs font-bold text-slate-500 ml-1">
                    {s.unit}
                  </span>
                </div>

                {/* Sparkline SVG Chart */}
                <div className="w-24 h-9">
                  <svg className="w-full h-full" viewBox="0 0 100 35">
                    <path
                      d={generateSvgPath(s.sparkline)}
                      fill="none"
                      stroke={
                        s.status === 'critical'
                          ? '#DC2626'
                          : s.status === 'warning'
                          ? '#F59E0B'
                          : '#2563EB'
                      }
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ThingSpeakChartCard({
  fieldNum,
  title,
  channelId,
  color,
  data,
}: {
  fieldNum: number;
  title: string;
  channelId: string;
  color: string;
  data: number[];
}) {
  const iframeUrl = `https://thingspeak.com/channels/${channelId}/charts/${fieldNum}?bgcolor=%23ffffff&color=%232563eb&dynamic=true&type=line&width=450&height=220`;

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm flex flex-col justify-between min-h-[260px]">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
          <Zap size={14} style={{ color }} />
          {title}
        </h4>
        <a
          href={`https://thingspeak.com/channels/${channelId}`}
          target="_blank"
          rel="noreferrer"
          className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
        >
          Open ThingSpeak <ExternalLink size={12} />
        </a>
      </div>

      {/* Live Chart Canvas Display */}
      <div className="flex-1 rounded-xl bg-slate-50 border border-slate-200/90 p-3 relative overflow-hidden flex flex-col justify-between">
        <iframe
          src={iframeUrl}
          className="w-full h-[200px] border-none rounded-lg"
          title={title}
          loading="lazy"
        />

        {/* Fallback Live SVG Wave Graphic */}
        <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col justify-between p-4 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-mono font-bold text-slate-500">
            ThingSpeak Live Field #{fieldNum} Data Wave:
          </span>
          <svg className="w-full h-24" viewBox="0 0 100 40">
            <path
              d={generateSvgPath(data)}
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function generateSvgPath(data: number[]): string {
  if (!data || data.length === 0) return 'M 0 20 L 100 20';
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;

  return data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * 90 + 5;
      const y = 35 - ((val - min) / range) * 26;
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}
