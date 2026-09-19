import { useState } from 'react';
import { Square, RotateCcw, Play, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props { emergency: boolean; }

export default function RobotControlCard({ emergency }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [stopped, setStopped] = useState(false);

  function press(cmd: string) {
    setActive(cmd);
    setStopped(false);
  }

  function release() {
    setActive(null);
  }

  function eStop() {
    setStopped(true);
    setActive(null);
  }

  return (
    <div className="glass h-full flex flex-col p-4">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold" style={{ color: '#F0F6FF' }}>Robot Control</h3>
        {/* Mode toggle */}
        <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
          {(['auto', 'manual'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="px-2.5 py-1 text-xs font-medium capitalize transition-all"
              style={{
                background: mode === m ? 'rgba(0,229,255,0.15)' : 'transparent',
                color: mode === m ? '#00E5FF' : 'rgba(240,246,255,0.4)',
                border: 'none', cursor: 'pointer',
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      {mode === 'auto' && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={() => setStopped(false)}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.25)',
              color: '#22C55E', cursor: 'pointer',
            }}
          >
            <Play size={12} />
            Start Patrol
          </button>
          <button
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: 'rgba(0,229,255,0.08)',
              border: '1px solid rgba(0,229,255,0.2)',
              color: '#00E5FF', cursor: 'pointer',
            }}
          >
            <RotateCcw size={12} />
            Return to Base
          </button>
        </div>
      )}

      {/* D-pad (manual mode) */}
      {mode === 'manual' && (
        <div className="flex justify-center mb-3">
          <div className="relative w-28 h-28">
            {/* Up */}
            <DPadBtn
              icon={<ChevronUp size={16} />}
              active={active === 'up'}
              style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }}
              onDown={() => press('up')} onUp={release}
            />
            {/* Down */}
            <DPadBtn
              icon={<ChevronDown size={16} />}
              active={active === 'down'}
              style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)' }}
              onDown={() => press('down')} onUp={release}
            />
            {/* Left */}
            <DPadBtn
              icon={<ChevronLeft size={16} />}
              active={active === 'left'}
              style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }}
              onDown={() => press('left')} onUp={release}
            />
            {/* Right */}
            <DPadBtn
              icon={<ChevronRight size={16} />}
              active={active === 'right'}
              style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
              onDown={() => press('right')} onUp={release}
            />
            {/* Center dot */}
            <div
              className="absolute"
              style={{
                width: 20, height: 20, borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
              }}
            />
          </div>
        </div>
      )}

      {/* Status */}
      {stopped && (
        <div
          className="text-center text-xs font-bold mb-2 py-1.5 rounded-lg animate-pulse-slow"
          style={{ background: 'rgba(255,46,46,0.1)', color: '#FF2E2E', border: '1px solid rgba(255,46,46,0.2)' }}
        >
          EMERGENCY STOP ACTIVE
        </div>
      )}
      {active && (
        <div
          className="text-center text-xs font-medium mb-2 py-1.5 rounded-lg"
          style={{ background: 'rgba(0,229,255,0.08)', color: '#00E5FF', border: '1px solid rgba(0,229,255,0.15)' }}
        >
          Sending: {active.toUpperCase()}
        </div>
      )}

      {/* Emergency stop */}
      <button
        onClick={eStop}
        className="btn-danger w-full py-3 flex items-center justify-center gap-2 mt-auto text-sm font-bold"
        style={{
          fontSize: 14,
          boxShadow: stopped ? '0 0 30px rgba(255,46,46,0.5)' : '0 4px 16px rgba(255,46,46,0.25)',
        }}
      >
        <Square size={14} fill="white" />
        EMERGENCY STOP
      </button>
    </div>
  );
}

function DPadBtn({ icon, active, style, onDown, onUp }: any) {
  return (
    <button
      onMouseDown={onDown} onMouseUp={onUp} onMouseLeave={onUp}
      onTouchStart={onDown} onTouchEnd={onUp}
      style={{
        ...style,
        width: 36, height: 36,
        borderRadius: 10,
        background: active ? 'rgba(0,229,255,0.2)' : 'rgba(255,255,255,0.06)',
        border: `1px solid ${active ? 'rgba(0,229,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
        color: active ? '#00E5FF' : 'rgba(240,246,255,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.1s ease',
      }}
    >
      {icon}
    </button>
  );
}
