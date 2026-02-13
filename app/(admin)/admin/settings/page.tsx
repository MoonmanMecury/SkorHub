
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export default async function AdminSettingsPage() {
    const session = await getSession();
    const user = (await db.query('SELECT * FROM users WHERE id = $1', [session?.userId])).rows[0];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Admin Settings</h1>
                <p className="text-slate-400 text-sm">Manage your administrative profile.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Card */}
                <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 space-y-6">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                        <div className="h-16 w-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold text-2xl border border-amber-500/20">
                            {user.email[0].toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{user.public_display_name || 'Admin User'}</h2>
                            <p className="text-slate-400 text-sm">{user.email}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Role</span>
                            <span className="flex items-center gap-2 text-amber-500 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                                <span className="material-icons text-sm">verified_user</span>
                                Super Admin
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Admin Since</span>
                            <span className="text-white">{new Date(user.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Account Status</span>
                            <span className="text-emerald-500 font-bold">Active</span>
                        </div>
                    </div>
                </div>

                {/* System Info */}
                <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 space-y-6">
                    <h3 className="font-bold text-white text-lg">System Information</h3>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center gap-3">
                                <span className="material-icons text-slate-400">dns</span>
                                <span className="text-sm font-medium text-slate-300">Environment</span>
                            </div>
                            <span className="text-xs font-mono text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 rounded">
                                {process.env.NODE_ENV?.toUpperCase() || 'DEVELOPMENT'}
                            </span>
                        </div>

                        <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center gap-3">
                                <span className="material-icons text-slate-400">storage</span>
                                <span className="text-sm font-medium text-slate-300">Database</span>
                            </div>
                            <span className="text-xs font-mono text-slate-400">PostgreSQL (Supabase)</span>
                        </div>

                        <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center gap-3">
                                <span className="material-icons text-slate-400">payments</span>
                                <span className="text-sm font-medium text-slate-300">Payment Gateways</span>
                            </div>
                            <span className="text-xs font-mono text-slate-400">Lenco, Manual</span>
                        </div>
                    </div>

                    <div className="pt-4 text-xs text-center text-slate-600">
                        SkorHub Admin Dashboard v1.0.0
                    </div>
                </div>
            </div>
        </div>
    );
}
