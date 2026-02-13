
import SubscriptionClientWrapper from '@/components/subscribe/SubscriptionClientWrapper';

export const metadata = {
    title: 'Subscribe | SkorHub Premium',
    description: 'Get premium access to live sports streams with ad-free experience and 4K quality.',
};

export default function SubscribePage() {
    return (
        <div className="min-h-screen bg-background-dark">
            <SubscriptionClientWrapper />
        </div>
    );
}
