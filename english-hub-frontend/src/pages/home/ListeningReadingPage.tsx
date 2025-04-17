import { getAllCourses } from '@/services/courseService';
import { useQuery } from '@tanstack/react-query';
import CourseCard from '@/components/home/CourseCard';
import { CourseResponse } from '@/types/courseType';
import GlobalSkeleton from '@/components/GlobalSkeleton';

export default function ListeningReadingPage() {
  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: getAllCourses,
  });

  if (isLoading) {
    return <GlobalSkeleton />;
  }

  const listeningCourses = courses?.slice(0, 4);
  const readingCourses = courses?.slice(4);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
          TOEIC® Listening and Reading Practice
        </h1>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-gray-800">
          Listening Practice
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {listeningCourses?.map((course: CourseResponse) => (
            <CourseCard
              key={course.id}
              courseId={course.id}
              title={course.title}
              description={course.description}
              imageUrl={course.imageUrl || '/placeholder.svg'}
            />
          ))}
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-gray-800">
          Reading Practice
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {readingCourses?.map((course: CourseResponse) => (
            <CourseCard
              key={course.id}
              courseId={course.id}
              title={course.title}
              description={course.description}
              imageUrl={course.imageUrl || '/placeholder.svg'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
