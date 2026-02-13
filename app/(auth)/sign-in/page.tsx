
'use client';

import { login } from '@/app/actions/auth';
import Link from 'next/link';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

function SignInForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get('returnUrl') || '/account';
    const { mutate } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError('');

        try {
            const result = await login(formData);
            if (result?.error) {
                setError(result.error);
            } else {
                await mutate();
                // Redirect admins to dashboard, users to returnUrl or account
                if (result.isAdmin) {
                    router.push('/admin');
                } else {
                    router.push(returnUrl === '/admin' ? '/account' : returnUrl);
                }
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0A0B]">
            <div className="w-full max-w-md space-y-8 glass p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 -rotate-12 opacity-5">
                    <span className="material-icons text-9xl">lock</span>
                </div>

                <div className="text-center relative z-10">
                    <Link href="/" className="inline-flex items-center space-x-2 mb-8">
                        <span className="material-icons text-primary text-4xl">play_circle</span>
                        <span className="font-black text-2xl tracking-tighter text-white italic uppercase">SkorHub</span>
                    </Link>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Welcome Back</h2>
                    <p className="text-slate-500 font-medium mt-2">Sign in to your account</p>
                </div>

                <form action={handleSubmit} className="space-y-6 relative z-10">
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white font-medium"
                            placeholder="name@example.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white font-medium"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                        <label className="flex items-center space-x-2 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 checked:bg-primary transition-all" />
                            <span className="text-slate-400 group-hover:text-slate-300 font-bold uppercase tracking-widest">Remember me</span>
                        </label>
                        <Link href="/forgot-password" className="text-primary font-bold uppercase tracking-widest hover:underline">Forgot?</Link>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full py-5 bg-primary hover:bg-red-600 text-white font-black uppercase rounded-2xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-95"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="text-center text-sm font-medium text-slate-500 relative z-10">
                    Don't have an account? <Link href="/sign-up" className="text-white hover:text-primary transition-colors font-bold">Create Account</Link>
                </p>
            </div>
        </div>
    );
}

export default function SignInPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0A0B]">
                <div className="animate-pulse flex items-center space-x-2">
                    <span className="material-icons text-primary text-4xl">play_circle</span>
                    <span className="font-black text-2xl tracking-tighter text-white italic uppercase">Loading...</span>
                </div>
            </div>
        }>
            <SignInForm />
        </Suspense>
    );
}

