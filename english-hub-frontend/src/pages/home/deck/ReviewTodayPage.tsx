import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft,
  X,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Zap,
  CheckCircle,
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getTodayReview, updateReview } from '@/services/reviewService';
import GlobalSkeleton from '@/components/GlobalSkeleton';
import { ROUTES } from '@/constants/routes';
import { showSuccess, showError } from '@/hooks/useToast';
import { isAxiosError } from 'axios';

export default function ReviewTodayPage() {
  const navigate = useNavigate();

  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [studiedCards, setStudiedCards] = useState<string[]>([]);
  const [showRating, setShowRating] = useState<boolean>(false);

  const { mutate: submitReview, isPending: isSubmitting } = useMutation({
    mutationFn: (data: { flashCardId: string; rating: number }) =>
      updateReview(data),
    onError: error => {
      if (isAxiosError(error)) {
        showError(
          error.response?.data.message || 'An unexpected error occurred'
        );
      } else {
        showError('Failed to save review. Please try again.');
      }
    },
  });

  const {
    data: reviewCards = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['today-review'],
    queryFn: getTodayReview,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    setStudiedCards([]);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setShowRating(false);
  }, []);

  if (isLoading) {
    return <GlobalSkeleton />;
  }

  if (error || reviewCards.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <h2 className="text-blue-800 font-medium">No Cards to Review</h2>
          <p className="text-blue-700">
            {reviewCards.length === 0
              ? 'You have no cards scheduled for review today. Great job!'
              : "Couldn't load review cards. Please try again."}
          </p>
          <div className="mt-4">
            <Button onClick={() => navigate(ROUTES.DECK)}>Back to Decks</Button>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = reviewCards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / reviewCards.length) * 100;
  const studiedCount = studiedCards.length;
  const totalCards = reviewCards.length;

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);

    if (!isFlipped && !studiedCards.includes(currentCard.id)) {
      setShowRating(true);
    }
  };

  const handleRating = (rating: number) => {
    submitReview(
      {
        flashCardId: currentCard.id,
        rating: rating,
      },
      {
        onSuccess: () => {
          if (!studiedCards.includes(currentCard.id)) {
            setStudiedCards(prev => [...prev, currentCard.id]);
          }

          setShowRating(false);

          setTimeout(() => {
            setIsFlipped(false);

            if (currentCardIndex < reviewCards.length - 1) {
              setCurrentCardIndex(currentCardIndex + 1);
            } else if (studiedCount + 1 >= totalCards) {
              showSuccess(
                "You've completed today's review! The system is calculating new schedules..."
              );
              setTimeout(() => navigate(ROUTES.DECK), 2000);
            } else {
              showSuccess('Card review saved successfully');
            }
          }, 10);
        },
      }
    );
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
      setShowRating(false);
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < reviewCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
      setShowRating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link to={ROUTES.DECK} className="mr-4">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Today's Review</h1>
            <p className="text-sm text-gray-600">
              Card {currentCardIndex + 1} of {reviewCards.length}
            </p>
          </div>
        </div>

        <div className="text-sm text-gray-600 flex items-center">
          <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
          <span>
            {studiedCount}/{totalCards} studied
          </span>
        </div>
      </div>

      <Progress
        value={progress}
        className="mb-8 h-2 bg-gray-200 [&>div]:bg-blue-600"
      />

      <div
        className="flex flex-col justify-center mb-8"
        style={{ minHeight: '400px' }}
      >
        <div
          className="w-full max-w-2xl mx-auto"
          style={{ perspective: '1000px' }}
        >
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
                Click to reveal meaning
              </div>
            </Card>

            <Card
              className="absolute w-full h-full p-8 bg-blue-50 flex flex-col justify-center items-center"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                overflowY: 'auto',
              }}
            >
              <div className="text-xl text-center">{currentCard.meaning}</div>
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
                className="flex-1 border-green-600 text-green-700 hover:bg-green-50"
                onClick={() => handleRating(4)}
                disabled={isSubmitting}
              >
                <Zap className="h-4 w-4 mr-1" />
                Perfect
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-green-400 text-green-500 hover:bg-green-50"
                onClick={() => handleRating(3)}
                disabled={isSubmitting}
              >
                Easy
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-yellow-500 text-yellow-500 hover:bg-yellow-50"
                onClick={() => handleRating(2)}
                disabled={isSubmitting}
              >
                Good
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-red-300 text-red-400 hover:bg-red-50"
                onClick={() => handleRating(1)}
                disabled={isSubmitting}
              >
                Hard
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                onClick={() => handleRating(0)}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-1" />
                Forgot
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
        </div>

        <Button
          variant="outline"
          onClick={handleNextCard}
          disabled={currentCardIndex === reviewCards.length - 1}
          className="flex items-center"
        >
          Next Card
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
