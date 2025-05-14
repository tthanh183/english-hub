import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Search,
  Volume2,
  Plus,
  Download,
  Upload,
} from 'lucide-react';
import { getDeckById } from '@/services/deckService';
import { getAllFlashCards } from '@/services/flashCardService';
import { DeckResponse } from '@/types/deckType';
import { FlashCardResponse } from '@/types/flashCardType';
import GlobalSkeleton from '@/components/GlobalSkeleton';
import { ROUTES } from '@/constants/routes';

export default function VocabularyPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

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

  if (deckError || cardsError || !deck) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <h2 className="text-red-800 font-medium">Error</h2>
          <p className="text-red-700">
            {(deckError as Error)?.message ||
              (cardsError as Error)?.message ||
              "Couldn't load the deck or flashcards. Please try again."}
          </p>
          <div className="mt-4">
            <Button onClick={() => navigate(ROUTES.DECK)}>Back to Decks</Button>
          </div>
        </div>
      </div>
    );
  }

  const filteredCards = flashCards.filter(card => {
    const matchesSearch =
      card.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.meaning.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

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
            <h1 className="text-2xl font-bold text-gray-800">{deck.name}</h1>
            <p className="text-sm text-gray-600">{deck.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`${ROUTES.DECK}/${deckId}/study`}>
            <Button className="bg-blue-600 hover:bg-blue-700">Study Now</Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="all">
              All Cards ({flashCards.length})
            </TabsTrigger>
            <TabsTrigger value="due">Due for Review (0)</TabsTrigger>
            <TabsTrigger value="flagged">Flagged (0)</TabsTrigger>
          </TabsList>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search cards..."
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          {filteredCards.length === 0 ? (
            <div className="text-center py-12 border rounded-md">
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? 'No cards found matching your search.'
                  : "This deck doesn't have any flashcards yet."}
              </p>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCards.map(card => (
                <Card
                  key={card.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-lg">{card.word}</div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          console.log(`Playing pronunciation for ${card.word}`)
                        }
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mb-2">{card.meaning}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="due" className="mt-0">
          <div className="text-center py-12">
            <p className="text-gray-500">
              No cards due for review at the moment.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="flagged" className="mt-0">
          <div className="text-center py-12">
            <p className="text-gray-500">No flagged cards yet.</p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Deck</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Card
          </Button>
          <Button variant="outline" className="flex items-center">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}
