import React from 'react';

export const RetroBadges: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 py-3 px-2 bg-[#d4d0c8] bevel-inset text-[10px] font-mono select-none">
      {/* 88x31 Netscape Now Badge */}
      <div className="w-[88px] h-[31px] bg-gradient-to-r from-[#000080] to-[#0055aa] text-white flex flex-col justify-center items-center border border-black shadow-inner leading-none px-1">
        <span className="font-bold text-[8px] tracking-tight uppercase text-yellow-300">NETSCAPE</span>
        <span className="text-[10px] font-black italic tracking-wider">NOW 4.0</span>
      </div>

      {/* 88x31 Best Viewed in 800x600 Badge */}
      <div className="w-[88px] h-[31px] bg-[#222222] text-[#00ff66] flex flex-col justify-center items-center border border-black leading-none px-1">
        <span className="text-[8px] uppercase tracking-tighter text-white">Best Viewed</span>
        <span className="text-[10px] font-bold">800 × 600</span>
      </div>

      {/* 88x31 Made with Notepad Badge */}
      <div className="w-[88px] h-[31px] bg-[#f0f0f0] text-black flex items-center justify-center gap-1 border border-[#808080] leading-none px-1">
        <span className="text-base">📝</span>
        <div className="flex flex-col text-left">
          <span className="text-[7px] text-[#555] uppercase">Coded in</span>
          <span className="text-[9px] font-bold">NOTEPAD</span>
        </div>
      </div>

      {/* 88x31 Valid HTML 4.01 Badge */}
      <div className="w-[88px] h-[31px] bg-[#ffeedd] text-[#aa3300] flex flex-col justify-center items-center border border-[#aa3300] leading-none px-1">
        <span className="text-[8px] font-bold uppercase">W3C</span>
        <span className="text-[9px] font-bold tracking-tight">HTML 4.01</span>
      </div>

      {/* 88x31 No Cookies Badge */}
      <div className="w-[88px] h-[31px] bg-[#004040] text-yellow-300 flex flex-col justify-center items-center border border-black leading-none px-1">
        <span className="text-[8px] uppercase">100% PURE</span>
        <span className="text-[9px] font-bold text-white">NO TRACKING</span>
      </div>

      {/* 88x31 Powered by PyTorch & AI Badge */}
      <div className="w-[88px] h-[31px] bg-[#ee4c2c] text-white flex flex-col justify-center items-center border border-black leading-none px-1">
        <span className="text-[7px] uppercase tracking-wider text-yellow-200">POWERED BY</span>
        <span className="text-[9px] font-bold tracking-tight">PYTORCH AI</span>
      </div>

      {/* 88x31 Neural Network Valid Badge */}
      <div className="w-[88px] h-[31px] bg-[#1a237e] text-cyan-300 flex flex-col justify-center items-center border border-black leading-none px-1">
        <span className="text-[7px] uppercase text-white tracking-tight">NEURAL NET</span>
        <span className="text-[9px] font-bold text-yellow-300">M.Sc. IN AI</span>
      </div>

      {/* 88x31 Any Browser Badge */}
      <div className="w-[88px] h-[31px] bg-[#551a8b] text-white flex flex-col justify-center items-center border border-black leading-none px-1">
        <span className="text-[7px] uppercase text-pink-200">VIEWABLE WITH</span>
        <span className="text-[9px] font-bold">ANY BROWSER</span>
      </div>
    </div>
  );
};
