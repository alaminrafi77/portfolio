import React, { useState, useEffect, useRef } from 'react';
import { playRetroClick, playWinStartupChime, playRetroError } from '../../utils/audio';

interface Windows95LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  soundEnabled: boolean;
  promptReason?: string;
}

export const Windows95LoginModal: React.FC<Windows95LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  soundEnabled,
  promptReason,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const usernameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setPassword('');
      // Auto-focus username input when opening
      setTimeout(() => {
        if (usernameInputRef.current) {
          usernameInputRef.current.focus();
        }
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playRetroClick(soundEnabled);

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password;

    if (cleanUser === 'rafi' && cleanPass === 'rafirafirafi') {
      // Success!
      playWinStartupChime(soundEnabled);
      setErrorMessage(null);
      onSuccess();
      onClose();
    } else {
      // Failed login attempt
      playRetroError(soundEnabled);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);

      if (!cleanUser) {
        setErrorMessage('User name cannot be blank.');
        usernameInputRef.current?.focus();
      } else if (!cleanPass) {
        setErrorMessage('Password cannot be blank.');
        passwordInputRef.current?.focus();
      } else {
        setErrorMessage('Access Denied: The user name or password you typed is incorrect. Please try again.');
        passwordInputRef.current?.focus();
        setPassword('');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-3 select-none">
      <div
        className={`w-full max-w-md bg-[#c0c0c0] bevel-outset border-2 border-[#404040] shadow-2xl flex flex-col ${
          isShaking ? 'animate-[bounce_0.15s_infinite]' : ''
        }`}
      >
        {/* Title Bar */}
        <div className="flex items-center justify-between px-2 py-1 bg-gradient-to-r from-[#000080] to-[#1084d0] text-white font-bold text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🔑</span>
            <span className="tracking-tight">Enter Network Password - Windows 95</span>
          </div>
          <button
            onClick={() => {
              playRetroClick(soundEnabled);
              onClose();
            }}
            className="w-4 h-4 bevel-button text-black text-[10px] flex items-center justify-center font-bold"
            title="Cancel & Close"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 bg-[#c0c0c0] text-black">
          {/* Top Instruction banner */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 bg-white bevel-inset p-1 flex items-center justify-center shrink-0">
              <span className="text-3xl">🖥️</span>
            </div>
            <div className="text-xs leading-relaxed">
              <p className="font-bold text-[#000080]">Authentication Required</p>
              <p className="text-gray-800 text-[11px] mt-0.5">
                {promptReason || 'Type a user name and password to log on and unlock portfolio editing privileges.'}
              </p>
            </div>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="mb-4 p-2 bg-[#ffdddd] border border-[#b30000] flex items-start gap-2 text-xs text-[#990000]">
              <span className="text-base leading-none">❌</span>
              <div className="leading-snug">
                <span className="font-bold block">Logon Failure</span>
                <span className="text-[11px]">{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-3 font-sans text-xs">
            <div className="flex items-center">
              <label className="w-24 font-bold text-[11px]" htmlFor="win95-user">
                <span className="underline">U</span>ser name:
              </label>
              <input
                id="win95-user"
                ref={usernameInputRef}
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="rafi"
                className="flex-1 bevel-field px-2 py-1 text-xs text-black font-mono focus:outline-none focus:ring-1 focus:ring-[#000080]"
              />
            </div>

            <div className="flex items-center">
              <label className="w-24 font-bold text-[11px]" htmlFor="win95-pass">
                <span className="underline">P</span>assword:
              </label>
              <div className="flex-1 relative flex items-center">
                <input
                  id="win95-pass"
                  ref={passwordInputRef}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bevel-field px-2 py-1 pr-8 text-xs text-black font-mono focus:outline-none focus:ring-1 focus:ring-[#000080]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 text-[11px] px-1 bevel-button text-gray-700"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="flex items-center opacity-75">
              <label className="w-24 text-[11px] text-gray-600">
                <span className="underline">D</span>omain:
              </label>
              <input
                type="text"
                disabled
                value="ALAMIN-RAFI-NET"
                className="flex-1 bg-gray-200 border border-gray-400 px-2 py-0.5 text-xs text-gray-600 font-mono select-none"
              />
            </div>

            {/* Hint Box */}
            <div className="bg-[#ffffd9] border border-[#c0a060] p-2 text-[10px] text-[#665500] font-mono leading-relaxed mt-3">
              <span className="font-bold">🔒 SECURITY NOTICE:</span> Only Md Al Amin Rafi is permitted to edit portfolio data, work experience, research papers, or deploy to GitHub Pages.
            </div>

            {/* Buttons Row */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#808080]">
              <button
                type="submit"
                className="px-5 py-1 bevel-button text-xs font-bold text-black border-2 border-black focus:outline-none"
              >
                OK
              </button>
              <button
                type="button"
                onClick={() => {
                  playRetroClick(soundEnabled);
                  onClose();
                }}
                className="px-4 py-1 bevel-button text-xs text-black"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  playRetroClick(soundEnabled);
                  alert("Portfolio Admin Access:\n\nUsername: rafi\nPassword: Provided by site owner\n\nVisitors have full read-only access to resume, projects, research, and interactive terminal.");
                }}
                className="px-3 py-1 bevel-button text-xs text-gray-700"
              >
                Help
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
