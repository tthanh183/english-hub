import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, FileText, Plus } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import LessonItem from '@/pages/admin/course-management/course-detail/LessonItem';
import { LessonResponse } from '@/types/lessonType';
import GlobalSkeleton from '@/components/GlobalSkeleton';
import { getAllLessons } from '@/services/lessonService';
import ExerciseItem from '@/components/admin/ExerciseItem';
import { ExerciseResponse } from '@/types/exerciseType';
import { getAllExercises } from '@/services/exerciseService';
import { ExerciseDetail } from '@/components/admin/ExerciseDetail';
import LessonDialog from '@/pages/admin/course-management/course-detail/LessonDialog';
import { getCourseById } from '@/services/courseService';
import ExerciseDialog from '@/components/admin/ExerciseDialog';
import { ROUTES } from '@/constants/routes';

export default function AdminCourseDetailPage() {
  const [activeTab, setActiveTab] = useState('lessons');
  const [isAddLessonOpen, setIsAddLessonOpen] = useState<boolean>(false);
  const [isEditLessonOpen, setIsEditLessonOpen] = useState<boolean>(false);
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState<boolean>(false);
  const [isEditExerciseOpen, setIsEditExerciseOpen] = useState<boolean>(false);
  const [isViewExerciseOpen, setIsViewExerciseOpen] = useState<boolean>(false);

  const [selectedLesson, setSelectedLesson] = useState<LessonResponse | null>(
    null
  );
  const [selectedExercise, setSelectedExercise] =
    useState<ExerciseResponse | null>(null);
  const [editedExercise, setEditedExercise] = useState<ExerciseResponse | null>(
    null
  );

  const { courseId } = useParams();

  useEffect(() => {
    setSelectedLesson(null);
  }, [activeTab]);

  const { data: course } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourseById(courseId || ''),
  });

  const { data: lessons = [], isLoading: isLessonsLoading } = useQuery({
    queryKey: ['lessons'],
    queryFn: () => getAllLessons(courseId || ''),
  });

  const { data: exercises = [], isLoading: isExercisesLoading } = useQuery({
    queryKey: ['exercises'],
    queryFn: () => getAllExercises(courseId || ''),
  });

  const handleSelectLesson = (id: string) => {
    if (selectedLesson?.id !== id) {
      setSelectedLesson(lessons.find(lesson => lesson.id === id) || null);
      setIsEditLessonOpen(true);
    } else {
      setSelectedLesson(null);
      setIsEditLessonOpen(false);
    }
  };

  const handleSelectExercise = (id: string) => {
    if (selectedExercise?.id !== id) {
      setSelectedExercise(
        exercises.find(exercise => exercise.id === id) || null
      );
      setIsViewExerciseOpen(true);
    } else {
      setSelectedExercise(null);
      setIsViewExerciseOpen(false);
    }
  };

  const handleEditExercise = (id: string) => {
    if (editedExercise?.id !== id) {
      setEditedExercise(exercises.find(exercise => exercise.id === id) || null);
      setIsEditExerciseOpen(true);
    } else {
      setEditedExercise(null);
      setIsEditExerciseOpen(false);
    }
  };

  if (isLessonsLoading || isExercisesLoading) {
    return <GlobalSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to={ROUTES.ADMIN_COURSES}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{course?.title}</h1>
          <p className="text-muted-foreground">{course?.description}</p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lessons">
            <BookOpen className="h-4 w-4 mr-2" />
            Lesson Structure
          </TabsTrigger>
          <TabsTrigger value="exercises">
            <FileText className="h-4 w-4 mr-2" />
            Exercise Bank
          </TabsTrigger>
        </TabsList>
        <TabsContent value="lessons" className="space-y-4">
          <div className="grid md:grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Lesson Structure</CardTitle>
                  <Button onClick={() => setIsAddLessonOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Lesson
                  </Button>
                  <LessonDialog
                    isOpen={isAddLessonOpen}
                    onOpenChange={setIsAddLessonOpen}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lessons.map((lesson, idx) => (
                    <LessonItem
                      key={lesson.id}
                      lesson={lesson}
                      isSelected={selectedLesson?.id === lesson.id}
                      order={idx + 1}
                      onSelect={() => handleSelectLesson(lesson.id)}
                    />
                  ))}

                  {lessons.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No lessons yet</h3>
                      <p className="text-muted-foreground mb-4">
                        This course doesn't have any lessons. Add your first
                        lesson to get started.
                      </p>
                      <Button onClick={() => setIsAddLessonOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Lesson
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {selectedLesson && (
              <LessonDialog
                isOpen={isEditLessonOpen}
                onOpenChange={setIsEditLessonOpen}
                lesson={selectedLesson}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="exercises" className="space-y-4">
          {selectedExercise && isViewExerciseOpen ? (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedExercise(null)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back to exercises</span>
                  </Button>
                  <div>
                    <CardTitle>Edit Exercise</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {selectedExercise.title}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ExerciseDetail selectedExercise={selectedExercise} />
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Exercise Bank</CardTitle>
                    <Button onClick={() => setIsAddExerciseOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Exercise
                    </Button>
                    <ExerciseDialog
                      isOpen={isAddExerciseOpen}
                      onOpenChange={setIsAddExerciseOpen}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {exercises.map((exercise, idx) => (
                      <ExerciseItem
                        key={exercise.id}
                        exercise={exercise}
                        order={idx + 1}
                        onSelect={() => handleSelectExercise(exercise.id)}
                        onEdit={() => handleEditExercise(exercise.id)}
                      />
                    ))}

                    {exercises.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">
                          No exercises yet
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          This course doesn't have any exercises. Add your first
                          exercise to get started.
                        </p>
                        <Button onClick={() => setIsAddExerciseOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add First Exercise
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              {editedExercise && (
                <ExerciseDialog
                  isOpen={isEditExerciseOpen}
                  onOpenChange={setIsEditExerciseOpen}
                  exercise={editedExercise}
                />
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
