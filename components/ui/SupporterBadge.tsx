// components/ui/SupporterBadge.tsx
import { SupporterTier } from '@/app/actions/support';

interface SupporterBadgeProps {
    tier: SupporterTier;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    className?: string;
}

export function SupporterBadge({ tier, size = 'md', showLabel = true, className = '' }: SupporterBadgeProps) {
    if (!tier) return null;

    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5 gap-1',
        md: 'text-sm px-3 py-1 gap-1.5',
        lg: 'text-base px-4 py-1.5 gap-2',
    };

    const iconSizes = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };

    if (tier === 'vip') {
        return (
            <span className={`inline-flex items-center ${sizeClasses[size]} bg-gradient-to-r from-primary to-orange-500 text-white font-black uppercase tracking-wider rounded-full ${className}`}>
                <span className={iconSizes[size]}>⭐</span>
                {showLabel && 'VIP'}
            </span>
        );
    }

    if (tier === 'supporter') {
        return (
            <span className={`inline-flex items-center ${sizeClasses[size]} bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black uppercase tracking-wider rounded-full ${className}`}>
                <span className={iconSizes[size]}>🌟</span>
                {showLabel && 'Supporter'}
            </span>
        );
    }

    return null;
}

// Alternative text-only version for compact spaces
export function SupporterIcon({ tier, size = 'md' }: { tier: SupporterTier; size?: 'sm' | 'md' | 'lg' }) {
    if (!tier) return null;

    const iconSizes = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-xl',
    };

    return (
        <span className={iconSizes[size]} title={tier === 'vip' ? 'VIP Supporter' : 'Supporter'}>
            {tier === 'vip' ? '⭐' : '🌟'}
        </span>
    );
}
