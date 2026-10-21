import React, { useState } from 'react';
import { PortfolioData } from '../../types/portfolio';
import { initialPortfolioData } from '../../data/defaultCvData';
import { playRetroClick, playWinStartupChime, playRetroBeep } from '../../utils/audio';

interface CvEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PortfolioData;
  onSave: (newData: PortfolioData) => void;
  soundEnabled: boolean;
}

export const CvEditorModal: React.FC<CvEditorModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
  soundEnabled,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'general' | 'experience' | 'skills' | 'json'>('general');
  const [formData, setFormData] = useState<PortfolioData>(data);
  const [jsonText, setJsonText] = useState(JSON.stringify(data, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleSave = () => {
    playRetroClick(soundEnabled);
    if (activeTab === 'json') {
      try {
        const parsed = JSON.parse(jsonText);
        onSave(parsed);
        playWinStartupChime(soundEnabled);
        onClose();
      } catch (err: unknown) {
        playRetroBeep(soundEnabled);
        setJsonError((err as Error).message || 'Invalid JSON syntax');
      }
    } else {
      onSave(formData);
      playWinStartupChime(soundEnabled);
      onClose();
    }
  };

  const handleResetToDefault = () => {
    playRetroClick(soundEnabled);
    if (confirm('Reset CV to Al-Amin Rafi original default data?')) {
      setFormData(initialPortfolioData);
      setJsonText(JSON.stringify(initialPortfolioData, null, 2));
      onSave(initialPortfolioData);
      playWinStartupChime(soundEnabled);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4">
      {/* Windows 95 Style Dialog Window */}
      <div className="w-full max-w-3xl bg-[#c0c0c0] bevel-outset border-2 border-[#404040] shadow-2xl flex flex-col max-h-[90vh]">
        {/* Title Bar */}
        <div className="flex items-center justify-between px-2 py-1 bg-gradient-to-r from-[#000080] to-[#1084d0] text-white font-bold text-xs select-none shrink-0">
          <div className="flex items-center gap-1.5">
            <span>📝</span>
            <span>NOTEPAD.EXE - [Resume / CV Data Editor]</span>
            <span className="text-[10px] bg-emerald-700 text-yellow-300 px-1.5 py-0.2 bevel-inset font-mono">
              Admin: rafi
            </span>
          </div>
          <button
            onClick={() => { playRetroClick(soundEnabled); onClose(); }}
            className="w-4 h-4 bevel-button text-black text-[10px] flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 px-3 pt-2 bg-[#c0c0c0] border-b border-[#808080] text-xs font-sans shrink-0">
          <button
            onClick={() => { playRetroClick(soundEnabled); setActiveTab('general'); }}
            className={`px-3 py-1 font-bold ${activeTab === 'general' ? 'bg-[#ffffff] text-black bevel-thin-inset border-b-transparent -mb-[1px]' : 'bg-[#c0c0c0] text-gray-700 bevel-button'}`}
          >
            General Profile
          </button>
          <button
            onClick={() => { playRetroClick(soundEnabled); setActiveTab('experience'); }}
            className={`px-3 py-1 font-bold ${activeTab === 'experience' ? 'bg-[#ffffff] text-black bevel-thin-inset border-b-transparent -mb-[1px]' : 'bg-[#c0c0c0] text-gray-700 bevel-button'}`}
          >
            Experience & Roles
          </button>
          <button
            onClick={() => { playRetroClick(soundEnabled); setActiveTab('skills'); }}
            className={`px-3 py-1 font-bold ${activeTab === 'skills' ? 'bg-[#ffffff] text-black bevel-thin-inset border-b-transparent -mb-[1px]' : 'bg-[#c0c0c0] text-gray-700 bevel-button'}`}
          >
            Skills Matrix
          </button>
          <button
            onClick={() => {
              playRetroClick(soundEnabled);
              setJsonText(JSON.stringify(formData, null, 2));
              setActiveTab('json');
            }}
            className={`px-3 py-1 font-bold ${activeTab === 'json' ? 'bg-[#ffffff] text-black bevel-thin-inset border-b-transparent -mb-[1px]' : 'bg-[#c0c0c0] text-gray-700 bevel-button'}`}
          >
            Raw JSON / CV Import
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto flex-1 bg-white font-sans text-xs text-black">
          {activeTab === 'general' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Full Name:</label>
                  <input
                    type="text"
                    value={formData.personalInfo.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personalInfo: { ...formData.personalInfo, name: e.target.value },
                      })
                    }
                    className="w-full bevel-field px-2 py-1 font-mono text-xs text-black"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Job Title:</label>
                  <input
                    type="text"
                    value={formData.personalInfo.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personalInfo: { ...formData.personalInfo, title: e.target.value },
                      })
                    }
                    className="w-full bevel-field px-2 py-1 font-mono text-xs text-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Email Address:</label>
                  <input
                    type="email"
                    value={formData.personalInfo.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personalInfo: { ...formData.personalInfo, email: e.target.value },
                      })
                    }
                    className="w-full bevel-field px-2 py-1 font-mono text-xs text-black"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Location / Timezone:</label>
                  <input
                    type="text"
                    value={formData.personalInfo.location}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personalInfo: { ...formData.personalInfo, location: e.target.value },
                      })
                    }
                    className="w-full bevel-field px-2 py-1 font-mono text-xs text-black"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Tagline / Motto:</label>
                <input
                  type="text"
                  value={formData.personalInfo.tagline}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personalInfo: { ...formData.personalInfo, tagline: e.target.value },
                    })
                  }
                  className="w-full bevel-field px-2 py-1 font-mono text-xs text-black"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Professional Bio / Summary:</label>
                <textarea
                  rows={4}
                  value={formData.personalInfo.bio}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personalInfo: { ...formData.personalInfo, bio: e.target.value },
                    })
                  }
                  className="w-full bevel-field p-2 font-mono text-xs text-black"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Engineering Philosophy:</label>
                <input
                  type="text"
                  value={formData.personalInfo.philosophy}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personalInfo: { ...formData.personalInfo, philosophy: e.target.value },
                    })
                  }
                  className="w-full bevel-field px-2 py-1 font-mono text-xs text-black"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">GitHub URL:</label>
                  <input
                    type="text"
                    value={formData.personalInfo.github}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personalInfo: { ...formData.personalInfo, github: e.target.value },
                      })
                    }
                    className="w-full bevel-field px-2 py-1 font-mono text-xs text-black"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">LinkedIn URL:</label>
                  <input
                    type="text"
                    value={formData.personalInfo.linkedin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personalInfo: { ...formData.personalInfo, linkedin: e.target.value },
                      })
                    }
                    className="w-full bevel-field px-2 py-1 font-mono text-xs text-black"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-4">
              <p className="text-gray-600">
                Edit your work roles. Each role includes company name, title, date range, and key achievements.
              </p>
              {formData.experiences.map((exp, idx) => (
                <div key={exp.id} className="p-3 bg-[#f8f8f8] border border-[#ccc]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                    <div>
                      <span className="font-bold text-[11px] block">Role:</span>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => {
                          const updated = [...formData.experiences];
                          updated[idx].role = e.target.value;
                          setFormData({ ...formData, experiences: updated });
                        }}
                        className="w-full bevel-field px-1.5 py-0.5 text-xs text-black"
                      />
                    </div>
                    <div>
                      <span className="font-bold text-[11px] block">Company:</span>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => {
                          const updated = [...formData.experiences];
                          updated[idx].company = e.target.value;
                          setFormData({ ...formData, experiences: updated });
                        }}
                        className="w-full bevel-field px-1.5 py-0.5 text-xs text-black"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-[11px] block">Technologies (comma separated):</span>
                    <input
                      type="text"
                      value={exp.technologies.join(', ')}
                      onChange={(e) => {
                        const updated = [...formData.experiences];
                        updated[idx].technologies = e.target.value.split(',').map(s => s.trim());
                        setFormData({ ...formData, experiences: updated });
                      }}
                      className="w-full bevel-field px-1.5 py-0.5 text-xs text-black"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-3">
              <p className="text-gray-600">
                Modify your core competencies and proficiency ratings.
              </p>
              {formData.skillCategories.map((cat, catIdx) => (
                <div key={catIdx} className="p-2 border border-gray-300 bg-gray-50">
                  <span className="font-bold text-[#000080]">{cat.category}</span>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {cat.skills.map((skill, sIdx) => (
                      <div key={sIdx} className="bg-white border px-1.5 py-0.5 text-xs flex items-center gap-1">
                        <span>{skill.name}</span>
                        <span className="text-gray-500 text-[10px]">({skill.level}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold">Paste or Edit JSON CV directly:</span>
                <span className="text-gray-500 text-[11px]">Valid JSON schema supported</span>
              </div>
              {jsonError && (
                <div className="p-2 bg-red-100 border border-red-400 text-red-700 text-xs font-mono">
                  Error: {jsonError}
                </div>
              )}
              <textarea
                rows={12}
                value={jsonText}
                onChange={(e) => {
                  setJsonText(e.target.value);
                  setJsonError(null);
                }}
                className="w-full font-mono text-xs p-2 bevel-field bg-black text-green-400"
                spellCheck={false}
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-2 bg-[#c0c0c0] border-t border-[#808080] flex items-center justify-between shrink-0">
          <button
            onClick={handleResetToDefault}
            className="px-3 py-1 bevel-button text-xs font-bold text-red-800"
          >
            Reset to Default
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { playRetroClick(soundEnabled); onClose(); }}
              className="px-4 py-1 bevel-button text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1 bevel-button bg-[#c0c0c0] text-[#000080] font-bold text-xs"
            >
              💾 Save & Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
