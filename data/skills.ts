import type { SkillCategory } from "@/types";

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    label: "Frontend",
    icon: "Monitor",
    skills: [
      { name: "React", level: "advanced" },
      { name: "Next.js", level: "advanced" },
      { name: "TypeScript", level: "intermediate" },
      { name: "JavaScript", level: "advanced" },
      { name: "HTML5", level: "expert" },
      { name: "CSS3", level: "expert" },
      { name: "Tailwind CSS", level: "advanced" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    icon: "Server",
    skills: [
      { name: "Java", level: "advanced" },
      { name: "Spring Boot", level: "advanced" },
      { name: "Node.js", level: "advanced" },
      { name: "Express.js", level: "advanced" },
      { name: "REST APIs", level: "advanced" },
    ],
  },
  {
    id: "database",
    label: "Database",
    icon: "Database",
    skills: [
      { name: "MySQL", level: "advanced" },
      { name: "PostgreSQL", level: "intermediate" },
      { name: "MongoDB", level: "intermediate" },
      { name: "Supabase", level: "intermediate" },
    ],
  },
  {
    id: "devops",
    label: "DevOps & Tools",
    icon: "GitBranch",
    skills: [
      { name: "Git", level: "advanced" },
      { name: "GitHub", level: "advanced" },
      { name: "Docker", level: "intermediate" },
      { name: "Linux", level: "intermediate" },
      { name: "Postman", level: "advanced" },
    ],
  },
  {
    id: "ai",
    label: "AI & Productivity",
    icon: "Sparkles",
    skills: [
      { name: "ChatGPT", level: "advanced" },
      { name: "Claude", level: "advanced" },
      { name: "Cursor", level: "advanced" },
      { name: "Prompt Engineering", level: "advanced" },
    ],
  },
  {
    id: "cloud-deployment",
    label: "Cloud & Deployment",
    icon: "Cloud",
    skills: [
      { name: "Vercel", level: "advanced" },
      { name: "Netlify", level: "advanced" },
      { name: "Supabase", level: "intermediate" },
      { name: "Firebase", level: "intermediate" },
      { name: "CI/CD", level: "intermediate" },
    ],
  },
];
