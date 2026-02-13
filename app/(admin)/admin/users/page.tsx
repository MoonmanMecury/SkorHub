
import { db } from '@/lib/db';
import AdminSearch from '@/components/admin/AdminSearch';
import Link from 'next/link';

export default async function AdminUsersPage({ searchParams }: { searchParams: { q?: string, tier?: string } }) {
    const q = searchParams?.q || '';
    const tier = searchParams?.tier || 'all';

    let query = `
        SELECT id, email, public_display_name, supporter_tier, is_active, last_login, created_at, total_donated
        FROM users 
        WHERE 1=1
    `;
    const params: any[] = [];

    if (q) {
        query += ` AND (email ILIKE $${params.length + 1} OR public_display_name ILIKE $${params.length + 2})`;
        params.push(`%${q}%`, `%${q}%`);
    }

    if (tier !== 'all') {
        query += ` AND supporter_tier = $${params.length + 1}`;
        params.push(tier);
    }

    query += ` ORDER BY created_at DESC LIMIT 50`;

    // Wrap in try-catch in case columns are missing
    let users: any[] = [];
    try {
        users = (await db.query(query, params)).rows;
    } catch (e) {
        console.error('Error fetching users:', e);
        // Fallback or empty
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">User Management</h1>
            </div>

            <div className="flex flex-col md:flex-row gap-4 bg-[#121214] p-4 rounded-xl border border-white/5">
                <AdminSearch placeholder="Search users by email or name..." />

                {/* Simple static filter links as a quick hack instead of client logic */}
                <div className="flex items-center space-x-2 text-sm shrink-0 overflow-x-auto pb-1 md:pb-0">
                    <Link href="/admin/users" className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors ${tier === 'all' ? 'bg-amber-500 text-black border-amber-500 font-bold' : 'border-white/10 text-slate-400 hover:text-white bg-white/5'}`}>All Users</Link>
                    <Link href="/admin/users?tier=supporter" className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors ${tier === 'supporter' ? 'bg-amber-500 text-black border-amber-500 font-bold' : 'border-white/10 text-slate-400 hover:text-white bg-white/5'}`}>Supporters</Link>
                    <Link href="/admin/users?tier=vip" className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors ${tier === 'vip' ? 'bg-amber-500 text-black border-amber-500 font-bold' : 'border-white/10 text-slate-400 hover:text-white bg-white/5'}`}>VIPs</Link>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/5 shadow-2xl bg-[#0A0A0B]">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-[#1A1A1D] text-slate-200 uppercase font-bold text-xs border-b border-white/5">
                        <tr>
                            <th className="px-6 py-4 whitespace-nowrap">User</th>
                            <th className="px-6 py-4 whitespace-nowrap">Status</th>
                            <th className="px-6 py-4 whitespace-nowrap">Tier</th>
                            <th className="px-6 py-4 whitespace-nowrap">Total Donated</th>
                            <th className="px-6 py-4 whitespace-nowrap">Joined</th>
                            <th className="px-6 py-4 text-right whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-[#121214]">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-white group-hover:text-amber-500 transition-colors">{user.public_display_name || 'Anonymous'}</div>
                                    <div className="text-xs text-slate-500 font-mono">{user.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${user.is_active !== false ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                        }`}>
                                        {user.is_active !== false ? 'Active' : 'Banned'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wide ${user.supporter_tier === 'vip' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]' :
                                            user.supporter_tier === 'supporter' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                                                'bg-slate-500/10 text-slate-500 border-slate-500/20'
                                        }`}>
                                        {user.supporter_tier ? user.supporter_tier : 'FREE'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-mono text-slate-300">
                                    {user.total_donated > 0 ? `K${user.total_donated}` : '-'}
                                </td>
                                <td className="px-6 py-4">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link href={`/admin/users/${user.id}`} className="text-amber-500 hover:text-amber-400 font-bold text-xs uppercase tracking-wide px-3 py-1.5 rounded-lg border border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/10 transition-all inline-flex items-center gap-1">
                                        <span>Manage</span>
                                        <span className="material-icons text-sm">arrow_forward</span>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <div className="p-12 text-center text-slate-500 border-t-0 border-white/5 rounded-b-xl bg-[#121214]">
                        <span className="material-icons text-4xl mb-2 text-slate-600">search_off</span>
                        <p>No users found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
