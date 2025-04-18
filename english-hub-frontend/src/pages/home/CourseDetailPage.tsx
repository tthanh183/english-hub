import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check } from 'lucide-react';
import Breadcrumb from '@/components/home/Breadcrumb';
import { useQuery } from '@tanstack/react-query';
import { getAllCourses } from '@/services/courseService';
import OtherCourses from '@/components/home/OtherCourses';
import GlobalSkeleton from '@/components/GlobalSkeleton';
import { getAllLessons } from '@/services/lessonService';
import { getAllExercises } from '@/services/exerciseService';

const breadcrumbData = [
  {
    name: 'Home',
    link: '/',
  },
  {
    name: 'Listening and Reading',
    link: '/courses/listening-reading',
  },
  {
    name: 'Part 1: Photographs',
    link: `/courses/listening-reading/`,
  },
];

export default function CourseDetailPage() {
  const { data: courses, isLoading: isCoursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: getAllCourses,
  });

  const { courseId } = useParams();

  const { data: lessons, isLoading: isLessonsLoading } = useQuery({
    queryKey: ['lessons', courseId],
    queryFn: () => getAllLessons(courseId as string),
    enabled: !!courseId,
  });

  const { data: exercises, isLoading: isExercisesLoading } = useQuery({
    queryKey: ['exercises', courseId],
    queryFn: () => getAllExercises(courseId as string),
    enabled: !!courseId,
  });

  if (isCoursesLoading || isLessonsLoading || isExercisesLoading) {
    return <GlobalSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          TOEIC® Listening Practice Part 1 - Free Online
        </h1>
        <Breadcrumb breadcrumbData={breadcrumbData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="lessons" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="lessons">Lessons</TabsTrigger>
              <TabsTrigger value="exercises">Exercises</TabsTrigger>
            </TabsList>

            <TabsContent value="lessons" className="border rounded-lg p-6 mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Lessons</h2>
                <div className="text-sm text-gray-500">
                  {lessons?.length} / {lessons?.length} Lessons
                </div>
              </div>

              <div className="space-y-4">
                {lessons &&
                  lessons.map((lesson, index) => (
                    <Link
                      key={lesson.id}
                      to={`/courses/listening/${courseId}/lesson/${lesson.id}`}
                      className="flex items-center p-4 border rounded-lg hover:bg-gray-50 group"
                    >
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full mr-4">
                        <span>{index + 1}</span>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center">
                          <span className="text-sm font-medium">
                            {lesson.title}
                          </span>
                        </div>
                      </div>
                      <div className="text-green-500">
                        <Check className="h-5 w-5" />
                      </div>
                    </Link>
                  ))}
              </div>
            </TabsContent>

            <TabsContent
              value="exercises"
              className="border rounded-lg p-6 mt-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Exercises</h2>
                <div className="text-sm text-gray-500">0/22 exercises</div>
              </div>

              <div className="space-y-4">
                {exercises &&
                  exercises.map((exercise, index) => (
                    <Link
                      key={exercise.id}
                      to={`/courses/${courseId}/exercise/${exercise.id}`}
                      className="flex items-center p-4 border rounded-lg hover:bg-gray-50 group"
                    >
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full mr-4">
                        <span>{index + 1}</span>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center">
                          <span className="text-sm font-medium">
                            {exercise.title}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">6 questions</div>
                      </div>
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-red-200 text-red-500 text-xs">
                        0%
                      </div>
                    </Link>
                  ))}

                <div className="text-center mt-6">
                  <Button
                    variant="outline"
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    Show More 17 Practice Tests
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {courses && (
          <div className="lg:col-span-1">
            <OtherCourses courses={courses} />
          </div>
        )}
      </div>
    </div>
  );
}
