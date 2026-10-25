import { useState, useEffect } from 'react';
import Sidebar, { TabId } from '../components/Sidebar';
import TopBar from '../components/TopBar';
import TasksDashboardView from '../components/views/TasksDashboardView';
import NavigationMap from '../components/cards/NavigationMap';
import RobotControlView from '../components/views/RobotControlView';
import SensorsView from '../components/views/SensorsView';
import AlertsView from '../components/views/AlertsView';
import LogsView from '../components/views/LogsView';
import SettingsView from '../components/views/SettingsView';
import AboutView from '../components/views/AboutView';
import { NORMAL_STATE, EMERGENCY_STATE, AlertItem } from '../data/mockData';
import { ConsoleLog } from '../components/cards/RobotCommandConsole';
import { findIndoorPath, calculateSafeStep, PATROL_LOOPS, Point } from '../utils/indoorNavigation';
import { X } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

const REFRESH_INTERVAL = 15;

const ROOM_TARGETS: Record<string, { x: number; y: number; name: string; floor: number }> = {
  // Floor 1 (Ground Level)
  foyer: { x: 42, y: 106, name: 'Entrance Foyer', floor: 1 },
  entrance: { x: 42, y: 106, name: 'Entrance Foyer', floor: 1 },
  'entrance foyer': { x: 42, y: 106, name: 'Entrance Foyer', floor: 1 },
  living: { x: 137, y: 62, name: 'Great Living Room', floor: 1 },
  'living room': { x: 137, y: 62, name: 'Great Living Room', floor: 1 },
  'great living room': { x: 137, y: 62, name: 'Great Living Room', floor: 1 },
  kitchen: { x: 255, y: 62, name: 'Kitchen & Dining', floor: 1 },
  dining: { x: 255, y: 62, name: 'Kitchen & Dining', floor: 1 },
  'kitchen & dining': { x: 255, y: 62, name: 'Kitchen & Dining', floor: 1 },
  garage: { x: 57, y: 171, name: 'Garage & Dock', floor: 1 },
  'garage & dock': { x: 57, y: 171, name: 'Garage & Dock', floor: 1 },
  dock: { x: 57, y: 171, name: 'Garage & Dock', floor: 1 },
  hallway: { x: 140, y: 135, name: 'Central Hall', floor: 1 },
  'central hall': { x: 140, y: 135, name: 'Central Hall', floor: 1 },
  patio: { x: 266, y: 160, name: 'Garden Patio', floor: 1 },
  'garden patio': { x: 266, y: 160, name: 'Garden Patio', floor: 1 },
  deck: { x: 266, y: 160, name: 'Garden Patio', floor: 1 },
  utility: { x: 140, y: 183, name: 'Utility / Laundry', floor: 1 },
  laundry: { x: 140, y: 183, name: 'Utility / Laundry', floor: 1 },
  powder: { x: 199, y: 135, name: 'Powder Room', floor: 1 },
  'powder room': { x: 199, y: 135, name: 'Powder Room', floor: 1 },
  exit: { x: 14, y: 106, name: 'Main Front Door Exit', floor: 1 },

  // Floor 2 (Upper Level)
  master: { x: 70, y: 62, name: 'Master Suite', floor: 2 },
  'master bedroom': { x: 70, y: 62, name: 'Master Suite', floor: 2 },
  'master suite': { x: 70, y: 62, name: 'Master Suite', floor: 2 },
  ensuite: { x: 55, y: 160, name: 'Ensuite & Closet', floor: 2 },
  closet: { x: 55, y: 160, name: 'Ensuite & Closet', floor: 2 },
  bath: { x: 55, y: 160, name: 'Ensuite & Closet', floor: 2 },
  study: { x: 172, y: 48, name: 'Cyber Study', floor: 2 },
  office: { x: 172, y: 48, name: 'Cyber Study', floor: 2 },
  lab: { x: 172, y: 48, name: 'Cyber Study', floor: 2 },
  'family hall': { x: 138, y: 120, name: 'Family Hall', floor: 2 },
  bedroom2: { x: 262, y: 56, name: 'Bedroom 2 (Guest)', floor: 2 },
  guest: { x: 262, y: 56, name: 'Bedroom 2 (Guest)', floor: 2 },
  bedroom3: { x: 262, y: 138, name: 'Bedroom 3 (Kids)', floor: 2 },
  kids: { x: 262, y: 138, name: 'Bedroom 3 (Kids)', floor: 2 },
  bath2: { x: 123, y: 182, name: 'Bathroom 2', floor: 2 },
  smarthub: { x: 163, y: 182, name: 'Smart Hub', floor: 2 },
  balcony: { x: 243, y: 192, name: 'Sun Balcony', floor: 2 },

  // Floor 3 (Penthouse Loft)
  skylounge: { x: 100, y: 76, name: 'Sky Lounge & Cinema', floor: 3 },
  lounge: { x: 100, y: 76, name: 'Sky Lounge & Cinema', floor: 3 },
  solar: { x: 229, y: 51, name: 'Solar BESS & Power', floor: 3 },
  battery: { x: 229, y: 51, name: 'Solar BESS & Power', floor: 3 },
  bess: { x: 229, y: 51, name: 'Solar BESS & Power', floor: 3 },
  server: { x: 229, y: 51, name: 'Solar BESS & Power', floor: 3 },
  hvac: { x: 229, y: 115, name: 'HVAC & Water Pump', floor: 3 },
  tank: { x: 229, y: 115, name: 'HVAC & Water Pump', floor: 3 },
  vault: { x: 80, y: 170, name: 'Attic Vault Storage', floor: 3 },
  attic: { x: 80, y: 170, name: 'Attic Vault Storage', floor: 3 },
  storage: { x: 80, y: 170, name: 'Attic Vault Storage', floor: 3 },
  terrace: { x: 209, y: 178, name: 'Rooftop Sky Terrace', floor: 3 },
};

export default function Dashboard({ onLogout }: DashboardProps) {
  // Theme state: defaults to 'light' (matching image 1), can be toggled to 'dark' (matching image 2)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('proserve_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [emergency, setEmergency] = useState(false);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [pumpActive, setPumpActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  // Active Floor Selection
  const [currentFloor, setCurrentFloor] = useState<number>(1);

  // Live controllable Robot Position State for blue dot on Navigation Map
  const [robotPos, setRobotPos] = useState({
    x: 57,
    y: 171,
    heading: 90,
    speed: 1.6,
    floor: 1,
    isAutoPatrol: true,
    patrolIndex: 0,
    waypoints: [] as Point[],
    targetRoomName: '',
  });

  // Console terminal log messages
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([
    {
      id: '1',
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      type: 'info',
      text: 'FireBot Smart Home Teleoperation CLI Initialized. Robot Sentinel X-1 active at Garage Dock (57.0m, 171.0m).',
    },
    {
      id: '2',
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      type: 'info',
      text: 'Indoor Navigation Grid: Zero wall penetration enabled. Pathfinding routes through doorways and corridors. Try "goto living" or click any room on the map!',
    },
  ]);

  function handleSelectRoom(roomName: string, targetX: number, targetY: number, roomFloor?: number) {
    const targetFloor = roomFloor || currentFloor;
    if (targetFloor !== currentFloor) {
      setCurrentFloor(targetFloor);
    }

    const currentPt: Point = { x: robotPos.x, y: robotPos.y };
    const targetPt: Point = { x: targetX, y: targetY };
    const path = findIndoorPath(currentPt, targetPt, targetFloor);

    setRobotPos(prev => ({
      ...prev,
      floor: targetFloor,
      isAutoPatrol: false,
      waypoints: path,
      targetRoomName: roomName,
    }));

    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
    setConsoleLogs(prev => [
      ...prev,
      {
        id: Date.now().toString() + '-dispatch',
        time: timeStr,
        type: 'success',
        text: `[INDOOR NAV ENGAGED] Routing Sentinel X-1 to ${roomName} via ${path.length} obstacle-free corridor waypoint(s). Wall penetration prevention ACTIVE.`,
      },
    ]);
  }

  const state = emergency ? EMERGENCY_STATE : NORMAL_STATE;

  // Apply theme to document root
  useEffect(() => {
    localStorage.setItem('proserve_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  function toggleTheme() {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }

  useEffect(() => {
    setAlerts(emergency ? [...EMERGENCY_STATE.alerts] : []);
    if (emergency) {
      // Dispatch robot directly to fire hazard via indoor collision-free hallways
      const hazard = {
        1: { x: 260, y: 55, name: 'Kitchen Cooktop Fire Hazard' },
        2: { x: 172, y: 48, name: 'Study Workstation Fire Hazard' },
        3: { x: 230, y: 52, name: 'Solar BESS Battery Hazard' },
      }[currentFloor] || { x: 260, y: 55, name: 'Fire Hazard' };

      const path = findIndoorPath({ x: robotPos.x, y: robotPos.y }, { x: hazard.x, y: hazard.y }, currentFloor);
      setRobotPos(prev => ({
        ...prev,
        isAutoPatrol: false,
        waypoints: path,
        targetRoomName: hazard.name,
      }));
    }
  }, [emergency]);

  // Smooth movement animation loop with obstacle & wall collision avoidance
  useEffect(() => {
    const interval = setInterval(() => {
      setRobotPos(prev => {
        // Case 1: Active Waypoints Navigation (Room dispatch or manual step)
        if (prev.waypoints && prev.waypoints.length > 0) {
          const target = prev.waypoints[0];
          const dx = target.x - prev.x;
          const dy = target.y - prev.y;
          const dist = Math.hypot(dx, dy);
          const step = (emergency ? prev.speed * 2.0 : prev.speed * 1.5);

          if (dist <= step) {
            // Arrived at current waypoint
            const nextWaypoints = prev.waypoints.slice(1);
            const isFinal = nextWaypoints.length === 0;

            if (isFinal) {
              const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
              setConsoleLogs(l => [
                ...l,
                {
                  id: Date.now() + '-arrived',
                  time: timeStr,
                  type: 'success',
                  text: `[DESTINATION REACHED] Sentinel X-1 arrived at ${prev.targetRoomName || 'target location'} (X: ${target.x.toFixed(1)}m, Y: ${target.y.toFixed(1)}m). Zero wall breaches recorded.`,
                },
              ]);
            }

            return {
              ...prev,
              x: target.x,
              y: target.y,
              waypoints: nextWaypoints,
            };
          }

          // Advance towards waypoint
          const angleRad = Math.atan2(dy, dx);
          const targetHeading = ((angleRad * 180) / Math.PI + 360) % 360;

          // Smooth heading rotation
          let diff = targetHeading - prev.heading;
          while (diff < -180) diff += 360;
          while (diff > 180) diff -= 360;
          const newHeading = (prev.heading + diff * 0.35 + 360) % 360;

          return {
            ...prev,
            x: prev.x + (dx / dist) * step,
            y: prev.y + (dy / dist) * step,
            heading: newHeading,
          };
        }

        // Case 2: Autonomous Corridor Patrol Loop (Never crosses walls)
        if (prev.isAutoPatrol) {
          const loop = PATROL_LOOPS[currentFloor] || PATROL_LOOPS[1];
          const target = loop[prev.patrolIndex % loop.length];
          const dx = target.x - prev.x;
          const dy = target.y - prev.y;
          const dist = Math.hypot(dx, dy);
          const step = (emergency ? prev.speed * 1.8 : prev.speed * 1.2);

          if (dist <= step) {
            return {
              ...prev,
              x: target.x,
              y: target.y,
              patrolIndex: (prev.patrolIndex + 1) % loop.length,
            };
          }

          const angleRad = Math.atan2(dy, dx);
          const targetHeading = ((angleRad * 180) / Math.PI + 360) % 360;

          let diff = targetHeading - prev.heading;
          while (diff < -180) diff += 360;
          while (diff > 180) diff -= 360;
          const newHeading = (prev.heading + diff * 0.3 + 360) % 360;

          return {
            ...prev,
            x: prev.x + (dx / dist) * step,
            y: prev.y + (dy / dist) * step,
            heading: newHeading,
          };
        }

        return prev;
      });
    }, 70);

    return () => clearInterval(interval);
  }, [emergency, currentFloor]);

  function handleExecuteCommand(cmdString: string): { success: boolean; message: string } {
    const raw = cmdString.trim();
    const lower = raw.toLowerCase();
    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
    const logId = Date.now().toString();

    setConsoleLogs(prev => [
      ...prev,
      { id: logId + '-cmd', time: timeStr, type: 'cmd', text: raw },
    ]);

    let resType: 'success' | 'warn' | 'error' | 'info' = 'success';
    let resText = '';

    const parts = lower.split(/\s+/);
    const mainCmd = parts[0];

    if (mainCmd === 'help') {
      resType = 'info';
      resText = `CLI COMMAND CHEATSHEET:
  • forward [m] / fwd [m] : Move robot forward (e.g. "forward 20")
  • backward [m] / back [m] : Move robot backward (e.g. "backward 15")
  • left [degrees] : Turn heading left (e.g. "left 45")
  • right [degrees] : Turn heading right (e.g. "right 90")
  • goto <room | x y> : Navigate to room (lobby, lab, server, storage, exit)
  • speed <val> : Set motor speed (0.5 to 4.0 m/s)
  • stop / halt : Stop all drive motors
  • patrol / auto : Resume autonomous floor patrol loop
  • pump on / pump off : Toggle water cannon suppression pump
  • status : Print robot coordinates & battery telemetry
  • clear / cls : Clear console logs`;
    } else if (mainCmd === 'clear' || mainCmd === 'cls') {
      setConsoleLogs([]);
      return { success: true, message: 'Console cleared.' };
    } else if (mainCmd === 'forward' || mainCmd === 'fwd' || mainCmd === 'fw') {
      const dist = parseFloat(parts[1]) || 15;
      const res = calculateSafeStep(
        { x: robotPos.x, y: robotPos.y },
        robotPos.heading,
        dist,
        currentFloor,
        5.5
      );

      if (res.blocked) {
        if (res.distanceMoved <= 0.6) {
          resType = 'warn';
          resText = `[COLLISION AVOIDED] Solid obstacle "${res.wallName}" directly ahead! Drive motors halted to prevent wall breach. Rotate heading left or right.`;
        } else {
          setRobotPos(prev => ({
            ...prev,
            isAutoPatrol: false,
            waypoints: [res.safePos],
            targetRoomName: 'Wall Standoff Position',
          }));
          resType = 'warn';
          resText = `[OBSTACLE DETECTED] Approached "${res.wallName}". Advanced ${res.distanceMoved}m and halted safely before wall collision.`;
        }
      } else {
        setRobotPos(prev => ({
          ...prev,
          isAutoPatrol: false,
          waypoints: [res.safePos],
          targetRoomName: 'Forward Step',
        }));
        resText = `[DRIVE FORWARD] Moving ${dist}m forward along clear corridor -> Target: (${res.safePos.x.toFixed(1)}m, ${res.safePos.y.toFixed(1)}m)`;
      }
    } else if (mainCmd === 'backward' || mainCmd === 'back' || mainCmd === 'rev') {
      const dist = parseFloat(parts[1]) || 15;
      const res = calculateSafeStep(
        { x: robotPos.x, y: robotPos.y },
        (robotPos.heading + 180) % 360,
        dist,
        currentFloor,
        5.5
      );

      if (res.blocked) {
        if (res.distanceMoved <= 0.6) {
          resType = 'warn';
          resText = `[COLLISION AVOIDED] Solid obstacle "${res.wallName}" directly behind robot! Reverse drive halted to prevent wall impact.`;
        } else {
          setRobotPos(prev => ({
            ...prev,
            isAutoPatrol: false,
            waypoints: [res.safePos],
            targetRoomName: 'Reverse Standoff Position',
          }));
          resType = 'warn';
          resText = `[OBSTACLE DETECTED] Approached "${res.wallName}". Reversed ${res.distanceMoved}m and halted safely before wall collision.`;
        }
      } else {
        setRobotPos(prev => ({
          ...prev,
          isAutoPatrol: false,
          waypoints: [res.safePos],
          targetRoomName: 'Reverse Step',
        }));
        resText = `[DRIVE BACKWARD] Moving ${dist}m reverse along clear corridor -> Target: (${res.safePos.x.toFixed(1)}m, ${res.safePos.y.toFixed(1)}m)`;
      }
    } else if (mainCmd === 'left') {
      const angle = parseFloat(parts[1]) || 45;
      const newHeading = (robotPos.heading - angle + 360) % 360;
      setRobotPos(prev => ({
        ...prev,
        isAutoPatrol: false,
        heading: newHeading,
      }));
      resText = `[ROTATE LEFT] Heading adjusted counter-clockwise by ${angle}° -> New Heading: ${Math.round(newHeading)}°`;
    } else if (mainCmd === 'right') {
      const angle = parseFloat(parts[1]) || 45;
      const newHeading = (robotPos.heading + angle) % 360;
      setRobotPos(prev => ({
        ...prev,
        isAutoPatrol: false,
        heading: newHeading,
      }));
      resText = `[ROTATE RIGHT] Heading adjusted clockwise by ${angle}° -> New Heading: ${Math.round(newHeading)}°`;
    } else if (mainCmd === 'goto' || mainCmd === 'move') {
      const query = parts.slice(1).join(' ');
      if (!query) {
        resType = 'warn';
        resText = 'Usage: goto <room> (e.g. "goto kitchen", "goto living", "goto garage")';
      } else if (ROOM_TARGETS[query]) {
        const rm = ROOM_TARGETS[query];
        handleSelectRoom(rm.name, rm.x, rm.y, rm.floor);
        resText = `[INDOOR NAVIGATION] Navigating Sentinel X-1 to ${rm.name} (Floor ${rm.floor}) via corridor doors & halls. Avoids all solid walls.`;
      } else if (parts.length >= 3 && !isNaN(parseFloat(parts[1])) && !isNaN(parseFloat(parts[2]))) {
        const targetX = Math.min(290, Math.max(20, parseFloat(parts[1])));
        const targetY = Math.min(195, Math.max(20, parseFloat(parts[2])));
        handleSelectRoom(`Coordinate (${targetX}, ${targetY})`, targetX, targetY, currentFloor);
        resText = `[COORDINATE NAV] Navigating Sentinel X-1 to (${targetX.toFixed(1)}m, ${targetY.toFixed(1)}m) through open hallways...`;
      } else {
        resType = 'warn';
        resText = `Unknown room "${query}". Known rooms: living, kitchen, garage, foyer, patio, master, study, bedroom2, bedroom3, skylounge, solar, hvac.`;
      }
    } else if (mainCmd === 'speed') {
      const val = parseFloat(parts[1]);
      if (isNaN(val) || val <= 0) {
        resType = 'warn';
        resText = 'Usage: speed <value> (e.g. "speed 2.5")';
      } else {
        const clamped = Math.min(4.0, Math.max(0.5, val));
        setRobotPos(prev => ({ ...prev, speed: clamped }));
        resText = `[MOTOR PARAM] Robot drive speed updated to ${clamped.toFixed(1)} m/s`;
      }
    } else if (mainCmd === 'stop' || mainCmd === 'halt') {
      setRobotPos(prev => ({ ...prev, isAutoPatrol: false, waypoints: [] }));
      resText = `[STOP COMMAND] Drive motors halted at X: ${robotPos.x.toFixed(1)}m, Y: ${robotPos.y.toFixed(1)}m`;
    } else if (mainCmd === 'patrol' || mainCmd === 'auto') {
      setRobotPos(prev => ({ ...prev, isAutoPatrol: true, waypoints: [] }));
      resText = `[AUTO PATROL] Autonomous floor corridor patrol route resumed (Doorways & hallway path).`;
    } else if (mainCmd === 'pump') {
      const sub = parts[1];
      if (sub === 'on' || sub === 'start' || sub === 'spray') {
        setPumpActive(true);
        resText = '[PUMP CONTROL] High-pressure water cannon pump ACTIVATED (Spraying)';
      } else if (sub === 'off' || sub === 'stop') {
        setPumpActive(false);
        resText = '[PUMP CONTROL] Water cannon pump DISENGAGED (Standby)';
      } else {
        setPumpActive(p => !p);
        resText = '[PUMP CONTROL] Water cannon pump toggled';
      }
    } else if (mainCmd === 'status') {
      resType = 'info';
      resText = `[TELEMETRY STATUS] Pos: (${robotPos.x.toFixed(1)}m, ${robotPos.y.toFixed(1)}m) | Heading: ${Math.round(robotPos.heading)}° | Speed: ${robotPos.speed.toFixed(1)}m/s | Mode: ${robotPos.isAutoPatrol ? 'AUTO' : 'MANUAL'} | Pump: ${pumpActive ? 'ON' : 'OFF'}`;
    } else {
      resType = 'error';
      resText = `Command not recognized: "${raw}". Type "help" for valid commands.`;
    }

    setConsoleLogs(prev => [
      ...prev,
      { id: logId + '-res', time: timeStr, type: resType, text: resText },
    ]);

    return { success: resType !== 'error', message: resText };
  }

  const unackAlertCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div
      className={`min-h-screen w-full flex bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#F8FAFC] dark:from-[#0B0E14] dark:to-[#0D1219] text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200 ${
        theme === 'dark' ? 'dark' : ''
      }`}
    >
      {/* ── 🚨 FULL SCREEN RED BLINKING EMERGENCY OVERLAY ── */}
      {emergency && (
        <>
          <div className="fixed inset-0 pointer-events-none z-50 animate-red-screen-strobe border-8 border-red-600" />
          <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-xs font-black py-2.5 px-4 text-center z-50 flex items-center justify-center gap-3 shadow-xl shadow-red-950/60 animate-pulse">
            <span className="text-base">🚨</span>
            <span>CRITICAL FIRE ALARM TRIGGERED! FIREBOT SENTINEL DISPATCHED TO ZONE A-2</span>
            <button
              onClick={() => setEmergency(false)}
              className="px-3 py-1 rounded-lg bg-white text-red-700 text-[11px] font-black hover:bg-slate-100 transition-all cursor-pointer border border-red-200 ml-2"
            >
              SILENCE / RESET TEST ALARM
            </button>
          </div>
        </>
      )}

      {/* ── LEFT SIDEBAR (ProServe Format) ── */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        unackAlertCount={unackAlertCount}
        emergency={emergency}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* ── MAIN CONTENT WORKSPACE ── */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 md:lg:pl-72 transition-all">
        {/* Top Floating App Bar */}
        <TopBar
          theme={theme}
          onToggleTheme={toggleTheme}
          unackAlertCount={unackAlertCount}
          emergency={emergency}
          onToggleEmergency={() => setEmergency(p => !p)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenNotifications={() => setActiveTab('alerts')}
          onLogout={onLogout}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Dynamic Views Container */}
        <main className="flex-1 pb-16">
          {/* TAB 1: DASHBOARD (Overview with ProServe UI/UX) */}
          {activeTab === 'dashboard' && (
            <TasksDashboardView
              state={state}
              emergency={emergency}
              pumpActive={pumpActive}
              onTogglePump={() => setPumpActive(!pumpActive)}
              onNavigateTab={setActiveTab}
              onOpenTeamModal={() => setIsTeamModalOpen(true)}
            />
          )}

          {/* TAB 2: LIVE MAP & ROBOT CONTROL */}
          {activeTab === 'map' && (
            <div className="max-w-[1700px] mx-auto p-4 md:p-8 flex flex-col gap-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Live Map & Teleoperation Control
                </h1>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  Interactive real-time indoor navigation, motor drive controls, water cannon suppression panel, and CLI terminal
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Left: Navigation Floor Plan Map */}
                <div className="lg:col-span-7 h-[600px] min-h-[500px]">
                  <NavigationMap
                    robot={state.robot}
                    sensor={state.sensor}
                    emergency={emergency}
                    robotPos={robotPos}
                    currentFloor={currentFloor}
                    onFloorChange={floorNum => {
                      setCurrentFloor(floorNum);
                      const defaultPos = {
                        1: { x: 57, y: 171 }, // Garage Dock
                        2: { x: 138, y: 120 }, // Family Hall
                        3: { x: 100, y: 76 },  // Sky Lounge
                      }[floorNum] || { x: 140, y: 135 };

                      setRobotPos(prev => ({
                        ...prev,
                        x: defaultPos.x,
                        y: defaultPos.y,
                        floor: floorNum,
                        waypoints: [],
                        patrolIndex: 0,
                      }));

                      const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
                      setConsoleLogs(l => [
                        ...l,
                        {
                          id: Date.now() + '-floor',
                          time: timeStr,
                          type: 'info',
                          text: `[FLOOR SHIFT] Active telemetry switched to Floor ${floorNum}. Loaded floor architectural walls and navigation grid.`,
                        },
                      ]);
                    }}
                    onSelectRoom={room => handleSelectRoom(room.name, room.x, room.y, room.floor)}
                  />
                </div>

                {/* Right: Teleoperation & Motor/Cannon Control Panel */}
                <div className="lg:col-span-5 flex flex-col gap-6 overflow-y-auto max-h-[600px]">
                  <RobotControlView
                    robot={state.robot}
                    emergency={emergency}
                    onExecuteCommand={handleExecuteCommand}
                    pumpActive={pumpActive}
                    onTogglePump={() => setPumpActive(!pumpActive)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SENSORS (Sensor Array & Environmental Graphs) */}
          {activeTab === 'sensors' && (
            <div className="max-w-[1600px] mx-auto p-4 md:p-8 animate-fade-in">
              <div className="mb-6">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Environmental Sensor Array & Telemetry
                </h1>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  Live readings from IR Flame, MQ-2 Gas, DHT11 Thermal, and HC-SR04 distance sensors
                </p>
              </div>
              <SensorsView
                sensor={state.sensor}
                robot={state.robot}
                history={state.history}
              />
            </div>
          )}

          {/* TAB 4: ALERTS (Fire & Hazard Notifications) */}
          {activeTab === 'alerts' && (
            <div className="max-w-[1600px] mx-auto p-4 md:p-8 animate-fade-in">
              <div className="mb-6">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Alerts & Emergency Incident Center
                </h1>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  Fire alarms, gas leak warnings, and emergency dispatch alerts
                </p>
              </div>
              <AlertsView />
            </div>
          )}

          {/* TAB 5: LOGS (Flight Logs & Telemetry Data Files) */}
          {activeTab === 'logs' && (
            <div className="max-w-[1600px] mx-auto p-4 md:p-8 animate-fade-in">
              <div className="mb-6">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  System Logs & Flight Records
                </h1>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  Download historical sensor captures, navigation path files, and audit records
                </p>
              </div>
              <LogsView logs={state.logs} />
            </div>
          )}

          {/* TAB 6: SETTINGS (Robot & Fleet Configuration) */}
          {activeTab === 'settings' && (
            <div className="max-w-[1600px] mx-auto p-4 md:p-8 animate-fade-in">
              <div className="mb-6">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Settings & Fleet Parameters
                </h1>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  Calibrate alarm thresholds, Wi-Fi parameters, and motor drive sensitivity
                </p>
              </div>
              <SettingsView />
            </div>
          )}

          {/* TAB 7: ABOUT & TEAM */}
          {activeTab === 'about' && (
            <div className="max-w-[1600px] mx-auto p-4 md:p-8 animate-fade-in">
              <AboutView />
            </div>
          )}
        </main>
      </div>

      {/* ── TEAM & ABOUT MODAL ── */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#141A26] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl animate-fade-in relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsTeamModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>

            <AboutView />

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
              <button
                onClick={() => setIsTeamModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-all shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
