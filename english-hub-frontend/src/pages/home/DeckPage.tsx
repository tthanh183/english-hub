import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';
import { getAllDecks } from '@/services/deckService';
import { DeckResponse } from '@/types/deckType';
import GlobalSkeleton from '@/components/GlobalSkeleton';

export default function VocabularyPage() {
  const { data: decks = [], isLoading } = useQuery({
    queryKey: ['decks'],
    queryFn: getAllDecks,
  });

  if (isLoading) {
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
        {decks.map((deck: DeckResponse) => (
          <Card
            key={deck.id}
            className="overflow-hidden hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{deck.name}</CardTitle>
              </div>
              <CardDescription>{deck.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center text-gray-500 mb-1">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span> Cards</span>
                  </div>
                  <div className="font-semibold">20 cards</div>
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
            <CardFooter className="flex justify-between pt-3 border-t">
              <Link to={`/vocabulary/${deck.id}`}>
                <Button
                  variant="outline"
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  Browse Cards
                </Button>
              </Link>
              <Link to={`/decks/${deck.id}`}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Study Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-blue-800 mb-2">
              Create Your Own Vocabulary Deck
            </h2>
            <p className="text-blue-700 max-w-xl">
              Create custom vocabulary decks tailored to your learning needs and
              import words from various sources.
            </p>
          </div>
          <Link to="/vocabulary/create">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Create New Deck
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
