import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "nv-newvacancy",
    title: "NV_NewVacancy",
    tagline: "Modern Job Portal & Career Platform",
    description:
      "A modern job portal that connects job seekers with employers. Features advanced search, real-time notifications, and application tracking.",
    features: [
      "Advanced Job Search",
      "Real-time Notifications",
      "Application Tracking"
    ],
    techStack: ["Next.js", "React", "TypeScript", "PostgreSQL"],
    category: "Job Portal & Career Platform",
    status: "live",
    isFeatured: true,
    githubUrl: "https://github.com/rajputnileshsingh25/nv-newvacancy",
    liveUrl: "https://newvacancy.vercel.app",
    businessImpact:
      "Reduced hiring latency by connecting job seekers directly with hiring managers using real-time communication protocols.",
    challenge:
      "Designing a fast multi-faceted search indexing pipeline that updates search results instantly as new jobs are published."
  },
  {
    id: "mlvpg-management",
    title: "MLVPG – Smart PG & Hostel Management",
    tagline: "Smart PG & Hostel Management SaaS",
    description:
      "Complete solution for PG and hostel owners to manage rooms, tenants, payments, complaints, and analytics in one platform.",
    features: [
      "Room & Tenant Management",
      "Payments & Invoices",
      "Analytics Dashboard"
    ],
    techStack: ["Next.js", "React", "Node.js", "PostgreSQL"],
    category: "Property & Hostel Management SaaS",
    status: "live",
    isFeatured: true,
    githubUrl: "https://github.com/rajputnileshsingh25/pg-management-saas",
    liveUrl: "https://mlvpg.vercel.app",
    businessImpact:
      "Digitized operations for multiple hostel facilities, eliminating manual billing tracking and reducing late rent payments.",
    challenge:
      "Implementing complex pro-rated billing rules and generating monthly PDF invoices with transactional integrity."
  },
  {
    id: "moksha-sphere",
    title: "MokshaSphere",
    tagline: "AI Spiritual Wellness Platform",
    description:
      "AI-powered platform connecting users with astrologers and spiritual consultants. Designed for high scale and interactive chat sessions.",
    features: [
      "User & Astrologer dashboards with role-based access",
      "Consultation booking with calendar scheduling",
      "Payment integration via Razorpay"
    ],
    techStack: ["Next.js", "Node.js", "MongoDB", "Razorpay"],
    category: "AI Spiritual Wellness Platform",
    status: "live",
    isFeatured: false,
    githubUrl: "https://github.com/rajputnileshsingh25/moksha-sphere",
    liveUrl: "https://mokshasphere.vercel.app",
    businessImpact:
      "Created an easy-to-use digital marketplace for spiritual advisors, driving up booking frequencies by 30%.",
    challenge:
      "Developing a real-time booking grid synchronized with astrologer availability calendars across various timezones."
  },
  {
    id: "gramin-samasya",
    title: "Gramin Samasya",
    tagline: "Community Issue Reporting System",
    description:
      "Platform for villagers to report issues and track resolutions by authorities, fostering direct civic engagement and transparency.",
    features: [
      "Civic issue logging with photo attachments",
      "Local authority escalation routing",
      "Public tracking of complaint lifecycles"
    ],
    techStack: ["React", "Node.js", "MongoDB", "Express"],
    category: "Rural Problem Reporting System",
    status: "live",
    isFeatured: false,
    githubUrl: "https://github.com/rajputnileshsingh25/gramin-samasya",
    liveUrl: "https://graminsamasya.vercel.app",
    businessImpact:
      "Fostered administrative accountability by putting all community issues and authority comments in a publicly readable timeline.",
    challenge:
      "Managing complex permission hierarchies (citizen vs local government vs state level inspectors) securely."
  },
  {
    id: "village-connect",
    title: "Village Connect",
    tagline: "Rural Marketplace Platform",
    description:
      "E-commerce platform for rural products and local artisans, bridging the gap between local producers and global retail customers.",
    features: [
      "Artisan onboarding and digital storefronts",
      "Mobile-friendly product catalogs",
      "Razorpay checkout for rural businesses"
    ],
    techStack: ["Next.js", "Node.js", "MongoDB", "Razorpay"],
    category: "Rural Marketplace Platform",
    status: "live",
    isFeatured: false,
    githubUrl: "https://github.com/rajputnileshsingh25/village-connect",
    liveUrl: "https://villageconnect.vercel.app",
    businessImpact:
      "Provided over 50 local artisans with a digital outlet to sell handmade goods directly, increasing average income margins.",
    challenge:
      "Creating an extremely lightweight e-commerce interface suitable for low-end mobile hardware and low-bandwidth connections."
  },
  {
    id: "fitness-hub",
    title: "Fitness Hub",
    tagline: "Fitness & Workout Platform",
    description:
      "Fitness platform with workout plans, nutrition guides, and progress tracking to help users reach their wellness goals.",
    features: [
      "Custom workout schedules and guides",
      "Nutrition intake and calorie log tools",
      "Personal fitness milestone badges"
    ],
    techStack: ["React", "Node.js", "MongoDB", "JWT"],
    category: "Fitness & Workout Platform",
    status: "live",
    isFeatured: false,
    githubUrl: "https://github.com/rajputnileshsingh25/fitness-hub",
    liveUrl: "https://fitnesshub-app.vercel.app",
    businessImpact:
      "Helped users build healthy habits with automated milestone tracking and interactive training routines.",
    challenge:
      "Implementing performant and secure authentication and session management via JSON Web Tokens."
  }
];
