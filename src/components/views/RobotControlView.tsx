import { useState } from 'react';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Octagon,
  Sliders,
  Droplets,
  Zap,
  Home,
  Bot,
  Gauge,
  RotateCcw,
} from 'lucide-react';
import { RobotState } from '../../data/mockData';

interface RobotControlViewProps {
  robot: RobotState;
  emergency: boolean;
}

export default function RobotControlView({ robot, emergency }: RobotControlViewProps) {
  const [controlMode, setControlMode] = useState<'AUTO' | 'MANUAL' | 'DOCK'>('MANUAL');
  const [speedLimit, setSpeedLimit] = useState<number>(1.8);
  const [turretAngle, setTurretAngle] = useState<number>(0);
  const [pumpActive, setPumpActive] = useState<boolean>(false);
  const [lastCmd, setLastCmd] = useState<string>('IDLE');

  function handleDrive(direction: string) {
    setLastCmd(`DRIVE_${direction.toUpperCase()}`);
  }

  function handleEStop() {
    setPumpActive(false);
    setLastCmd('EMERGENCY_STOP_ACTIVATED');
    alert('🚨 EMERGENCY STOP (E-STOP) TRIGGERED! Robot halted and water pump disengaged.');
  }

  return (
    <div className="flex flex-col gap-5 animate-fade-in w-full">
      {/* Mode Selector Header */}
      <div className="flex items-center justify-between gap-3 bg-white/90 p-3 rounded-2xl border border-slate-200/80 shadow-sm">
        <span className="text-xs font-black text-slate-800 uppercase tracking-wider pl-1">
          Control Mode:
        </span>
        <div className="flex items-center gap-1">
          {[
            { id: 'AUTO', label: 'Auto', icon: <Bot size={14} /> },
            { id: 'MANUAL', label: 'Manual', icon: <Sliders size={14} /> },
            { id: 'DOCK', label: 'Dock', icon: <Home size={14} /> },
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setControlMode(m.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                controlMode === m.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {m.icon}
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {/* Drive Motor D-Pad Section */}
        <div className="glass-card-light p-5 flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between mb-2">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Drive Motor D-Pad
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase">
              Cmd: {lastCmd}
            </span>
          </div>

          {/* Neumorphic D-Pad Layout */}
          <div className="my-6 relative w-64 h-64 flex items-center justify-center">
            {/* Forward */}
            <button
              onClick={() => handleDrive('forward')}
              disabled={controlMode === 'AUTO'}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 neu-button flex items-center justify-center font-extrabold text-blue-600 cursor-pointer disabled:opacity-40"
              title="Drive Forward"
            >
              <ArrowUp size={24} />
            </button>

            {/* Left */}
            <button
              onClick={() => handleDrive('left')}
              disabled={controlMode === 'AUTO'}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-16 neu-button flex items-center justify-center font-extrabold text-blue-600 cursor-pointer disabled:opacity-40"
              title="Turn Left"
            >
              <ArrowLeft size={24} />
            </button>

            {/* Center Stop */}
            <button
              onClick={() => handleDrive('stop')}
              disabled={controlMode === 'AUTO'}
              className="w-20 h-20 rounded-full bg-slate-900 text-white font-black text-xs flex flex-col items-center justify-center shadow-lg cursor-pointer hover:bg-slate-800 active:scale-95 transition-all"
              title="Stop Drive Motors"
            >
              <Octagon size={20} className="text-red-500 mb-0.5" />
              <span>STOP</span>
            </button>

            {/* Right */}
            <button
              onClick={() => handleDrive('right')}
              disabled={controlMode === 'AUTO'}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16 neu-button flex items-center justify-center font-extrabold text-blue-600 cursor-pointer disabled:opacity-40"
              title="Turn Right"
            >
              <ArrowRight size={24} />
            </button>

            {/* Reverse */}
            <button
              onClick={() => handleDrive('backward')}
              disabled={controlMode === 'AUTO'}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 neu-button flex items-center justify-center font-extrabold text-blue-600 cursor-pointer disabled:opacity-40"
              title="Drive Reverse"
            >
              <ArrowDown size={24} />
            </button>
          </div>

          {/* E-STOP Button */}
          <button
            onClick={handleEStop}
            className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-base shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap size={20} />
            EMERGENCY STOP (E-STOP)
          </button>
        </div>

        {/* Right Column: Speed Sliders, Turret Angle & Water Pump */}
        <div className="md:col-span-6 flex flex-col gap-6">
          {/* Water Pump Suppression Control */}
          <div className="glass-card-light p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-sky-100 border border-sky-200 text-sky-600">
                  <Droplets size={22} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    High-Pressure Water Pump Cannon
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    Submersible DC pump suppression nozzle
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPumpActive(!pumpActive)}
                className={`px-5 py-2.5 rounded-2xl font-black text-xs transition-all shadow-md cursor-pointer ${
                  pumpActive
                    ? 'bg-sky-500 text-white shadow-sky-500/40 animate-pulse'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {pumpActive ? 'SPRAYING ACTIVE' : 'PUMP OFF'}
              </button>
            </div>

            {/* Turret Cannon Angle Slider */}
            <div className="mt-2 pt-4 border-t border-slate-200/80">
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                <span>Cannon Turret Angle:</span>
                <span className="text-blue-600 font-mono font-black">{turretAngle}°</span>
              </div>
              <input
                type="range"
                min="-90"
                max="90"
                value={turretAngle}
                onChange={e => setTurretAngle(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                <span>-90° (Left)</span>
                <span>0° (Center)</span>
                <span>+90° (Right)</span>
              </div>
            </div>
          </div>

          {/* Speed Limit Adjuster */}
          <div className="glass-card-light p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-blue-100 border border-blue-200 text-blue-600">
                  <Gauge size={22} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Maximum Speed Limit
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    PWM motor speed duty cycle limiter
                  </p>
                </div>
              </div>

              <span className="text-xl font-black text-blue-600 font-mono">
                {speedLimit.toFixed(1)} m/s
              </span>
            </div>

            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={speedLimit}
              onChange={e => setSpeedLimit(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
              <span>0.5 m/s (Crawl)</span>
              <span>1.8 m/s (Standard)</span>
              <span>3.0 m/s (Sprint)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
