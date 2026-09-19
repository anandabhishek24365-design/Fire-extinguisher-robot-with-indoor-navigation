import { useState } from 'react';
import {
  LayoutDashboard, Map, Camera, Activity, Bell,
  Gamepad2, ScrollText, Settings, Shield, X, Menu, LogOut,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'map', icon: Map, label: 'Live Map' },
  { id: 'camera', icon: Camera, label: 'Live Camera' },
  { id: 'sensors', icon: Activity, label: 'Sensors' },
  { id: 'alerts', icon: Bell, label: 'Alerts' },
  { id: 'control', icon: Gamepad2, label: 'Robot Control' },
  { id: 'logs', icon: ScrollText, label: 'Logs' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  active: string;
  onChange: (id: string) => void;
  emergency: boolean;
  onLogout: () => void;
}

export default function Sidebar({ active, onChange, emergency, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col h-full glass"
        style={{
          width: collapsed ? 64 : 220,
          minWidth: collapsed ? 64 : 220,
          borderRadius: 0,
          borderTop: 'none',
          borderBottom: 'none',
          borderLeft: 'none',
          background: 'rgba(7, 11, 20, 0.7)',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
          transition: 'width 0.25s ease, min-width 0.25s ease',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-4 py-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div
            className="w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center"
            style={{
              background: emergency
                ? 'linear-gradient(135deg, rgba(255,107,44,0.3), rgba(255,46,46,0.2))'
                : 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(59,130,246,0.2))',
              border: `1px solid ${emergency ? 'rgba(255,107,44,0.4)' : 'rgba(0,229,255,0.3)'}`,
            }}
          >
            <Shield size={16} style={{ color: emergency ? '#FF6B2C' : '#00E5FF' }} />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="text-sm font-bold leading-tight whitespace-nowrap" style={{ color: '#F0F6FF' }}>
                FireBot
              </div>
              <div className="text-xs whitespace-nowrap" style={{ color: 'rgba(240,246,255,0.4)' }}>
                Control Center
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(p => !p)}
            className="ml-auto flex-shrink-0"
            style={{ color: 'rgba(240,246,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
          >
            {collapsed ? <Menu size={14} /> : <X size={14} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = active === item.id;
            const isAlert = item.id === 'alerts' && emergency;
            return (
              <button
                key={item.id}
                onClick={() => onChange(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-left transition-all"
                style={{
                  background: isActive
                    ? 'rgba(0,229,255,0.1)'
                    : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(0,229,255,0.2)' : 'transparent'}`,
                  color: isActive ? '#00E5FF' : isAlert ? '#FF6B2C' : 'rgba(240,246,255,0.55)',
                  cursor: 'pointer',
                }}
              >
                <Icon size={16} className="flex-shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium whitespace-nowrap flex-1">{item.label}</span>
                )}
                {!collapsed && isAlert && (
                  <span
                    className="w-2 h-2 rounded-full animate-pulse-slow flex-shrink-0"
                    style={{ background: '#FF2E2E' }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom: info + logout */}
        <div className="px-2 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {!collapsed && (
            <div className="px-2 mb-2">
              <div className="text-xs" style={{ color: 'rgba(240,246,255,0.25)', fontFamily: 'JetBrains Mono' }}>
                Circuitech Team 13
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(240,246,255,0.18)', fontFamily: 'JetBrains Mono' }}>
                IoT Fire Safety v1.0
              </div>
            </div>
          )}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
            style={{
              background: 'rgba(255,46,46,0.06)',
              border: '1px solid rgba(255,46,46,0.15)',
              color: 'rgba(255,107,44,0.8)',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,46,46,0.14)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,46,46,0.35)';
              (e.currentTarget as HTMLButtonElement).style.color = '#FF6B2C';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,46,46,0.06)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,46,46,0.15)';
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,107,44,0.8)';
            }}
          >
            <LogOut size={16} className="flex-shrink-0" />
            {!collapsed && (
              <span className="text-sm font-medium whitespace-nowrap">Logout</span>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around py-2"
        style={{
          background: 'rgba(7,11,20,0.95)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {NAV_ITEMS.slice(0, 4).map(item => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className="flex flex-col items-center gap-1 px-3 py-1"
              style={{ color: isActive ? '#00E5FF' : 'rgba(240,246,255,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <Icon size={18} />
              <span style={{ fontSize: 9, fontWeight: 500 }}>{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={onLogout}
          className="flex flex-col items-center gap-1 px-3 py-1"
          style={{ color: 'rgba(255,107,44,0.8)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <LogOut size={18} />
          <span style={{ fontSize: 9, fontWeight: 500 }}>Logout</span>
        </button>
      </nav>
    </>
  );
}
