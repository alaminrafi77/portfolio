import React from 'react';
import { PortfolioData } from '../../types/portfolio';
import { playRetroClick } from '../../utils/audio';

interface CvPrintViewProps {
  data: PortfolioData;
  onBack: () => void;
  soundEnabled: boolean;
}

export const CvPrintView: React.FC<CvPrintViewProps> = ({ data, onBack, soundEnabled }) => {
  const { personalInfo, projects, researchWork, education, skillCategories, languages, references } = data;

  const handlePrint = () => {
    playRetroClick(soundEnabled);
    window.print();
  };

  const downloadTextFile = (content: string, filename: string) => {
    playRetroClick(soundEnabled);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadMarkdown = () => {
    const md = `# ${personalInfo.name}
**Phone:** ${personalInfo.phone} | **Email:** ${personalInfo.email}
**GitHub:** ${personalInfo.github}
**Address:** ${personalInfo.location}

---

## PROFESSIONAL SUMMARY
${personalInfo.bio}

---

## SKILLS
${skillCategories
  .map((c) => `- **${c.category}**: ${c.skills.map((s) => s.name).join(', ')}`)
  .join('\n')}

---

## PROJECTS
${projects
  .map(
    (p) => `
- **${p.title}**: ${p.details}
  *Category:* ${p.category} | *Technologies:* ${p.technologies.join(', ')}
`
  )
  .join('\n')}

---

## RESEARCH & ACADEMIC WORK
${researchWork
  .map(
    (r) => `
- **${r.title}**: ${r.description}
`
  )
  .join('\n')}

---

## EDUCATION
${education
  .map(
    (ed) => `
### ${ed.degree}
**${ed.institution}**
${ed.statusOrHonors}
`
  )
  .join('\n')}

---

## LANGUAGES
${languages.map((l) => `- **${l.language}**: ${l.proficiency} (${l.details})`).join('\n')}

---

## REFERENCES
${references
  .map(
    (ref) => `
**${ref.name}**
${ref.designation}, ${ref.department}, ${ref.institution}
Email: ${ref.email} | Phone: ${ref.phone}
`
  )
  .join('\n')}
`;

    downloadTextFile(md, `${personalInfo.name.toLowerCase().replace(/\s+/g, '_')}_cv.md`);
  };

  return (
    <div className="bg-[#fcfbf9] text-black p-4 sm:p-8 font-serif max-w-4xl mx-auto border-2 border-black shadow-lg">
      {/* Action buttons (hidden when printing) */}
      <div className="print:hidden mb-6 flex flex-wrap items-center justify-between gap-3 p-3 bg-[#e8e8e8] border border-gray-400 font-sans text-xs">
        <button
          onClick={onBack}
          className="px-3 py-1 bevel-button font-bold text-[#000080]"
        >
          ← Back to 90s Homepage
        </button>

        <div className="flex items-center gap-2">
          <a
            href="/MD_AL_AMIN_RAFI_CV.pdf"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1 bevel-button font-bold text-red-700 bg-red-50"
          >
            📄 Open Original PDF CV
          </a>
          <button
            onClick={handleDownloadMarkdown}
            className="px-3 py-1 bevel-button font-bold"
          >
            💾 Download .md
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-1 bevel-button bg-yellow-100 font-bold text-black border-2 border-black"
          >
            🖨️ Print / Save as PDF (Ctrl+P)
          </button>
        </div>
      </div>

      {/* Printable CV Header */}
      <div className="border-b-2 border-black pb-4 mb-5">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-black mb-2 uppercase">
          {personalInfo.name}
        </h1>
        <div className="text-xs sm:text-sm font-sans text-gray-800 space-y-0.5">
          <p><span className="font-bold">Phone:</span> {personalInfo.phone} | <span className="font-bold">Email:</span> {personalInfo.email}</p>
          <p><span className="font-bold">GitHub:</span> <a href={personalInfo.github} className="underline text-blue-900">{personalInfo.github}</a></p>
          <p><span className="font-bold">Address:</span> {personalInfo.location}</p>
        </div>
      </div>

      {/* Professional Summary */}
      <section className="mb-5">
        <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-black border-b border-gray-400 pb-1 mb-2">
          Professional Summary
        </h2>
        <p className="text-xs sm:text-sm leading-relaxed text-gray-900">
          {personalInfo.bio}
        </p>
      </section>

      {/* Skills */}
      <section className="mb-5">
        <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-black border-b border-gray-400 pb-1 mb-2">
          Skills
        </h2>
        <div className="space-y-1.5 text-xs">
          {skillCategories.map((cat, idx) => (
            <div key={idx} className="leading-snug">
              <span className="font-bold font-sans text-black">{cat.category}: </span>
              <span className="text-gray-800">
                {cat.skills.map((s) => s.name).join(', ')}.
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="mb-5">
        <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-black border-b border-gray-400 pb-1 mb-2">
          Projects
        </h2>
        <div className="space-y-2 text-xs">
          {projects.map((proj) => (
            <div key={proj.id}>
              <p className="text-black leading-snug">
                <span className="font-bold">▪ {proj.title}:</span> {proj.details}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Research & Academic Work */}
      <section className="mb-5">
        <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-black border-b border-gray-400 pb-1 mb-2">
          Research & Academic Work
        </h2>
        <div className="space-y-2 text-xs">
          {researchWork.map((res) => (
            <div key={res.id}>
              <p className="text-black leading-snug">
                <span className="font-bold">▪ {res.title}:</span> {res.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mb-5">
        <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-black border-b border-gray-400 pb-1 mb-2">
          Education
        </h2>
        <div className="space-y-2 text-xs">
          {education.map((edu) => (
            <div key={edu.id}>
              <div className="flex justify-between font-bold text-black">
                <span>{edu.degree}</span>
              </div>
              <p className="italic text-gray-800">{edu.institution}</p>
              <p className="text-gray-600 font-mono text-[11px]">{edu.statusOrHonors}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Language */}
      <section className="mb-5">
        <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-black border-b border-gray-400 pb-1 mb-1">
          Language
        </h2>
        <div className="space-y-1 text-xs">
          {languages.map((l, i) => (
            <div key={i}>
              <span className="font-bold">{l.language}:</span> {l.proficiency} {l.details ? `(${l.details})` : ''}
            </div>
          ))}
        </div>
      </section>

      {/* References */}
      <section>
        <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-black border-b border-gray-400 pb-1 mb-2">
          References
        </h2>
        <div className="space-y-2 text-xs">
          {references.map((ref, idx) => (
            <div key={idx}>
              <p className="font-bold text-black">{ref.name}</p>
              <p className="text-gray-800">{ref.designation}, {ref.department}, {ref.institution}</p>
              <p className="font-mono text-[11px] text-gray-600">
                Email: {ref.email} | Phone: {ref.phone}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
