
import { fetchMatch } from '@/app/actions/matches';
import MatchClientWrapper from '@/components/match/MatchClientWrapper';
import { notFound } from 'next/navigation';

export const metadata = {
    title: 'Live Stream - 9Streams',
    description: 'Watch live sports streams in HD',
};

// Re-enable this to force dynamic rendering if we have issues with caching
// export const dynamic = 'force-dynamic';

import { RedirectAlert } from '@/components/ui/RedirectAlert';

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const match = await fetchMatch(id);

    if (!match) {
        return <RedirectAlert message="This match is no longer available or has ended. Redirecting to full schedule..." target="/schedule" />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-10">
            <MatchClientWrapper
                initialMatch={match}
                matchId={id}
            />
        </div>
    );
}
