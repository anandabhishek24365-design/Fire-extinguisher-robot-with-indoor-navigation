import { useState } from 'react';
import { Settings, Save, Wifi, Sliders, BellRing, ShieldCheck, Check } from 'lucide-react';
import { THRESHOLDS } from '../../data/mockData';

export default function SettingsView() {
  const [channelId, setChannelId] = useState('2768924');
  const [apiKey, setApiKey] = useState('WXYZ12349087');
  const [refreshInterval, setRefreshInterval] = useState('15');
  const [tempThreshold, setTempThreshold] = useState(THRESHOLDS.temperatureHigh);
  const [gasThreshold, setGasThreshold] = useState(THRESHOLDS.gasDanger);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-[1700px] mx-auto p-4 md:p-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            System Preferences & IoT Settings
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Configure ThingSpeak API credentials, sensor alert thresholds, and autonomous behavior limits
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          {saved ? <Check size={16} /> : <Save size={16} />}
          {saved ? 'Changes Saved!' : 'Save Configurations'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* IoT ThingSpeak API Config */}
        <div className="md:col-span-6 glass-card-light p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
            <div className="p-3 rounded-2xl bg-blue-100 border border-blue-200 text-blue-600">
              <Wifi size={20} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                ThingSpeak IoT Gateway Credentials
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                HTTP REST API channel integration parameters
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-extrabold text-slate-700 uppercase">
                ThingSpeak Channel ID
              </label>
              <input
                type="text"
                value={channelId}
                onChange={e => setChannelId(e.target.value)}
                className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-700 uppercase">
                Read API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-700 uppercase">
                Poll Interval (Seconds)
              </label>
              <select
                value={refreshInterval}
                onChange={e => setRefreshInterval(e.target.value)}
                className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
              >
                <option value="5">5 seconds (High Frequency)</option>
                <option value="15">15 seconds (Standard ThingSpeak Free Limit)</option>
                <option value="30">30 seconds</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sensor Alert Thresholds */}
        <div className="md:col-span-6 glass-card-light p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
            <div className="p-3 rounded-2xl bg-amber-100 border border-amber-200 text-amber-600">
              <Sliders size={20} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Safety & Fire Alert Thresholds
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                Automatic emergency trigger thresholds
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <div className="flex justify-between text-xs font-extrabold text-slate-800 mb-1">
                <span>Temperature Alarm High Threshold:</span>
                <span className="text-orange-600 font-mono">{tempThreshold}°C</span>
              </div>
              <input
                type="range"
                min="30"
                max="80"
                value={tempThreshold}
                onChange={e => setTempThreshold(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-extrabold text-slate-800 mb-1">
                <span>Gas Danger Threshold (MQ-2):</span>
                <span className="text-red-600 font-mono">{gasThreshold} ppm</span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={gasThreshold}
                onChange={e => setGasThreshold(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
