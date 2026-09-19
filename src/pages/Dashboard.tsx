import { useState, useEffect, useCallback } from 'react';
import TopNav, { NavTab } from '../components/TopNav';
import NavigationMap from '../components/cards/NavigationMap';
import SensorsView from '../components/views/SensorsView';
import AlertsView from '../components/views/AlertsView';
import RobotControlView from '../components/views/RobotControlView';
import LogsView from '../components/views/LogsView';
import SettingsView from '../components/views/SettingsView';
import AboutView from '../components/views/AboutView';
import { NORMAL_STATE, EMERGENCY_STATE, AlertItem } from '../data/mockData';
import {
  Wifi,
  Battery,
  Bot,
  MapPin,
  Flame,
  Activity,
  Gauge,
  Compass,
  Droplets,
  Zap,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
} from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

const REFRESH_INTERVAL = 15;

export default function Dashboard({ onLogout }: DashboardProps) {
  const [emergency, setEmergency] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [nextRefresh, setNextRefresh] = useState(REFRESH_INTERVAL);
  const [pumpActive, setPumpActive] = useState(false);

  const state = emergency ? EMERGENCY_STATE : NORMAL_STATE;

  useEffect(() => {
    const t = setInterval(() => {
      setNextRefresh(p => (p <= 1 ? REFRESH_INTERVAL : p - 1));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setAlerts(emergency ? [...EMERGENCY_STATE.alerts] : []);
  }, [emergency]);

  const unackAlertCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="min-h-screen w-full bg-light-app text-slate-800 font-sans flex flex-col select-none relative">
      {/* ── 🚨 FULL SCREEN RED BLINKING EMERGENCY OVERLAY ── */}
      {emergency && (
        <>
          <div className="fixed inset-0 pointer-events-none z-40 animate-red-screen-strobe border-8 border-red-600" />
          <div className="bg-red-600 text-white text-xs font-black py-2 px-4 text-center z-50 flex items-center justify-center gap-3 shadow-lg shadow-red-950/60 animate-pulse">
            <span className="text-base">🚨</span>
            <span>CRITICAL FIRE ALARM TRIGGERED! FIREBOT SENTINEL DISPATCHED TO ZONE A-2</span>
            <button
              onClick={() => setEmergency(false)}
              className="px-3 py-1 rounded-lg bg-white text-red-700 text-[11px] font-black hover:bg-slate-100 transition-all cursor-pointer border border-red-200"
            >
              SILENCE / RESET TEST ALARM
            </button>
          </div>
        </>
      )}

      {/* ── Top Floating Navigation Bar (No permanent left sidebar) ── */}
      <TopNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        unackAlertCount={unackAlertCount}
        emergency={emergency}
        onToggleEmergency={() => setEmergency(p => !p)}
        onLogout={onLogout}
      />

      {/* ── Main Content Container ── */}
      <main className="flex-1 pb-12">
        {activeTab === 'dashboard' && (
          <DashboardMainView
            state={state}
            emergency={emergency}
            pumpActive={pumpActive}
            onTogglePump={() => setPumpActive(!pumpActive)}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === 'map' && (
          <div className="max-w-[1700px] mx-auto p-4 md:p-6 flex flex-col gap-6 animate-fade-in">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Real-Time Floor Plan & Teleoperation Control
              </h1>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                Integrated live map telemetry navigation, obstacle radar, drive motor D-pad, and water cannon suppression panel
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Interactive Floor Plan Map */}
              <div className="lg:col-span-7 h-[calc(100vh-220px)] min-h-[580px]">
                <NavigationMap robot={state.robot} sensor={state.sensor} emergency={emergency} />
              </div>

              {/* Right Column: Teleoperation & Motor/Cannon Control Panel */}
              <div className="lg:col-span-5 flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-220px)]">
                <RobotControlView robot={state.robot} emergency={emergency} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sensors' && (
          <SensorsView sensor={state.sensor} robot={state.robot} />
        )}

        {activeTab === 'alerts' && <AlertsView />}

        {activeTab === 'logs' && <LogsView logs={state.logs} />}

        {activeTab === 'settings' && <SettingsView />}

        {activeTab === 'about' && <AboutView />}
      </main>
    </div>
  );
}

// ─── DASHBOARD MAIN OVERVIEW ──────────────────────────────────────────────────
function DashboardMainView({
  state,
  emergency,
  pumpActive,
  onTogglePump,
  onSelectTab,
}: {
  state: typeof NORMAL_STATE;
  emergency: boolean;
  pumpActive: boolean;
  onTogglePump: () => void;
  onSelectTab: (tab: NavTab) => void;
}) {
  return (
    <div className="max-w-[1700px] mx-auto p-4 md:p-6 flex flex-col gap-6 animate-fade-in">
      {/* ── Top 5 Glass KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Robot Status */}
        <div className="glass-card-light p-4 flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-600">
            <Bot size={22} />
          </div>
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Robot Status
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-base font-black text-slate-900">ONLINE</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Battery */}
        <div className="glass-card-light p-4 flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-100 border border-blue-200 text-blue-600">
            <Battery size={22} />
          </div>
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Battery Level
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-base font-black text-slate-900">
                {state.robot.battery}%
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">
                (12.4V)
              </span>
            </div>
          </div>
        </div>

        {/* KPI 3: Control Mode */}
        <div className="glass-card-light p-4 flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-100 border border-indigo-200 text-indigo-600">
            <Sliders size={22} />
          </div>
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Operation Mode
            </span>
            <span className="text-base font-black text-indigo-700 uppercase mt-0.5 block">
              AUTO PATROL
            </span>
          </div>
        </div>

        {/* KPI 4: Location */}
        <div className="glass-card-light p-4 flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-sky-100 border border-sky-200 text-sky-600">
            <MapPin size={22} />
          </div>
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Current Location
            </span>
            <span className="text-sm font-black text-slate-900 mt-0.5 block">
              Building A / Floor 2
            </span>
          </div>
        </div>

        {/* KPI 5: Fire Status */}
        <div
          className={`glass-card-light p-4 flex items-center gap-3 border-2 ${
            emergency
              ? 'bg-red-50/90 border-red-300 shadow-md shadow-red-500/10'
              : 'border-emerald-200/80'
          }`}
        >
          <div
            className={`p-3 rounded-2xl border ${
              emergency
                ? 'bg-red-600 text-white border-red-500 animate-bounce'
                : 'bg-emerald-100 text-emerald-600 border-emerald-200'
            }`}
          >
            <Flame size={22} />
          </div>
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Fire Status
            </span>
            <span
              className={`text-xs font-black uppercase mt-0.5 block ${
                emergency ? 'text-red-700 animate-pulse' : 'text-emerald-700'
              }`}
            >
              {emergency ? '🔥 FIRE IN ZONE A-2!' : 'NO FIRE DETECTED'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Section: Navigation Map + Side Telemetry Panel ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Large Navigation Map */}
        <div className="lg:col-span-8 min-h-[460px]">
          <NavigationMap robot={state.robot} sensor={state.sensor} emergency={emergency} />
        </div>

        {/* Side Glass Telemetry Panel */}
        <div className="lg:col-span-4 glass-card-light p-5 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Live Robot Telemetry
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                FireBot Sentinel X-1 Real-time Readouts
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase">
              SYNCED 5Hz
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card-sm-light p-3">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
                Speed
              </span>
              <span className="text-lg font-black text-slate-900 font-mono mt-0.5 block">
                1.4 m/s
              </span>
            </div>

            <div className="glass-card-sm-light p-3">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
                Heading Angle
              </span>
              <span className="text-lg font-black text-slate-900 font-mono mt-0.5 block">
                126° SE
              </span>
            </div>

            <div className="glass-card-sm-light p-3">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
                Ambient Temp
              </span>
              <span className="text-lg font-black text-orange-600 font-mono mt-0.5 block">
                {state.sensor.temperature.toFixed(1)}°C
              </span>
            </div>

            <div className="glass-card-sm-light p-3">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
                Target Distance
              </span>
              <span className="text-lg font-black text-blue-600 font-mono mt-0.5 block">
                4.2 m
              </span>
            </div>

            <div className="glass-card-sm-light p-3">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
                Water Tank
              </span>
              <span className="text-lg font-black text-sky-600 font-mono mt-0.5 block">
                82%
              </span>
            </div>

            <div className="glass-card-sm-light p-3">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
                Motor Driver
              </span>
              <span className="text-lg font-black text-emerald-600 font-mono mt-0.5 block">
                NOMINAL
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200">
            <span className="text-[10px] font-black text-blue-600 uppercase block">
              Current Mission Task
            </span>
            <span className="text-xs font-black text-slate-900 mt-0.5 block">
              {emergency
                ? 'SUPPRESSING FIRE IN LAB 201 (ZONE A-2)'
                : 'AUTONOMOUS PATROL — BUILDING A CORRIDOR B'}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
            <button
              onClick={onTogglePump}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                pumpActive
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30 animate-pulse'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {pumpActive ? 'PUMP SPRAY ACTIVE' : 'TOGGLE PUMP'}
            </button>

            <button
              onClick={() => onSelectTab('map')}
              className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all shadow-md shadow-blue-600/30 cursor-pointer"
            >
              CONTROL PANEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
