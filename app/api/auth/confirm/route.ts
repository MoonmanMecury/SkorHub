
import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { signToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const next = searchParams.get('next')
        ?? (type === 'recovery' ? '/reset-password' : '/confirm')

    const code = searchParams.get('code')

    if (token_hash && type) {
        const cookieStore = await cookies()
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
        )

        const { data, error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })

        if (!error && data.user) {
            // SYNC: Create the custom token for backward compatibility (Dashboards rely on this)
            const userResult = await db.query('SELECT is_admin FROM users WHERE id = $1', [data.user.id]);
            const isAdmin = userResult.rows[0]?.is_admin || false;

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

            const redirectUrl = process.env.NEXT_PUBLIC_APP_URL
                ? `${process.env.NEXT_PUBLIC_APP_URL}${next}`
                : new URL(next, request.url).toString();

            return NextResponse.redirect(redirectUrl);
        }
    } else if (code) {
        const cookieStore = await cookies()
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
        )

        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && data.user) {
            // SYNC: Create the custom token for backward compatibility (Dashboards rely on this)
            const userResult = await db.query('SELECT is_admin FROM users WHERE id = $1', [data.user.id]);
            const isAdmin = userResult.rows[0]?.is_admin || false;

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

            const redirectUrl = process.env.NEXT_PUBLIC_APP_URL
                ? `${process.env.NEXT_PUBLIC_APP_URL}${next}`
                : new URL(next, request.url).toString();

            return NextResponse.redirect(redirectUrl);
        }
    }

    // If there's an error, redirect to sign-in with an error message
    const errorUrl = process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/sign-in?error=Verification failed`
        : new URL('/sign-in?error=Verification failed', request.url).toString();

    return NextResponse.redirect(errorUrl);
}
