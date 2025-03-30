import { format } from 'date-fns';
import { BookOpen, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

type CourseCardProps = {
  course: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    createdDate: Date;
    updatedDate: Date;
  };
};

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link key={course.id} to={`/admin/courses/${course.id}`} className="block">
      <div className="h-full">
        <div className="h-full border rounded-lg overflow-hidden hover:border-primary hover:shadow-md transition-all">
          {course.imageUrl && (
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full h-40 object-cover"
            />
          )}
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{course.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {course.description}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1 text-muted-foreground" />
                {/* <span>{course.lessons} lessons</span> */}
                <span> 5 lessons</span>
              </div>
              <div className="flex items-center">
                <GraduationCap className="h-4 w-4 mr-1 text-muted-foreground" />
                {/* <span>{course.tests} tests</span> */}
                <span>8 tests</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              Last created: {format(new Date(course.createdDate), 'yyyy-MM-dd')}
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              Last updated: {format(new Date(course.updatedDate), 'yyyy-MM-dd')}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
