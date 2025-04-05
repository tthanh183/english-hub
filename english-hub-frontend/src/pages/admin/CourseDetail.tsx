import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, FileText, Plus } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import LessonItem from '@/components/admin/LessonItem';
import { LessonResponse } from '@/types/lessonType';
import AddLessonDialog from '@/components/admin/AddLessonDialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import GlobalSkeleton from '@/components/GlobalSkeleton';
import { deleteLesson, getAllLessons } from '@/services/lessonService';
import UpdateLessonCard from '@/components/admin/UpdateLessonCard';
import { isAxiosError } from 'axios';
import { showError, showSuccess } from '@/hooks/useToast';
import ExerciseItem from '@/components/admin/ExceriseItem';
import { ExerciseResponse } from '@/types/exerciseType';
import { CourseResponse } from '@/types/courseType';
import { getAllExercises } from '@/services/exerciseService';
import AddExerciseDialog from '@/components/admin/AddExerciseDialog';

// Type definitions for exercise structures
type MediaType = {
  type: 'image' | 'audio';
  url: string;
};

type Option = {
  id: string;
  text: string;
  isCorrect?: boolean;
};

type Question = {
  id: string;
  title: string;
  type: string;
  instructions?: string;
  options?: Option[];
  media?: MediaType[];
  correctAnswer?: string | string[];
  points: number;
  imageIndex?: number;
};

type QuestionGroup = {
  id: string;
  title: string;
  audioUrl?: string;
  script?: string;
  imageUrl?: string; // Cho Part 1 (photos)
  questions: Question[];
};

type ToeicExercise = {
  id: string | number;
  title: string;
  section: 'listening' | 'reading';
  type: string;
  difficulty: string;
  estimatedTime: string;
  instructions: string;
  audioUrl?: string;
  passage?: string;
  script?: string;
  images?: string[];
  additionalPassages?: string[];
  questions: Question[];
  questionGroups?: QuestionGroup[];
};

const CourseInitial = {
  title: 'abc',
  description: 'abc',
  imageUrl: 'abc',
  createdDate: new Date(),
  updatedDate: new Date(),
};

export default function CourseDetail() {
  const [course, setCourse] = useState<CourseResponse | null>(CourseInitial);
  const [activeTab, setActiveTab] = useState('lessons');
  const [isAddLessonOpen, setIsAddLessonOpen] = useState<boolean>(false);
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState<boolean>(false);

  const [selectedLesson, setSelectedLesson] = useState<LessonResponse | null>(
    null
  );
  const [selectedExercise, setSelectedExercise] =
    useState<ExerciseResponse | null>(null);

  const { courseId } = useParams();

  useEffect(() => {
    setSelectedLesson(null);
  }, [activeTab]);

  const queryClient = useQueryClient();

  const { data: lessons = [], isLoading: isLessonsLoading } = useQuery({
    queryKey: ['lessons'],
    queryFn: () => getAllLessons(courseId || ''),
  });

  const { data: exercises = [], isLoading: isExercisesLoading } = useQuery({
    queryKey: ['exercises'],
    queryFn: () => getAllExercises(courseId || ''),
  });

  const deleteLessonMutation = useMutation({
    mutationFn: ({
      courseId,
      lessonId,
    }: {
      courseId: string;
      lessonId: string;
    }) => deleteLesson(courseId, lessonId),
    onSuccess: (response: string, { lessonId }) => {
      queryClient.setQueryData<LessonResponse[]>(
        ['lessons'],
        (oldLessons = []) =>
          Array.isArray(oldLessons)
            ? oldLessons.filter(lesson => lesson.id !== lessonId)
            : []
      );
      showSuccess(response);
    },
    onError: error => {
      if (isAxiosError(error)) {
        showError(error.response?.data.message);
      } else {
        showError('Something went wrong');
      }
    },
  });

  const handleSelectLesson = (id: string) => {
    if (selectedLesson?.id !== id) {
      setSelectedLesson(lessons.find(lesson => lesson.id === id) || null);
    } else {
      setSelectedLesson(null);
    }
  };

  const handleSelectExercise = (id: string) => {
    if (selectedExercise?.id !== id) {
      setSelectedExercise(
        exercises.find(exercise => exercise.id === id) || null
      );
      setIsAddExerciseOpen(true);
    } else {
      setSelectedExercise(null);
      setIsAddExerciseOpen(false);
    }
  };

  const handleDeleteLesson = (id: string) => {
    deleteLessonMutation.mutate({
      courseId: courseId || '',
      lessonId: id,
    });
  };

  if (isLessonsLoading || isExercisesLoading) {
    return <GlobalSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/admin/courses">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
          <p className="text-muted-foreground">{course.description}</p>
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
                  <AddLessonDialog
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
                      onDelete={() => handleDeleteLesson(lesson.id)}
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
              <UpdateLessonCard
                selectedLesson={selectedLesson}
                setSelectedLesson={setSelectedLesson}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="exercises" className="space-y-4">
          <div className="grid md:grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Exercise Bank</CardTitle>
                  <AddExerciseDialog
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
                      isSelected={selectedExercise?.id === exercise.id}
                      order={idx + 1}
                      onSelect={() => handleSelectExercise(exercise.id)}
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
              <UpdateLessonCard
                selectedLesson={selectedLesson}
                setSelectedLesson={setSelectedLesson}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
