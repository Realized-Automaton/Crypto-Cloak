import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';

interface ResourceLinkProps {
  title: string;
  url: string;
  description: string;
  iconName?: keyof typeof LucideIcons;
}

export function ResourceLink({ title, url, description, iconName }: ResourceLinkProps) {
  const IconComponent = iconName ? LucideIcons[iconName] as LucideIcon : ArrowUpRight;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 ease-in-out h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-semibold text-primary hover:text-accent transition-colors">
                 <Link href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
                    {title}
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                 </Link>
            </CardTitle>
            {iconName && IconComponent && <IconComponent className="w-6 h-6 text-accent" />}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-foreground/80 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
