import { useState } from 'react';
import { Download, Search, Filter, FileText, CheckCircle2, AlertTriangle, Flame, Info } from 'lucide-react';
import { LogEntry } from '../../data/mockData';

interface LogsViewProps {
  logs: LogEntry[];
}

export default function LogsView({ logs }: LogsViewProps) {
  const [filterType, setFilterType] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filteredLogs = logs.filter(l => {
    if (filterType !== 'all' && l.severity !== filterType) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const timeStr = l.time instanceof Date ? l.time.toLocaleTimeString() : String(l.time);
      return (
        l.event.toLowerCase().includes(q) ||
        timeStr.toLowerCase().includes(q) ||
        l.severity.toLowerCase().includes(q)
      );
    }
    return true;
  });

  function exportCsv() {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Timestamp,Severity,Event Description', ...filteredLogs.map(l => {
        const tStr = l.time instanceof Date ? l.time.toLocaleTimeString() : String(l.time);
        return `"${tStr}","${l.severity}","${l.event}"`;
      })].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `firebot_activity_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-[1700px] mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            System Event & Activity Logs
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Audit log of robot telemetry broadcasts, autonomous decisions, and ThingSpeak API requests
          </p>
        </div>

        <button
          onClick={exportCsv}
          className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Download size={16} />
          Export CSV Logs
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card-light p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'info', 'warning', 'critical'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black capitalize transition-all cursor-pointer ${
                filterType === t
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search activity logs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Log Table */}
      <div className="glass-card-light overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200/80 text-[11px] font-extrabold uppercase text-slate-600 tracking-wider">
                <th className="py-3.5 px-5">Timestamp</th>
                <th className="py-3.5 px-5">Severity</th>
                <th className="py-3.5 px-5">Event Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-5 font-mono text-slate-500 font-bold whitespace-nowrap">
                    {log.time instanceof Date ? log.time.toLocaleTimeString() : String(log.time)}
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                        log.severity === 'critical'
                          ? 'bg-red-100 text-red-700 border-red-300'
                          : log.severity === 'warning'
                          ? 'bg-amber-100 text-amber-700 border-amber-300'
                          : 'bg-blue-100 text-blue-700 border-blue-300'
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 font-medium text-slate-800">
                    {log.event}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
