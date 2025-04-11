import { LessonResponse } from '@/types/lessonType';
import { Calendar, Clock, Edit, Grip, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { longToString } from '@/utils/timeUtil';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLesson } from '@/services/lessonService';
import { showError, showSuccess } from '@/hooks/useToast';
import { isAxiosError } from 'axios';
import { format } from 'date-fns';

type LessonItemProps = {
  lesson: LessonResponse;
  isSelected: boolean;
  order: number;
  onSelect: () => void;
};

export default function LessonItem({
  lesson,
  isSelected,
  order,
  onSelect,
}: LessonItemProps) {
  const { courseId } = useParams();
  const queryClient = useQueryClient();
  const deleteLessonMutation = useMutation({
    mutationFn: ({
      courseId,
      lessonId,
    }: {
      courseId: string;
      lessonId: string;
    }) => deleteLesson(courseId, lessonId),
    onSuccess: (response: string, { lessonId }) => {
      queryClient.setQueryData<LessonResponse[]>(
        ['lessons'],
        (oldLessons = []) =>
          Array.isArray(oldLessons)
            ? oldLessons.filter(lesson => lesson.id !== lessonId)
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
    deleteLessonMutation.mutate({
      courseId: courseId!,
      lessonId: lesson.id,
    });
  };

  return (
    <div
      key={lesson.id}
      className={`flex items-center p-3 rounded-md border ${
        isSelected ? 'border-primary bg-muted/50' : ''
      }`}
    >
      <div className="flex items-center mr-2">
        <Grip className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center mr-2">
            {order}
          </div>
          <div>
            <div className="font-medium truncate">{lesson.title}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted">
                Theory
              </span>
              <span className="mx-2">•</span>
              <Clock className="h-3 w-3 mr-1" />
              {longToString(lesson.duration)}

              <span className="mx-2">•</span>
              <Calendar className="h-3 w-3 mr-1" />
              <span>{format(new Date(lesson.createdDate), 'yyyy-MM-dd')}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onSelect}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-500"
          onClick={handleDelete}
          disabled={deleteLessonMutation.isPending}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
