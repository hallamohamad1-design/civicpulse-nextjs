# civicpulse-global/supabase_migration_phase2.sql at main · hallamohamad1-design/civicpulse-global · GitHub

**URL:** https://github.com/hallamohamad1-design/civicpulse-global/blob/main/supabase_migration_phase2.sql

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
/supabase_migration_phase2.sql
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
-- Phase 2: Engagement & Discovery Database Migrations


-- VOTES
CREATE TABLE public.votes (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  issue_id UUID REFERENCES public.issues(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, issue_id)
);


-- COMMENTS
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID REFERENCES public.issues(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);


-- FOLLOWS
CREATE TABLE public.follows (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  issue_id UUID REFERENCES public.issues(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, issue_id)
);


-- NOTIFICATIONS
CREATE TYPE notification_type AS ENUM ('status_change', 'new_comment');
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  issue_id UUID REFERENCES public.issues(id) ON DELETE CASCADE NOT NULL,
  type notification_type NOT NULL,
  read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);


-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;


-- Votes: Viewable to all, insert/delete tied strictly to auth.uid()
CREATE POLICY "Votes are viewable by everyone." ON public.votes FOR SELECT USING (true);
CREATE POLICY "Users can insert their own vote." ON public.votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove their own vote." ON public.votes FOR DELETE USING (auth.uid() = user_id);


-- Comments: Viewable to all, insert requires authentication
CREATE POLICY "Comments are viewable by everyone." ON public.comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can comment." ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Only moderators or admins can delete comments natively
CREATE POLICY "Moderators can delete comments." ON public.comments FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'official', 'admin')) 
  OR auth.uid() = user_id
);


-- Follows and Notifications: Private to the authenticated user
CREATE POLICY "Users can manage their follows." ON public.follows FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can read their notifications." ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their notifications." ON public.notifications FOR UPDATE USING (auth.uid() = user_id);


-- Trigger: Enable Supabase Realtime on Comments table to broadcast instantly
alter publication supabase_realtime add table public.comments;