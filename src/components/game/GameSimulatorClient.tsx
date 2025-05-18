
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertTriangle, CornerDownRight, RotateCcw, ShieldCheck, ShieldAlert, ShieldQuestion, PlayCircle, KeyRound, Trophy, Share2, Puzzle, XCircle, CheckSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile'; // Import useIsMobile
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { gameScript, INITIAL_SCENE_ID, INITIAL_PRIVACY_SCORE, type GameScene, type GameChoice, type MiniPuzzle } from '@/lib/game-script';
import type { LucideIcon } from 'lucide-react';

interface MetadataItemClientState {
  id: string;
  label: string;
  sensitive: boolean;
  selected: boolean;
}


export default function GameSimulatorClient() {
  const [isIntroScreenVisible, setIsIntroScreenVisible] = useState<boolean>(true);
  const [currentSceneId, setCurrentSceneId] = useState<string | null>(null);
  const [currentScene, setCurrentScene] = useState<GameScene | null>(null);
  const [privacyScore, setPrivacyScore] = useState<number>(INITIAL_PRIVACY_SCORE);
  const [playerFlags, setPlayerFlags] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile(); // Get mobile state

  const [metadataPuzzleItems, setMetadataPuzzleItems] = useState<MetadataItemClientState[]>([]);
  const [metadataPuzzleAttempts, setMetadataPuzzleAttempts] = useState<number>(0);
  const [displayedNarrative, setDisplayedNarrative] = useState<string>('');


  const startGame = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setCurrentSceneId(INITIAL_SCENE_ID);
    setPrivacyScore(INITIAL_PRIVACY_SCORE);
    setPlayerFlags({});
    setMetadataPuzzleItems([]);
    setMetadataPuzzleAttempts(0);
    setDisplayedNarrative(''); // Reset narrative for new game
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (currentSceneId) {
      const scene = gameScript[currentSceneId];
      if (scene) {
        setCurrentScene(scene);
        if (scene.miniPuzzle?.type === 'MetadataRedaction' && scene.miniPuzzle.puzzleData?.items) {
          setMetadataPuzzleItems(
            scene.miniPuzzle.puzzleData.items.map((item: any) => ({ ...item, selected: false }))
          );
        } else {
          setMetadataPuzzleItems([]);
        }
      } else {
        console.error(`Scene not found: ${currentSceneId}`);
        setError(`Error: Game script corrupted. Scene '${currentSceneId}' not found.`);
        setCurrentScene(null);
      }
    }
  }, [currentSceneId]);

  useEffect(() => {
    if (currentScene?.narrative) {
      setDisplayedNarrative(''); // Reset for new narrative
      let index = 0;
      const narrativeText = currentScene.narrative; // Capture current narrative
      const intervalId = setInterval(() => {
        setDisplayedNarrative((prev) => prev + narrativeText[index]);
        index++;
        if (index === narrativeText.length) {
          clearInterval(intervalId);
        }
      }, 30); // Typewriter speed: 30ms per character

      return () => clearInterval(intervalId); // Cleanup on component unmount or narrative change
    }
  }, [currentScene?.narrative]);


  const handleStartGameClick = () => {
    setIsIntroScreenVisible(false);
    startGame();
  };

  const handleToggleMetadataSelection = (itemId: string) => {
    setMetadataPuzzleItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleFinalizeRedactions = () => {
    if (!currentScene || currentScene.miniPuzzle?.type !== 'MetadataRedaction' || !metadataPuzzleItems) {
      return;
    }

    const sensitiveItems = metadataPuzzleItems.filter(item => item.sensitive);
    const selectedSensitiveItems = metadataPuzzleItems.filter(item => item.sensitive && item.selected);
    const incorrectlySelectedNonSensitiveItems = metadataPuzzleItems.filter(item => !item.sensitive && item.selected);

    let outcome: 'perfect' | 'good' | 'partial' | 'poor' = 'poor';
    let scoreEffect = 0;
    let feedback = "";
    let nextId = "";
    let flagsToSet: string[] = [];

    const currentAttempt = metadataPuzzleAttempts;
    

    if (selectedSensitiveItems.length === sensitiveItems.length && incorrectlySelectedNonSensitiveItems.length === 0) {
      outcome = 'perfect';
      scoreEffect = 5; 
      feedback = "Excellent! All sensitive metadata correctly redacted. Sources are safe.";
      nextId = 'reykjavik_metadata_redacted';
      flagsToSet = ['metadata_redacted_perfectly'];
    } else if (selectedSensitiveItems.length >= sensitiveItems.length * 0.7 && incorrectlySelectedNonSensitiveItems.length <= 1) {
      outcome = 'good';
      scoreEffect = 5; 
      feedback = "Good job! Most sensitive metadata redacted. Minor risks remain.";
      nextId = 'reykjavik_metadata_redacted';
      flagsToSet = ['metadata_redacted_well'];
    } else if (selectedSensitiveItems.length >= sensitiveItems.length * 0.4) {
      outcome = 'partial';
      scoreEffect = 0;
      feedback = "Partial redaction. Some sensitive data might be exposed.";
      if (currentAttempt === 0) {
        nextId = 'reykjavik_metadata_auto_redact'; 
        flagsToSet = ['metadata_redacted_partially'];
      } else { 
        nextId = 'reykjavik_upload_choice_no_redact'; 
        feedback = "Second attempt still resulted in partial redaction. Proceeding with caution.";
        flagsToSet = ['metadata_redacted_partially_final'];
        scoreEffect = -5; 
      }
    } else { 
      outcome = 'poor';
      scoreEffect = -10;
      feedback = "Poor redaction. Significant sensitive data may still be exposed.";
       if (currentAttempt === 0) {
        nextId = 'reykjavik_upload_choice_no_redact'; 
        flagsToSet = ['metadata_redacted_poorly'];
      } else { 
        nextId = 'gameOver_lose_metadata_fail'; 
        feedback = "Critical failure in metadata redaction after two attempts. Sources compromised.";
        flagsToSet = ['metadata_redacted_critically_failed'];
        scoreEffect = -20; 
      }
    }

    setMetadataPuzzleAttempts(prev => prev + 1);

    if (currentAttempt === 0 && (outcome === 'partial' || outcome === 'poor')) {
      toast({
        title: "Redaction Attempt 1",
        description: `${feedback} You have one more attempt. Please review your selections.`,
        variant: "destructive",
        duration: 5000,
      });
      if (scoreEffect !== 0) {
         const newPrivacyScore = Math.max(0, Math.min(100, privacyScore + scoreEffect));
         setPrivacyScore(newPrivacyScore);
         toast({
            title: "Privacy Update",
            description: `Score changed by ${scoreEffect} due to first redaction attempt.`,
            variant: isMobile ? 'mobileDefault' : 'default',
            duration: 3000,
         });
      }
      return; // Don't proceed to next scene yet
    }

    const syntheticChoice: GameChoice = {
      text: `Finalized metadata redaction (Attempt: ${currentAttempt + 1}, Outcome: ${outcome})`,
      nextSceneId: nextId,
      privacyScoreEffect: scoreEffect,
      feedback: feedback,
      setsFlags: flagsToSet,
    };
    handleDecision(syntheticChoice);
  };


  const handleDecision = (choice: GameChoice) => {
    if (!currentScene || (currentScene.isGameOver && currentScene.id !== 'reykjavik_upload_complete_check_score')) return;

    setError(null);
    setIsLoading(true);

    let scoreAfterThisChoice = privacyScore;
    if (choice.privacyScoreEffect) {
      scoreAfterThisChoice = Math.max(0, Math.min(100, privacyScore + choice.privacyScoreEffect));
    }

    if (currentScene.id !== INITIAL_SCENE_ID && choice.nextSceneId === INITIAL_SCENE_ID && !currentScene.isGameOver) {
        console.error("CLIENT SAFEGUARD: Game tried to reset to MissionBriefing mid-game. Blocking.");
        setError("A narrative error occurred. The game tried to reset unexpectedly. Please try restarting or making a different choice if this persists.");
        setIsLoading(false);
        return;
    }


    setTimeout(() => {
      if (choice.privacyScoreEffect) {
        setPrivacyScore(scoreAfterThisChoice);
      }

      const newFlags = { ...playerFlags };
      if (choice.setsFlags) {
        choice.setsFlags.forEach(flag => newFlags[flag] = true);
      }
      if (choice.clearsFlags) {
        choice.clearsFlags.forEach(flag => delete newFlags[flag]);
      }
      setPlayerFlags(newFlags);

      const feedbackText = choice.feedback || (choice.privacyScoreEffect ? `Security score changed by ${choice.privacyScoreEffect}.` : "Privacy Score: No specific update provided this turn.");
      if (choice.feedback || choice.privacyScoreEffect || choice.nextSceneId !== INITIAL_SCENE_ID) {
         toast({
          title: "Privacy Update",
          description: feedbackText,
          variant: isMobile ? 'mobileDefault' : 'default',
          duration: 3000,
        });
      }


      if (choice.lesson) {
        toast({
          title: "Lesson Learned",
          description: choice.lesson,
          variant: isMobile ? 'mobileDefault' : 'default',
          duration: 3000,
        });
      }


      if (choice.nextSceneId === 'final_outcome_evaluation' || (currentScene.id === 'reykjavik_upload_complete_check_score' && choice.nextSceneId === 'final_outcome_evaluation')) {
        if (scoreAfterThisChoice >= 100) {
            setCurrentSceneId('gameOver_win_perfect');
        } else if (scoreAfterThisChoice >= 80) {
            setCurrentSceneId('gameOver_win_standard');
        } else {
            if (newFlags.self_exposed_reykjavik || newFlags.cafe_usb_compromised || newFlags.metadata_redacted_critically_failed) {
                 setCurrentSceneId('gameOver_lose_exposed_during_upload'); 
            } else if (newFlags.lynx_possibly_compromised_prague || newFlags.lynx_compromised) {
                 setCurrentSceneId('gameOver_lose_lynx_compromised');
            } else {
                 setCurrentSceneId('gameOver_lose_insufficient_evidence');
            }
        }
      } else {
        // Reset attempts if not continuing the same puzzle OR if moving to a non-puzzle scene
        if(choice.nextSceneId !== currentSceneId && !gameScript[choice.nextSceneId]?.miniPuzzle) {
            setMetadataPuzzleAttempts(0);
        }
        setCurrentSceneId(choice.nextSceneId);
      }
      setIsLoading(false);
    }, 500);
  };

  const PrivacyScoreIndicator = ({ score }: { score: number }) => {
    let Icon: LucideIcon = ShieldQuestion;
    let color = "text-primary-foreground"; 
    let progressColorClass = "bg-yellow-400"; 

    if (score >= 80) { Icon = ShieldCheck; color = "text-green-400"; progressColorClass = "bg-green-400"; }
    else if (score >= 50) { Icon = ShieldAlert; color = "text-yellow-400"; progressColorClass = "bg-yellow-400"; }
    else { Icon = ShieldAlert; color = "text-red-400"; progressColorClass = "bg-red-400"; }


    return (
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-2">
            <span className={`font-semibold text-sm text-primary-foreground mr-1`}>Security score:</span>
            <Icon className={`w-5 h-5 ${color}`} />
            <span className={`font-semibold text-lg ${color}`}>{score}/100</span>
        </div>
        <Progress value={score} className="w-32 h-2 mt-1 bg-primary-foreground/20" indicatorClassName={progressColorClass} />
      </div>
    );
  };

  const availableChoices = currentScene?.choices.filter(choice => {
    const meetsRequiredFlags = choice.requiresFlags ? choice.requiresFlags.every(flag => playerFlags[flag]) : true;
    const meetsMissingFlags = choice.requiresMissingFlags ? choice.requiresMissingFlags.every(flag => !playerFlags[flag]) : true;
    return meetsRequiredFlags && meetsMissingFlags;
  }) || [];


  if (isIntroScreenVisible) {
    const introImage = "https://i.ibb.co/LD6FkW5y/data-detective-2.png";
    const introImageHint = "mystery game";
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-xl overflow-hidden bg-card">
        <CardHeader className="text-center p-0 border-b-0">
          <Image
            src={introImage}
            alt="Game Intro"
            width={800}
            height={533}
            className="w-full h-auto object-cover rounded-t-lg"
            data-ai-hint={introImageHint}
            priority
          />
        </CardHeader>
        <CardContent className="text-center p-6">
          <h2 className="text-2xl font-semibold text-primary mb-2">Ready for the Investigation?</h2>
          <p className="text-muted-foreground mb-6">
            Your digital privacy skills will be tested. Make your choices wisely.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center p-6 border-t bg-secondary/30">
          <Button onClick={handleStartGameClick} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md transition-transform hover:scale-105">
            <PlayCircle className="mr-2 h-5 w-5" /> Start Investigation
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (isLoading && !currentScene && !error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 border rounded-lg shadow-sm bg-card">
        <Loader2 className="h-12 w-12 animate-spin text-accent mb-4" />
        <p className="text-lg font-semibold text-primary">Loading Scenario...</p>
        <p className="text-sm text-muted-foreground">Preparing your next move.</p>
      </div>
    );
  }

  if (error && !isLoading) {
    return (
      <Card className="text-center shadow-lg border-destructive bg-card">
        <CardHeader>
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-destructive/20 mb-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-destructive">An Error Occurred</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
        <CardFooter className="flex justify-center">
           <Button onClick={startGame} variant="destructive">
            <RotateCcw className="mr-2 h-4 w-4" /> Restart Game
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (!currentScene) {
     return (
      <div className="text-center p-6 border rounded-lg shadow-sm bg-card">
        <p className="text-lg text-muted-foreground">No game scene loaded. Try restarting.</p>
         <Button onClick={startGame} className="mt-4">
            <RotateCcw className="mr-2 h-4 w-4" /> Restart Game
        </Button>
      </div>
    );
  }

  const isWin = currentScene?.isGameOver && currentScene.isWin === true;
  const isLose = currentScene?.isGameOver && currentScene.isWin === false;
  const isMetadataPuzzleActive = currentScene.miniPuzzle?.type === 'MetadataRedaction' && !currentScene.isGameOver;


  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl overflow-hidden bg-card">
      <CardHeader className="bg-primary text-primary-foreground p-6">
        <div className="flex justify-between items-start">
            <CardTitle className="text-2xl font-semibold">{currentScene.locationTitle || "Current Situation"}</CardTitle>
            <div className="text-right">
                 <PrivacyScoreIndicator score={privacyScore} />
            </div>
        </div>
      </CardHeader>

      {/* Conditionally render the new win image OR the current scene image */}
      {currentScene.isGameOver && isWin ? (
        <div className="p-6 border-b bg-secondary/20 flex justify-center">
          <div className="rounded-lg overflow-hidden shadow-md max-w-xl">
            <Image
              src="https://i.ibb.co/cXL0nQhL/shutdown.png"
              alt="Victory Shutdown"
              width={600}
              height={400} 
              className="w-full h-auto object-contain"
              data-ai-hint="victory success"
            />
          </div>
        </div>
      ) : currentScene.image ? (
         <div className="p-6 border-b bg-secondary/20">
          <div className="rounded-lg overflow-hidden shadow-md">
            <Image
              src={currentScene.image}
              alt={currentScene.locationTitle || "Scene image"}
              width={800}
              height={533}
              className="w-full h-auto object-cover"
              data-ai-hint={currentScene.imageHint || "scene context"}
            />
          </div>
        </div>
      ) : null}


      <ScrollArea className="h-[calc(100vh-450px)] md:h-[520px]" hideScrollbarVisuals>
        <CardContent className="p-6 space-y-6">
          <div className="relative w-full my-4">
            <div className="relative z-10">
              <Image
                src="https://i.ibb.co/bj5f4vsd/laptop-clean-screen.png"
                alt="Laptop screen displaying narrative"
                width={1200}
                height={800}
                className="w-full h-auto"
                data-ai-hint="laptop computer"
              />
            </div>
            <div className="absolute top-[10%] bottom-[18%] left-[14%] right-[14%] z-20">
              <ScrollArea className="w-full h-full bg-white/5 rounded-sm border border-gray-700/30" hideScrollbarVisuals>
                <p className="text-sm sm:text-base text-gray-900 dark:text-gray-800 leading-relaxed whitespace-pre-wrap p-3">
                  {displayedNarrative}
                </p>
              </ScrollArea>
            </div>
          </div>

          {currentScene.miniPuzzle && !currentScene.isGameOver && (
            <div className="p-4 border-l-4 border-accent bg-accent/10 rounded-md">
              <h3 className="font-semibold text-lg text-accent mb-2 flex items-center">
                <Puzzle className="w-5 h-5 mr-2"/> {currentScene.miniPuzzle.title || "Mini-Puzzle"}
              </h3>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap mb-4">{currentScene.miniPuzzle.description}</p>

              {isMetadataPuzzleActive && currentScene.miniPuzzle.puzzleData?.items && (
                <div className="space-y-2">
                  {metadataPuzzleItems.map((item) => (
                    <label key={item.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent/20 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-accent rounded border-primary focus:ring-accent"
                        checked={item.selected}
                        onChange={() => handleToggleMetadataSelection(item.id)}
                        disabled={metadataPuzzleAttempts >= 2 && !currentScene.isGameOver} 
                      />
                      <span className="text-sm text-foreground/90">{item.label} {item.sensitive ? (<Badge variant="destructive" className="ml-2 text-xs">Sensitive</Badge>) : (<Badge variant="secondary" className="ml-2 text-xs">Safe</Badge>)}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

        </CardContent>
      </ScrollArea>

      <CardFooter className="p-6 border-t bg-secondary flex flex-col items-stretch">
        {currentScene.isGameOver ? (
          isWin ? (
            <div className="w-full text-center p-6 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg shadow-2xl text-white">
              <div className="flex items-center justify-center gap-2 mb-4">
                <KeyRound className="h-10 w-10" />
                <h2 className="text-3xl font-bold">Crypto Cloak</h2>
              </div>
              <Trophy className="w-20 h-20 text-yellow-300 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">
                {privacyScore >= 100 ? "Flawless Victory! Master of Privacy!" : "Victory! You're a Privacy Pro!"}
              </h3>
              <p className="text-white/90 mb-1 whitespace-pre-wrap">
                {currentScene.gameOverMessage || (privacyScore >= 100 ? "You've flawlessly navigated the digital shadows, exposed NovaGen, and protected everyone. Your skills are legendary!" : "You've successfully exposed NovaGen's crimes and protected your sources. Well done, Detective!")}
              </p>
               {privacyScore >= 100 && (
                <p className="text-yellow-300 font-semibold mb-1 text-lg">Flawless Operation! Perfect Score: {privacyScore}/100!</p>
              )}
               {privacyScore < 100 && privacyScore >=80 && (
                 <p className="text-white/90 mb-6">Your final security score: <span className="font-bold text-xl">{privacyScore}/100</span></p>
               )}
              <Button
                size="lg"
                className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold text-lg shadow-md mb-6 animate-pulse transition-all duration-150 ease-in-out hover:scale-105"
                onClick={() => {
                  alert("Share this awesome win with your friends! (You can screenshot this card!)");
                }}
              >
                <Share2 className="mr-2 h-6 w-6" /> FLEX YOUR WIN!
              </Button>
              <Button onClick={startGame} variant="outline" size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white hover:border-yellow-300 transition-all duration-150 ease-in-out hover:scale-105">
                <RotateCcw className="mr-2 h-5 w-5" /> Play Again
              </Button>
            </div>
          ) : (
            <div className="w-full text-center">
              <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-primary mb-2">
                Mission Failed
              </h3>
              <p className="text-muted-foreground mb-6 whitespace-pre-wrap">{currentScene.gameOverMessage || "NovaGen's surveillance proved too much this time, or critical mistakes were made."}</p>
              <p className="text-muted-foreground mb-6">Your final security score: <span className="font-bold text-destructive text-xl">{privacyScore}/100</span></p>
              <Button onClick={startGame} size="lg" variant="destructive" className="hover:bg-destructive/90">
                <RotateCcw className="mr-2 h-5 w-5" /> Play Again
              </Button>
            </div>
          )
        ) : isLoading ? (
             <div className="flex items-center justify-center p-4 w-full">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
                <p className="ml-3 text-muted-foreground">Processing...</p>
              </div>
          ) : isMetadataPuzzleActive ? (
            <Button
                onClick={handleFinalizeRedactions}
                size="lg"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                disabled={isLoading || (metadataPuzzleAttempts >= 2 && !currentScene.isGameOver)}
            >
                <CheckSquare className="mr-2 h-5 w-5" /> Finalize Redactions {metadataPuzzleAttempts < 2 ? `(Attempt ${metadataPuzzleAttempts + 1}/2)`: "(Final Attempt Submitted)"}
            </Button>
          ) : availableChoices.length > 0 ? (
            <div className="w-full">
              <h3 className="font-semibold text-lg text-primary mb-1">What do you do next?</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {availableChoices.map((choice, index) => (
                  <Button
                    key={index}
                    onClick={() => handleDecision(choice)}
                    className="w-full justify-start text-left h-auto py-3 group
                               bg-teal-100 border border-teal-600 text-teal-700
                               hover:bg-white hover:text-teal-600 hover:border-teal-600
                               active:bg-white active:text-teal-600 active:border-teal-600
                               dark:bg-teal-700/30 dark:border-teal-500 dark:text-teal-300
                               dark:hover:bg-teal-900/70 dark:hover:text-teal-200
                               dark:active:bg-teal-900/70 dark:active:text-teal-200
                               transition-colors duration-150 ease-in-out"
                    disabled={isLoading}
                  >
                    <CornerDownRight className="h-4 w-4 mr-2
                                      text-teal-600 dark:text-teal-400
                                      group-hover:text-teal-600 group-active:text-teal-600
                                      dark:group-hover:text-teal-300 dark:group-active:text-teal-300
                                      transition-colors duration-150 ease-in-out" />
                    <span className="flex-1 whitespace-normal">{choice.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
             <div className="w-full text-center">
                 <p className="text-muted-foreground mb-4">End of current path or no choices available. Ensure your game script has choices or a game over state for this scene.</p>
                  <Button onClick={startGame} variant="outline" className="mt-2">
                    <RotateCcw className="mr-2 h-4 w-4" /> Restart Game
                  </Button>
             </div>
          )}
        {!currentScene.isGameOver && (
           <Button onClick={startGame} variant="ghost" className="mt-6 text-sm text-muted-foreground hover:text-accent w-full">
            <RotateCcw className="mr-2 h-4 w-4" /> Restart Game from Beginning
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

