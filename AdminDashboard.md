# Admin Dashboard Setup Guide

## Overview

A full-stack admin dashboard for managing your portfolio content dynamically via **Supabase**. Located at `/admin`, it provides complete CRUD operations for all portfolio sections.

## Features

| Page | Features |
|------|----------|
| **Dashboard** | Stats overview, recent messages, quick actions |
| **Projects** | Add/Edit/Delete projects, toggle featured, search |
| **Experience** | Timeline-style entries, type badges, CRUD |
| **Skills** | Category-grouped skill editor, proficiency levels |
| **Achievements** | Card grid with CRUD |
| **Messages** | Split-pane inbox, read/unread, reply via email |
| **Settings** | Personal info, social links, Open to Work toggle |

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your **Project URL**, **anon key**, and **service_role key** from Settings → API

### 2. Run Database Schema

1. Open **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of `supabase/schema.sql`
3. Run the query to create all tables, RLS policies, and indexes

### 3. Create Admin User

In your Supabase dashboard → Authentication → Users:
1. Click "Add User" → "Create New User"
2. Email: `rajputnileshsingh25@gmail.com` (or your preferred admin email)
3. Set a secure password
4. Toggle "Auto Confirm User" ON

### 4. Configure Environment Variables

Create or update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 5. Seed Initial Data (Optional)

You can manually add your existing portfolio data through the admin dashboard, or insert it via the Supabase SQL editor.

### 6. Access the Dashboard

1. Run `npm run dev`
2. Visit `http://localhost:3000/admin/login`
3. Sign in with your admin credentials
4. Start managing your portfolio!

## Architecture

```
app/admin/
├── layout.tsx          # Dark theme layout with sidebar
├── page.tsx            # Dashboard overview
├── login/
│   ├── layout.tsx      # Bare layout (no sidebar)
│   └── page.tsx        # Login form
├── projects/page.tsx   # Projects CRUD
├── experience/page.tsx # Experience CRUD
├── skills/page.tsx     # Skills + Categories CRUD
├── achievements/page.tsx # Achievements CRUD
├── messages/page.tsx   # Contact message inbox
└── settings/page.tsx   # Personal info editor

app/api/admin/
├── auth/route.ts       # Login/Logout endpoints
├── projects/
│   ├── route.ts        # List + Create
│   └── [id]/route.ts   # Read + Update + Delete
├── experience/route.ts # Experience CRUD
├── skills/route.ts     # Skills + Categories
├── achievements/route.ts # Achievements CRUD
├── messages/route.ts   # Messages + Mark Read
└── settings/route.ts   # Personal Info

lib/supabase/
├── client.ts           # Browser client
├── server.ts           # Server client (cookies)
└── admin.ts            # Service role client (bypass RLS)

middleware.ts           # Auth protection for /admin/*
```

## Security

- **Auth**: Supabase Auth with email/password
- **Middleware**: Next.js middleware protects all `/admin/*` routes
- **RLS**: Row Level Security on all Supabase tables
  - Public read on portfolio content
  - Authenticated write for admin
  - Public insert on contact_messages
- **Service Role**: Used only server-side for privileged operations
