
// app/actions/auth.ts
'use server'

import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';


export async function login(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Please provide both email and password' };
    }

    try {
        const cookieStore = await cookies();
        const { createServerClient } = await import('@supabase/ssr');

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    },
                },
            }
        );

        // 1. Sign in with Supabase Auth
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) {
            if (signInError.message.toLowerCase().includes('email not confirmed')) {
                return { error: 'Please verify your email address before signing in.' };
            }
            return { error: 'Invalid email or password.' };
        }

        if (!data.user) {
            return { error: 'Login failed.' };
        }

        // 2. Check for admin status in our public.users table (optional, for existing logic)
        const userResult = await db.query('SELECT is_admin FROM users WHERE id = $1', [data.user.id]);
        const isAdmin = userResult.rows[0]?.is_admin || false;

        // 3. Create Token for backward compatibility (Optional)
        const token = signToken({
            userId: data.user.id,
            email: data.user.email,
            isAdmin: isAdmin
        });

        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
        });

        return { success: true, isAdmin };
    } catch (error) {
        console.error('Login error:', error);
        return { error: 'Server error' };
    }
}

export async function register(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Please provide both email and password' };
    }

    try {
        const cookieStore = await cookies();
        const { createServerClient } = await import('@supabase/ssr');

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    },
                },
            }
        );

        // 1. Explicitly check if account already exists in our public users table
        const existingCheck = await db.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingCheck.rows.length > 0) {
            return { error: 'An account with this email already exists.' };
        }

        // 2. Sign up with Supabase Auth
        const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://skor-hub.vercel.app'}/api/auth/confirm?next=/confirm`,
            },
        });

        if (signUpError) {
            return { error: signUpError.message };
        }

        // 3. Prevent duplicate signups if Supabase configuration allows silent signups
        // If identities is empty and session is null, it usually means the user exists but isn't confirmed
        if (data.user && data.user.identities && data.user.identities.length === 0) {
            return { error: 'An account with this email already exists. Please sign in.' };
        }

        // 4. Sync into public.users
        if (data.user) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            await db.query(
                'INSERT INTO users (id, email, password_hash) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING',
                [data.user.id, email, hashedPassword]
            );
        }

        // Check if confirmation message should be shown
        const isConfirmed = data.session !== null;

        if (!isConfirmed) {
            return {
                requiresConfirmation: true,
                message: 'Welcome! Please check your email to verify your account before signing in.'
            };
        }

        return { success: true };
    } catch (error) {
        console.error('Register error:', error);
        return { error: 'Server error during registration' };
    }
}

export async function logout() {
    const cookieStore = await cookies();
    const { createServerClient } = await import('@supabase/ssr');

    // 1. Clear Supabase Session (Strictly DB dependent)
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    )
                },
            },
        }
    );
    await supabase.auth.signOut();

    // 2. Clear our custom cookie
    cookieStore.delete('token');

    redirect('/sign-in');
}

export async function requestPasswordReset(formData: FormData) {
    const email = formData.get('email') as string;

    if (!email) return { error: 'Email is required' };

    try {
        const cookieStore = await cookies();
        const { createServerClient } = await import('@supabase/ssr');

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
            {
                cookies: {
                    getAll() { return cookieStore.getAll() },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    },
                },
            }
        );

        // Send reset email via Supabase
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://skor-hub.vercel.app'}/api/auth/confirm?next=/reset-password`,
        });

        if (error) {
            console.error('Supabase Reset Error:', error);
            // Still return success to prevent email enumeration
        }

        return { success: true, message: 'If an account exists, a reset link has been sent.' };
    } catch (error) {
        console.error('Request Reset Error:', error);
        return { error: 'Something went wrong.' };
    }
}

export async function resetPassword(formData: FormData) {
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!password || !confirmPassword) {
        return { error: 'Missing fields' };
    }

    if (password !== confirmPassword) {
        return { error: 'Passwords do not match' };
    }

    try {
        const cookieStore = await cookies();
        const { createServerClient } = await import('@supabase/ssr');

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
            {
                cookies: {
                    getAll() { return cookieStore.getAll() },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    },
                },
            }
        );

        // Update password in Supabase Auth
        // User must be authenticated (via the confirm redirect) for this to work
        const { error: updateError } = await supabase.auth.updateUser({
            password: password
        });

        if (updateError) {
            return { error: updateError.message };
        }

        // Keep our local DB in sync
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashedPassword, user.id]);
        }

        return { success: true };
    } catch (error) {
        console.error('Reset Password Error:', error);
        return { error: 'Failed to reset password' };
    }
}
