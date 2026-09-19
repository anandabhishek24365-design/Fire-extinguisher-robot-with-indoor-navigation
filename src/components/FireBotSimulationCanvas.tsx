import { useEffect, useRef, useState } from 'react';

export type EnvironmentType = 'library' | 'laboratory' | 'campus' | 'warehouse';

export type SimulationPhase =
  | 'MONITORING'
  | 'MULTI_ZONE_FIRE_IGNITION'
  | 'NAVIGATING_ZONE_A'
  | 'EXTINGUISHING_ZONE_A'
  | 'NAVIGATING_ZONE_B'
  | 'EXTINGUISHING_ZONE_B'
  | 'ALL_ZONES_NEUTRALIZED';

export interface TelemetryData {
  phase: SimulationPhase;
  fireIntensity: number; // 0 to 100
  ambientTemp: number; // Celsius
  distanceToTarget: number; // meters
  waterLevel: number; // 0 to 100%
  statusText: string;
  statusSeverity: 'normal' | 'warning' | 'danger' | 'success';
  phaseProgress: number; // 0 to 1
  activeFireCount: number;
  activeZoneText: string;
}

interface FireBotSimulationCanvasProps {
  environment?: EnvironmentType;
  speedMultiplier?: number;
  onTelemetryUpdate?: (data: TelemetryData) => void;
  paused?: boolean;
}

function lerp(start: number, end: number, amt: number): number {
  return start + (end - start) * amt;
}

function lerpAngle(current: number, target: number, step: number): number {
  let diff = target - current;
  while (diff < -Math.PI) diff += Math.PI * 2;
  while (diff > Math.PI) diff -= Math.PI * 2;
  return current + diff * step;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

export default function FireBotSimulationCanvas({
  environment = 'library',
  speedMultiplier = 1.0,
  onTelemetryUpdate,
  paused = false,
}: FireBotSimulationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentEnv, setCurrentEnv] = useState<EnvironmentType>(environment);

  useEffect(() => {
    setCurrentEnv(environment);
  }, [environment]);

  const telemetryCallbackRef = useRef(onTelemetryUpdate);
  useEffect(() => {
    telemetryCallbackRef.current = onTelemetryUpdate;
  }, [onTelemetryUpdate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const CYCLE_DURATION = 30;
    let simTime = 0;
    let lastTimestamp = performance.now();
    let lastTelemetryTime = 0;

    let robotX = width * 0.85;
    let robotY = height * 0.82;
    let robotVelX = 0;
    let robotVelY = 0;
    let turretAngle = Math.PI;
    let waterPressure = 0;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
      maxLife: number;
      color?: string;
      opacity?: number;
    }

    interface SplashRipple {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      opacity: number;
    }

    let flameParticles: Particle[] = [];
    let smokeParticles: Particle[] = [];
    let waterParticles: Particle[] = [];
    let mistParticles: Particle[] = [];
    let steamParticles: Particle[] = [];
    let splashRipples: SplashRipple[] = [];

    const randomRange = (min: number, max: number) => min + Math.random() * (max - min);

    // ── 60 FPS Render Loop ──
    const render = (now: number) => {
      const dt = Math.min((now - lastTimestamp) / 1000, 0.05);
      lastTimestamp = now;

      if (!paused) {
        simTime = (simTime + dt * speedMultiplier) % CYCLE_DURATION;
      }

      // Hotspots
      const zoneAX = width * 0.22;
      const zoneAY = height * 0.46;

      const zoneBX = width * 0.78;
      const zoneBY = height * 0.46;

      const robotHomeX = width * 0.85;
      const robotHomeY = height * 0.82;

      const standoffAX = width * 0.32;
      const standoffAY = height * 0.54;

      const standoffBX = width * 0.68;
      const standoffBY = height * 0.54;

      let phase: SimulationPhase = 'MONITORING';
      let phaseProgress = 0;
      let zoneAIntensity = 0;
      let zoneBIntensity = 0;
      let activeFireCount = 0;
      let activeZoneText = 'ALL ZONES SAFE';
      let ambientTemp = 24;
      let distanceToTarget = 24;
      let waterLevel = 100;
      let statusText = 'INDOOR SCAN: ALL ZONES NOMINAL';
      let statusSeverity: TelemetryData['statusSeverity'] = 'normal';

      let targetRobotX = robotHomeX;
      let targetRobotY = robotHomeY;
      let sprayingTargetX: number | null = null;
      let sprayingTargetY: number | null = null;
      let targetTurretAngle = Math.PI;
      let targetWaterPressure = 0;

      if (simTime < 4.0) {
        phase = 'MONITORING';
        phaseProgress = simTime / 4.0;
        zoneAIntensity = 0;
        zoneBIntensity = 0;
        activeFireCount = 0;
        activeZoneText = 'PERIMETER SECURE';
        ambientTemp = 24.0 + Math.sin(simTime * 2) * 0.4;
        distanceToTarget = 24.0;
        waterLevel = 100;
        statusText = 'MONITORING: ALL INDOOR ZONES SAFE';
        statusSeverity = 'normal';

        targetRobotX = robotHomeX;
        targetRobotY = robotHomeY;
        targetTurretAngle = Math.PI;
        targetWaterPressure = 0;
      } else if (simTime < 8.0) {
        phase = 'MULTI_ZONE_FIRE_IGNITION';
        phaseProgress = (simTime - 4.0) / 4.0;
        const eProgress = easeOutQuad(phaseProgress);

        zoneAIntensity = Math.min(100, eProgress * 125);
        zoneBIntensity = Math.min(100, Math.max(0, (eProgress - 0.3) * 140));

        activeFireCount = 2;
        activeZoneText = 'ZONES A-2 & B-4';
        ambientTemp = 25 + eProgress * 185;
        distanceToTarget = 24.0;
        waterLevel = 100;
        statusText = '🔥 ALERTS: FIRES DETECTED IN ZONE A-2 & ZONE B-4!';
        statusSeverity = 'danger';

        targetRobotX = robotHomeX;
        targetRobotY = robotHomeY;
        targetTurretAngle = Math.PI;
        targetWaterPressure = 0;
      } else if (simTime < 12.5) {
        phase = 'NAVIGATING_ZONE_A';
        phaseProgress = (simTime - 8.0) / 4.5;
        const smoothProgress = easeInOutCubic(phaseProgress);

        zoneAIntensity = 100;
        zoneBIntensity = 100;
        activeFireCount = 2;
        activeZoneText = 'NAVIGATING TO ZONE A-2';
        ambientTemp = 210 + Math.sin(simTime * 4) * 3;
        distanceToTarget = Math.max(4.0, 24.0 - smoothProgress * 20.0);
        waterLevel = 100;
        statusText = `🤖 DISPATCHED: NAVIGATING TO ZONE A-2 (${distanceToTarget.toFixed(1)}m)`;
        statusSeverity = 'warning';

        targetRobotX = lerp(robotHomeX, standoffAX, smoothProgress);
        targetRobotY = lerp(robotHomeY, standoffAY, smoothProgress);
        targetTurretAngle = Math.atan2(zoneAY - standoffAY, zoneAX - standoffAX);
        targetWaterPressure = 0;
      } else if (simTime < 17.5) {
        phase = 'EXTINGUISHING_ZONE_A';
        phaseProgress = (simTime - 12.5) / 5.0;

        const pumpProgress = Math.max(0, (phaseProgress - 0.12) / 0.88);
        const decay = easeOutQuad(pumpProgress);

        zoneAIntensity = Math.max(0, 100 * (1 - decay));
        zoneBIntensity = 100;
        activeFireCount = zoneAIntensity > 5 ? 2 : 1;
        activeZoneText = 'EXTINGUISHING ZONE A-2';
        ambientTemp = 210 - decay * 65;
        distanceToTarget = 4.0;
        waterLevel = Math.max(82, 100 - phaseProgress * 18);
        statusText = `💧 HIGH-PRESSURE WATER SPRAY ON ZONE A-2 — FLAME DECAY ${Math.round((1 - decay) * 100)}%`;
        statusSeverity = 'warning';

        targetRobotX = standoffAX;
        targetRobotY = standoffAY;
        sprayingTargetX = zoneAX;
        sprayingTargetY = zoneAY;
        targetTurretAngle = Math.atan2(zoneAY - standoffAY, zoneAX - standoffAX);
        targetWaterPressure = Math.min(1, phaseProgress * 4);
      } else if (simTime < 22.0) {
        phase = 'NAVIGATING_ZONE_B';
        phaseProgress = (simTime - 17.5) / 4.5;
        const moveProgress = easeInOutCubic(phaseProgress);

        zoneAIntensity = 0;
        zoneBIntensity = 100;
        activeFireCount = 1;
        activeZoneText = 'NAVIGATING TO ZONE B-4';
        ambientTemp = 145;
        distanceToTarget = 3.5;
        waterLevel = 82;
        statusText = '🤖 NAVIGATING TO ZONE B-4';
        statusSeverity = 'warning';

        targetRobotX = lerp(standoffAX, standoffBX, moveProgress);
        targetRobotY = lerp(standoffAY, standoffBY, moveProgress);
        targetTurretAngle = Math.atan2(zoneBY - standoffBY, zoneBX - standoffBX);
        targetWaterPressure = 0;
      } else if (simTime < 27.0) {
        phase = 'EXTINGUISHING_ZONE_B';
        phaseProgress = (simTime - 22.0) / 5.0;

        const pumpProgress = Math.max(0, (phaseProgress - 0.12) / 0.88);
        const decay = easeOutQuad(pumpProgress);

        zoneAIntensity = 0;
        zoneBIntensity = Math.max(0, 100 * (1 - decay));
        activeFireCount = zoneBIntensity > 5 ? 1 : 0;
        activeZoneText = 'EXTINGUISHING ZONE B-4';
        ambientTemp = 145 - decay * 120;
        distanceToTarget = 3.0;
        waterLevel = Math.max(65, 82 - phaseProgress * 17);
        statusText = `💧 HIGH-PRESSURE WATER SPRAY ON ZONE B-4 — FLAME DECAY ${Math.round((1 - decay) * 100)}%`;
        statusSeverity = 'warning';

        targetRobotX = standoffBX;
        targetRobotY = standoffBY;
        sprayingTargetX = zoneBX;
        sprayingTargetY = zoneBY;
        targetTurretAngle = Math.atan2(zoneBY - standoffBY, zoneBX - standoffBX);
        targetWaterPressure = Math.min(1, phaseProgress * 4);
      } else {
        phase = 'ALL_ZONES_NEUTRALIZED';
        phaseProgress = (simTime - 27.0) / 3.0;
        zoneAIntensity = 0;
        zoneBIntensity = 0;
        activeFireCount = 0;
        activeZoneText = 'ALL ZONES SECURE';
        ambientTemp = 24.5 - phaseProgress * 0.8;
        distanceToTarget = 3.0;
        waterLevel = 65;
        statusText = '✅ ALL MULTIPLE FIRE ZONES NEUTRALIZED';
        statusSeverity = 'success';

        targetRobotX = standoffBX;
        targetRobotY = standoffBY;
        targetTurretAngle = Math.PI;
        targetWaterPressure = 0;
      }

      const lerpFactor = 1 - Math.exp(-14 * dt);
      const prevX = robotX;
      const prevY = robotY;

      robotX = lerp(robotX, targetRobotX, lerpFactor);
      robotY = lerp(robotY, targetRobotY, lerpFactor);

      robotVelX = robotX - prevX;
      robotVelY = robotY - prevY;
      const robotSpeed = Math.hypot(robotVelX, robotVelY);

      turretAngle = lerpAngle(turretAngle, targetTurretAngle, 1 - Math.exp(-12 * dt));
      waterPressure = lerp(waterPressure, targetWaterPressure, 1 - Math.exp(-10 * dt));

      const totalFireIntensity = (zoneAIntensity + zoneBIntensity) / 2;

      if (now - lastTelemetryTime > 200) {
        lastTelemetryTime = now;
        if (telemetryCallbackRef.current) {
          telemetryCallbackRef.current({
            phase,
            fireIntensity: totalFireIntensity,
            ambientTemp,
            distanceToTarget,
            waterLevel,
            statusText,
            statusSeverity,
            phaseProgress,
            activeFireCount,
            activeZoneText,
          });
        }
      }

      // ── SLEEK DARK GLASSMORPHIC SIMULATION RADAR VIEWPORT ──
      const horizonY = height * 0.40;
      const originX = width * 0.5;

      // Deep Luxury Glass Dark Gradient Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#040814');
      bgGrad.addColorStop(0.4, '#070D1F');
      bgGrad.addColorStop(1, '#0A1228');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle Ambient Cyan Glow Orb in Center
      const glowOrb = ctx.createRadialGradient(width * 0.5, height * 0.5, 50, width * 0.5, height * 0.5, width * 0.45);
      glowOrb.addColorStop(0, 'rgba(0, 229, 255, 0.07)');
      glowOrb.addColorStop(0.6, 'rgba(59, 130, 246, 0.03)');
      glowOrb.addColorStop(1, 'transparent');
      ctx.fillStyle = glowOrb;
      ctx.fillRect(0, 0, width, height);

      // Holographic Floor Radar Plane
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(width, horizonY);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();

      const floorGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      floorGrad.addColorStop(0, 'rgba(11, 19, 43, 0.95)');
      floorGrad.addColorStop(0.5, 'rgba(7, 13, 25, 0.98)');
      floorGrad.addColorStop(1, 'rgba(4, 8, 16, 1)');
      ctx.fillStyle = floorGrad;
      ctx.fill();

      // Perspective Holographic Radial & Longitudinal Grid Lines
      ctx.lineWidth = 1;
      for (let i = 0; i <= 28; i++) {
        const t = i / 28;
        const xFloor = width * (t * 1.6 - 0.3);
        ctx.beginPath();
        ctx.moveTo(originX + (xFloor - originX) * 0.1, horizonY);
        ctx.lineTo(xFloor, height);
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.09)';
        ctx.stroke();
      }

      // Horizontal Distance Range Rings (Concentric Ellipses)
      for (let y = horizonY + 20; y < height; y += (height - horizonY) / 10) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.07)';
        ctx.stroke();
      }

      // Concentric Distance Radar Circles on Floor
      const radarCenterY = height * 0.65;
      for (let r = 80; r <= 500; r += 100) {
        ctx.beginPath();
        ctx.ellipse(width * 0.5, radarCenterY, r * 1.8, r * 0.6, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.06)';
        ctx.lineWidth = 1;
        ctx.setLineDash([6, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.restore();

      // LiDAR Sweep
      const scanAngle = (now / 1300) % (Math.PI * 2);
      ctx.save();
      ctx.translate(robotX, robotY);
      const scanGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 380);
      if (
        phase === 'MULTI_ZONE_FIRE_IGNITION' ||
        phase === 'NAVIGATING_ZONE_A' ||
        phase === 'EXTINGUISHING_ZONE_A' ||
        phase === 'NAVIGATING_ZONE_B' ||
        phase === 'EXTINGUISHING_ZONE_B'
      ) {
        scanGrad.addColorStop(0, 'rgba(255, 46, 46, 0.3)');
        scanGrad.addColorStop(0.5, 'rgba(255, 107, 44, 0.12)');
        scanGrad.addColorStop(1, 'transparent');
      } else {
        scanGrad.addColorStop(0, 'rgba(0, 229, 255, 0.18)');
        scanGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.06)');
        scanGrad.addColorStop(1, 'transparent');
      }
      ctx.fillStyle = scanGrad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 380, scanAngle - 0.45, scanAngle + 0.45);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Holographic Path Lines
      if (
        phase === 'MULTI_ZONE_FIRE_IGNITION' ||
        phase === 'NAVIGATING_ZONE_A' ||
        phase === 'EXTINGUISHING_ZONE_A' ||
        phase === 'NAVIGATING_ZONE_B' ||
        phase === 'EXTINGUISHING_ZONE_B'
      ) {
        ctx.save();
        ctx.setLineDash([8, 8]);
        ctx.lineDashOffset = -(now / 20);
        ctx.lineWidth = 3;

        ctx.strokeStyle = '#00E5FF';
        ctx.shadowColor = '#00E5FF';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(robotHomeX, robotHomeY);
        ctx.lineTo(zoneAX + 80, zoneAY + 40);
        ctx.stroke();

        ctx.strokeStyle = '#FF6B2C';
        ctx.shadowColor = '#FF6B2C';
        ctx.beginPath();
        ctx.moveTo(zoneAX + 80, zoneAY + 40);
        ctx.lineTo(zoneBX + 70, zoneBY + 40);
        ctx.stroke();

        ctx.restore();

        drawZoneMarker(ctx, zoneAX, zoneAY, 'ZONE A-2 (LEFT)', now, '#FF2E2E');
        drawZoneMarker(ctx, zoneBX, zoneBY, 'ZONE B-4 (FAR RIGHT)', now + 800, '#FF6B2C');
      }

      // ── MULTIPLE FIRE HOTSPOTS ──
      const zones = [
        { x: zoneAX, y: zoneAY, intensity: zoneAIntensity },
        { x: zoneBX, y: zoneBY, intensity: zoneBIntensity },
      ];

      for (const zone of zones) {
        if (zone.intensity <= 0) continue;

        ctx.save();
        const fireGlowR = (60 + (zone.intensity / 100) * 140) * (0.92 + Math.random() * 0.16);
        const fireGlow = ctx.createRadialGradient(
          zone.x,
          zone.y,
          10,
          zone.x,
          zone.y,
          fireGlowR
        );
        const alpha = Math.min(1, (zone.intensity / 100) * 0.7);
        fireGlow.addColorStop(0, `rgba(255, 120, 20, ${alpha * 0.85})`);
        fireGlow.addColorStop(0.4, `rgba(255, 46, 46, ${alpha * 0.45})`);
        fireGlow.addColorStop(1, 'transparent');

        ctx.fillStyle = fireGlow;
        ctx.beginPath();
        ctx.ellipse(zone.x, zone.y, fireGlowR * 1.5, fireGlowR * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        const spawnCount = Math.ceil((zone.intensity / 100) * 6);
        for (let i = 0; i < spawnCount; i++) {
          const colors = ['#FF2E2E', '#FF6B2C', '#FF9F1C', '#FFE600', '#FFFFFF'];
          flameParticles.push({
            x: zone.x + randomRange(-18, 18) * (zone.intensity / 100),
            y: zone.y + randomRange(-4, 4),
            vx: randomRange(-0.8, 0.8),
            vy: randomRange(-2.2, -5.2) * (0.6 + (zone.intensity / 100) * 0.6),
            size: randomRange(10, 26) * (zone.intensity / 100),
            life: 0,
            maxLife: randomRange(22, 42),
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }

        if (zone.intensity > 15 && Math.random() < 0.5) {
          smokeParticles.push({
            x: zone.x + randomRange(-14, 14),
            y: zone.y - randomRange(25, 55),
            vx: randomRange(-0.5, 1.2),
            vy: randomRange(-1.2, -2.8),
            size: randomRange(16, 42),
            life: 0,
            maxLife: randomRange(55, 105),
            opacity: randomRange(0.15, 0.35),
          });
        }
      }

      // Render Flame Particles
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = flameParticles.length - 1; i >= 0; i--) {
        const p = flameParticles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.size *= 0.95;

        if (p.life >= p.maxLife || p.size <= 1) {
          flameParticles.splice(i, 1);
          continue;
        }

        const pAlpha = 1 - p.life / p.maxLife;
        ctx.fillStyle = p.color || '#FF6B2C';
        ctx.globalAlpha = pAlpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Render Smoke Particles
      ctx.save();
      for (let i = smokeParticles.length - 1; i >= 0; i--) {
        const s = smokeParticles[i];
        s.life++;
        s.x += s.vx;
        s.y += s.vy;
        s.size += 0.38;

        if (s.life >= s.maxLife) {
          smokeParticles.splice(i, 1);
          continue;
        }

        const sAlpha = (1 - s.life / s.maxLife) * (s.opacity || 0.2);
        const smokeGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size);
        smokeGrad.addColorStop(0, `rgba(40, 45, 60, ${sAlpha})`);
        smokeGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = smokeGrad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // ── WATER CANNON SPRAY ENGINE ──
      if (sprayingTargetX !== null && sprayingTargetY !== null && waterPressure > 0.02) {
        const nozzleX = robotX + Math.cos(turretAngle) * 42;
        const nozzleY = robotY + Math.sin(turretAngle) * 42 - 34;

        const spawnCount = Math.ceil(waterPressure * 14);
        for (let i = 0; i < spawnCount; i++) {
          const dx = sprayingTargetX - nozzleX;
          const dy = sprayingTargetY - nozzleY;
          const dist = Math.hypot(dx, dy);
          const speed = randomRange(16, 22) * waterPressure;

          waterParticles.push({
            x: nozzleX,
            y: nozzleY,
            vx: (dx / dist) * speed + randomRange(-1.0, 1.0),
            vy: (dy / dist) * speed + randomRange(-1.2, 0.8),
            size: randomRange(4, 8) * waterPressure,
            life: 0,
            maxLife: Math.floor(dist / Math.max(1, speed)) + 4,
          });
        }

        for (let m = 0; m < 5; m++) {
          const dx = sprayingTargetX - nozzleX;
          const dy = sprayingTargetY - nozzleY;
          const dist = Math.hypot(dx, dy);
          const speed = randomRange(12, 18) * waterPressure;

          mistParticles.push({
            x: nozzleX + randomRange(-6, 6),
            y: nozzleY + randomRange(-6, 6),
            vx: (dx / dist) * speed + randomRange(-2.5, 2.5),
            vy: (dy / dist) * speed + randomRange(-2.5, 2.5),
            size: randomRange(6, 14) * waterPressure,
            life: 0,
            maxLife: Math.floor(dist / Math.max(1, speed)) + 6,
            opacity: randomRange(0.2, 0.45),
          });
        }

        if (Math.random() < 0.6) {
          splashRipples.push({
            x: sprayingTargetX + randomRange(-12, 12),
            y: sprayingTargetY + randomRange(-4, 4),
            radius: 4,
            maxRadius: randomRange(18, 38),
            opacity: 0.6,
          });
        }

        if (Math.random() < 0.8 * waterPressure) {
          steamParticles.push({
            x: sprayingTargetX + randomRange(-20, 20),
            y: sprayingTargetY - randomRange(5, 20),
            vx: randomRange(-1.5, 1.5),
            vy: randomRange(-1.0, -2.8),
            size: randomRange(20, 55),
            life: 0,
            maxLife: randomRange(45, 90),
            opacity: randomRange(0.25, 0.6),
          });
        }
      }

      // Render Water Droplets Stream
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = waterParticles.length - 1; i >= 0; i--) {
        const w = waterParticles[i];
        w.life++;
        w.x += w.vx;
        w.y += w.vy + 0.08;

        if (w.life >= w.maxLife) {
          waterParticles.splice(i, 1);
          continue;
        }

        const wAlpha = 1 - w.life / w.maxLife;
        ctx.fillStyle = '#00E5FF';
        ctx.shadowColor = '#00E5FF';
        ctx.shadowBlur = 10;
        ctx.globalAlpha = wAlpha * 0.95;
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Render Outer Water Mist Spray
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = mistParticles.length - 1; i >= 0; i--) {
        const m = mistParticles[i];
        m.life++;
        m.x += m.vx;
        m.y += m.vy;
        m.size += 0.3;

        if (m.life >= m.maxLife) {
          mistParticles.splice(i, 1);
          continue;
        }

        const mAlpha = (1 - m.life / m.maxLife) * (m.opacity || 0.3);
        const mistGrad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.size);
        mistGrad.addColorStop(0, `rgba(180, 240, 255, ${mAlpha})`);
        mistGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = mistGrad;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Render Floor Splash Ripples
      ctx.save();
      for (let i = splashRipples.length - 1; i >= 0; i--) {
        const r = splashRipples[i];
        r.radius += 0.8;
        r.opacity *= 0.94;

        if (r.radius >= r.maxRadius || r.opacity <= 0.02) {
          splashRipples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.ellipse(r.x, r.y, r.radius * 1.5, r.radius * 0.75, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 229, 255, ${r.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.restore();

      // Render Steam Vapor Clouds
      ctx.save();
      for (let i = steamParticles.length - 1; i >= 0; i--) {
        const st = steamParticles[i];
        st.life++;
        st.x += st.vx;
        st.y += st.vy;
        st.size += 0.55;

        if (st.life >= st.maxLife) {
          steamParticles.splice(i, 1);
          continue;
        }

        const stAlpha = (1 - st.life / st.maxLife) * (st.opacity || 0.3);
        const steamGrad = ctx.createRadialGradient(st.x, st.y, 0, st.x, st.y, st.size);
        steamGrad.addColorStop(0, `rgba(225, 245, 255, ${stAlpha})`);
        steamGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = steamGrad;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // RENDER FIREBOT SENTINEL X-1
      drawModernFireBotSentinelX1(
        ctx,
        robotX,
        robotY,
        turretAngle,
        robotSpeed,
        waterPressure,
        phase,
        now
      );

      // Vignette Overlay
      ctx.save();
      const vignette = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        height * 0.35,
        width * 0.5,
        height * 0.5,
        width * 0.75
      );
      vignette.addColorStop(0, 'transparent');
      vignette.addColorStop(1, 'rgba(15, 23, 42, 0.12)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [currentEnv, paused, speedMultiplier]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ display: 'block' }}
    />
  );
}

// ── Helpers ──

function drawZoneMarker(
  ctx: CanvasRenderingContext2D,
  zx: number,
  zy: number,
  label: string,
  now: number,
  color: string
) {
  ctx.save();
  ctx.translate(zx, zy);
  const pulseR = 32 + Math.sin(now / 180) * 6;

  // Outer Glowing Hazard Target Ring
  ctx.beginPath();
  ctx.ellipse(0, 0, pulseR * 1.5, pulseR * 0.75, 0, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.shadowColor = color;
  ctx.shadowBlur = 16;
  ctx.stroke();

  // Inner Concentric Target Crosshair
  ctx.beginPath();
  ctx.ellipse(0, 0, 12, 6, 0, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  // Crosshair Lines
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-pulseR * 1.6, 0); ctx.lineTo(-18, 0);
  ctx.moveTo(18, 0); ctx.lineTo(pulseR * 1.6, 0);
  ctx.moveTo(0, -pulseR * 0.8); ctx.lineTo(0, -10);
  ctx.moveTo(0, 10); ctx.lineTo(0, pulseR * 0.8);
  ctx.stroke();

  // Sleek Dark Glass Badge for Zone Label
  const labelY = -pulseR * 0.75 - 22;
  ctx.fillStyle = 'rgba(11, 19, 43, 0.95)';
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.roundRect(-70, labelY, 140, 24, 8);
  ctx.fill();
  ctx.stroke();

  // Status Indicator Dot
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(-55, labelY + 12, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 11px Inter, system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(label, 6, labelY + 16);
  ctx.restore();
}

/**
 * Photorealistic CAD-Quality Architecture Renderer:
 * 1. 'library' = High-End Academic Library (Rich Dark Walnut Shelving, Detailed Book Spines, LED Shelf Strip Lights, Brass Lamp)
 * 2. 'laboratory' = High-Tech Science Cleanroom (Stainless Steel Fume Hood, Translucent Glass Sash, Digital Oscilloscope, Flasks)
 * 3. 'campus' = Modern Glass Atrium & Quad (Architectural Steel Trusses, Marble Reflection, Landscaped Courtyard View)
 * 4. 'warehouse' = High-Bay Industrial Facility (Steel Pallet Racks, Chemical Storage Drums, High-Bay LED Beams)
 */
function drawSpecificLocationArchitecture(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  horizonY: number,
  env: EnvironmentType
) {
  // Clean Glassmorphic HUD Nodes (No cartoon illustrations)
  ctx.save();
  const envNames: Record<EnvironmentType, string> = {
    library: 'ZONE 01 • ACADEMIC LIBRARY SECTOR',
    laboratory: 'ZONE 02 • HIGH-TECH RESEARCH LAB',
    campus: 'ZONE 03 • MAIN CAMPUS ATRIUM',
    warehouse: 'ZONE 04 • INDUSTRIAL FACILITY',
  };

  // Environment Glass Pill Marker
  const labelX = width * 0.05;
  const labelY = horizonY - 40;

  ctx.fillStyle = 'rgba(11, 19, 43, 0.75)';
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(labelX, labelY, 260, 28, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#00E5FF';
  ctx.beginPath();
  ctx.arc(labelX + 16, labelY + 14, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#E2E8F0';
  ctx.font = '600 11px Inter, system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(envNames[env] || envNames.library, labelX + 30, labelY + 18);

  ctx.restore();
}

/**
 * High-Tech Photorealistic FireBot Sentinel X-1 Autonomous Robot (CAD/AMR Chassis)
 */
function drawModernFireBotSentinelX1(
  ctx: CanvasRenderingContext2D,
  rx: number,
  ry: number,
  turretAngle: number,
  speed: number,
  waterPressure: number,
  phase: SimulationPhase,
  now: number
) {
  ctx.save();

  const bob = speed > 0.05 ? Math.sin(now / 90) * 1.5 : 0;
  ctx.translate(rx, ry + bob);

  // Soft Ambient Occlusion Floor Shadow
  ctx.beginPath();
  ctx.ellipse(0, 26, 84, 26, 0, 0, Math.PI * 2);
  const shadowGrad = ctx.createRadialGradient(0, 26, 10, 0, 26, 84);
  shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
  shadowGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.45)');
  shadowGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = shadowGrad;
  ctx.fill();

  // Forward LiDAR & LED Spotlights Beam
  ctx.save();
  const headlightGrad = ctx.createRadialGradient(-40, 0, 10, -320, 0, 320);
  headlightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
  headlightGrad.addColorStop(0.4, 'rgba(56, 189, 248, 0.18)');
  headlightGrad.addColorStop(1, 'transparent');

  ctx.fillStyle = headlightGrad;
  ctx.beginPath();
  ctx.moveTo(-36, -10);
  ctx.lineTo(-320, -110);
  ctx.lineTo(-320, 110);
  ctx.lineTo(-36, 10);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Industrial Heavy-Duty Continuous Treads & Alloy Rim Wheels
  ctx.fillStyle = '#090D16';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.fillRect(-72, 6, 144, 26);
  ctx.strokeRect(-72, 6, 144, 26);

  const wheelSpin = (now / 35) % (Math.PI * 2);
  for (let wx = -54; wx <= 54; wx += 27) {
    // Alloy Rim Outer Ring
    ctx.beginPath();
    ctx.arc(wx, 19, 9, 0, Math.PI * 2);
    ctx.fillStyle = '#1E293B';
    ctx.fill();
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Metallic Spoke Details
    ctx.save();
    ctx.translate(wx, 19);
    ctx.rotate(speed > 0.05 ? wheelSpin : 0);
    ctx.beginPath();
    ctx.moveTo(-6, 0); ctx.lineTo(6, 0);
    ctx.moveTo(0, -6); ctx.lineTo(0, 6);
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();
  }

  // Tread Grooves
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1.5;
  const treadShift = speed > 0.05 ? (now / 25) % 12 : 0;
  for (let gx = -68 + treadShift; gx <= 68; gx += 12) {
    if (gx >= -70 && gx <= 70) {
      ctx.beginPath();
      ctx.moveTo(gx, 6);
      ctx.lineTo(gx, 32);
      ctx.stroke();
    }
  }

  // Matte Carbon Fiber Titanium Body Chassis
  const hullGrad = ctx.createLinearGradient(-56, -46, 56, 10);
  hullGrad.addColorStop(0, '#334155');
  hullGrad.addColorStop(0.25, '#1E293B');
  hullGrad.addColorStop(0.7, '#0F172A');
  hullGrad.addColorStop(1, '#070C18');

  ctx.fillStyle = hullGrad;
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(-58, 6);
  ctx.lineTo(-46, -42);
  ctx.lineTo(46, -42);
  ctx.lineTo(58, 6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Cyan Neon Telemetry Edge Light
  ctx.fillStyle = '#38BDF8';
  ctx.shadowColor = '#38BDF8';
  ctx.shadowBlur = 10;
  ctx.fillRect(-40, -22, 80, 3.5);

  ctx.fillStyle = '#0EA5E9';
  ctx.fillRect(-28, -14, 56, 2.5);
  ctx.shadowBlur = 0;

  // Turret Base & Dual Water Nozzles
  ctx.save();
  ctx.translate(0, -36);

  ctx.fillStyle = '#1E293B';
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.rotate(turretAngle);

  const recoilOffset = waterPressure > 0.1 ? Math.sin(now / 30) * 2 : 0;

  // Brass Nozzle Barrels
  ctx.fillStyle = '#B45309';
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 1.4;

  ctx.fillRect(-recoilOffset, -10, 42, 7);
  ctx.strokeRect(-recoilOffset, -10, 42, 7);

  ctx.fillRect(-recoilOffset, 3, 42, 7);
  ctx.strokeRect(-recoilOffset, 3, 42, 7);

  const isSpraying = waterPressure > 0.05;
  ctx.fillStyle = isSpraying ? '#38BDF8' : '#0284C7';
  ctx.shadowColor = '#38BDF8';
  ctx.shadowBlur = isSpraying ? 22 : 8;
  ctx.fillRect(42 - recoilOffset, -10, 6, 7);
  ctx.fillRect(42 - recoilOffset, 3, 6, 7);
  ctx.shadowBlur = 0;

  ctx.restore();

  // Top LiDAR Dome & Strobe Beacon
  ctx.save();
  ctx.translate(0, -46);

  ctx.fillStyle = '#0F172A';
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, 15, Math.PI, 0);
  ctx.fill();
  ctx.stroke();

  const isEmergency =
    phase === 'MULTI_ZONE_FIRE_IGNITION' ||
    phase === 'NAVIGATING_ZONE_A' ||
    phase === 'EXTINGUISHING_ZONE_A' ||
    phase === 'NAVIGATING_ZONE_B' ||
    phase === 'EXTINGUISHING_ZONE_B';
  const strobeFlash = isEmergency ? Math.sin(now / 70) > 0 : false;
  const beaconColor = isEmergency
    ? strobeFlash
      ? '#EF4444'
      : '#991B1B'
    : phase === 'ALL_ZONES_NEUTRALIZED'
    ? '#22C55E'
    : '#38BDF8';

  ctx.fillStyle = beaconColor;
  ctx.shadowColor = beaconColor;
  ctx.shadowBlur = isEmergency && strobeFlash ? 28 : 12;
  ctx.beginPath();
  ctx.arc(0, -8, 7.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Ultra-Clean Dark Glass Robot Name Badge
  ctx.fillStyle = 'rgba(11, 19, 43, 0.95)';
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(-78, -36, 156, 22, 7);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 11px Inter, system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('FIREBOT SENTINEL X-1', 0, -21);

  ctx.restore();
  ctx.restore();
}
