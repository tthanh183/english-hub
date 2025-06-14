import { Calendar, Clock, Edit, Eye, Trash } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { isAxiosError } from 'axios';
import { format } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { longToString } from '@/utils/timeUtil';
import { ExerciseResponse } from '@/types/exerciseType';
import { deleteExercise } from '@/services/exerciseService';
import { showError, showSuccess } from '@/hooks/useToast';
import { DeleteConfirmation } from '../../../../components/admin/DeleteConfirmation';

type LessonItemProps = {
  exercise: ExerciseResponse;
  isSelected: boolean;
  order: number;
  onSelect: () => void;
  onEdit: () => void;
};

export default function ExerciseItem({
  exercise,
  isSelected,
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
        showError('Failed to delete exercise. Please try again.');
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
    <div
      key={exercise.id}
      className={`flex items-center p-3 rounded-md border ${
        isSelected ? 'border-primary bg-muted/50' : ''
      }`}
    >
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

              <span className="mx-2">•</span>
              <Calendar className="h-3 w-3 mr-1" />
              <span>
                {format(new Date(exercise.createdDate), 'yyyy-MM-dd')}
              </span>
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
        <DeleteConfirmation
          title="Delete Exercise"
          description="Are you sure you want to delete this exercise? This action cannot be undone."
          onConfirm={handleDelete}
          trigger={
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500"
              disabled={deleteExerciseMutation.isPending}
            >
              <Trash className="h-4 w-4" />
            </Button>
          }
        />
      </div>
    </div>
  );
}
