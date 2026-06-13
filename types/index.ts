export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  techStack: string[];
  category: string;
  status: "live" | "development" | "completed";
  githubUrl?: string;
  liveUrl?: string;
  isFeatured?: boolean;
  businessImpact?: string;
  challenge?: string;
  previewImageUrl?: string | null;
}


export interface Experience {
  id: string;
  company: string;
  role: string;
  type: "full-time" | "freelance" | "contract";
  startDate: string;
  endDate: string | "Present";
  location: string;
  responsibilities: string[];
  highlights?: string[];
  domain?: string;
}

export interface SkillCategory {
  id: string;
  label: string;
  icon: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  year?: string;
}

export interface PersonalInfo {
  name: string;
  firstName: string;
  role: string;
  tagline: string;
  bio: string;
  shortBio: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  location: string;
  resumeUrl: string;
  openToWork: boolean;
}

export interface NavItem {
  label: string;
  href: string;
}
