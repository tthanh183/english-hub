import { Link, useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight, FileText } from 'lucide-react';
import Breadcrumb from '@/components/home/Breadcrumb';
import { useQuery } from '@tanstack/react-query';
import { getAllCourses, getCourseById } from '@/services/courseService';
import OtherCourses from '@/pages/home/course/course-detail/OtherCourses';
import GlobalSkeleton from '@/components/GlobalSkeleton';
import { getAllLessons } from '@/services/lessonService';
import { getAllExercises } from '@/services/exerciseService';
import { CourseResponse } from '@/types/courseType';
import { useEffect, useState } from 'react';

export default function HomeCourseDetailPage() {
  const [course, setCourse] = useState<CourseResponse>();

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

  useEffect(() => {
    if (courseId) {
      (async () => {
        const courseData = await getCourseById(courseId);
        setCourse(courseData);
      })();
    }
  }, [courseId]);

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
      name: `${course?.title || 'Course Details'}`,
      link: `/courses/${courseId}`,
    },
  ];

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
                  {lessons?.length} Lessons
                </div>
              </div>

              <div className="space-y-4">
                {lessons &&
                  lessons.map((lesson, index) => (
                    <Link
                      key={lesson.id}
                      to={`/courses/${courseId}/lessons/${lesson.id}`}
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
                      <div className="text-gray-400">
                        <FileText className="h-5 w-5" />
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
                <div className="text-sm text-gray-500">
                  {exercises?.length} exercises
                </div>
              </div>

              <div className="space-y-4">
                {exercises &&
                  exercises.map((exercise, index) => (
                    <Link
                      key={exercise.id}
                      to={`/courses/${courseId}/exercises/${exercise.id}`}
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
                      </div>
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 bg-gray-50 text-gray-600">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </Link>
                  ))}
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
