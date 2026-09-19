export type AlertSeverity = 'critical' | 'warning' | 'info';
export type RobotStatus = 'idle' | 'patrolling' | 'avoiding' | 'navigating' | 'extinguishing' | 'returning';
export type PumpState = 'standby' | 'spraying';
export type MapMode = 'indoor' | 'outdoor';

export interface SensorData {
  irFlame: number;        // 0 = no flame, 1 = flame detected
  humidity: number;       // %
  temperature: number;    // °C
  distance: number;       // cm
  gas: number;            // ppm equivalent
  timestamp: number;      // unix ms
  lastUpdated: number;    // seconds ago
}

export interface RobotState {
  status: RobotStatus;
  battery: number;        // %
  voltage: number;        // V
  wifiStrength: number;   // dBm
  gpsLat: number;
  gpsLng: number;
  gpsAccuracy: number;    // meters
  gpsLock: boolean;
  missionDuration: number; // seconds
  pumpState: PumpState;
  pumpDuration: number;   // seconds
  buzzerActive: boolean;
  oledAlert: boolean;
}

export interface AlertItem {
  id: string;
  severity: AlertSeverity;
  message: string;
  detail: string;
  timestamp: Date;
  acknowledged: boolean;
}

export interface LogEntry {
  id: string;
  time: Date;
  event: string;
  severity: AlertSeverity | 'info';
}

export interface HistoryPoint {
  time: string;
  temperature: number;
  humidity: number;
  flame: number;
  gas: number;
  distance: number;
}

// Generate 40 history points (10-min window, 15-sec intervals)
function generateHistory(emergency = false): HistoryPoint[] {
  const points: HistoryPoint[] = [];
  const now = Date.now();
  for (let i = 39; i >= 0; i--) {
    const t = new Date(now - i * 15000);
    const label = t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    points.push({
      time: label,
      temperature: emergency && i < 10 ? 55 + (10 - i) * 1.8 + Math.random() * 2 : 27 + Math.sin(i * 0.3) * 3 + Math.random() * 1,
      humidity: 58 + Math.sin(i * 0.2) * 8 + Math.random() * 2,
      flame: emergency && i < 8 ? 1 : 0,
      gas: emergency && i < 12 ? 180 + (12 - i) * 30 + Math.random() * 20 : 45 + Math.sin(i * 0.4) * 15 + Math.random() * 5,
      distance: 80 + Math.sin(i * 0.5) * 40 + Math.random() * 10,
    });
  }
  return points;
}

export const NORMAL_STATE = {
  sensor: {
    irFlame: 0,
    humidity: 61.4,
    temperature: 28.2,
    distance: 94,
    gas: 52,
    timestamp: Date.now(),
    lastUpdated: 8,
  } as SensorData,
  robot: {
    status: 'patrolling' as RobotStatus,
    battery: 78,
    voltage: 11.4,
    wifiStrength: -58,
    gpsLat: 3.1390,
    gpsLng: 101.6869,
    gpsAccuracy: 4.2,
    gpsLock: true,
    missionDuration: 1847,
    pumpState: 'standby' as PumpState,
    pumpDuration: 0,
    buzzerActive: false,
    oledAlert: false,
  } as RobotState,
  alerts: [] as AlertItem[],
  logs: [
    { id: '1', time: new Date(Date.now() - 120000), event: 'Patrol route started — Sector A', severity: 'info' },
    { id: '2', time: new Date(Date.now() - 240000), event: 'Obstacle detected at 18 cm — rerouting', severity: 'warning' },
    { id: '3', time: new Date(Date.now() - 360000), event: 'WiFi signal stable — ThingSpeak connected', severity: 'info' },
    { id: '4', time: new Date(Date.now() - 720000), event: 'Battery check — 78%, runtime ~3h 40m', severity: 'info' },
    { id: '5', time: new Date(Date.now() - 1200000), event: 'Robot online — initializing sensors', severity: 'info' },
    { id: '6', time: new Date(Date.now() - 1800000), event: 'System boot complete', severity: 'info' },
  ] as LogEntry[],
  history: generateHistory(false),
};

export const EMERGENCY_STATE = {
  sensor: {
    irFlame: 1,
    humidity: 34.1,
    temperature: 68.5,
    distance: 22,
    gas: 420,
    timestamp: Date.now(),
    lastUpdated: 3,
  } as SensorData,
  robot: {
    status: 'extinguishing' as RobotStatus,
    battery: 62,
    voltage: 10.9,
    wifiStrength: -67,
    gpsLat: 3.1391,
    gpsLng: 101.6870,
    gpsAccuracy: 5.8,
    gpsLock: true,
    missionDuration: 2314,
    pumpState: 'spraying' as PumpState,
    pumpDuration: 47,
    buzzerActive: true,
    oledAlert: true,
  } as RobotState,
  alerts: [
    {
      id: 'a1',
      severity: 'critical' as AlertSeverity,
      message: 'FIRE DETECTED',
      detail: 'Flame sensor triggered — Temp 68.5°C — MQ-2 at 420 ppm',
      timestamp: new Date(Date.now() - 47000),
      acknowledged: false,
    },
    {
      id: 'a2',
      severity: 'critical' as AlertSeverity,
      message: 'GAS LEAK DETECTED',
      detail: 'MQ-2 above danger threshold (420 ppm > 300 ppm)',
      timestamp: new Date(Date.now() - 52000),
      acknowledged: false,
    },
  ] as AlertItem[],
  logs: [
    { id: '1', time: new Date(Date.now() - 3000), event: 'Water pump activated — spraying', severity: 'critical' },
    { id: '2', time: new Date(Date.now() - 15000), event: 'Navigating to fire source — Corridor B', severity: 'critical' },
    { id: '3', time: new Date(Date.now() - 28000), event: 'FIRE DETECTED — IR sensor triggered', severity: 'critical' },
    { id: '4', time: new Date(Date.now() - 35000), event: 'GAS LEAK — MQ-2 exceeds 300 ppm threshold', severity: 'critical' },
    { id: '5', time: new Date(Date.now() - 52000), event: 'Temp rising — 52°C — monitoring closely', severity: 'warning' },
    { id: '6', time: new Date(Date.now() - 120000), event: 'Patrol route active — Sector B', severity: 'info' },
  ] as LogEntry[],
  history: generateHistory(true),
};

export const THRESHOLDS = {
  temperatureHigh: 50,  // °C
  gasDanger: 300,       // ppm
  gasElevated: 150,     // ppm
  batteryLow: 20,       // %
  obstacleWarning: 20,  // cm
};

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m.toString().padStart(2, '0')}m`;
  return `${m}m ${s.toString().padStart(2, '0')}s`;
}

export function formatTimeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export function getGasZone(ppm: number): { label: string; color: string } {
  if (ppm < 150) return { label: 'Safe', color: '#22C55E' };
  if (ppm < 300) return { label: 'Elevated', color: '#FBBF24' };
  return { label: 'Danger', color: '#FF2E2E' };
}

export function getRobotStatusLabel(status: RobotStatus): string {
  const map: Record<RobotStatus, string> = {
    idle: 'Idle',
    patrolling: 'Patrolling',
    avoiding: 'Avoiding Obstacle',
    navigating: 'Navigating to Fire',
    extinguishing: 'Extinguishing',
    returning: 'Returning to Base',
  };
  return map[status];
}

export function getRobotStatusColor(status: RobotStatus): string {
  const map: Record<RobotStatus, string> = {
    idle: '#3B82F6',
    patrolling: '#22C55E',
    avoiding: '#FBBF24',
    navigating: '#FF6B2C',
    extinguishing: '#FF2E2E',
    returning: '#00E5FF',
  };
  return map[status];
}
