
'use client';

import { register } from '@/app/actions/auth';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export default function SignUpPage() {
    const router = useRouter();
    const { mutate } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [password, setPassword] = useState('');
    const [strength, setStrength] = useState(0);

    const [successMessage, setSuccessMessage] = useState('');

    async function handleSubmit(formData: FormData) {
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const result = await register(formData);
            if (result?.error) {
                setError(result.error);
            } else if (result?.requiresConfirmation) {
                setSuccessMessage(result.message || 'Check your email for confirmation link.');
            } else {
                await mutate();
                router.push('/support'); // Redirect to support page
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
                    <span className="material-icons text-9xl">person_add</span>
                </div>

                <div className="text-center relative z-10">
                    <Link href="/" className="inline-flex items-center space-x-2 mb-8">
                        <span className="material-icons text-primary text-4xl">play_circle</span>
                        <span className="font-black text-2xl tracking-tighter text-white italic uppercase">SkorHub</span>
                    </Link>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Join the Community</h2>
                    <p className="text-slate-500 font-medium mt-2">Start your premium experience</p>
                </div>

                <form action={handleSubmit} className="space-y-6 relative z-10">
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 text-sm font-bold text-center">
                            <span className="material-icons text-4xl mb-2 block">mark_email_read</span>
                            {successMessage}
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
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                const val = e.target.value;
                                let score = 0;
                                if (val.length > 6) score++;
                                if (val.match(/[A-Z]/)) score++;
                                if (val.match(/[0-9]/)) score++;
                                if (val.match(/[^A-Za-z0-9]/)) score++;
                                setStrength(score);
                            }}
                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white font-medium"
                            placeholder="••••••••"
                        />

                        {/* Password Strength Meter */}
                        <div className="mt-2 space-y-1">
                            <div className="flex gap-1 h-1.5 w-full">
                                {[1, 2, 3, 4].map((step) => (
                                    <div
                                        key={step}
                                        className={`h-full flex-1 rounded-full transition-all duration-500 ease-out ${strength >= step
                                            ? (strength <= 2 ? 'bg-red-500' : strength === 3 ? 'bg-yellow-500' : 'bg-emerald-500')
                                            : 'bg-white/5'
                                            }`}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest">
                                <span className="text-slate-500">Security Level</span>
                                <span className={`${strength <= 2 ? 'text-red-500' : strength === 3 ? 'text-yellow-500' : 'text-emerald-500'
                                    } transition-colors duration-300`}>
                                    {strength === 0 ? 'Weak' : strength <= 2 ? 'Fair' : strength === 3 ? 'Good' : 'Strong'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Confirm Password</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            required
                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white font-medium"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed text-center px-4">
                        By signing up, you agree to our <a href="#" className="underline hover:text-white transition-colors">Terms of Service</a> & <a href="#" className="underline hover:text-white transition-colors">Privacy Policy</a>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full py-5 bg-primary hover:bg-red-600 text-white font-black uppercase rounded-2xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-95"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-sm font-medium text-slate-500 relative z-10">
                    Already have an account? <Link href="/sign-in" className="text-white hover:text-primary transition-colors font-bold">Sign In</Link>
                </p>
            </div>
        </div>
    );
}
