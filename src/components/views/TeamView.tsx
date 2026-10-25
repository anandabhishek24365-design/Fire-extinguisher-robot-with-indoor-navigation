import { Users, Shield, Code, Cpu, Target, CheckCircle2, Briefcase, MapPin, Palette, Terminal, FileCode, GitBranch, Layout, Layers, Wrench, Activity, Rocket, BookOpen, Layers3 } from 'lucide-react';
import gunjanPhoto from '../../assets/gunjan-jangir.jpg';
import abhishekPhoto from '../../assets/abhishek-anand.jpg';
import architPhoto from '../../assets/archit-gupta.jpg';
import dakshPhoto from '../../assets/daksh-srivastava.jpg';
import abhinavPhoto from '../../assets/abhinav-dahiya.jpg';
import sahajtaPhoto from '../../assets/sahajta-singh.jpg';

export default function TeamView() {
  const projectManager = {
    name: 'Gunjan Jangir',
    role: 'Project Manager',
    badge: 'Project Manager',
    bio: 'Oversees end-to-end project execution, team coordination, systems integration milestones, and deployment of the FireBot Autonomous Fire Extinguisher System.',
    photo: gunjanPhoto,
    specialty: 'Strategic Project Management, Robotics Systems Integration & Agile Engineering Delivery',
    location: 'FireBot Autonomous Command Lab',
  };

  const codeDeveloper = {
    name: 'Archit Gupta',
    role: 'Code Developer',
    badge: 'Code Developer',
    bio: 'Leads full-stack software development, real-time telemetry rendering engine, state management logic, and interactive simulation dashboard architecture for FireBot.',
    photo: architPhoto,
    specialty: 'React 19 & Vite Architecture, TypeScript Engine, Real-Time Telemetry & IoT Control Systems',
    location: 'FireBot Software & Algorithms Lab',
  };

  const abhinavDesigner = {
    name: 'Abhinav Dahiya',
    role: 'UI/UX Designer',
    badge: 'UI/UX Designer',
    bio: 'Co-leads user interface architecture, product design system, tele-operation layout usability, visual design tokens, and emergency UX visual hierarchy for the FireBot dashboard.',
    photo: abhinavPhoto,
    specialty: 'Glassmorphic Telemetry, Tele-operation Layouts & Visual UI Design',
    location: 'FireBot UX Research & Design Lab',
  };

  const abhishekDesigner = {
    name: 'Abhishek Anand',
    role: 'UI/UX Designer',
    badge: 'UI/UX Designer',
    bio: 'Leads visual design, glassmorphic telemetry dashboards, tele-operation layout systems, and emergency user experience architecture for the FireBot Control Center.',
    photo: abhishekPhoto,
    specialty: 'Product UX Architecture, Design Systems & Telemetry Visual Hierarchy',
    location: 'FireBot UX Research & Design Lab',
  };

  const sahajtaDeployer = {
    name: 'Sahajta Singh',
    role: 'Software Deployer & Learning Tech Lead',
    badge: 'Software Deployer',
    bio: 'Leads continuous software deployment pipelines, cloud API gateway integration, production build optimization, and educational technology frameworks.',
    photo: sahajtaPhoto,
    specialty: 'CI/CD Pipeline, Cloud REST Gateway & Learning Technology Architecture',
    location: 'FireBot Cloud & Deployment Lab',
  };

  const hardwareIntegrator = {
    name: 'Daksh Srivastava',
    role: 'Hardware Integrator',
    badge: 'Hardware Integrator',
    bio: 'Leads physical circuit integration, microcontroller bus wiring, sensor array calibration, power regulation systems, and actuator control interfaces for FireBot.',
    photo: dakshPhoto,
    specialty: 'ESP32 & Arduino Hardware Wiring, Motor Drivers, BMS Power Systems & Relays',
    location: 'FireBot Hardware Integration Lab',
  };

  const teamRoster = [
    {
      name: 'Gunjan Jangir',
      role: 'Project Manager',
      specialty: 'Strategic Project Leadership, Cross-Functional Team Coordination & Milestones',
      photo: gunjanPhoto,
      avatar: 'GJ',
      color: 'bg-blue-600 text-white',
      badgeColor: 'bg-blue-100 text-blue-700',
    },
    {
      name: 'Manan Agrawal',
      role: 'Pseudocode Formulator & Learning Tech Lead',
      specialty: 'Algorithm Logic Pseudocode, System Control Flow & Learning Tech Architecture',
      avatar: 'MA',
      color: 'bg-indigo-600 text-white',
      badgeColor: 'bg-indigo-100 text-indigo-700',
    },
    {
      name: 'Archit Gupta',
      role: 'Code Developer',
      specialty: 'Core Software Architecture, Interactive Telemetry & React Simulation Engine',
      photo: architPhoto,
      avatar: 'AG',
      color: 'bg-purple-600 text-white',
      badgeColor: 'bg-purple-100 text-purple-700',
    },
    {
      name: 'Abhishek Anand',
      role: 'UI/UX Designer',
      specialty: 'Product Design Systems, Telemetry Interface Hierarchy & Visual Assets',
      photo: abhishekPhoto,
      avatar: 'AA',
      color: 'bg-teal-600 text-white',
      badgeColor: 'bg-teal-100 text-teal-700',
    },
    {
      name: 'Abhinav Dahiya',
      role: 'UI/UX Designer',
      specialty: 'Glassmorphic UI Systems, Telemetry Dashboard Layouts & Emergency UX',
      photo: abhinavPhoto,
      avatar: 'AD',
      color: 'bg-emerald-600 text-white',
      badgeColor: 'bg-emerald-100 text-emerald-700',
    },
    {
      name: 'Sahajta Singh',
      role: 'Software Deployer & Learning Tech Lead',
      specialty: 'Continuous Software Deployment, Cloud API Pipeline & Educational Technology',
      photo: sahajtaPhoto,
      avatar: 'SS',
      color: 'bg-sky-600 text-white',
      badgeColor: 'bg-sky-100 text-sky-700',
    },
    {
      name: 'Daksh Srivastava',
      role: 'Hardware Integrator',
      specialty: 'Circuit Wiring, Microcontroller Interfacing, BMS Power & Motor Actuators',
      photo: dakshPhoto,
      avatar: 'DS',
      color: 'bg-orange-600 text-white',
      badgeColor: 'bg-orange-100 text-orange-700',
    },
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade-in max-w-[1700px] mx-auto p-4 md:p-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[11px] font-black uppercase tracking-wider">
            FireBot Project Team
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 7 Active Specialists
          </span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
          FireBot Engineering & Leadership Roster
        </h1>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
          Multi-disciplinary team of 7 specialists spanning project management, code development, dual UI/UX design, hardware integration, pseudocode logic, and software deployment.
        </p>
      </div>

      {/* Featured Lead Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {/* Project Manager Card */}
        <div className="glass-card-light p-5 relative overflow-hidden border-2 border-blue-500/20 shadow-xl shadow-blue-500/5 flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex flex-col items-center text-center border-b border-slate-200/80 dark:border-slate-800 pb-4 mb-4">
              <div className="relative group mb-3">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
                <img
                  src={projectManager.photo}
                  alt={projectManager.name}
                  className="relative w-28 h-28 rounded-xl object-cover border-4 border-white dark:border-slate-800 shadow-lg transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.fallback) {
                      target.dataset.fallback = 'true';
                      target.src = '/assets/gunjan-jangir.jpg';
                    }
                  }}
                />
                <span className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-[8px] uppercase tracking-wider rounded-full border-2 border-white shadow">
                  {projectManager.badge}
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {projectManager.name}
              </h2>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-wider mt-0.5">
                {projectManager.role}
              </p>
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-medium text-[11px] leading-relaxed">
              {projectManager.bio}
            </p>
          </div>
        </div>

        {/* Code Developer Card */}
        <div className="glass-card-light p-5 relative overflow-hidden border-2 border-purple-500/20 shadow-xl shadow-purple-500/5 flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex flex-col items-center text-center border-b border-slate-200/80 dark:border-slate-800 pb-4 mb-4">
              <div className="relative group mb-3">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
                <img
                  src={codeDeveloper.photo}
                  alt={codeDeveloper.name}
                  className="relative w-28 h-28 rounded-xl object-cover border-4 border-white dark:border-slate-800 shadow-lg transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.fallback) {
                      target.dataset.fallback = 'true';
                      target.src = '/assets/archit-gupta.jpg';
                    }
                  }}
                />
                <span className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-[8px] uppercase tracking-wider rounded-full border-2 border-white shadow">
                  {codeDeveloper.badge}
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {codeDeveloper.name}
              </h2>
              <p className="text-[10px] font-black text-purple-600 uppercase tracking-wider mt-0.5">
                {codeDeveloper.role}
              </p>
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-medium text-[11px] leading-relaxed">
              {codeDeveloper.bio}
            </p>
          </div>
        </div>

        {/* UI/UX Designer Card - Abhishek Anand (Position 3) */}
        <div className="glass-card-light p-5 relative overflow-hidden border-2 border-teal-500/20 shadow-xl shadow-teal-500/5 flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex flex-col items-center text-center border-b border-slate-200/80 dark:border-slate-800 pb-4 mb-4">
              <div className="relative group mb-3">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
                <img
                  src={abhishekDesigner.photo}
                  alt={abhishekDesigner.name}
                  className="relative w-28 h-28 rounded-xl object-cover border-4 border-white dark:border-slate-800 shadow-lg transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.fallback) {
                      target.dataset.fallback = 'true';
                      target.src = '/assets/abhishek-anand.jpg';
                    }
                  }}
                />
                <span className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-black text-[8px] uppercase tracking-wider rounded-full border-2 border-white shadow">
                  {abhishekDesigner.badge}
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {abhishekDesigner.name}
              </h2>
              <p className="text-[10px] font-black text-teal-600 uppercase tracking-wider mt-0.5">
                {abhishekDesigner.role}
              </p>
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-medium text-[11px] leading-relaxed">
              {abhishekDesigner.bio}
            </p>
          </div>
        </div>

        {/* UI/UX Designer Card - Abhinav Dahiya (Position 4) */}
        <div className="glass-card-light p-5 relative overflow-hidden border-2 border-emerald-500/20 shadow-xl shadow-emerald-500/5 flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex flex-col items-center text-center border-b border-slate-200/80 dark:border-slate-800 pb-4 mb-4">
              <div className="relative group mb-3">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
                <img
                  src={abhinavDesigner.photo}
                  alt={abhinavDesigner.name}
                  className="relative w-28 h-28 rounded-xl object-cover border-4 border-white dark:border-slate-800 shadow-lg transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.fallback) {
                      target.dataset.fallback = 'true';
                      target.src = '/assets/abhinav-dahiya.jpg';
                    }
                  }}
                />
                <span className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-[8px] uppercase tracking-wider rounded-full border-2 border-white shadow">
                  {abhinavDesigner.badge}
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {abhinavDesigner.name}
              </h2>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-wider mt-0.5">
                {abhinavDesigner.role}
              </p>
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-medium text-[11px] leading-relaxed">
              {abhinavDesigner.bio}
            </p>
          </div>
        </div>

        {/* Software Deployer Card - Sahajta Singh */}
        <div className="glass-card-light p-5 relative overflow-hidden border-2 border-sky-500/20 shadow-xl shadow-sky-500/5 flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex flex-col items-center text-center border-b border-slate-200/80 dark:border-slate-800 pb-4 mb-4">
              <div className="relative group mb-3">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
                <img
                  src={sahajtaDeployer.photo}
                  alt={sahajtaDeployer.name}
                  className="relative w-28 h-28 rounded-xl object-cover border-4 border-white dark:border-slate-800 shadow-lg transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.fallback) {
                      target.dataset.fallback = 'true';
                      target.src = '/assets/sahajta-singh.jpg';
                    }
                  }}
                />
                <span className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-black text-[8px] uppercase tracking-wider rounded-full border-2 border-white shadow">
                  {sahajtaDeployer.badge}
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {sahajtaDeployer.name}
              </h2>
              <p className="text-[10px] font-black text-sky-600 uppercase tracking-wider mt-0.5">
                {sahajtaDeployer.role}
              </p>
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-medium text-[11px] leading-relaxed">
              {sahajtaDeployer.bio}
            </p>
          </div>
        </div>

        {/* Hardware Integrator Card */}
        <div className="glass-card-light p-5 relative overflow-hidden border-2 border-orange-500/20 shadow-xl shadow-orange-500/5 flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex flex-col items-center text-center border-b border-slate-200/80 dark:border-slate-800 pb-4 mb-4">
              <div className="relative group mb-3">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
                <img
                  src={hardwareIntegrator.photo}
                  alt={hardwareIntegrator.name}
                  className="relative w-28 h-28 rounded-xl object-cover border-4 border-white dark:border-slate-800 shadow-lg transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.fallback) {
                      target.dataset.fallback = 'true';
                      target.src = '/assets/daksh-srivastava.jpg';
                    }
                  }}
                />
                <span className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-black text-[8px] uppercase tracking-wider rounded-full border-2 border-white shadow">
                  {hardwareIntegrator.badge}
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {hardwareIntegrator.name}
              </h2>
              <p className="text-[10px] font-black text-orange-600 uppercase tracking-wider mt-0.5">
                {hardwareIntegrator.role}
              </p>
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-medium text-[11px] leading-relaxed">
              {hardwareIntegrator.bio}
            </p>
          </div>
        </div>
      </div>

      {/* Full 7-Member Complete Roster Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Complete Official Team Roster
            </h2>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              All 7 core members, roles, and engineering domain responsibilities
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-[#182132] text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-800">
            7 Official Members
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {teamRoster.map(m => (
            <div
              key={m.name}
              className="glass-card-light p-4 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 border border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500/50 relative group overflow-hidden"
            >
              {m.photo ? (
                <div className="relative mb-3">
                  <img
                    src={m.photo}
                    alt={m.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-md group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.fallback) {
                        target.dataset.fallback = 'true';
                        const slug = m.name.toLowerCase().replace(/\s+/g, '-');
                        target.src = `/assets/${slug}.jpg`;
                      }
                    }}
                  />
                  <span className="absolute -bottom-1 -right-1 p-0.5 bg-emerald-500 text-white rounded-full border border-white dark:border-slate-800 shadow">
                    <CheckCircle2 size={10} />
                  </span>
                </div>
              ) : (
                <div
                  className={`w-16 h-16 rounded-2xl ${m.color} font-black text-base flex items-center justify-center shadow-md mb-3 border-2 border-white dark:border-slate-800`}
                >
                  {m.avatar}
                </div>
              )}

              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white leading-snug">
                {m.name}
              </h3>
              <span className={`px-2 py-0.5 rounded-full ${m.badgeColor} text-[9px] font-black uppercase mt-1 truncate max-w-full`}>
                {m.role}
              </span>

              <p className="text-[10px] font-medium text-slate-600 dark:text-slate-300 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 w-full leading-tight">
                {m.specialty}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
