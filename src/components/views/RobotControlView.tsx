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
  onExecuteCommand?: (cmd: string) => { success: boolean; message: string };
  pumpActive?: boolean;
  onTogglePump?: () => void;
}

export default function RobotControlView({
  robot,
  emergency,
  onExecuteCommand,
  pumpActive: externalPumpActive,
  onTogglePump,
}: RobotControlViewProps) {
  const [controlMode, setControlMode] = useState<'AUTO' | 'MANUAL' | 'DOCK'>('MANUAL');
  const [speedLimit, setSpeedLimit] = useState<number>(1.8);
  const [turretAngle, setTurretAngle] = useState<number>(0);
  const [localPumpActive, setLocalPumpActive] = useState<boolean>(false);
  const [lastCmd, setLastCmd] = useState<string>('IDLE');

  const isPumpActive = externalPumpActive !== undefined ? externalPumpActive : localPumpActive;

  function handleDrive(direction: string) {
    setLastCmd(`DRIVE_${direction.toUpperCase()}`);
    if (onExecuteCommand) {
      if (direction === 'forward') {
        onExecuteCommand('forward 20');
      } else if (direction === 'backward') {
        onExecuteCommand('backward 15');
      } else if (direction === 'left') {
        onExecuteCommand('left 45');
      } else if (direction === 'right') {
        onExecuteCommand('right 45');
      } else if (direction === 'stop') {
        onExecuteCommand('stop');
      }
    }
  }

  function handleModeChange(mode: 'AUTO' | 'MANUAL' | 'DOCK') {
    setControlMode(mode);
    setLastCmd(`MODE_${mode}`);
    if (onExecuteCommand) {
      if (mode === 'AUTO') {
        onExecuteCommand('patrol');
      } else if (mode === 'MANUAL') {
        onExecuteCommand('stop');
      } else if (mode === 'DOCK') {
        onExecuteCommand('goto exit');
      }
    }
  }

  function handleEStop() {
    if (onTogglePump && isPumpActive) {
      onTogglePump();
    } else {
      setLocalPumpActive(false);
    }
    setLastCmd('EMERGENCY_STOP_ACTIVATED');
    if (onExecuteCommand) {
      onExecuteCommand('stop');
      onExecuteCommand('pump off');
    }
    alert('🚨 EMERGENCY STOP (E-STOP) TRIGGERED! Robot halted and water pump disengaged.');
  }

  function handleSpeedChange(newSpeed: number) {
    setSpeedLimit(newSpeed);
    if (onExecuteCommand) {
      onExecuteCommand(`speed ${newSpeed}`);
    }
  }

  function handlePumpToggle() {
    if (onTogglePump) {
      onTogglePump();
    } else {
      setLocalPumpActive(p => !p);
    }
    if (onExecuteCommand) {
      onExecuteCommand(isPumpActive ? 'pump off' : 'pump on');
    }
  }

  return (
    <div className="flex flex-col gap-5 animate-fade-in w-full">
      {/* Mode Selector Header */}
      <div className="flex items-center justify-between gap-3 bg-white/95 dark:bg-[#121824] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider pl-1">
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
              onClick={() => handleModeChange(m.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                controlMode === m.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
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
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">
              Drive Motor D-Pad
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase">
              Cmd: {lastCmd}
            </span>
          </div>

          {/* Neumorphic D-Pad Layout */}
          <div className="my-6 relative w-64 h-64 flex items-center justify-center">
            {/* Forward */}
            <button
              onClick={() => handleDrive('forward')}
              disabled={controlMode === 'AUTO'}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 neu-button flex items-center justify-center font-extrabold text-slate-800 dark:text-emerald-400 cursor-pointer disabled:opacity-40 active:scale-95 transition-transform"
              title="Drive Forward on Map"
            >
              <ArrowUp size={24} />
            </button>

            {/* Left */}
            <button
              onClick={() => handleDrive('left')}
              disabled={controlMode === 'AUTO'}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-16 neu-button flex items-center justify-center font-extrabold text-slate-800 dark:text-emerald-400 cursor-pointer disabled:opacity-40 active:scale-95 transition-transform"
              title="Turn Left Heading"
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
              className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16 neu-button flex items-center justify-center font-extrabold text-slate-800 dark:text-emerald-400 cursor-pointer disabled:opacity-40 active:scale-95 transition-transform"
              title="Turn Right Heading"
            >
              <ArrowRight size={24} />
            </button>

            {/* Reverse */}
            <button
              onClick={() => handleDrive('backward')}
              disabled={controlMode === 'AUTO'}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 neu-button flex items-center justify-center font-extrabold text-slate-800 dark:text-emerald-400 cursor-pointer disabled:opacity-40 active:scale-95 transition-transform"
              title="Drive Reverse on Map"
            >
              <ArrowDown size={24} />
            </button>
          </div>

          {/* E-STOP Button */}
          <button
            onClick={handleEStop}
            className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-base shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Zap size={20} />
            EMERGENCY STOP (E-STOP)
          </button>
        </div>

        {/* Right Column: Speed Sliders, Turret Angle & Water Pump */}
        <div className="flex flex-col gap-6">
          {/* Water Pump Suppression Control */}
          <div className="glass-card-light p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-teal-100 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300">
                  <Droplets size={22} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    High-Pressure Water Pump Cannon
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                    Submersible DC pump suppression nozzle
                  </p>
                </div>
              </div>

              <button
                onClick={handlePumpToggle}
                className={`px-5 py-2.5 rounded-2xl font-black text-xs transition-all shadow-md cursor-pointer ${
                  isPumpActive
                    ? 'bg-teal-600 text-white shadow-teal-600/40 animate-pulse'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {isPumpActive ? 'SPRAYING ACTIVE' : 'PUMP OFF'}
              </button>
            </div>

            {/* Turret Cannon Angle Slider */}
            <div className="mt-2 pt-4 border-t border-slate-200/80 dark:border-slate-800">
              <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                <span>Cannon Turret Angle:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-black">{turretAngle}°</span>
              </div>
              <input
                type="range"
                min="-90"
                max="90"
                value={turretAngle}
                onChange={e => setTurretAngle(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1">
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
                <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
                  <Gauge size={22} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Maximum Speed Limit
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                    PWM motor speed duty cycle limiter
                  </p>
                </div>
              </div>

              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {speedLimit.toFixed(1)} m/s
              </span>
            </div>

            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={speedLimit}
              onChange={e => handleSpeedChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1">
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
