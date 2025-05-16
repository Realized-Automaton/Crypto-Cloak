
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { 
  globalDataDetectiveSimulator, 
  type GlobalDataDetectiveInput, 
  type GlobalDataDetectiveOutput
} from '@/ai/flows/privacy-game-simulator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertTriangle, CornerDownRight, RotateCcw, ShieldCheck, ShieldAlert, ShieldQuestion, CheckCircle2, XCircle, Puzzle, PlayCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress'; 
import { Badge } from '@/components/ui/badge'; 

interface GameState extends GlobalDataDetectiveOutput {}

export default function GameSimulatorClient() {
  const [isIntroScreenVisible, setIsIntroScreenVisible] = useState<boolean>(true);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); 
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const startGame = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGameState(null); 
    try {
      const input: GlobalDataDetectiveInput = { 
        isFirstTurn: true,
        currentPrivacyScore: 25, 
      };
      const result = await globalDataDetectiveSimulator(input);
      setGameState(result);

      // Do not show privacyScoreFeedback toast on initial game start
      // if (result.privacyScoreFeedback) {
      //   toast({
      //     title: "Privacy Score Update",
      //     description: result.privacyScoreFeedback,
      //     variant: "default",
      //     duration: 3000, 
      //   });
      // }

      if (result.badgeEarned) {
        toast({
          title: "Badge Earned!",
          description: `You've earned the "${result.badgeEarned}" badge!`,
          variant: "default", 
          duration: 3000, 
        });
      }
      // choiceRecap is usually for after a decision, not typically on the first turn.
    } catch (e: any)
    {
      console.error("Error starting game:", e);
      setError(`Failed to start the game: ${e.message || 'Please try again.'}`);
      toast({
        title: "Game Initialization Error",
        description: e.message || "Could not initialize the game scenario.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleStartGameClick = () => {
    setIsIntroScreenVisible(false);
    startGame();
  };

  const handleDecision = async (decision: string) => {
    if (!gameState || gameState.isGameOver) return;

    setIsLoading(true);
    setError(null);

    try {
      const input: GlobalDataDetectiveInput = { 
        playerDecision: decision,
        previousGamePhase: gameState.currentGamePhase,
        currentPrivacyScore: gameState.privacyScore,
        gameStateContext: gameState.gameStateContextToPass, 
        isFirstTurn: false,
      };
      const result = await globalDataDetectiveSimulator(input);
      setGameState(result);

      const feedbackMessage = result.privacyScoreFeedback || "Privacy Score: No specific update provided this turn.";
      toast({
        title: "Privacy Score Update",
        description: feedbackMessage,
        variant: "default",
        duration: 3000, 
      });
      
      if (result.badgeEarned) {
        toast({
          title: "Badge Earned!",
          description: `You've earned the "${result.badgeEarned}" badge!`,
          variant: "default", 
          duration: 3000, 
        });
      }
      if (result.choiceRecap) {
         toast({
          title: "Lesson Learned",
          description: result.choiceRecap,
          variant: "default",
          duration: 3000, 
        });
      }
    } catch (e: any) {
      console.error("Error processing decision:", e);
      setError(`Failed to process your decision: ${e.message || 'Please try again.'}`);
       toast({
        title: "Game Error",
        description: e.message || "Could not process your decision.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const PrivacyScoreIndicator = ({ score }: { score: number }) => {
    let Icon = ShieldQuestion;
    let color = "text-primary-foreground"; 
    if (score >= 80) { Icon = ShieldCheck; color = "text-green-400"; } 
    else if (score >= 50) { Icon = ShieldAlert; color = "text-yellow-400"; } 
    else { Icon = ShieldAlert; color = "text-red-400"; } 

    return (
      <div className="flex items-center gap-2">
        <span className={`font-semibold text-sm ${color} mr-1`}>Security score:</span>
        <Icon className={`w-5 h-5 ${color}`} />
        <span className={`font-semibold text-lg ${color}`}>{score}/100</span>
      </div>
    );
  };

  if (isIntroScreenVisible) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-xl overflow-hidden">
        <CardHeader className="text-center p-0 border-b-0">
          <Image 
            src="https://i.ibb.co/9mMNj21W/data-detective.png" 
            alt="Global Data Detective Intro" 
            width={800} 
            height={533} 
            className="w-full h-auto object-cover rounded-t-lg"
            data-ai-hint="detective journey"
            priority 
          />
        </CardHeader>
        <CardContent className="text-center p-6">
          <h2 className="text-2xl font-semibold text-primary mb-2">Ready for the Challenge?</h2>
          <p className="text-muted-foreground mb-6">
            Step into the shoes of an investigative reporter. Your mission awaits.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center p-6 border-t">
          <Button onClick={handleStartGameClick} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md transition-transform hover:scale-105">
            <PlayCircle className="mr-2 h-5 w-5" /> Start Game
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (isLoading && !gameState) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 border rounded-lg shadow-sm bg-card">
        <Loader2 className="h-12 w-12 animate-spin text-accent mb-4" />
        <p className="text-lg font-semibold text-primary">Loading Your Investigation...</p>
        <p className="text-sm text-muted-foreground">Preparing your first assignment, Detective.</p>
      </div>
    );
  }

  if (error && !gameState) { 
    return (
      <Card className="text-center shadow-lg border-destructive">
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
            <RotateCcw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  if (!gameState) {
     return ( 
      <div className="text-center p-6 border rounded-lg shadow-sm bg-card">
        <p className="text-lg text-muted-foreground">No game data. Try restarting.</p>
         <Button onClick={startGame} className="mt-4">
            <RotateCcw className="mr-2 h-4 w-4" /> Restart Game
        </Button>
      </div>
    );
  }

  const isWin = gameState.isGameOver && (gameState.currentGamePhase === "GameOver_Win" || gameState.privacyScore >= 80);
  const isLose = gameState.isGameOver && !isWin;

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl overflow-hidden">
      <CardHeader className="bg-primary text-primary-foreground p-6">
        <div className="flex justify-between items-start">
            <CardTitle className="text-2xl font-semibold">{gameState.currentLocationScreenTitle || "Current Situation"}</CardTitle>
            <div className="text-right">
                 <PrivacyScoreIndicator score={gameState.privacyScore} />
            </div>
        </div>
         <Progress value={gameState.privacyScore} className="w-full h-2 mt-2 bg-primary-foreground/20" indicatorClassName="bg-accent" />
      </CardHeader>
      
       <div className="p-6 border-b bg-secondary/20">
        <div className="rounded-lg overflow-hidden shadow-md">
          <Image
            src="https://i.ibb.co/bGdSqfy/biotech-firm-novagen-in-the-background-an-eery-om.jpg"
            alt="Biotech firm NovaGen headquarters"
            width={800}
            height={533} 
            className="w-full h-auto object-cover"
            data-ai-hint="office building"
          />
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-450px)] md:h-[520px]" hideScrollbarVisuals>
        <CardContent className="p-6 space-y-6">
          {error && ( 
            <div className="p-3 border border-destructive/50 bg-destructive/10 rounded-md text-destructive text-sm">
              <AlertTriangle className="inline h-4 w-4 mr-2"/> {error}
            </div>
          )}
          
          <div className="relative w-full my-4"> 
            {/* Foreground Content Wrapper (Laptop) */}
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
            
            {/* Narrative Text Overlay */}
            <div className="absolute top-[10%] bottom-[18%] left-[14%] right-[14%] z-20">
              <ScrollArea className="w-full h-full bg-white/5 rounded-sm border border-gray-700/30" hideScrollbarVisuals>
                <p className="text-xs sm:text-sm text-gray-900 dark:text-gray-800 leading-relaxed whitespace-pre-wrap p-3">
                  {gameState.narrative}
                </p>
              </ScrollArea>
            </div>
          </div>

          {gameState.activeMiniPuzzle && gameState.activeMiniPuzzle.puzzleType !== "None" && (
            <div className="p-4 border-l-4 border-accent bg-accent/10 rounded-md">
              <h3 className="font-semibold text-lg text-accent mb-2 flex items-center">
                <Puzzle className="w-5 h-5 mr-2"/> {gameState.activeMiniPuzzle.title || "Mini-Puzzle"}
              </h3>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{gameState.activeMiniPuzzle.description}</p>
              {/* Future: Add puzzleData rendering here if needed, e.g., JSON.parse(gameState.activeMiniPuzzle.puzzleData).clue */}
            </div>
          )}

        </CardContent>
      </ScrollArea>

      <CardFooter className="p-6 border-t bg-secondary flex flex-col items-stretch">
        {gameState.isGameOver ? (
          <div className="w-full text-center">
            {isWin ? <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" /> : <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />}
            <h3 className="text-2xl font-semibold text-primary mb-2">
              {isWin ? "Mission Accomplished!" : "Mission Failed"}
            </h3>
            <p className="text-muted-foreground mb-6 whitespace-pre-wrap">{gameState.gameOverMessage || (isWin ? "You've successfully exposed NovaGen and protected your sources!" : "NovaGen's surveillance proved too much this time.")}</p>
            <Button onClick={startGame} size="lg">
              <RotateCcw className="mr-2 h-5 w-5" /> Play Again
            </Button>
          </div>
        ) : isLoading ? (
             <div className="flex items-center justify-center p-4 w-full">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
                <p className="ml-3 text-muted-foreground">Analyzing intel...</p>
              </div>
          ) : gameState.choicePoint && gameState.choicePoint.options.length > 0 ? (
            <div className="w-full">
              <h3 className="font-semibold text-lg text-primary mb-1">{gameState.choicePoint.description || "What do you do next?"}</h3>
              <p className="text-sm text-muted-foreground mb-4">Choice Type: {gameState.choicePoint.choiceType}</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {gameState.choicePoint.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleDecision(option)}
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
                    <span className="flex-1 whitespace-normal">{option}</span>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
             <div className="w-full text-center">
                 <p className="text-muted-foreground mb-4">Processing information or end of current path...</p>
                  <Button onClick={startGame} variant="outline" className="mt-2">
                    <RotateCcw className="mr-2 h-4 w-4" /> Restart Game if Stuck
                  </Button>
             </div>
          )}
        {!gameState.isGameOver && (
           <Button onClick={startGame} variant="ghost" className="mt-6 text-sm text-muted-foreground hover:text-accent w-full">
            <RotateCcw className="mr-2 h-4 w-4" /> Restart Game from Beginning
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

