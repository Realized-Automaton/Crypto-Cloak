export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-6">
      <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Crypto Cloak. All rights reserved.</p>
        <p className="mt-1">Dedicated to advancing blockchain privacy awareness.</p>
      </div>
    </footer>
  );
}
