-- 🛡️ SkorHub Admin & Dashboard Schema
-- Run this script to set up the necessary tables for the Admin Dashboard.

-- 1. Add Admin Flag to Users
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='is_admin') THEN
        ALTER TABLE public.users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='notes') THEN
        ALTER TABLE public.users ADD COLUMN notes TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='is_active') THEN
        ALTER TABLE public.users ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='last_login') THEN
        ALTER TABLE public.users ADD COLUMN last_login TIMESTAMP;
    END IF;
END $$;

-- 2. Create Payments Table (Vital for Lenco & Admin Manual Override)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'ZMW',
    status VARCHAR(20) DEFAULT 'pending', -- pending, successful, failed
    reference VARCHAR(100) UNIQUE NOT NULL, -- Lenco Reference or Manual Ref
    provider VARCHAR(50) DEFAULT 'lenco', -- lenco, manual
    donation_tier VARCHAR(20), -- supporter, vip, one-time
    is_recurring BOOLEAN DEFAULT FALSE,
    metadata JSONB, -- Store full provider response
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(), -- Track updates
    completed_at TIMESTAMP
);

-- 3. Create Support Feedback Table
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    type VARCHAR(20) CHECK (type IN ('bug', 'feature', 'support', 'other')),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'investigating', 'resolved', 'ignored')),
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Create Site Content Config Table
CREATE TABLE IF NOT EXISTS public.site_content (
    key VARCHAR(50) PRIMARY KEY, -- e.g., 'home_hero_title'
    content TEXT NOT NULL,
    description VARCHAR(255),
    updated_at TIMESTAMP DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id)
);

-- 5. Create Admin Audit Logs
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES public.users(id),
    action VARCHAR(50) NOT NULL, -- 'manual_upgrade', 'ban_user'
    target_id UUID,
    details JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 6. Seed Initial Admin (Safety Check)
-- Replace with actual admin email if known, or run manually
-- UPDATE public.users SET is_admin = TRUE WHERE email = 'your-admin-email@example.com';

-- 7. RLS Policies
-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Payments: Users see own, Admins see all
CREATE POLICY "Users view own payments" ON public.payments 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins view all payments" ON public.payments 
    FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

-- Feedback: Users create own, Admins manage all
CREATE POLICY "Users create feedback" ON public.feedback 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view own feedback" ON public.feedback 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins manage feedback" ON public.feedback 
    FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

-- Site Content: Public read, Admin write
CREATE POLICY "Public read content" ON public.site_content 
    FOR SELECT USING (true);

CREATE POLICY "Admins manage content" ON public.site_content 
    FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

-- Audit Logs: Admin only (view/insert)
CREATE POLICY "Admins manage audit logs" ON public.admin_audit_logs 
    FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));
