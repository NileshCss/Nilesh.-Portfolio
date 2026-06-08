🧪 MASTER PROMPT — Admin Dashboard Full Audit, Testing & Bug Fix

ROLE
Act as a Senior QA Engineer, Senior Full Stack Developer,
Security Auditor, and DevOps Engineer combined.

Your job is to:
1. Systematically test every single feature of the Admin Dashboard
2. Identify all bugs, broken functionality, missing features,
   UI issues, and security vulnerabilities
3. Fix every issue found
4. Verify the fix works
5. Report what was broken and what was fixed

Do NOT skip any section.
Do NOT assume anything works without testing it.
Test everything end to end.

STEP 1 — PRE-FLIGHT CHECKLIST
Before testing features, verify the project can run:

□ 1.1 — ENVIRONMENT CHECK
  Run: npm run dev
  Expected: Server starts on localhost:3000 with no errors
  Check: No TypeScript compilation errors
  Check: No missing module errors
  Check: No environment variable warnings
  Fix if broken: Install missing deps, fix import paths,
                 add missing env vars to .env.local

□ 1.2 — ENVIRONMENT VARIABLES CHECK
  Verify .env.local contains:
    NEXT_PUBLIC_SUPABASE_URL         → not empty, valid URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY    → not empty, starts with "eyJ"
    SUPABASE_SERVICE_ROLE_KEY        → not empty, starts with "eyJ"
    NEXT_PUBLIC_APP_URL              → set correctly
    RESEND_API_KEY                   → set (or mark as optional)
    NEXT_PUBLIC_GA_ID                → set (or mark as optional)
  Fix if missing: Add placeholder values + comment explaining
                  which are required vs optional

□ 1.3 — SUPABASE CONNECTION CHECK
  Test: Can app connect to Supabase?
  Run a simple query: SELECT 1 from settings
  If fails: Check URL + key, check network, check RLS policies
  Fix: Update credentials, add missing tables via SQL editor

□ 1.4 — DATABASE TABLES EXISTENCE CHECK
  Verify ALL these tables exist in Supabase:
    □ profiles
    □ settings
    □ projects
    □ project_images
    □ experience
    □ skills
    □ achievements
    □ certifications
    □ social_links
    □ contact_submissions
    □ resume_versions
    □ media_library
    □ seo_settings
    □ activity_logs
    □ meeting_requests
  If any missing: Run the CREATE TABLE SQL from the schema
  Fix: Provide exact SQL to run in Supabase SQL Editor

□ 1.5 — RLS POLICIES CHECK
  Verify Row Level Security is enabled on all tables
  Verify public read policies exist for published content
  Verify authenticated-only policies for admin writes
  Fix: Add missing policies via Supabase dashboard or SQL

□ 1.6 — MIDDLEWARE CHECK
  File: middleware.ts must exist at project root
  Must protect /admin/* routes (except /admin/login)
  Must redirect unauthenticated users to /admin/login
  Must redirect authenticated users away from /admin/login
  Fix if broken: Rewrite middleware.ts completely

□ 1.7 — BUILD CHECK
  Run: npm run build
  Expected: Build succeeds with 0 errors
  Warnings are OK but errors must be fixed
  Fix: Resolve all TypeScript errors, missing props,
       invalid imports, unresolved modules

STEP 2 — AUTHENTICATION SYSTEM AUDIT
□ 2.1 — LOGIN PAGE RENDERS
  Visit: /admin/login
  Check: Page loads without crash
  Check: N. logo visible in top
  Check: Email field present and functional
  Check: Password field present and functional
  Check: Show/hide password toggle works
  Check: "Forgot password?" link is visible and clickable
  Check: "Sign In to Dashboard" button present
  Check: Security note at bottom present
  Fix: Repair any missing UI elements

□ 2.2 — LOGIN FORM VALIDATION
  Test A: Submit empty form
    Expected: Validation errors on both fields
    "Email is required" and "Password is required"
  Test B: Submit invalid email format (e.g. "notanemail")
    Expected: "Please enter a valid email address"
  Test C: Submit email without password
    Expected: "Password is required"
  Fix: Add/repair Zod validation + React Hook Form errors

□ 2.3 — LOGIN WITH WRONG CREDENTIALS
  Test: Enter wrong email/password
  Expected:
    - Loading spinner appears on button during request
    - Button disabled during loading
    - Error message appears: "Invalid credentials. Please try again."
    - Error box: red bg, red border, alert icon
    - Form not cleared (email stays, password clears)
  Fix: Handle Supabase auth error codes properly

□ 2.4 — LOGIN WITH CORRECT CREDENTIALS
  Test: Enter correct admin email + password
  Expected:
    - Loading state appears
    - On success: redirect to /admin/dashboard
    - Toast: "Welcome back, Nilesh!" (success green)
    - Dashboard loads with user data
  Fix: Check supabase.auth.signInWithPassword() call,
       fix redirect logic using next/navigation router.push()

□ 2.5 — PROTECTED ROUTE REDIRECT (unauthenticated)
  Test: Open browser incognito
  Visit: /admin/dashboard (without being logged in)
  Expected: Immediately redirected to /admin/login
  Test all protected routes:
    /admin/dashboard → /admin/login ✓
    /admin/projects  → /admin/login ✓
    /admin/settings  → /admin/login ✓
  Fix: Update middleware.ts matchers if failing

□ 2.6 — AUTHENTICATED REDIRECT
  Test: While logged in, visit /admin/login
  Expected: Redirected to /admin/dashboard
  Fix: Add getSession check at top of login page component

□ 2.7 — SESSION PERSISTENCE
  Test: Log in, close browser tab, reopen /admin/dashboard
  Expected: Still logged in (session persisted in localStorage)
  Fix: Ensure Supabase client uses createBrowserClient() correctly

□ 2.8 — LOGOUT FUNCTIONALITY
  Test: Click user avatar → click "Logout"
  Expected:
    - supabase.auth.signOut() called
    - Redirect to /admin/login
    - Cannot access /admin/dashboard after logout
  Fix: Repair logout button handler

□ 2.9 — FORGOT PASSWORD FLOW
  Visit: /admin/forgot-password
  Check: Page renders with email input + "Send Reset Link" button
  Test: Enter valid email → submit
  Expected: Success message "Check your email for a reset link"
  Test: Enter invalid email → submit
  Expected: Validation error
  Fix: Wire up supabase.auth.resetPasswordForEmail()

□ 2.10 — THEME TOGGLE ON LOGIN PAGE
  Test: Theme toggle button visible on login page
  Test: Clicking switches light ↔ dark theme
  Test: Choice persists on page refresh
  Fix: Ensure ThemeProvider wraps the admin layout

STEP 3 — ADMIN LAYOUT AUDIT
□ 3.1 — SIDEBAR RENDERS
  Check: Sidebar visible on dashboard load
  Check: N. logo + "Admin Panel" text visible at top
  Check: Hamburger toggle (≡) button visible
  Check: All 15 menu items present:
    Dashboard | Projects | Experience | Skills |
    Achievements | Certifications | Resume |
    Social Links | Contact Messages | Analytics |
    SEO Manager | Media Library | Settings | Users | Activity Logs
  Check: Section labels visible (MAIN, CONTENT, ANALYTICS, SYSTEM)
  Fix: Add any missing menu items

□ 3.2 — SIDEBAR ACTIVE STATE
  Test: Click "Projects" menu item
  Expected:
    - Projects item background: #2563EB
    - Projects item text: white
    - Projects icon: white
    - Previous active item deactivated
    - URL changes to /admin/projects
  Fix: Repair usePathname() active state logic

□ 3.3 — SIDEBAR COLLAPSE/EXPAND
  Test: Click hamburger (≡) toggle button
  Expected:
    - Sidebar collapses to icon-only (width ~60px)
    - Menu item text hides, only icons show
    - Toggle button still visible
    - Content area expands
    - Animation smooth (0.3s ease)
  Test: Click toggle again
  Expected: Sidebar expands back to 240px
  Fix: Implement CSS transition on sidebar width + conditional text display

□ 3.4 — SIDEBAR ON MOBILE (≤768px)
  Test: Resize browser to 375px width
  Expected:
    - Sidebar hidden by default (off-screen)
    - Hamburger button in top navbar/header is visible
    - Clicking hamburger: sidebar slides in from left
    - Overlay appears on content area
    - Clicking overlay: sidebar closes
    - Sidebar shows full items (not collapsed)
  Fix: Add mobile sidebar drawer behavior with overlay

□ 3.5 — ADMIN NAVBAR RENDERS
  Check: Top navbar visible (height 60px)
  Check: Page title + subtitle on left ("Dashboard", subtitle text)
  Check: Date range picker on right
  Check: Notification bell on right
  Check: Theme toggle on right
  Check: Avatar/user button on right
  Fix: Add any missing navbar elements

□ 3.6 — ADMIN NAVBAR — PAGE TITLE UPDATES
  Test: Navigate to different pages
  Expected: Left side title updates per page:
    /admin/dashboard        → "Dashboard"
    /admin/projects         → "Projects"
    /admin/contact-messages → "Contact Messages"
  Fix: Pass page title as prop or use usePathname() to derive

□ 3.7 — THEME TOGGLE IN ADMIN NAVBAR
  Test: Click theme toggle (sun/moon icon)
  Expected:
    - Entire admin UI switches light ↔ dark
    - Sidebar stays dark (independent of theme)
    - Content area, cards, inputs change with theme
    - Animation: icon rotates/transitions
    - Preference saved to localStorage
    - Persists on page refresh
  Fix: Ensure ThemeProvider correctly applied,
       sidebar has hardcoded dark colors not using CSS vars

□ 3.8 — USER DROPDOWN MENU
  Test: Click avatar button in navbar
  Expected dropdown:
    - "View Profile" — navigates to /admin/settings
    - "Change Password" — navigates to /admin/settings#security
    - "Logout" — calls signOut + redirect
  Check: Dropdown closes on outside click
  Check: Dropdown closes on ESC key
  Fix: Repair dropdown positioning and outside-click handler

□ 3.9 — NOTIFICATION BELL
  Test: Click notification bell
  Expected: Dropdown panel opens showing:
    - "New message from Aman Verma" (if unread messages)
    - Or "No new notifications" empty state
    - Red badge disappears after opening
  Fix: Wire up to unread contact_submissions count from Supabase

□ 3.10 — SIDEBAR USER CARD (BOTTOM)
  Check: "Nilesh Kumar Singh" name visible
  Check: "Admin" role text visible
  Check: N. avatar icon visible
  Check: Chevron icon visible
  Test: Click card → dropdown with Profile | Settings | Logout
  Fix: Show actual logged-in user name from Supabase session

STEP 4 — DASHBOARD HOME PAGE AUDIT
□ 4.1 — STATS CARDS RENDER
  Check: All 5 stats cards visible:
    Total Projects | Total Visitors | Profile Views |
    Resume Downloads | Contact Messages
  Check: Each card shows:
    □ Title text
    □ Large number value
    □ Colored icon box (40×40px) with SVG
    □ Change indicator (↑ X% this month)
  Fix: If showing 0 everywhere, check Supabase queries

□ 4.2 — STATS CARDS — REAL DATA
  Test: Add a project via Projects page
  Expected: "Total Projects" increments
  Test: Submit contact form on public site
  Expected: "Contact Messages" increments
  Fix: If counts not updating, fix SELECT COUNT(*) queries

□ 4.3 — STATS CARDS — LOADING STATE
  Test: Slow network (Chrome DevTools → Network → Slow 3G)
  Expected: Skeleton loaders (animated gray bars) while loading
  Not acceptable: blank cards or "0" flashing then updating
  Fix: Add Suspense + skeleton loader components

□ 4.4 — RECENT PROJECTS TABLE
  Check: "Recent Projects" card visible
  Check: 5 projects listed (or fewer if less exist)
  Check: Each row shows:
    □ Thumbnail (colored placeholder if no image)
    □ Project name
    □ "Updated X ago" relative time
    □ Status badge (Published/Draft/Archived)
    □ Edit (pencil) icon
    □ View (eye) icon
    □ Delete (trash) icon
  Check: "View All" link navigates to /admin/projects
  Fix: Query projects table ORDER BY updated_at DESC LIMIT 5

□ 4.5 — RECENT PROJECTS — ACTION ICONS
  Test: Click pencil icon on a project row
  Expected: Navigates to edit form for that project
  Test: Click eye icon
  Expected: Opens project in new tab (public URL)
  Test: Click trash icon
  Expected:
    - Confirmation dialog: "Delete MokshaSphere? This cannot be undone."
    - Cancel: closes dialog
    - Confirm: deletes project, removes from list, success toast
  Fix: Repair click handlers for each action

□ 4.6 — VISITORS OVERVIEW CHART
  Check: Line chart renders (Recharts LineChart)
  Check: x-axis shows dates (7 days)
  Check: y-axis shows visitor counts
  Check: Line is smooth curve with data points
  Check: Hover shows tooltip with date + count
  Check: Chart responsive on resize
  Fix: If chart blank, check Recharts import + data array format:
    [{ date: "May 18", visitors: 450 }, ...]
  Fix: Add ResponsiveContainer wrapper if chart overflows

□ 4.7 — QUICK ACTIONS PANEL
  Check: "Quick Actions" section visible (right column)
  Check: 4 buttons present:
    "+ Add New Project"
    "Upload New Resume"
    "Add Experience"
    "Update Profile Info"
  Test: Click each button
    "Add New Project" → navigates to /admin/projects (open add drawer)
    "Upload New Resume" → navigates to /admin/resume
    "Add Experience" → navigates to /admin/experience
    "Update Profile Info" → navigates to /admin/settings
  Fix: Wire up onClick handlers with router.push()

□ 4.8 — PROFILE STATUS CARD
  Check: 4 rows visible:
    Profile Complete | Resume Updated | Open to Work | Email Verified
  Check: Green checkmarks visible
  Check: Values right-aligned
  Check: "Open to Work" shows "Enabled" in green
  Fix: Fetch from settings table for real values

□ 4.9 — RECENT MESSAGES SECTION
  Check: "Recent Messages" card visible
  Check: Shows 2-3 latest contact_submissions
  Check: Each shows: avatar initial + name + email + subject preview + date + New badge
  Check: "View All" → navigates to /admin/contact-messages
  Fix: Query contact_submissions ORDER BY created_at DESC LIMIT 3

□ 4.10 — RESUME SECTION
  Check: "Resume" card shows current resume filename
  Check: File size visible
  Check: Upload date visible
  Check: "Download" button works (opens PDF)
  Check: "Replace Resume" link visible

□ 4.11 — STORAGE USAGE BAR
  Check: "2.4 GB / 10 GB used" text (or real values)
  Check: Progress bar width = percentage used
  Check: Percentage label right-aligned
  Fix: Calculate from media_library table SUM(file_size)

STEP 5 — PROJECTS MANAGEMENT AUDIT
□ 5.1 — PROJECTS LIST PAGE LOADS
  Visit: /admin/projects
  Check: Page title "Projects" + "Add New Project" button
  Check: Filter bar (search + category + status dropdowns)
  Check: Table renders with columns:
    Checkbox | Thumbnail | Name | Status | Tech Stack | Actions
  Check: Pagination at bottom
  Fix: Any render errors

□ 5.2 — SEARCH FUNCTIONALITY
  Test: Type "Moksha" in search box
  Expected: Table filters to show only MokshaSphere
  Test: Clear search
  Expected: All projects return
  Test: Search for non-existent term
  Expected: Empty state "No projects found matching your search"
  Fix: Implement client-side or server-side search with debounce (300ms)

□ 5.3 — FILTER BY STATUS
  Test: Select "Draft" from status dropdown
  Expected: Only draft projects shown
  Test: Select "Published"
  Expected: Only published projects shown
  Test: Select "All"
  Expected: All projects shown
  Fix: Add WHERE status = filter to Supabase query

□ 5.4 — ADD NEW PROJECT DRAWER
  Test: Click "Add New Project" button
  Expected:
    - Right-side drawer slides in from right (560px wide)
    - Overlay appears on left
    - Form title "Add New Project"
    - All fields present (see field list below)
    - Cancel and Save buttons at bottom
  Fix: Check Drawer component open/close state

□ 5.5 — ADD PROJECT FORM — ALL FIELDS PRESENT
  Verify these fields exist in the add/edit form:
    □ Project Name* (text input)
    □ Slug* (auto-generated, editable)
    □ Category* (select dropdown)
    □ Status* (select: Draft/Published/Archived)
    □ Featured (toggle switch)
    □ Display Order (number input)
    □ Description* (textarea, min 3 rows)
    □ Responsibilities (textarea)
    □ Challenges (textarea)
    □ Business Impact (textarea)
    □ Tech Stack* (tag input — type + Enter)
    □ GitHub URL (url input)
    □ Live URL (url input)
    □ Completion Date (date picker)
    □ Thumbnail (file upload / drag-drop)
    □ Gallery (multi-file upload)
    □ SEO section (collapsible): Meta Title | Meta Description | Keywords
  Fix: Add any missing fields

□ 5.6 — SLUG AUTO-GENERATION
  Test: Type "My Awesome Project" in Project Name
  Expected: Slug field auto-fills as "my-awesome-project"
  Test: Manually edit slug field
  Expected: Manual value preserved, no auto-override
  Fix: Add onChange handler on name field to slugify and set slug

□ 5.7 — TECH STACK TAG INPUT
  Test: Click tech stack input, type "React"
  Press Enter or comma
  Expected: "React" appears as a pill/tag
  Test: Add 3 more tags: "Node.js", "MySQL", "TypeScript"
  Test: Click X on a tag
  Expected: Tag removed
  Fix: Implement tag input component if missing

□ 5.8 — THUMBNAIL UPLOAD
  Test: Drag image onto upload zone
  Expected: Image preview appears in the zone
  Test: Click zone → file picker opens → select image
  Expected: Same preview behavior
  Test: Upload non-image file (e.g. .txt)
  Expected: Error "Only image files are accepted"
  Fix: Wire to Supabase Storage upload,
       validate file type + size (max 2MB)

□ 5.9 — FORM VALIDATION ON SAVE
  Test: Click "Save Project" with empty required fields
  Expected: Inline validation errors:
    "Project name is required"
    "Description is required"
    "Category is required"
  Fields highlighted in red border
  Fix: Zod schema + React Hook Form error display

□ 5.10 — CREATE PROJECT (END TO END)
  Fill in all required fields:
    Name: "Test Project QA"
    Category: SaaS
    Status: Draft
    Description: "Testing the project creation flow..."
    Tech: React, Node.js
  Click "Save Project"
  Expected:
    - Loading spinner on button
    - INSERT to Supabase projects table
    - Drawer closes
    - New project appears in table
    - Toast: "Project created successfully" (green)
    - Stats card increments
  Fix: Debug Supabase insert, check RLS policies

□ 5.11 — EDIT PROJECT
  Test: Click pencil icon on any project
  Expected:
    - Drawer opens
    - All existing project data pre-filled in form
    - Title changes to "Edit Project"
  Make a change (e.g. change status to Published)
  Click "Save Changes"
  Expected:
    - UPDATE in Supabase
    - Drawer closes
    - Row updates in table
    - Toast: "Project updated successfully"
  Fix: Check that edit mode fetches project data + uses PUT/PATCH

□ 5.12 — DELETE PROJECT
  Test: Click trash icon on "Test Project QA"
  Expected: Confirmation dialog appears
  Click "Delete"
  Expected:
    - DELETE from Supabase
    - Row removed from table
    - Toast: "Project deleted"
    - Stats count decrements
  Fix: Repair delete handler + confirmation dialog

□ 5.13 — STATUS BADGE DISPLAY
  Check: Published = green badge
  Check: Draft = amber/yellow badge
  Check: Archived = gray badge
  Fix: Correct badge color mapping

□ 5.14 — FEATURED TOGGLE
  Test: Toggle "Featured" on a project
  Expected: Changes persist after page refresh
  Fix: Update featured column in Supabase

□ 5.15 — PAGINATION
  If more than 10 projects:
    Check: Next page button works
    Check: Page numbers visible
    Check: Total count accurate ("Showing 1-10 of 12 projects")
  Fix: Implement .range() pagination in Supabase query

STEP 6 — EXPERIENCE PAGE AUDIT
□ 6.1 — PAGE LOADS
  Visit: /admin/experience
  Check: Page renders without crash
  Check: Table or list of experience items
  Check: "Add Experience" button present
  Fix: Any render errors

□ 6.2 — ADD EXPERIENCE
  Click "Add Experience"
  Fill: Company, Role, Type, Location, Start Date, toggle "Currently Working"
  Expected: End Date field disables when "Currently Working" is ON
  Click "Save"
  Expected: New entry in list, success toast
  Fix: Wire toggle to disable end date field

□ 6.3 — EDIT EXPERIENCE
  Click edit on existing entry
  Expected: Form pre-filled with existing data
  Change role text → Save
  Expected: Updated in list, toast confirmation
  Fix: Pre-fill form with existing values on edit

□ 6.4 — DELETE EXPERIENCE
  Click delete → confirm dialog → delete
  Expected: Removed from list, toast
  Fix: DELETE from experience table

□ 6.5 — DISPLAY ORDER
  Test: Change display order numbers
  Expected: List reorders on save
  Fix: Re-fetch ordered by display_order ASC after save

STEP 7 — SKILLS PAGE AUDIT
□ 7.1 — PAGE LOADS WITH TABS
  Check: Category tabs present:
    Frontend | Backend | Database | DevOps | Cloud | AI | Tools
  Check: Default tab shows relevant skills
  Fix: Tab state management

□ 7.2 — ADD SKILL
  Click "Add Skill"
  Fill: Name "React", Category "Frontend", Proficiency "Advanced"
  Expected: New skill card/tag appears in Frontend tab
  Fix: INSERT to skills table + re-render

□ 7.3 — EDIT SKILL
  Click edit on a skill
  Change name or proficiency
  Expected: Updated immediately
  Fix: UPDATE in skills table

□ 7.4 — DELETE SKILL
  Click delete → confirm → removed
  Fix: DELETE from skills table

□ 7.5 — SWITCH TABS
  Click "Backend" tab
  Expected: Shows only backend skills
  Click "All" (if exists)
  Expected: All skills shown
  Fix: Filter skills WHERE category = activeTab

STEP 8 — RESUME PAGE AUDIT
□ 8.1 — PAGE LOADS
  Visit: /admin/resume
  Check: Current resume section visible
  Check: Upload zone visible
  Check: Version history table visible
  Fix: Any render errors

□ 8.2 — FILE UPLOAD
  Test A: Drag valid PDF onto upload zone
  Expected:
    - Drop zone highlights (border color changes, bg changes)
    - Upload progress bar appears (0% → 100%)
    - On complete: file info shows (name, size, date)
    - Upload to Supabase Storage bucket
    - INSERT to resume_versions table
    - Previous "current" version marked as not current
    - Success toast: "Resume uploaded successfully"
  Fix: Wire supabase.storage.from('resumes').upload()

  Test B: Try uploading .docx (invalid type)
  Expected: Error "Only PDF files are accepted"
  Fix: Validate file type before upload

  Test C: Try uploading file > 5MB
  Expected: Error "File size must be under 5MB"
  Fix: Validate file size before upload

□ 8.3 — DOWNLOAD RESUME
  Click "Download" button
  Expected: PDF downloads to user's computer
  Fix: Use Supabase storage public URL or signed URL

□ 8.4 — VERSION HISTORY
  Upload 2-3 resumes
  Expected: Version history table shows all with:
    Version number | Date | File size | Download | Restore | Delete
  Test "Restore" on older version
  Expected: That version becomes current
  Fix: UPDATE is_current = true on selected, false on others

□ 8.5 — DELETE RESUME VERSION
  Click delete on a non-current version
  Expected: Removed from history + Supabase Storage
  Test: Try deleting current version
  Expected: Error or warning "Cannot delete current resume"
  Fix: Guard against deleting is_current = true version

□ 8.6 — DOWNLOAD COUNTER
  Check: Total download count visible
  Test: Download resume from public portfolio
  Expected: Counter increments
  Fix: Increment download_count in resume_versions table
       via POST /api/resume/download

STEP 9 — CONTACT MESSAGES AUDIT
□ 9.1 — MESSAGES LIST LOADS
  Visit: /admin/contact-messages
  Check: Table renders with columns
  Check: Message count "12 messages · 3 unread"
  Fix: COUNT query from contact_submissions

□ 9.2 — SUBMIT CONTACT FORM (public)
  Visit: / (homepage) → scroll to Contact section
  Fill form: Name, Email, Subject, Message
  Submit
  Expected:
    - POST to /api/contact
    - INSERT to contact_submissions
    - Success message shown on form
    - Form resets
    - Admin dashboard "Contact Messages" badge increments
  Fix: Repair /api/contact route + Supabase insert

□ 9.3 — NEW MESSAGE APPEARS IN DASHBOARD
  After submitting public form
  Go to /admin/contact-messages
  Expected: New message appears at top with "New" badge
  Fix: Re-fetch on page load, or use real-time subscription

□ 9.4 — MARK AS READ
  Test: Click eye icon (or open message)
  Expected: Status changes to "Read", "New" badge disappears
  Fix: UPDATE status = 'read' WHERE id = messageId

□ 9.5 — MESSAGE DETAIL VIEW
  Click on a message row
  Expected: Right drawer opens showing:
    Full name, email, phone (if provided)
    Subject (larger font)
    Full message body
    Timestamp
    Status badge
    "Mark as Read" button
    "Reply" button
  Fix: Fetch full message on row click

□ 9.6 — REPLY FUNCTIONALITY
  Click "Reply" button
  Expected: Textarea appears for reply message
  Click "Send Reply"
  Expected: Opens mailto: with pre-filled reply
    OR sends via Resend API
  Fix: Implement mailto: fallback if Resend not configured

□ 9.7 — SEARCH MESSAGES
  Type name/email in search box
  Expected: Filtered results
  Fix: Filter on name, email, subject fields

□ 9.8 — FILTER BY STATUS
  Select "Unread" filter
  Expected: Only unread messages shown
  Fix: WHERE status = filter value

□ 9.9 — ARCHIVE MESSAGE
  Click archive on a message
  Expected: Moved to archived, not shown in main view
  Fix: UPDATE status = 'archived'

□ 9.10 — DELETE MESSAGE
  Click delete → confirm → deleted
  Expected: Removed from list, toast
  Fix: DELETE from contact_submissions

□ 9.11 — EXPORT TO CSV
  Click Export button
  Expected: CSV file downloads with all message data
  Fix: Build CSV string from messages array + trigger download

STEP 10 — ANALYTICS PAGE AUDIT
□ 10.1 — PAGE LOADS
  Visit: /admin/analytics
  Check: Page renders with charts
  Check: No blank white boxes where charts should be
  Fix: Check Recharts import + data format

□ 10.2 — DATE RANGE SELECTOR
  Test: Click "Last 7 Days"
  Expected: All charts update to show 7-day data
  Test: Click "Last 30 Days"
  Expected: Charts update to 30-day range
  Fix: Pass date range as state to all chart queries

□ 10.3 — OVERVIEW STATS CARDS
  Check: Total Visitors | Page Views | Bounce Rate | Avg Session
  Check: Real numbers (not all zeros)
  Fix: Wire to GA4 API or mock with reasonable test data

□ 10.4 — VISITORS OVER TIME CHART
  Check: AreaChart renders with dates on x-axis
  Check: Gradient fill visible below line
  Check: Hover tooltip shows date + count
  Check: Responsive (chart resizes with window)
  Fix: Wrap in <ResponsiveContainer width="100%" height={200}>

□ 10.5 — TRAFFIC SOURCES PIE CHART
  Check: PieChart renders with colored slices
  Check: Legend shows: Direct | Google | LinkedIn | GitHub | Other
  Check: Hover shows percentage
  Fix: Pass valid data array to PieChart:
    [{ name: "Direct", value: 40 }, ...]

□ 10.6 — TOP PAGES BAR CHART
  Check: Horizontal bar chart renders
  Check: Pages listed (/, /projects, /about, etc.)
  Fix: Use BarChart with layout="vertical" in Recharts

□ 10.7 — DEVICE TYPES CHART
  Check: Pie or donut chart for Desktop/Mobile/Tablet
  Fix: Same pattern as traffic sources

□ 10.8 — ALL CHARTS RESPONSIVE
  Resize to 768px width
  Expected: All charts fit within screen, no overflow
  Fix: All charts need ResponsiveContainer with 100% width

STEP 11 — SEO MANAGER AUDIT
□ 11.1 — PAGE LOADS WITH TABS
  Visit: /admin/seo
  Check: Tabs: Global SEO | Per-Page | Schema | Sitemap | Robots
  Fix: Tab navigation working

□ 11.2 — GLOBAL SEO FORM SAVE
  Edit Meta Title → click "Save Changes"
  Expected: UPDATE in seo_settings table
  Toast: "SEO settings updated"
  Refresh page → changes persist
  Fix: Supabase upsert on seo_settings (id=1)

□ 11.3 — CHARACTER COUNTER
  Type in Meta Description field
  Expected: Counter shows "X / 160 characters"
  If over 160: counter turns red
  Fix: Add character count state + conditional color

□ 11.4 — OG IMAGE UPLOAD
  Upload image in OG Image section
  Expected: Preview shows uploaded image
  Fix: Wire to Supabase Storage

□ 11.5 — SITEMAP GENERATION
  Click "Generate Sitemap"
  Expected: Sitemap XML generated with all public URLs
  Click "Download sitemap.xml"
  Expected: File downloads
  Fix: Generate XML string from routes + project slugs

□ 11.6 — ROBOTS.TXT EDITOR
  Edit robots.txt textarea
  Click "Save"
  Expected: Saved to seo_settings.robots_txt
  Visit /robots.txt route
  Expected: Shows saved content
  Fix: Create app/robots.txt/route.ts that reads from Supabase

STEP 12 — MEDIA LIBRARY AUDIT
□ 12.1 — PAGE LOADS IN GRID VIEW
  Visit: /admin/media
  Check: File grid renders (5 columns)
  Check: "Upload Files" button visible
  Check: Search + filter bar present
  Fix: Any render errors

□ 12.2 — FILE UPLOAD
  Click "Upload Files" → select image
  Expected:
    - Progress bar during upload
    - Image appears in grid on completion
    - Toast: "File uploaded successfully"
  Fix: Wire to supabase.storage.from('media').upload()

□ 12.3 — DRAG AND DROP UPLOAD
  Drag image file onto page
  Expected: Page highlights as drop zone, then uploads
  Fix: Add dragover + drop event handlers on page wrapper

□ 12.4 — FILE PREVIEW
  Click on an image in grid
  Expected: Modal opens with full-size image preview
  Check: File name, size, dimensions, upload date shown
  Check: "Copy URL" button copies Supabase public URL
  Check: "Download" and "Delete" buttons present
  Fix: Compute public URL from Supabase storage path

□ 12.5 — DELETE FILE
  Click delete icon on file card → confirm → deleted
  Expected: Removed from grid + Supabase Storage
  Fix: Call supabase.storage.from('media').remove([path])
       + DELETE from media_library table

□ 12.6 — SEARCH FILES
  Type filename in search
  Expected: Grid filters to matching files
  Fix: Client-side filter OR Supabase ILIKE query

□ 12.7 — FILTER BY TYPE
  Select "Images" from type filter
  Expected: Only image files shown
  Fix: WHERE file_type LIKE 'image/%'

□ 12.8 — GRID ↔ LIST VIEW TOGGLE
  Click list view icon
  Expected: Switches to table layout
  Fix: Toggle between grid CSS and table component

STEP 13 — SETTINGS PAGE AUDIT
□ 13.1 — ALL TABS RENDER
  Check tabs: Profile | Website | Availability | Theme | Security | Notifications
  Click each tab
  Expected: Tab content loads without crash
  Fix: Tab state management

□ 13.2 — PROFILE TAB — LOAD REAL DATA
  Expected: Full Name, Email, Phone, Location, Bio fields
            pre-filled from profiles + settings tables
  Fix: Fetch from Supabase on page load

□ 13.3 — PROFILE TAB — SAVE
  Change a field → click "Save Profile"
  Expected: UPDATE in settings table
  Toast: "Profile updated"
  Refresh → changes persist
  Fix: Supabase UPDATE + revalidate

□ 13.4 — WEBSITE SETTINGS TAB
  Expected: Hero Heading, Tagline, Description fields loaded from DB
  Change hero heading → Save
  Visit public homepage
  Expected: Heading updated on live site
  Fix: Public homepage reads from settings table via server component

□ 13.5 — AVAILABILITY TOGGLE
  Test: Change status to "Not Available"
  Click "Update Status"
  Visit public homepage
  Expected: Status badge changes to "Not Available"
  Fix: Update settings.availability_status + revalidate public page

□ 13.6 — OPEN TO WORK TOGGLE
  Toggle OFF "Open to Work"
  Expected: Homepage hero badge disappears
  Toggle ON
  Expected: "Open To Work" badge reappears
  Fix: Conditional rendering in Hero section based on settings

□ 13.7 — CHANGE PASSWORD
  Enter current + new + confirm password
  Click "Update Password"
  Expected: supabase.auth.updateUser({ password }) called
  Toast: "Password updated. Please log in again."
  Redirect to /admin/login
  Fix: Wire Supabase updateUser + session refresh

□ 13.8 — SECURITY TAB — ACTIVE SESSIONS
  Expected: Current session listed (device + browser + date)
  Fix: supabase.auth.getSession() to show current session info

□ 13.9 — NOTIFICATION PREFERENCES
  Toggle some notifications OFF → Save
  Refresh page
  Expected: Toggle states persist
  Fix: Save to settings table as JSON column

STEP 14 — ACTIVITY LOGS AUDIT
□ 14.1 — PAGE LOADS
  Visit: /admin/activity-logs
  Check: Table with columns: Timestamp | Action | Description | IP | Device | Status
  Fix: Any render errors

□ 14.2 — LOGS ARE BEING WRITTEN
  Perform these actions:
    Login → log entry for "Login Successful"
    Create a project → log entry for "Project Created"
    Upload resume → log entry for "Resume Uploaded"
    View a message → log entry for "Message Viewed"
  Visit logs page
  Expected: Each action appears as a row
  Fix: Add logActivity() helper function:
    async function logActivity(action, description, resourceType?, resourceId?) {
      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action,
        description,
        resource_type: resourceType,
        resource_id: resourceId,
        ip_address: request.ip,
        user_agent: request.headers['user-agent'],
        status: 'success'
      })
    }
  Call this after every significant admin action

□ 14.3 — FAILED LOGIN LOGGING
  Test: Enter wrong password 3 times
  Visit logs page
  Expected: 3 "Login Failed" entries with IP and timestamp
  Fix: Log failed logins in /admin/login form handler

□ 14.4 — FILTER BY ACTION TYPE
  Select "Project" from type filter
  Expected: Only project-related logs shown
  Fix: WHERE action ILIKE '%project%' OR resource_type = 'project'

□ 14.5 — DATE FILTER
  Select today's date range
  Expected: Only today's logs shown
  Fix: WHERE created_at >= startDate AND created_at <= endDate

□ 14.6 — PAGINATION
  Check: 20 logs per page
  Check: Next/Previous navigation works
  Fix: .range(from, to) in Supabase query

STEP 15 — SOCIAL LINKS AUDIT
□ 15.1 — ALL PLATFORMS LISTED
  Check: GitHub | LinkedIn | X | LeetCode | HackerRank |
         Medium | YouTube | Email | Phone | WhatsApp
  All 10-11 platforms present
  Fix: Seed social_links table with platform names

□ 15.2 — UPDATE URL
  Click on GitHub card
  Change URL to "https://github.com/nileshkumarsingh"
  Click "Save All Links"
  Expected: URL saved to Supabase
  Visit public portfolio footer
  Expected: GitHub icon links to new URL
  Fix: UPDATE social_links WHERE platform = 'github'

□ 15.3 — ENABLE / DISABLE
  Toggle LinkedIn to DISABLED
  Expected:
    - Card shows disabled state (gray, strikethrough or opacity 0.5)
    - LinkedIn icon disappears from public footer
  Toggle back to ENABLED
  Expected: LinkedIn icon returns on public footer
  Fix: WHERE enabled = true in public footer query

□ 15.4 — CLICK COUNTER
  Check: Each platform shows click count
  Test: Click social icon on public portfolio
  Expected: Click count increments in admin
  Fix: POST /api/social/click?platform=github →
       UPDATE social_links SET click_count = click_count + 1

STEP 16 — CONNECT MODAL AUDIT
□ 16.1 — MODAL OPENS
  Test: Click "Connect With Me" in navbar
  Expected: Modal appears with scale+fade animation
  Test: Click "Schedule Meeting" in hero
  Expected: Same modal opens
  Test: Click CTA banner "Schedule Meeting"
  Expected: Same modal opens
  Fix: Ensure all 3 trigger points call openConnectModal()

□ 16.2 — MODAL CLOSES
  Test A: Click X button → modal closes
  Test B: Press ESC → modal closes
  Test C: Click dark overlay → modal closes
  Expected: All 3 methods close modal
  Fix: ESC listener, overlay onClick, X button onClick

□ 16.3 — EMAIL CARD
  Click Email card
  Expected: Opens email client with mailto:rajputnileshsingh25@gmail.com
  Fix: window.location.href = 'mailto:...'

□ 16.4 — LINKEDIN CARD
  Click LinkedIn card
  Expected: Opens linkedin.com in new tab
  Fix: window.open(url, '_blank', 'noopener')

□ 16.5 — CALENDAR CARD TOGGLE
  Click "Schedule a Video Call" card
  Expected: Calendar expands below with animation
  Click again
  Expected: Calendar collapses
  Fix: Toggle state + CSS max-height transition

□ 16.6 — CALENDAR — SELECT DAY
  Test: Click on a future date
  Expected:
    - Day highlights blue
    - "Available Times" section appears below calendar
    - 6 time slots visible
  Test: Click on a past date
  Expected: Click has no effect (disabled)
  Fix: Disable past dates, show time slots on future day select

□ 16.7 — CALENDAR — SELECT TIME
  Click a time slot (e.g. "10:00 AM")
  Expected:
    - Slot highlights blue
    - "Confirm Meeting →" button appears
  Click different slot
  Expected: Previous deselects, new selects
  Fix: selectedTime state management

□ 16.8 — CONFIRM MEETING
  Select day + time → click "Confirm Meeting →"
  Expected:
    - Loading state on button
    - POST to /api/meetings
    - INSERT to meeting_requests table
    - Success state shows:
      Green checkmark circle
      "Meeting Scheduled!"
      Confirmation message with day + time
    - Modal auto-closes after 4 seconds
  Fix: Wire /api/meetings POST route + Supabase insert

□ 16.9 — TIMEZONE AUTO-DETECTION
  Check: Timezone row shows user's real timezone
    e.g. "🌍 Timezone: Asia/Kolkata (auto-detected)"
  Fix: Intl.DateTimeFormat().resolvedOptions().timeZone

□ 16.10 — MODAL THEME
  Test in light mode: Modal has white/light background
  Test in dark mode: Modal has dark card background
  Fix: Modal uses var(--bg-card) and var(--text-primary)

STEP 17 — PUBLIC PORTFOLIO THEME TOGGLE AUDIT
□ 17.1 — THEME TOGGLE VISIBLE IN NAV
  Check: Sun/Moon icon button in public navbar
  Check: Visible on all pages
  Fix: ThemeToggle component in Navbar.tsx

□ 17.2 — THEME SWITCHES CORRECTLY
  Start in light mode:
    Background: white (#FFFFFF)
    Text: dark (#0F172A)
    Nav: semi-transparent white
    Cards: white with gray borders
  Click toggle → dark mode:
    Background: #0A0F1E
    Text: light (#F1F5F9)
    Nav: semi-transparent dark
    Cards: dark (#111827) with dark borders
  Fix: All CSS variables must swap completely

□ 17.3 — NO FLASH ON LOAD (FOUC)
  Test: Refresh page while in dark mode
  Expected: Page loads immediately in dark mode
  NOT acceptable: White flash then dark
  Fix: Add script in <head> before CSS loads:
    <script>
      const theme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      document.documentElement.classList.add(theme)
    </script>

□ 17.4 — THEME PERSISTS ACROSS PAGES
  Set dark mode on homepage
  Navigate to /projects
  Expected: Still in dark mode
  Navigate to /contact
  Expected: Still in dark mode
  Fix: ThemeProvider at root layout level

□ 17.5 — ALL SECTIONS THEME CORRECTLY
  In dark mode, check each homepage section:
    □ Hero: dark bg, light text ✓
    □ Value prop cards: dark card bg ✓
    □ Project cards: dark bg ✓
    □ Tech grid: dark cells ✓
    □ CTA banner: dark bg ✓
    □ Footer: dark bg ✓
  In light mode check same sections
  Fix any section that doesn't respond to theme

□ 17.6 — FORM INPUTS THEME CORRECTLY
  In dark mode:
    Inputs: dark bg, light text, dark border
    Focus: blue glow visible on dark bg
    Placeholder: muted visible on dark bg
  Fix: form-input uses var(--bg-primary) + var(--text-primary)

□ 17.7 — STAT BAR THEME
  Dark mode: card bg dark, icons visible, text light
  Light mode: card bg white, borders visible
  Fix: Use CSS variables throughout stat bar

□ 17.8 — SIDEBAR ALWAYS DARK
  Switch to light mode
  Navigate to /admin/dashboard
  Expected: Sidebar stays dark (#0F172A) regardless of theme
  Content area changes with theme
  Fix: Sidebar has hardcoded dark colors, NOT CSS variables

STEP 18 — RESPONSIVENESS AUDIT
□ 18.1 — TEST AT THESE BREAKPOINTS:
  480px  (Mobile S)
  768px  (Tablet)
  1024px (Laptop)
  1280px (Desktop)
  1536px (Large Desktop)

□ 18.2 — PUBLIC NAVBAR (Mobile ≤768px)
  Check: Nav links hidden
  Check: Hamburger button visible
  Check: Logo visible
  Check: Theme toggle visible
  Check: Hamburger click → menu drops down
  Check: Menu links close menu when clicked
  Fix: Mobile nav implementation

□ 18.3 — HERO SECTION (Mobile)
  Check: Two-column → one column stacked
  Check: Sidebar card below main content
  Check: Name heading readable (clamp font-size works)
  Check: 3 buttons wrap (flex-wrap)
  Check: Stat bar → 2×2 grid
  Fix: grid-template-columns: 1fr on mobile

□ 18.4 — PROJECTS GRID (Mobile)
  Check: 3-column → 1-column on mobile
  Check: Cards full width
  Fix: grid-template-columns: 1fr at 480px

□ 18.5 — TECH GRID (Mobile)
  Check: 6-column → 2-column on 480px
  Check: Text readable in 2-col layout
  Fix: Adjust grid breakpoints

□ 18.6 — FOOTER (Mobile)
  Check: 5-column → 2-column → 1-column
  Check: Social icons visible
  Check: Copyright text fits
  Fix: Grid responsive breakpoints

□ 18.7 — ADMIN SIDEBAR (Mobile)
  Check: Sidebar hidden at 768px
  Check: Hamburger in admin navbar
  Check: Sidebar slides in on tap
  Check: Content area full width when sidebar hidden
  Fix: Mobile drawer implementation

□ 18.8 — ADMIN STATS CARDS (Mobile)
  Check: 5 cards → 2-column → 1-column
  Fix: Responsive grid

□ 18.9 — CONNECT MODAL (Mobile)
  Check: Modal takes full width (calc(100% - 40px))
  Check: Padding appropriate on small screens
  Check: Calendar grid fits in modal
  Check: Time slots 2 columns on mobile (not 3)
  Fix: Modal max-width + responsive time grid

□ 18.10 — ADMIN TABLES (Mobile/Tablet)
  Check: Table scrolls horizontally if too wide
  Check: Text doesn't overflow cells
  Fix: overflow-x: auto on table container

STEP 19 — SECURITY AUDIT
□ 19.1 — ADMIN LINK NOT IN PUBLIC NAV
  Check: Public navbar has NO "Admin" link
  Check: Admin is ONLY accessible via Footer link
  Fix: Remove from Navbar.tsx if present

□ 19.2 — DIRECT URL ACCESS PROTECTION
  Incognito browser → visit /admin/projects
  Expected: Redirected to /admin/login (never shows data)
  Fix: Middleware must catch all /admin/* routes

□ 19.3 — API ROUTE PROTECTION
  Open DevTools → Network tab
  From incognito, fetch: GET /api/admin/contact
  Expected: 401 Unauthorized response
  Fix: Every /api/admin/* route must verify session:
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

□ 19.4 — CONTACT FORM RATE LIMITING
  Submit contact form 10 times rapidly
  Expected: After 3-5 submissions, rate limit error:
    "Too many requests. Please wait before trying again."
  Fix: Implement rate limiting with IP + timestamp check
       or use Upstash Redis rate limiter

□ 19.5 — INPUT SANITIZATION
  Test: Submit contact form with script:
    Name: "<script>alert('xss')</script>"
    Message: "javascript:void(0)"
  Expected:
    - Script tags stripped or escaped before storage
    - No XSS execution
  Fix: Sanitize inputs server-side before Supabase insert
       Use DOMPurify or strip HTML tags

□ 19.6 — PASSWORD FIELD SECURITY
  Check: Password field has type="password"
  Check: Password not logged to console
  Check: Show/hide toggle uses type toggle (not visible text)
  Fix: type === 'password' ? 'text' : 'password' toggle

□ 19.7 — SUPABASE RLS VERIFICATION
  Test: Using Supabase client with anon key (not service role)
  Try inserting a project without authentication
  Expected: 403 or empty result (RLS blocks it)
  Fix: Ensure RLS policies are correctly set:
    CREATE POLICY "Authenticated users can insert projects"
    ON projects FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

□ 19.8 — ENVIRONMENT VARIABLES NOT EXPOSED
  Check browser Network tab responses
  Expected: SUPABASE_SERVICE_ROLE_KEY never appears in any
            client-side response, page source, or JS bundle
  Fix: Service role key only used in server-side code
       Never prefixed with NEXT_PUBLIC_

STEP 20 — PERFORMANCE AUDIT
□ 20.1 — RUN LIGHTHOUSE
  Open Chrome DevTools → Lighthouse
  Run on: http://localhost:3000
  Expected scores:
    Performance:    ≥ 90
    Accessibility:  ≥ 95
    Best Practices: ≥ 95
    SEO:            ≥ 95

□ 20.2 — FIX COMMON PERFORMANCE ISSUES
  Images not using next/image:
    Fix: Replace all <img> with <Image> from 'next/image'
  Missing width/height on images:
    Fix: Add width and height props to all Image components
  Font not optimized:
    Fix: Use next/font/google for Outfit + JetBrains Mono
  Large bundle size:
    Fix: Dynamic import heavy components:
      const ConnectModal = dynamic(() => import('./ConnectModal'))
      const Chart = dynamic(() => import('./Chart'), { ssr: false })
  No loading states:
    Fix: Add Suspense + skeleton fallbacks everywhere

□ 20.3 — LOADING SKELETON AUDIT
  For every async data section, verify skeleton exists:
    Stats cards → 5 gray rectangles animating
    Projects table → 5 row skeletons
    Charts → gray rectangle placeholder
    Messages → 3 row skeletons
  Fix: Create SkeletonCard, SkeletonRow, SkeletonChart components

□ 20.4 — EMPTY STATE AUDIT
  For every list/table, verify empty state exists:
    Projects (0 projects) → "No projects yet. Add your first project."
    Messages (0 messages) → "No messages yet."
    Media (0 files) → "No files uploaded yet."
  Each empty state should have:
    Icon (relevant SVG)
    Title
    Description
    CTA button (Add/Upload)
  Fix: Add EmptyState component used across all tables

□ 20.5 — ERROR STATE AUDIT
  Disconnect Supabase (wrong URL temporarily)
  Expected: Error states show (not blank pages or crashes):
    "Failed to load projects. Try again."
    With retry button
  Fix: try/catch in all data fetches + error state component

STEP 21 — FINAL VERIFICATION CHECKLIST
Run through this complete final checklist after all fixes:

AUTHENTICATION:
  □ Login with correct creds → dashboard
  □ Login with wrong creds → error message
  □ Unauthenticated → /admin/login redirect
  □ Logout → session cleared
  □ Forgot password → email sent

THEME:
  □ Toggle works on public portfolio
  □ Toggle works in admin dashboard
  □ Persists on refresh
  □ No white flash (FOUC)
  □ All sections theme correctly
  □ Admin sidebar always dark

DASHBOARD HOME:
  □ 5 stats cards with real data
  □ Recent projects table (5 rows)
  □ Visitors line chart renders
  □ Quick actions navigate correctly
  □ Profile status card accurate
  □ Recent messages 2-3 items
  □ Resume card with download
  □ Storage usage bar

PROJECTS:
  □ List loads with pagination
  □ Search filters correctly
  □ Status filter works
  □ Add project (all fields saved)
  □ Edit project (pre-filled form)
  □ Delete with confirmation
  □ Status badge colors correct
  □ Featured toggle persists

EXPERIENCE:
  □ CRUD fully working
  □ Currently Working toggle disables end date

SKILLS:
  □ Category tabs work
  □ CRUD working per category

RESUME:
  □ PDF upload (drag + click)
  □ File type validation
  □ File size validation
  □ Download working
  □ Version history shows
  □ Restore version works

CONTACT MESSAGES:
  □ Public form submits and stores
  □ Message appears in admin
  □ Mark read/unread
  □ Search and filter
  □ Delete with confirm

ANALYTICS:
  □ All charts render (no blank boxes)
  □ Date range filter works
  □ Responsive charts

SEO MANAGER:
  □ All 5 tabs load
  □ Save persists
  □ Meta applies to public pages

MEDIA LIBRARY:
  □ Upload (click + drag)
  □ Preview modal
  □ Delete removes from storage
  □ Search works

SETTINGS:
  □ All tabs load
  □ Profile saves and persists
  □ Availability toggle updates homepage
  □ Password change works

ACTIVITY LOGS:
  □ Login events logged
  □ CRUD events logged
  □ Filter and pagination work

SOCIAL LINKS:
  □ All platforms listed
  □ URL updates save
  □ Enable/disable works on public footer

CONNECT MODAL:
  □ Opens from 3 trigger points
  □ Closes (X, ESC, overlay)
  □ Email card → mailto
  □ Calendar expands/collapses
  □ Day selection → time slots
  □ Confirm → success state
  □ Timezone auto-detected

RESPONSIVENESS:
  □ Mobile 375px — all sections work
  □ Tablet 768px — layout correct
  □ Desktop 1280px — optimal layout
  □ Admin mobile — sidebar drawer
  □ Modal mobile — fits screen

SECURITY:
  □ Admin not in public nav
  □ All /admin/* protected by middleware
  □ API routes return 401 if unauthenticated
  □ XSS inputs sanitized
  □ Rate limiting on contact form

PERFORMANCE:
  □ Lighthouse Performance ≥ 90
  □ All images use next/image
  □ Heavy components dynamically imported
  □ Skeleton loaders on all async data
  □ Empty states on all lists
  □ Error states with retry on all fetches

STEP 22 — BUG REPORT FORMAT
After testing, document every bug found using this format:

──────────────────────────────────────
BUG #[number]
──────────────────────────────────────
Section:     [e.g. Projects Management]
Test Case:   [e.g. 5.10 — Create Project]
Severity:    CRITICAL | HIGH | MEDIUM | LOW
Status:      OPEN → FIXED

DESCRIPTION:
  What is broken and what is the exact behavior

STEPS TO REPRODUCE:
  1. Go to /admin/projects
  2. Click "Add New Project"
  3. Fill in required fields
  4. Click "Save Project"
  5. Error occurs

EXPECTED BEHAVIOR:
  Project saves, appears in table, toast shows

ACTUAL BEHAVIOR:
  500 error from Supabase insert

ROOT CAUSE:
  RLS policy missing for authenticated INSERT

FIX APPLIED:
  Added SQL policy:
  CREATE POLICY "auth_insert_projects" ON projects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

VERIFIED:
  □ Fix works — project saves correctly
  □ Toast shows "Project created successfully"
  □ New row appears in projects table
──────────────────────────────────────