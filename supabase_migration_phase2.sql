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
