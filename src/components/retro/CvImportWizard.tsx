import React, { useState } from 'react';
import { PortfolioData, WorkExperience, Project, Education, SkillCategory } from '../../types/portfolio';
import { playRetroClick, playWinStartupChime, playRetroBeep } from '../../utils/audio';

interface CvImportWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCv: (data: PortfolioData) => void;
  soundEnabled: boolean;
  currentData: PortfolioData;
}

export const CvImportWizard: React.FC<CvImportWizardProps> = ({
  isOpen,
  onClose,
  onApplyCv,
  soundEnabled,
  currentData,
}) => {
  if (!isOpen) return null;

  const [rawText, setRawText] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [parsedData, setParsedData] = useState<PortfolioData>(currentData);
  const [parseLog, setParseLog] = useState<string[]>([]);

  // Heuristic parser to extract common CV sections from raw text
  const parseCvText = () => {
    playRetroClick(soundEnabled);
    if (!rawText.trim()) {
      alert('Please paste your CV / Resume text first!');
      return;
    }

    const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
    const logs: string[] = [];

    // Clone current data as base
    const nextData: PortfolioData = JSON.parse(JSON.stringify(currentData));

    // 1. Extract Email
    const emailMatch = rawText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i);
    if (emailMatch) {
      nextData.personalInfo.email = emailMatch[1];
      logs.push(`✓ Extracted Email: ${emailMatch[1]}`);
    }

    // 2. Extract Phone
    const phoneMatch = rawText.match(/(\+?[0-9]{1,4}[-.\s]?[0-9]{2,5}[-.\s]?[0-9]{4,8})/);
    if (phoneMatch && phoneMatch[1].length >= 8) {
      nextData.personalInfo.phone = phoneMatch[1];
      logs.push(`✓ Extracted Phone: ${phoneMatch[1]}`);
    }

    // 3. Extract Links
    const githubMatch = rawText.match(/(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
    if (githubMatch) {
      nextData.personalInfo.github = githubMatch[0].startsWith('http') ? githubMatch[0] : `https://${githubMatch[0]}`;
      logs.push(`✓ Extracted GitHub: ${nextData.personalInfo.github}`);
    }

    const linkedinMatch = rawText.match(/(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
    if (linkedinMatch) {
      nextData.personalInfo.linkedin = linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : `https://${linkedinMatch[0]}`;
      logs.push(`✓ Extracted LinkedIn: ${nextData.personalInfo.linkedin}`);
    }

    // 4. Extract Name & Title from first few lines if available
    if (lines.length > 0) {
      // First line is very often the candidate's name
      const possibleName = lines[0].replace(/^(resume|curriculum vitae|cv)\s*:?\s*/i, '').trim();
      if (possibleName && possibleName.length < 50 && !possibleName.includes('@')) {
        nextData.personalInfo.name = possibleName;
        logs.push(`✓ Extracted Name: ${possibleName}`);
      }

      // Second line is often the job title
      if (lines.length > 1) {
        const possibleTitle = lines[1];
        if (possibleTitle && possibleTitle.length < 60 && !possibleTitle.includes('@') && !possibleTitle.match(/[0-9]{5,}/)) {
          nextData.personalInfo.title = possibleTitle;
          logs.push(`✓ Extracted Title: ${possibleTitle}`);
        }
      }
    }

    // 5. Section chunking
    const lowerText = rawText.toLowerCase();

    // Summary / Objective
    const summaryIndex = lowerText.search(/(summary|objective|about me|profile)/);
    if (summaryIndex !== -1) {
      const snippet = rawText.slice(summaryIndex).split('\n\n')[0].replace(/^(summary|objective|about me|profile):?\s*/i, '').trim();
      if (snippet.length > 30) {
        nextData.personalInfo.bio = snippet;
        logs.push(`✓ Extracted Professional Summary (${snippet.slice(0, 40)}...)`);
      }
    }

    // Check for technical skills mentions
    const commonSkills = [
      'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Express',
      'Python', 'Django', 'FastAPI', 'Java', 'Spring', 'C++', 'C#', '.NET', 'Go', 'Golang',
      'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes',
      'AWS', 'Azure', 'GCP', 'Git', 'GraphQL', 'Tailwind', 'HTML', 'CSS', 'Redux', 'Vue', 'Angular',
      'PHP', 'Laravel', 'REST API', 'Linux', 'CI/CD'
    ];

    const detectedSkills: string[] = [];
    commonSkills.forEach(skill => {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(rawText) && !detectedSkills.includes(skill)) {
        detectedSkills.push(skill);
      }
    });

    if (detectedSkills.length > 0) {
      logs.push(`✓ Detected ${detectedSkills.length} Technical Skills: ${detectedSkills.slice(0, 8).join(', ')}...`);
      // Update first skill category or distribute
      const newCategory: SkillCategory = {
        category: 'Detected Technical Competencies',
        skills: detectedSkills.map(s => ({ name: s, level: 90 })),
      };
      nextData.skillCategories = [newCategory, ...currentData.skillCategories.slice(1)];
    }

    setParsedData(nextData);
    setParseLog(logs);
    setStep(2);
    playWinStartupChime(soundEnabled);
  };

  const handleApply = () => {
    playRetroClick(soundEnabled);
    onApplyCv(parsedData);
    playWinStartupChime(soundEnabled);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-2 sm:p-4">
      <div className="w-full max-w-2xl bg-[#c0c0c0] bevel-outset border-2 border-[#404040] shadow-2xl flex flex-col max-h-[90vh]">
        {/* Title Bar */}
        <div className="flex items-center justify-between px-2 py-1 bg-gradient-to-r from-[#000080] to-[#1084d0] text-white font-bold text-xs select-none">
          <div className="flex items-center gap-1.5">
            <span>🧙‍♂️</span>
            <span>CV Import Wizard 98 (Automatic Parser)</span>
          </div>
          <button
            onClick={() => { playRetroClick(soundEnabled); onClose(); }}
            className="w-4 h-4 bevel-button text-black text-[10px] flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Wizard Banner */}
        <div className="bg-[#ffffff] border-b border-[#808080] p-3 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-black font-sans">
              {step === 1 ? 'Step 1: Paste Your Full CV Text' : 'Step 2: Review & Apply Parsed CV'}
            </h3>
            <p className="text-[11px] text-gray-600">
              {step === 1
                ? 'Copy and paste your CV text from PDF, Word, or LinkedIn. The wizard will automatically organize your portfolio.'
                : 'Review the extracted profile details below before updating your retro website.'}
            </p>
          </div>
          <div className="text-3xl">📄</div>
        </div>

        {/* Wizard Body */}
        <div className="p-4 flex-1 overflow-y-auto bg-[#f4f4f4] text-xs font-sans text-black">
          {step === 1 && (
            <div className="space-y-3">
              <label className="block font-bold text-black font-mono">
                Paste your CV text here:
              </label>
              <textarea
                rows={12}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste complete CV text here...
Example:
Al-Amin Rafi
AI Engineer & Machine Learning Researcher (M.Sc. in AI)
Email: alaminrafi337@gmail.com
Phone: +880 1700-000000
Location: Dhaka, Bangladesh

SUMMARY
Experienced AI engineer and machine learning researcher with expertise in PyTorch, LLMs, Computer Vision, and Transformer architectures...

EXPERIENCE
Lead AI & Machine Learning Engineer - NeuralVision AI Labs (2023 - Present)
- Led fine-tuning of open-source LLMs and transformer architectures...

SKILLS
Python, PyTorch, Hugging Face Transformers, LLMs, Computer Vision, OpenCV, LangChain, Docker, CUDA...

EDUCATION
M.Sc. in Artificial Intelligence (2024 - Present)
B.Sc. in Computer Science & Engineering"
                className="w-full bevel-field p-2 font-mono text-xs text-black outline-none bg-white"
                spellCheck={false}
              />
              <p className="text-[11px] text-[#555] font-mono">
                Tip: You can also edit individual fields manually at any time by clicking "Edit CV" in the top bar.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              {/* Parse Logs */}
              <div className="bg-[#111] text-green-400 p-2.5 font-mono text-[11px] bevel-inset max-h-32 overflow-y-auto space-y-1">
                <p className="text-amber-300 font-bold">=== CV PARSING LOG ===</p>
                {parseLog.map((log, i) => (
                  <p key={i}>{log}</p>
                ))}
              </div>

              {/* Parsed Fields Review */}
              <div className="bg-white p-3 border border-gray-300 space-y-2">
                <h4 className="font-bold text-[#000080] border-b pb-1">Extracted Profile Summary:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-bold text-gray-700">Name:</span> {parsedData.personalInfo.name}
                  </div>
                  <div>
                    <span className="font-bold text-gray-700">Title:</span> {parsedData.personalInfo.title}
                  </div>
                  <div>
                    <span className="font-bold text-gray-700">Email:</span> {parsedData.personalInfo.email}
                  </div>
                  <div>
                    <span className="font-bold text-gray-700">Location:</span> {parsedData.personalInfo.location}
                  </div>
                  <div className="col-span-2">
                    <span className="font-bold text-gray-700">GitHub:</span> {parsedData.personalInfo.github}
                  </div>
                </div>

                <div className="mt-2">
                  <span className="font-bold text-gray-700 block">Bio / Summary:</span>
                  <p className="text-[11px] text-gray-800 bg-[#f9f9f9] p-2 border border-gray-200 mt-1">
                    {parsedData.personalInfo.bio}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="p-2.5 bg-[#c0c0c0] border-t border-[#808080] flex items-center justify-between">
          <button
            onClick={() => { playRetroClick(soundEnabled); onClose(); }}
            className="px-4 py-1 bevel-button text-xs font-bold"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {step === 2 && (
              <button
                onClick={() => { playRetroClick(soundEnabled); setStep(1); }}
                className="px-3 py-1 bevel-button text-xs font-bold"
              >
                ← Back
              </button>
            )}

            {step === 1 ? (
              <button
                onClick={parseCvText}
                className="px-4 py-1 bevel-button font-bold text-xs bg-[#c0c0c0] text-[#000080]"
              >
                Next: Parse CV →
              </button>
            ) : (
              <button
                onClick={handleApply}
                className="px-5 py-1 bevel-button font-bold text-xs bg-[#c0c0c0] text-[#008000]"
              >
                ✓ Finish & Apply to Website
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
