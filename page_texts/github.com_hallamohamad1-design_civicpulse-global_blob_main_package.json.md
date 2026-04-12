# civicpulse-global/package.json at main · hallamohamad1-design/civicpulse-global · GitHub

**URL:** https://github.com/hallamohamad1-design/civicpulse-global/blob/main/package.json

---

Skip to content
Navigation Menu
Platform
Solutions
Resources
Open Source
Enterprise
Pricing
Sign in
Sign up
hallamohamad1-design
/
civicpulse-global
Public
Notifications
Fork 0
 Star 0
Code
Issues
Pull requests
Actions
Projects
Security and quality
Insights
Files
 main
app
components
lib
.eslintrc.json
.gitignore
README.md
components.json
middleware.ts
next.config.mjs
package-lock.json
package.json
postcss.config.mjs
supabase_migration.sql
supabase_migration_phase2.sql
tailwind.config.ts
tsconfig.json
types_supabase.ts
Breadcrumbs
civicpulse-global
/package.json
Latest commit
Halla
Initial CivicPulse Migration
7449d10
 · 
History
History
File metadata and controls
Code
Blame
Raw
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
{
  "name": "civicpulse-nextjs",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@supabase/ssr": "^0.10.2",
    "@supabase/supabase-js": "^2.103.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "leaflet": "^1.9.4",
    "lucide-react": "^1.8.0",
    "next": "14.2.35",
    "radix-ui": "^1.4.3",
    "react": "^18",
    "react-dom": "^18",
    "react-leaflet": "^5.0.0",
    "shadcn": "^4.2.0",
    "tailwind-merge": "^3.5.0",
    "tw-animate-css": "^1.4.0"
  },
  "devDependencies": {
    "@types/leaflet": "^1.9.21",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.2.35",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}