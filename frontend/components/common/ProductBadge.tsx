'use client';

import { getProductBadge, getAllProductBadges, ProductBadgeData } from '@/lib/product-badge';

interface ProductBadgeProps {
  product: any;
  size?: 'sm' | 'md' | 'lg';
  showAll?: boolean; // Show all badges or just the highest priority one
  className?: string;
}

/**
 * Dynamic Product Badge Component
 * Auto-calculates and displays appropriate badge based on product metrics
 */
export default function ProductBadge({ product, size = 'sm', showAll = false, className = '' }: ProductBadgeProps) {
  const badges = showAll ? getAllProductBadges(product) : [getProductBadge(product)].filter(Boolean) as ProductBadgeData[];

  if (badges.length === 0) return null;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <div className={`flex gap-1 flex-wrap ${className}`}>
      {badges.map((badge, index) => (
        <span
          key={`${badge.type}-${index}`}
          className={`${sizeClasses[size]} rounded font-bold shadow-md uppercase tracking-wide`}
          style={{
            color: badge.color,
            backgroundColor: badge.bgColor,
          }}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
}

/**
 * Simple Badge Component (for custom badges)
 */
export function SimpleBadge({
  label,
  color = '#FFFFFF',
  bgColor = '#EF4444',
  size = 'sm',
  className = '',
}: {
  label: string;
  color?: string;
  bgColor?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`${sizeClasses[size]} rounded font-bold shadow-md uppercase tracking-wide ${className}`}
      style={{ color, backgroundColor: bgColor }}
    >
      {label}
    </span>
  );
}
