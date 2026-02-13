
import { db } from '@/lib/db';
import AdminSearch from '@/components/admin/AdminSearch';

export default async function PaymentsPage({ searchParams }: { searchParams: { q?: string, status?: string } }) {
    const q = searchParams?.q || '';
    const status = searchParams?.status || 'all';

    let query = `
        SELECT p.*, u.email, u.public_display_name 
        FROM payments p
        LEFT JOIN users u ON p.user_id = u.id
        WHERE 1=1
    `;
    const params: any[] = [];

    if (q) {
        query += ` AND (p.reference ILIKE $${params.length + 1} OR u.email ILIKE $${params.length + 2})`;
        params.push(`%${q}%`, `%${q}%`);
    }

    if (status !== 'all') {
        query += ` AND p.status = $${params.length + 1}`;
        params.push(status);
    }

    query += ` ORDER BY p.created_at DESC LIMIT 50`;

    // Fetch Data
    let payments: any[] = [];
    try {
        payments = (await db.query(query, params)).rows;
    } catch (e) {
        console.error('Error fetching payments:', e);
    }

    // Calculates total revenue from displayed results (simple meaningful stat)
    const totalRevenue = payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + parseFloat(p.amount), 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Transactions</h1>
                    <p className="text-slate-400 text-sm">Monitor all financial activities.</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">Total Revenue (Visible)</div>
                    <div className="text-2xl font-bold text-emerald-500">K{totalRevenue.toLocaleString()}</div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 bg-[#121214] p-4 rounded-xl border border-white/5">
                <AdminSearch placeholder="Search by reference or user email..." />

                <div className="flex items-center space-x-2 text-sm">
                    <StatusFilterLink status="all" current={status} label="All" />
                    <StatusFilterLink status="completed" current={status} label="Completed" />
                    <StatusFilterLink status="pending" current={status} label="Pending" />
                    <StatusFilterLink status="failed" current={status} label="Failed" />
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/5 shadow-2xl bg-[#0A0A0B]">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-[#1A1A1D] text-slate-200 uppercase font-bold text-xs border-b border-white/5">
                        <tr>
                            <th className="px-6 py-4 whitespace-nowrap">Reference</th>
                            <th className="px-6 py-4 whitespace-nowrap">User</th>
                            <th className="px-6 py-4 whitespace-nowrap">Amount</th>
                            <th className="px-6 py-4 whitespace-nowrap">Status</th>
                            <th className="px-6 py-4 whitespace-nowrap">Date</th>
                            <th className="px-6 py-4 text-right whitespace-nowrap">Provider</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-[#121214]">
                        {payments.map((payment) => (
                            <tr key={payment.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4 font-mono text-xs text-slate-300">
                                    {payment.reference}
                                    {payment.provider === 'manual_admin' && (
                                        <div className="mt-1 text-[10px] text-amber-500 uppercase font-bold">Manual Entry</div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-white">{payment.public_display_name || 'Unknown User'}</div>
                                    <div className="text-xs text-slate-500 font-mono">{payment.email}</div>
                                </td>
                                <td className="px-6 py-4 font-bold text-white">
                                    K{payment.amount}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${payment.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                            payment.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                                'bg-red-500/10 text-red-500 border border-red-500/20'
                                        }`}>
                                        {payment.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {new Date(payment.created_at).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-right text-xs uppercase text-slate-500">
                                    {payment.provider}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {payments.length === 0 && (
                    <div className="p-12 text-center text-slate-500 border-t-0 border-white/5 rounded-b-xl bg-[#121214]">
                        <span className="material-icons text-4xl mb-2 text-slate-600">receipt_long</span>
                        <p>No transactions found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatusFilterLink({ status, current, label }: { status: string, current: string, label: string }) {
    const isActive = status === current;
    return (
        <a
            href={`/admin/payments?status=${status}`}
            className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors ${isActive
                    ? 'bg-emerald-500 text-black border-emerald-500 font-bold'
                    : 'border-white/10 text-slate-400 hover:text-white bg-white/5'
                }`}
        >
            {label}
        </a>
    );
}
