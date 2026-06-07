import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "moksha-sphere",
    title: "MokshaSphere",
    tagline: "AI-powered spiritual consultation platform",
    description:
      "A full-stack platform connecting users with astrologers for personalized spiritual consultations. Built with AI-assisted matching, real-time booking, and an integrated payment system — designed to scale from a startup to a production SaaS.",
    features: [
      "User & Astrologer dashboards with role-based access",
      "Consultation booking with calendar scheduling",
      "Payment integration via Razorpay",
      "Admin panel with lead management",
      "Analytics dashboard with business metrics",
      "Mobile-first responsive design",
    ],
    techStack: ["React", "Node.js", "Express.js", "MongoDB", "Razorpay"],
    category: "SaaS Platform",
    status: "completed",
    isFeatured: true,
    businessImpact:
      "Enabled astrologers to manage their practice digitally, reducing scheduling overhead and increasing consultation throughput.",
    challenge:
      "Designing a multi-role system (user / astrologer / admin) with distinct workflows while keeping the codebase clean and maintainable.",
    githubUrl: "https://github.com/rajputnileshsingh25/moksha-sphere",
  },
  {
    id: "pg-management-saas",
    title: "PG Management SaaS",
    tagline: "Complete PG & Hostel Management System",
    description:
      "A comprehensive SaaS platform for PG owners and hostel operators to manage tenants, rooms, rent collection, complaints, and billing — all in one place. Built with TypeScript for type-safety across the full stack.",
    features: [
      "Tenant lifecycle management",
      "Room inventory & allocation",
      "Automated rent collection & billing",
      "Complaint tracking & resolution workflow",
      "Owner portal & admin portal",
      "Analytics dashboard with occupancy metrics",
    ],
    techStack: ["React", "Node.js", "MySQL", "TypeScript"],
    category: "SaaS Platform",
    status: "completed",
    isFeatured: true,
    businessImpact:
      "Digitized operations for PG owners who previously relied on paper-based records, reducing rent collection errors by eliminating manual tracking.",
    challenge:
      "Handling complex billing logic (pro-rated rent, advance payments, penalties) while maintaining data integrity across multiple tenants and rooms.",
    githubUrl: "https://github.com/rajputnileshsingh25/pg-management-saas",
  },
  {
    id: "village-connect",
    title: "Village Connect",
    tagline: "Rural Marketplace Platform",
    description:
      "A digital marketplace enabling rural vendors to list services and products, connecting them with local and regional customers. Bridges the digital divide for rural commerce using Java Spring Boot on the backend.",
    features: [
      "Vendor onboarding & management",
      "Service & product listings with categories",
      "Marketplace discovery for buyers",
      "Admin dashboard for platform governance",
      "User portal with order management",
      "Rural commerce optimized UX",
    ],
    techStack: ["React", "Java", "Spring Boot", "MySQL"],
    category: "Marketplace",
    status: "completed",
    businessImpact:
      "Provided rural entrepreneurs a digital storefront, reducing dependency on physical markets and expanding their customer reach.",
    challenge:
      "Building a Java Spring Boot REST API that integrates seamlessly with a React frontend while handling location-based vendor discovery.",
    githubUrl: "https://github.com/rajputnileshsingh25/village-connect",
  },
  {
    id: "naam-haat",
    title: "Naam Haat",
    tagline: "Rural E-commerce Platform",
    description:
      "An e-commerce platform purpose-built for rural sellers and buyers — featuring a product catalog, cart, checkout, and dual-portal architecture for sellers and customers. Built with Spring Boot and vanilla frontend.",
    features: [
      "Product catalog with category filtering",
      "Shopping cart & streamlined checkout",
      "Order management & tracking",
      "Seller dashboard with inventory control",
      "Customer dashboard with order history",
      "Rural-first, lightweight UI",
    ],
    techStack: ["Java", "Spring Boot", "MySQL", "JavaScript", "HTML", "CSS"],
    category: "E-commerce",
    status: "completed",
    businessImpact:
      "Enabled rural sellers to move inventory digitally without needing expensive e-commerce platform subscriptions.",
    challenge:
      "Designing a performant, lightweight frontend that works well on low-bandwidth rural internet connections.",
    githubUrl: "https://github.com/rajputnileshsingh25/naam-haat",
  },
  {
    id: "gramin-samasya",
    title: "Gramin Samasya",
    tagline: "Community Issue Tracking Platform",
    description:
      "A civic-tech platform allowing rural community members to report local issues (roads, water, electricity) with role-based escalation, admin resolution tracking, and status updates.",
    features: [
      "Community issue reporting with categories",
      "Role-based access (citizen / authority / admin)",
      "Admin dashboard for issue resolution",
      "Status tracking & update notifications",
      "Complaint management workflow",
      "Audit trail for accountability",
    ],
    techStack: ["Java", "Spring Boot", "MySQL"],
    category: "Civic Tech",
    status: "completed",
    businessImpact:
      "Created accountability in local governance by digitizing complaint management and making issue resolution trackable.",
    challenge:
      "Implementing a clean role-based access control system in Spring Boot with secure authority escalation paths.",
    githubUrl: "https://github.com/rajputnileshsingh25/gramin-samasya",
  },
];
