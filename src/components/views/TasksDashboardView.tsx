import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Compass,
  ChevronLeft,
  ChevronRight,
  Menu,
  Clock,
  CheckCircle2,
  Circle,
  Users,
  Activity,
  Bot,
  Battery,
  Flame,
  Droplets,
  ExternalLink,
  Sliders,
  ChevronDown,
  X,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Radio,
  Zap,
  Calendar as CalendarIcon,
} from 'lucide-react';
import IsometricServerGraphic from '../IsometricServerGraphic';
import { NORMAL_STATE, EMERGENCY_STATE } from '../../data/mockData';

// Real team member photos from assets
import abhishekImg from '../../assets/abhishek-anand.jpg';
import dakshImg from '../../assets/daksh-srivastava.jpg';
import gunjanImg from '../../assets/gunjan-jangir.jpg';

interface TasksDashboardViewProps {
  state: typeof NORMAL_STATE;
  emergency: boolean;
  pumpActive: boolean;
  onTogglePump: () => void;
  onNavigateTab: (tab: any) => void;
  onOpenTeamModal?: () => void;
}

interface TaskItem {
  id: string;
  title: string;
  time: string;
  date: string;
  completed: boolean;
  tag: string;
  tagColor: string;
  accentBarColor: string;
}

export default function TasksDashboardView({
  state,
  emergency,
  pumpActive,
  onTogglePump,
  onNavigateTab,
  onOpenTeamModal,
}: TasksDashboardViewProps) {
  // Real-time ticking clock (ticks every second)
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Real-time calendar navigation & active day selection
  const [viewDate, setViewDate] = useState<Date>(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  function handlePrevMonth() {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }

  function handleNextMonth() {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }

  function handleGoToToday() {
    const now = new Date();
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(now);
  }

  const isCurrentMonthView =
    viewDate.getFullYear() === currentTime.getFullYear() &&
    viewDate.getMonth() === currentTime.getMonth();

  // Helper to format real-time relative date strings
  const getRelativeDateStr = (offsetDays: number = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Timeframe selector for Productivity Metrics
  const [timeframe, setTimeframe] = useState<'Monthly' | 'Weekly' | 'Yearly'>('Monthly');
  const [showTimeframeDropdown, setShowTimeframeDropdown] = useState(false);

  // Safety & FireBot mission tasks with distinct multi-color badges and real-time relative dates
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 't1',
      title: 'Inspect Lab 201 Flame Sensor',
      time: '9:00 AM',
      date: getRelativeDateStr(0),
      completed: false,
      tag: 'FLAME IR',
      tagColor: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
      accentBarColor: 'bg-gradient-to-b from-amber-500 to-orange-600',
    },
    {
      id: 't2',
      title: 'Calibrate MQ-2 Combustible Gas Sensor',
      time: '12:00 PM',
      date: getRelativeDateStr(1),
      completed: false,
      tag: 'GAS DETECT',
      tagColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
      accentBarColor: 'bg-gradient-to-b from-emerald-500 to-teal-600',
    },
    {
      id: 't3',
      title: 'Water Cannon Submersible Pump Test',
      time: '8:00 AM',
      date: getRelativeDateStr(2),
      completed: false,
      tag: 'SUPPRESSION',
      tagColor: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
      accentBarColor: 'bg-gradient-to-b from-cyan-400 to-blue-600',
    },
    {
      id: 't4',
      title: 'ThingSpeak Cloud Telemetry Handshake',
      time: '11:00 AM',
      date: getRelativeDateStr(3),
      completed: false,
      tag: 'IOT CLOUD',
      tagColor: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
      accentBarColor: 'bg-gradient-to-b from-purple-500 to-indigo-600',
    },
  ]);

  // Modal for creating a new task (prefilled with current selected date)
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('10:00 AM');
  const [newTaskDate, setNewTaskDate] = useState(() => getRelativeDateStr(0));

  // Weekday header labels
  const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Dynamic real-time calendar grid computation
  const calendarGrid = useMemo(() => {
    const viewYear = viewDate.getFullYear();
    const viewMonth = viewDate.getMonth();

    // Day of week for 1st of viewed month (0 = Sun, 1 = Mon ... 6 = Sat)
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
    const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPreviousMonth = new Date(viewYear, viewMonth, 0).getDate();

    const todayYear = currentTime.getFullYear();
    const todayMonth = currentTime.getMonth();
    const todayDate = currentTime.getDate();

    const selYear = selectedDate.getFullYear();
    const selMonth = selectedDate.getMonth();
    const selDate = selectedDate.getDate();

    interface CalendarCell {
      date: Date;
      dayNumber: number;
      isOtherMonth: boolean;
      isToday: boolean;
      isSelected: boolean;
      eventDot?: string;
    }

    const cells: CalendarCell[] = [];

    // 1. Trailing days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = daysInPreviousMonth - i;
      const cellDate = new Date(viewYear, viewMonth - 1, d);
      cells.push({
        date: cellDate,
        dayNumber: d,
        isOtherMonth: true,
        isToday:
          d === todayDate &&
          viewMonth - 1 === todayMonth &&
          viewYear === todayYear,
        isSelected:
          d === selDate &&
          viewMonth - 1 === selMonth &&
          viewYear === selYear,
      });
    }

    // 2. Days of current month
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const cellDate = new Date(viewYear, viewMonth, d);
      const isToday =
        d === todayDate &&
        viewMonth === todayMonth &&
        viewYear === todayYear;
      const isSelected =
        d === selDate &&
        viewMonth === selMonth &&
        viewYear === selYear;

      // Event dots: today gets a vibrant cyan pulse dot, plus periodic patrol/audit events
      let eventDot: string | undefined = undefined;
      if (isToday) {
        eventDot = 'bg-cyan-400';
      } else if (d % 6 === 0) {
        eventDot = 'bg-amber-400';
      } else if (d % 8 === 0) {
        eventDot = 'bg-purple-400';
      } else if (d % 5 === 0) {
        eventDot = 'bg-emerald-400';
      }

      cells.push({
        date: cellDate,
        dayNumber: d,
        isOtherMonth: false,
        isToday,
        isSelected,
        eventDot,
      });
    }

    // 3. Leading days of next month (complete 35 or 42 grid cells)
    const targetLength = Math.ceil(cells.length / 7) * 7;
    const overflow = targetLength - cells.length;
    for (let n = 1; n <= overflow; n++) {
      const cellDate = new Date(viewYear, viewMonth + 1, n);
      cells.push({
        date: cellDate,
        dayNumber: n,
        isOtherMonth: true,
        isToday:
          n === todayDate &&
          viewMonth + 1 === todayMonth &&
          viewYear === todayYear,
        isSelected:
          n === selDate &&
          viewMonth + 1 === selMonth &&
          viewYear === selYear,
      });
    }

    return cells;
  }, [viewDate, selectedDate, currentTime]);

  function toggleTask(id: string) {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: TaskItem = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      time: newTaskTime,
      date: newTaskDate,
      completed: false,
      tag: 'ROBOT OP',
      tagColor: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30',
      accentBarColor: 'bg-gradient-to-b from-blue-500 to-indigo-600',
    };
    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
    setIsNewTaskModalOpen(false);
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto p-4 md:p-8 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* ── ROW 1: Welcome Banner Card (Left) + Calendar Widget (Right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Welcome Banner Card: Premium Light Frosted Alabaster & Champagne Sage Theme */}
        <div className="lg:col-span-8 rounded-3xl bg-gradient-to-br from-[#FFFFFF] via-[#FAF9F5] to-[#F1F6F3] dark:from-[#131A24] dark:via-[#161F2C] dark:to-[#142322] p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between shadow-xl shadow-slate-200/50 dark:shadow-black/40 border border-amber-200/80 dark:border-emerald-500/25 transition-all">
          {/* Ambient Warm Golden & Emerald Orbs */}
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-amber-400/15 dark:bg-amber-400/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 right-1/4 w-72 h-72 rounded-full bg-emerald-400/15 dark:bg-emerald-400/10 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 right-12 w-48 h-48 rounded-full bg-purple-400/10 dark:bg-purple-400/10 blur-2xl pointer-events-none" />

          {/* Cyber Subtle Grid Lines */}
          <div
            className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(100,116,139,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(100,116,139,0.12) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="max-w-md">
              {/* Status Pill Badge with Real-Time Date */}
              <div className="flex items-center gap-2 flex-wrap mb-3.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-[11px] font-black text-emerald-800 dark:text-emerald-300 tracking-wider uppercase shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>SENTINEL X-1 • AUTONOMOUS FLEET ACTIVE</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-[11px] font-bold text-amber-800 dark:text-amber-300 shadow-xs">
                  <Clock size={11} className="text-amber-600 dark:text-amber-400" />
                  <span>
                    {currentTime.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
                Welcome Back, Operator!
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2 font-medium leading-relaxed">
                Autonomous indoor fire patrol & multi-sensor hazard detection operational.
              </p>

              {/* Action Buttons with Premium Styling */}
              <div className="flex items-center gap-3.5 mt-6 sm:mt-8 flex-wrap">
                <button
                  onClick={() => setIsNewTaskModalOpen(true)}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-black flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/25 cursor-pointer active:scale-95 group"
                >
                  <span>new task</span>
                  <Plus size={16} className="stroke-[3] group-hover:rotate-90 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigateTab('map')}
                  className="px-6 py-2.5 rounded-full bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 text-slate-800 dark:text-white border border-slate-300 dark:border-white/20 text-xs sm:text-sm font-bold transition-all cursor-pointer backdrop-blur-md active:scale-95 flex items-center gap-2 shadow-xs"
                >
                  <Compass size={16} className="text-teal-600 dark:text-teal-400" />
                  <span>Explore Map</span>
                </button>
              </div>
            </div>

            {/* 3D Isometric Server Illustration */}
            <div className="self-center sm:self-auto sm:-mr-4 -mb-4 sm:-mb-6 filter drop-shadow-[0_16px_32px_rgba(16,185,129,0.2)]">
              <IsometricServerGraphic variant="banner" />
            </div>
          </div>
        </div>

        {/* Real-Time Calendar Widget Card */}
        <div className="lg:col-span-4 rounded-3xl bg-white dark:bg-[#121824] border border-slate-200/90 dark:border-[#1F293D] p-5 sm:p-6 shadow-xl shadow-black/5 dark:shadow-black/40 flex flex-col justify-between relative overflow-hidden group">
          {/* Subtle colorful ambient gradient */}
          <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-emerald-500/10 dark:bg-teal-500/10 blur-2xl pointer-events-none" />

          <div>
            {/* Real-Time Live Clock Badge Row */}
            <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CalendarIcon size={14} />
                </div>
                <span className="text-xs font-black tracking-wider uppercase text-slate-800 dark:text-slate-200">
                  Real-Time Calendar
                </span>
              </div>

              {/* Live Pulsing Digital Clock */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-mono text-[11px] font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  {currentTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              </div>
            </div>

            {/* Calendar Month & Navigation Header */}
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-slate-900 dark:text-white">
                  {viewDate.toLocaleDateString('en-US', { month: 'long' })}
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-black border border-emerald-200/60 dark:border-emerald-800/60">
                  {viewDate.getFullYear()}
                </span>
                {!isCurrentMonthView && (
                  <button
                    onClick={handleGoToToday}
                    className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition cursor-pointer"
                    title="Jump to today"
                  >
                    Today
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                  aria-label="Previous month"
                  title="Previous month"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleGoToToday}
                  className={`px-2 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-bold transition cursor-pointer ${
                    isCurrentMonthView ? 'text-emerald-600 dark:text-emerald-400 font-black' : 'text-slate-400'
                  }`}
                  title="Jump to Current Date"
                >
                  Today
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                  aria-label="Next month"
                  title="Next month"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Weekday Column Headers */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
              {WEEKDAYS.map(day => (
                <div
                  key={day}
                  className="text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider py-0.5"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-y-1.5 gap-x-1 text-center text-xs">
              {calendarGrid.map((item, idx) => {
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedDate(item.date);
                      if (item.isOtherMonth) {
                        setViewDate(new Date(item.date.getFullYear(), item.date.getMonth(), 1));
                      }
                      setNewTaskDate(
                        item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      );
                    }}
                    title={item.date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                    className={`relative h-8 w-8 mx-auto rounded-full flex flex-col items-center justify-center font-semibold transition-all cursor-pointer ${
                      item.isSelected
                        ? 'bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 text-white font-black shadow-lg shadow-emerald-500/40 scale-110 ring-2 ring-emerald-400/50 z-10'
                        : item.isToday
                        ? 'border-2 border-emerald-500 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 dark:bg-emerald-950/40 font-black'
                        : item.isOtherMonth
                        ? 'text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-white/5'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 font-bold'
                    }`}
                  >
                    <span>{item.dayNumber}</span>
                    {/* Multi-colored event dot */}
                    {item.eventDot && !item.isSelected && (
                      <span className={`w-1 h-1 rounded-full ${item.eventDot} -mt-0.5`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Schedule Footer */}
          <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/80 mt-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <Clock size={12} className="text-emerald-500 dark:text-emerald-400" />
              <span className="font-medium text-[11px]">Selected:</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-200/80 dark:border-emerald-800/80 text-[11px]">
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <button
                onClick={() => {
                  setNewTaskDate(
                    selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  );
                  setIsNewTaskModalOpen(true);
                }}
                className="p-1 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300 transition cursor-pointer"
                title="Add task on selected date"
              >
                <Plus size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 2: Two Progress Cards (Clean Indigo & Emerald Themes) + Upcoming Tasks ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column (Span 8): Two Clean Metric Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Card 1: Active Patrol Zones (Simple Indigo Palette) */}
          <div className="rounded-3xl bg-white dark:bg-[#121824] border border-slate-200/80 dark:border-[#1F293D] p-6 shadow-xl shadow-black/5 dark:shadow-black/30 flex flex-col justify-between relative overflow-hidden group hover:border-indigo-400/80 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                    6
                  </span>
                  <span className="text-base font-bold text-indigo-400">
                    /12
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[10px] font-black tracking-wide uppercase mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                  SECTORS ACTIVE
                </span>
              </div>

              <button
                onClick={() => onNavigateTab('map')}
                className="p-2 rounded-xl text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition cursor-pointer"
                title="View Patrol Map"
              >
                <Menu size={20} />
              </button>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="max-w-[130px]">
                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 leading-snug block">
                  Active patrol zones
                </span>
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 mt-1">
                  <TrendingUp size={12} />
                  <span>+2 zones covered</span>
                </span>
              </div>

              {/* Circular Donut Gauge (Simple Indigo 60%) */}
              <div className="relative w-22 h-22 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Track */}
                  <path
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="3.6"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Clean Indigo Progress (60%) */}
                  <path
                    stroke="#6366F1"
                    strokeDasharray="60, 100"
                    strokeWidth="3.6"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-sm font-black text-indigo-600 dark:text-indigo-300">
                    60%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Completed Inspections (Simple Emerald Palette) */}
          <div className="rounded-3xl bg-white dark:bg-[#121824] border border-slate-200/80 dark:border-[#1F293D] p-6 shadow-xl shadow-black/5 dark:shadow-black/30 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-400/80 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                    15
                  </span>
                  <span className="text-base font-bold text-emerald-400">
                    /26
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-black tracking-wide uppercase mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  HEALTH NOMINAL
                </span>
              </div>

              <button
                onClick={() => onNavigateTab('sensors')}
                className="p-2 rounded-xl text-emerald-500 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition cursor-pointer"
                title="View Sensor Telemetry"
              >
                <Menu size={20} />
              </button>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="max-w-[130px]">
                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 leading-snug block">
                  Completed checks
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                  <ShieldCheck size={12} />
                  <span>0 fire hazards</span>
                </span>
              </div>

              {/* Circular Donut Gauge (Simple Emerald 90%) */}
              <div className="relative w-22 h-22 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Track */}
                  <path
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="3.6"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Clean Emerald Progress (90%) */}
                  <path
                    stroke="#10B981"
                    strokeDasharray="90, 100"
                    strokeWidth="3.6"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-300">
                    90%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Span 4): Upcoming Tasks with Multi-Color Category Badges */}
        <div className="lg:col-span-4 rounded-3xl bg-white dark:bg-[#121824] border border-slate-200/90 dark:border-[#1F293D] p-6 shadow-xl shadow-black/5 dark:shadow-black/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  Upcoming Tasks
                </h2>
                <p className="text-[11px] text-slate-400 font-medium">Robot missions</p>
              </div>
              <button
                onClick={() => setIsNewTaskModalOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 flex items-center gap-1 cursor-pointer transition border border-emerald-200/60 dark:border-emerald-800/60"
              >
                <Plus size={14} />
                <span>Add</span>
              </button>
            </div>

            {/* Task rows */}
            <div className="flex flex-col gap-2.5">
              {tasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3 rounded-2xl bg-slate-50/90 dark:bg-[#182132] border border-slate-200/70 dark:border-[#222E46] flex items-center gap-3 transition-all cursor-pointer relative overflow-hidden group hover:border-emerald-400/80 hover:shadow-md ${
                    task.completed ? 'opacity-50' : ''
                  }`}
                >
                  {/* Left accent indicator bar */}
                  <span className={`absolute left-0 top-0 bottom-0 w-1.5 ${task.accentBarColor}`} />

                  <div className="text-slate-400 group-hover:text-emerald-600 transition-colors flex-shrink-0 pl-1">
                    {task.completed ? (
                      <CheckCircle2 size={17} className="text-emerald-500" />
                    ) : (
                      <Circle size={17} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`text-xs font-bold text-slate-800 dark:text-slate-100 truncate ${
                          task.completed ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {task.title}
                      </p>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase border flex-shrink-0 ${task.tagColor}`}
                      >
                        {task.tag}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-400 mt-1">
                      <Clock size={11} />
                      <span>
                        {task.date}, {task.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 3: Multi-Color Productivity Metrics Chart + Team Card ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left (Span 8): Productivity Metrics Area Line Chart */}
        <div className="lg:col-span-8 rounded-3xl bg-white dark:bg-[#121824] border border-slate-200/80 dark:border-[#1F293D] p-6 shadow-xl shadow-black/5 dark:shadow-black/40 flex flex-col justify-between">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  Productivity Metrics
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-[10px] font-black uppercase tracking-wider">
                  LIVE TELEMETRY
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                Autonomous robot patrols, hazard scans & temperature monitoring
              </p>
            </div>

            {/* Right: Clean Simple Legend + Timeframe selector */}
            <div className="flex items-center gap-4 flex-wrap">
              {/* Legend */}
              <div className="hidden sm:flex items-center gap-3 text-xs font-bold">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shadow-xs" />
                  <span>Patrol Missions</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <span className="w-3 h-0.5 bg-emerald-500 rounded-full" />
                  <span>Completed Checks</span>
                </div>
              </div>

              {/* Dropdown selector */}
              <div className="relative">
                <button
                  onClick={() => setShowTimeframeDropdown(!showTimeframeDropdown)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-white/5 cursor-pointer transition shadow-xs"
                >
                  <span>{timeframe}</span>
                  <ChevronDown size={14} />
                </button>

                {showTimeframeDropdown && (
                  <div className="absolute right-0 mt-1 w-32 rounded-2xl bg-white dark:bg-[#1A2336] border border-slate-200 dark:border-slate-700 shadow-2xl py-1.5 z-20 text-xs animate-fade-in">
                    {(['Monthly', 'Weekly', 'Yearly'] as const).map(tf => (
                      <button
                        key={tf}
                        onClick={() => {
                          setTimeframe(tf);
                          setShowTimeframeDropdown(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-white/10 ${
                          timeframe === tf ? 'font-black text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SVG Smooth Curve Area Chart with Simple Cohesive Colors & Embedded X-Axis */}
          <div className="relative w-full h-[240px] flex items-center justify-center">
            <svg
              viewBox="0 0 720 230"
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              {/* Gradients */}
              <defs>
                <linearGradient id="cleanIndigoAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity="0.22" />
                  <stop offset="70%" stopColor="#6366F1" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal dashed grid lines & Y labels */}
              {[
                { y: 25, label: '100' },
                { y: 60, label: '60' },
                { y: 95, label: '40' },
                { y: 130, label: '20' },
                { y: 165, label: '10' },
                { y: 195, label: '1' },
              ].map((grid, idx) => (
                <g key={idx}>
                  <line
                    x1="45"
                    y1={grid.y}
                    x2="705"
                    y2={grid.y}
                    stroke="currentColor"
                    className="text-slate-200/90 dark:text-slate-800/80"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x="18"
                    y={grid.y + 4}
                    fontSize="10"
                    fill="currentColor"
                    className="text-slate-400 dark:text-slate-500 font-mono font-bold"
                    textAnchor="start"
                  >
                    {grid.label}
                  </text>
                </g>
              ))}

              {/* ── TIME-FRAME DYNAMIC PATHS ── */}
              {timeframe === 'Monthly' && (
                <>
                  {/* Secondary dashed line: Completed Checks baseline (Emerald) */}
                  <path
                    d="M 60 185 C 130 183, 180 176, 231 172 C 300 166, 380 150, 460 138 C 530 128, 600 160, 688 175"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="1.8"
                    strokeDasharray="5 4"
                    opacity="0.65"
                    strokeLinecap="round"
                  />

                  {/* Primary Indigo Area Fill */}
                  <path
                    d="M 60 195 L 60 172 C 80 168, 98 164, 117 162 C 136 160, 155 156, 174 154 C 193 152, 212 160, 231 158 C 250 156, 269 148, 288 142 C 307 136, 326 128, 345 122 C 365 116, 384 102, 402 92 C 422 80, 440 50, 460 50 C 480 50, 498 82, 517 95 C 536 108, 555 124, 574 132 C 593 140, 612 150, 631 155 C 650 160, 669 164, 688 166 L 688 195 Z"
                    fill="url(#cleanIndigoAreaGrad)"
                  />

                  {/* Primary Continuous Smooth Bézier Curve */}
                  <path
                    d="M 60 172 C 80 168, 98 164, 117 162 C 136 160, 155 156, 174 154 C 193 152, 212 160, 231 158 C 250 156, 269 148, 288 142 C 307 136, 326 128, 345 122 C 365 116, 384 102, 402 92 C 422 80, 440 50, 460 50 C 480 50, 498 82, 517 95 C 536 108, 555 124, 574 132 C 593 140, 612 150, 631 155 C 650 160, 669 164, 688 166"
                    fill="none"
                    stroke="#6366F1"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Highlight Tooltip Pin on Peak (August = 460, 50) */}
                  <g id="tooltipAugust">
                    <line
                      x1="460"
                      y1="50"
                      x2="460"
                      y2="195"
                      stroke="#6366F1"
                      strokeWidth="1.8"
                      strokeDasharray="4 3"
                      opacity="0.75"
                    />
                    <circle
                      cx="460"
                      cy="50"
                      r="9"
                      fill="#6366F1"
                      fillOpacity="0.25"
                      className="animate-ping"
                    />
                    <circle
                      cx="460"
                      cy="50"
                      r="5.5"
                      fill="#6366F1"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      className="filter drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                    />
                    <g transform="translate(412, 14)">
                      <rect
                        width="96"
                        height="26"
                        rx="8"
                        fill="#1E1B4B"
                        className="dark:fill-[#1E1B4B]"
                        stroke="#6366F1"
                        strokeWidth="1.5"
                        filter="drop-shadow(0 4px 10px rgba(99,102,241,0.3))"
                      />
                      <text
                        x="48"
                        y="17"
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="800"
                        fill="#FFFFFF"
                      >
                        75 patrols
                      </text>
                    </g>
                  </g>

                  {/* Embedded X-Axis Month Labels directly inside SVG */}
                  {[
                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                  ].map((m, idx) => {
                    const x = 60 + idx * 57.1;
                    const isPeak = m === 'Aug';
                    return (
                      <text
                        key={m}
                        x={x}
                        y="215"
                        fontSize={isPeak ? "11" : "10"}
                        fontWeight={isPeak ? "900" : "600"}
                        fill="currentColor"
                        className={isPeak ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"}
                        textAnchor="middle"
                      >
                        {m}
                      </text>
                    );
                  })}
                </>
              )}

              {timeframe === 'Weekly' && (
                <>
                  {/* Secondary dashed line (Emerald) */}
                  <path
                    d="M 60 182 C 200 175, 420 142, 688 176"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="1.8"
                    strokeDasharray="5 4"
                    opacity="0.65"
                  />

                  {/* Primary Weekly Area */}
                  <path
                    d="M 60 195 L 60 168 C 120 160, 180 150, 240 138 C 300 125, 360 85, 478 52 C 540 85, 600 135, 640 152 C 660 160, 675 165, 688 168 L 688 195 Z"
                    fill="url(#cleanIndigoAreaGrad)"
                  />

                  {/* Primary Weekly Curve */}
                  <path
                    d="M 60 168 C 120 160, 180 150, 240 138 C 300 125, 360 85, 478 52 C 540 85, 600 135, 640 152 C 660 160, 675 165, 688 168"
                    fill="none"
                    stroke="#6366F1"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />

                  {/* Weekly Peak Pin on Friday */}
                  <g id="tooltipFriday">
                    <line x1="478" y1="52" x2="478" y2="195" stroke="#6366F1" strokeWidth="1.8" strokeDasharray="4 3" opacity="0.75" />
                    <circle cx="478" cy="52" r="5.5" fill="#6366F1" stroke="#FFFFFF" strokeWidth="2.5" />
                    <g transform="translate(430, 16)">
                      <rect width="96" height="26" rx="8" fill="#1E1B4B" stroke="#6366F1" strokeWidth="1.5" />
                      <text x="48" y="17" textAnchor="middle" fontSize="11" fontWeight="800" fill="#FFFFFF">42 patrols</text>
                    </g>
                  </g>

                  {/* Weekly Days X Axis */}
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                    const x = 60 + idx * 104.6;
                    const isPeak = day === 'Fri';
                    return (
                      <text
                        key={day}
                        x={x}
                        y="215"
                        fontSize={isPeak ? "11" : "10"}
                        fontWeight={isPeak ? "900" : "600"}
                        fill="currentColor"
                        className={isPeak ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"}
                        textAnchor="middle"
                      >
                        {day}
                      </text>
                    );
                  })}
                </>
              )}

              {timeframe === 'Yearly' && (
                <>
                  {/* Secondary dashed line (Emerald) */}
                  <path
                    d="M 60 188 C 240 180, 480 150, 688 165"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="1.8"
                    strokeDasharray="5 4"
                    opacity="0.65"
                  />

                  {/* Primary Yearly Area */}
                  <path
                    d="M 60 195 L 60 178 C 140 170, 220 155, 320 130 C 420 100, 500 48, 562 48 C 620 48, 655 110, 688 135 L 688 195 Z"
                    fill="url(#cleanIndigoAreaGrad)"
                  />

                  {/* Primary Yearly Curve */}
                  <path
                    d="M 60 178 C 140 170, 220 155, 320 130 C 420 100, 500 48, 562 48 C 620 48, 655 110, 688 135"
                    fill="none"
                    stroke="#6366F1"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />

                  {/* Yearly Peak Pin on 2025 */}
                  <g id="tooltip2025">
                    <line x1="562" y1="48" x2="562" y2="195" stroke="#6366F1" strokeWidth="1.8" strokeDasharray="4 3" opacity="0.75" />
                    <circle cx="562" cy="48" r="5.5" fill="#6366F1" stroke="#FFFFFF" strokeWidth="2.5" />
                    <g transform="translate(510, 12)">
                      <rect width="104" height="26" rx="8" fill="#1E1B4B" stroke="#6366F1" strokeWidth="1.5" />
                      <text x="52" y="17" textAnchor="middle" fontSize="11" fontWeight="800" fill="#FFFFFF">820 patrols</text>
                    </g>
                  </g>

                  {/* Yearly Years X Axis */}
                  {['2021', '2022', '2023', '2024', '2025', '2026'].map((yr, idx) => {
                    const x = 60 + idx * 125.6;
                    const isPeak = yr === '2025';
                    return (
                      <text
                        key={yr}
                        x={x}
                        y="215"
                        fontSize={isPeak ? "11" : "10"}
                        fontWeight={isPeak ? "900" : "600"}
                        fill="currentColor"
                        className={isPeak ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"}
                        textAnchor="middle"
                      >
                        {yr}
                      </text>
                    );
                  })}
                </>
              )}
            </svg>
          </div>
        </div>

        {/* Right (Span 4): Our Team + Total Working Time with Glowing Gradient */}
        <div className="lg:col-span-4 rounded-3xl bg-gradient-to-b from-white to-slate-50/80 dark:from-[#121824] dark:to-[#0C111C] border border-slate-200/90 dark:border-[#1F293D] p-6 shadow-xl shadow-black/5 dark:shadow-black/40 flex flex-col justify-between gap-6 relative overflow-hidden">
          {/* Top: Our Team with real Circuitech Team 13 photos */}
          <div
            className="flex items-center justify-between cursor-pointer hover:opacity-95 transition group"
            onClick={onOpenTeamModal}
          >
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                  Our Team
                </h3>
                <Sparkles size={13} className="text-amber-400" />
              </div>
              <p className="text-xs text-slate-400 font-semibold">Project Core Team</p>
            </div>

            {/* Avatar Stack with real team photos + 12 pill */}
            <div className="flex items-center -space-x-2.5">
              <img
                src={abhishekImg}
                alt="Abhishek Anand"
                className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-[#121824] shadow-md ring-2 ring-blue-500/30"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.fallback) {
                    target.dataset.fallback = 'true';
                    target.src = '/assets/abhishek-anand.jpg';
                  }
                }}
              />
              <img
                src={dakshImg}
                alt="Daksh Srivastava"
                className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-[#121824] shadow-md ring-2 ring-emerald-500/30"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.fallback) {
                    target.dataset.fallback = 'true';
                    target.src = '/assets/daksh-srivastava.jpg';
                  }
                }}
              />
              <img
                src={gunjanImg}
                alt="Gunjan Jangir"
                className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-[#121824] shadow-md ring-2 ring-pink-500/30"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.fallback) {
                    target.dataset.fallback = 'true';
                    target.src = '/assets/gunjan-jangir.jpg';
                  }
                }}
              />
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-700 via-indigo-700 to-pink-600 text-white border-2 border-white dark:border-[#121824] flex items-center justify-center text-xs font-black shadow-lg shadow-purple-500/30">
                +12
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800/80" />

          {/* Bottom: Total Working Time with Multi-Color Gradient Text */}
          <div className="flex items-end justify-between">
            <div>
              <h4 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                Total Working time
              </h4>
              <p className="text-xs text-slate-400 font-semibold mt-1">Robot runtime in a week</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400">
                  86% of target reached
                </span>
              </div>
            </div>

            <div className="text-4xl font-black bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
              52 H
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="pt-6 pb-2 border-t border-slate-200/80 dark:border-[#1E2738] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
        <div className="flex items-center gap-6">
          <button
            onClick={() => alert('FireBot Pro: Local & encrypted IoT telemetry protocol.')}
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => alert('FireBot Safety Protocol v1.0 • Autonomous response compliance.')}
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
          >
            Terms of Service
          </button>
          <button
            onClick={onOpenTeamModal}
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
          >
            Help Center
          </button>
        </div>

        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
          <span>ThingSpeak IoT: <strong className="text-emerald-500 font-bold">Connected</strong></span>
          <span>•</span>
          <span>© {currentTime.getFullYear()} FireBot Control Center. All rights reserved.</span>
        </div>
      </footer>

      {/* ── New Task Modal ── */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-[#141A26] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Create New Mission Task
              </h3>
              <button
                onClick={() => setIsNewTaskModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inspect Laboratory 201 flame sensor"
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={newTaskDate}
                    onChange={e => setNewTaskDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={newTaskTime}
                    onChange={e => setNewTaskTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 cursor-pointer"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
