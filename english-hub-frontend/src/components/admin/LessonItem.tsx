import { LessonResponse } from '@/types/lessonType';
import { Clock, Edit, Grip, Trash } from 'lucide-react';
import { Button } from '../ui/button';

type LessonItemProps = {
  lesson: LessonResponse;
  isSelected: boolean;
  order: number;
  onSelect: () => void;
  onDelete: () => void;
};

export default function LessonItem({
  lesson,
  isSelected,
  order,
  onSelect,
  onDelete,
}: LessonItemProps) {
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
              {lesson.duration}
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
