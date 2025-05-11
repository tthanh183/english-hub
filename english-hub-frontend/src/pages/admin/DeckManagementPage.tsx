import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  File,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronRight,
  SearchIcon,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DeckResponse } from '@/types/deckType';
import DeckDialog from '@/components/admin/DeckDialog';
import GlobalSkeleton from '@/components/GlobalSkeleton';
import { getAllDecks } from '@/services/deckService';

export default function VocabularyDecks() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddDeckOpen, setIsAddDeckOpen] = useState<boolean>(false);
  const [isEditDeckOpen, setIsEditDeckOpen] = useState<boolean>(false);
  const [selectedDeck, setSelectedDeck] = useState<DeckResponse | null>(null);
  const [openDropdownDeckId, setOpenDropdownDeckId] = useState<string | null>(
    null
  );
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: decks = [], isLoading } = useQuery<DeckResponse[]>({
    queryKey: ['decks'],
    queryFn: getAllDecks,
  });

  const deleteDeckMutation = useMutation({
    mutationFn: async (deckId: string) => {
      const response = await fetch(`/api/vocabulary-decks/${deckId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete vocabulary deck');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabularyDecks'] });
    },
  });

  const handleDeleteDeck = (deckId: string) => {
    if (window.confirm('Are you sure you want to delete this deck?')) {
      deleteDeckMutation.mutate(deckId);
    }
  };

  const filteredDecks = decks.filter(
    deck =>
      deck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <GlobalSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Vocabulary Decks</h1>
          <p className="text-gray-500">
            Manage your vocabulary flash card collections
          </p>
        </div>
        <Button onClick={() => setIsAddDeckOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Deck
        </Button>
        <DeckDialog isOpen={isAddDeckOpen} onOpenChange={setIsAddDeckOpen} />
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search decks by name or description..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDecks?.length === 0 ? (
          <div className="col-span-3 flex flex-col items-center justify-center h-64">
            <File className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No decks found</h3>
            <p className="text-gray-500 mb-4">
              Create your first deck to get started
            </p>
            <Button onClick={() => setIsAddDeckOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create New Deck
            </Button>
          </div>
        ) : (
          filteredDecks?.map(deck => (
            <Card
              key={deck.id}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1 mr-2">
                    <CardTitle>{deck.name}</CardTitle>
                    <CardDescription className="text-sm line-clamp-1">
                      {deck.description}
                    </CardDescription>
                  </div>
                  <DropdownMenu
                    open={openDropdownDeckId === deck.id}
                    onOpenChange={isOpen => {
                      setOpenDropdownDeckId(isOpen ? deck.id : null);
                    }}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onSelect={e => {
                          e.preventDefault();
                          setOpenDropdownDeckId(null);
                          setTimeout(() => {
                            setSelectedDeck(deck);
                            setIsEditDeckOpen(true);
                          }, 100);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit Deck
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onSelect={e => {
                          e.preventDefault();
                          setOpenDropdownDeckId(null);
                          setTimeout(() => {
                            handleDeleteDeck(deck.id);
                          }, 100);
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500 mt-1">
                  <div className="flex items-center gap-2 justify-between">
                    <span>20 cards</span>
                    <span>
                      Updated {new Date(deck.updatedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => navigate(`/admin/decks/${deck.id}`)}
                >
                  Manage Cards <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
        <DeckDialog
          isOpen={isEditDeckOpen}
          onOpenChange={setIsEditDeckOpen}
          deck={selectedDeck}
        />
      </div>
    </div>
  );
}
