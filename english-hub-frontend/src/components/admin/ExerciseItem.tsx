import { Clock, Edit, Eye, Grip, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { longToString } from '@/utils/timeUtil';
import { ExerciseResponse } from '@/types/exerciseType';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteExercise } from '@/services/exerciseService';
import { showError, showSuccess } from '@/hooks/useToast';
import { isAxiosError } from 'axios';

type LessonItemProps = {
  exercise: ExerciseResponse;
  order: number;
  onSelect: () => void;
  onEdit: () => void;
};

export default function ExerciseItem({
  exercise,
  order,
  onSelect,
  onEdit,
}: LessonItemProps) {
  const { courseId } = useParams();
  const queryClient = useQueryClient();

  const deleteExerciseMutation = useMutation({
    mutationFn: ({
      courseId,
      exerciseId,
    }: {
      courseId: string;
      exerciseId: string;
    }) => deleteExercise(courseId, exerciseId),
    onSuccess: (response: string, { exerciseId }) => {
      queryClient.setQueryData<ExerciseResponse[]>(
        ['exercises'],
        (oldExercises = []) =>
          Array.isArray(oldExercises)
            ? oldExercises.filter(exercise => exercise.id !== exerciseId)
            : []
      );
      showSuccess(response);
    },
    onError: error => {
      if (isAxiosError(error)) {
        showError(error.response?.data.message);
      } else {
        showError('Something went wrong');
      }
    },
  });

  const handleDelete = () => {
    deleteExerciseMutation.mutate({
      courseId: courseId!,
      exerciseId: exercise.id,
    });
  };
  return (
    <div key={exercise.id} className="flex items-center p-3 rounded-md border">
      <div className="flex items-center mr-2">
        <Grip className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center mr-2">
            {order}
          </div>
          <div>
            <div className="font-medium truncate">{exercise.title}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted">
                Theory
              </span>
              <span className="mx-2">•</span>
              <Clock className="h-3 w-3 mr-1" />
              {longToString(exercise.questionNum)}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={onSelect}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-500"
          onClick={handleDelete}
          disabled={deleteExerciseMutation.isPending}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
