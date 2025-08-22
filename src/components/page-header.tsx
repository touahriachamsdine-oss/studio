import { cn } from '@/lib/utils';

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
}

export function PageHeader({ title, description, className, ...props }: PageHeaderProps) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
        {title}
      </h1>
      {description && <p className="text-muted-foreground md:text-xl/relaxed">{description}</p>}
    </div>
  );
}
