Step1:
Design Style: Premium Minimal SaaS Landing Page
Inspiration: Linear, Vercel, Stripe, Notion
Font: Outfit (Google Fonts) — weights 400, 500, 600, 700, 800, 900
Mono Font: JetBrains Mono — for tech stack pills and code labels
Color Palette:
  - Primary:        #2563EB (Blue)
  - Emerald:        #10B981 (Green — Open To Work badge)
  - Background:     #FFFFFF
  - Section BG:     #F8FAFC (Light gray sections)
  - Text Primary:   #0F172A
  - Text Muted:     #64748B
  - Text Light:     #94A3B8
  - Border:         #E2E8F0
  - Border Strong:  #CBD5E1
Layout Max Width: 1200px centered
Border Radius: 8px (small), 12px (default), 16px (large cards)
Transition: 0.22s cubic-bezier(0.4, 0, 0.2, 1)

Step 2: NAVIGATION BAR
Layout: Fixed top, full width, height 64px
Background: rgba(255,255,255,0.92) with backdrop-filter blur(20px)
Border Bottom: 1px solid #E2E8F0
Box Shadow on scroll: 0 4px 24px rgba(0,0,0,0.07)

Left: Logo
  Text: "Nilesh." 
  Font: Outfit 800, 1.3rem
  Color: #0F172A (Nilesh) + period in #2563EB

Center: Navigation Links
  Items: About | Experience | Projects | Skills | Services | Blog | Contact
  Font: Outfit 500, 0.875rem
  Color: #64748B (default) → #0F172A on hover
  Hover background: #F8FAFC, border-radius 8px
  Padding: 7px 14px each link

Right: CTA Button
  Text: "Schedule Meeting 📅"
  Style: Filled blue button
  Background: #2563EB
  Color: White
  Font: 600, 0.875rem
  Border Radius: 8px
  Padding: 8px 18px
  Includes calendar SVG icon on the right
  Hover: #3B82F6, translateY(-1px), box-shadow

Mobile: Hamburger toggle button (3 lines), nav links collapse

Step 3: HERO SECTION
Layout: Two-column grid
  Left column: flex 1 (main content)
  Right column: 320px fixed width (info sidebar card)
  Gap: 64px
  Align items: start (top aligned)

Background: White (#FFFFFF)
Padding: 110px top, 72px bottom
Dot grid overlay: radial-gradient(circle, #E2E8F0 1px, transparent 1px), 32px spacing, opacity 0.45
Blue glow: radial-gradient ellipse 70% 60% at 30% 50%, rgba(37,99,235,0.055), top-left quadrant

LEFT COLUMN:

  Eyebrow Tag (above name):
    Text: "● FULL STACK DEVELOPER"
    Dot: 7px green circle (#10B981), pulse animation
    Font: Outfit 700, 0.8rem
    Color: #2563EB
    Letter spacing: 0.1em
    Text transform: uppercase
    Margin bottom: 20px

  Main Name Heading:
    Text: "Nilesh Kumar Singh."
    Font: Outfit 900, clamp(2.4rem, 5vw, 3.75rem)
    Color: #0F172A
    Letter spacing: -0.05em
    Line height: 1.05
    Period at end: color #2563EB
    Margin bottom: 20px

  Tagline (3 lines):
    Text: "Building scalable web applications,
           AI-powered solutions, and modern
           digital products."
    Font: Outfit 500, clamp(1.125rem, 2.2vw, 1.375rem)
    Color: #64748B
    Line height: 1.55
    Margin bottom: 20px
    Max width: 540px

  Description Paragraph:
    Text: "MCA graduate with a strong foundation in Java, Full Stack Development,
           and a passion for building real-world solutions that create impact.
           Currently open to full-time opportunities and freelance projects."
    Font: Outfit 400, 0.9875rem
    Color: #64748B
    Line height: 1.75
    Max width: 520px
    Margin bottom: 32px

  Three Action Buttons (horizontal row, flex, gap 10px):
    
    Button 1 — "View Projects →" (PRIMARY)
      Background: #2563EB
      Color: white
      Padding: 12px 22px
      Font: 600, 0.9375rem
      Border-radius: 8px
      Right arrow SVG icon
      Hover: #3B82F6, translateY(-1px)

    Button 2 — "Schedule Meeting 📅" (SECONDARY)
      Background: white
      Color: #0F172A
      Border: 1.5px solid #CBD5E1
      Padding: 11px 20px
      Font: 600, 0.9375rem
      Calendar SVG icon on left
      Hover: border-color #2563EB, color #2563EB

    Button 3 — "Download Resume ↓" (SECONDARY)
      Same style as Button 2
      Download arrow SVG icon on left

  Footnote text below buttons:
    Text: "Let's build something meaningful together."
    Font: Outfit 400, 0.8375rem
    Color: #94A3B8
    Margin bottom: 40px

  Stat Bar (4 equal columns, grid):
    Container:
      Border: 1px solid #E2E8F0
      Border-radius: 12px
      Background: white
      Box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)
      Grid: repeat(4, 1fr)
      Each cell: 1px right border except last
      Hover each cell: background #F8FAFC

    Cell 1:
      Icon: Graduation cap SVG, color #2563EB
      Value: "MCA Graduate" — Outfit 700, 0.9375rem, #0F172A
      Label: "Post Graduate" — Outfit 400, 0.75rem, #94A3B8
      Padding: 18px 16px

    Cell 2:
      Icon: Code brackets SVG </>, color #2563EB
      Value: "5+" — same font style
      Label: "Projects Completed"

    Cell 3:
      Icon: Star SVG, color #2563EB
      Value: "Full Stack"
      Label: "Java Developer"

    Cell 4:
      Icon: Smile face SVG, color #10B981
      Value: "Open To Work" — color #10B981
      Label: "Opportunities"

RIGHT COLUMN — Info Sidebar Card:

  Container:
    Background: #F8FAFC
    Border: 1px solid #E2E8F0
    Border-radius: 16px
    Box-shadow: 0 1px 3px rgba(0,0,0,0.06)
    Margin-top: 8px (aligns slightly below name)

  5 rows, each row:
    Padding: 16px 20px
    Border-bottom: 1px solid #E2E8F0 (last row no border)
    Display: flex, align-items flex-start, gap 14px
    Hover: background white transition

    Icon container:
      Width/Height: 34px
      Background: white
      Border: 1px solid #E2E8F0
      Border-radius: 8px
      Flex-shrink: 0
      SVG icon inside, color #64748B

    Label text:
      Font: Outfit 500, 0.75rem
      Color: #94A3B8
      Margin-bottom: 2px

    Value text:
      Font: Outfit 600, 0.875rem
      Color: #0F172A

  Row 1 — Email:
    Icon: Envelope SVG
    Label: "Email"
    Value: "rajputnileshsingh25@gmail.com"
    Value font-size: 0.8rem (smaller to fit)

  Row 2 — Location:
    Icon: Pin/Map SVG
    Label: "Location"
    Value: "Bihar, India"

  Row 3 — Availability:
    Icon: Briefcase SVG
    Icon background: #F0FDF4 (green tint)
    Icon border-color: rgba(16,185,129,0.3)
    Icon color: #10B981
    Label: "Availability"
    Value: "Open To Work"
    Value color: #10B981

  Row 4 — Experience:
    Icon: Clock SVG
    Label: "Experience"
    Value: "2+ Years"

  Row 5 — Education:
    Icon: Graduation cap SVG
    Label: "Education"
    Value: "MCA Graduate"
    No border-bottom

    ----
    Step 4: VALUE PROPOSITION
    Layout: Centered, max-width 1200px
Background: #F8FAFC
Border-top + Border-bottom: 1px solid #E2E8F0
Padding: 72px 24px

Header (centered text):
  Eyebrow:
    Text: "● WHY WORK WITH ME"
    Font: Outfit 700, 0.75rem
    Color: #2563EB
    Dot: 6px blue circle
    Letter spacing: 0.1em, uppercase
    Margin-bottom: 14px

  Main title:
    Text: "I don't just write code, I solve problems."
    Font: Outfit 800, clamp(1.6rem, 3.5vw, 2.375rem)
    Color: #0F172A
    Letter-spacing: -0.03em
    Margin-bottom: 10px

  Blue underline accent:
    Width: 48px, Height: 3px
    Background: #2563EB
    Border-radius: 2px
    Centered (margin: 0 auto)
    Margin-bottom: 48px

3-Column Grid (equal columns, gap 24px):

  Card 1 — Product Thinking:
    Icon background: #EFF6FF (light blue)
    Icon: Clock/target SVG, stroke #2563EB
    Title: "Product Thinking" — Outfit 700, 1rem, #0F172A
    Desc: "I focus on solving real business problems and creating solutions that make a difference."
    Font: Outfit 400, 0.9rem, #64748B, line-height 1.65

  Card 2 — Full Stack Capability:
    Icon background: #F0FDF4 (light green)
    Icon: Monitor/layers SVG, stroke #10B981
    Title: "Full Stack Capability"
    Desc: "From frontend to backend, database to deployment — I build complete products end to end."

  Card 3 — Continuous Learning:
    Icon background: #FEF3C7 (light amber)
    Icon: Pencil/edit SVG, stroke #D97706
    Title: "Continuous Learning"
    Desc: "I stay updated with modern technologies, AI tools, and industry best practices to deliver high-quality solutions."

  All cards:
    Background: white
    Border: 1px solid #E2E8F0
    Border-radius: 16px
    Padding: 28px 24px
    Hover: border-color #2563EB, translateY(-3px), box-shadow
    Icon size: 48×48px, border-radius 12px
    Icon margin-bottom: 16px

    Step 5:SELECTED WORK / PROJECTS PREVIEW

    Layout: max-width 1200px
Background: white
Padding: 72px 24px

Section Header (space-between flex row):
  Left:
    Eyebrow: "SELECTED WORK" — blue, uppercase, 0.75rem, 700
    Title: "Projects I'm Proud Of" — Outfit 800, clamp(1.5rem, 3vw, 2rem), #0F172A, -0.03em
  Right:
    Link: "View All Projects →" — Outfit 600, 0.875rem, #2563EB
    Hover: gap increases (arrow slides right)

3-Column Grid (equal columns, gap 20px):

  Each card:
    Background: white
    Border: 1px solid #E2E8F0
    Border-radius: 16px
    Padding: 24px
    Display: flex, flex-direction column
    Hover: border-color #2563EB, translateY(-3px), box-shadow

  Card Header row:
    Left: Project name — Outfit 700, 1rem, #0F172A
    Right: Green live dot — 8px circle, #10B981, pulse animation
           Box-shadow: 0 0 0 3px rgba(16,185,129,0.2)

  Description:
    Font: Outfit 400, 0.875rem, #64748B, line-height 1.6
    Margin-bottom: 16px, flex: 1

  Tech Stack Pills (flex row, gap 6px):
    Each pill:
      Font: JetBrains Mono 500, 0.72rem
      Color: #2563EB
      Background: rgba(37,99,235,0.07)
      Border: 1px solid rgba(37,99,235,0.15)
      Border-radius: 4px
      Padding: 3px 9px

  Live Demo Link:
    Text: "Live Demo →"
    Font: Outfit 600, 0.8375rem, #2563EB
    Arrow slides right on hover

  Card 1 — MokshaSphere:
    Name: "MokshaSphere ●" (with green dot inline)
    Desc: "Spiritual consultation platform connecting users with verified astrologers."
    Stack: React | Node.js | MongoDB

  Card 2 — Village Connect:
    Name: "Village Connect ●"
    Desc: "Rural marketplace connecting villagers with trusted service providers."
    Stack: React | Spring Boot | MySQL

  Card 3 — PG Management SaaS:
    Name: "PG Management SaaS ●"
    Desc: "Accommodation management system for PG owners and tenants."
    Stack: React | Node.js | MySQL

    Step 6:TECHNOLOGIES GRID

    Layout: max-width 1200px
Background: #F8FAFC
Border-top + Border-bottom: 1px solid #E2E8F0
Padding: 64px 24px

Eyebrow above grid:
  Text: "TECHNOLOGIES I WORK WITH"
  Style: blue, uppercase, 0.75rem, 700, dot prefix
  Margin-bottom: 28px

6-Column Grid:
  Outer container:
    Border: 1px solid #E2E8F0
    Border-radius: 12px
    Overflow: hidden
    Background: #E2E8F0 (acts as 1px gap between cells)
    Gap: 1px (creates divider lines)

  Each column cell:
    Background: white
    Padding: 24px 20px
    Hover: background #EFF6FF

  Column header row (flex, align-center, gap 10px):
    Icon box: 30×30px, border-radius 7px, colored background
    Icon: SVG, 14×14px, colored stroke
    Title: Outfit 700, 0.875rem, #0F172A

  Content text:
    Font: Outfit 400, 0.8125rem, #64748B, line-height 1.65

  Col 1 — Frontend:
    Icon background: #EFF6FF, icon color: #2563EB, icon: code brackets </>
    Items: React, JavaScript, TypeScript, HTML, CSS, Tailwind CSS

  Col 2 — Backend:
    Icon background: #F0FDF4, icon color: #10B981, icon: monitor
    Items: Java, Spring Boot, Node.js, Express.js, REST APIs

  Col 3 — Database:
    Icon background: #FEF3C7, icon color: #D97706, icon: cylinder/database
    Items: MySQL, PostgreSQL, MongoDB, Supabase, Hibernate, JPA

  Col 4 — Tools:
    Icon background: #EEF2FF, icon color: #6D28D9, icon: wrench/tool
    Items: Git, GitHub, Linux, VS Code, Postman, Docker

  Col 5 — Cloud & DevOps:
    Icon background: #F0FDF4, icon color: #059669, icon: cloud
    Items: AWS (Basics), Vercel, Railway, CI/CD, Nginx

  Col 6 — AI & Others:
    Icon background: #FDF4FF, icon color: #9333EA, icon: sparkle/sun
    Items: ChatGPT, Claude, Prompt Engineering, AI Workflows

    Step 7:CTA BANNER
Layout: max-width 1200px
Background: white outer
Padding: 0 24px, 80px bottom

Inner container:
  Background: #F8FAFC
  Border: 1px solid #E2E8F0
  Border-radius: 16px
  Padding: 48px 52px
  Display: flex, justify-content space-between, align-items center
  Flex-wrap: wrap, gap 28px

Left content:
  Title: "Let's Build Something Meaningful Together"
    Font: Outfit 800, clamp(1.375rem, 2.5vw, 1.875rem)
    Color: #0F172A, letter-spacing -0.03em
    Line-height: 1.2, margin-bottom 8px

  Subtitle: "Have a project in mind or want to discuss an opportunity? I'd love to hear from you."
    Font: Outfit 400, 0.9375rem, #64748B
    Max-width: 400px

Right action buttons (flex, gap 12px):
  Button 1: "Schedule Meeting 📅" — PRIMARY (blue filled)
  Button 2: "Contact Me →" — SECONDARY (outlined)

  Step 8 — FOOTER

Layout: max-width 1200px
Background: #F8FAFC
Border-top: 1px solid #E2E8F0
Padding: 60px 24px 28px

5-Column Grid (1.8fr 1fr 1fr 1fr 1.4fr):

  Col 1 — Brand:
    Logo: "Nilesh." — Outfit 900, 1.25rem, period in #2563EB
    Description: "Full Stack Developer passionate about building scalable digital solutions and creating impact through technology."
    Font: 0.85rem, #64748B, line-height 1.65, max-width 260px, margin-bottom 18px
    
    Social icons row (gap 7px):
      Each icon button:
        Size: 34×34px
        Background: white, border: 1px solid #E2E8F0
        Border-radius: 7px
        Hover: border-color #2563EB, color #2563EB
      4 icons: LinkedIn (in) | GitHub (GH) | Twitter/X (𝕏) | Email (@)

  Col 2 — Quick Links:
    Title: "QUICK LINKS" — 0.78rem, 800, uppercase, letter-spacing 0.07em
    Links: About | Experience | Projects | Blog | Contact
    Font: 0.85rem, #64748B, hover color #2563EB, gap 7px

  Col 3 — Services:
    Title: "SERVICES"
    Links: Full Stack Development | Java Development | Web Development | SaaS Development | AI Integration
    Same style as above

  Col 4 — Resources:
    Title: "RESOURCES"
    Links: Resume | Case Studies | Blogs | Documentation | Tools I Use

  Col 5 — Let's Connect:
    Title: "LET'S CONNECT"
    Email text: "rajputnileshsingh25@gmail.com" — 0.8375rem, #64748B
    Location: "Bihar, India" — same style, margin-bottom 16px
    
    Download Resume button:
      Style: Secondary outlined
      Font: 0.85rem
      Width: 100%
      Icon: download arrow SVG on left
      Padding: 9px 16px

Footer Bottom bar:
  Border-top: 1px solid #E2E8F0
  Padding-top: 28px
  Display: flex, justify-content space-between, flex-wrap wrap

  Left: "© 2025 Nilesh Kumar Singh. All Rights Reserved." — 0.8rem, #94A3B8
  Right: "● Available for Opportunities" — 0.8rem, 600, #10B981, animated green dot

  Step 9- GLOBAL UI BEHAVIORS
  Scroll Reveal Animation:
  All sections fade in + translateY(24px → 0)
  Duration: 0.55s cubic-bezier(0.4, 0, 0.2, 1)
  Staggered delays: 0.08s, 0.16s, 0.24s, 0.32s, 0.40s
  Trigger: IntersectionObserver at 10% threshold

Back to Top Button:
  Position: fixed bottom-right (24px 24px)
  Size: 42×42px, background #2563EB, white "↑"
  Border-radius: 10px
  Appears after 400px scroll
  Hover: translateY(-2px), stronger shadow

Eyebrow Labels (global pattern):
  All section eyebrows:
    Inline flex, align-center, gap 6px
    6px blue circle dot (#2563EB) before text
    Font: 0.75rem, 700, #2563EB, uppercase, letter-spacing 0.1em
    Margin-bottom: 14px

Hover Cards (global):
  All cards on hover:
    border-color: #2563EB
    transform: translateY(-3px)
    box-shadow: 0 4px 24px rgba(37,99,235,0.08)
    transition: 0.22s cubic-bezier(0.4,0,0.2,1)

Scrollbar:
  Width: 6px
  Track: #F8FAFC
  Thumb: #CBD5E1, border-radius 3px
  Hover thumb: #94A3B8

Responsive Breakpoints:
  1100px: Tech grid → 3 cols, footer → 3 cols
  960px:  Hero → single col, sidebar below content, stat bar → 2×2
  768px:  All sections 64px padding, nav collapses to hamburger
  480px:  Tech grid → 2 cols, footer → 1 col, services → 1 col