# civicpulse-global/supabase_migration.sql at main · hallamohamad1-design/civicpulse-global · GitHub

**URL:** https://github.com/hallamohamad1-design/civicpulse-global/blob/main/supabase_migration.sql

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
/supabase_migration.sql
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
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
-- Phase 1: Trust & Identity & Issues Initial Migration


-- ENUMS
CREATE TYPE user_role AS ENUM ('citizen', 'moderator', 'official', 'admin');
CREATE TYPE issue_status AS ENUM ('submitted', 'under_review', 'in_progress', 'resolved');


-- PROFILES (Extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'citizen'::user_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);


-- Trigger to create a profile automatically when a new user signs up via Google
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ISSUES 
CREATE TABLE public.issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  status issue_status DEFAULT 'submitted'::issue_status NOT NULL,
  latitude DECIMAL,
  longitude DECIMAL,
  vote_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);


-- STATUS_HISTORY
CREATE TABLE public.status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID REFERENCES public.issues(id) ON DELETE CASCADE NOT NULL,
  status issue_status NOT NULL,
  changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  changed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);


-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_history ENABLE ROW LEVEL SECURITY;


-- Profiles: Anyone can view profiles. Users can update their own non-role data. Admins can do anything.
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);


-- Issues: Anyone can view issues.
CREATE POLICY "Issues are viewable by everyone." ON public.issues FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create an issue." ON public.issues FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- Only officials or admins can update an issue (e.g. changing status)
CREATE POLICY "Officials and admins can update issues." ON public.issues FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('official', 'admin')
  )
);
-- Allow citizen to update their own issue IF they are just editing non-status stuff
CREATE POLICY "Citizens can edit their own issues." ON public.issues FOR UPDATE 
USING (auth.uid() = user_id);


-- Status History: Anyone can view
CREATE POLICY "History viewable by everyone." ON public.status_history FOR SELECT USING (true);
CREATE POLICY "Only officials and admins can insert history." ON public.status_history FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('official', 'admin')
  )
);
While the code is focused, press Alt+F1 for a menu of operations.