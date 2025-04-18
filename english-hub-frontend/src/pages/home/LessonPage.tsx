import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAllLessons, getLessonById } from '@/services/lessonService';
import { useEffect, useState } from 'react';
import { CourseResponse } from '@/types/courseType';
import { getCourseById } from '@/services/courseService';
import Breadcrumb from '@/components/home/Breadcrumb';
import GlobalSkeleton from '@/components/GlobalSkeleton';

export default function LessonPage() {
  const [course, setCourse] = useState<CourseResponse>();
  const { courseId, lessonId } = useParams();

  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson'],
    queryFn: () => getLessonById(courseId as string, lessonId as string),
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
    {
      name: `${lesson?.title || 'Lesson Details'}`,
      link: `/courses/${courseId}/lessons/1`,
    },
  ];

  if (isLoading) {
    return <GlobalSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            {lesson?.title || 'Lesson Details'}
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-gray-500">
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button variant="outline" size="sm" className="text-gray-500">
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
        <Breadcrumb breadcrumbData={breadcrumbData} />
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="prose max-w-none">
          <div
            className="prose max-w-non"
            dangerouslySetInnerHTML={{ __html: lesson?.content || '' }}
          ></div>

          <div className="flex justify-center mt-8 mb-8">
            <Link to="/practice/listening/part-1/test-1">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Start Practice
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
