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
