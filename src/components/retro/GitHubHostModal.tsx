import React, { useState } from 'react';
import { playRetroClick, playWinStartupChime } from '../../utils/audio';

interface GitHubHostModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
}

export const GitHubHostModal: React.FC<GitHubHostModalProps> = ({
  isOpen,
  onClose,
  soundEnabled,
}) => {
  if (!isOpen) return null;

  const [repoName, setRepoName] = useState('portfolio');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const gitCommands = `git remote add origin https://github.com/alaminrafi77/${repoName}.git
git branch -M main
git push -u origin main`;

  const handleCopyCommands = (idx: number, text: string) => {
    playRetroClick(soundEnabled);
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    playWinStartupChime(soundEnabled);
    setTimeout(() => setCopiedIndex(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-2 sm:p-4">
      <div className="w-full max-w-2xl bg-[#c0c0c0] bevel-outset border-2 border-[#404040] shadow-2xl flex flex-col max-h-[92vh]">
        {/* Title Bar */}
        <div className="flex items-center justify-between px-2 py-1 bg-gradient-to-r from-[#000080] to-[#1084d0] text-white font-bold text-xs select-none">
          <div className="flex items-center gap-1.5">
            <span>🐙</span>
            <span>GitHub Pages Deployment Wizard (Target: alaminrafi77)</span>
          </div>
          <button
            onClick={() => { playRetroClick(soundEnabled); onClose(); }}
            className="w-4 h-4 bevel-button text-black text-[10px] flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Header Banner */}
        <div className="bg-[#ffffff] border-b border-[#808080] p-3 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-black font-sans">
              Connect & Host on GitHub Pages
            </h3>
            <p className="text-[11px] text-gray-600">
              Follow these 3 quick steps to deploy your 1990s portfolio live on GitHub Pages with free hosting and automatic updates.
            </p>
          </div>
          <div className="text-3xl">🚀</div>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto flex-1 bg-[#f4f4f4] text-xs font-sans text-black space-y-4">
          {/* Step 1 */}
          <div className="p-3 bg-white border border-gray-300">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-xs text-[#000080] flex items-center gap-1.5">
                <span className="w-5 h-5 bg-[#000080] text-white flex items-center justify-center rounded-none font-mono text-[10px]">1</span>
                <span>Create a new repository on GitHub</span>
              </span>
              <a
                href="https://github.com/new"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 bevel-button text-xs font-bold text-[#000080] flex items-center gap-1"
              >
                <span>↗ Open github.com/new</span>
              </a>
            </div>
            <p className="text-[11px] text-gray-700 leading-normal">
              Go to <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-blue-800 underline font-bold">github.com/new</a>, name your repository (e.g. <span className="font-mono font-bold bg-gray-100 px-1">portfolio</span> or <span className="font-mono font-bold bg-gray-100 px-1">alaminrafi77.github.io</span>), select <strong>Public</strong>, and leave it empty (do NOT check Initialize with README).
            </p>

            <div className="mt-2 flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold text-gray-700">Repository Name:</span>
              <input
                type="text"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value.trim() || 'portfolio')}
                className="bevel-field px-2 py-0.5 font-mono text-xs text-[#000080] font-bold w-44"
                placeholder="portfolio"
              />
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-3 bg-white border border-gray-300">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-xs text-[#000080] flex items-center gap-1.5">
                <span className="w-5 h-5 bg-[#000080] text-white flex items-center justify-center rounded-none font-mono text-[10px]">2</span>
                <span>Push code to your GitHub Repository</span>
              </span>
              <button
                onClick={() => handleCopyCommands(2, gitCommands)}
                className="px-2.5 py-1 bevel-button text-xs font-bold text-[#008000]"
              >
                {copiedIndex === 2 ? '✓ Commands Copied!' : '📋 Copy All Git Commands'}
              </button>
            </div>
            <p className="text-[11px] text-gray-700 mb-2">
              The project is already initialized with Git and committed with all your CV data, 90s audio synthesizer, and assets. Run this command:
            </p>
            <div className="bg-black text-[#00ff41] p-2.5 font-mono text-[11px] bevel-inset overflow-x-auto leading-relaxed">
              <p>git remote add origin https://github.com/alaminrafi77/{repoName}.git</p>
              <p>git branch -M main</p>
              <p>git push -u origin main</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-3 bg-white border border-gray-300">
            <span className="font-bold text-xs text-[#000080] flex items-center gap-1.5 mb-1.5">
              <span className="w-5 h-5 bg-[#000080] text-white flex items-center justify-center rounded-none font-mono text-[10px]">3</span>
              <span>Enable GitHub Pages (Automatic via GitHub Actions)</span>
            </span>
            <p className="text-[11px] text-gray-700 leading-normal">
              1. In your GitHub repo, go to <strong>Settings</strong> → <strong>Pages</strong>.<br />
              2. Under <strong>Build and deployment &gt; Source</strong>, choose <strong>GitHub Actions</strong>.<br />
              3. The pre-configured <span className="font-mono font-bold">.github/workflows/deploy.yml</span> workflow will automatically build Vite and deploy your site!<br />
              4. Your site will be live at: <span className="font-mono font-bold text-[#000080]">https://alaminrafi77.github.io/{repoName === 'alaminrafi77.github.io' ? '' : `${repoName}/`}</span>
            </p>
          </div>

          {/* Download Full Source Archive Option */}
          <div className="p-2.5 bg-[#ffffcc] border border-[#d4d0c8] flex items-center justify-between">
            <div>
              <p className="font-bold text-xs text-black">Want to download the entire codebase to your computer?</p>
              <p className="text-[10px] text-gray-600">Download the complete source files including public assets, CV PDF, and audio synth.</p>
            </div>
            <a
              href="/md_al_amin_rafi_portfolio.tar.gz"
              download="md_al_amin_rafi_portfolio.tar.gz"
              className="px-3 py-1.5 bevel-button font-bold text-xs bg-[#c0c0c0] text-[#000080] flex items-center gap-1"
            >
              <span>💾</span>
              <span>Download .tar.gz</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-[#c0c0c0] border-t border-[#808080] flex items-center justify-between">
          <span className="text-[11px] text-[#555] font-mono">
            Configured for GitHub: alaminrafi77
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { playRetroClick(soundEnabled); onClose(); }}
              className="px-4 py-1 bevel-button text-xs font-bold"
            >
              Close
            </button>
            <a
              href="https://github.com/new"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-1 bevel-button font-bold text-xs bg-[#c0c0c0] text-[#000080]"
            >
              🚀 Open GitHub & Deploy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
