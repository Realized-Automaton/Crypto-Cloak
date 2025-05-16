import { InfoCard } from '@/components/InfoCard';
import { PRIVACY_VIOLATORS_CONTENT } from '@/lib/constants';
import type { LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function PrivacyViolatorsPage() {
  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Navigating Privacy Threats
        </h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          Learn about common entities and practices that can compromise your privacy in the blockchain ecosystem.
        </p>
      </section>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
        {PRIVACY_VIOLATORS_CONTENT.map((violator) => (
          <InfoCard
            key={violator.id}
            title={violator.title}
            iconName={violator.icon as keyof typeof LucideIcons}
            description={violator.description}
            className="bg-card"
          >
            <CardContent className="pt-4">
              <div className="space-y-2">
                <h3 className="text-md font-semibold text-destructive/80 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Potential Impact:
                </h3>
                <p className="text-sm text-foreground/80">{violator.impact}</p>
              </div>
            </CardContent>
          </InfoCard>
        ))}
      </div>
    </div>
  );
}
