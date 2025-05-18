
import GameSimulatorClient from '@/components/game/GameSimulatorClient';
import { Puzzle } from 'lucide-react'; // Changed icon to generic Puzzle

export default function GameSimulatorPage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <div className="inline-flex items-center justify-center bg-accent/10 p-3 rounded-full mb-4">
         <Puzzle className="w-12 h-12 text-accent" /> {/* Generic Puzzle icon */}
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Interactive Privacy Game
        </h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          Test your digital privacy knowledge and decision-making skills in this interactive simulation. Navigate challenging scenarios and learn to protect your data.
        </p>
      </section>
      
      <GameSimulatorClient />
    </div>
  );
}

    