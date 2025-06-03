import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft,
  X,
  Zap,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTodayReview, updateReview } from '@/services/reviewService';
import GlobalSkeleton from '@/components/GlobalSkeleton';
import { ROUTES } from '@/constants/routes';
import { showSuccess, showError } from '@/hooks/useToast';

export default function ReviewTodayPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const sessionCompletedRef = useRef(false);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedCards, setStudiedCards] = useState<string[]>([]);
  const [showRating, setShowRating] = useState(false);
  const [isSessionCompleted, setIsSessionCompleted] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['today-review'],
    queryFn: getTodayReview,
    refetchOnWindowFocus: false,
  });

  const reviewCards = data || [];

  useEffect(() => {
    if (data && data.length > 0 && studiedCards.length === 0) {
      sessionCompletedRef.current = false;
    }
  }, [data, studiedCards]);

  const { mutate: submitReview, isPending: isSubmitting } = useMutation({
    mutationFn: updateReview,
    onSuccess: () => {
      showSuccess('Review saved successfully!');
      if (currentCardIndex < reviewCards.length - 1) {
        queryClient.invalidateQueries({ queryKey: ['today-review'] });
      }
    },
    onError: () => {
      showError('Failed to save review');
    },
  });

  useEffect(() => {
    if (
      reviewCards.length === 0 &&
      !isLoading &&
      !error &&
      !sessionCompletedRef.current
    ) {
      showSuccess('No cards to review today! Come back tomorrow.');
      setTimeout(() => {
        navigate(ROUTES.DECK);
      }, 300);
    }
  }, [reviewCards, isLoading, error, navigate]);

  if (isLoading) {
    return <GlobalSkeleton />;
  }

  if (isSessionCompleted || sessionCompletedRef.current) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to={ROUTES.DECK} className="mr-4">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Daily Review</h1>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-green-800 mb-2">
            Review Completed!
          </h2>
          <p className="text-green-700 mb-4">
            You've successfully completed your review session for today. Great
            job! Come back tomorrow for more cards.
          </p>
          <Button
            onClick={() => navigate(ROUTES.DECK)}
            className="bg-green-600 hover:bg-green-700"
          >
            Back to Decks
          </Button>
        </div>
      </div>
    );
  }

  if (error || reviewCards.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to={ROUTES.DECK} className="mr-4">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Daily Review</h1>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            All caught up!
          </h2>
          <p className="text-blue-700 mb-4">
            You don't have any cards to review today. Good job! Come back
            tomorrow or study a specific deck.
          </p>
          <Button onClick={() => navigate(ROUTES.DECK)}>Back to Decks</Button>
        </div>
      </div>
    );
  }

  const currentCard = reviewCards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / reviewCards.length) * 100;

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
              setCurrentCardIndex(prev => prev + 1);
            } else {
              sessionCompletedRef.current = true;
              setIsSessionCompleted(true);
              showSuccess('Review session completed!');
            }
          }, 300);
        },
        onError: error => {
          console.error('Failed to save review:', error);
          showError('Failed to save review. Please try again.');
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
            <h1 className="text-2xl font-bold text-gray-800">Daily Review</h1>
            <p className="text-sm text-gray-600">
              Card {currentCardIndex + 1} of {reviewCards.length}
            </p>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          {studiedCards.length}/{reviewCards.length} reviewed
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
              <div className="text-gray-400 text-sm">
                Click to reveal definition
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
              <div className="text-xl text-center mb-2">
                {currentCard.meaning}
              </div>
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
