import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import * as LucideIcons from 'lucide-react';

interface InfoCardProps {
  title: string;
  description?: string | React.ReactNode;
  iconName?: keyof typeof LucideIcons;
  children?: React.ReactNode;
  className?: string;
}

export function InfoCard({ title, description, iconName, children, className }: InfoCardProps) {
  const IconComponent = iconName ? LucideIcons[iconName] as LucideIcon : null;

  return (
    <Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          {IconComponent && <IconComponent className="w-8 h-8 text-accent" />}
          <CardTitle className="text-2xl font-semibold text-primary">{title}</CardTitle>
        </div>
        {description && typeof description === 'string' && (
          <CardDescription className="text-md text-foreground/70 pt-2">{description}</CardDescription>
        )}
         {description && typeof description !== 'string' && (
          <div className="text-md text-foreground/70 pt-2">{description}</div>
        )}
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
    </Card>
  );
}
