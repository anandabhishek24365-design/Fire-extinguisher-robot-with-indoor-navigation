import { useState } from 'react';
import { Download, Search, Filter, FileText, CheckCircle2, AlertTriangle, Flame, Info, FileSpreadsheet, Printer } from 'lucide-react';
import { LogEntry } from '../../data/mockData';
import { exportLogsToExcel, openPrintableLogsPdf } from '../../utils/sensorExport';

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
      'data:text/csv;charset=utf-8,\uFEFF' +
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

  function exportExcel() {
    exportLogsToExcel(filteredLogs);
  }

  function exportPdf() {
    openPrintableLogsPdf(filteredLogs);
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-[1700px] mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            System Event & Activity Logs
          </h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Audit log of robot telemetry broadcasts, autonomous decisions, and ThingSpeak API requests
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={exportExcel}
            className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-md shadow-emerald-600/25 transition-all flex items-center gap-2 cursor-pointer"
            title="Export Activity Logs as Excel Spreadsheet"
          >
            <FileSpreadsheet size={15} />
            Export Excel
          </button>

          <button
            onClick={exportPdf}
            className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-black text-xs shadow-md shadow-rose-600/25 transition-all flex items-center gap-2 cursor-pointer"
            title="Save / Print Logs as PDF"
          >
            <FileText size={15} />
            Export PDF
          </button>

          <button
            onClick={exportCsv}
            className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black dark:from-slate-700 dark:to-slate-800 text-white font-black text-xs shadow-md shadow-slate-900/20 transition-all flex items-center gap-2 cursor-pointer"
            title="Export as CSV file"
          >
            <Download size={15} />
            Export CSV
          </button>
        </div>
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
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
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
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-[#141A26] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-950/40"
          />
        </div>
      </div>

      {/* Log Table */}
      <div className="glass-card-light overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/90 dark:bg-[#182132] border-b border-slate-200 dark:border-slate-800 text-[11px] font-black uppercase text-slate-700 dark:text-slate-200 tracking-wider">
                <th className="py-3.5 px-5">Timestamp</th>
                <th className="py-3.5 px-5">Severity</th>
                <th className="py-3.5 px-5">Event Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-5 font-mono text-slate-600 dark:text-slate-300 font-bold whitespace-nowrap">
                    {log.time instanceof Date ? log.time.toLocaleTimeString() : String(log.time)}
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                        log.severity === 'critical'
                          ? 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800'
                          : log.severity === 'warning'
                          ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 font-semibold text-slate-900 dark:text-slate-100">
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
