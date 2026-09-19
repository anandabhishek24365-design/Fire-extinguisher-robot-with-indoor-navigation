import { useState, useEffect } from 'react';
import { Layers, ZoomIn, ZoomOut, Compass, Navigation, Maximize2, RefreshCw } from 'lucide-react';
import { RobotState, SensorData } from '../../data/mockData';

interface Props {
  robot: RobotState;
  sensor: SensorData;
  emergency: boolean;
}

export default function NavigationMap({ robot, sensor, emergency }: Props) {
  const [showPath, setShowPath] = useState(true);
  const [showObstacles, setShowObstacles] = useState(true);
  const [showFireZones, setShowFireZones] = useState(true);
  const [showSafeZones, setShowSafeZones] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [floor, setFloor] = useState<number>(2);

  // Live animated position coordinates
  const [robotPos, setRobotPos] = useState({
    x: emergency ? 195 : 145,
    y: emergency ? 85 : 110,
    heading: 126,
    speed: 1.4,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRobotPos(prev => {
        const targetX = emergency ? 198 : 145 + Math.sin(Date.now() / 1500) * 12;
        const targetY = emergency ? 85 : 110 + Math.cos(Date.now() / 1800) * 8;
        return {
          x: prev.x + (targetX - prev.x) * 0.1,
          y: prev.y + (targetY - prev.y) * 0.1,
          heading: (prev.heading + 0.5) % 360,
          speed: emergency ? 2.2 : 1.4,
        };
      });
    }, 100);
    return () => clearInterval(interval);
  }, [emergency]);

  const fireX = 205;
  const fireY = 82;

  return (
    <div className="glass-card-light h-full flex flex-col overflow-hidden p-4 relative">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-3 gap-2 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Indoor Navigation Map
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black border border-blue-200">
              BUILDING A • FLOOR {floor}
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Real-time telemetry, path planning, obstacles and safe evacuation zones
          </p>
        </div>

        {/* Floor Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100/90 border border-slate-200 text-xs font-bold">
          {[1, 2, 3].map(f => (
            <button
              key={f}
              onClick={() => setFloor(f)}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                floor === f
                  ? 'bg-blue-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Floor {f}
            </button>
          ))}
        </div>
      </div>

      {/* Live Map Canvas */}
      <div className="flex-1 relative rounded-2xl overflow-hidden bg-[#F8FAFC] border border-slate-200/90 shadow-inner flex items-center justify-center min-h-[300px]">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 300 200"
          className="w-full h-full"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.2s ease' }}
        >
          {/* Light Grid Lines */}
          <defs>
            <pattern id="lightGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E2E8F0" strokeWidth="0.8" />
            </pattern>
            <radialGradient id="lightRobotGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="lightFireGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#DC2626" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="300" height="200" fill="url(#lightGrid)" />

          {/* Room Backgrounds */}
          <rect x="12" y="12" width="104" height="84" fill="#F1F5F9" rx="4" />
          <rect x="12" y="104" width="104" height="84" fill="#F1F5F9" rx="4" />
          <rect x="124" y="12" width="72" height="74" fill="#EFF6FF" rx="4" />
          <rect x="124" y="114" width="72" height="74" fill="#F8FAFC" rx="4" />
          <rect x="204" y="12" width="84" height="74" fill={emergency ? '#FEF2F2' : '#F8FAFC'} rx="4" />
          <rect x="204" y="114" width="84" height="74" fill="#F8FAFC" rx="4" />

          {/* Building Walls */}
          <g stroke="#64748B" strokeWidth="2" fill="none" strokeLinecap="round">
            <rect x="10" y="10" width="280" height="180" rx="6" stroke="#334155" strokeWidth="2.5" />
            <line x1="120" y1="10" x2="120" y2="88" />
            <line x1="120" y1="112" x2="120" y2="190" />
            <line x1="200" y1="10" x2="200" y2="70" />
            <line x1="200" y1="92" x2="200" y2="190" />
            <line x1="10" y1="100" x2="78" y2="100" />
            <line x1="98" y1="100" x2="120" y2="100" />
          </g>

          {/* Room Names */}
          <text x="64" y="52" fill="#475569" fontSize="8" fontWeight="bold" textAnchor="middle">MAIN LOBBY</text>
          <text x="160" y="48" fill="#2563EB" fontSize="8" fontWeight="bold" textAnchor="middle">CORRIDOR B</text>
          <text x="246" y="48" fill="#475569" fontSize="8" fontWeight="bold" textAnchor="middle">LAB 201</text>
          <text x="64" y="148" fill="#475569" fontSize="8" fontWeight="bold" textAnchor="middle">STORAGE A</text>
          <text x="160" y="152" fill="#475569" fontSize="8" fontWeight="bold" textAnchor="middle">CORRIDOR C</text>
          <text x="246" y="152" fill="#475569" fontSize="8" fontWeight="bold" textAnchor="middle">SERVER ROOM</text>

          {/* Safe Emergency Exit Zones */}
          {showSafeZones && (
            <g>
              <rect x="12" y="92" width="16" height="16" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1" rx="3" />
              <text x="20" y="103" fill="#15803D" fontSize="6" fontWeight="extrabold" textAnchor="middle">EXIT</text>
            </g>
          )}

          {/* Navigation Route Trail */}
          {showPath && (
            <path
              d="M 50 150 L 50 60 L 80 60 L 80 50 L 145 50 L 145 85 L 195 85"
              fill="none"
              stroke="#2563EB"
              strokeWidth="2"
              strokeDasharray="5,4"
            />
          )}

          {/* Obstacles */}
          {showObstacles && (
            <g>
              <rect x="160" y="105" width="12" height="12" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" rx="2" />
              <text x="166" y="114" fill="#D97706" fontSize="8" fontWeight="black" textAnchor="middle">!</text>
            </g>
          )}

          {/* Fire Zone */}
          {emergency && showFireZones && (
            <g>
              <circle cx={fireX} cy={fireY} r="24" fill="url(#lightFireGlow)" />
              <circle cx={fireX} cy={fireY} r="18" fill="none" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="4,3">
                <animateTransform attributeName="transform" type="rotate" from={`0 ${fireX} ${fireY}`} to={`360 ${fireX} ${fireY}`} dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx={fireX} cy={fireY} r="8" fill="#DC2626" />
              <text x={fireX} y={fireY + 18} fill="#DC2626" fontSize="7" fontWeight="black" textAnchor="middle">
                ZONE A-2 FIRE
              </text>
            </g>
          )}

          {/* Robot Position Marker */}
          <g>
            <circle cx={robotPos.x} cy={robotPos.y} r="22" fill="url(#lightRobotGlow)" />
            <circle cx={robotPos.x} cy={robotPos.y} r="14" fill="none" stroke="#2563EB" strokeWidth="1.5">
              <animate attributeName="r" values="14;22;14" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx={robotPos.x} cy={robotPos.y} r="8" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2.5" />
            {/* Direction Arrow */}
            <line
              x1={robotPos.x}
              y1={robotPos.y}
              x2={robotPos.x + Math.cos((robotPos.heading * Math.PI) / 180) * 16}
              y2={robotPos.y + Math.sin((robotPos.heading * Math.PI) / 180) * 16}
              stroke="#2563EB"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        </svg>

        {/* Top-Left Live Coordinates Readout Badge */}
        <div className="absolute top-3 left-3 p-2.5 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-md flex items-center gap-3 text-xs font-mono font-bold text-slate-800">
          <span className="flex items-center gap-1.5 text-blue-600 font-black">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            LIVE
          </span>
          <span>X: <strong className="text-slate-900">{robotPos.x.toFixed(2)}m</strong></span>
          <span>Y: <strong className="text-slate-900">{robotPos.y.toFixed(2)}m</strong></span>
          <span>Heading: <strong className="text-slate-900">{Math.round(robotPos.heading)}°</strong></span>
          <span>Speed: <strong className="text-slate-900">{robotPos.speed.toFixed(1)} m/s</strong></span>
        </div>

        {/* Map Controls */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <button
            onClick={() => setZoom(z => Math.min(2, z + 0.2))}
            className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 shadow-sm flex items-center justify-center cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(0.6, z - 0.2))}
            className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 shadow-sm flex items-center justify-center cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 shadow-sm flex items-center justify-center cursor-pointer"
            title="Reset View"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Layer Toggles */}
      <div className="flex items-center justify-between pt-3 text-xs font-bold text-slate-600 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-slate-400" />
          <span className="text-slate-700 font-extrabold">Layers:</span>
          {[
            { key: 'path', label: 'Route Path', val: showPath, set: setShowPath },
            { key: 'obs', label: 'Obstacles', val: showObstacles, set: setShowObstacles },
            { key: 'fire', label: 'Fire Zones', val: showFireZones, set: setShowFireZones },
            { key: 'safe', label: 'Safe Exits', val: showSafeZones, set: setShowSafeZones },
          ].map(l => (
            <button
              key={l.key}
              onClick={() => l.set(p => !p)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                l.val
                  ? 'bg-blue-100 text-blue-700 border border-blue-300 shadow-xs'
                  : 'bg-slate-100 text-slate-500 border border-slate-200 hover:text-slate-800'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
