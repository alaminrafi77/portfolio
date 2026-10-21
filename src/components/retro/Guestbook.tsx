import React, { useState, useEffect } from 'react';
import { GuestbookEntry } from '../../types/portfolio';
import { initialGuestbookEntries } from '../../data/defaultCvData';
import { playRetroClick, playWinStartupChime } from '../../utils/audio';

interface GuestbookProps {
  soundEnabled: boolean;
}

export const Guestbook: React.FC<GuestbookProps> = ({ soundEnabled }) => {
  const [entries, setEntries] = useState<GuestbookEntry[]>(() => {
    try {
      const saved = localStorage.getItem('retro_guestbook_entries');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return initialGuestbookEntries;
  });

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('💻');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('retro_guestbook_entries', JSON.stringify(entries));
    } catch {
      // ignore
    }
  }, [entries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      alert('Please fill in your name and message before signing the guestbook!');
      return;
    }

    playRetroClick(soundEnabled);
    setIsSubmitting(true);

    setTimeout(() => {
      const now = new Date();
      const dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} · ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newEntry: GuestbookEntry = {
        id: `gb-${Date.now()}`,
        name: name.trim(),
        location: location.trim() || 'Cyberspace',
        email: email.trim() || 'anonymous@web.net',
        message: message.trim(),
        date: dateString,
        icon: selectedIcon,
      };

      setEntries(prev => [newEntry, ...prev]);
      setName('');
      setLocation('');
      setEmail('');
      setMessage('');
      setIsSubmitting(false);
      setSuccessNotice(true);
      playWinStartupChime(soundEnabled);

      setTimeout(() => setSuccessNotice(false), 5000);
    }, 400);
  };

  const icons = ['💻', '💾', '🕹️', '📟', '📀', '🛰️', '☕', '⚡'];

  return (
    <div className="space-y-6">
      {/* Guestbook Header Banner */}
      <div className="bg-[#ffffcc] border-2 border-[#cc9900] p-3 text-center">
        <h2 className="text-xl font-bold font-serif text-[#990000] tracking-wide flex items-center justify-center gap-2">
          <span>📖</span>
          <span>THE OFFICIAL WORLD WIDE WEB GUESTBOOK</span>
          <span>📖</span>
        </h2>
        <p className="text-xs font-mono text-[#555] mt-1">
          Leave a message, greeting, or feedback for Al-Amin Rafi!
        </p>
      </div>

      {/* Sign Form Box */}
      <div className="bg-[#d4d0c8] bevel-outset p-4 text-xs font-sans">
        <div className="bg-[#000080] text-white px-2 py-1 font-bold text-xs flex items-center justify-between mb-3">
          <span>✍️ Sign Al-Amin's Guestbook</span>
          <span className="text-[10px] text-yellow-300 font-mono">FORM METHOD=POST</span>
        </div>

        {successNotice && (
          <div className="mb-3 p-2 bg-[#d4edda] text-[#155724] border border-[#c3e6cb] font-bold text-center">
            🎉 Thank you for signing! Your entry has been recorded into the guestbook log.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-black mb-1">
                Your Name / Handle: <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Tech Recruiter, Fellow Coder"
                className="w-full bevel-field px-2 py-1 text-black outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-black mb-1">
                Your City / Country or Website:
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., San Francisco, CA / London, UK"
                className="w-full bevel-field px-2 py-1 text-black outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-black mb-1">
                Email Address (safe/optional):
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., recruiter@company.com"
                className="w-full bevel-field px-2 py-1 text-black outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-black mb-1">
                Choose 90s Avatar Icon:
              </label>
              <div className="flex items-center gap-1.5 pt-0.5">
                {icons.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => { playRetroClick(soundEnabled); setSelectedIcon(ic); }}
                    className={`w-7 h-7 bevel-button flex items-center justify-center text-sm ${selectedIcon === ic ? 'bevel-inset bg-amber-200' : ''}`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-black mb-1">
              Your Comments / Message / Project Inquiry: <span className="text-red-600">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your note here... (e.g. Great resume! We'd love to interview you for a Senior Software Engineer position...)"
              className="w-full bevel-field p-2 text-black outline-none font-mono text-xs"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#808080]">
            <span className="text-[11px] text-[#555] font-mono">
              Total Logged Entries: {entries.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="reset"
                onClick={() => { setMessage(''); setName(''); setLocation(''); setEmail(''); }}
                className="px-3 py-1 bevel-button text-xs font-bold"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1 bevel-button bg-[#c0c0c0] font-bold text-xs text-[#000080]"
              >
                {isSubmitting ? 'Posting...' : '★ Submit Entry ★'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Guestbook Entries Listing */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-black pb-1">
          <h3 className="font-bold text-sm font-mono flex items-center gap-1.5">
            <span>📜</span>
            <span>GUESTBOOK ARCHIVE LOG</span>
          </h3>
          <span className="text-xs text-[#555] font-mono">Showing {entries.length} messages</span>
        </div>

        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-white p-3 border border-[#808080] shadow-sm font-sans text-xs">
              <div className="flex flex-wrap items-center justify-between gap-1 border-b border-[#ddd] pb-1.5 mb-2 bg-[#f4f4f4] px-2 py-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{entry.icon}</span>
                  <span className="font-bold text-[#000080]">{entry.name}</span>
                  <span className="text-[#666]">from <span className="italic">{entry.location}</span></span>
                </div>
                <div className="text-[11px] font-mono text-[#888]">
                  {entry.date}
                </div>
              </div>
              <p className="text-black leading-relaxed font-mono px-2 py-1 whitespace-pre-wrap">
                {entry.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
