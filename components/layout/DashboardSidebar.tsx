'use client';

import DashboardNavLinks from '@/components/layout/DashboardNavLinks';

export default function DashboardSidebar() {
    return (
        <aside className="w-64 hidden lg:block border-r border-white/5 h-[calc(100vh-64px)] overflow-y-auto sticky top-16 bg-[#0A0A0B]">
            <div className="p-6">
                <DashboardNavLinks />
            </div>
        </aside>
    );
}
