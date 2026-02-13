import SupportPageClient from '@/components/support/SupportPageClient';
import { getSupporterStats } from '@/app/actions/support';

export const metadata = {
    title: 'Support SkorHub | Help Us Grow',
    description: 'Support SkorHub and help us build the best sports streaming directory for Zambian fans. Transparent, community-funded, and built by sports fans for sports fans.',
};

export default async function SupportPage() {
    const stats = await getSupporterStats();

    return (
        <div className="min-h-screen bg-background-dark">
            <SupportPageClient initialStats={stats} />
        </div>
    );
}
