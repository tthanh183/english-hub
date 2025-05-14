'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
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
  Filter,
} from 'lucide-react';

// Mock vocabulary data
const vocabularyDecks = {
  'toeic-essential': {
    id: 'toeic-essential',
    title: 'TOEIC Essential Vocabulary',
    description: '600 essential words for the TOEIC exam',
    cards: [
      {
        id: 1,
        front: 'accommodate',
        back: 'to provide lodging or sufficient space for',
        example: 'The hotel can accommodate up to 500 guests.',
        pronunciation: '/əˈkɒmədeɪt/',
        partOfSpeech: 'verb',
      },
      {
        id: 2,
        front: 'adjacent',
        back: 'next to or adjoining something else',
        example: 'Our office is adjacent to the train station.',
        pronunciation: '/əˈdʒeɪsənt/',
        partOfSpeech: 'adjective',
      },
      {
        id: 3,
        front: 'allocate',
        back: 'to distribute according to a plan or set apart for a special purpose',
        example: 'We need to allocate more resources to this project.',
        pronunciation: '/ˈæləkeɪt/',
        partOfSpeech: 'verb',
      },
      {
        id: 4,
        front: 'anticipate',
        back: 'to expect or predict',
        example: 'We anticipate strong growth in the next quarter.',
        pronunciation: '/ænˈtɪsɪpeɪt/',
        partOfSpeech: 'verb',
      },
      {
        id: 5,
        front: 'commence',
        back: 'to begin or start',
        example: 'The meeting will commence at 9 AM sharp.',
        pronunciation: '/kəˈmens/',
        partOfSpeech: 'verb',
      },
      {
        id: 6,
        front: 'comply',
        back: 'to act in accordance with a wish or command',
        example: 'All employees must comply with the new regulations.',
        pronunciation: '/kəmˈplaɪ/',
        partOfSpeech: 'verb',
      },
      {
        id: 7,
        front: 'comprehensive',
        back: 'complete; including all or nearly all elements or aspects of something',
        example: 'The report provides a comprehensive analysis of the market.',
        pronunciation: '/ˌkɒmprɪˈhensɪv/',
        partOfSpeech: 'adjective',
      },
      {
        id: 8,
        front: 'crucial',
        back: 'decisive or critical, especially in the success or failure of something',
        example: 'Teamwork is crucial for the success of this project.',
        pronunciation: '/ˈkruːʃəl/',
        partOfSpeech: 'adjective',
      },
      {
        id: 9,
        front: 'deadline',
        back: 'the latest time or date by which something should be completed',
        example: 'The deadline for this assignment is next Friday.',
        pronunciation: '/ˈdedlaɪn/',
        partOfSpeech: 'noun',
      },
      {
        id: 10,
        front: 'efficient',
        back: 'achieving maximum productivity with minimum wasted effort or expense',
        example: 'The new system is more efficient than the old one.',
        pronunciation: '/ɪˈfɪʃənt/',
        partOfSpeech: 'adjective',
      },
    ],
  },
  'business-english': {
    id: 'business-english',
    title: 'Business English',
    description: '300 essential business English terms and phrases',
    cards: [
      {
        id: 1,
        front: 'agenda',
        back: 'a list of items to be discussed at a meeting',
        example: "Let's go through the agenda for today's meeting.",
        pronunciation: '/əˈdʒendə/',
        partOfSpeech: 'noun',
      },
      {
        id: 2,
        front: 'benchmark',
        back: 'a standard or point of reference against which things may be compared',
        example: 'Our sales figures are well above the industry benchmark.',
        pronunciation: '/ˈbentʃmɑːk/',
        partOfSpeech: 'noun',
      },
      // More cards would be here
    ],
  },
  // Other decks would be defined here
};

export default function DeckPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.deckId as string;
  const deck = vocabularyDecks[deckId as keyof typeof vocabularyDecks];

  const [searchTerm, setSearchTerm] = useState('');
  const [filterPartOfSpeech, setFilterPartOfSpeech] = useState('all');

  // If deck doesn't exist, redirect to vocabulary page
  if (!deck) {
    router.push('/vocabulary');
    return null;
  }

  const filteredCards = deck.cards.filter(card => {
    const matchesSearch =
      card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.back.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterPartOfSpeech === 'all' || card.partOfSpeech === filterPartOfSpeech;

    return matchesSearch && matchesFilter;
  });

  const partsOfSpeech = Array.from(
    new Set(deck.cards.map(card => card.partOfSpeech))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/vocabulary" className="mr-4">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{deck.title}</h1>
            <p className="text-sm text-gray-600">{deck.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/vocabulary/${deckId}/study`}>
            <Button className="bg-blue-600 hover:bg-blue-700">Study Now</Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="all">
              All Cards ({deck.cards.length})
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
            <Button variant="outline" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCards.map(card => (
              <Card
                key={card.id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-lg">{card.front}</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        console.log(`Playing pronunciation for ${card.front}`)
                      }
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    {card.partOfSpeech}
                  </div>
                  <div className="mb-2">{card.back}</div>
                  <div className="text-sm text-gray-600 italic">
                    {card.example}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
