import React from 'react';
import { FileQuestion, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Tidak ada artikel ditemukan',
  description = 'Belum ada data artikel untuk kategori status ini.',
  actionText,
  actionHref,
  icon: Icon = FileQuestion,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-border p-8 text-center animate-in fade-in-50',
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4 text-muted-foreground">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground mb-6">{description}</p>
      {actionText && actionHref && (
        <Button asChild variant="default" size="sm">
          <Link to={actionHref} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            {actionText}
          </Link>
        </Button>
      )}
    </div>
  );
};
