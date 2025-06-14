import { showError, showSuccess } from '@/hooks/useToast';
import { createExercise, updateExercise } from '@/services/exerciseService';
import {
  ExerciseCreateRequest,
  ExerciseResponse,
  ExerciseUpdateRequest,
} from '@/types/exerciseType';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Save } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/Spinner';

type ExerciseDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  exercise?: ExerciseResponse | null;
};

export default function ExerciseDialog({
  isOpen,
  onOpenChange,
  exercise = null,
}: ExerciseDialogProps) {
  const isEditMode = !!exercise;
  const [title, setTitle] = useState<string>('');

  const { courseId } = useParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen && exercise) {
      setTitle(exercise.title || '');
    } else {
      setTitle('');
    }
  }, [isOpen, exercise]);

  const createExerciseMutation = useMutation({
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
    onError: handleError,
    onSettled: handleSettled,
  });

  const updateExerciseMutation = useMutation({
    mutationFn: ({
      courseId,
      exerciseId,
      exerciseData,
    }: {
      courseId: string;
      exerciseId: string;
      exerciseData: ExerciseUpdateRequest;
    }) => updateExercise(courseId, exerciseId, exerciseData),
    onSuccess: (response: ExerciseResponse) => {
      queryClient.setQueryData<ExerciseResponse[]>(
        ['exercises'],
        (oldExercises = []) =>
          Array.isArray(oldExercises)
            ? oldExercises.map(e => (e.id === response.id ? response : e))
            : [response]
      );
      showSuccess('Exercise updated successfully');
    },
    onError: handleError,
    onSettled: handleSettled,
  });

  function handleError(error: unknown) {
    if (isAxiosError(error)) {
      showError(error.response?.data.message || 'An error occurred');
    } else {
      showError('Something went wrong');
    }
  }

  function handleSettled() {
    onOpenChange(false);
    setTitle('');
  }

  const handleSubmit = () => {
    if (!courseId) {
      showError('Course ID is missing');
      return;
    }

    if (!title.trim()) {
      showError('Exercise title is required');
      return;
    }

    if (isEditMode && exercise) {
      updateExerciseMutation.mutate({
        courseId,
        exerciseId: exercise.id,
        exerciseData: { title },
      });
    } else {
      createExerciseMutation.mutate({
        courseId,
        exercise: { title },
      });
    }
  };

  const isPending = isEditMode
    ? updateExerciseMutation.isPending
    : createExerciseMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Exercise' : 'Add New Exercise'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update exercise title.'
              : 'Create a new exercise for this course.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="exercise-title">Exercise Title</Label>
            <Input
              id="exercise-title"
              value={title}
              placeholder="Enter exercise title"
              onChange={e => setTitle(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="w-[150px]"
            disabled={isPending}
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
                Create Exercise
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
