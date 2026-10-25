import { useState } from 'react';
import {
  AlertTriangle,
  Flame,
  ShieldAlert,
  Info,
  CheckCircle2,
  Search,
  Check,
  Send,
  RotateCcw,
  MapPin,
  Clock,
} from 'lucide-react';

export interface AlertRecord {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  sensor: string;
  location: string;
  description: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

const INITIAL_ALERTS: AlertRecord[] = [
  {
    id: 'alt-1',
    severity: 'critical',
    sensor: 'IR Flame Sensor #02',
    location: 'Zone A-2 (Lab 201)',
    description: 'High intensity optical flame detected. Auto-suppression initiated.',
    timestamp: '19:42:10 (2 mins ago)',
    status: 'active',
  },
  {
    id: 'alt-2',
    severity: 'critical',
    sensor: 'MQ-2 Gas Sensor',
    location: 'Zone B-4 (Server Room)',
    description: 'Combustible gas density exceeded threshold (420 ppm).',
    timestamp: '19:40:05 (4 mins ago)',
    status: 'active',
  },
  {
    id: 'alt-3',
    severity: 'warning',
    sensor: 'Motor Thermal Couple',
    location: 'Drive Motor Right',
    description: 'Drive motor temperature approaching 68°C operational limit.',
    timestamp: '19:35:12 (9 mins ago)',
    status: 'active',
  },
  {
    id: 'alt-4',
    severity: 'warning',
    sensor: 'LiFePO4 BMS',
    location: 'Battery Array',
    description: 'Battery charge level below 20% alert threshold (Current: 18%).',
    timestamp: '19:28:44 (16 mins ago)',
    status: 'acknowledged',
  },
  {
    id: 'alt-5',
    severity: 'warning',
    sensor: 'Ultrasonic Array',
    location: 'Front Bumper',
    description: 'Static obstacle blocking Corridor B navigation route.',
    timestamp: '19:15:30 (29 mins ago)',
    status: 'acknowledged',
  },
  {
    id: 'alt-6',
    severity: 'info',
    sensor: 'ThingSpeak IoT Gateway',
    location: 'Telemetry Channel 2768924',
    description: 'System telemetry handshake synchronized successfully (15s interval).',
    timestamp: '19:00:00 (44 mins ago)',
    status: 'resolved',
  },
];

export default function AlertsView() {
  const [alerts, setAlerts] = useState<AlertRecord[]>(INITIAL_ALERTS);
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  function handleAcknowledge(id: string) {
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, status: 'acknowledged' } : a))
    );
  }

  function handleResolve(id: string) {
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, status: 'resolved' } : a))
    );
  }

  const filteredAlerts = alerts.filter(a => {
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.sensor.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const criticalCount = alerts.filter(a => a.severity === 'critical' && a.status === 'active').length;
  const warningCount = alerts.filter(a => a.severity === 'warning' && a.status === 'active').length;
  const infoCount = alerts.filter(a => a.severity === 'info').length;

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-[1700px] mx-auto p-4 md:p-6">
      {/* Title & Top KPIs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Emergency Incident Alert Center
          </h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Real-time safety notifications, sensor warnings and automated emergency dispatch logs
          </p>
        </div>

        {/* Quick KPI Badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs font-bold">
            <Flame size={16} className="text-red-600 dark:text-red-400" />
            <span>Critical: <strong className="font-black text-slate-900 dark:text-white">{criticalCount}</strong></span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 text-xs font-bold">
            <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400" />
            <span>Warnings: <strong className="font-black text-slate-900 dark:text-white">{warningCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card-light p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Severity Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'all', label: `All (${alerts.length})` },
            { id: 'critical', label: `Critical (${criticalCount})` },
            { id: 'warning', label: `Warning (${warningCount})` },
            { id: 'info', label: `Info (${infoCount})` },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSeverityFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                severityFilter === f.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search alerts by location, sensor, or description..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-[#141A26] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-950/40"
          />
        </div>
      </div>

      {/* Alert List */}
      <div className="flex flex-col gap-3">
        {filteredAlerts.length === 0 ? (
          <div className="glass-card-light p-12 text-center flex flex-col items-center justify-center">
            <CheckCircle2 size={42} className="text-emerald-500 mb-3" />
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
              No Alerts Match Your Filter
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              All monitored zones and sensor thresholds are currently within safe limits.
            </p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`glass-card-light p-5 border-l-4 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                alert.severity === 'critical'
                  ? 'border-l-red-600'
                  : alert.severity === 'warning'
                  ? 'border-l-amber-500'
                  : 'border-l-emerald-500'
              }`}
            >
              {/* Left Content */}
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-3 rounded-2xl border ${
                    alert.severity === 'critical'
                      ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-600 dark:text-red-400'
                      : alert.severity === 'warning'
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-400'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {alert.severity === 'critical' ? (
                    <Flame size={22} className="animate-pulse" />
                  ) : alert.severity === 'warning' ? (
                    <AlertTriangle size={22} />
                  ) : (
                    <Info size={22} />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                        alert.severity === 'critical'
                          ? 'bg-red-600 text-white border-red-500'
                          : alert.severity === 'warning'
                          ? 'bg-amber-500 text-white border-amber-400'
                          : 'bg-emerald-600 text-white border-emerald-500'
                      }`}
                    >
                      {alert.severity}
                    </span>

                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {alert.sensor}
                    </h3>

                    <span className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-400">
                      <MapPin size={12} className="text-emerald-600 dark:text-emerald-400" />
                      {alert.location}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1.5">
                    {alert.description}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] font-mono font-semibold text-slate-400 mt-2">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {alert.timestamp}
                    </span>
                    <span>•</span>
                    <span className="uppercase">Status: <strong className="text-slate-700 dark:text-slate-200">{alert.status}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 min-w-max">
                {alert.status === 'active' && (
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check size={14} />
                    Acknowledge
                  </button>
                )}

                {alert.severity === 'critical' && (
                  <button
                    onClick={() => window.alert('Robot Dispatched to ' + alert.location)}
                    className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md shadow-red-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send size={14} />
                    Dispatch Robot
                  </button>
                )}

                {alert.status !== 'resolved' && (
                  <button
                    onClick={() => handleResolve(alert.id)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 size={14} />
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
