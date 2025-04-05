import { showError, showSuccess } from '@/hooks/useToast';
import { createExercise } from '@/services/exerciseService';
import { ExerciseCreateRequest, ExerciseResponse } from '@/types/exerciseType';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';

// UI Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/Spinner';

type AddExerciseDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AddExerciseDialog({
  isOpen,
  onOpenChange,
}: AddExerciseDialogProps) {
  const [newExercise, setNewExercise] = useState<ExerciseCreateRequest>({
    title: '',
  });

  const { courseId } = useParams();
  const queryClient = useQueryClient();

  const exerciseMutation = useMutation({
    mutationFn: ({
      courseId,
      exercise,
    }: {
      courseId: string;
      exercise: ExerciseCreateRequest;
    }) => createExercise(courseId, exercise),
    onSuccess: (response: ExerciseResponse) => {
      queryClient.setQueryData<ExerciseResponse[]>(
        ['exercises'],
        (oldExercises = []) => [...oldExercises, response]
      );
      showSuccess('Exercise added successfully');
    },
    onError: error => {
      if (isAxiosError(error)) {
        showError(error.response?.data.message);
      } else {
        showError('Something went wrong');
      }
    },
    onSettled: () => {
      onOpenChange(false);
      resetDialogState();
    },
  });

  const resetDialogState = () => {
    setNewExercise({ title: '' });
  };

  useEffect(() => {
    if (!isOpen) {
      resetDialogState();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewExercise(prev => ({ ...prev, [name]: value }));
  };

  const handleAddExercise = () => {
    if (!courseId) {
      showError('Course ID is missing');
      return;
    }

    if (!newExercise.title.trim()) {
      showError('Exercise title is required');
      return;
    }

    exerciseMutation.mutate({
      courseId,
      exercise: newExercise,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Exercise
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Exercise</DialogTitle>
          <DialogDescription>
            Create a new exercise for the course.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="exercise-title">Exercise Title</Label>
            <Input
              id="exercise-title"
              value={newExercise.title}
              name="title"
              placeholder="Enter exercise title"
              onChange={handleChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAddExercise}
            className="min-w-[120px]"
            disabled={exerciseMutation.isPending}
          >
            {exerciseMutation.isPending ? <Spinner /> : 'Create Exercise'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
