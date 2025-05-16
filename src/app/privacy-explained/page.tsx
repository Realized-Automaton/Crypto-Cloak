import { InfoCard } from '@/components/InfoCard';
import { PRIVACY_EXPLAINED_CONTENT } from '@/lib/constants';
import type { LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { CardContent } from '@/components/ui/card'; // Explicit import

export default function PrivacyExplainedPage() {
  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Demystifying Blockchain Privacy
        </h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          Understand the core concepts of privacy on the blockchain, why it's crucial, and common misunderstandings.
        </p>
      </section>

      <Separator />

      {PRIVACY_EXPLAINED_CONTENT.map((category) => {
        const CategoryIcon = category.icon ? LucideIcons[category.icon as keyof typeof LucideIcons] as LucideIcon : null;
        return (
          <section key={category.id} className="space-y-6">
             <div className="flex items-center gap-3">
              {CategoryIcon && <CategoryIcon className="w-10 h-10 text-accent" />}
              <h2 className="text-3xl font-semibold text-primary">{category.title}</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
              {category.sections.map((item) => (
                <InfoCard
                  key={item.title}
                  title={item.title}
                  className="bg-card"
                >
                  <CardContent className="text-md text-foreground/90 leading-relaxed pt-4">
                     {item.text}
                  </CardContent>
                </InfoCard>
              ))}
            </div>
            { PRIVACY_EXPLAINED_CONTENT.indexOf(category) < PRIVACY_EXPLAINED_CONTENT.length - 1 && <Separator className="my-8"/>}
          </section>
        );
      })}
    </div>
  );
}

// Helper to get icon component (already in InfoCard, but if needed elsewhere)
function getIconComponent(iconName?: string): LucideIcon | null {
  if (!iconName) return null;
  const Icon = (LucideIcons as any)[iconName];
  return Icon || null;
}
