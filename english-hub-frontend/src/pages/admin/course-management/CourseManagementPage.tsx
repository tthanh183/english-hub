import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { deleteCourse, getAllCourses } from '@/services/courseService';
import CourseCard from '@/pages/admin/course-management/CourseCard';
import GlobalSkeleton from '@/components/GlobalSkeleton';
import { CourseResponse } from '@/types/courseType';
import { showError, showSuccess } from '@/hooks/useToast';
import CourseDialog from '@/pages/admin/course-management/CourseDialog';
import { isAxiosError } from 'axios';

export default function CourseManagementPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddCourseOpen, setIsAddCourseOpen] = useState<boolean>(false);
  const [isEditCourseOpen, setIsEditCourseOpen] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseResponse | null>(
    null
  );

  const queryClient = useQueryClient();
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: getAllCourses,
  });

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditCourse = (id: string) => {
    const courseToEdit = courses.find(course => course.id === id);
    if (courseToEdit) {
      setSelectedCourse(courseToEdit);
      setIsEditCourseOpen(true);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    const course = courses.find(c => c.id === id);
    if (!course) {
      showError('Course not found');
      return;
    }

    try {
      const response = await deleteCourse(id);
      showSuccess(response);
      queryClient.setQueryData<CourseResponse[]>(
        ['courses'],
        (oldCourses = []) =>
          Array.isArray(oldCourses)
            ? oldCourses.filter(course => course.id !== id)
            : []
      );
    } catch (error) {
      if (isAxiosError(error)) {
        showError(error.response?.data.message);
      } else {
        showError('Failed to delete course. Please try again.');
      }
    }
  };

  if (isLoading) {
    return <GlobalSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Content Management
          </h1>
          <p className="text-muted-foreground">
            Manage courses, lessons, exercises, and tests for your learning
            platform.
          </p>
        </div>
        <Button onClick={() => setIsAddCourseOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Course
        </Button>
        <CourseDialog
          isOpen={isAddCourseOpen}
          onOpenChange={setIsAddCourseOpen}
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search courses...`}
            className="pl-8"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCourses.map(course => (
          <CourseCard
            key={course.id}
            course={course}
            onEdit={() => handleEditCourse(course.id)}
            onDelete={() => handleDeleteCourse(course.id)}
          />
        ))}
      </div>

      <CourseDialog
        isOpen={isEditCourseOpen}
        onOpenChange={setIsEditCourseOpen}
        course={selectedCourse}
      />
    </div>
  );
}
