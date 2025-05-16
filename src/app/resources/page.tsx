import { ResourceLink } from '@/components/ResourceLink';
import { RESOURCE_LINKS } from '@/lib/constants';
import type { LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export default function ResourcesPage() {
  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Further Reading & Resources
        </h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          Expand your knowledge with these curated resources on blockchain privacy, tools, and organizations.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {RESOURCE_LINKS.map((link) => (
          <ResourceLink
            key={link.title}
            title={link.title}
            url={link.url}
            description={link.description}
            iconName={link.icon as keyof typeof LucideIcons}
          />
        ))}
      </div>

      <section className="text-center mt-12 p-6 bg-secondary/30 rounded-lg">
        <h2 className="text-2xl font-semibold text-primary mb-3">Disclaimer</h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          The resources listed here are for informational purposes only. Crypto Cloak does not endorse any specific project or service. Always do your own research (DYOR) before interacting with any third-party platform or tool.
        </p>
      </section>
    </div>
  );
}
