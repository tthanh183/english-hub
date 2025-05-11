import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import GlobalSkeleton from '@/components/GlobalSkeleton';
import { getAllFlashCards } from '@/services/flashCardService';
import { getDeckById } from '@/services/deckService';
import { FlashCardResponse } from '@/types/flashCardType';
import { DeckResponse } from '@/types/deckType';
import FlashCardDialog from '@/components/admin/FlashCardDialog';

export default function FlashCardManagementPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();

  const [isAddFlashCardOpen, setIsAddFlashCardOpen] = useState<boolean>(false);
  const [isEditFlashCardOpen, setIsEditFlashCardOpen] =
    useState<boolean>(false);
  const [selectedFlashCard, setSelectedFlashCard] =
    useState<FlashCardResponse | null>(null);
  const [openDropdownCardId, setOpenDropdownCardId] = useState<string | null>(
    null
  );

  const { data: deck, isLoading: isDeckLoading } = useQuery<DeckResponse>({
    queryKey: ['deck', deckId],
    queryFn: () => getDeckById(deckId || ''),
    enabled: !!deckId,
  });

  const { data: flashCards = [], isLoading: isCardsLoading } = useQuery<
    FlashCardResponse[]
  >({
    queryKey: ['flashcards', deckId],
    queryFn: () => getAllFlashCards(deckId || ''),
    enabled: !!deckId,
  });

  const deleteMutation = useMutation({
    // Delete flash card
  });

  const handleDeleteCard = (id: string) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      console.log('Deleting card with ID:', id);

      deleteMutation.mutate();
    }
  };

  const handleEditCard = (card: FlashCardResponse) => {
    setSelectedFlashCard(card);
    setIsEditFlashCardOpen(true);
  };

  if (isDeckLoading || isCardsLoading) {
    return <GlobalSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate('/admin/decks')}
            variant="outline"
            size="sm"
            className="h-8"
          >
            <ArrowLeft className="h-4 w-fit" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {deck?.name || 'Flash Cards'}
            </h1>
            <p className="text-gray-500 text-sm">
              {flashCards.length} cards in this deck
            </p>
          </div>
        </div>
        <Button onClick={() => setIsAddFlashCardOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Card
        </Button>
        <FlashCardDialog
          isOpen={isAddFlashCardOpen}
          onOpenChange={setIsAddFlashCardOpen}
        />
      </div>

      {flashCards.length === 0 ? (
        <div className="text-center p-12 border rounded-md">
          <p className="mb-4">No flash cards found.</p>
          <Button onClick={() => setIsAddFlashCardOpen(true)}>
            Add Your First Card
          </Button>
          <FlashCardDialog
            isOpen={isAddFlashCardOpen}
            onOpenChange={setIsAddFlashCardOpen}
            flashCard={null}
          />
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[20%]">#</TableHead>
                <TableHead className="w-[40%]">Word</TableHead>
                <TableHead className="w-[40%]">Meaning</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flashCards.map((card, idx) => (
                <TableRow key={card.id}>
                  <TableCell className="font-medium">{idx + 1}</TableCell>
                  <TableCell className="font-medium">{card.word}</TableCell>
                  <TableCell className="line-clamp-2">{card.meaning}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu
                      open={openDropdownCardId === card.id}
                      onOpenChange={isOpen => {
                        setOpenDropdownCardId(isOpen ? card.id : null);
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
                            setOpenDropdownCardId(null);
                            setTimeout(() => {
                              handleEditCard(card);
                            }, 100);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit Card
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onSelect={e => {
                            e.preventDefault();
                            setOpenDropdownCardId(null);
                            setTimeout(() => {
                              handleDeleteCard(card.id);
                            }, 100);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <FlashCardDialog
        isOpen={isEditFlashCardOpen}
        onOpenChange={setIsEditFlashCardOpen}
        flashCard={selectedFlashCard}
      />
    </div>
  );
}
