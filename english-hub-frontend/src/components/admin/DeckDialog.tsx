import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Plus, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  DeckResponse,
  DeckCreateRequest,
  DeckUpdateRequest,
} from '@/types/deckType';
import { createDeck, updateDeck } from '@/services/deckService';
import { showError, showSuccess } from '@/hooks/useToast';
import { Spinner } from '@/components/Spinner';
import GlobalSkeleton from '../GlobalSkeleton';

type DeckDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  deck?: DeckResponse | null;
};

export default function DeckDialog({
  isOpen,
  onOpenChange,
  deck = null,
}: DeckDialogProps) {
  const isEditMode = !!deck;
  const queryClient = useQueryClient();

  const [deckData, setDeckData] = useState<
    DeckCreateRequest | DeckUpdateRequest
  >({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (deck) {
        setDeckData({
          name: deck.name,
          description: deck.description,
        });
      } else {
        setDeckData({
          name: '',
          description: '',
        });
      }
    }
  }, [isOpen, deck]);

  const saveDeckMutation = useMutation({
    mutationFn: async () => {
      console.log('deckData', deckData);

      if (isEditMode && deck) {
        return updateDeck(deck.id, deckData as DeckUpdateRequest);
      } else {
        return createDeck(deckData as DeckCreateRequest);
      }
    },
    onSuccess: (response: DeckResponse) => {
      if (isEditMode) {
        queryClient.setQueryData<DeckResponse[]>(['decks'], (oldDecks = []) =>
          Array.isArray(oldDecks)
            ? oldDecks.map(d => (d.id === response.id ? response : d))
            : [response]
        );
        showSuccess('Deck updated successfully');
      } else {
        queryClient.setQueryData<DeckResponse[]>(['decks'], (oldDecks = []) => [
          ...oldDecks,
          response,
        ]);
        showSuccess('Deck added successfully');
      }
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        showError(error.response?.data.message || 'An error occurred');
      } else {
        showError('Something went wrong');
      }
    },
  });

  const handleSubmit = async () => {
    if (!deckData.name.trim()) {
      showError('Deck name is required');
      return;
    }

    saveDeckMutation.mutate();
  };

  const isPending = saveDeckMutation.isPending;

  if (isPending) {
    return <GlobalSkeleton />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Deck' : 'Add New Deck'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update deck information.'
              : 'Create a new deck for vocabulary cards.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Deck Name</Label>
            <Input
              id="name"
              value={deckData.name}
              onChange={e => setDeckData({ ...deckData, name: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter a brief description of the deck"
              rows={4}
              value={deckData.description}
              onChange={e =>
                setDeckData({ ...deckData, description: e.target.value })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-[150px]"
          >
            {isPending ? (
              <Spinner />
            ) : isEditMode ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Deck
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
