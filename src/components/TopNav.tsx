import {
  LayoutDashboard,
  MapPin,
  Activity,
  AlertTriangle,
  Gamepad2,
  FileText,
  Settings,
  Info,
  Users,
  Bell,
  Wifi,
  LogOut,
  Flame,
  Shield,
  Zap,
} from 'lucide-react';
import logoSrc from '../assets/logo.png';

export type NavTab =
  | 'dashboard'
  | 'about'
  | 'map'
  | 'sensors'
  | 'alerts'
  | 'logs'
  | 'settings';

interface TopNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  unackAlertCount: number;
  emergency: boolean;
  onToggleEmergency: () => void;
  onLogout: () => void;
}

export default function TopNav({
  activeTab,
  onTabChange,
  unackAlertCount,
  emergency,
  onToggleEmergency,
  onLogout,
}: TopNavProps) {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { id: 'about', label: 'About', icon: <Info size={16} /> },
    { id: 'map', label: 'Live Map & Control', icon: <MapPin size={16} /> },
    { id: 'sensors', label: 'Sensors', icon: <Activity size={16} /> },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: (
        <div className="relative">
          <AlertTriangle size={16} />
          {unackAlertCount > 0 && (
            <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
              {unackAlertCount}
            </span>
          )}
        </div>
      ),
    },
    { id: 'logs', label: 'Logs', icon: <FileText size={16} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-3 bg-[#0B132B]/95 backdrop-blur-2xl border-b border-slate-700/80 shadow-xl shadow-black/40 text-slate-100">
      <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 min-w-max">
          <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#070D19] p-1 border border-slate-700/80 shadow-md shadow-orange-500/20 flex items-center justify-center">
            <img
              src={logoSrc}
              alt="FireBot Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.fallback) {
                  target.dataset.fallback = 'true';
                  target.src = '/logo.png';
                }
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base tracking-tight font-sans drop-shadow-sm">
                FIREBOT
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold tracking-wider uppercase border border-blue-400/40">
                PRO X-1
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-400 hidden sm:block">
              Autonomous Fire Response System
            </p>
          </div>
        </div>

        {/* Center: Floating Dark Glass Navigation Bar (Horizontal Tabs) */}
        <nav className="hidden lg:flex items-center p-1.5 rounded-2xl bg-[#070D19]/90 backdrop-blur-md border border-slate-700/80 shadow-inner gap-1 overflow-x-auto">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40 border border-blue-400 font-black scale-[1.02]'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Mobile Navigation Dropdown Select for smaller screens */}
        <div className="flex lg:hidden flex-1 max-w-[200px]">
          <select
            value={activeTab}
            onChange={e => onTabChange(e.target.value as NavTab)}
            className="w-full py-2 px-3 rounded-xl bg-[#070D19] border border-slate-700 text-xs font-bold text-white focus:outline-none"
          >
            {navItems.map(item => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Live Connection, Emergency Switch, Profile & Logout */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-max">
          {/* Connection Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Wifi size={13} className="text-emerald-400" />
            <span>ONLINE</span>
          </div>

          {/* Emergency Alert Switch */}
          <button
            onClick={onToggleEmergency}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
              emergency
                ? 'bg-red-600 text-white border border-red-400 animate-bounce'
                : 'bg-amber-950/80 text-amber-300 border border-amber-500/50 hover:bg-amber-900/90'
            }`}
            title="Toggle Fire Simulation Emergency State"
          >
            <Zap size={14} className={emergency ? 'text-white' : 'text-amber-400'} />
            <span className="hidden md:inline">
              {emergency ? 'SIMULATION EMERGENCY' : 'TRIGGER TEST ALERT'}
            </span>
          </button>

          {/* Notification Button */}
          <button
            onClick={() => onTabChange('alerts')}
            className="relative p-2 rounded-xl bg-[#070D19] border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-all cursor-pointer"
            title="View Alerts"
          >
            <Bell size={18} />
            {unackAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                {unackAlertCount}
              </span>
            )}
          </button>

          {/* User Profile */}
          <div className="hidden md:flex items-center gap-2.5 pl-2 border-l border-slate-700/80">
            <div className="w-8 h-8 rounded-full bg-blue-900/60 border border-blue-500/40 text-blue-300 font-black text-xs flex items-center justify-center">
              OP
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-white leading-tight">
                Operator
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                Command Center
              </span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-[#070D19] hover:bg-red-950/80 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-500/50 transition-colors cursor-pointer"
            title="Exit Command Center"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
