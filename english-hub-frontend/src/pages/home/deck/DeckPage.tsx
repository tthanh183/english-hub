import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Clock, ArrowRight, BookOpen, Zap } from 'lucide-react';
import { getAllDecks } from '@/services/deckService';
import { getTodayReview } from '@/services/reviewService';
import { DeckResponse } from '@/types/deckType';
import GlobalSkeleton from '@/components/GlobalSkeleton';
import { useAuthStore } from '@/stores/authStore';
import { showError } from '@/hooks/useToast';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/constants/routes';

export default function DeckPage() {
  const { data: decks = [], isLoading: isDecksLoading } = useQuery({
    queryKey: ['decks'],
    queryFn: getAllDecks,
  });

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const navigate = useNavigate();

  const { data: todayReviews = [], isLoading: isReviewLoading } = useQuery({
    queryKey: ['today-review'],
    queryFn: getTodayReview,
    enabled: isAuthenticated,
  });

  const handleStartFlashCard = (deckId: string) => {
    if (!isAuthenticated) {
      showError('You need to login first');
      return;
    } else {
      navigate(`/decks/${deckId}/flashcards`);
    }
  };

  const handleStartTodayReview = () => {
    if (!isAuthenticated) {
      showError('You need to login first');
      return;
    } else {
      navigate('/review/today');
    }
  };

  if (isDecksLoading || isReviewLoading) {
    return <GlobalSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Vocabulary Learning
        </h1>
        <p className="text-gray-600">
          Master English vocabulary with our Anki-style flashcard system. Review
          cards and track your progress over time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {isAuthenticated && todayReviews.length > 0 && (
          <Card className="overflow-hidden border-blue-200 hover:shadow-md transition-shadow bg-gradient-to-br from-blue-50 to-white flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-blue-600" />
                  Today's Review
                </CardTitle>
                <Badge className="bg-blue-100 text-blue-700">
                  {todayReviews.length} card
                  {todayReviews.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              <CardDescription>
                Review words scheduled for today based on spaced repetition
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-3 flex-1 flex items-end">
              <div className="grid grid-cols-2 gap-4 text-sm w-full">
                <div className="bg-blue-50 p-3 rounded-md">
                  <div className="flex items-center text-gray-500 mb-1">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>Cards</span>
                  </div>
                  <div className="font-semibold">
                    {todayReviews.length} cards
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-md">
                  <div className="flex items-center text-gray-500 mb-1">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Date</span>
                  </div>
                  <div className="font-semibold">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-end pt-3 border-t">
              <Button
                className="bg-blue-600 hover:bg-blue-700 h-10 w-full"
                onClick={handleStartTodayReview}
              >
                Start Review
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {decks.map((deck: DeckResponse) => (
          <Card
            key={deck.id}
            className="overflow-hidden hover:shadow-md transition-shadow flex flex-col"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{deck.name}</CardTitle>
              </div>
              <CardDescription className="leading-relaxed">
                {deck.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-3 flex-1 flex items-end">
              <div className="grid grid-cols-2 gap-4 text-sm w-full">
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center text-gray-500 mb-1">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>Cards</span>
                  </div>
                  <div className="font-semibold">12 cards</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center text-gray-500 mb-1">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Created</span>
                  </div>
                  <div className="font-semibold">
                    {new Date(deck.createdDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-end pt-3 border-t">
              <Button
                className="bg-blue-600 hover:bg-blue-700 h-10 w-full"
                onClick={() => handleStartFlashCard(deck.id)}
              >
                Study Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-blue-800 mb-2">
              📈 Improve Your TOEIC Score
            </h2>
            <p className="text-blue-700 max-w-xl">
              Join thousands of learners who achieved their target scores
              through consistent practice and improvement
            </p>
          </div>
          <div className="flex gap-3">
            <Link to={ROUTES.DECK}>
              <Button
                size="lg"
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                Study Vocabulary
              </Button>
            </Link>
            <Link to={ROUTES.EXAM}>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Take Exam
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
