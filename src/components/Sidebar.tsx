import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  Activity,
  AlertTriangle,
  FileText,
  Settings,
  Users,
  Flame,
  X,
} from 'lucide-react';
import logoSrc from '../assets/logo.png';

export type TabId =
  | 'dashboard'
  | 'map'
  | 'sensors'
  | 'alerts'
  | 'logs'
  | 'settings'
  | 'about';

interface SidebarProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  unackAlertCount: number;
  emergency: boolean;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({
  activeTab,
  onSelectTab,
  unackAlertCount,
  emergency,
  isOpenMobile,
  onCloseMobile,
}: SidebarProps) {
  // Vibrant individual color themes for each tab
  const navItems = [
    {
      id: 'dashboard' as TabId,
      label: 'Dashboard',
      icon: LayoutDashboard,
      activeColor: 'text-emerald-700 dark:text-emerald-400',
      activeBg: 'bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent dark:from-emerald-500/20',
      indicatorBg: 'bg-gradient-to-b from-emerald-500 to-teal-600',
      badgeColor: 'bg-emerald-600',
    },
    {
      id: 'about' as TabId,
      label: 'About & Team',
      icon: Users,
      activeColor: 'text-pink-600 dark:text-pink-400',
      activeBg: 'bg-gradient-to-r from-pink-500/15 via-pink-500/5 to-transparent dark:from-pink-500/20',
      indicatorBg: 'bg-gradient-to-b from-pink-500 to-rose-600',
      badgeColor: 'bg-pink-600',
    },
    {
      id: 'map' as TabId,
      label: 'Live Map & Control',
      icon: MapPin,
      activeColor: 'text-cyan-600 dark:text-cyan-400',
      activeBg: 'bg-gradient-to-r from-cyan-500/15 via-cyan-500/5 to-transparent dark:from-cyan-500/20',
      indicatorBg: 'bg-gradient-to-b from-cyan-400 to-blue-600',
      badgeColor: 'bg-cyan-600',
    },
    {
      id: 'sensors' as TabId,
      label: 'Sensors',
      icon: Activity,
      activeColor: 'text-emerald-600 dark:text-emerald-400',
      activeBg: 'bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent dark:from-emerald-500/20',
      indicatorBg: 'bg-gradient-to-b from-emerald-400 to-teal-600',
      badgeColor: 'bg-emerald-600',
    },
    {
      id: 'alerts' as TabId,
      label: 'Alerts',
      icon: AlertTriangle,
      badge: unackAlertCount > 0 ? unackAlertCount : undefined,
      activeColor: 'text-amber-600 dark:text-amber-400',
      activeBg: 'bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent dark:from-amber-500/20',
      indicatorBg: 'bg-gradient-to-b from-amber-400 to-red-600',
      badgeColor: 'bg-red-600',
    },
    {
      id: 'logs' as TabId,
      label: 'Logs',
      icon: FileText,
      activeColor: 'text-purple-600 dark:text-purple-400',
      activeBg: 'bg-gradient-to-r from-purple-500/15 via-purple-500/5 to-transparent dark:from-purple-500/20',
      indicatorBg: 'bg-gradient-to-b from-purple-500 to-indigo-600',
      badgeColor: 'bg-purple-600',
    },
    {
      id: 'settings' as TabId,
      label: 'Settings',
      icon: Settings,
      activeColor: 'text-indigo-600 dark:text-indigo-400',
      activeBg: 'bg-gradient-to-r from-indigo-500/15 via-indigo-500/5 to-transparent dark:from-indigo-500/20',
      indicatorBg: 'bg-gradient-to-b from-indigo-400 to-blue-600',
      badgeColor: 'bg-indigo-600',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-md"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar Container with Premium Glass Effect */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 md:w-72 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-2xl border-r border-slate-200/80 dark:border-[#1A2336] flex flex-col justify-between p-5 transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-lg shadow-black/5 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Brand Logo */}
        <div>
          <div className="flex items-center justify-between pb-5 mb-2 border-b border-slate-100 dark:border-slate-800/80">
            <div
              className="flex items-center gap-3 cursor-pointer select-none group"
              onClick={() => onSelectTab('dashboard')}
            >
              {/* Official FireBot Logo with Glow */}
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#141A26] border border-slate-200/80 dark:border-slate-800 p-1 flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform overflow-hidden">
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
                <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0B0F19] animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
                    FireBot
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[9px] font-black tracking-wider uppercase shadow-sm">
                    PRO X-1
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-slate-400 leading-none mt-0.5">
                  Autonomous Sentinel System
                </p>
              </div>
            </div>

            {/* Mobile close button */}
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Navigation Items with rich individual color accents */}
          <nav className="flex flex-col gap-1.5 mt-4">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 relative cursor-pointer text-left group overflow-hidden ${
                    isActive
                      ? `${item.activeBg} ${item.activeColor} font-bold shadow-sm`
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/5'
                  }`}
                >
                  {/* Left rounded gradient indicator bar */}
                  {isActive && (
                    <span
                      className={`absolute left-0 top-2 bottom-2 w-1.5 ${item.indicatorBg} rounded-r-full shadow-md`}
                    />
                  )}

                  <div
                    className={`p-1.5 rounded-xl transition-all ${
                      isActive
                        ? 'bg-white/90 dark:bg-white/10 shadow-sm'
                        : 'group-hover:bg-slate-100 dark:group-hover:bg-white/5'
                    }`}
                  >
                    <Icon
                      size={18}
                      className={`transition-colors ${
                        isActive ? item.activeColor : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                      }`}
                    />
                  </div>

                  <span className="flex-1 tracking-tight">{item.label}</span>

                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-rose-500 text-white text-[10px] font-black shadow-md shadow-red-500/30 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Compact Sentinel X-1 System Status */}
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20" />
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-800 dark:text-slate-100 leading-tight">
                  Sentinel X-1
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  Firmware v2.4 Active
                </span>
              </div>
            </div>
            <div className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black border border-emerald-500/20">
              ONLINE
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
