
import GameSimulatorClient from '@/components/game/GameSimulatorClient';
import { Globe2 } from 'lucide-react'; // Updated icon for a global theme

export default function GameSimulatorPage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <div className="inline-flex items-center justify-center bg-accent/10 p-3 rounded-full mb-4">
         <Globe2 className="w-12 h-12 text-accent" /> {/* Updated icon */}
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          The Global Data Detective
        </h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          Embark on a thrilling mission as an investigative reporter. Navigate global data trails, protect your sources, and expose corporate secrets while learning crucial digital privacy skills.
        </p>
      </section>
      
      <GameSimulatorClient />
    </div>
  );
}

