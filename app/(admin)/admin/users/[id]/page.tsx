
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import UserActionsPanel from '@/components/admin/UserActionsPanel';

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // 1. Fetch User Data
    const result = await db.query(`
        SELECT * FROM users WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
        notFound();
    }

    const user = result.rows[0];

    // 2. Fetch User's Payments
    const payments = await db.query(`
        SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC
    `, [id]);

    // 3. Fetch Audit Logs related to this user
    const auditLogs = await db.query(`
        SELECT * FROM admin_audit_logs WHERE target_id = $1 ORDER BY created_at DESC
    `, [id]);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">{user.public_display_name || user.email}</h1>
                    <p className="text-slate-400 font-mono text-sm">{user.id}</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${user.is_active ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                    {user.is_active ? 'Active Account' : 'Banned'}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: User Profile & Actions */}
                <div className="space-y-6">
                    <UserActionsPanel user={user} />

                    <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 space-y-4">
                        <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2">Profile Details</h3>
                        <div className="grid grid-cols-2 gap-y-4 text-sm">
                            <div className="text-slate-500">Email</div>
                            <div className="text-right text-white break-all">{user.email}</div>

                            <div className="text-slate-500">Joined</div>
                            <div className="text-right text-white">{new Date(user.created_at).toLocaleDateString()}</div>

                            <div className="text-slate-500">Total Donated</div>
                            <div className="text-right text-amber-500 font-bold">K{user.total_donated || 0}</div>

                            <div className="text-slate-500">Supporter Tier</div>
                            <div className="text-right">
                                {user.supporter_tier ? (
                                    <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded text-xs uppercase font-bold">
                                        {user.supporter_tier}
                                    </span>
                                ) : <span className="text-slate-600">None</span>}
                            </div>

                            <div className="text-slate-500">Expires</div>
                            <div className="text-right text-white">
                                {user.supporter_expires_at
                                    ? new Date(user.supporter_expires_at).toLocaleDateString()
                                    : '-'}
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 space-y-4">
                        <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2">Admin Notes</h3>
                        <p className="text-sm text-slate-400 italic">
                            {user.notes || "No notes added for this user."}
                        </p>
                    </div>
                </div>

                {/* Right Column: History & Activity */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Payments Table */}
                    <div className="bg-[#121214] border border-white/5 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <h3 className="font-bold text-white">Payment History</h3>
                            <span className="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded">
                                {payments.rows.length} Transactions
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="bg-white/5 text-xs uppercase font-bold text-slate-300">
                                    <tr>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Amount</th>
                                        <th className="px-6 py-3">Reference</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 text-right">Method</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {payments.rows.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-white/5">
                                            <td className="px-6 py-4">{new Date(payment.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 font-bold text-white">K{payment.amount}</td>
                                            <td className="px-6 py-4 font-mono text-xs">{payment.reference}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${payment.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                                    payment.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'
                                                    }`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-xs uppercase">{payment.provider}</td>
                                        </tr>
                                    ))}
                                    {payments.rows.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                                No payments found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Audit Logs */}
                    <div className="bg-[#121214] border border-white/5 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-white/5">
                            <h3 className="font-bold text-white">Audit Trail</h3>
                            <p className="text-xs text-slate-500 mt-1">Actions taken on this user account.</p>
                        </div>
                        <div className="divide-y divide-white/5">
                            {auditLogs.rows.map((log) => (
                                <div key={log.id} className="p-4 flex items-start gap-3 hover:bg-white/5">
                                    <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                                        <span className="material-icons text-sm">history_edu</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-bold text-white capitalize">{log.action.replace('_', ' ')}</span>
                                            <span className="text-xs text-slate-500">{new Date(log.created_at).toLocaleString()}</span>
                                        </div>
                                        <pre className="text-xs text-slate-400 font-mono bg-black/20 p-2 rounded max-w-md overflow-x-auto">
                                            {JSON.stringify(log.details, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            ))}
                            {auditLogs.rows.length === 0 && (
                                <div className="px-6 py-8 text-center text-slate-500">
                                    No administrative actions recorded.
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
