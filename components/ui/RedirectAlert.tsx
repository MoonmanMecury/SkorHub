
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface RedirectAlertProps {
    message?: string;
    target: string;
}

export function RedirectAlert({ message, target }: RedirectAlertProps) {
    const router = useRouter();

    useEffect(() => {
        // We use a small timeout to ensure the browser has time to render if needed
        // but since we return null, it's just the logic
        if (typeof window !== 'undefined') {
            // Wait a bit so the user can see the message
            const timer = setTimeout(() => {
                router.push(target);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [target, router]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 px-4 text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            {message && (
                <p className="text-white font-black uppercase tracking-widest text-sm max-w-md">
                    {message}
                </p>
            )}
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] animate-pulse">
                Redirecting to {target === '/schedule' ? 'Schedule' : 'Home'}...
            </p>
        </div>
    );
}
