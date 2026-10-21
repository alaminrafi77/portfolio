import React, { useState, useRef, useEffect } from 'react';
import { PortfolioData, RetroTheme } from '../../types/portfolio';
import { playRetroClick, playRetroBeep } from '../../utils/audio';

interface TerminalViewProps {
  data: PortfolioData;
  soundEnabled: boolean;
  onChangeTheme: (theme: RetroTheme) => void;
}

interface CommandHistory {
  cmd: string;
  output: string | React.ReactNode;
}

export const TerminalView: React.FC<TerminalViewProps> = ({ data, soundEnabled, onChangeTheme }) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      cmd: 'welcome',
      output: (
        <div>
          <p className="text-emerald-400 font-bold">MS-DOS Version 6.22 (C)Copyright Microsoft Corp 1981-1994.</p>
          <p className="text-amber-300">Al-Amin Rafi AI Research Console v2.0 [M.Sc. Artificial Intelligence] loaded.</p>
          <p className="text-gray-300 mt-1">Type <span className="text-white font-bold underline">help</span> or <span className="text-cyan-300 font-bold underline">ai</span> to view commands & research areas.</p>
        </div>
      ),
    },
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCmd = inputVal.trim();
    if (!cleanCmd) return;

    playRetroClick(soundEnabled);
    const parts = cleanCmd.toLowerCase().split(' ');
    const mainCmd = parts[0];
    const arg = parts[1];

    let response: React.ReactNode = '';

    switch (mainCmd) {
      case 'help':
        response = (
          <div className="space-y-1 text-gray-200">
            <p className="text-amber-300 font-bold">=== AVAILABLE TERMINAL COMMANDS ===</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-xs">
              <p><span className="text-cyan-300 font-bold">help</span> - Display this help manual</p>
              <p><span className="text-cyan-300 font-bold">ai</span> or <span className="text-cyan-300 font-bold">research</span> - Display AI & M.Sc. thesis focus</p>
              <p><span className="text-cyan-300 font-bold">cv</span> or <span className="text-cyan-300 font-bold">resume</span> - Display executive CV summary</p>
              <p><span className="text-cyan-300 font-bold">skills</span> - Print technical competencies</p>
              <p><span className="text-cyan-300 font-bold">exp</span> or <span className="text-cyan-300 font-bold">experience</span> - Print work history</p>
              <p><span className="text-cyan-300 font-bold">projects</span> - List software projects</p>
              <p><span className="text-cyan-300 font-bold">edu</span> - View education & degree info</p>
              <p><span className="text-cyan-300 font-bold">contact</span> - Output email & channels</p>
              <p><span className="text-cyan-300 font-bold">theme [win95|netscape|geocities|cern91]</span> - Switch UI theme</p>
              <p><span className="text-cyan-300 font-bold">date</span> - Print system timestamp</p>
              <p><span className="text-cyan-300 font-bold">sudo hire</span> - Executive recruitment override</p>
              <p><span className="text-cyan-300 font-bold">clear</span> or <span className="text-cyan-300 font-bold">cls</span> - Clear terminal buffer</p>
            </div>
          </div>
        );
        break;

      case 'ai':
      case 'research':
        response = (
          <div className="space-y-2 text-xs">
            <p className="text-yellow-300 font-bold">=== ARTIFICIAL INTELLIGENCE RESEARCH & MASTER'S FOCUS ===</p>
            <p className="text-white"><span className="text-cyan-300 font-bold">Academic Status:</span> Currently pursuing Master of Science (M.Sc.) in Artificial Intelligence</p>
            <p className="text-gray-300"><span className="text-cyan-300 font-bold">Core Neural Domains:</span> Transformers, Deep Learning, Fine-Tuning (LoRA/QLoRA), Retrieval-Augmented Generation (RAG), Computer Vision (YOLO/ViT), and MLOps.</p>
            <p className="text-gray-300"><span className="text-cyan-300 font-bold">Primary Frameworks:</span> PyTorch, Hugging Face, OpenCV, LangChain, CUDA, Docker.</p>
            <p className="text-emerald-300 italic">"Advancing applied machine intelligence through rigorous mathematical foundations and scalable inference architectures."</p>
          </div>
        );
        break;

      case 'cv':
      case 'resume':
      case 'cat cv.txt':
        response = (
          <div className="space-y-2 text-xs">
            <p className="text-yellow-300 font-bold">=====================================================</p>
            <p className="text-white font-bold text-sm">{data.personalInfo.name.toUpperCase()} · {data.personalInfo.title.toUpperCase()}</p>
            <p className="text-gray-300">{data.personalInfo.location} · {data.personalInfo.email}</p>
            <p className="text-yellow-300">=====================================================</p>
            <p className="text-gray-200">{data.personalInfo.bio}</p>
            <p className="text-cyan-300 italic">"{data.personalInfo.philosophy}"</p>
          </div>
        );
        break;

      case 'skills':
        response = (
          <div className="space-y-2 text-xs">
            <p className="text-amber-300 font-bold">--- TECHNICAL SKILLS MATRIX ---</p>
            {data.skillCategories.map((cat, idx) => (
              <div key={idx} className="mb-2">
                <span className="text-cyan-300 font-bold">[{cat.category}]</span>: {cat.skills.map(s => `${s.name} (${s.level}%)`).join(', ')}
              </div>
            ))}
          </div>
        );
        break;

      case 'exp':
      case 'experience':
        response = (
          <div className="space-y-3 text-xs">
            <p className="text-amber-300 font-bold">--- WORK HISTORY ---</p>
            {data.experiences.map((exp) => (
              <div key={exp.id} className="border-b border-gray-800 pb-2">
                <p className="text-white font-bold">{exp.role} @ {exp.company}</p>
                <p className="text-gray-400">{exp.startDate} - {exp.endDate} · {exp.location}</p>
                <ul className="list-disc pl-4 text-gray-300 mt-1">
                  {exp.achievements.map((ach, i) => (
                    <li key={i}>{ach}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
        break;

      case 'projects':
        response = (
          <div className="space-y-2 text-xs">
            <p className="text-amber-300 font-bold">--- FEATURED SOFTWARE PROJECTS ---</p>
            {data.projects.map((proj) => (
              <div key={proj.id} className="mb-2">
                <p className="text-cyan-300 font-bold">★ {proj.title} ({proj.year}) [{proj.category}]</p>
                <p className="text-gray-300">{proj.summary}</p>
                <p className="text-gray-400">Stack: {proj.technologies.join(', ')}</p>
              </div>
            ))}
          </div>
        );
        break;

      case 'edu':
      case 'education':
        response = (
          <div className="space-y-2 text-xs">
            <p className="text-amber-300 font-bold">--- EDUCATION & CREDENTIALS ---</p>
            {data.education.map((edu) => (
              <div key={edu.id}>
                <p className="text-white font-bold">{edu.degree}</p>
                <p className="text-cyan-300">{edu.institution} {edu.location ? `· ${edu.location}` : ''}</p>
                <p className="text-gray-400 font-mono text-[11px]">{edu.statusOrHonors}</p>
              </div>
            ))}
          </div>
        );
        break;

      case 'contact':
        response = (
          <div className="space-y-1 text-xs">
            <p className="text-amber-300 font-bold">--- CONTACT INFORMATION (MD AL AMIN RAFI) ---</p>
            <p className="text-gray-300">Phone: <span className="text-white font-bold">{data.personalInfo.phone}</span></p>
            <p className="text-gray-300">Email: <span className="text-cyan-300 font-bold">{data.personalInfo.email}</span></p>
            <p className="text-gray-300">GitHub: <span className="text-cyan-300 font-bold">{data.personalInfo.github}</span></p>
            <p className="text-gray-300">Address: <span className="text-white">{data.personalInfo.location}</span></p>
            <p className="text-yellow-300">Download CV: <a href="/MD_AL_AMIN_RAFI_CV.pdf" target="_blank" className="underline font-bold">MD_AL_AMIN_RAFI_CV.pdf</a></p>
          </div>
        );
        break;

      case 'date':
        response = <p className="text-green-400 text-xs">Current system time: {new Date().toUTCString()}</p>;
        break;

      case 'theme':
        if (['win95', 'netscape', 'geocities', 'cern91'].includes(arg)) {
          onChangeTheme(arg as RetroTheme);
          response = <p className="text-emerald-400 text-xs">Theme switched to: {arg}</p>;
        } else {
          response = <p className="text-rose-400 text-xs">Unknown theme. Options: win95, netscape, geocities, cern91</p>;
        }
        break;

      case 'sudo':
        if (arg === 'hire') {
          playRetroBeep(soundEnabled);
          response = (
            <div className="p-2 border border-emerald-500 bg-emerald-950/40 text-emerald-300 text-xs font-mono">
              <p className="font-bold">✨ ACCESS GRANTED: Candidate Al-Amin Rafi is available for hiring!</p>
              <p className="mt-1">Initiate contract offer directly via email: <a href="mailto:alaminrafi337@gmail.com" className="text-yellow-300 underline">alaminrafi337@gmail.com</a></p>
            </div>
          );
        } else {
          response = <p className="text-rose-400 text-xs">sudo: permission denied. Try 'sudo hire'.</p>;
        }
        break;

      case 'clear':
      case 'cls':
        setHistory([]);
        setInputVal('');
        return;

      default:
        playRetroBeep(soundEnabled);
        response = (
          <p className="text-rose-400 text-xs">
            Bad command or file name: '{cleanCmd}'. Type 'help' for command list.
          </p>
        );
        break;
    }

    setHistory(prev => [...prev, { cmd: cleanCmd, output: response }]);
    setInputVal('');
  };

  return (
    <div className="bg-black text-green-400 font-mono p-4 bevel-inset border-2 border-gray-600 min-h-[420px] flex flex-col justify-between text-xs sm:text-sm">
      <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2">
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400">
              <span className="font-bold">C:\ALAMIN&gt;</span>
              <span className="text-white">{item.cmd}</span>
            </div>
            <div className="pl-4 leading-relaxed">{item.output}</div>
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      <form onSubmit={handleCommand} className="mt-4 pt-3 border-t border-gray-800 flex items-center gap-2">
        <span className="text-cyan-400 font-bold shrink-0">C:\ALAMIN&gt;</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Type 'help', 'cv', 'skills', or 'projects'..."
          className="flex-1 bg-transparent text-white font-mono outline-none border-b border-gray-700 focus:border-green-400"
          autoFocus
        />
        <button type="submit" className="px-2 py-0.5 bevel-button text-black text-xs font-bold font-sans">
          Enter
        </button>
      </form>
    </div>
  );
};
