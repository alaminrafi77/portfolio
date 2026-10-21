import React, { useState } from 'react';
import { RetroTheme, ActiveTab } from '../../types/portfolio';
import { playRetroClick, playWinStartupChime, playDialUpSound, retroMusicPlayer } from '../../utils/audio';

interface RetroNavBarProps {
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  theme: RetroTheme;
  onChangeTheme: (theme: RetroTheme) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  crtEnabled: boolean;
  onToggleCrt: () => void;
  onOpenEditor: () => void;
  onOpenWizard: () => void;
  onOpenGitHubModal: () => void;
  onPrintCv: () => void;
  isAuthenticated: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export const RetroNavBar: React.FC<RetroNavBarProps> = ({
  currentTab,
  onSelectTab,
  theme,
  onChangeTheme,
  soundEnabled,
  onToggleSound,
  crtEnabled,
  onToggleCrt,
  onOpenEditor,
  onOpenWizard,
  onOpenGitHubModal,
  onPrintCv,
  isAuthenticated,
  onLoginClick,
  onLogoutClick,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isDialing, setIsDialing] = useState(false);
  const [addressBarUrl, setAddressBarUrl] = useState(`http://www.alamin-rafi.web/${currentTab}.html`);

  const handleTabChange = (tab: ActiveTab) => {
    playRetroClick(soundEnabled);
    onSelectTab(tab);
    setAddressBarUrl(`http://www.alamin-rafi.web/${tab}.html`);
  };

  const handleMenuClick = (menu: string) => {
    playRetroClick(soundEnabled);
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleToggleMusic = () => {
    playRetroClick(soundEnabled);
    const active = retroMusicPlayer.toggle();
    setIsPlayingMusic(active);
  };

  const handleDialUp = () => {
    playRetroClick(soundEnabled);
    setIsDialing(true);
    const stopFn = playDialUpSound(soundEnabled);
    setTimeout(() => {
      stopFn();
      setIsDialing(false);
    }, 4500);
  };

  return (
    <div className="bg-[#c0c0c0] text-black border-2 border-t-white border-l-white border-b-black border-r-black select-none">
      {/* 1. Windows 95 / Netscape Title Bar */}
      <div className="flex items-center justify-between px-2 py-1 bg-gradient-to-r from-[#000080] via-[#0033aa] to-[#1084d0] text-white font-bold text-xs select-none">
        <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="text-sm">🌐</span>
          <span className="font-mono tracking-tight">Netscape Navigator 4.0 - [MD AL AMIN RAFI · Master in Applied AI (UNITAR) · B.Sc. in CSE]</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => playRetroClick(soundEnabled)}
            className="w-4 h-4 bevel-button text-[10px] text-black flex items-center justify-center font-bold"
            title="Minimize"
          >
            _
          </button>
          <button
            onClick={() => playRetroClick(soundEnabled)}
            className="w-4 h-4 bevel-button text-[10px] text-black flex items-center justify-center font-bold"
            title="Maximize"
          >
            □
          </button>
          <button
            onClick={() => {
              playWinStartupChime(soundEnabled);
              alert("Thank you for visiting Md Al Amin Rafi's 90s Homepage! Bookmark and come back soon.");
            }}
            className="w-4 h-4 bevel-button text-[10px] text-black flex items-center justify-center font-bold hover:bg-red-600 hover:text-white"
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 2. Classic File Menu Bar */}
      <div className="flex items-center gap-0.5 px-1 py-0.5 bg-[#c0c0c0] border-b border-[#808080] text-xs font-sans relative">
        <div className="relative">
          <button
            onClick={() => handleMenuClick('file')}
            className={`px-2 py-0.5 hover:bg-[#000080] hover:text-white ${activeMenu === 'file' ? 'bg-[#000080] text-white' : ''}`}
          >
            <span className="underline">F</span>ile
          </button>
          {activeMenu === 'file' && (
            <div className="absolute left-0 top-full mt-0.5 w-56 bg-[#c0c0c0] bevel-outset py-1 z-50 shadow-md text-black">
              <button
                onClick={() => { onOpenGitHubModal(); setActiveMenu(null); }}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white text-xs font-bold text-[#000080]"
              >
                🐙 Host on GitHub Pages...
              </button>
              <button
                onClick={() => { onOpenWizard(); setActiveMenu(null); }}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white text-xs font-bold text-[#b30000]"
              >
                🧙‍♂️ CV Import Wizard...
              </button>
              <button
                onClick={() => { onOpenEditor(); setActiveMenu(null); }}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white text-xs"
              >
                Edit / Customize CV...
              </button>
              <button
                onClick={() => { onPrintCv(); setActiveMenu(null); }}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white text-xs flex justify-between"
              >
                <span>Print Resume...</span>
                <span className="text-[10px] text-gray-600">Ctrl+P</span>
              </button>
              <hr className="retro-hr my-1" />
              <button
                onClick={() => {
                  window.location.href = 'mailto:alaminrafi004@gmail.com?subject=Job%20Inquiry%20via%20Retro%20Portfolio';
                  setActiveMenu(null);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white text-xs"
              >
                Send Email (mailto)
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => handleMenuClick('edit')}
            className={`px-2 py-0.5 hover:bg-[#000080] hover:text-white ${activeMenu === 'edit' ? 'bg-[#000080] text-white' : ''}`}
          >
            <span className="underline">E</span>dit
          </button>
          {activeMenu === 'edit' && (
            <div className="absolute left-0 top-full mt-0.5 w-48 bg-[#c0c0c0] bevel-outset py-1 z-50 shadow-md text-black">
              <button
                onClick={() => {
                  navigator.clipboard.writeText('alaminrafi337@gmail.com');
                  alert('Copied email: alaminrafi337@gmail.com');
                  setActiveMenu(null);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white text-xs"
              >
                Copy Email Address
              </button>
              <button
                onClick={() => { onOpenEditor(); setActiveMenu(null); }}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white text-xs flex items-center justify-between"
              >
                <span>Open CV Notepad...</span>
                <span>{isAuthenticated ? '🔓' : '🔒'}</span>
              </button>
              <hr className="retro-hr my-1" />
              {isAuthenticated ? (
                <button
                  onClick={() => { onLogoutClick(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white text-xs text-[#b30000] font-bold"
                >
                  🔒 Log Off rafi...
                </button>
              ) : (
                <button
                  onClick={() => { onLoginClick(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white text-xs text-[#000080] font-bold"
                >
                  🔑 Log On (Admin)...
                </button>
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => handleMenuClick('view')}
            className={`px-2 py-0.5 hover:bg-[#000080] hover:text-white ${activeMenu === 'view' ? 'bg-[#000080] text-white' : ''}`}
          >
            <span className="underline">V</span>iew
          </button>
          {activeMenu === 'view' && (
            <div className="absolute left-0 top-full mt-0.5 w-48 bg-[#c0c0c0] bevel-outset py-1 z-50 shadow-md text-black">
              <button
                onClick={() => { onToggleCrt(); setActiveMenu(null); }}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white text-xs flex justify-between"
              >
                <span>CRT Scanline Filter</span>
                <span>{crtEnabled ? '✓' : ''}</span>
              </button>
              <button
                onClick={() => { onToggleSound(); setActiveMenu(null); }}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white text-xs flex justify-between"
              >
                <span>Sound Effects</span>
                <span>{soundEnabled ? '✓' : ''}</span>
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => handleMenuClick('themes')}
            className={`px-2 py-0.5 hover:bg-[#000080] hover:text-white ${activeMenu === 'themes' ? 'bg-[#000080] text-white' : ''}`}
          >
            <span className="underline">T</span>hemes
          </button>
          {activeMenu === 'themes' && (
            <div className="absolute left-0 top-full mt-0.5 w-52 bg-[#c0c0c0] bevel-outset py-1 z-50 shadow-md text-black">
              <button
                onClick={() => { onChangeTheme('win95'); setActiveMenu(null); }}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white text-xs flex justify-between"
              >
                <span>Windows 95 Classic (Teal)</span>
                <span>{theme === 'win95' ? '✓' : ''}</span>
              </button>
              <button
                onClick={() => { onChangeTheme('netscape'); setActiveMenu(null); }}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white text-xs flex justify-between"
              >
                <span>Netscape 4.0 Cyber Slate</span>
                <span>{theme === 'netscape' ? '✓' : ''}</span>
              </button>
              <button
                onClick={() => { onChangeTheme('geocities'); setActiveMenu(null); }}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white text-xs flex justify-between"
              >
                <span>GeoCities Space Neon 1997</span>
                <span>{theme === 'geocities' ? '✓' : ''}</span>
              </button>
              <button
                onClick={() => { onChangeTheme('cern91'); setActiveMenu(null); }}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white text-xs flex justify-between"
              >
                <span>CERN Tim Berners-Lee 1991</span>
                <span>{theme === 'cern91' ? '✓' : ''}</span>
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => handleMenuClick('help')}
            className={`px-2 py-0.5 hover:bg-[#000080] hover:text-white ${activeMenu === 'help' ? 'bg-[#000080] text-white' : ''}`}
          >
            <span className="underline">H</span>elp
          </button>
          {activeMenu === 'help' && (
            <div className="absolute left-0 top-full mt-0.5 w-56 bg-[#c0c0c0] bevel-outset py-1 z-50 shadow-md text-black">
              <button
                onClick={() => {
                  alert("Al-Amin Rafi - AI Engineer & Machine Learning Researcher\n\nAcademics: Pursuing M.Sc. in Artificial Intelligence (Graduate Researcher)\nPrimary Stack: Python, PyTorch, Transformers, LLMs, Computer Vision, MLOps\nEmail: alaminrafi337@gmail.com\n\nAuthentic 1990s Web 1.0 architecture built with real Web Audio synthesizer, authentic 3D bevels, and zero tracking.");
                  setActiveMenu(null);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white text-xs"
              >
                About Al-Amin Rafi...
              </button>
              <button
                onClick={() => { handleDialUp(); setActiveMenu(null); }}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white text-xs"
              >
                Test 56k Dial-Up Modem
              </button>
            </div>
          )}
        </div>

        {/* Backdrop to close menus */}
        {activeMenu && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setActiveMenu(null)}
          />
        )}
      </div>

      {/* 3. 90s Netscape Toolbar with 3D Bevel Buttons */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-[#c0c0c0] border-b border-[#808080]">
        <button
          onClick={() => handleTabChange('overview')}
          className={`flex items-center gap-1 px-2.5 py-1 bevel-button text-xs font-bold ${currentTab === 'overview' ? 'bevel-inset bg-[#dfdfdf]' : ''}`}
        >
          <span>🏠</span>
          <span>Home</span>
        </button>

        <button
          onClick={() => handleTabChange('skills')}
          className={`flex items-center gap-1 px-2.5 py-1 bevel-button text-xs font-bold ${currentTab === 'skills' ? 'bevel-inset bg-[#dfdfdf]' : ''}`}
        >
          <span>🛠️</span>
          <span>Skills</span>
        </button>

        <button
          onClick={() => handleTabChange('projects')}
          className={`flex items-center gap-1 px-2.5 py-1 bevel-button text-xs font-bold ${currentTab === 'projects' ? 'bevel-inset bg-[#dfdfdf]' : ''}`}
        >
          <span>📁</span>
          <span>Projects</span>
        </button>

        <button
          onClick={() => handleTabChange('research')}
          className={`flex items-center gap-1 px-2.5 py-1 bevel-button text-xs font-bold ${currentTab === 'research' ? 'bevel-inset bg-[#dfdfdf]' : ''}`}
        >
          <span>🔬</span>
          <span>Research</span>
        </button>

        <button
          onClick={() => handleTabChange('education')}
          className={`flex items-center gap-1 px-2.5 py-1 bevel-button text-xs font-bold ${currentTab === 'education' ? 'bevel-inset bg-[#dfdfdf]' : ''}`}
        >
          <span>🎓</span>
          <span>Education & Refs</span>
        </button>

        <button
          onClick={() => handleTabChange('guestbook')}
          className={`flex items-center gap-1 px-2.5 py-1 bevel-button text-xs font-bold ${currentTab === 'guestbook' ? 'bevel-inset bg-[#dfdfdf]' : ''}`}
        >
          <span>📖</span>
          <span>Guestbook</span>
        </button>

        <button
          onClick={() => handleTabChange('terminal')}
          className={`flex items-center gap-1 px-2.5 py-1 bevel-button text-xs font-bold ${currentTab === 'terminal' ? 'bevel-inset bg-[#dfdfdf]' : ''}`}
        >
          <span>📟</span>
          <span>Terminal</span>
        </button>

        <div className="h-6 w-[2px] bg-[#808080] border-r border-white mx-0.5" />

        {/* Real PDF CV Download Link */}
        <a
          href="/MD_AL_AMIN_RAFI_CV.pdf"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 px-2 py-1 bevel-button text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100"
          title="Open or Download Original PDF CV"
        >
          <span>📄</span>
          <span>PDF CV</span>
        </a>

        <button
          onClick={onPrintCv}
          className="flex items-center gap-1 px-2 py-1 bevel-button text-xs"
          title="Print or Export CV"
        >
          <span>🖨️</span>
          <span className="hidden sm:inline">Print CV</span>
        </button>

        <button
          onClick={onOpenWizard}
          className={`flex items-center gap-1 px-2 py-1 bevel-button text-xs font-bold ${
            isAuthenticated ? 'text-[#b30000] bg-[#ffffcc]' : 'text-gray-700 bg-gray-100'
          }`}
          title={isAuthenticated ? 'Paste your CV text to auto-fill all sections' : '🔒 Requires Admin Login - Click to log on as rafi'}
        >
          <span>{isAuthenticated ? '🧙‍♂️' : '🔒'}</span>
          <span>Import CV</span>
        </button>

        <button
          onClick={onOpenGitHubModal}
          className="flex items-center gap-1 px-2 py-1 bevel-button text-xs font-bold text-white bg-[#24292e] hover:bg-[#1b1f23]"
          title="Deploy & Host this portfolio on GitHub Pages (alaminrafi77)"
        >
          <span>🐙</span>
          <span>Host on GitHub</span>
        </button>

        <button
          onClick={onOpenEditor}
          className={`flex items-center gap-1 px-2 py-1 bevel-button text-xs font-bold ${
            isAuthenticated ? 'text-[#000080] bg-[#e6f2ff]' : 'text-gray-700 bg-gray-100'
          }`}
          title={isAuthenticated ? 'Edit or adjust individual fields' : '🔒 Requires Admin Login - Click to log on as rafi'}
        >
          <span>{isAuthenticated ? '✏️' : '🔒'}</span>
          <span>Edit CV</span>
        </button>

        {isAuthenticated ? (
          <div className="flex items-center gap-1 px-2 py-0.5 bg-[#008080] text-white bevel-inset text-[11px] font-mono">
            <span className="text-yellow-300">🔓</span>
            <span className="font-bold">rafi</span>
            <button
              onClick={onLogoutClick}
              className="ml-1 px-1.5 py-0.5 bg-[#c0c0c0] text-black bevel-button text-[10px] font-sans font-bold hover:bg-red-600 hover:text-white"
              title="Log off admin session"
            >
              Log Off
            </button>
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="flex items-center gap-1 px-2.5 py-1 bevel-button text-xs font-bold bg-[#ffff99] text-[#000080] border border-[#000080] hover:bg-[#ffffcc]"
            title="Log in as rafi (Required to edit portfolio or change data)"
          >
            <span>🔑</span>
            <span>Admin Login</span>
          </button>
        )}

        <button
          onClick={handleToggleMusic}
          className={`flex items-center gap-1 px-2 py-1 bevel-button text-xs ${isPlayingMusic ? 'bg-amber-100 text-amber-900 font-bold bevel-inset' : ''}`}
          title="Play 8-Bit Chiptune Melody (Synthesized Web Audio)"
        >
          <span>{isPlayingMusic ? '🔊' : '🎵'}</span>
          <span className="hidden sm:inline">{isPlayingMusic ? 'BGM: Playing' : '8-Bit BGM'}</span>
        </button>

        <button
          onClick={handleDialUp}
          disabled={isDialing}
          className={`flex items-center gap-1 px-2 py-1 bevel-button text-xs ${isDialing ? 'bg-yellow-200 text-yellow-900 font-bold animate-pulse' : ''}`}
          title="Simulate 1990s 56k Dial-Up Handshake Sound"
        >
          <span>☎️</span>
          <span className="hidden md:inline">{isDialing ? 'Dialing 56k...' : 'Dial-Up'}</span>
        </button>

        {/* Netscape Spinning Star Icon */}
        <div className="ml-auto w-7 h-7 bg-black bevel-inset flex items-center justify-center overflow-hidden shrink-0">
          <div className="text-sm font-black text-cyan-400 animate-spin" style={{ animationDuration: '6s' }}>
            ✶
          </div>
        </div>
      </div>

      {/* 4. Location / Netsite URL Bar */}
      <div className="flex items-center gap-2 px-2 py-1 bg-[#d4d0c8] border-b border-[#808080] text-xs">
        <span className="font-bold font-mono text-[11px] text-[#333] shrink-0">
          Location:
        </span>
        <div className="flex-1 bevel-field px-2 py-0.5 font-mono text-xs text-[#000080] flex items-center">
          <span className="truncate">{addressBarUrl}</span>
        </div>
        <button
          onClick={() => {
            playRetroClick(soundEnabled);
            alert(`Reloading ${addressBarUrl}... Document verified.`);
          }}
          className="px-2 py-0.5 bevel-button text-xs font-bold"
        >
          Go
        </button>
      </div>
    </div>
  );
};
