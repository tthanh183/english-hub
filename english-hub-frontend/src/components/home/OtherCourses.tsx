import { CourseResponse } from '@/types/courseType';
import { Link, useParams } from 'react-router-dom';

type OtherCoursesProps = {
  courses: CourseResponse[];
};

export default function OtherCourses({ courses }: OtherCoursesProps) {
  const { courseId } = useParams();

  return (
    <div className="border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Other Practice Tests</h3>
      <div className="space-y-3">
        {courses.map(course => (
          <Link
            key={course.id}
            to={`/courses/${course.id}`}
            className={`block p-3 rounded-md transition-all duration-200 ${
              course.id === courseId
                ? 'bg-blue-100 text-blue-600 font-semibold'
                : 'hover:bg-gray-50'
            }`}
          >
            {course.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
