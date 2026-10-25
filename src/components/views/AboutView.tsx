import { Bot, Cpu, ShieldCheck, Flame, Radio, Waves, Zap, Code, Wrench, Palette, BookOpen, Rocket, AlertTriangle, MapPin, Gauge, Bell, CheckCircle2, ShieldAlert } from 'lucide-react';
import TeamView from './TeamView';

export default function AboutView() {
  const specs = [
    { label: 'Project Manager', value: 'Gunjan Jangir', icon: <ShieldCheck size={18} className="text-blue-600" /> },
    { label: 'Pseudocode & Learning Tech Lead', value: 'Manan Agrawal', icon: <BookOpen size={18} className="text-indigo-600" /> },
    { label: 'Code Developer', value: 'Archit Gupta', icon: <Code size={18} className="text-purple-600" /> },
    { label: 'UI/UX Designers', value: 'Abhishek Anand & Abhinav Dahiya', icon: <Palette size={18} className="text-emerald-600" /> },
    { label: 'Software Deployer & Learning Tech Lead', value: 'Sahajta Singh', icon: <Rocket size={18} className="text-sky-600" /> },
    { label: 'Hardware Integrator', value: 'Daksh Srivastava', icon: <Wrench size={18} className="text-orange-600" /> },
    { label: 'Robot Model', value: 'FireBot Sentinel X-1 Pro', icon: <Bot size={18} className="text-blue-600" /> },
    { label: 'Dual Microcontrollers', value: 'Arduino UNO R3 + ESP32-CAM', icon: <Cpu size={18} className="text-indigo-600" /> },
    { label: 'IoT Communication', value: 'Wi-Fi 802.11b/g/n + ThingSpeak API', icon: <Radio size={18} className="text-emerald-600" /> },
    { label: 'Suppression Payload', value: 'High-Pressure 12V Submersible Water Cannon', icon: <Waves size={18} className="text-sky-600" /> },
    { label: 'Sensors Array', value: 'IR Flame, MQ-2 Gas, HC-SR04, DHT11, NEO-6M GPS', icon: <Flame size={18} className="text-orange-600" /> },
    { label: 'Power System', value: '12.4V 4S LiFePO4 Array (BMS Protected)', icon: <Zap size={18} className="text-amber-600" /> },
  ];

  const prototypeMetrics = [
    { label: 'Flame Alert Range', value: '~50 cm – 1 m', icon: <Flame size={16} className="text-orange-500" /> },
    { label: 'Obstacle Detection', value: '~20 cm', icon: <Gauge size={16} className="text-blue-500" /> },
    { label: 'Cloud Update Latency', value: '~15 seconds', icon: <Radio size={16} className="text-emerald-500" /> },
    { label: 'Outdoor GPS Accuracy', value: '~5 m', icon: <MapPin size={16} className="text-purple-500" /> },
  ];

  const dashboardFeatures = [
    'Live monitoring of flame status, temperature, humidity, gas levels, and distance readings.',
    'Remote access to sensor data through a ThingSpeak-based cloud dashboard.',
    'Immediate local alerts through buzzer and OLED display during hazardous conditions.',
    'Automatic water-pump activation for an initial response to detected fire.',
    'Indoor obstacle avoidance and outdoor GPS-based location support.',
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-[1700px] mx-auto p-4 md:p-6">
      {/* Header Banner */}
      <div className="glass-card-light p-6 md:p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Flame size={28} />
          </div>
          <div>
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase tracking-wider">
              Dashboard About Section
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              About the Fire Safety Robot
            </h1>
          </div>
        </div>

        {/* Detailed System Narrative */}
        <div className="flex flex-col gap-4 text-slate-700 dark:text-slate-300 font-medium text-xs md:text-sm leading-relaxed max-w-5xl">
          <p className="text-slate-800 dark:text-slate-100 font-semibold text-sm md:text-base leading-snug">
            The Fire Safety Robot is an IoT-based mobile safety and monitoring system designed for both indoor and outdoor environments. It combines fire detection, gas-leak monitoring, environmental sensing, obstacle avoidance, live location tracking, automated emergency response, and cloud-based data visualization in one robotic platform.
          </p>

          <p>
            An <strong>Arduino UNO R3</strong> acts as the main controller, collecting and processing data from multiple sensors. The <strong>IR flame sensor</strong> detects the presence of flames, while the <strong>MQ-2 gas sensor</strong> monitors combustible gases and possible gas leakage. The <strong>DHT11 sensor</strong> measures temperature and humidity to identify environmental changes associated with increased fire risk. An <strong>HC-SR04 ultrasonic sensor</strong> detects nearby obstacles, allowing the robot to redirect safely during movement. For outdoor operation, a <strong>NEO-6M GPS module</strong> provides location information to help identify the area where a hazard is detected.
          </p>

          <p>
            When a fire or hazardous condition is identified, the system activates immediate local alerts through a <strong>buzzer and OLED display</strong>. It can also switch on a <strong>water pump</strong> to support an initial response. A <strong>motor driver</strong> controls the DC motors, enabling the robot to patrol an area and avoid obstacles rather than remaining fixed in one location like a conventional fire alarm.
          </p>

          <p>
            For remote monitoring, the <strong>ESP32</strong> receives processed sensor data from the Arduino through serial communication, connects to a 2.4 GHz Wi-Fi network, and uploads important readings to <strong>ThingSpeak</strong>. The dashboard presents fire status, temperature, humidity, gas-level information, and obstacle-distance data in near real time, allowing users to monitor conditions and respond remotely.
          </p>

          <p className="bg-slate-50 dark:bg-[#182132] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
            The prototype demonstrated flame-alert operation at approximately <strong>50 cm to 1 m</strong>, obstacle detection at around <strong>20 cm</strong>, cloud updates with approximately <strong>15 seconds of latency</strong>, and outdoor GPS accuracy of approximately <strong>5 m</strong>. It is a low-cost proof-of-concept suitable for safety monitoring in homes, laboratories, warehouses, industrial facilities, and similar settings where early detection and rapid response can help reduce fire-related risks.
          </p>
        </div>
      </div>

      {/* Grid: Key Features & Prototype Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Key Dashboard Features */}
        <div className="lg:col-span-7 glass-card-light p-6 md:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                <ShieldAlert size={20} />
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Key Dashboard Features
              </h2>
            </div>

            <ul className="flex flex-col gap-3 text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">
              {dashboardFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-slate-50/80 dark:bg-[#182132]/70 p-3 rounded-xl border border-slate-200/70 dark:border-slate-800">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Prototype Performance Metrics */}
        <div className="lg:col-span-5 glass-card-light p-6 md:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                <Gauge size={20} />
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Prototype Performance Specs
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {prototypeMetrics.map((m, idx) => (
                <div key={idx} className="glass-card-sm-light p-3.5 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                    {m.icon}
                    <span className="text-[10px] font-extrabold uppercase tracking-wider block">
                      {m.label}
                    </span>
                  </div>
                  <span className="text-base font-black text-slate-900 dark:text-white">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Specifications & Team Roster Grid */}
      <div className="glass-card-light p-6 md:p-7">
        <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-4 flex items-center gap-2">
          <Cpu size={20} className="text-blue-600 dark:text-cyan-400" />
          System Specifications & Team Roles
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {specs.map(s => (
            <div key={s.label} className="glass-card-sm-light p-3.5 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-[#182132] border border-slate-200 dark:border-slate-800 shrink-0">
                {s.icon}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block truncate">
                  {s.label}
                </span>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white mt-0.5 block truncate">
                  {s.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Embedded Project Team & Engineering Roster */}
      <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800">
        <TeamView />
      </div>
    </div>
  );
}
