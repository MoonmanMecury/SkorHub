
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import MobileNav from '@/components/layout/MobileNav';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();
    if (!session) {
        redirect('/sign-in?returnUrl=/admin');
    }

    // Verify Admin Status
    const result = await db.query('SELECT is_admin FROM users WHERE id = $1', [session.userId]);
    const user = result.rows[0];

    // If user is not found or not an admin, redirect to home
    if (!user || !user.is_admin) {
        redirect('/');
    }

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-slate-100 flex flex-col">
            {/* Minimal Header */}
            <header className="border-b border-amber-500/10 bg-[#0A0A0B]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MobileNav navType="admin" />
                        <Link href="/admin" className="flex items-center space-x-2">
                            <span className="material-icons text-amber-500 text-3xl">admin_panel_settings</span>
                            <span className="font-bold text-xl tracking-tight text-white italic uppercase">Admin<span className="text-amber-500">Hub</span></span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="hidden md:inline px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold uppercase tracking-wider border border-amber-500/20">
                            Administrator
                        </span>
                        <Link href="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Exit</Link>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex max-w-7xl mx-auto w-full">
                {/* Sidebar */}
                <AdminSidebar />

                {/* Main Content */}
                <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
