export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  philosophy: string;
  github: string;
  linkedin: string;
  portfolioUrl: string;
  availableForHire: boolean;
  yearsOfExperience: number;
}

export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface Project {
  id: string;
  title: string;
  category: 'Artificial Intelligence & NLP' | 'Machine Learning & RecSys' | 'IoT & Embedded' | 'Low-Level & Assembly' | 'Computer Vision & OCR';
  year: string;
  summary: string;
  details: string;
  technologies: string[];
  demoUrl?: string;
  repoUrl?: string;
  keyFeature: string;
}

export interface ResearchWork {
  id: string;
  title: string;
  description: string;
  domain: string;
  keyInsights: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  statusOrHonors: string;
  location?: string;
}

export interface SkillCategory {
  category: string;
  skills: { name: string; level: number; note?: string }[];
}

export interface LanguageSkill {
  language: string;
  proficiency: string;
  details: string;
}

export interface ReferenceContact {
  name: string;
  designation: string;
  department: string;
  institution: string;
  email: string;
  phone: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
  badgeCode: string;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  location: string;
  email: string;
  message: string;
  date: string;
  icon: string;
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  experiences: WorkExperience[];
  projects: Project[];
  researchWork: ResearchWork[];
  education: Education[];
  skillCategories: SkillCategory[];
  languages: LanguageSkill[];
  references: ReferenceContact[];
  certifications: Certification[];
  pdfCvPath: string;
}

export type RetroTheme = 'win95' | 'netscape' | 'geocities' | 'cern91';

export type ActiveTab = 'overview' | 'skills' | 'projects' | 'research' | 'education' | 'guestbook' | 'terminal' | 'editor';
