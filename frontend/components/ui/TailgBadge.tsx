'use client';

import { Award } from 'lucide-react';

interface TailgBadgeProps {
    variant?: 'exclusive' | 'official' | 'promo';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function TailgBadge({
    variant = 'official',
    size = 'sm',
    className = ''
}: TailgBadgeProps) {

    const badges = {
        exclusive: {
            text: 'Đại Lý Độc Quyền',
            icon: '🏆',
            gradient: 'from-yellow-400 via-yellow-500 to-yellow-600',
            shadow: 'shadow-yellow-500/30'
        },
        official: {
            text: 'Chính Hãng',
            icon: '✓',
            gradient: 'from-blue-400 via-blue-500 to-blue-600',
            shadow: 'shadow-blue-500/30'
        },
        promo: {
            text: 'Ưu Đãi Độc Quyền',
            icon: '✨',
            gradient: 'from-primary via-accent to-primary',
            shadow: 'shadow-primary/30'
        }
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-3 py-1 text-xs',
        lg: 'px-4 py-1.5 text-sm'
    };

    const badge = badges[variant];

    return (
        <span
            className={`
                inline-flex items-center gap-1 
                bg-gradient-to-r ${badge.gradient}
                text-black font-bold rounded-md
                shadow-lg ${badge.shadow}
                ${sizes[size]}
                ${className}
            `}
        >
            <span>{badge.icon}</span>
            <span>{badge.text}</span>
        </span>
    );
}

// Export for use in other components
export function TailgExclusiveBadge({ className = '' }: { className?: string }) {
    return <TailgBadge variant="exclusive" size="md" className={className} />;
}

export function TailgOfficialBadge({ className = '' }: { className?: string }) {
    return <TailgBadge variant="official" size="sm" className={className} />;
}

export function TailgPromoBadge({ className = '' }: { className?: string }) {
    return <TailgBadge variant="promo" size="md" className={className} />;
}
