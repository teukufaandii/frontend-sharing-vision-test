import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading data...',
  className,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 space-y-3 text-muted-foreground',
        className
      )}
    >
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {message && <p className="text-sm font-medium">{message}</p>}
    </div>
  );
};
