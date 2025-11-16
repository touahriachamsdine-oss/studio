
'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingDisplayProps {
  rating: number;
  numberOfRatings?: number;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  showRatingValue?: boolean;
}

export default function StarRatingDisplay({
  rating,
  numberOfRatings,
  size = 'default',
  className,
  showRatingValue = true,
}: StarRatingDisplayProps) {
  const starSizeClass =
    size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';

  const filledStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5; // Not implemented visually, but logic placeholder

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            starSizeClass,
            i < filledStars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'
          )}
        />
      ))}
      {showRatingValue && (
        <span
          className={cn(
            'ml-1.5 text-muted-foreground',
            size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
          )}
        >
          ({rating.toFixed(1)}
          {numberOfRatings !== undefined && ` / ${numberOfRatings}`})
        </span>
      )}
    </div>
  );
}
