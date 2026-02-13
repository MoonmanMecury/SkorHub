
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface RedirectAlertProps {
    message: string;
    target: string;
}

export function RedirectAlert({ message, target }: RedirectAlertProps) {
    const router = useRouter();

    useEffect(() => {
        // We use a small timeout to ensure the browser has time to render if needed
        // but since we return null, it's just the logic
        if (typeof window !== 'undefined') {
            alert(message);
            router.push(target);
        }
    }, [message, target, router]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-black uppercase tracking-widest animate-pulse">Redirecting to {target === '/schedule' ? 'Schedule' : 'Home'}...</p>
        </div>
    );
}
