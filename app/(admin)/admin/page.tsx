
import { db } from '@/lib/db';

async function getStats() {
    try {
        const usersCount = (await db.query('SELECT COUNT(*) FROM users')).rows[0].count;
        // Check if payments table exists by querying it (if it fails, return 0)
        let paymentsCount = 0;
        try {
            paymentsCount = (await db.query('SELECT COUNT(*) FROM payments')).rows[0].count;
        } catch (e) {
            console.warn('Payments table not ready yet');
        }

        let supportersCount = 0;
        try {
            supportersCount = (await db.query("SELECT COUNT(*) FROM users WHERE supporter_tier IS NOT NULL")).rows[0].count;
        } catch (e) {
            console.warn('Supporter columns missing');
        }

        return {
            users: usersCount,
            supporters: supportersCount,
            payments: paymentsCount,
        };
    } catch (error) {
        console.error("Failed to fetch admin stats", error);
        return { users: 0, supporters: 0, payments: 0 };
    }
}

export default async function AdminDashboardPage() {
    const stats = await getStats();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Admin Overview</h1>
                <p className="text-slate-400">Welcome to SkorHub Command Center.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Users"
                    value={stats.users}
                    icon="group"
                    color="text-blue-500"
                    bg="bg-blue-500/10"
                />
                <StatCard
                    title="Active Supporters"
                    value={stats.supporters}
                    icon="volunteer_activism"
                    color="text-pink-500"
                    bg="bg-pink-500/10"
                />
                <StatCard
                    title="Total Transactions"
                    value={stats.payments}
                    icon="receipt_long"
                    color="text-emerald-500"
                    bg="bg-emerald-500/10"
                />
                <StatCard
                    title="Pending Feedback"
                    value="0"
                    icon="mail"
                    color="text-amber-500"
                    bg="bg-amber-500/10"
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-6 rounded-2xl border border-white/5 bg-[#121214]">
                    <h3 className="font-bold text-lg mb-4 text-white">System Status</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                            <div className="flex items-center space-x-3">
                                <span className="material-icons text-green-500">check_circle</span>
                                <span className="text-green-500 font-medium">Database Connected</span>
                            </div>
                            <span className="text-xs text-green-400 font-mono">OK</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center space-x-3">
                                <span className="material-icons text-slate-400">dns</span>
                                <span className="text-slate-300 font-medium">Lenco API</span>
                            </div>
                            <span className="text-xs text-slate-500 font-mono">Unknown</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-2xl border border-white/5 bg-[#121214]">
                    <h3 className="font-bold text-lg mb-4 text-white">Recent Activity</h3>
                    <div className="text-sm text-slate-400 text-center py-8">
                        No recent admin activity logs found.
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color, bg }: any) {
    return (
        <div className="p-6 rounded-2xl border border-white/5 bg-[#121214] hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${bg}`}>
                    <span className={`material-icons ${color}`}>{icon}</span>
                </div>
                <span className="text-2xl font-bold text-white">{value}</span>
            </div>
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide">{title}</h3>
        </div>
    );
}
