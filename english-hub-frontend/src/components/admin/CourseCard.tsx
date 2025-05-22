import { format } from 'date-fns';
import { BookOpen, GraduationCap, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { DeleteConfirmation } from './DeleteConfirmation';

type CourseCardProps = {
  course: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    createdDate: Date;
    updatedDate: Date;
  };
  onEdit: () => void;
  onDelete: () => void;
};

export default function CourseCard({
  course,
  onEdit,
  onDelete,
}: CourseCardProps) {
  return (
    <Link
      to={`/admin/courses/${course.id}`}
      className="h-full border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all block group"
    >
      {course.imageUrl && (
        <div className="relative">
          <img
            src={course.imageUrl}
            alt={course.title}
            className="w-full h-40 object-cover rounded-t-lg transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6 flex flex-col justify-between h-[calc(100%-10rem)]">
        <div>
          <h3 className="font-semibold text-lg text-primary group-hover:underline">
            {course.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {course.description}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
          <div className="flex items-center space-x-1">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span>5 lessons</span>
          </div>
          <div className="flex items-center space-x-1">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <span>8 tests</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground space-y-1 mt-4 flex justify-between">
          <div>
            Created: {format(new Date(course.createdDate), 'yyyy-MM-dd')}
          </div>
          <div>
            Updated: {format(new Date(course.updatedDate), 'yyyy-MM-dd')}
          </div>
        </div>

        <div className="flex space-x-2 justify-center mt-4">
          <Button
            variant="outline"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onEdit();
            }}
            className="flex items-center space-x-1"
          >
            <Edit className="h-4 w-4" />
            <span>Update</span>
          </Button>
          <DeleteConfirmation onConfirm={onDelete} itemName="Course" />
        </div>
      </div>
    </Link>
  );
}
