import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { DeleteConfirmation } from '../../../components/admin/DeleteConfirmation';
import { CourseResponse } from '@/types/courseType';

type CourseCardProps = {
  course: CourseResponse;
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
          <DeleteConfirmation
            title="Delete Course"
            description="Are you sure you want to delete this course? This action cannot be undone."
            onConfirm={onDelete}
            trigger={
              <Button
                variant="destructive"
                className="flex items-center space-x-1"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </Button>
            }
          />
        </div>
      </div>
    </Link>
  );
}
