import { personal } from "@/data/personal";
import { projects } from "@/data/projects";
import { experiences } from "@/data/experience";
import { skillCategories } from "@/data/skills";
import { achievements } from "@/data/achievements";
import type { PersonalInfo, Project, Experience, SkillCategory, Achievement } from "@/types";
import { createServerSupabaseClient } from "./server";

export async function getPersonalInfo(): Promise<PersonalInfo> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return personal;
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("personal_info")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return personal;
    }

    return {
      name: data.name,
      firstName: data.first_name,
      role: data.role,
      tagline: data.tagline,
      bio: data.bio,
      shortBio: data.short_bio,
      email: data.email,
      github: data.github || "",
      linkedin: data.linkedin || "",
      twitter: data.twitter || "",
      location: data.location || "",
      resumeUrl: data.resume_url || "",
      openToWork: data.open_to_work ?? true,
    };
  } catch (e) {
    console.warn("Failed to fetch personal_info from Supabase, falling back to static:", e);
    return personal;
  }
}

export async function getProjects(): Promise<Project[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return projects;
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return projects;
    }

    return data.map((d) => ({
      id: d.id,
      title: d.title,
      tagline: d.tagline,
      description: d.description,
      features: d.features || [],
      techStack: d.tech_stack || [],
      category: d.category,
      status: d.status || "completed",
      githubUrl: d.github_url || undefined,
      liveUrl: d.live_url || undefined,
      isFeatured: d.is_featured ?? false,
      businessImpact: d.business_impact || undefined,
      challenge: d.challenge || undefined,
      previewImageUrl: d.preview_image_url || null,
    }));
  } catch (e) {
    console.warn("Failed to fetch projects from Supabase, falling back to static:", e);
    return projects;
  }
}

export async function getExperiences(): Promise<Experience[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return experiences;
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return experiences;
    }

    return data.map((d) => ({
      id: d.id,
      company: d.company,
      role: d.role,
      type: d.type || "full-time",
      startDate: d.start_date,
      endDate: d.end_date || "Present",
      location: d.location || "",
      domain: d.domain || undefined,
      responsibilities: d.responsibilities || [],
      highlights: d.highlights || [],
    }));
  } catch (e) {
    console.warn("Failed to fetch experiences from Supabase, falling back to static:", e);
    return experiences;
  }
}

export async function getSkills(): Promise<SkillCategory[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return skillCategories;
  }

  try {
    const supabase = await createServerSupabaseClient();
    
    // Fetch categories
    const { data: catData, error: catError } = await supabase
      .from("skill_categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (catError || !catData || catData.length === 0) {
      return skillCategories;
    }

    // Fetch individual skills
    const { data: skillData, error: skillError } = await supabase
      .from("skills")
      .select("*")
      .order("sort_order", { ascending: true });

    const skills = skillData || [];

    return catData.map((cat) => {
      const catSkills = skills
        .filter((s) => s.category_id === cat.id)
        .map((s) => ({
          name: s.name,
          level: s.level || "intermediate",
        }));

      return {
        id: cat.slug, // Use slug as the ID for compatibility
        label: cat.label,
        icon: cat.icon,
        skills: catSkills,
      };
    });
  } catch (e) {
    console.warn("Failed to fetch skills from Supabase, falling back to static:", e);
    return skillCategories;
  }
}

export async function getAchievements(): Promise<Achievement[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return achievements;
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return achievements;
    }

    return data.map((d) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      icon: d.icon,
      year: d.year || undefined,
    }));
  } catch (e) {
    console.warn("Failed to fetch achievements from Supabase, falling back to static:", e);
    return achievements;
  }
}

export async function getPortfolioData() {
  const [personalInfo, projectsData, experiencesData, skillsData, achievementsData] = await Promise.all([
    getPersonalInfo(),
    getProjects(),
    getExperiences(),
    getSkills(),
    getAchievements(),
  ]);

  return {
    personalInfo,
    projects: projectsData,
    experiences: experiencesData,
    skills: skillsData,
    achievements: achievementsData,
  };
}
