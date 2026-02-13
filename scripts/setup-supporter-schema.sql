-- 🛠️ SkorHub Schema Fix Script v2
-- This script safely applies updates, handling existing objects correctly.

-- 1. Update Users Table (Safe Add)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='public_display_name') THEN
        ALTER TABLE public.users ADD COLUMN public_display_name character varying;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='is_public_supporter') THEN
        ALTER TABLE public.users ADD COLUMN is_public_supporter boolean DEFAULT true;
    END IF;
END $$;

-- 2. Create Favorites Table (Recreate to support Teams)
DROP TABLE IF EXISTS public.favorites CASCADE;

CREATE TABLE public.favorites (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    item_id character varying NOT NULL, -- "Manchester United" or "match_id"
    item_type character varying NOT NULL DEFAULT 'team', 
    title character varying, 
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT favorites_pkey PRIMARY KEY (id),
    CONSTRAINT unique_user_favorite UNIQUE (user_id, item_id, item_type),
    CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- 3. Update Watch History (Safe Add)
CREATE TABLE IF NOT EXISTS public.watch_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  match_id character varying NOT NULL,
  title character varying,
  sport character varying,
  watched_at timestamp without time zone DEFAULT now(),
  duration_seconds integer DEFAULT 0,
  completed boolean DEFAULT false,
  CONSTRAINT watch_history_pkey PRIMARY KEY (id),
  CONSTRAINT watch_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='watch_history' AND column_name='title') THEN
        ALTER TABLE public.watch_history ADD COLUMN title character varying;
    END IF;
END $$;

-- 4. Switch to View System (Cleanup)
DROP VIEW IF EXISTS public.public_supporters_view CASCADE;
DROP TABLE IF EXISTS public.supporter_acknowledgments CASCADE;

CREATE OR REPLACE VIEW public_supporters_view AS
SELECT 
    id as user_id,
    COALESCE(public_display_name, SPLIT_PART(email, '@', 1)) as display_name,
    supporter_tier,
    supporter_since,
    total_donated
FROM public.users
WHERE 
    supporter_tier IS NOT NULL 
    AND (supporter_expires_at IS NULL OR supporter_expires_at > NOW())
    AND is_public_supporter = true
ORDER BY total_donated DESC, supporter_since ASC;

-- 5. Helper Functions (Fix Parameter Mismatch)
-- DROP OLD FUNCTIONS FIRST to allow parameter name changes
DROP FUNCTION IF EXISTS is_active_supporter(uuid);
DROP FUNCTION IF EXISTS is_vip_supporter(uuid);

CREATE OR REPLACE FUNCTION is_active_supporter(check_user_id uuid)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users
        WHERE id = check_user_id
        AND supporter_tier IS NOT NULL
        AND (supporter_expires_at IS NULL OR supporter_expires_at > NOW())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_vip_supporter(check_user_id uuid)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users
        WHERE id = check_user_id
        AND supporter_tier = 'vip'
        AND (supporter_expires_at IS NULL OR supporter_expires_at > NOW())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. RLS Policies (Safe Recreation)
DROP POLICY IF EXISTS "Users can manage own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can manage own history" ON public.watch_history;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own history" ON public.watch_history FOR ALL USING (auth.uid() = user_id);
