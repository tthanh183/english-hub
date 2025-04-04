import { Clock, Edit, Grip, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { longToString } from '@/utils/timeUtil';
import { ExerciseResponse } from '@/types/exerciseType';

type LessonItemProps = {
  exercise: ExerciseResponse;
  isSelected: boolean;
  order: number;
  onSelect: () => void;
  onDelete: () => void;
};

export default function ExerciseItem({
  exercise,
  isSelected,
  order,
  onSelect,
  onDelete,
}: LessonItemProps) {
  return (
    <div
      key={exercise.id}
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
          onClick={onDelete}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
