
'use client';

import { requestPasswordReset } from '@/app/actions/auth';
import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const result = await requestPasswordReset(formData);
            if (result.success) {
                setMessage(result.message || 'Check your email for the reset link.');
            } else {
                setError(result.error || 'Something went wrong.');
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
                    <span className="material-icons text-9xl">lock_reset</span>
                </div>

                <div className="text-center relative z-10">
                    <Link href="/" className="inline-flex items-center space-x-2 mb-8">
                        <span className="material-icons text-primary text-4xl">play_circle</span>
                        <span className="font-black text-2xl tracking-tighter text-white italic uppercase">SkorHub</span>
                    </Link>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Forgot Password</h2>
                    <p className="text-slate-500 font-medium mt-2">Enter your email to receive a reset link</p>
                </div>

                <form action={handleSubmit} className="space-y-6 relative z-10">
                    {message && (
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-sm font-bold">
                            {message}
                        </div>
                    )}

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

                    <button
                        disabled={loading}
                        className="w-full py-5 bg-primary hover:bg-red-600 text-white font-black uppercase rounded-2xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-95"
                    >
                        {loading ? 'Sending Link...' : 'Send Reset Link'}
                    </button>
                </form>

                <p className="text-center text-sm font-medium text-slate-500 relative z-10">
                    Remember your password? <Link href="/sign-in" className="text-white hover:text-primary transition-colors font-bold">Sign In</Link>
                </p>
            </div>
        </div>
    );
}
