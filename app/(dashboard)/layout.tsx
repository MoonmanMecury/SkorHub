
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { logout } from '@/app/actions/auth';
import MobileNav from '@/components/layout/MobileNav';
import DashboardSidebar from '@/components/layout/DashboardSidebar';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    if (!session) {
        redirect('/sign-in?returnUrl=/account');
    }

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-slate-100 flex flex-col">
            {/* Minimal Header */}
            <header className="border-b border-white/5 bg-[#0A0A0B]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MobileNav />
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="material-icons text-primary text-3xl">play_circle</span>
                            <span className="font-bold text-xl tracking-tight text-white italic uppercase">SkorHub</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Home</Link>
                        <form action={logout}>
                            <button type="submit" className="text-sm font-medium text-red-500 hover:text-red-400">Logout</button>
                        </form>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex max-w-7xl mx-auto w-full">
                {/* Sidebar */}
                <DashboardSidebar />

                {/* Main Content */}
                <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
