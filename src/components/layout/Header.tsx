import Link from 'next/link';
import { KeyRound, FileLock2, ShieldAlert, Gamepad2, Library, Menu } from 'lucide-react'; // Updated icons
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/privacy-explained', label: 'Privacy Explained', icon: FileLock2 }, // Updated icon
  { href: '/privacy-violators', label: 'Privacy Violators', icon: ShieldAlert },
  { href: '/game-simulator', label: 'Game Simulator', icon: Gamepad2 }, // Updated icon
  { href: '/resources', label: 'Resources', icon: Library },
];

export function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-accent transition-colors">
          <KeyRound className="h-8 w-8 text-accent" />
          <span className="text-xl font-bold tracking-tight">Crypto Cloak</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
          {navItems.map((item) => (
            <Button key={item.href} variant="ghost" asChild className="text-sm font-medium text-foreground hover:bg-accent/10 hover:text-accent">
              <Link href={item.href} className="flex items-center gap-1.5">
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-card p-4">
              <div className="flex flex-col space-y-4 mt-6">
              <Link href="/" className="flex items-center gap-2 text-primary mb-4">
                <KeyRound className="h-7 w-7 text-accent" />
                <span className="text-lg font-bold">Crypto Cloak</span>
              </Link>
                {navItems.map((item) => (
                  <Button key={item.href} variant="ghost" asChild className="w-full justify-start text-foreground hover:text-accent hover:bg-accent/10">
                     <Link href={item.href} className="flex items-center gap-2 py-2 px-3 text-base">
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
