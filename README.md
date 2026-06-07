# Nilesh's Personal Portfolio & Admin Dashboard

A modern, production-grade personal portfolio website showcasing my journey as a **Full Stack Java Developer**. Built with a scalable architecture, responsive UI, an advanced admin dashboard, a project management system, resume management, social media integration, and a recruiter-focused design to highlight skills, experience, certifications, and professional background.

## 🚀 Key Features

* **Interactive Landing Page**: Sleek dark and light theme-inspired modern UI displaying Hero, Projects, Experience Timeline, Achievements, Skills grid, and Contact Form.
* **Full-Stack Admin Dashboard (`/admin`)**: A premium dashboard with a unified overview, analytics cards, split-pane contact message inbox, and CRUD modules to update portfolio content dynamically.
* **Supabase Integration**: Stores and fetches all data (projects, experiences, skills, settings) dynamically using Row-Level Security (RLS) policies.
* **Next.js 16 App Router & TypeScript**: Built using modern Next.js 16 patterns, Turbopack, and strict type safety.
* **Robust Fail-safe Fallbacks**: Seamless automatic fallback to local static files (`data/*.ts`) if Supabase is unconfigured or unreachable.
* **Next.js 16 Auth Middleware**: Secures the administration panel via cookie-based session management, routing anonymous traffic to `/admin/login`.

## 🛠️ Tech Stack

* **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons
* **Backend**: Next.js Server Components & Route Handlers, Supabase SDK (`@supabase/ssr`)
* **Database**: PostgreSQL (Supabase) with custom schema, indexes, and automated updated-at triggers
* **Email Service**: Resend API Integration for contact form delivery

## 📦 Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/NileshCss/Nilesh.-Portfolio.git
cd portfolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory and add the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_EMAIL=rajputnileshsingh25@gmail.com
RESEND_API_KEY=re_your_resend_api_key
```

### 4. Database Setup
Initialize the database tables and RLS policies by copying the contents of `supabase/schema.sql` into the SQL Editor of your Supabase dashboard and executing the query.

### 5. Running local development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the site, or [http://localhost:3000/admin](http://localhost:3000/admin) to access the admin panel.

## ⚙️ Build and Production

To check the production build:
```bash
npm run build
npm run start
```
