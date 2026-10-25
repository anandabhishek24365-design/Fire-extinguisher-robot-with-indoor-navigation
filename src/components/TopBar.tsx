import React, { useState } from 'react';
import {
  Search,
  Bell,
  Moon,
  Sun,
  Menu,
  Zap,
  LogOut,
  ChevronDown,
  User,
  ShieldCheck,
  Flame,
  Radio,
  Battery,
  Wifi,
} from 'lucide-react';

interface TopBarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  unackAlertCount: number;
  emergency: boolean;
  onToggleEmergency: () => void;
  onOpenMobileMenu: () => void;
  onOpenNotifications: () => void;
  onLogout: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export default function TopBar({
  theme,
  onToggleTheme,
  unackAlertCount,
  emergency,
  onToggleEmergency,
  onOpenMobileMenu,
  onOpenNotifications,
  onLogout,
  searchQuery = '',
  onSearchChange,
}: TopBarProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full px-4 md:px-8 py-3.5 bg-white/70 dark:bg-[#0B0F19]/85 backdrop-blur-2xl border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-4 transition-colors shadow-sm">
      {/* Left: Mobile hamburger + Search Bar with multi-color focus ring */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2.5 rounded-2xl bg-white dark:bg-[#141A26] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-sm cursor-pointer hover:border-emerald-400"
          aria-label="Open sidebar"
        >
          <Menu size={18} />
        </button>

        {/* Search Input with soft glass effect */}
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search sensors, rooms, logs, coordinates..."
            className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-slate-50/90 dark:bg-[#131A29] border border-slate-200/90 dark:border-[#202B40] text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm shadow-sm outline-none focus:border-emerald-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
          />
          <Search
            size={18}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
          />
        </div>
      </div>

      {/* Right Controls with multi-color telemetry pills */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Cyan Wi-Fi IoT Pill */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 text-xs font-bold">
          <Wifi size={13} className="text-cyan-500" />
          <span>ThingSpeak IoT 5G</span>
        </div>

        {/* Emerald Battery Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
          <Battery size={14} className="text-emerald-500" />
          <span>78% (12.4V)</span>
        </div>

        {/* Emergency / System Status Switch Pill */}
        <button
          onClick={onToggleEmergency}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black transition-all shadow-sm cursor-pointer border ${
            emergency
              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-500 animate-pulse shadow-red-500/30 shadow-md'
              : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800/80 hover:bg-emerald-100/80'
          }`}
          title="Toggle Simulation Emergency Alarm"
        >
          {emergency ? (
            <>
              <Flame size={14} className="animate-bounce text-amber-200" />
              <span>FIRE ALARM ACTIVE</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>SYSTEM ONLINE</span>
            </>
          )}
        </button>

        {/* Blue Notification Bell Button with Red Badge */}
        <button
          onClick={onOpenNotifications}
          className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white flex items-center justify-center transition-all active:scale-95 shadow-md shadow-blue-500/30 cursor-pointer"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {unackAlertCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-600 border-2 border-white dark:border-[#0B0F19] text-white text-[10px] font-black flex items-center justify-center animate-pulse shadow-sm">
              {unackAlertCount}
            </span>
          )}
        </button>

        {/* Operator Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1 sm:pr-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer select-none"
          >
            {/* Multi-color gradient ring around avatar */}
            <div className="p-0.5 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                <User size={16} className="text-cyan-300" />
              </div>
            </div>

            <span className="hidden sm:inline font-bold text-sm text-slate-800 dark:text-slate-100">
              Operator
            </span>
            <ChevronDown size={14} className="hidden sm:inline text-slate-400" />
          </button>

          {/* Profile Dropdown Menu */}
          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setProfileOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#141A26] border border-slate-200 dark:border-[#222C3E] shadow-2xl z-40 py-2 animate-fade-in text-sm">
                <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <p className="font-black text-slate-900 dark:text-white">FireBot Operator</p>
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[9px] font-black">ADMIN</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Autonomous Sentinel System</p>
                </div>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onToggleEmergency();
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2.5 text-slate-700 dark:text-slate-200 cursor-pointer font-medium"
                >
                  <Zap size={15} className="text-amber-500" />
                  <span>Test Emergency Alert</span>
                </button>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 flex items-center gap-2.5 cursor-pointer border-t border-slate-100 dark:border-slate-800 font-medium"
                >
                  <LogOut size={15} />
                  <span>Log Out</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-800 dark:text-white bg-slate-100/80 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition cursor-pointer shadow-sm border border-slate-200/50 dark:border-white/10"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun size={19} className="text-amber-400 fill-amber-400" />
          ) : (
            <Moon size={19} className="text-slate-800 fill-slate-800" />
          )}
        </button>
      </div>
    </header>
  );
}
