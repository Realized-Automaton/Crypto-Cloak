
"use client";

import { useState, useEffect, useRef } from 'react';
import { InfoCard } from '@/components/InfoCard';
import { PRIVACY_EXPLAINED_CONTENT } from '@/lib/constants';
import type { LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { XCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function PrivacyExplainedPage() {
  const [isFeatureUnlocked, setIsFeatureUnlocked] = useState(false);
  const [isLoadingStorage, setIsLoadingStorage] = useState(true);
  const paragraphCounter = useRef(0); 

  const [clickedSequence, setClickedSequence] = useState<number[]>([]);
  const [showVideoPlayer, setShowVideoPlayer] = useState<boolean>(false);
  const targetSequence = [8, 6, 7, 5, 3, 0, 9]; 
  const videoId = 'j7V2_jQ_QUU'; 
  const videoStartTime = 0; // Start from the beginning

  useEffect(() => {
    console.log("--- PRIVACY EXPLAINED PAGE: useEffect RUNNING ---");

    const resetEasterEggStates = () => {
      console.log("Resetting Easter egg states: clickedSequence and showVideoPlayer");
      setClickedSequence([]);
      setShowVideoPlayer(false);
    };

    // Initial reset on mount
    resetEasterEggStates();

    // Handle bfcache restoration
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        console.log("Page restored from bfcache, resetting Easter egg states.");
        resetEasterEggStates();
      }
    };
    window.addEventListener('pageshow', handlePageShow);

    let unlocked = false;
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem('cryptoCloakFlawlessVictory');
      console.log("1. Value of 'cryptoCloakFlawlessVictory' from localStorage:", storedValue);
      if (storedValue === 'true') {
        unlocked = true;
        console.log("2. Decision: Feature IS UNLOCKED based on localStorage.");
      } else {
        console.log("2. Decision: Feature IS NOT UNLOCKED (localStorage value is not 'true' or item not found).");
        unlocked = false; // Ensure it's explicitly false
      }
    } else {
      console.log("1. localStorage not available (e.g., SSR).");
      console.log("2. Decision: Feature IS NOT UNLOCKED (SSR).");
      unlocked = false; // Ensure it's explicitly false
    }
    setIsFeatureUnlocked(unlocked);
    console.log("3. State 'isFeatureUnlocked' SET TO:", unlocked);
    
    paragraphCounter.current = 0; 
    if (unlocked) {
      console.log("4. Paragraph counter reset to 0 because feature IS unlocked (within useEffect).");
    } else {
      console.log("4. Paragraph counter reset to 0 because feature IS NOT unlocked (within useEffect).");
    }

    setIsLoadingStorage(false);
    console.log("5. State 'isLoadingStorage' SET TO: false");

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []); 
  
  const handleParagraphClick = (paragraphNumber: number) => {
    if (!isFeatureUnlocked) return;

    const newSequence = [...clickedSequence, paragraphNumber];
    setClickedSequence(newSequence);

    let match = true;
    for (let i = 0; i < newSequence.length; i++) {
      if (newSequence[i] !== targetSequence[i]) {
        match = false;
        break;
      }
    }

    if (match) {
      if (newSequence.length === targetSequence.length) {
        setShowVideoPlayer(true);
        setClickedSequence([]); 
      }
    } else {
      // If the sequence is broken, check if the current click is the start of a new valid sequence
      if (paragraphNumber === targetSequence[0]) {
        setClickedSequence([paragraphNumber]);
      } else {
        setClickedSequence([]);
      }
    }
  };

  if (isLoadingStorage) {
    console.log("--- PRIVACY EXPLAINED PAGE: Rendering LOADING state ---");
    return <div className="text-center p-10">Loading Privacy Insights...</div>;
  }
  
  console.log("--- PRIVACY EXPLAINED PAGE: PRE-RENDER FULL CONTENT ---");
  console.log("Current 'isFeatureUnlocked' state:", isFeatureUnlocked);
  
  paragraphCounter.current = 0;
  if (isFeatureUnlocked) {
    console.log("Paragraph counter reset to 0 because feature IS unlocked (pre-map).");
  } else {
    console.log("Paragraph counter confirmed/set to 0 because feature IS NOT unlocked (pre-map).");
  }
  console.log("Paragraph counter value immediately before map:", paragraphCounter.current);


  return (
    <div className="space-y-12 relative">
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
        const CategoryIconComponent = category.icon ? LucideIcons[category.icon as keyof typeof LucideIcons] as LucideIcon : null;
        return (
          <section key={category.id} className="space-y-6">
             <div className="flex items-center gap-3">
              {CategoryIconComponent && <CategoryIconComponent className="w-10 h-10 text-accent" />}
              <h2 className="text-3xl font-semibold text-primary">{category.title}</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
              {category.sections.map((item) => {
                let displayText = item.text;
                let cardContentClasses = "text-md text-foreground/90 leading-relaxed pt-4";
                let isNumberedThisIteration = false;
                let numberForThisParagraph: number | null = null;

                if (isFeatureUnlocked && paragraphCounter.current <= 9) {
                  numberForThisParagraph = paragraphCounter.current;
                  displayText = `${numberForThisParagraph}. ${item.text}`;
                  cardContentClasses = cn(cardContentClasses, "cursor-pointer hover:bg-accent/10 rounded-md transition-colors p-4");
                  isNumberedThisIteration = true;
                  paragraphCounter.current++;
                }
                
                return (
                  <InfoCard
                    key={item.title}
                    title={item.title}
                    className="bg-card"
                  >
                    <CardContent 
                      className={cardContentClasses}
                      onClick={
                        isNumberedThisIteration && numberForThisParagraph !== null
                          ? () => handleParagraphClick(numberForThisParagraph!)
                          : undefined
                      }
                    >
                       {displayText}
                    </CardContent>
                  </InfoCard>
                );
              })}
            </div>
            { PRIVACY_EXPLAINED_CONTENT.indexOf(category) < PRIVACY_EXPLAINED_CONTENT.length - 1 && <Separator className="my-8"/>}
          </section>
        );
      })}

      {showVideoPlayer && isFeatureUnlocked && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card p-4 rounded-lg shadow-xl relative w-full max-w-3xl aspect-video">
            <button
              onClick={() => {
                setShowVideoPlayer(false);
                setClickedSequence([]); 
              }}
              className="absolute -top-3 -right-3 text-primary-foreground bg-primary hover:bg-accent hover:text-accent-foreground rounded-full p-1 z-10 focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Close video"
            >
              <XCircle className="w-8 h-8" />
            </button>
            <iframe
              className="w-full h-full rounded"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&start=${videoStartTime}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
