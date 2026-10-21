import React, { useState, useEffect } from 'react';
import { playRetroClick } from '../../utils/audio';

interface VisitorCounterProps {
  soundEnabled: boolean;
}

export const VisitorCounter: React.FC<VisitorCounterProps> = ({ soundEnabled }) => {
  const [hits, setHits] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('retro_hit_counter');
      if (stored) {
        const val = parseInt(stored, 10);
        return isNaN(val) ? 4839 : val;
      }
    } catch {
      // ignore
    }
    return 4839;
  });

  useEffect(() => {
    // Increment once per session
    const sessionKey = 'retro_session_counted';
    if (!sessionStorage.getItem(sessionKey)) {
      setHits(prev => {
        const next = prev + 1;
        try {
          localStorage.setItem('retro_hit_counter', next.toString());
          sessionStorage.setItem(sessionKey, 'true');
        } catch {
          // ignore
        }
        return next;
      });
    }
  }, []);

  const handleBump = () => {
    playRetroClick(soundEnabled);
    setHits(prev => {
      const next = prev + 1;
      try {
        localStorage.setItem('retro_hit_counter', next.toString());
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Pad to 6 digits
  const digitString = hits.toString().padStart(6, '0');

  return (
    <div className="inline-flex flex-col items-center p-2 bg-[#d4d0c8] bevel-outset border border-[#404040]">
      <div className="flex items-center gap-1 mb-1 text-[11px] font-bold text-[#000080] font-mono tracking-tight">
        <span>★ VISITOR COUNTER ★</span>
      </div>

      <div className="flex items-center bg-black p-1.5 bevel-inset border-2 border-[#808080] gap-0.5">
        {digitString.split('').map((digit, i) => (
          <div
            key={i}
            className="w-6 h-8 bg-gradient-to-b from-[#111111] via-[#222222] to-[#000000] border border-[#333333] flex items-center justify-center font-mono font-bold text-xl text-[#00ff41] shadow-[0_0_4px_#00ff41] select-none"
            style={{ fontFamily: "'Courier New', Courier, monospace" }}
          >
            {digit}
          </div>
        ))}
      </div>

      <div className="mt-1 flex items-center gap-2 text-[10px] text-[#444] font-mono">
        <span>Hits Since 1998</span>
        <button
          onClick={handleBump}
          title="Click to bump hit counter"
          className="px-1.5 py-0.5 bevel-button text-[9px] hover:bg-[#e0e0e0] active:bevel-inset"
        >
          +1 Hit
        </button>
      </div>
    </div>
  );
};
