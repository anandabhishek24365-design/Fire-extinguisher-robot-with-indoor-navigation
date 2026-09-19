import { useState, useEffect } from 'react';
import {
  Zap,
  Wifi,
  Shield,
  Flame,
  ArrowRight,
} from 'lucide-react';
import logoSrc from '../assets/logo.png';
import RisingEmbersCanvas from '../components/RisingEmbersCanvas';

interface LoginProps {
  onLogin: () => void;
}

function useTransparentLogo(src: string) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const sourceCanvas = document.createElement('canvas');
      sourceCanvas.width = img.width;
      sourceCanvas.height = img.height;
      const sourceCtx = sourceCanvas.getContext('2d');

      if (!sourceCtx) {
        setDataUrl(src);
        return;
      }

      sourceCtx.drawImage(img, 0, 0);
      const imageData = sourceCtx.getImageData(
        0,
        0,
        sourceCanvas.width,
        sourceCanvas.height
      );
      const pixels = imageData.data;
      const width = sourceCanvas.width;
      const height = sourceCanvas.height;

      const visited = new Uint8Array(width * height);
      const queue: number[] = [];

      function isWhite(idx: number) {
        const r = pixels[idx];
        const g = pixels[idx + 1];
        const b = pixels[idx + 2];
        const a = pixels[idx + 3];
        return a === 0 || (r > 230 && g > 230 && b > 230);
      }

      for (let x = 0; x < width; x++) {
        const topIdx = (0 * width + x) * 4;
        const botIdx = ((height - 1) * width + x) * 4;
        if (isWhite(topIdx) && !visited[0 * width + x]) {
          visited[0 * width + x] = 1;
          queue.push(x, 0);
        }
        if (isWhite(botIdx) && !visited[(height - 1) * width + x]) {
          visited[(height - 1) * width + x] = 1;
          queue.push(x, height - 1);
        }
      }
      for (let y = 0; y < height; y++) {
        const leftIdx = (y * width + 0) * 4;
        const rightIdx = (y * width + (width - 1)) * 4;
        if (isWhite(leftIdx) && !visited[y * width + 0]) {
          visited[y * width + 0] = 1;
          queue.push(0, y);
        }
        if (isWhite(rightIdx) && !visited[(height - 1) * width + (width - 1)]) {
          visited[(height - 1) * width + (width - 1)] = 1;
          queue.push(width - 1, y);
        }
      }

      let qHead = 0;
      while (qHead < queue.length) {
        const cx = queue[qHead++];
        const cy = queue[qHead++];
        const pixIdx = (cy * width + cx) * 4;
        pixels[pixIdx + 3] = 0;

        const neighbors = [
          [cx + 1, cy],
          [cx - 1, cy],
          [cx, cy + 1],
          [cx, cy - 1],
        ];

        for (const [nx, ny] of neighbors) {
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const vIdx = ny * width + nx;
            if (!visited[vIdx]) {
              visited[vIdx] = 1;
              const nPixIdx = vIdx * 4;
              if (isWhite(nPixIdx)) {
                queue.push(nx, ny);
              }
            }
          }
        }
      }

      sourceCtx.putImageData(imageData, 0, 0);

      let minX = width,
        minY = height,
        maxX = -1,
        maxY = -1;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const a = pixels[(y * width + x) * 4 + 3];
          if (a > 0) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      if (maxX < 0 || maxY < 0) {
        setDataUrl(src);
        return;
      }

      const padding = 6;
      const cropX = Math.max(0, minX - padding);
      const cropY = Math.max(0, minY - padding);
      const cropWidth = Math.min(width - cropX, maxX - cropX + padding * 2 + 1);
      const cropHeight = Math.min(height - cropY, maxY - cropY + padding * 2 + 1);

      const outputCanvas = document.createElement('canvas');
      outputCanvas.width = cropWidth;
      outputCanvas.height = cropHeight;
      const outputCtx = outputCanvas.getContext('2d');

      if (!outputCtx) {
        setDataUrl(src);
        return;
      }

      outputCtx.drawImage(
        sourceCanvas,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      setDataUrl(outputCanvas.toDataURL('image/png'));
    };

    img.src = src;
  }, [src]);

  return dataUrl;
}

export default function Login({ onLogin }: LoginProps) {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const logoDataUrl = useTransparentLogo(logoSrc);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  function handleDirectLogin() {
    setLoading(true);
    setTimeout(onLogin, 350);
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#050814] text-slate-100 font-sans select-none">
      {/* ── 1. Rising Flame Embers Canvas Background (Dark Fire Lifting Bottom to Top) ── */}
      <RisingEmbersCanvas />

      {/* ── 2. Top Glass Header Bar ── */}
      <header className="relative z-10 w-full p-4 md:px-8 flex items-center justify-between gap-4 backdrop-blur-2xl bg-[#070D19]/80 border-b border-white/10 shadow-xl shadow-black/50">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 p-0.5 shadow-md shadow-orange-500/20 flex items-center justify-center">
            <div className="w-full h-full rounded-[10px] bg-[#070D19] flex items-center justify-center">
              <Flame size={18} className="text-orange-400 fill-orange-400/30" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-sm tracking-tight drop-shadow-sm">
                FIREBOT SENTINEL
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[9px] font-extrabold tracking-wider uppercase border border-blue-400/30">
                PRO X-1
              </span>
            </div>
            <p className="text-[10px] font-semibold text-slate-400">
              Autonomous Fire Response & Command Center
            </p>
          </div>
        </div>

        {/* System Online Badge */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Wifi size={13} className="text-emerald-400" />
            <span>SYSTEM ONLINE</span>
          </div>
        </div>
      </header>

      {/* ── 3. Center Glassmorphism Card ── */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto p-4 flex items-center justify-center">
        <div
          className={`w-full max-w-md relative p-8 md:p-10 rounded-3xl backdrop-blur-3xl bg-[#0B132B]/85 border border-white/20 shadow-2xl shadow-black/80 flex flex-col items-center text-center transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
          }`}
        >
          {/* Top Neon Line */}
          <div className="absolute top-0 left-12 right-12 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-blue-500 rounded-b-md shadow-sm shadow-cyan-400" />

          {/* Logo */}
          <div className="mb-4 animate-robot-bob">
            {logoDataUrl ? (
              <img
                src={logoDataUrl}
                alt="FireBot Control Center"
                className="w-56 md:w-64 h-auto object-contain drop-shadow-[0_0_35px_rgba(0,229,255,0.35)]"
              />
            ) : (
              <div className="w-56 h-36 rounded-2xl bg-white/5 animate-pulse" />
            )}
          </div>

          <h1 className="text-xl font-extrabold tracking-tight text-white mb-1 uppercase font-sans bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
            FIREBOT CONTROL CENTER
          </h1>
          <p className="text-xs text-slate-300 font-medium mb-8 max-w-xs">
            Autonomous Fire Fighting Robot & Real-Time IoT Safety Telemetry
          </p>

          <div className="flex items-center gap-3 mb-8">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ThingSpeak Live
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <Shield size={12} /> System Nominal
            </span>
          </div>

          {/* SINGLE DIRECT LOGIN BUTTON */}
          <button
            onClick={handleDirectLogin}
            disabled={loading}
            className="w-full py-4 px-8 rounded-2xl font-bold text-slate-950 text-base bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-3 cursor-pointer group"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Redirecting to Dashboard...
              </>
            ) : (
              <>
                <Zap size={20} className="fill-slate-950" />
                ENTER DASHBOARD
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>

          <div className="mt-8 pt-4 border-t border-white/10 w-full flex items-center justify-between text-[11px] font-sans text-slate-400 font-semibold">
            <span className="flex items-center gap-1">
              <Wifi size={12} className="text-emerald-400" /> IoT Safety Network
            </span>
            <span>Fire Monitoring System</span>
          </div>
        </div>
      </main>

      {/* ── 4. Bottom Footer Bar ── */}
      <footer className="relative z-10 w-full p-3 px-8 text-center text-xs text-slate-400 backdrop-blur-md bg-[#070B14]/30 border-t border-white/10 font-mono flex items-center justify-between">
        <span>FireBot Sentinel Autonomous System</span>
        <span className="hidden sm:inline">Continuous Multi-Zone Fire Incident Simulation</span>
      </footer>
    </div>
  );
}
