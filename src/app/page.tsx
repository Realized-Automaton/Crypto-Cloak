
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ShieldAlert, Puzzle, Library, ArrowRight, Target } from 'lucide-react'; // Added Target
import Link from 'next/link';
import Image from 'next/image';
import { PRIVACY_EXPLAINED_CONTENT, PRIVACY_VIOLATORS_CONTENT, RESOURCE_LINKS } from '@/lib/constants'; // For icons

// Helper to dynamically get icons from constants, assuming constants structure provides icon names
const getIconForTitle = (title: string) => {
  if (title === 'Privacy Explained') return FileText; // Fallback, though constants will provide actual one
  if (title === 'Privacy Violators') return ShieldAlert; // Fallback
  if (title === 'Game Simulator') return Puzzle; // Fallback
  if (title === 'Resource Directory') return Library; // Fallback

  const explained = PRIVACY_EXPLAINED_CONTENT.find(c => c.sections.some(s => s.title === title) || c.title === title);
  if (explained && explained.icon) return require('lucide-react')[explained.icon as keyof typeof import('lucide-react')] || FileText;
  
  const violator = PRIVACY_VIOLATORS_CONTENT.find(v => v.title === title);
  if (violator && violator.icon) return require('lucide-react')[violator.icon as keyof typeof import('lucide-react')] || ShieldAlert;
  
  const resource = RESOURCE_LINKS.find(r => r.title === title); // Less likely used here but for completeness
  if (resource && resource.icon) return require('lucide-react')[resource.icon as keyof typeof import('lucide-react')] || Library;
  
  return Puzzle; // Default for game or unknown
};


const featureCardsMeta = [
  {
    title: 'Privacy Explained',
    description: 'Understand the fundamentals of blockchain privacy.',
    href: '/privacy-explained',
    constantKey: 'what-is-blockchain-privacy', // Key to find icon in PRIVACY_EXPLAINED_CONTENT or map directly
    dataAiHint: 'knowledge book',
    imageUrl: 'https://i.ibb.co/gLxJZyGp/privacy1.png'
  },
  {
    title: 'Privacy Violators',
    description: 'Discover common threats to your privacy in the crypto world.',
    href: '/privacy-violators',
    constantKey: 'centralized-exchanges', // Key to find icon in PRIVACY_VIOLATORS_CONTENT
    dataAiHint: 'warning sign',
    imageUrl: 'https://i.ibb.co/7xckkjyF/privacy-violators.png'
  },
  {
    title: 'Game Simulator',
    description: 'Play interactive scenarios to learn privacy best practices.',
    href: '/game-simulator',
    iconOverride: Target, // Use Target for Game Simulator card specifically
    dataAiHint: 'game controller',
    imageUrl: 'https://i.ibb.co/LD6FkW5y/data-detective-2.png'
  },
  {
    title: 'Resource Directory',
    description: 'Explore tools and further reading to enhance your privacy.',
    href: '/resources',
    iconOverride: Library, // Standard icon for resources
    dataAiHint: 'books library',
    imageUrl: 'https://i.ibb.co/B5NRSZm5/resource-directory.png'
  },
];


export default function HomePage() {
  const featureCards = featureCardsMeta.map(feature => {
    let IconComponent = feature.iconOverride;
    if (!IconComponent) {
      if (feature.href === '/privacy-explained') {
         const content = PRIVACY_EXPLAINED_CONTENT.find(c => c.id === 'what-is-blockchain-privacy');
         IconComponent = content?.icon ? require('lucide-react')[content.icon as keyof typeof import('lucide-react')] : FileText;
      } else if (feature.href === '/privacy-violators') {
         const content = PRIVACY_VIOLATORS_CONTENT.find(c => c.id === 'centralized-exchanges'); // Using first violator's icon as representative
         IconComponent = content?.icon ? require('lucide-react')[content.icon as keyof typeof import('lucide-react')] : ShieldAlert;
      }
    }
    IconComponent = IconComponent || Puzzle; // Fallback

    return { ...feature, icon: IconComponent };
  });


  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-20 lg:py-28 bg-gradient-to-br from-background to-secondary/30 rounded-lg shadow-lg">
        <div className="container px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-primary">
              Unlock the Secrets of <span className="text-accent">Blockchain Privacy</span>
            </h1>
            <p className="mt-6 text-lg text-foreground/80 md:text-xl">
              Crypto Cloak empowers you to understand and navigate the complex world of digital privacy on the blockchain. Learn, play, and protect your digital footprint.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md transition-transform hover:scale-105">
                <Link href="/privacy-explained">
                  Start Learning <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="shadow-md transition-transform hover:scale-105 border-primary/50 hover:bg-primary/5 hover:border-accent">
                <Link href="/game-simulator">
                  Play the Game <Target className="ml-2 h-5 w-5" /> {/* Updated icon */}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-center text-primary mb-12">
            Explore Crypto Cloak
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featureCards.map((feature) => (
              <Card key={feature.title} className="flex flex-col hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
                <CardHeader className="flex-row items-center gap-4 pb-2">
                  <feature.icon className="w-10 h-10 text-accent" />
                  <CardTitle className="text-xl font-semibold text-primary">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-foreground/70 mb-4">{feature.description}</p>
                   <div className="w-full rounded-lg overflow-hidden">
                    <Image 
                      src={feature.imageUrl || `https://placehold.co/600x400.png`} 
                      alt={feature.title} 
                      width={600} 
                      height={400} 
                      className="w-full h-auto object-contain border-0"
                      data-ai-hint={feature.dataAiHint}
                    />
                  </div>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                   <Button asChild variant="link" className="p-0 text-accent hover:text-accent/80">
                    <Link href={feature.href}>
                      Learn more <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-12 md:py-16 bg-secondary/50 rounded-lg shadow-inner">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            Ready to Take Control of Your Digital Privacy?
          </h2>
          <p className="mt-4 text-md text-foreground/70 max-w-xl mx-auto">
            Dive deeper into the essentials of blockchain privacy. Equip yourself with knowledge and strategies to safeguard your assets and identity.
          </p>
          <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
            <Link href="/resources">
              Explore Resources
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

