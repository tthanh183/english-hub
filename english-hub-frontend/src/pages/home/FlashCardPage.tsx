import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  Volume2,
  Flag,
  Check,
  X,
  Clock,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { getDeckById } from '@/services/deckService';
import { getAllFlashCards } from '@/services/flashCardService';
import { DeckResponse } from '@/types/deckType';
import { FlashCardResponse } from '@/types/flashCardType';
import GlobalSkeleton from '@/components/GlobalSkeleton';
import { ROUTES } from '@/constants/routes';

export default function FlashCardPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedCards, setStudiedCards] = useState<string[]>([]);
  const [flaggedCards, setFlaggedCards] = useState<string[]>([]);
  const [showRating, setShowRating] = useState(false);

  const {
    data: deck,
    isLoading: isDeckLoading,
    error: deckError,
  } = useQuery<DeckResponse>({
    queryKey: ['deck', deckId],
    queryFn: () => getDeckById(deckId || ''),
    enabled: !!deckId,
  });

  const {
    data: flashCards = [],
    isLoading: isCardsLoading,
    error: cardsError,
  } = useQuery<FlashCardResponse[]>({
    queryKey: ['flashcards', deckId],
    queryFn: () => getAllFlashCards(deckId || ''),
    enabled: !!deckId,
  });

  useEffect(() => {
    if (!deckId) {
      navigate(ROUTES.DECK);
    }
  }, [deckId, navigate]);

  if (isDeckLoading || isCardsLoading) {
    return <GlobalSkeleton />;
  }

  if (deckError || cardsError || !deck || flashCards.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <h2 className="text-red-800 font-medium">Error</h2>
          <p className="text-red-700">
            {(deckError as Error)?.message ||
            (cardsError as Error)?.message ||
            flashCards.length === 0
              ? "This deck doesn't have any flashcards yet."
              : "Couldn't load flashcards. Please try again."}
          </p>
          <div className="mt-4">
            <Button onClick={() => navigate(ROUTES.DECK)}>Back to Decks</Button>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = flashCards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / flashCards.length) * 100;

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);

    if (!isFlipped && !studiedCards.includes(currentCard.id)) {
      setShowRating(true);
    }
  };

  const handleRating = (rating: number) => {
    console.log(`Card ${currentCard.id} rated as ${rating}`);

    if (!studiedCards.includes(currentCard.id)) {
      setStudiedCards([...studiedCards, currentCard.id]);
    }

    setShowRating(false);

    setTimeout(() => {
      setIsFlipped(false);

      if (currentCardIndex < flashCards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      } else {
        navigate(`${ROUTES.DECK}/${deckId}`);
      }
    }, 300);
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
      setShowRating(false);
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < flashCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
      setShowRating(false);
    }
  };

  const toggleFlagCard = () => {
    if (flaggedCards.includes(currentCard.id)) {
      setFlaggedCards(flaggedCards.filter(id => id !== currentCard.id));
    } else {
      setFlaggedCards([...flaggedCards, currentCard.id]);
    }
  };

  const playPronunciation = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Playing pronunciation for ${currentCard.word}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link to={`${ROUTES.DECK}`} className="mr-4">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{deck.name}</h1>
            <p className="text-sm text-gray-600">
              Card {currentCardIndex + 1} of {flashCards.length}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFlagCard}
            className={cn(
              flaggedCards.includes(currentCard.id)
                ? 'text-red-500 border-red-500'
                : ''
            )}
          >
            <Flag
              className={cn(
                'h-4 w-4 mr-2',
                flaggedCards.includes(currentCard.id) ? 'fill-red-500' : ''
              )}
            />
            {flaggedCards.includes(currentCard.id) ? 'Flagged' : 'Flag Card'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`${ROUTES.DECK}/${deckId}`)}
          >
            End Session
          </Button>
        </div>
      </div>

      <Progress
        value={progress}
        className="mb-8 h-2 bg-gray-200 [&>div]:bg-blue-600"
      />

      <div className="flex flex-col justify-center mb-8" style={{ minHeight: '400px' }}>
        <div className="w-full max-w-2xl mx-auto" style={{ perspective: '1000px' }}>
          <div
            onClick={handleFlipCard}
            className="cursor-pointer h-80 relative w-full"
            style={{
              transformStyle: 'preserve-3d',
              transition: 'transform 0.6s',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            <Card
              className="absolute w-full h-full p-8 flex flex-col items-center justify-center"
              style={{
                backfaceVisibility: 'hidden',
              }}
            >
              <div className="text-3xl font-bold mb-4">{currentCard.word}</div>
              <div className="mt-6 text-gray-400 text-sm">
                Click to reveal definition
              </div>
            </Card>

            <Card
              className="absolute w-full h-full p-8 bg-blue-50 flex flex-col"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                overflowY: 'auto',
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-2xl font-bold">{currentCard.word}</div>
                <Button variant="ghost" size="sm" onClick={playPronunciation}>
                  <Volume2 className="h-4 w-4 mr-2" />
                  Listen
                </Button>
              </div>
              <div className="text-xl mb-4">{currentCard.meaning}</div>
            </Card>
          </div>
        </div>

        {showRating && (
          <div className="mt-8 flex flex-col items-center">
            <div className="text-lg font-medium mb-4">
              How well did you know this word?
            </div>
            <div className="flex gap-2 w-full max-w-2xl mx-auto">
              <Button
                variant="outline"
                className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                onClick={() => handleRating(0)}
              >
                <X className="h-4 w-4 mr-2" />
                Again
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-orange-500 text-orange-500 hover:bg-orange-50"
                onClick={() => handleRating(1)}
              >
                Hard
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-yellow-500 text-yellow-500 hover:bg-yellow-50"
                onClick={() => handleRating(2)}
              >
                Good
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-green-500 text-green-500 hover:bg-green-50"
                onClick={() => handleRating(3)}
              >
                <Check className="h-4 w-4 mr-2" />
                Easy
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevCard}
          disabled={currentCardIndex === 0}
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous Card
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleFlipCard}
            className="flex items-center"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Flip Card
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setCurrentCardIndex(
                Math.floor(Math.random() * flashCards.length)
              );
              setIsFlipped(false);
              setShowRating(false);
            }}
            className="flex items-center"
          >
            <Clock className="h-4 w-4 mr-2" />
            Random Card
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={handleNextCard}
          disabled={currentCardIndex === flashCards.length - 1}
          className="flex items-center"
        >
          Next Card
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
