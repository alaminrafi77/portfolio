import React, { useState, useEffect } from 'react';
import { initialPortfolioData } from './data/defaultCvData';
import { PortfolioData, RetroTheme, ActiveTab } from './types/portfolio';
import { RetroNavBar } from './components/retro/RetroNavBar';
import { RetroBadges } from './components/retro/RetroBadges';
import { VisitorCounter } from './components/retro/VisitorCounter';
import { TerminalView } from './components/retro/TerminalView';
import { Guestbook } from './components/retro/Guestbook';
import { CvEditorModal } from './components/retro/CvEditorModal';
import { CvImportWizard } from './components/retro/CvImportWizard';
import { CvPrintView } from './components/retro/CvPrintView';
import { Windows95LoginModal } from './components/retro/Windows95LoginModal';
import { playRetroClick, playWinStartupChime, playRetroBeep } from './utils/audio';

export default function App() {
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem('alamin_cv_data_v4');
      if (saved) return JSON.parse(saved);

      // Auto-clear older versions to ensure exact match with alaminrafi77
      localStorage.removeItem('alamin_cv_data');
      localStorage.removeItem('alamin_cv_data_v2');
      localStorage.removeItem('alamin_cv_data_v3');
    } catch {
      // fallback
    }
    return initialPortfolioData;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [theme, setTheme] = useState<RetroTheme>('win95');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [crtEnabled, setCrtEnabled] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isPrintView, setIsPrintView] = useState(false);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Authentication State (Username: rafi, Password: rafirafirafi)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return (
        sessionStorage.getItem('alamin_auth_admin') === 'true' ||
        localStorage.getItem('alamin_auth_admin') === 'true'
      );
    } catch {
      return false;
    }
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginPromptReason, setLoginPromptReason] = useState<string | undefined>(undefined);
  const [pendingAuthAction, setPendingAuthAction] = useState<(() => void) | null>(null);

  const handleRequireAuth = (action: () => void, reason?: string) => {
    playRetroClick(soundEnabled);
    if (isAuthenticated) {
      action();
    } else {
      setPendingAuthAction(() => action);
      setLoginPromptReason(
        reason || 'Authentication Required: Please log on with username "rafi" to unlock editing privileges.'
      );
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    try {
      localStorage.setItem('alamin_auth_admin', 'true');
    } catch {
      // ignore
    }
    if (pendingAuthAction) {
      pendingAuthAction();
      setPendingAuthAction(null);
    }
  };

  const handleLogout = () => {
    playRetroClick(soundEnabled);
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('alamin_auth_admin');
      sessionStorage.removeItem('alamin_auth_admin');
    } catch {
      // ignore
    }
    setIsEditorOpen(false);
    setIsWizardOpen(false);
  };

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveData = (newData: PortfolioData) => {
    setData(newData);
    try {
      localStorage.setItem('alamin_cv_data_v4', JSON.stringify(newData));
    } catch {
      // ignore
    }
  };

  const handleCopyEmail = () => {
    playRetroClick(soundEnabled);
    navigator.clipboard.writeText(data.personalInfo.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  // Background style based on theme
  const getThemeBackground = () => {
    switch (theme) {
      case 'win95':
        return 'bg-[#008080]';
      case 'netscape':
        return 'bg-[#0f1f38] text-white';
      case 'geocities':
        return 'bg-black text-[#00ffcc] [background-image:radial-gradient(#333_1px,transparent_1px)] [background-size:16px_16px]';
      case 'cern91':
        return 'bg-[#fffdfa] text-black';
      default:
        return 'bg-[#008080]';
    }
  };

  if (isPrintView) {
    return (
      <div className="min-h-screen bg-neutral-200 py-8 px-2">
        <CvPrintView
          data={data}
          onBack={() => setIsPrintView(false)}
          soundEnabled={soundEnabled}
        />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${getThemeBackground()} ${
        crtEnabled ? 'crt-overlay' : ''
      } flex flex-col font-sans text-xs pb-10 transition-colors duration-200 selection:bg-[#000080] selection:text-white`}
    >
      {/* 1. Retro 90s Marquee Ticker */}
      <div className="bg-[#ffff00] text-black border-b border-black py-0.5 px-2 overflow-hidden font-mono font-bold text-[11px] shadow-sm select-none">
        <div className="animate-marquee flex items-center gap-6">
          <span>★★★ WELCOME TO MD AL AMIN RAFI'S OFFICIAL 1990S PORTFOLIO & CV ★★★</span>
          <span>MASTER IN APPLIED ARTIFICIAL INTELLIGENCE · UNITAR INTERNATIONAL UNIVERSITY, MALAYSIA</span>
          <span>PHONE: {data.personalInfo.phone} · EMAIL: {data.personalInfo.email} · GITHUB: {data.personalInfo.github}</span>
          <span>★ ARTIFICIAL INTELLIGENCE · MACHINE LEARNING · CYBERSECURITY & CTF · WEB DEV ★</span>
          <span>LOCATION: BANDAR SUNWAY, PETALING JAYA, SELANGOR, MALAYSIA</span>
        </div>
      </div>

      {/* 2. Main Desktop / Browser Canvas Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-2 sm:p-4 md:p-6">
        {/* The Vintage Window Frame */}
        <div className="bg-[#c0c0c0] bevel-outset border-2 border-[#ffffff] shadow-2xl flex flex-col text-black">
          {/* Top Bar / Netscape Navigator Chrome */}
          <RetroNavBar
            currentTab={activeTab}
            onSelectTab={setActiveTab}
            theme={theme}
            onChangeTheme={setTheme}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled(!soundEnabled)}
            crtEnabled={crtEnabled}
            onToggleCrt={() => setCrtEnabled(!crtEnabled)}
            onOpenEditor={() => handleRequireAuth(() => setIsEditorOpen(true), 'Log on as rafi to open CV Notepad and edit portfolio data.')}
            onOpenWizard={() => handleRequireAuth(() => setIsWizardOpen(true), 'Log on as rafi to run the CV Import Wizard.')}
            onPrintCv={() => setIsPrintView(true)}
            isAuthenticated={isAuthenticated}
            onLoginClick={() => handleRequireAuth(() => {}, 'Please enter credentials to unlock editing privileges.')}
            onLogoutClick={handleLogout}
          />

          {/* Under Construction Animated Banner Strip */}
          <div className="bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-300 border-b border-black py-1 px-3 flex items-center justify-between text-[11px] font-mono font-bold text-black select-none">
            <div className="flex items-center gap-2">
              <span className="text-base animate-bounce">🚧</span>
              <span>ACADEMIC RESEARCH & AI DEVELOPMENT IN PROGRESS</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-[#555]">MASTER IN APPLIED AI @ UNITAR MALAYSIA</span>
              <a
                href="/MD_AL_AMIN_RAFI_CV.pdf"
                target="_blank"
                rel="noreferrer"
                className="px-2 py-0.5 bevel-button text-[10px] text-red-700 font-bold bg-red-100 flex items-center gap-1"
              >
                <span>📄</span>
                <span>Original PDF CV</span>
              </a>
              <button
                onClick={handleCopyEmail}
                className="px-2 py-0.5 bevel-button text-[10px] text-[#000080] font-bold"
              >
                {copiedEmail ? '✓ Copied!' : '✉ Copy Email'}
              </button>
            </div>
          </div>

          {/* Window Interior Content Area */}
          <div className="p-3 sm:p-6 bg-[#ffffff] min-h-[550px] overflow-x-hidden text-black font-sans">
            {/* TAB: OVERVIEW / HOME */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* 90s Hero Header with Pixel Art Avatar & Bio */}
                <div className="border-2 border-dashed border-[#808080] p-4 bg-[#f8f8f8]">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    {/* Retro Developer Portrait Avatar */}
                    <div className="shrink-0 flex flex-col items-center">
                      <div className="w-36 h-36 bg-[#000080] p-1 bevel-inset border-2 border-black flex items-center justify-center relative overflow-hidden">
                        <svg
                          viewBox="0 0 100 100"
                          className="w-full h-full"
                          shapeRendering="crispEdges"
                        >
                          {/* Background grid */}
                          <rect width="100" height="100" fill="#001133" />
                          <rect x="0" y="80" width="100" height="20" fill="#002255" />

                          {/* CRT Screen glow line */}
                          <line x1="0" y1="20" x2="100" y2="20" stroke="#003377" strokeWidth="1" />
                          <line x1="0" y1="40" x2="100" y2="40" stroke="#003377" strokeWidth="1" />
                          <line x1="0" y1="60" x2="100" y2="60" stroke="#003377" strokeWidth="1" />

                          {/* Body / Shoulders */}
                          <rect x="25" y="70" width="50" height="30" fill="#1b4965" />
                          <rect x="35" y="70" width="30" height="15" fill="#62b6cb" />

                          {/* Neck */}
                          <rect x="42" y="60" width="16" height="12" fill="#e0a96d" />

                          {/* Head / Face */}
                          <rect x="32" y="28" width="36" height="34" fill="#f0be86" />

                          {/* Hair (Black 90s style) */}
                          <rect x="30" y="20" width="40" height="12" fill="#111111" />
                          <rect x="28" y="24" width="8" height="14" fill="#111111" />
                          <rect x="64" y="24" width="8" height="14" fill="#111111" />

                          {/* Glasses */}
                          <rect x="34" y="38" width="13" height="8" fill="#ffffff" stroke="#222" strokeWidth="2" />
                          <rect x="53" y="38" width="13" height="8" fill="#ffffff" stroke="#222" strokeWidth="2" />
                          <line x1="47" y1="42" x2="53" y2="42" stroke="#222" strokeWidth="2" />
                          <rect x="39" y="41" width="3" height="3" fill="#000000" />
                          <rect x="58" y="41" width="3" height="3" fill="#000000" />

                          {/* Nose & Friendly Smile */}
                          <rect x="48" y="48" width="4" height="4" fill="#d49a5b" />
                          <path d="M44 55 Q50 59 56 55" stroke="#993300" strokeWidth="2" fill="none" />

                          {/* Vintage Headphones */}
                          <rect x="24" y="34" width="6" height="16" fill="#ffaa00" />
                          <rect x="70" y="34" width="6" height="16" fill="#ffaa00" />
                          <path d="M27 34 Q50 14 73 34" stroke="#888888" strokeWidth="3" fill="none" />
                        </svg>
                      </div>
                      <span className="mt-1 font-mono text-[10px] text-gray-600 font-bold">
                        [MD_AL_AMIN_RAFI.GIF]
                      </span>
                      <span className="text-[9px] text-[#008000] font-bold">● MASTER IN APPLIED AI</span>
                    </div>

                    {/* Intro Details */}
                    <div className="flex-1 space-y-2 text-center md:text-left">
                      <div className="border-b border-[#000080] pb-2">
                        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#000080] tracking-tight">
                          {data.personalInfo.name}
                        </h1>
                        <p className="text-sm font-bold text-[#b30000] font-mono mt-0.5">
                          {data.personalInfo.title}
                        </p>
                        <div className="text-xs text-gray-700 font-mono mt-1 space-y-0.5">
                          <p>📍 {data.personalInfo.location}</p>
                          <p>
                            📞 Phone: <span className="font-bold text-black">{data.personalInfo.phone}</span> · ✉ Email:{' '}
                            <a
                              href={`mailto:${data.personalInfo.email}`}
                              className="text-[#000080] underline font-bold"
                            >
                              {data.personalInfo.email}
                            </a>
                          </p>
                          <p>
                            🔗 GitHub:{' '}
                            <a
                              href={data.personalInfo.github}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#000080] underline font-bold"
                            >
                              {data.personalInfo.github}
                            </a>
                          </p>
                        </div>
                      </div>

                      <div className="text-xs sm:text-sm text-gray-800 leading-relaxed font-sans">
                        <p className="font-bold text-black mb-1">PROFESSIONAL SUMMARY:</p>
                        <p>{data.personalInfo.bio}</p>
                      </div>

                      <div className="p-2 bg-[#ffffcc] border border-[#d4d0c8] font-mono text-xs italic text-[#555]">
                        <span className="font-bold text-black not-italic">Core Focus: </span>
                        AI & Machine Learning · Cybersecurity & CTF · Web Development · Linux & Networking
                      </div>

                      <div className="pt-2 flex flex-wrap gap-2 items-center justify-center md:justify-start">
                        <a
                          href="/MD_AL_AMIN_RAFI_CV.pdf"
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bevel-button font-bold text-xs bg-red-100 text-red-800 border-2 border-red-700 flex items-center gap-1.5"
                        >
                          <span>📄</span>
                          <span>Download Official PDF CV</span>
                        </a>
                        <button
                          onClick={() => {
                            playRetroClick(soundEnabled);
                            setActiveTab('skills');
                          }}
                          className="px-3 py-1.5 bevel-button font-bold text-xs text-[#000080]"
                        >
                          Explore Skills Matrix →
                        </button>
                        <button
                          onClick={() => {
                            playRetroClick(soundEnabled);
                            setActiveTab('projects');
                          }}
                          className="px-3 py-1.5 bevel-button font-bold text-xs"
                        >
                          View 5 Projects →
                        </button>
                        <button
                          onClick={() => {
                            playRetroClick(soundEnabled);
                            setActiveTab('research');
                          }}
                          className="px-3 py-1.5 bevel-button font-bold text-xs text-[#006600]"
                        >
                          🔬 Research & Academic Work →
                        </button>
                        <button
                          onClick={() => {
                            playRetroClick(soundEnabled);
                            setActiveTab('education');
                          }}
                          className="px-3 py-1.5 bevel-button font-bold text-xs text-purple-900"
                        >
                          🎓 Education & References →
                        </button>
                        <button
                          onClick={() => {
                            playRetroClick(soundEnabled);
                            setIsPrintView(true);
                          }}
                          className="px-3 py-1.5 bevel-button font-bold text-xs text-black"
                        >
                          🖨️ Print Resume
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 90s Verified CV Telemetry Table */}
                <div>
                  <h3 className="font-bold text-xs font-mono text-[#000080] border-b-2 border-[#000080] pb-1 mb-2 flex items-center justify-between">
                    <span>⚡ CANDIDATE CV TELEMETRY & VERIFIED CREDENTIALS</span>
                    <span className="text-[10px] text-gray-500 font-normal">SOURCE: C.V_75e6b025.PDF</span>
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border border-gray-400 border-collapse">
                      <tbody>
                        <tr className="bg-[#f0f0f0] border-b border-gray-400">
                          <td className="p-2 font-bold font-mono w-1/4 border-r border-gray-400 bg-[#e0e0e0]">
                            Current Academic Degree
                          </td>
                          <td className="p-2 font-mono text-[#000080] font-bold">
                            Master in Applied Artificial Intelligence — UNITAR International University, Malaysia (Expected 2027)
                          </td>
                        </tr>
                        <tr className="border-b border-gray-400">
                          <td className="p-2 font-bold font-mono border-r border-gray-400 bg-[#e0e0e0]">
                            Undergraduate Degree
                          </td>
                          <td className="p-2 font-mono">
                            B.Sc. in Computer Science and Engineering — City University (2022 – 2025)
                          </td>
                        </tr>
                        <tr className="bg-[#f0f0f0] border-b border-gray-400">
                          <td className="p-2 font-bold font-mono border-r border-gray-400 bg-[#e0e0e0]">
                            Higher Secondary Certificate
                          </td>
                          <td className="p-2 font-mono">
                            Afajuddin Memorial College (Science) — 2020
                          </td>
                        </tr>
                        <tr className="border-b border-gray-400">
                          <td className="p-2 font-bold font-mono border-r border-gray-400 bg-[#e0e0e0]">
                            Contact Details
                          </td>
                          <td className="p-2 font-mono space-x-2">
                            <span>Phone: <strong className="text-black">{data.personalInfo.phone}</strong></span>
                            <span>|</span>
                            <span>Email: <a href={`mailto:${data.personalInfo.email}`} className="text-blue-800 underline font-bold">{data.personalInfo.email}</a></span>
                          </td>
                        </tr>
                        <tr className="bg-[#f0f0f0] border-b border-gray-400">
                          <td className="p-2 font-bold font-mono border-r border-gray-400 bg-[#e0e0e0]">
                            Residential Address
                          </td>
                          <td className="p-2 font-mono">
                            {data.personalInfo.location}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-400">
                          <td className="p-2 font-bold font-mono border-r border-gray-400 bg-[#e0e0e0]">
                            Language Proficiencies
                          </td>
                          <td className="p-2 font-mono">
                            {data.languages.map((l, i) => (
                              <span key={i} className="mr-3">
                                <strong>{l.language}:</strong> {l.proficiency} {l.details ? `(${l.details})` : ''}
                              </span>
                            ))}
                          </td>
                        </tr>
                        <tr className="bg-[#f0f0f0]">
                          <td className="p-2 font-bold font-mono border-r border-gray-400 bg-[#e0e0e0]">
                            Academic Reference
                          </td>
                          <td className="p-2 font-mono">
                            {data.references.map((r, i) => (
                              <span key={i}>
                                <strong>{r.name}</strong> ({r.designation}, {r.department}, {r.institution}) · Email: {r.email} · Phone: {r.phone}
                              </span>
                            ))}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Two Column Section: Research Highlights & Visitor Hit Counter */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Left 2 Cols: Research Highlights */}
                  <div className="md:col-span-2 space-y-3">
                    <h3 className="font-bold text-xs font-mono text-[#000080] border-b border-gray-300 pb-1">
                      🔬 FEATURED RESEARCH & ACADEMIC WORK
                    </h3>
                    <div className="space-y-3">
                      {data.researchWork.map((rw) => (
                        <div key={rw.id} className="p-2.5 bg-[#fbfbfb] border border-gray-300">
                          <p className="font-bold text-xs text-[#000080] mb-0.5">
                            ▪ {rw.title}
                          </p>
                          <p className="text-[11px] text-gray-700 leading-relaxed mb-1.5">
                            {rw.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            <span className="font-mono text-[10px] bg-[#e8e8e8] border border-gray-400 px-1 font-bold">
                              Domain: {rw.domain}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right 1 Col: Odometer Visitor Counter & Web Stats */}
                  <div className="flex flex-col items-center justify-center p-3 bg-[#f0f0f0] border border-gray-400">
                    <VisitorCounter soundEnabled={soundEnabled} />
                    <div className="mt-3 text-center text-[10px] text-gray-600 font-mono">
                      <p>Web Server: Apache/1.3.12 (Unix)</p>
                      <p>Verified: UNITAR Malaysia & City University</p>
                      <p className="text-[#008000] font-bold mt-1">✓ SSL Protected & Live on arafi.tech</p>
                    </div>
                  </div>
                </div>

                {/* 90s Web Badges Strip */}
                <RetroBadges />
              </div>
            )}

            {/* TAB: SKILLS */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div className="border-b-2 border-black pb-2 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold font-serif text-[#000080]">
                      SKILLS MATRIX · VERIFIED FROM CV
                    </h2>
                    <p className="text-xs text-gray-600 font-mono">
                      Artificial Intelligence, Machine Learning, Cybersecurity, Penetration Testing, Web Development, and Systems.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      handleRequireAuth(() => setIsEditorOpen(true), 'Log on as rafi to customize and edit your skills matrix.');
                    }}
                    className={`px-2 py-1 bevel-button text-xs font-bold ${
                      isAuthenticated ? 'text-[#b30000]' : 'text-gray-700 bg-gray-100'
                    }`}
                    title={isAuthenticated ? 'Edit Skills Matrix' : '🔒 Requires Admin Login - Click to log on as rafi'}
                  >
                    {isAuthenticated ? '✏️ Edit Skills' : '🔒 Edit Skills'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.skillCategories.map((cat, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-400 bg-[#f9f9f9] p-3 shadow-inner"
                    >
                      <div className="bg-[#000080] text-white px-2 py-1 font-bold text-xs font-mono flex items-center justify-between mb-2">
                        <span>{cat.category}</span>
                        <span className="text-[10px] text-yellow-300">CV VERIFIED</span>
                      </div>

                      <div className="space-y-3">
                        {cat.skills.map((skill, sIdx) => {
                          const filledSegments = Math.round(skill.level / 10);
                          const emptySegments = 10 - filledSegments;

                          return (
                            <div key={sIdx} className="text-xs">
                              <div className="flex justify-between items-baseline mb-0.5">
                                <span className="font-bold text-black">{skill.name}</span>
                                <span className="text-gray-500 font-mono text-[10px]">
                                  {skill.note || `${skill.level}%`}
                                </span>
                              </div>

                              {/* 90s Segmented Progress Bar */}
                              <div className="flex items-center gap-0.5 bg-black p-1 bevel-inset">
                                {Array.from({ length: filledSegments }).map((_, i) => (
                                  <div
                                    key={`fill-${i}`}
                                    className="flex-1 h-3 bg-gradient-to-r from-[#00cc00] to-[#00ff41] border-r border-black"
                                    title={`${skill.level}%`}
                                  />
                                ))}
                                {Array.from({ length: emptySegments }).map((_, i) => (
                                  <div
                                    key={`empty-${i}`}
                                    className="flex-1 h-3 bg-[#111111] border-r border-[#222]"
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: PROJECTS */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="border-b-2 border-black pb-2 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold font-serif text-[#000080]">
                      PROJECTS · FROM CV SPECIFICATIONS
                    </h2>
                    <p className="text-xs text-gray-600 font-mono">
                      Complete list of projects directly from Md Al Amin Rafi's curriculum vitae.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-gray-500">
                    Total: {data.projects.length} Verified Projects
                  </span>
                </div>

                <div className="space-y-4">
                  {data.projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="border-2 border-gray-400 bg-[#fbfbfb] p-3 shadow-sm"
                    >
                      {/* Project title bar */}
                      <div className="flex flex-wrap items-center justify-between border-b border-gray-300 pb-1.5 mb-2 bg-[#f0f0f0] p-1.5 gap-2">
                        <span className="font-bold text-sm text-[#000080]">
                          ★ {proj.title}
                        </span>
                        <span className="font-mono text-[10px] bg-white border border-gray-400 px-2 py-0.5 font-bold">
                          {proj.category}
                        </span>
                      </div>

                      <p className="text-xs font-bold text-gray-900 mb-1">
                        {proj.summary}
                      </p>

                      <p className="text-xs text-gray-700 leading-relaxed mb-3">
                        {proj.details}
                      </p>

                      <div className="p-1.5 bg-[#ffffcc] border border-[#d4d0c8] text-[11px] font-mono text-[#444] mb-3">
                        <span className="font-bold text-black">Architecture Highlight:</span> {proj.keyFeature}
                      </div>

                      {/* Technologies list */}
                      <div className="pt-2 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-1 items-center">
                          <span className="font-mono text-[10px] font-bold text-gray-600">Stack:</span>
                          {proj.technologies.map((t) => (
                            <span
                              key={t}
                              className="font-mono text-[10px] bg-[#e8e8e8] border border-gray-400 px-1.5"
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        <a
                          href={proj.demoUrl || data.personalInfo.github}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 bevel-button font-bold text-xs text-[#000080]"
                        >
                          🔗 View on GitHub (alaminrafi77)
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: RESEARCH & ACADEMIC WORK */}
            {activeTab === 'research' && (
              <div className="space-y-6">
                <div className="border-b-2 border-black pb-2 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold font-serif text-[#000080]">
                      RESEARCH & ACADEMIC WORK
                    </h2>
                    <p className="text-xs text-gray-600 font-mono">
                      Academic studies in AI cloud security protocols and near-field communication vulnerability assessments.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-gray-500">
                    2 Research Domains
                  </span>
                </div>

                <div className="space-y-4">
                  {data.researchWork.map((res) => (
                    <div
                      key={res.id}
                      className="border-2 border-gray-400 p-4 bg-[#fbfbfb] shadow-sm"
                    >
                      <div className="flex flex-wrap justify-between items-baseline border-b border-gray-300 pb-1 mb-2 bg-[#f0f0f0] p-2">
                        <h3 className="text-sm font-bold text-[#000080] font-sans">
                          🔬 {res.title}
                        </h3>
                        <span className="font-mono text-xs font-bold text-gray-700 bg-[#ffff99] px-2 py-0.5 border border-[#cccc00]">
                          Domain: {res.domain}
                        </span>
                      </div>

                      <p className="text-xs text-gray-800 leading-relaxed mb-3">
                        {res.description}
                      </p>

                      <div className="bg-white p-2.5 border border-gray-300">
                        <span className="font-mono font-bold text-[11px] text-[#000080] block mb-1">
                          Key Research Highlights & Methodologies:
                        </span>
                        <ul className="list-disc pl-5 space-y-1 text-xs text-gray-800 font-sans">
                          {res.keyInsights.map((insight, idx) => (
                            <li key={idx}>{insight}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: EDUCATION & REFERENCES */}
            {activeTab === 'education' && (
              <div className="space-y-6">
                <div className="border-b-2 border-black pb-2 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold font-serif text-[#000080]">
                      EDUCATION, LANGUAGES & REFERENCES
                    </h2>
                    <p className="text-xs text-gray-600 font-mono">
                      Verified academic records, language certifications, and faculty recommendations.
                    </p>
                  </div>
                  <a
                    href="/MD_AL_AMIN_RAFI_CV.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 bevel-button text-xs font-bold text-red-700 bg-red-50 flex items-center gap-1"
                  >
                    <span>📄</span>
                    <span>Download PDF CV</span>
                  </a>
                </div>

                {/* Education List */}
                <div className="space-y-4">
                  <h3 className="font-mono font-bold text-xs text-[#000080] border-b border-gray-300 pb-1">
                    🎓 ACADEMIC DEGREES (FROM CV)
                  </h3>
                  <div className="space-y-3">
                    {data.education.map((edu) => (
                      <div
                        key={edu.id}
                        className="border-2 border-gray-400 p-3 bg-[#fbfbfb]"
                      >
                        <div className="flex flex-wrap justify-between items-baseline border-b border-gray-300 pb-1 mb-1">
                          <span className="text-sm font-bold text-black font-serif">
                            {edu.degree}
                          </span>
                          <span className="font-mono text-xs font-bold text-gray-700 bg-[#ffff99] px-2 py-0.5 border border-[#cccc00]">
                            {edu.statusOrHonors}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-[#000080]">
                          🏛️ {edu.institution} {edu.location ? `· ${edu.location}` : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Languages Section */}
                <div className="space-y-2 pt-2">
                  <h3 className="font-mono font-bold text-xs text-[#000080] border-b border-gray-300 pb-1">
                    🗣️ LANGUAGES
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {data.languages.map((l, i) => (
                      <div key={i} className="border border-gray-300 p-2.5 bg-white">
                        <span className="font-bold text-xs text-black block">{l.language}</span>
                        <p className="text-xs text-[#000080] font-semibold">{l.proficiency}</p>
                        <p className="text-[11px] text-gray-600 font-mono mt-0.5">{l.details}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* References Section */}
                <div className="space-y-2 pt-2">
                  <h3 className="font-mono font-bold text-xs text-[#000080] border-b border-gray-300 pb-1">
                    👥 ACADEMIC REFERENCES
                  </h3>
                  <div className="space-y-2">
                    {data.references.map((ref, idx) => (
                      <div
                        key={idx}
                        className="border border-gray-400 p-3 bg-white shadow-sm"
                      >
                        <h4 className="font-bold text-sm text-[#000080]">{ref.name}</h4>
                        <p className="text-xs text-gray-800">
                          {ref.designation}, {ref.department}
                        </p>
                        <p className="text-xs text-gray-700 italic">{ref.institution}</p>
                        <div className="mt-2 pt-2 border-t border-dashed border-gray-200 flex flex-wrap gap-4 text-xs font-mono">
                          <span>✉ Email: <a href={`mailto:${ref.email}`} className="text-blue-800 underline font-bold">{ref.email}</a></span>
                          <span>📞 Phone: <strong className="text-black">{ref.phone}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: GUESTBOOK */}
            {activeTab === 'guestbook' && (
              <Guestbook soundEnabled={soundEnabled} />
            )}

            {/* TAB: TERMINAL */}
            {activeTab === 'terminal' && (
              <TerminalView
                data={data}
                soundEnabled={soundEnabled}
                onChangeTheme={setTheme}
              />
            )}
          </div>

          {/* 90s Netscape Document Status Bar at bottom of window */}
          <div className="flex items-center justify-between px-2 py-1 bg-[#c0c0c0] border-t border-[#808080] text-[11px] font-sans select-none">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#000080]">Document: Done</span>
              <span className="text-gray-500">|</span>
              <span className="font-mono text-gray-700">HTTP/1.0 200 OK (0.01s)</span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/MD_AL_AMIN_RAFI_CV.pdf"
                target="_blank"
                rel="noreferrer"
                className="text-red-700 underline font-bold"
              >
                📄 View C.V_75e6b025.pdf
              </a>
              <span className="text-sm">🔑</span>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Authentic Windows 95 Desktop Taskbar at very bottom */}
      <footer className="fixed bottom-0 left-0 right-0 h-8 bg-[#c0c0c0] bevel-outset border-t-2 border-white flex items-center justify-between px-1 z-40 select-none">
        {/* Start Button & Active Window Buttons */}
        <div className="flex items-center gap-1.5 h-full py-0.5">
          {/* Start Button */}
          <div className="relative h-full">
            <button
              onClick={() => {
                playRetroClick(soundEnabled);
                setStartMenuOpen(!startMenuOpen);
              }}
              className={`h-full flex items-center gap-1.5 px-2 bevel-button font-bold text-xs ${
                startMenuOpen ? 'bevel-inset bg-[#dfdfdf]' : ''
              }`}
            >
              {/* Windows Flag Icon */}
              <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
                <div className="bg-red-600" />
                <div className="bg-green-600" />
                <div className="bg-blue-600" />
                <div className="bg-yellow-400" />
              </div>
              <span>Start</span>
            </button>

            {/* Windows 95 Start Menu Popup */}
            {startMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setStartMenuOpen(false)}
                />
                <div className="absolute left-0 bottom-full mb-1 w-64 bg-[#c0c0c0] bevel-outset border-2 border-[#404040] shadow-2xl z-50 flex text-black">
                  {/* Blue vertical side banner */}
                  <div className="w-7 bg-gradient-to-t from-[#000080] to-[#1084d0] text-white flex items-end justify-center pb-3 font-bold font-sans tracking-widest uppercase [writing-mode:vertical-rl] rotate-180 text-xs">
                    Windows 95
                  </div>

                  {/* Menu items */}
                  <div className="flex-1 py-1 text-xs font-sans">
                    <button
                      onClick={() => {
                        playRetroClick(soundEnabled);
                        setActiveTab('overview');
                        setStartMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2"
                    >
                      <span>🏠</span>
                      <span>Home / Overview</span>
                    </button>
                    <button
                      onClick={() => {
                        playRetroClick(soundEnabled);
                        setActiveTab('skills');
                        setStartMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2"
                    >
                      <span>🛠️</span>
                      <span>Skills Matrix</span>
                    </button>
                    <button
                      onClick={() => {
                        playRetroClick(soundEnabled);
                        setActiveTab('projects');
                        setStartMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2"
                    >
                      <span>📁</span>
                      <span>Projects (5)</span>
                    </button>
                    <button
                      onClick={() => {
                        playRetroClick(soundEnabled);
                        setActiveTab('research');
                        setStartMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2"
                    >
                      <span>🔬</span>
                      <span>Research & Academic Work</span>
                    </button>
                    <button
                      onClick={() => {
                        playRetroClick(soundEnabled);
                        setActiveTab('education');
                        setStartMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2"
                    >
                      <span>🎓</span>
                      <span>Education & References</span>
                    </button>
                    <button
                      onClick={() => {
                        playRetroClick(soundEnabled);
                        setActiveTab('guestbook');
                        setStartMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2"
                    >
                      <span>📖</span>
                      <span>Sign Guestbook</span>
                    </button>
                    <button
                      onClick={() => {
                        playRetroClick(soundEnabled);
                        setActiveTab('terminal');
                        setStartMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2"
                    >
                      <span>📟</span>
                      <span>MS-DOS Command Prompt</span>
                    </button>

                    <hr className="retro-hr my-1" />

                    <a
                      href="/MD_AL_AMIN_RAFI_CV.pdf"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 font-bold text-red-700"
                    >
                      <span>📄</span>
                      <span>Open Original PDF CV</span>
                    </a>

                    <button
                      onClick={() => {
                        setStartMenuOpen(false);
                        handleRequireAuth(() => setIsWizardOpen(true), 'Log on as rafi to run the CV Import Wizard.');
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 font-bold text-[#b30000]"
                    >
                      <span>{isAuthenticated ? '🧙‍♂️' : '🔒'}</span>
                      <span>CV Import Wizard (Paste CV)</span>
                    </button>

                    <button
                      onClick={() => {
                        setStartMenuOpen(false);
                        handleRequireAuth(() => setIsEditorOpen(true), 'Log on as rafi to customize and edit your CV.');
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2"
                    >
                      <span>{isAuthenticated ? '📝' : '🔒'}</span>
                      <span>Notepad (Edit / Customize CV)</span>
                    </button>

                    <button
                      onClick={() => {
                        playRetroClick(soundEnabled);
                        setIsPrintView(true);
                        setStartMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2"
                    >
                      <span>🖨️</span>
                      <span>Print / Export CV</span>
                    </button>

                    <hr className="retro-hr my-1" />

                    {isAuthenticated ? (
                      <button
                        onClick={() => {
                          setStartMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 text-[#b30000] font-bold"
                      >
                        <span>🔒</span>
                        <span>Log Off rafi...</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setStartMenuOpen(false);
                          handleRequireAuth(() => {}, 'Log on with username "rafi" and password to unlock editing.');
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 text-[#000080] font-bold"
                      >
                        <span>🔑</span>
                        <span>Log On as Rafi (Admin)...</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        playWinStartupChime(soundEnabled);
                        setStartMenuOpen(false);
                        alert("It's now safe to turn off your computer. Thank you for viewing Md Al Amin Rafi's retro portfolio!");
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 text-gray-800"
                    >
                      <span>🔌</span>
                      <span>Shut Down...</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Active Window Button */}
          <div className="h-full px-3 py-0.5 bevel-inset bg-[#e0e0e0] flex items-center gap-1.5 text-xs font-bold font-mono">
            <span>🌐</span>
            <span className="hidden sm:inline">MD AL AMIN RAFI - CV.html</span>
          </div>
        </div>

        {/* System Tray (Clock, Speaker, Modem, Admin Lock) */}
        <div className="flex items-center gap-2 px-2 py-0.5 bevel-inset bg-[#dfdfdf] text-[11px] font-mono h-full">
          <button
            onClick={() => {
              if (isAuthenticated) {
                handleLogout();
              } else {
                handleRequireAuth(() => {});
              }
            }}
            className="hover:scale-110 transition-transform cursor-pointer"
            title={isAuthenticated ? 'Logged on as rafi (Admin unlocked - Click to log off)' : 'Edit mode locked (Click to log on as rafi)'}
          >
            {isAuthenticated ? '🔓' : '🔒'}
          </button>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="hover:opacity-80"
            title={soundEnabled ? 'Sound is ON (Click to mute)' : 'Sound is MUTED (Click to unmute)'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <span title="Modem Connected at 56,600 bps">🖧</span>
          <span className="font-bold text-gray-800">{currentTime || '12:00 PM'}</span>
        </div>
      </footer>

      {/* CV Import Wizard Modal */}
      <CvImportWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onApplyCv={handleSaveData}
        soundEnabled={soundEnabled}
        currentData={data}
      />

      {/* CV Editor Modal (Notepad.exe) */}
      <CvEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        data={data}
        onSave={handleSaveData}
        soundEnabled={soundEnabled}
      />

      {/* Windows 95 Admin Login Modal */}
      <Windows95LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          setPendingAuthAction(null);
        }}
        onSuccess={handleLoginSuccess}
        soundEnabled={soundEnabled}
        promptReason={loginPromptReason}
      />
    </div>
  );
}
