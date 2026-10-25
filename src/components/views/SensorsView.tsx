import { useState, useEffect, useRef } from 'react';
import {
  Thermometer,
  Droplets,
  Wind,
  Flame,
  Gauge,
  Ruler,
  Eye,
  Battery,
  Compass,
  MapPin,
  Waves,
  Clock,
  LineChart as LineChartIcon,
  Radio,
  ExternalLink,
  Plus,
  Zap,
  Play,
  Pause,
  TrendingUp,
  Activity,
  Layers,
  BarChart2,
  Sliders,
  AlertCircle,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  Download,
  Printer,
  ChevronDown,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import {
  exportSensorsToExcel,
  exportSensorsToCSV,
  exportSensorsToPDFFile,
  openPrintablePdfReport,
} from '../../utils/sensorExport';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend,
} from 'recharts';
import { SensorData, RobotState, HistoryPoint } from '../../data/mockData';

interface SensorsViewProps {
  sensor: SensorData;
  robot: RobotState;
  history?: HistoryPoint[];
}

interface SensorItem {
  id: string;
  name: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical' | 'success';
  statusText: string;
  icon: React.ReactNode;
  updated: string;
  sparkline: number[];
}

export interface ExtendedHistoryPoint extends HistoryPoint {
  battery?: number;
}

type GraphSensorKey = 'temperature' | 'humidity' | 'gas' | 'distance' | 'flame' | 'battery' | 'all';
type ChartStyle = 'area' | 'line' | 'bar';

const SENSOR_METRICS: Array<{
  key: GraphSensorKey;
  label: string;
  unit: string;
  color: string;
  secondaryColor: string;
  threshold?: number;
  thresholdLabel?: string;
  domain: [number, number];
  icon: React.ReactNode;
}> = [
  {
    key: 'temperature',
    label: 'Temperature',
    unit: '°C',
    color: '#F97316',
    secondaryColor: '#FB923C',
    threshold: 50,
    thresholdLabel: 'High Temp Threshold (50°C)',
    domain: [15, 85],
    icon: <Thermometer size={15} />,
  },
  {
    key: 'humidity',
    label: 'Humidity',
    unit: '%',
    color: '#0284C7',
    secondaryColor: '#38BDF8',
    threshold: 85,
    thresholdLabel: 'High Humidity Warning (85%)',
    domain: [10, 100],
    icon: <Droplets size={15} />,
  },
  {
    key: 'gas',
    label: 'Combustible Gas',
    unit: ' ppm',
    color: '#EAB308',
    secondaryColor: '#FACC15',
    threshold: 300,
    thresholdLabel: 'Hazard Gas Limit (300 ppm)',
    domain: [0, 600],
    icon: <Gauge size={15} />,
  },
  {
    key: 'distance',
    label: 'Ultrasonic Distance',
    unit: ' cm',
    color: '#10B981',
    secondaryColor: '#34D399',
    threshold: 30,
    thresholdLabel: 'Obstacle Warning (30 cm)',
    domain: [0, 220],
    icon: <Ruler size={15} />,
  },
  {
    key: 'flame',
    label: 'IR Flame Index',
    unit: '',
    color: '#EF4444',
    secondaryColor: '#F87171',
    threshold: 0.5,
    thresholdLabel: 'Fire Detection Level',
    domain: [0, 1.2],
    icon: <Flame size={15} />,
  },
  {
    key: 'battery',
    label: 'LiFePO4 Battery',
    unit: '%',
    color: '#8B5CF6',
    secondaryColor: '#A78BFA',
    threshold: 20,
    thresholdLabel: 'Low Battery Level (20%)',
    domain: [0, 100],
    icon: <Battery size={15} />,
  },
  {
    key: 'all',
    label: 'Multi-Sensor Overlay',
    unit: '',
    color: '#2563EB',
    secondaryColor: '#60A5FA',
    domain: [0, 100],
    icon: <Layers size={15} />,
  },
];

export default function SensorsView({ sensor, robot, history }: SensorsViewProps) {
  const [timeFilter, setTimeFilter] = useState<'1M' | '5M' | '30M' | '1H'>('5M');
  const [activeChartTab, setActiveChartTab] = useState<'grid' | 'field1' | 'field2' | 'field3' | 'field4'>('grid');
  const [channelId] = useState('2768924');

  // Demo Graph Interactive Controls
  const [activeGraphSensor, setActiveGraphSensor] = useState<GraphSensorKey>('temperature');
  const [chartStyle, setChartStyle] = useState<ChartStyle>('area');
  const [isLiveSim, setIsLiveSim] = useState(true);
  const [showThreshold, setShowThreshold] = useState(true);

  // Export dropdown states & Toast feedback
  const [showExcelMenu, setShowExcelMenu] = useState(false);
  const [showPdfMenu, setShowPdfMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const excelMenuRef = useRef<HTMLDivElement>(null);
  const pdfMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (excelMenuRef.current && !excelMenuRef.current.contains(event.target as Node)) {
        setShowExcelMenu(false);
      }
      if (pdfMenuRef.current && !pdfMenuRef.current.contains(event.target as Node)) {
        setShowPdfMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function triggerToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  }

  function handleExportExcel(format: 'xls' | 'csv' = 'xls') {
    if (format === 'xls') {
      exportSensorsToExcel({
        history: demoData,
        sensor,
        robot,
      });
      triggerToast(`Exported ${demoData.length} records to Excel Workbook (.xls)`);
    } else {
      exportSensorsToCSV({
        history: demoData,
        sensor,
        robot,
      });
      triggerToast(`Exported ${demoData.length} records to CSV Spreadsheet (.csv)`);
    }
    setShowExcelMenu(false);
  }

  function handleExportPdf(type: 'download' | 'print' = 'download') {
    if (type === 'download') {
      exportSensorsToPDFFile({
        history: demoData,
        sensor,
        robot,
      });
      triggerToast(`Generated & downloaded PDF Telemetry Report`);
    } else {
      openPrintablePdfReport({
        history: demoData,
        sensor,
        robot,
      });
      triggerToast(`Opened High-Res Print / Save as PDF Dialog`);
    }
    setShowPdfMenu(false);
  }

  // Initial Demo Data Setup
  const [demoData, setDemoData] = useState<ExtendedHistoryPoint[]>(() => {
    if (history && history.length > 0) {
      return history.map((h, i) => ({
        ...h,
        battery: Math.max(20, Math.min(100, robot.battery - (history.length - 1 - i) * 0.4)),
      }));
    }
    // Fallback generated series
    const points: ExtendedHistoryPoint[] = [];
    const now = Date.now();
    for (let i = 29; i >= 0; i--) {
      const t = new Date(now - i * 5000);
      const label = t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      points.push({
        time: label,
        temperature: parseFloat((sensor.temperature + Math.sin(i * 0.4) * 3 + (Math.random() * 1.5 - 0.75)).toFixed(1)),
        humidity: Math.round(sensor.humidity + Math.sin(i * 0.25) * 4 + (Math.random() * 2 - 1)),
        flame: sensor.irFlame ? 1 : 0,
        gas: Math.round(sensor.gas + Math.sin(i * 0.3) * 15 + (Math.random() * 6 - 3)),
        distance: Math.round(sensor.distance + Math.cos(i * 0.4) * 20 + (Math.random() * 4 - 2)),
        battery: Math.round(Math.max(15, robot.battery - (30 - i) * 0.1)),
      });
    }
    return points;
  });

  // Real-time live simulation stream loop
  useEffect(() => {
    if (!isLiveSim) return;

    const interval = setInterval(() => {
      setDemoData(prev => {
        if (!prev || prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        const now = new Date();
        const label = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

        const nextTemp = Math.max(18, Math.min(75, parseFloat((last.temperature + (Math.random() * 0.8 - 0.4)).toFixed(1))));
        const nextHum = Math.max(25, Math.min(95, Math.round(last.humidity + (Math.random() * 1.6 - 0.8))));
        const nextGas = Math.max(20, Math.min(500, Math.round(last.gas + (Math.random() * 6 - 3))));
        const nextDist = Math.max(15, Math.min(200, Math.round(last.distance + (Math.random() * 8 - 4))));
        const nextFlame = sensor.irFlame ? 1 : (Math.random() > 0.96 ? 1 : 0);
        const nextBat = Math.max(10, Math.min(100, Math.round(last.battery ?? robot.battery)));

        const newPoint: ExtendedHistoryPoint = {
          time: label,
          temperature: nextTemp,
          humidity: nextHum,
          gas: nextGas,
          distance: nextDist,
          flame: nextFlame,
          battery: nextBat,
        };

        const updated = [...prev.slice(1), newPoint];
        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isLiveSim, sensor.irFlame, robot.battery]);

  // Metric calculation helpers
  const currentMetric = SENSOR_METRICS.find(m => m.key === activeGraphSensor) || SENSOR_METRICS[0];
  const activeSeries = demoData.map(d => (d[activeGraphSensor as keyof ExtendedHistoryPoint] as number) || 0);

  const curVal = activeSeries.length > 0 ? activeSeries[activeSeries.length - 1] : 0;
  const maxVal = activeSeries.length > 0 ? Math.max(...activeSeries) : 0;
  const minVal = activeSeries.length > 0 ? Math.min(...activeSeries) : 0;
  const avgVal = activeSeries.length > 0 ? activeSeries.reduce((a, b) => a + b, 0) / activeSeries.length : 0;
  const trendDiff = activeSeries.length >= 2 ? curVal - activeSeries[activeSeries.length - 2] : 0;

  const sensors: SensorItem[] = [
    {
      id: 'temp',
      name: 'Temperature',
      value: sensor.temperature.toFixed(1),
      unit: '°C',
      status: sensor.temperature > 40 ? 'warning' : 'normal',
      statusText: sensor.temperature > 40 ? 'Elevated' : 'Optimal',
      icon: <Thermometer className="text-orange-500" size={20} />,
      updated: 'Just now',
      sparkline: demoData.slice(-6).map(d => d.temperature),
    },
    {
      id: 'humidity',
      name: 'Humidity',
      value: sensor.humidity.toString(),
      unit: '%',
      status: 'normal',
      statusText: 'Optimal',
      icon: <Droplets className="text-blue-500" size={20} />,
      updated: 'Just now',
      sparkline: demoData.slice(-6).map(d => d.humidity),
    },
    {
      id: 'smoke',
      name: 'Smoke Density',
      value: '12',
      unit: 'ppm',
      status: 'success',
      statusText: 'Clean Air',
      icon: <Wind className="text-slate-500" size={20} />,
      updated: 'Just now',
      sparkline: [10, 11, 12, 11, 13, 12],
    },
    {
      id: 'flame',
      name: 'Flame Sensor',
      value: sensor.irFlame ? '100' : '0',
      unit: '%',
      status: sensor.irFlame ? 'critical' : 'success',
      statusText: sensor.irFlame ? 'FIRE DETECTED' : 'No Flame',
      icon: <Flame className={sensor.irFlame ? 'text-red-600' : 'text-emerald-500'} size={20} />,
      updated: 'Just now',
      sparkline: demoData.slice(-6).map(d => d.flame * 100),
    },
    {
      id: 'gas',
      name: 'Combustible Gas',
      value: sensor.gas.toString(),
      unit: 'ppm',
      status: sensor.gas > 300 ? 'warning' : 'success',
      statusText: sensor.gas > 300 ? 'Elevated' : 'Safe Level',
      icon: <Gauge className="text-amber-500" size={20} />,
      updated: 'Just now',
      sparkline: demoData.slice(-6).map(d => d.gas),
    },
    {
      id: 'dist',
      name: 'Ultrasonic Distance',
      value: sensor.distance.toString(),
      unit: 'cm',
      status: sensor.distance < 30 ? 'warning' : 'normal',
      statusText: sensor.distance < 30 ? 'Obstacle Near' : 'Clear Path',
      icon: <Ruler className="text-cyan-600" size={20} />,
      updated: 'Just now',
      sparkline: demoData.slice(-6).map(d => d.distance),
    },
    {
      id: 'ir',
      name: 'IR Proximity Sensor',
      value: 'CLEAR',
      unit: 'state',
      status: 'success',
      statusText: 'Active Scan',
      icon: <Eye className="text-indigo-500" size={20} />,
      updated: 'Just now',
      sparkline: [1, 1, 1, 1, 1, 1],
    },
    {
      id: 'battery',
      name: 'LiFePO4 Battery',
      value: robot.battery.toString(),
      unit: '%',
      status: robot.battery < 20 ? 'warning' : 'success',
      statusText: robot.battery < 20 ? 'Low Charge' : 'Nominal (12.4V)',
      icon: <Battery className="text-emerald-600" size={20} />,
      updated: 'Just now',
      sparkline: demoData.slice(-6).map(d => d.battery ?? robot.battery),
    },
    {
      id: 'imu',
      name: 'IMU Orientation',
      value: '0.2° / 0.1°',
      unit: 'R/P',
      status: 'normal',
      statusText: 'Balanced',
      icon: <Compass className="text-purple-600" size={20} />,
      updated: 'Just now',
      sparkline: [0.1, 0.2, 0.1, 0.3, 0.2, 0.2],
    },
    {
      id: 'pos',
      name: 'Indoor Position',
      value: '24.5, 18.7',
      unit: 'X,Y m',
      status: 'normal',
      statusText: 'SLAM Tracking',
      icon: <MapPin className="text-blue-600" size={20} />,
      updated: 'Just now',
      sparkline: [12, 15, 18, 20, 22, 24.5],
    },
    {
      id: 'tank',
      name: 'Water Tank Level',
      value: '82',
      unit: '%',
      status: 'success',
      statusText: 'Full Capacity',
      icon: <Waves className="text-sky-500" size={20} />,
      updated: 'Just now',
      sparkline: [100, 95, 90, 88, 85, 82],
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-[1700px] mx-auto p-4 md:p-6">
      {/* Toast Notification for Export Actions */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 shadow-2xl border border-slate-700 dark:border-slate-200 backdrop-blur-md animate-fade-in text-xs font-bold">
          <CheckCircle2 size={16} className="text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Title & Action Controls Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Real-Time Sensor Telemetry & Demo Graphs
          </h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Live interactive telemetry visualizations, threshold detection, and ThingSpeak cloud telemetry feed
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Time Filters */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white dark:bg-[#141A26] border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 px-2 flex items-center gap-1">
              <Clock size={13} /> Time Window:
            </span>
            {(['1M', '5M', '30M', '1H'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeFilter(tf)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  timeFilter === tf
                    ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* 📥 EXPORT BUTTONS GROUP */}
          <div className="flex items-center gap-2">
            {/* EXCEL EXPORT DROPDOWN */}
            <div className="relative" ref={excelMenuRef}>
              <button
                onClick={() => {
                  setShowExcelMenu(prev => !prev);
                  setShowPdfMenu(false);
                }}
                className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black shadow-md shadow-emerald-600/25 transition-all flex items-center gap-2 cursor-pointer"
                title="Export Sensor Telemetry to Excel Spreadsheet"
              >
                <FileSpreadsheet size={15} />
                <span>Export Excel</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${showExcelMenu ? 'rotate-180' : ''}`} />
              </button>

              {showExcelMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#141A26] border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-40 animate-fade-in flex flex-col gap-1">
                  <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    Excel Export Options
                  </div>
                  <button
                    onClick={() => handleExportExcel('xls')}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
                      <FileSpreadsheet size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black">Excel Workbook (.xls)</span>
                      <span className="text-[10px] text-slate-400 font-normal">Formatted sheets with styles & KPIs</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleExportExcel('csv')}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <Download size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black">CSV Spreadsheet (.csv)</span>
                      <span className="text-[10px] text-slate-400 font-normal">UTF-8 comma-separated data file</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* PDF EXPORT DROPDOWN */}
            <div className="relative" ref={pdfMenuRef}>
              <button
                onClick={() => {
                  setShowPdfMenu(prev => !prev);
                  setShowExcelMenu(false);
                }}
                className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs font-black shadow-md shadow-rose-600/25 transition-all flex items-center gap-2 cursor-pointer"
                title="Export Sensor Telemetry Report as PDF"
              >
                <FileText size={15} />
                <span>Export PDF</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${showPdfMenu ? 'rotate-180' : ''}`} />
              </button>

              {showPdfMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#141A26] border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-40 animate-fade-in flex flex-col gap-1">
                  <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    PDF Report Options
                  </div>
                  <button
                    onClick={() => handleExportPdf('print')}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400">
                      <Printer size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black">Save / Print as PDF</span>
                      <span className="text-[10px] text-slate-400 font-normal">Printable report preview with styled tables</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleExportPdf('download')}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <Download size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black">Download PDF File (.pdf)</span>
                      <span className="text-[10px] text-slate-400 font-normal">Direct vector PDF document download</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── 📈 FEATURED DEMO SENSORS GRAPH CONTAINER (INTERACTIVE RECHARTS) ── */}
      <div className="glass-card-light p-6 flex flex-col gap-5 border-2 border-slate-200/90 shadow-xl relative overflow-hidden">
        {/* Top Control Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25">
              <LineChartIcon size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  Interactive Demo Sensor Graph & Analytics
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-cyan-400 text-[10px] font-extrabold border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${isLiveSim ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
                  {isLiveSim ? 'LIVE STREAM ACTIVE' : 'PAUSED'}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                High-frequency real-time Recharts visualization with threshold alerts
              </p>
            </div>
          </div>

          {/* Right Action Tools: Live Sim Toggle & Chart Style */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Live Stream Toggle */}
            <button
              onClick={() => setIsLiveSim(p => !p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer border ${
                isLiveSim
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {isLiveSim ? <Pause size={14} /> : <Play size={14} />}
              {isLiveSim ? 'Pause Live Stream' : 'Resume Live Stream'}
            </button>

            {/* Threshold Line Toggle */}
            <button
              onClick={() => setShowThreshold(p => !p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer border ${
                showThreshold
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <AlertCircle size={14} />
              Threshold line: {showThreshold ? 'ON' : 'OFF'}
            </button>

            {/* Chart Style Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-extrabold">
              <button
                onClick={() => setChartStyle('area')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  chartStyle === 'area'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-cyan-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
                title="Area Chart"
              >
                Area
              </button>
              <button
                onClick={() => setChartStyle('line')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  chartStyle === 'line'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-cyan-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
                title="Line Chart"
              >
                Line
              </button>
              <button
                onClick={() => setChartStyle('bar')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  chartStyle === 'bar'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-cyan-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
                title="Bar Chart"
              >
                Bar
              </button>
            </div>

            {/* Quick Export Shortcuts in Chart Bar */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-700">
              <button
                onClick={() => handleExportExcel('xls')}
                className="px-2.5 py-1.5 rounded-xl text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800 transition-all flex items-center gap-1 cursor-pointer"
                title="Quick export telemetry to Excel (.xls)"
              >
                <FileSpreadsheet size={13} />
                <span>Excel</span>
              </button>
              <button
                onClick={() => handleExportPdf('print')}
                className="px-2.5 py-1.5 rounded-xl text-xs font-black text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-300 dark:border-rose-800 transition-all flex items-center gap-1 cursor-pointer"
                title="Quick export / print report as PDF"
              >
                <FileText size={13} />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sensor Metric Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SENSOR_METRICS.map(m => {
            const isActive = activeGraphSensor === m.key;
            return (
              <button
                key={m.key}
                onClick={() => setActiveGraphSensor(m.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap border ${
                  isActive
                    ? 'bg-slate-900 dark:bg-emerald-600 text-white border-slate-800 dark:border-emerald-500 shadow-md'
                    : 'bg-white dark:bg-[#182132] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-[#222E46]'
                }`}
              >
                <span style={{ color: isActive ? '#34D399' : m.color }}>{m.icon}</span>
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Quick Analytics Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-2xl bg-slate-50/90 dark:bg-[#182132] border border-slate-200/80 dark:border-[#222E46]">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider">Current Readout</span>
            <span className="text-xl font-black text-slate-900 dark:text-white mt-0.5 font-mono">
              {curVal.toFixed(1)}{currentMetric.unit}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider">10-Min Peak (Max)</span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">
              {maxVal.toFixed(1)}{currentMetric.unit}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider">Minimum (Min)</span>
            <span className="text-xl font-black text-sky-600 dark:text-sky-400 mt-0.5 font-mono">
              {minVal.toFixed(1)}{currentMetric.unit}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider">Average Level</span>
            <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5 font-mono">
              {avgVal.toFixed(1)}{currentMetric.unit}
            </span>
          </div>

          <div className="flex flex-col col-span-2 sm:col-span-1">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider">Recent Velocity</span>
            <div className="flex items-center gap-1 mt-0.5">
              <TrendingUp size={16} className={trendDiff >= 0 ? 'text-amber-500' : 'text-blue-500 rotate-180'} />
              <span className={`text-sm font-black font-mono ${trendDiff >= 0 ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'}`}>
                {trendDiff >= 0 ? `+${trendDiff.toFixed(1)}` : trendDiff.toFixed(1)} / step
              </span>
            </div>
          </div>
        </div>

        {/* ── Main Recharts Visualization Canvas ── */}
        <div className="h-[340px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {activeGraphSensor === 'all' ? (
              // Multi-sensor Overlay Chart
              <LineChart data={demoData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="time" tick={{ fill: '#64748B', fontSize: 10, fontWeight: 700 }} />
                <YAxis tick={{ fill: '#64748B', fontSize: 10, fontWeight: 700 }} />
                <Tooltip content={<DemoChartTooltip unit="" />} />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingTop: '10px' }} />
                <Line type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#F97316" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="humidity" name="Humidity (%)" stroke="#0284C7" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="gas" name="Gas (ppm)" stroke="#EAB308" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="distance" name="Distance (cm)" stroke="#10B981" strokeWidth={2} dot={false} />
              </LineChart>
            ) : chartStyle === 'area' ? (
              <AreaChart data={demoData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id={`grad-${activeGraphSensor}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="time" tick={{ fill: '#64748B', fontSize: 10, fontWeight: 700 }} />
                <YAxis
                  domain={currentMetric.domain}
                  tick={{ fill: '#64748B', fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip content={<DemoChartTooltip unit={currentMetric.unit} />} />
                {showThreshold && currentMetric.threshold !== undefined && (
                  <ReferenceLine
                    y={currentMetric.threshold}
                    stroke="#EF4444"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    label={{
                      value: currentMetric.thresholdLabel,
                      fill: '#DC2626',
                      fontSize: 10,
                      fontWeight: 800,
                      position: 'top',
                    }}
                  />
                )}
                <Area
                  type="monotone"
                  dataKey={activeGraphSensor}
                  name={currentMetric.label}
                  stroke={currentMetric.color}
                  strokeWidth={3}
                  fill={`url(#grad-${activeGraphSensor})`}
                  activeDot={{ r: 6, fill: currentMetric.color, stroke: '#FFFFFF', strokeWidth: 3 }}
                  isAnimationActive={false}
                />
              </AreaChart>
            ) : chartStyle === 'line' ? (
              <LineChart data={demoData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="time" tick={{ fill: '#64748B', fontSize: 10, fontWeight: 700 }} />
                <YAxis domain={currentMetric.domain} tick={{ fill: '#64748B', fontSize: 10, fontWeight: 700 }} />
                <Tooltip content={<DemoChartTooltip unit={currentMetric.unit} />} />
                {showThreshold && currentMetric.threshold !== undefined && (
                  <ReferenceLine
                    y={currentMetric.threshold}
                    stroke="#EF4444"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    label={{
                      value: currentMetric.thresholdLabel,
                      fill: '#DC2626',
                      fontSize: 10,
                      fontWeight: 800,
                      position: 'top',
                    }}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey={activeGraphSensor}
                  name={currentMetric.label}
                  stroke={currentMetric.color}
                  strokeWidth={3}
                  dot={{ r: 3, fill: currentMetric.color }}
                  activeDot={{ r: 6, fill: currentMetric.color, stroke: '#FFFFFF', strokeWidth: 3 }}
                  isAnimationActive={false}
                />
              </LineChart>
            ) : (
              <BarChart data={demoData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="time" tick={{ fill: '#64748B', fontSize: 10, fontWeight: 700 }} />
                <YAxis domain={currentMetric.domain} tick={{ fill: '#64748B', fontSize: 10, fontWeight: 700 }} />
                <Tooltip content={<DemoChartTooltip unit={currentMetric.unit} />} />
                {showThreshold && currentMetric.threshold !== undefined && (
                  <ReferenceLine
                    y={currentMetric.threshold}
                    stroke="#EF4444"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                  />
                )}
                <Bar
                  dataKey={activeGraphSensor}
                  name={currentMetric.label}
                  fill={currentMetric.color}
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── 📊 DEDICATED THINGSPEAK LIVE CHARTS CONTAINER ── */}
      <div className="glass-card-light p-6 flex flex-col gap-4 border border-emerald-500/20 dark:border-emerald-500/25 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20">
              <LineChartIcon size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  ThingSpeak IoT Cloud Live Chart Feed
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  CHANNEL #{channelId} • LIVE SYNC
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time cloud analytics iframe feed & field data graphs
              </p>
            </div>
          </div>

          {/* Field Selection Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-[#141A26] border border-slate-200 dark:border-slate-800 text-xs font-bold overflow-x-auto">
            {[
              { id: 'grid', label: 'All Charts Grid' },
              { id: 'field1', label: 'Field 1 (Temp)' },
              { id: 'field2', label: 'Field 2 (Humidity)' },
              { id: 'field3', label: 'Field 3 (Gas)' },
              { id: 'field4', label: 'Field 4 (Distance)' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveChartTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeChartTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Embed Display Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(activeChartTab === 'grid' || activeChartTab === 'field1') && (
            <ThingSpeakChartCard
              fieldNum={1}
              title="Field 1 — Temperature Stream (°C)"
              channelId={channelId}
              color="#2563EB"
              data={[24, 25, 26, 27, 28, sensor.temperature]}
            />
          )}

          {(activeChartTab === 'grid' || activeChartTab === 'field2') && (
            <ThingSpeakChartCard
              fieldNum={2}
              title="Field 2 — Relative Humidity (%)"
              channelId={channelId}
              color="#0284C7"
              data={[60, 62, 65, 64, 63, sensor.humidity]}
            />
          )}

          {(activeChartTab === 'grid' || activeChartTab === 'field3') && (
            <ThingSpeakChartCard
              fieldNum={3}
              title="Field 3 — MQ-2 Combustible Gas (ppm)"
              channelId={channelId}
              color="#F59E0B"
              data={[40, 42, 45, 48, 50, sensor.gas]}
            />
          )}

          {(activeChartTab === 'grid' || activeChartTab === 'field4') && (
            <ThingSpeakChartCard
              fieldNum={4}
              title="Field 4 — Ultrasonic Distance (cm)"
              channelId={channelId}
              color="#059669"
              data={[120, 100, 85, 70, 55, sensor.distance]}
            />
          )}
        </div>
      </div>

      {/* ── 11 SENSOR METRIC CARDS GRID ── */}
      <div>
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-3">
          Onboard Sensor Telemetry Array (11 Sensors)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sensors.map(s => (
            <div
              key={s.id}
              className="glass-card-light p-5 flex flex-col justify-between hover:shadow-xl transition-all duration-300 border border-slate-200/80 dark:border-[#1F293D]"
            >
              {/* Top Bar: Icon + Name + Status Badge */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100/90 dark:bg-[#182132] border border-slate-200 dark:border-slate-800">
                    {s.icon}
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                      {s.name}
                    </h3>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-400">
                      Updated {s.updated}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                    s.status === 'critical'
                      ? 'bg-red-100 text-red-700 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800 animate-pulse'
                      : s.status === 'warning'
                      ? 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                      : 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                  }`}
                >
                  {s.statusText}
                </span>
              </div>

              {/* Value & Sparkline */}
              <div className="flex items-end justify-between gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {s.value}
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1">
                    {s.unit}
                  </span>
                </div>

                {/* Sparkline SVG Chart */}
                <div className="w-24 h-9">
                  <svg className="w-full h-full" viewBox="0 0 100 35">
                    <path
                      d={generateSvgPath(s.sparkline)}
                      fill="none"
                      stroke={
                        s.status === 'critical'
                          ? '#DC2626'
                          : s.status === 'warning'
                          ? '#F59E0B'
                          : '#2563EB'
                      }
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DemoChartTooltip({ active, payload, label, unit }: any) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-2xl text-white text-xs min-w-[170px]">
      <div className="text-[11px] font-mono text-slate-400 mb-1.5 pb-1 border-b border-slate-800 flex items-center justify-between gap-3">
        <span>Time: {label}</span>
        <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-black tracking-wide">
          LIVE TELEMETRY
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="font-semibold text-slate-200">{entry.name}:</span>
            </div>
            <span className="font-mono font-bold text-white">
              {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
              {unit || ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThingSpeakChartCard({
  fieldNum,
  title,
  channelId,
  color,
  data,
}: {
  fieldNum: number;
  title: string;
  channelId: string;
  color: string;
  data: number[];
}) {
  const iframeUrl = `https://thingspeak.com/channels/${channelId}/charts/${fieldNum}?bgcolor=%23ffffff&color=%232563eb&dynamic=true&type=line&width=450&height=220`;

  return (
    <div className="rounded-2xl bg-white dark:bg-[#121824] border border-slate-200 dark:border-[#1F293D] p-4 shadow-sm flex flex-col justify-between min-h-[260px]">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wide flex items-center gap-1.5">
          <Zap size={14} style={{ color }} />
          {title}
        </h4>
        <a
          href={`https://thingspeak.com/channels/${channelId}`}
          target="_blank"
          rel="noreferrer"
          className="text-[11px] font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
        >
          Open ThingSpeak <ExternalLink size={12} />
        </a>
      </div>

      {/* Live Chart Canvas Display */}
      <div className="flex-1 rounded-xl bg-slate-50 dark:bg-[#182132] border border-slate-200/90 dark:border-slate-800 p-3 relative overflow-hidden flex flex-col justify-between">
        <iframe
          src={iframeUrl}
          className="w-full h-[200px] border-none rounded-lg"
          title={title}
          loading="lazy"
        />

        {/* Fallback Live SVG Wave Graphic */}
        <div className="absolute inset-0 bg-white/90 dark:bg-[#182132]/95 backdrop-blur-xs flex flex-col justify-between p-4 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-300">
            ThingSpeak Live Field #{fieldNum} Data Wave:
          </span>
          <svg className="w-full h-24" viewBox="0 0 100 40">
            <path
              d={generateSvgPath(data)}
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function generateSvgPath(data: number[]): string {
  if (!data || data.length === 0) return 'M 0 20 L 100 20';
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;

  return data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * 90 + 5;
      const y = 35 - ((val - min) / range) * 26;
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}
