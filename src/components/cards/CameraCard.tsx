import { useState } from 'react';
import { Maximize2, Camera, Video, X } from 'lucide-react';

interface Props { emergency: boolean; }

export default function CameraCard({ emergency }: Props) {
  const [fullscreen, setFullscreen] = useState(false);
  const [cameraOnline] = useState(true);

  const feed = (
    <div className="relative w-full h-full" style={{ background: '#050810' }}>
      {cameraOnline ? (
        <>
          {/* Simulated camera feed */}
          <div className="absolute inset-0 flex items-center justify-center">
            <CameraFeedSim emergency={emergency} />
          </div>
          {/* Fire detection overlay */}
          {emergency && (
            <div
              className="absolute animate-pulse-slow"
              style={{
                top: '25%', left: '45%',
                width: 80, height: 70,
                border: '2px solid #FF2E2E',
                borderRadius: 4,
              }}
            >
              <div
                className="absolute -top-5 left-0 text-xs px-1 rounded"
                style={{ background: '#FF2E2E', color: 'white', fontSize: 8, fontFamily: 'JetBrains Mono', whiteSpace: 'nowrap' }}
              >
                FIRE DETECTED
              </div>
            </div>
          )}
          {/* Scanline effect */}
          <div
            className="absolute inset-0 pointer-events-none animate-scan-line"
            style={{
              background: 'linear-gradient(transparent 50%, rgba(0,229,255,0.02) 50%)',
              backgroundSize: '100% 3px',
            }}
          />
          {/* Timestamp */}
          <div
            className="absolute bottom-2 left-2 text-xs"
            style={{ color: 'rgba(0,229,255,0.7)', fontFamily: 'JetBrains Mono' }}
          >
            {new Date().toLocaleTimeString('en-US', { hour12: false })}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <Camera size={32} style={{ color: 'rgba(240,246,255,0.15)' }} />
          <span className="text-sm" style={{ color: 'rgba(240,246,255,0.3)' }}>Camera Offline</span>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="glass h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2.5 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2">
            <Video size={14} style={{ color: cameraOnline ? '#22C55E' : 'rgba(240,246,255,0.3)' }} />
            <span className="text-sm font-semibold" style={{ color: '#F0F6FF' }}>Live Camera</span>
            {cameraOnline && (
              <span className="flex items-center gap-1 text-xs" style={{ color: '#FF2E2E' }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse-slow" style={{ background: '#FF2E2E' }} />
                LIVE
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              className="btn-glass p-1.5 text-xs"
              style={{ borderRadius: 6, color: 'rgba(240,246,255,0.5)' }}
              title="Snapshot"
            >
              <Camera size={12} />
            </button>
            <button
              className="btn-glass p-1.5 text-xs"
              onClick={() => setFullscreen(true)}
              style={{ borderRadius: 6, color: 'rgba(240,246,255,0.5)' }}
              title="Fullscreen"
            >
              <Maximize2 size={12} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
          {feed}
        </div>
        <div className="px-3 py-1.5 text-xs flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ color: 'rgba(240,246,255,0.3)', fontFamily: 'JetBrains Mono' }}>ESP32-CAM</span>
          {emergency && (
            <span className="text-xs animate-pulse-slow" style={{ color: '#FF6B2C', fontFamily: 'JetBrains Mono' }}>
              AI Detection: Enabled
            </span>
          )}
        </div>
      </div>

      {/* Fullscreen modal */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)' }}
        >
          <div className="relative w-full max-w-4xl aspect-video">
            <button
              onClick={() => setFullscreen(false)}
              className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-lg"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#F0F6FF', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
            <div className="w-full h-full rounded-2xl overflow-hidden">
              {feed}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function CameraFeedSim({ emergency }: { emergency: boolean }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="camGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={emergency ? 'rgba(80,20,10,0.8)' : 'rgba(10,20,40,0.8)'}/>
          <stop offset="100%" stopColor="rgba(5,8,16,1)"/>
        </radialGradient>
        <pattern id="camGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke={emergency ? 'rgba(255,60,0,0.08)' : 'rgba(0,200,255,0.06)'} strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="320" height="200" fill="url(#camGrad)"/>
      <rect width="320" height="200" fill="url(#camGrid)"/>

      {/* Room outline */}
      <rect x="30" y="20" width="260" height="160" rx="3" fill="none" stroke={emergency ? 'rgba(255,80,0,0.15)' : 'rgba(0,229,255,0.1)'} strokeWidth="1"/>
      {/* Floor line */}
      <line x1="30" y1="160" x2="290" y2="160" stroke={emergency ? 'rgba(255,80,0,0.12)' : 'rgba(0,229,255,0.08)'} strokeWidth="1"/>
      {/* Wall features */}
      <rect x="50" y="60" width="40" height="60" rx="2" fill="none" stroke={emergency ? 'rgba(255,80,0,0.12)' : 'rgba(0,229,255,0.08)'} strokeWidth="1"/>
      <rect x="230" y="80" width="30" height="50" rx="2" fill="none" stroke={emergency ? 'rgba(255,80,0,0.12)' : 'rgba(0,229,255,0.08)'} strokeWidth="1"/>

      {/* Fire visual */}
      {emergency && (
        <>
          <ellipse cx="185" cy="155" rx="20" ry="8" fill="rgba(255,100,0,0.15)"/>
          <path d="M 178 155 Q 182 130 185 140 Q 188 120 192 155 Z" fill="rgba(255,100,0,0.4)"/>
          <path d="M 180 155 Q 184 135 185 145 Q 187 125 190 155 Z" fill="rgba(255,200,0,0.3)"/>
        </>
      )}

      {/* Robot in frame */}
      <g transform="translate(140, 120)">
        <rect x="-15" y="-10" width="30" height="20" rx="3" fill="none" stroke={emergency ? 'rgba(255,150,0,0.5)' : 'rgba(0,229,255,0.4)'} strokeWidth="1.5"/>
        <circle cx="0" cy="0" r="4" fill="none" stroke={emergency ? 'rgba(255,150,0,0.6)' : 'rgba(0,229,255,0.5)'} strokeWidth="1"/>
        <rect x="-15" y="10" width="30" height="8" rx="4" fill="none" stroke={emergency ? 'rgba(255,150,0,0.3)' : 'rgba(0,229,255,0.25)'} strokeWidth="1"/>
      </g>

      {/* Vignette */}
      <radialGradient id="vig" cx="50%" cy="50%" r="70%">
        <stop offset="60%" stopColor="transparent"/>
        <stop offset="100%" stopColor="rgba(0,0,0,0.6)"/>
      </radialGradient>
      <rect width="320" height="200" fill="url(#vig)"/>
    </svg>
  );
}
