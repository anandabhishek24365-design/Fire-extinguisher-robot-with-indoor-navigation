import { useState, useEffect } from 'react';
import { Layers, ZoomIn, ZoomOut, Compass, Navigation, Maximize2, RefreshCw, Home, Shield, Flame, AlertCircle } from 'lucide-react';
import { RobotState, SensorData } from '../../data/mockData';
import { PATROL_LOOPS, findIndoorPath } from '../../utils/indoorNavigation';

interface Props {
  robot: RobotState;
  sensor: SensorData;
  emergency: boolean;
  robotPos?: {
    x: number;
    y: number;
    heading: number;
    speed: number;
    isAutoPatrol: boolean;
    floor?: number;
    waypoints?: { x: number; y: number }[];
    targetRoomName?: string;
  };
  currentFloor?: number;
  onFloorChange?: (floor: number) => void;
  activePath?: { x: number; y: number }[];
  onSelectRoom?: (room: { x: number; y: number; name: string; floor?: number }) => void;
}

export default function NavigationMap({
  robot,
  sensor,
  emergency,
  robotPos: externalRobotPos,
  currentFloor,
  onFloorChange,
  activePath,
  onSelectRoom,
}: Props) {
  const [showPath, setShowPath] = useState(true);
  const [showObstacles, setShowObstacles] = useState(true);
  const [showFireZones, setShowFireZones] = useState(true);
  const [showSafeZones, setShowSafeZones] = useState(true);
  const [showFurniture, setShowFurniture] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [localFloor, setLocalFloor] = useState<number>(1);

  const activeFloor = currentFloor !== undefined ? currentFloor : localFloor;

  // Live animated position coordinates (fallback if external position not provided)
  const [localPos, setLocalPos] = useState({
    x: emergency ? 245 : 135,
    y: emergency ? 55 : 65,
    heading: 90,
    speed: 1.4,
  });

  useEffect(() => {
    if (externalRobotPos) return;
    const interval = setInterval(() => {
      setLocalPos(prev => {
        const targetX = emergency ? 250 : 135 + Math.sin(Date.now() / 1500) * 14;
        const targetY = emergency ? 55 : 65 + Math.cos(Date.now() / 1800) * 10;
        return {
          x: prev.x + (targetX - prev.x) * 0.1,
          y: prev.y + (targetY - prev.y) * 0.1,
          heading: (prev.heading + 0.6) % 360,
          speed: emergency ? 2.2 : 1.4,
        };
      });
    }, 100);
    return () => clearInterval(interval);
  }, [emergency, externalRobotPos]);

  const activePos = externalRobotPos || localPos;

  // Compute wall-avoiding patrol path from indoor waypoints
  const patrolPathString = PATROL_LOOPS[activeFloor]
    ? PATROL_LOOPS[activeFloor].map((p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ') + ' Z'
    : '';

  const hazardLocation = {
    1: { x: 260, y: 55, label: 'KITCHEN COOKTOP FIRE' },
    2: { x: 172, y: 48, label: 'STUDY WORKSTATION FIRE' },
    3: { x: 230, y: 52, label: 'BESS SOLAR BATTERY OVERHEAT' },
  }[activeFloor as 1 | 2 | 3] || { x: 260, y: 55, label: 'HAZARD' };

  // Calculate obstacle-free route to fire hazard through hallways
  const fireWaypoints = findIndoorPath(
    { x: activePos.x, y: activePos.y },
    hazardLocation,
    activeFloor
  );
  const firePathString = `M ${activePos.x} ${activePos.y} ` + fireWaypoints.map(p => `L ${p.x} ${p.y}`).join(' ');

  // Floor metadata & summary
  const floorConfig = {
    1: {
      name: 'Ground Floor',
      tag: 'LIVING • KITCHEN • GARAGE',
      roomsCount: 8,
      hazardLocation,
      firePath: firePathString,
      patrolPath: patrolPathString,
    },
    2: {
      name: 'First Floor',
      tag: 'MASTER BEDROOM • SUITES • OFFICE',
      roomsCount: 9,
      hazardLocation,
      firePath: firePathString,
      patrolPath: patrolPathString,
    },
    3: {
      name: 'Penthouse Loft',
      tag: 'SKY LOUNGE • SOLAR BESS • HVAC PUMP',
      roomsCount: 5,
      hazardLocation,
      firePath: firePathString,
      patrolPath: patrolPathString,
    },
  }[activeFloor as 1 | 2 | 3];

  function handleRoomClick(room: { x: number; y: number; name: string; floor?: number }) {
    if (onSelectRoom) {
      onSelectRoom({ ...room, floor: activeFloor });
    }
  }

  function handleFloorSelect(num: number) {
    setLocalFloor(num);
    if (onFloorChange) {
      onFloorChange(num);
    }
  }

  return (
    <div className="glass-card-light h-full flex flex-col overflow-hidden p-4 relative shadow-xl border border-slate-200/90 dark:border-slate-800">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/90 dark:border-slate-800 mb-3 gap-2 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
              Indoor Navigation Map
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-black border border-emerald-300 dark:border-emerald-800">
              FLOOR {activeFloor}: {floorConfig.name.toUpperCase()}
            </span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
              ({floorConfig.tag})
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
            Architectural floor plan • Click any room to navigate via doors & hallways
          </p>
        </div>

        {/* Floor Selector with distinct structural labels */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-[#121927] border border-slate-200 dark:border-slate-800 text-xs font-bold shadow-xs">
          {[
            { num: 1, label: 'Floor 1', sub: 'Ground' },
            { num: 2, label: 'Floor 2', sub: 'Upper' },
            { num: 3, label: 'Floor 3', sub: 'Penthouse' },
          ].map(f => (
            <button
              key={f.num}
              onClick={() => handleFloorSelect(f.num)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex flex-col items-center leading-tight ${
                activeFloor === f.num
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md font-black scale-102'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
              }`}
            >
              <span className="text-xs">{f.label}</span>
              <span className={`text-[9px] ${activeFloor === f.num ? 'text-emerald-100 font-bold' : 'text-slate-400 dark:text-slate-500'}`}>
                {f.sub}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Live Map Canvas */}
      <div className="flex-1 relative rounded-2xl overflow-hidden bg-[#FBFBFA] dark:bg-[#080D18] border border-slate-200/90 dark:border-[#1E293B] shadow-inner flex items-center justify-center min-h-[340px]">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 320 220"
          className="w-full h-full select-none"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.2s ease' }}
        >
          <defs>
            {/* Fine architectural millimeter grid */}
            <pattern id="archGrid" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke="currentColor" className="text-slate-200/70 dark:text-slate-800/60" strokeWidth="0.6" />
            </pattern>

            {/* Patio deck plank texture */}
            <pattern id="deckPattern" width="6" height="6" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="6" y2="0" stroke="#CBD5E1" strokeWidth="0.8" />
            </pattern>

            {/* Glowing robot indicator */}
            <radialGradient id="robotBeacon" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#06B6D4" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </radialGradient>

            {/* Fire Hazard Radiant Gradient */}
            <radialGradient id="fireBeacon" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.5" />
              <stop offset="60%" stopColor="#F97316" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid Background */}
          <rect width="320" height="220" fill="url(#archGrid)" />

          {/* ══════════════════════════════════════════════════════════════
              FLOOR 1: GROUND FLOOR (LIVING, KITCHEN, GARAGE, PATIO)
             ══════════════════════════════════════════════════════════════ */}
          {activeFloor === 1 && (
            <g id="floor1-group" className="animate-fade-in">
              {/* Room Background Fills with subtle pastel tints */}
              <g className="opacity-95 dark:opacity-80">
                {/* Entrance Foyer */}
                <rect x="14" y="80" width="56" height="52" rx="4" className="fill-amber-500/[0.06] dark:fill-amber-500/[0.08]" />
                {/* Great Living Room */}
                <rect x="74" y="14" width="126" height="96" rx="4" className="fill-blue-500/[0.05] dark:fill-blue-500/[0.08]" />
                {/* Kitchen & Dining */}
                <rect x="204" y="14" width="102" height="96" rx="4" className="fill-emerald-500/[0.06] dark:fill-emerald-500/[0.08]" />
                {/* Garage & Robot Charging Dock */}
                <rect x="14" y="136" width="86" height="70" rx="4" className="fill-slate-500/[0.08] dark:fill-slate-500/[0.12]" />
                {/* Central Hall & Stairs */}
                <rect x="104" y="114" width="72" height="42" rx="4" className="fill-purple-500/[0.05] dark:fill-purple-500/[0.08]" />
                {/* Utility / Laundry */}
                <rect x="104" y="160" width="72" height="46" rx="4" className="fill-teal-500/[0.05] dark:fill-teal-500/[0.08]" />
                {/* Guest Powder Room */}
                <rect x="180" y="114" width="42" height="42" rx="4" className="fill-cyan-500/[0.05] dark:fill-cyan-500/[0.08]" />
                {/* Garden Patio & Deck */}
                <rect x="226" y="114" width="80" height="92" rx="4" className="fill-emerald-500/[0.08] dark:fill-emerald-500/[0.12]" />
              </g>

              {/* Furniture & Architectural Features (Floor 1) */}
              {showFurniture && (
                <g className="stroke-slate-400 dark:stroke-slate-500 stroke-[0.8] fill-none">
                  {/* Living Room Sectional Sofa */}
                  <path d="M 86 35 L 140 35 L 140 50 L 102 50 L 102 75 L 86 75 Z" className="fill-slate-200/70 dark:fill-slate-700/60" />
                  {/* Coffee Table */}
                  <rect x="108" y="55" width="24" height="14" rx="2" className="fill-amber-200/50 dark:fill-amber-800/40" />
                  {/* TV Console */}
                  <rect x="156" y="20" width="36" height="6" rx="1" className="fill-slate-300 dark:fill-slate-700" />

                  {/* Kitchen Island Counter */}
                  <rect x="224" y="44" width="46" height="18" rx="2" className="fill-slate-200/80 dark:fill-slate-700/70 stroke-slate-500" strokeWidth="1" />
                  {/* Kitchen Stools */}
                  <circle cx="232" cy="68" r="3" className="fill-slate-300 dark:fill-slate-600" />
                  <circle cx="247" cy="68" r="3" className="fill-slate-300 dark:fill-slate-600" />
                  <circle cx="262" cy="68" r="3" className="fill-slate-300 dark:fill-slate-600" />
                  {/* Cooktop Stove */}
                  <rect x="278" y="20" width="22" height="14" rx="2" className="fill-rose-100 dark:fill-rose-950/60 stroke-rose-400" />
                  <circle cx="284" cy="27" r="2.5" className="fill-rose-400" />
                  <circle cx="294" cy="27" r="2.5" className="fill-rose-400" />

                  {/* Dining Table with 6 chairs */}
                  <rect x="224" y="80" width="34" height="18" rx="2" className="fill-amber-100/70 dark:fill-amber-900/40" />
                  <circle cx="230" cy="76" r="2" />
                  <circle cx="241" cy="76" r="2" />
                  <circle cx="252" cy="76" r="2" />
                  <circle cx="230" cy="102" r="2" />
                  <circle cx="241" cy="102" r="2" />
                  <circle cx="252" cy="102" r="2" />

                  {/* Garage Vehicle Outline */}
                  <rect x="22" y="146" width="30" height="50" rx="6" className="fill-slate-200/60 dark:fill-slate-700/50 stroke-slate-400" strokeDasharray="3 2" />
                  <text x="37" y="173" className="fill-slate-500 font-mono text-[7px]" textAnchor="middle">CAR BAY 1</text>
                  
                  {/* Robot Inductive Charging Dock */}
                  <rect x="62" y="152" width="28" height="24" rx="4" className="fill-emerald-100 dark:fill-emerald-950/80 stroke-emerald-500" strokeWidth="1.2" />
                  <circle cx="76" cy="164" r="6" className="fill-emerald-500/20 stroke-emerald-500 animate-pulse" />
                  <text x="76" y="167" className="fill-emerald-700 dark:fill-emerald-300 font-extrabold text-[6.5px]" textAnchor="middle">DOCK</text>

                  {/* Staircase to Floor 2 */}
                  <g className="stroke-slate-400 dark:stroke-slate-500">
                    <line x1="108" y1="120" x2="140" y2="120" />
                    <line x1="108" y1="125" x2="140" y2="125" />
                    <line x1="108" y1="130" x2="140" y2="130" />
                    <line x1="108" y1="135" x2="140" y2="135" />
                    <line x1="108" y1="140" x2="140" y2="140" />
                    <text x="124" y="150" className="fill-purple-600 dark:fill-purple-400 font-black text-[6.5px]" textAnchor="middle">STAIRS UP ▲</text>
                  </g>

                  {/* Patio Outdoor Lounge & Garden Table */}
                  <circle cx="266" cy="155" r="16" className="stroke-emerald-400" strokeDasharray="3 2" />
                  <circle cx="266" cy="155" r="7" className="fill-emerald-200/60 dark:fill-emerald-900/40" />
                </g>
              )}

              {/* Architectural Interior Walls & Doors (Floor 1) */}
              <g className="stroke-slate-700 dark:stroke-slate-300 stroke-[2.2] fill-none stroke-linecap-round">
                {/* Exterior Boundary with Exits */}
                <path d="M 14 96 L 14 14 L 306 14 L 306 148 M 306 172 L 306 206 L 14 206 L 14 116" className="stroke-slate-900 dark:stroke-slate-200 stroke-[3]" />

                {/* Vertical Divider: Foyer vs Living */}
                <line x1="70" y1="14" x2="70" y2="76" />
                {/* Vertical Divider: Garage vs Utility (door gap at 134..156) */}
                <line x1="70" y1="156" x2="70" y2="206" />

                {/* Horizontal Divider: Foyer vs Garage */}
                <line x1="14" y1="134" x2="68" y2="134" />

                {/* Vertical Divider: Living vs Kitchen */}
                <line x1="200" y1="14" x2="200" y2="72" />

                {/* Horizontal Divider: Living vs Central Hall (with Grand Arch at x: 115..160) */}
                <line x1="70" y1="110" x2="115" y2="110" />
                <line x1="160" y1="110" x2="190" y2="110" />
                {/* Kitchen-to-Patio sliding door gap at x: 222..250 */}
                <line x1="250" y1="110" x2="306" y2="110" />

                {/* Vertical Divider: Central Hall vs Powder Room */}
                <line x1="176" y1="110" x2="176" y2="125" />
                <line x1="176" y1="150" x2="176" y2="206" />

                {/* Horizontal Divider: Central Hall vs Utility (door at x: 125..155) */}
                <line x1="70" y1="156" x2="125" y2="156" />
                <line x1="155" y1="156" x2="176" y2="156" />

                {/* Vertical Divider: Powder Room vs Patio */}
                <line x1="222" y1="110" x2="222" y2="206" />
              </g>

              {/* Door Openings & Door Swing Arcs */}
              <g className="stroke-emerald-600 dark:stroke-emerald-400 stroke-[1.2] fill-none stroke-dasharray-[2,2]">
                {/* Front Door */}
                <path d="M 14 96 A 20 20 0 0 1 28 116" />
                {/* Garage Door to Central Hall */}
                <path d="M 70 134 A 20 20 0 0 1 85 154" />
                {/* Living Room Grand Archway Opening */}
                <path d="M 115 110 Q 137.5 98 160 110" strokeDasharray="3,2" className="stroke-purple-400" />
                {/* Patio Sliding Door */}
                <line x1="222" y1="112" x2="250" y2="112" className="stroke-cyan-500 stroke-[2]" />
                {/* Utility Door */}
                <path d="M 125 156 A 15 15 0 0 1 140 171" />
                {/* Powder Room Door */}
                <path d="M 176 125 A 15 15 0 0 1 191 140" />
              </g>

              {/* Room Badges & High-Contrast Labels (Floor 1) */}
              {[
                { name: 'LIVING ROOM', dim: "22' x 16'", x: 137, y: 78, w: 90, targetX: 137, targetY: 62 },
                { name: 'KITCHEN & DINING', dim: "18' x 16'", x: 255, y: 78, w: 96, targetX: 255, targetY: 62 },
                { name: 'ENTRANCE FOYER', dim: "10' x 9'", x: 42, y: 104, w: 84, targetX: 42, targetY: 106 },
                { name: 'GARAGE & DOCK', dim: "20' x 18'", x: 57, y: 195, w: 82, targetX: 57, targetY: 171 },
                { name: 'CENTRAL HALL', dim: "14' x 8'", x: 140, y: 136, w: 76, targetX: 140, targetY: 135 },
                { name: 'UTILITY / LAUNDRY', dim: "12' x 8'", x: 140, y: 184, w: 88, targetX: 140, targetY: 183 },
                { name: 'POWDER ROOM', dim: "7' x 6'", x: 199, y: 136, w: 72, targetX: 199, targetY: 135 },
                { name: 'GARDEN PATIO', dim: "16' x 14'", x: 266, y: 182, w: 78, targetX: 266, targetY: 160 },
              ].map((r, i) => (
                <g key={i} className="cursor-pointer transition-transform hover:scale-105" onClick={() => handleRoomClick({ x: r.targetX, y: r.targetY, name: r.name })}>
                  <rect x={r.x - r.w / 2} y={r.y - 10} width={r.w} height={18} rx={5} className="fill-white/95 dark:fill-[#0F172A]/95 stroke-slate-300 dark:stroke-slate-600 shadow-sm" strokeWidth="1" />
                  <text x={r.x} y={r.y - 1} className="fill-slate-900 dark:fill-white font-black text-[7.5px]" textAnchor="middle">{r.name}</text>
                  <text x={r.x} y={r.y + 6} className="fill-emerald-700 dark:fill-emerald-400 font-bold text-[5.5px]" textAnchor="middle">{r.dim} • GOTO</text>
                </g>
              ))}
            </g>
          )}

          {/* ══════════════════════════════════════════════════════════════
              FLOOR 2: FIRST FLOOR (BEDROOMS, SUITES, STUDY, BALCONY)
             ══════════════════════════════════════════════════════════════ */}
          {activeFloor === 2 && (
            <g id="floor2-group" className="animate-fade-in">
              {/* Room Background Fills */}
              <g className="opacity-95 dark:opacity-80">
                {/* Master Bedroom */}
                <rect x="14" y="14" width="112" height="96" rx="4" className="fill-indigo-500/[0.06] dark:fill-indigo-500/[0.08]" />
                {/* Master Ensuite & Walk-in */}
                <rect x="14" y="114" width="82" height="92" rx="4" className="fill-cyan-500/[0.06] dark:fill-cyan-500/[0.08]" />
                {/* Cyber Study & Office */}
                <rect x="130" y="14" width="84" height="68" rx="4" className="fill-amber-500/[0.06] dark:fill-amber-500/[0.08]" />
                {/* Bedroom 2 (Guest Suite) */}
                <rect x="218" y="14" width="88" height="84" rx="4" className="fill-rose-500/[0.05] dark:fill-rose-500/[0.08]" />
                {/* Bedroom 3 (Kids Flex) */}
                <rect x="218" y="102" width="88" height="72" rx="4" className="fill-blue-500/[0.05] dark:fill-blue-500/[0.08]" />
                {/* Central Family Hall */}
                <rect x="100" y="86" width="76" height="68" rx="4" className="fill-purple-500/[0.06] dark:fill-purple-500/[0.08]" />
                {/* Family Bath 2 */}
                <rect x="100" y="158" width="46" height="48" rx="4" className="fill-teal-500/[0.05] dark:fill-teal-500/[0.08]" />
                {/* Smart Hub / Linen */}
                <rect x="150" y="158" width="26" height="48" rx="4" className="fill-violet-500/[0.08] dark:fill-violet-500/[0.12]" />
                {/* Sun Balcony */}
                <rect x="180" y="178" width="126" height="28" rx="4" className="fill-emerald-500/[0.08] dark:fill-emerald-500/[0.12]" />
              </g>

              {/* Furniture (Floor 2) */}
              {showFurniture && (
                <g className="stroke-slate-400 dark:stroke-slate-500 stroke-[0.8] fill-none">
                  {/* Master King Bed */}
                  <rect x="24" y="24" width="38" height="48" rx="3" className="fill-indigo-100/70 dark:fill-indigo-950/50 stroke-indigo-400" />
                  <rect x="28" y="27" width="13" height="10" rx="2" className="fill-white dark:fill-slate-800" />
                  <rect x="45" y="27" width="13" height="10" rx="2" className="fill-white dark:fill-slate-800" />
                  {/* Master Wardrobe */}
                  <rect x="94" y="20" width="26" height="60" rx="2" className="fill-slate-200 dark:fill-slate-700" />

                  {/* Master Bathtub */}
                  <rect x="22" y="125" width="32" height="18" rx="9" className="fill-cyan-100/70 dark:fill-cyan-950/60 stroke-cyan-400" />
                  {/* Double Vanity */}
                  <rect x="62" y="120" width="28" height="12" rx="2" className="fill-slate-300 dark:fill-slate-700" />

                  {/* Study L-Desk */}
                  <path d="M 138 22 L 180 22 L 180 34 L 152 34 L 152 52 L 138 52 Z" className="fill-amber-100/70 dark:fill-amber-950/50 stroke-amber-500" />
                  <circle cx="160" cy="42" r="4" className="fill-slate-400 dark:fill-slate-600" />

                  {/* Bedroom 2 Queen Bed */}
                  <rect x="248" y="22" width="46" height="36" rx="3" className="fill-rose-100/70 dark:fill-rose-950/50 stroke-rose-400" />
                  <rect x="252" y="25" width="16" height="8" rx="2" className="fill-white dark:fill-slate-800" />
                  <rect x="274" y="25" width="16" height="8" rx="2" className="fill-white dark:fill-slate-800" />

                  {/* Bedroom 3 Twin Beds */}
                  <rect x="226" y="112" width="20" height="34" rx="2" className="fill-blue-100/70 dark:fill-blue-950/50 stroke-blue-400" />
                  <rect x="256" y="112" width="20" height="34" rx="2" className="fill-blue-100/70 dark:fill-blue-950/50 stroke-blue-400" />

                  {/* Balcony Railing */}
                  <line x1="180" y1="204" x2="306" y2="204" className="stroke-emerald-500 stroke-[1.5]" />
                  <circle cx="210" cy="192" r="5" className="fill-emerald-200 dark:fill-emerald-800" />
                  <circle cx="270" cy="192" r="5" className="fill-emerald-200 dark:fill-emerald-800" />
                </g>
              )}

              {/* Walls (Floor 2) */}
              <g className="stroke-slate-700 dark:stroke-slate-300 stroke-[2.2] fill-none stroke-linecap-round">
                <path d="M 14 98 L 14 14 L 306 14 L 306 180 M 306 204 L 306 206 L 14 206 L 14 122" className="stroke-slate-900 dark:stroke-slate-200 stroke-[3]" />

                {/* Master Suite partition */}
                <line x1="126" y1="14" x2="126" y2="110" />
                <line x1="14" y1="110" x2="96" y2="110" />

                {/* Office partition */}
                <line x1="126" y1="82" x2="145" y2="82" />
                <line x1="175" y1="82" x2="214" y2="82" />
                <line x1="214" y1="14" x2="214" y2="65" />

                {/* Bedroom 2 vs Bedroom 3 */}
                <line x1="214" y1="98" x2="306" y2="98" />
                <line x1="214" y1="135" x2="214" y2="174" />

                {/* Central Hall vs Bathrooms */}
                <line x1="96" y1="154" x2="110" y2="154" />
                <line x1="135" y1="154" x2="150" y2="154" />
                <line x1="146" y1="154" x2="146" y2="206" />
                <line x1="176" y1="154" x2="176" y2="206" />

                {/* Hallway to Balcony boundary */}
                <line x1="176" y1="174" x2="215" y2="174" />
                <line x1="255" y1="174" x2="306" y2="174" />
              </g>

              {/* Door Openings (Floor 2) */}
              <g className="stroke-emerald-600 dark:stroke-emerald-400 stroke-[1.2] fill-none stroke-dasharray-[2,2]">
                {/* Master Suite Door */}
                <path d="M 96 110 A 15 15 0 0 1 111 125" />
                {/* Study Door */}
                <path d="M 145 82 A 15 15 0 0 1 160 97" />
                {/* Bedroom 2 Door */}
                <path d="M 214 65 A 15 15 0 0 1 229 80" />
                {/* Bedroom 3 Door */}
                <path d="M 214 105 A 15 15 0 0 1 229 120" />
                {/* Balcony Slider */}
                <line x1="215" y1="174" x2="255" y2="174" className="stroke-cyan-500 stroke-[2]" />
              </g>

              {/* Room Badges (Floor 2) */}
              {[
                { name: 'MASTER SUITE', dim: "20' x 16'", x: 70, y: 84, w: 86, targetX: 70, targetY: 62 },
                { name: 'ENSUITE & CLOSET', dim: "15' x 14'", x: 55, y: 172, w: 84, targetX: 55, targetY: 160 },
                { name: 'CYBER STUDY', dim: "14' x 11'", x: 170, y: 62, w: 76, targetX: 172, targetY: 48 },
                { name: 'BEDROOM 2 (GUEST)', dim: "15' x 13'", x: 260, y: 74, w: 88, targetX: 262, targetY: 56 },
                { name: 'BEDROOM 3 (KIDS)', dim: "15' x 12'", x: 260, y: 156, w: 84, targetX: 262, targetY: 138 },
                { name: 'FAMILY HALL', dim: "14' x 12'", x: 138, y: 124, w: 74, targetX: 138, targetY: 120 },
                { name: 'BATHROOM 2', dim: "8' x 8'", x: 123, y: 186, w: 68, targetX: 123, targetY: 182 },
                { name: 'SMART HUB', dim: "6' x 8'", x: 163, y: 186, w: 64, targetX: 163, targetY: 182 },
                { name: 'SUN BALCONY', dim: "22' x 6'", x: 243, y: 194, w: 78, targetX: 243, targetY: 192 },
              ].map((r, i) => (
                <g key={i} className="cursor-pointer transition-transform hover:scale-105" onClick={() => handleRoomClick({ x: r.targetX, y: r.targetY, name: r.name })}>
                  <rect x={r.x - r.w / 2} y={r.y - 10} width={r.w} height={18} rx={5} className="fill-white/95 dark:fill-[#0F172A]/95 stroke-slate-300 dark:stroke-slate-600 shadow-sm" strokeWidth="1" />
                  <text x={r.x} y={r.y - 1} className="fill-slate-900 dark:fill-white font-black text-[7.5px]" textAnchor="middle">{r.name}</text>
                  <text x={r.x} y={r.y + 6} className="fill-emerald-700 dark:fill-emerald-400 font-bold text-[5.5px]" textAnchor="middle">{r.dim} • GOTO</text>
                </g>
              ))}
            </g>
          )}

          {/* ══════════════════════════════════════════════════════════════
              FLOOR 3: PENTHOUSE (SKY LOUNGE, SOLAR BESS, HVAC PUMP)
             ══════════════════════════════════════════════════════════════ */}
          {activeFloor === 3 && (
            <g id="floor3-group" className="animate-fade-in">
              {/* Room Background Fills */}
              <g className="opacity-95 dark:opacity-80">
                {/* Sky Lounge */}
                <rect x="32" y="22" width="136" height="108" rx="6" className="fill-purple-500/[0.07] dark:fill-purple-500/[0.1]" />
                {/* Solar Battery BESS */}
                <rect x="172" y="22" width="114" height="58" rx="6" className="fill-amber-500/[0.08] dark:fill-amber-500/[0.12]" />
                {/* HVAC & Suppression Water Tank */}
                <rect x="172" y="84" width="114" height="62" rx="6" className="fill-cyan-500/[0.08] dark:fill-cyan-500/[0.12]" />
                {/* Attic Loft Vault */}
                <rect x="32" y="134" width="96" height="72" rx="6" className="fill-slate-500/[0.08] dark:fill-slate-500/[0.12]" />
                {/* Rooftop Sky Terrace */}
                <rect x="132" y="150" width="154" height="56" rx="6" className="fill-emerald-500/[0.09] dark:fill-emerald-500/[0.14]" />
              </g>

              {/* Furniture & Plant Equipment (Floor 3) */}
              {showFurniture && (
                <g className="stroke-slate-400 dark:stroke-slate-500 stroke-[0.8] fill-none">
                  {/* Sky Lounge Curved Sofa */}
                  <path d="M 50 45 Q 100 35 130 75 Q 90 90 50 80 Z" className="fill-purple-100/70 dark:fill-purple-950/60 stroke-purple-400" />
                  {/* Cocktail Bar Table */}
                  <rect x="65" y="96" width="56" height="14" rx="3" className="fill-slate-200 dark:fill-slate-700" />
                  <circle cx="75" cy="116" r="3" />
                  <circle cx="93" cy="116" r="3" />
                  <circle cx="111" cy="116" r="3" />

                  {/* Solar Inverter Cabinets */}
                  <rect x="180" y="30" width="24" height="42" rx="2" className="fill-amber-100/80 dark:fill-amber-950/70 stroke-amber-500" strokeWidth="1.2" />
                  <text x="192" y="52" className="fill-amber-700 dark:fill-amber-300 font-bold text-[6px]" textAnchor="middle">INVERTER</text>

                  {/* Tesla Powerwall Battery Rack */}
                  <rect x="210" y="30" width="68" height="42" rx="3" className="fill-slate-800 dark:fill-slate-900 stroke-amber-400" strokeWidth="1.2" />
                  <text x="244" y="48" className="fill-amber-400 font-black text-[6.5px]" textAnchor="middle">⚡ 48V BESS</text>
                  <text x="244" y="58" className="fill-emerald-400 font-mono text-[5.5px]" textAnchor="middle">98% 28.4 kWh</text>

                  {/* 1000L Fire Suppression Water Tank */}
                  <circle cx="205" cy="115" r="18" className="fill-cyan-100/80 dark:fill-cyan-950/80 stroke-cyan-500" strokeWidth="1.5" />
                  <circle cx="205" cy="115" r="10" className="fill-cyan-500/20 stroke-cyan-400" />
                  <text x="205" y="118" className="fill-cyan-700 dark:fill-cyan-300 font-black text-[6.5px]" textAnchor="middle">1000L H2O</text>

                  {/* HVAC Heat Pump Compressor */}
                  <rect x="236" y="96" width="42" height="38" rx="3" className="fill-slate-200 dark:fill-slate-700 stroke-slate-500" />
                  <circle cx="257" cy="115" r="10" className="stroke-slate-400 stroke-dasharray-[2,2]" />
                  <text x="257" y="118" className="fill-slate-700 dark:fill-slate-300 font-bold text-[6px]" textAnchor="middle">HVAC</text>

                  {/* Terrace Pergola & Greenery */}
                  <rect x="140" y="156" width="36" height="42" rx="3" className="fill-emerald-100/60 dark:fill-emerald-950/40 stroke-emerald-400" strokeDasharray="3 2" />
                  <text x="158" y="180" className="fill-emerald-600 dark:fill-emerald-400 font-bold text-[6.5px]" textAnchor="middle">LOUNGE</text>
                  <circle cx="260" cy="180" r="12" className="stroke-emerald-400 fill-emerald-200/50 dark:fill-emerald-900/40" />
                  <text x="260" y="183" className="fill-emerald-600 font-mono text-[6px]" textAnchor="middle">PLANTS</text>
                </g>
              )}

              {/* Walls (Floor 3) */}
              <g className="stroke-slate-700 dark:stroke-slate-300 stroke-[2.2] fill-none stroke-linecap-round">
                <path d="M 290 165 L 290 20 L 30 20 L 30 208 L 290 208 L 290 190" className="stroke-slate-900 dark:stroke-slate-200 stroke-[3]" />

                {/* Lounge vs Solar/HVAC */}
                <line x1="168" y1="20" x2="168" y2="40" />
                <line x1="168" y1="65" x2="168" y2="100" />
                <line x1="168" y1="125" x2="168" y2="148" />

                {/* Solar vs HVAC divider */}
                <line x1="168" y1="80" x2="290" y2="80" />

                {/* Lounge vs Attic Loft */}
                <line x1="30" y1="130" x2="65" y2="130" />
                <line x1="95" y1="130" x2="128" y2="130" />

                {/* Attic vs Sky Terrace */}
                <line x1="128" y1="130" x2="128" y2="208" />
              </g>

              {/* Door Openings (Floor 3) */}
              <g className="stroke-emerald-600 dark:stroke-emerald-400 stroke-[1.2] fill-none stroke-dasharray-[2,2]">
                {/* Solar BESS Door */}
                <path d="M 168 40 A 15 15 0 0 1 183 55" />
                {/* HVAC Door */}
                <path d="M 168 100 A 15 15 0 0 1 183 115" />
                {/* Attic Door */}
                <path d="M 65 130 A 15 15 0 0 1 80 145" />
                {/* Terrace Portal */}
                <line x1="130" y1="130" x2="168" y2="130" className="stroke-cyan-500 stroke-[2]" />
              </g>

              {/* Room Badges (Floor 3) */}
              {[
                { name: 'SKY LOUNGE & CINEMA', dim: "24' x 18'", x: 100, y: 76, w: 100, targetX: 100, targetY: 76 },
                { name: 'SOLAR BESS & POWER', dim: "18' x 10'", x: 228, y: 46, w: 96, targetX: 229, targetY: 51 },
                { name: 'HVAC & WATER PUMP', dim: "18' x 11'", x: 228, y: 136, w: 96, targetX: 229, targetY: 115 },
                { name: 'ATTIC VAULT STORAGE', dim: "16' x 12'", x: 79, y: 172, w: 94, targetX: 80, targetY: 170 },
                { name: 'ROOFTOP SKY TERRACE', dim: "26' x 10'", x: 209, y: 172, w: 98, targetX: 209, targetY: 178 },
              ].map((r, i) => (
                <g key={i} className="cursor-pointer transition-transform hover:scale-105" onClick={() => handleRoomClick({ x: r.targetX, y: r.targetY, name: r.name })}>
                  <rect x={r.x - r.w / 2} y={r.y - 10} width={r.w} height={18} rx={5} className="fill-white/95 dark:fill-[#0F172A]/95 stroke-slate-300 dark:stroke-slate-600 shadow-sm" strokeWidth="1" />
                  <text x={r.x} y={r.y - 1} className="fill-slate-900 dark:fill-white font-black text-[7.5px]" textAnchor="middle">{r.name}</text>
                  <text x={r.x} y={r.y + 6} className="fill-emerald-700 dark:fill-emerald-400 font-bold text-[5.5px]" textAnchor="middle">{r.dim} • GOTO</text>
                </g>
              ))}
            </g>
          )}

          {/* Safe Emergency Evacuation Exit Zones */}
          {showSafeZones && (
            <g id="safe-exits">
              {activeFloor === 1 && (
                <>
                  <g className="cursor-pointer" onClick={() => handleRoomClick({ x: 14, y: 106, name: 'Main Front Door Exit' })}>
                    <rect x="4" y="96" width="18" height="18" rx="4" className="fill-emerald-500 stroke-emerald-600 stroke-[1.5]" />
                    <text x="13" y="108" fill="#FFFFFF" fontSize="6.5" fontWeight="900" textAnchor="middle">EXIT</text>
                  </g>
                  <g className="cursor-pointer" onClick={() => handleRoomClick({ x: 298, y: 160, name: 'Garden Patio Evacuation Gate' })}>
                    <rect x="298" y="152" width="18" height="18" rx="4" className="fill-emerald-500 stroke-emerald-600 stroke-[1.5]" />
                    <text x="307" y="164" fill="#FFFFFF" fontSize="6.5" fontWeight="900" textAnchor="middle">EXIT</text>
                  </g>
                </>
              )}
              {activeFloor === 2 && (
                <>
                  <g className="cursor-pointer" onClick={() => handleRoomClick({ x: 14, y: 110, name: 'West Fire Stairway Exit' })}>
                    <rect x="4" y="102" width="18" height="18" rx="4" className="fill-emerald-500 stroke-emerald-600 stroke-[1.5]" />
                    <text x="13" y="114" fill="#FFFFFF" fontSize="6.5" fontWeight="900" textAnchor="middle">EXIT</text>
                  </g>
                  <g className="cursor-pointer" onClick={() => handleRoomClick({ x: 300, y: 192, name: 'Balcony Emergency Ladder' })}>
                    <rect x="298" y="184" width="18" height="18" rx="4" className="fill-emerald-500 stroke-emerald-600 stroke-[1.5]" />
                    <text x="307" y="196" fill="#FFFFFF" fontSize="6.5" fontWeight="900" textAnchor="middle">EXIT</text>
                  </g>
                </>
              )}
              {activeFloor === 3 && (
                <>
                  <g className="cursor-pointer" onClick={() => handleRoomClick({ x: 280, y: 178, name: 'Rooftop Fire Gantry' })}>
                    <rect x="274" y="170" width="18" height="18" rx="4" className="fill-emerald-500 stroke-emerald-600 stroke-[1.5]" />
                    <text x="283" y="182" fill="#FFFFFF" fontSize="6.5" fontWeight="900" textAnchor="middle">EXIT</text>
                  </g>
                </>
              )}
            </g>
          )}

          {/* Navigation Route Trail tailored for the active floor */}
          {showPath && (
            <g id="route-trails">
              {externalRobotPos?.waypoints && externalRobotPos.waypoints.length > 0 ? (
                <>
                  <path
                    d={`M ${activePos.x} ${activePos.y} ` + externalRobotPos.waypoints.map(p => `L ${p.x} ${p.y}`).join(' ')}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2.5"
                    strokeDasharray="6,4"
                    className="filter drop-shadow-[0_2px_6px_rgba(16,185,129,0.5)] animate-pulse"
                  />
                  {externalRobotPos.waypoints.map((wp, i) => (
                    <circle
                      key={i}
                      cx={wp.x}
                      cy={wp.y}
                      r={i === externalRobotPos.waypoints!.length - 1 ? 4 : 2.5}
                      fill={i === externalRobotPos.waypoints!.length - 1 ? '#10B981' : '#059669'}
                      stroke="#FFFFFF"
                      strokeWidth="1.2"
                    />
                  ))}
                </>
              ) : (
                <path
                  d={emergency ? floorConfig.firePath : floorConfig.patrolPath}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.2"
                  strokeDasharray="6,4"
                  className="filter drop-shadow-[0_2px_4px_rgba(16,185,129,0.3)]"
                />
              )}
            </g>
          )}

          {/* Obstacles tailored per floor */}
          {showObstacles && (
            <g id="floor-obstacles">
              {activeFloor === 1 && (
                <g>
                  <rect x="188" y="70" width="11" height="11" rx="2" className="fill-amber-100 stroke-amber-500 stroke-[1.5]" />
                  <text x="193.5" y="78.5" className="fill-amber-700 font-black text-[7px]" textAnchor="middle">!</text>
                  <rect x="42" y="150" width="11" height="11" rx="2" className="fill-amber-100 stroke-amber-500 stroke-[1.5]" />
                  <text x="47.5" y="158.5" className="fill-amber-700 font-black text-[7px]" textAnchor="middle">!</text>
                </g>
              )}
              {activeFloor === 2 && (
                <g>
                  <rect x="110" y="104" width="11" height="11" rx="2" className="fill-amber-100 stroke-amber-500 stroke-[1.5]" />
                  <text x="115.5" y="112.5" className="fill-amber-700 font-black text-[7px]" textAnchor="middle">!</text>
                </g>
              )}
              {activeFloor === 3 && (
                <g>
                  <rect x="180" y="126" width="11" height="11" rx="2" className="fill-amber-100 stroke-amber-500 stroke-[1.5]" />
                  <text x="185.5" y="134.5" className="fill-amber-700 font-black text-[7px]" textAnchor="middle">!</text>
                </g>
              )}
            </g>
          )}

          {/* Fire Zone Hazard (when emergency is active) */}
          {emergency && showFireZones && (
            <g id="fire-hazard-zone">
              <circle cx={floorConfig.hazardLocation.x} cy={floorConfig.hazardLocation.y} r="26" fill="url(#fireBeacon)" />
              <circle
                cx={floorConfig.hazardLocation.x}
                cy={floorConfig.hazardLocation.y}
                r="18"
                fill="none"
                stroke="#EF4444"
                strokeWidth="2"
                strokeDasharray="4,3"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from={`0 ${floorConfig.hazardLocation.x} ${floorConfig.hazardLocation.y}`}
                  to={`360 ${floorConfig.hazardLocation.x} ${floorConfig.hazardLocation.y}`}
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx={floorConfig.hazardLocation.x} cy={floorConfig.hazardLocation.y} r="8" fill="#EF4444" className="animate-pulse" />
              
              {/* High-Contrast Hazard Badge */}
              <rect
                x={floorConfig.hazardLocation.x - 52}
                y={floorConfig.hazardLocation.y + 12}
                width="104"
                height="15"
                rx="4"
                className="fill-red-950 stroke-red-500"
                strokeWidth="1.2"
              />
              <text
                x={floorConfig.hazardLocation.x}
                y={floorConfig.hazardLocation.y + 22.5}
                className="fill-red-200 font-black text-[6.5px]"
                textAnchor="middle"
              >
                🔥 {floorConfig.hazardLocation.label}
              </text>
            </g>
          )}

          {/* Robot Position Beacon & Heading Indicator */}
          <g id="robot-marker">
            <circle cx={activePos.x} cy={activePos.y} r="24" fill="url(#robotBeacon)" />
            <circle cx={activePos.x} cy={activePos.y} r="15" fill="none" stroke="#10B981" strokeWidth="1.8">
              <animate attributeName="r" values="14;24;14" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;0;0.7" dur="2s" repeatCount="indefinite" />
            </circle>
            {/* Robot Core Dot */}
            <circle cx={activePos.x} cy={activePos.y} r="8" fill="#10B981" stroke="#FFFFFF" strokeWidth="2.5" className="filter drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            {/* Direction Arrow Vector */}
            <line
              x1={activePos.x}
              y1={activePos.y}
              x2={activePos.x + Math.cos((activePos.heading * Math.PI) / 180) * 18}
              y2={activePos.y + Math.sin((activePos.heading * Math.PI) / 180) * 18}
              stroke="#059669"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
        </svg>

        {/* Top-Left Live Coordinates Readout Badge with High Contrast */}
        <div className="absolute top-3 left-3 p-2 sm:p-2.5 rounded-2xl bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border border-slate-300 dark:border-slate-700 shadow-xl flex items-center gap-2.5 sm:gap-3 text-xs font-mono font-bold text-slate-900 dark:text-slate-100">
          <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-black">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>SENTINEL X-1</span>
          </span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
          <span>X: <strong className="text-slate-900 dark:text-white font-extrabold">{activePos.x.toFixed(1)}m</strong></span>
          <span>Y: <strong className="text-slate-900 dark:text-white font-extrabold">{activePos.y.toFixed(1)}m</strong></span>
          <span className="hidden sm:inline">Head: <strong className="text-slate-900 dark:text-white font-extrabold">{Math.round(activePos.heading)}°</strong></span>
        </div>

        {/* Map Controls */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <button
            onClick={() => setZoom(z => Math.min(2, z + 0.2))}
            className="w-8 h-8 rounded-xl bg-white dark:bg-[#141A26] border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-400 shadow-md flex items-center justify-center cursor-pointer transition"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(0.6, z - 0.2))}
            className="w-8 h-8 rounded-xl bg-white dark:bg-[#141A26] border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-400 shadow-md flex items-center justify-center cursor-pointer transition"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="w-8 h-8 rounded-xl bg-white dark:bg-[#141A26] border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-400 shadow-md flex items-center justify-center cursor-pointer transition"
            title="Reset View"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Layer Toggles with Maximum Text Clarity */}
      <div className="flex items-center justify-between pt-3 text-xs font-bold gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-extrabold">
            <Layers size={15} className="text-emerald-600 dark:text-emerald-400" />
            <span>Map Layers:</span>
          </div>

          {[
            { key: 'path', label: 'Route Trail', val: showPath, set: setShowPath },
            { key: 'furn', label: 'Furniture & Plans', val: showFurniture, set: setShowFurniture },
            { key: 'obs', label: 'Obstacles', val: showObstacles, set: setShowObstacles },
            { key: 'fire', label: 'Hazards', val: showFireZones, set: setShowFireZones },
            { key: 'safe', label: 'Safe Exits', val: showSafeZones, set: setShowSafeZones },
          ].map(l => (
            <button
              key={l.key}
              onClick={() => l.set(p => !p)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                l.val
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 font-extrabold shadow-xs'
                  : 'bg-white dark:bg-[#131B29] text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
          Showing <strong className="text-slate-900 dark:text-white">{floorConfig.roomsCount} rooms</strong> on {floorConfig.name}
        </div>
      </div>
    </div>
  );
}
