import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/Spinner';
import { showSuccess, showError } from '@/hooks/useToast';
import {
  FlashCardResponse,
  FlashCardCreateRequest,
  FlashCardUpdateRequest,
} from '@/types/flashCardType';
import { createFlashCard, updateFlashCard } from '@/services/flashCardService';
import { Plus, Save } from 'lucide-react';
import { useParams } from 'react-router-dom';

interface FlashCardDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  flashCard?: FlashCardResponse | null;
}

export default function FlashCardDialog({
  isOpen,
  onOpenChange,
  flashCard,
}: FlashCardDialogProps) {
  const deckId = useParams<{ deckId: string }>().deckId ?? '';
  const isEditMode = !!flashCard;
  const queryClient = useQueryClient();

  const [flashCardData, setFlashCardData] = useState<
    FlashCardCreateRequest | FlashCardUpdateRequest
  >({
    word: '',
    meaning: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (flashCard) {
        setFlashCardData({
          word: flashCard.word,
          meaning: flashCard.meaning,
        });
      } else {
        setFlashCardData({
          word: '',
          meaning: '',
        });
      }
    }
  }, [isOpen, flashCard]);

  const saveFlashCardMutation = useMutation({
    mutationFn: async () => {
      if (isEditMode && flashCard) {
        return updateFlashCard(
          deckId,
          flashCard.id,
          flashCardData as FlashCardUpdateRequest
        );
      } else {
        return createFlashCard(deckId, flashCardData as FlashCardCreateRequest);
      }
    },
    onSuccess: (response: FlashCardResponse) => {
      if (isEditMode) {
        queryClient.setQueryData<FlashCardResponse[]>(
          ['flashcards', deckId],
          (oldCards = []) => {
            return Array.isArray(oldCards)
              ? oldCards.map(card =>
                  card.id === response.id ? response : card
                )
              : [response];
          }
        );
        showSuccess('Flash card updated successfully');
      } else {
        queryClient.setQueryData<FlashCardResponse[]>(
          ['flashcards', deckId],
          (oldCards = []) => [...oldCards, response]
        );
        showSuccess('Flash card created successfully');
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
    if (!flashCardData.word.trim()) {
      showError('Word is required');
      return;
    }

    if (!flashCardData.meaning.trim()) {
      showError('Meaning is required');
      return;
    }

    saveFlashCardMutation.mutate();
  };

  const isPending = saveFlashCardMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Flash Card' : 'Add New Flash Card'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update flash card information.'
              : 'Create a new vocabulary flash card.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="word">Word</Label>
            <Input
              id="word"
              value={flashCardData.word}
              onChange={e =>
                setFlashCardData({ ...flashCardData, word: e.target.value })
              }
              placeholder="Enter vocabulary word"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="meaning">Meaning</Label>
            <Textarea
              id="meaning"
              placeholder="Enter the definition of this word"
              rows={3}
              value={flashCardData.meaning}
              onChange={e =>
                setFlashCardData({ ...flashCardData, meaning: e.target.value })
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
                Add Card
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
