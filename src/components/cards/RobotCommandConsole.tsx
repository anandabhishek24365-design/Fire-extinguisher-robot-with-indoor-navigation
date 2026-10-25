import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Trash2, HelpCircle, Navigation, Compass, Play, Square, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

export interface ConsoleLog {
  id: string;
  time: string;
  type: 'cmd' | 'info' | 'success' | 'warn' | 'error';
  text: string;
}

interface RobotCommandConsoleProps {
  onExecuteCommand: (cmdString: string) => { success: boolean; message: string };
  logs: ConsoleLog[];
  onClearLogs: () => void;
  robotPos: { x: number; y: number; heading: number; speed: number; isAutoPatrol: boolean };
}

export default function RobotCommandConsole({
  onExecuteCommand,
  logs,
  onClearLogs,
  robotPos,
}: RobotCommandConsoleProps) {
  const [inputVal, setInputVal] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll terminal log to bottom on new entry
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed) return;

    // Add to history
    setCmdHistory(prev => [...prev, trimmed]);
    setHistoryIdx(-1);

    // Execute command
    onExecuteCommand(trimmed);
    setInputVal('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIdx === -1 ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInputVal(cmdHistory[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx === -1) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= cmdHistory.length) {
        setHistoryIdx(-1);
        setInputVal('');
      } else {
        setHistoryIdx(nextIdx);
        setInputVal(cmdHistory[nextIdx]);
      }
    }
  }

  function handleQuickCmd(cmd: string) {
    onExecuteCommand(cmd);
    if (inputRef.current) inputRef.current.focus();
  }

  return (
    <div className="rounded-2xl bg-slate-950 border-2 border-slate-800 shadow-2xl flex flex-col overflow-hidden text-mono font-mono text-xs">
      {/* Terminal Title Bar */}
      <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
            <Terminal size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-100 tracking-wide font-sans">
                Robot Command & Teleoperation Console
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                ONLINE • 115200 BAUD
              </span>
            </div>
            <p className="text-[11px] font-sans font-semibold text-slate-400 mt-0.5">
              Direct CLI control of FireBot Sentinel X-1. Type commands or click quick action buttons.
            </p>
          </div>
        </div>

        {/* Console Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuickCmd('help')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all font-sans font-bold flex items-center gap-1 cursor-pointer border border-slate-700"
            title="Show Console Help"
          >
            <HelpCircle size={14} /> Help
          </button>
          <button
            onClick={onClearLogs}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-all font-sans font-bold flex items-center gap-1 cursor-pointer border border-slate-700"
            title="Clear Console Terminal"
          >
            <Trash2 size={14} /> Clear
          </button>
        </div>
      </div>

      {/* Quick Interactive Command Buttons Strip */}
      <div className="bg-slate-900/60 p-2.5 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-sans font-extrabold text-slate-400 uppercase tracking-wider px-1 whitespace-nowrap">
          Quick Actions:
        </span>
        <button
          onClick={() => handleQuickCmd('forward 25')}
          className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 transition-all text-[11px] font-bold whitespace-nowrap cursor-pointer"
        >
          ⬆️ Forward 25m
        </button>
        <button
          onClick={() => handleQuickCmd('backward 15')}
          className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 transition-all text-[11px] font-bold whitespace-nowrap cursor-pointer"
        >
          ⬇️ Backward 15m
        </button>
        <button
          onClick={() => handleQuickCmd('left 45')}
          className="px-2.5 py-1 rounded-lg bg-teal-600/20 hover:bg-teal-600/40 text-teal-300 border border-teal-500/40 transition-all text-[11px] font-bold whitespace-nowrap cursor-pointer"
        >
          ↩️ Turn Left 45°
        </button>
        <button
          onClick={() => handleQuickCmd('right 45')}
          className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 transition-all text-[11px] font-bold whitespace-nowrap cursor-pointer"
        >
          ↪️ Turn Right 45°
        </button>
        <button
          onClick={() => handleQuickCmd('goto lab')}
          className="px-2.5 py-1 rounded-lg bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/40 transition-all text-[11px] font-bold whitespace-nowrap cursor-pointer"
        >
          📍 Go to Lab 201
        </button>
        <button
          onClick={() => handleQuickCmd('goto lobby')}
          className="px-2.5 py-1 rounded-lg bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/40 transition-all text-[11px] font-bold whitespace-nowrap cursor-pointer"
        >
          🏛️ Go to Main Lobby
        </button>
        <button
          onClick={() => handleQuickCmd('goto server')}
          className="px-2.5 py-1 rounded-lg bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/40 transition-all text-[11px] font-bold whitespace-nowrap cursor-pointer"
        >
          🖥️ Go to Server Room
        </button>
        <button
          onClick={() => handleQuickCmd('patrol')}
          className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 transition-all text-[11px] font-bold whitespace-nowrap cursor-pointer"
        >
          🔄 Auto Patrol
        </button>
        <button
          onClick={() => handleQuickCmd('stop')}
          className="px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/40 transition-all text-[11px] font-bold whitespace-nowrap cursor-pointer"
        >
          🛑 STOP
        </button>
      </div>

      {/* Terminal Log Output Area */}
      <div
        ref={logContainerRef}
        className="h-64 p-4 overflow-y-auto flex flex-col gap-1.5 bg-slate-950 font-mono text-[11px] leading-relaxed scrollbar-thin select-text"
      >
        <div className="text-slate-500 border-b border-slate-900 pb-2 mb-1">
          === FIREBOT SENTINEL REAL-TIME CLI CONSOLE v4.2 ===
          <br />
          Type <span className="text-cyan-400 font-bold">'help'</span> for list of robot movement & navigation commands.
        </div>

        {logs.map(log => (
          <div key={log.id} className="flex items-start gap-2">
            <span className="text-slate-600 text-[10px] select-none shrink-0 font-mono pt-0.5">
              [{log.time}]
            </span>
            {log.type === 'cmd' ? (
              <div className="text-cyan-400 font-bold flex items-center gap-1">
                <span className="text-blue-500">FireBot-OS&gt;</span> {log.text}
              </div>
            ) : log.type === 'success' ? (
              <div className="text-emerald-400 flex items-start gap-1">
                <span className="text-emerald-500 font-black">✓</span> {log.text}
              </div>
            ) : log.type === 'warn' ? (
              <div className="text-amber-400 flex items-start gap-1">
                <span className="text-amber-500 font-black">⚠</span> {log.text}
              </div>
            ) : log.type === 'error' ? (
              <div className="text-red-400 flex items-start gap-1">
                <span className="text-red-500 font-black">✗</span> {log.text}
              </div>
            ) : (
              <div className="text-slate-300">{log.text}</div>
            )}
          </div>
        ))}
      </div>

      {/* Console Input Bar */}
      <form onSubmit={handleSubmit} className="bg-slate-900 p-2.5 border-t border-slate-800 flex items-center gap-2">
        <span className="text-emerald-400 font-bold pl-2 select-none">Sentinel-OS&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter command (e.g. 'forward 20', 'goto living', 'left 90', 'stop', 'help')..."
          className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none font-mono text-xs py-1"
        />
        <button
          type="submit"
          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-sans font-extrabold text-xs transition-all shadow-md shadow-emerald-600/25 flex items-center gap-1.5 cursor-pointer"
        >
          <Send size={13} /> Send
        </button>
      </form>
    </div>
  );
}
