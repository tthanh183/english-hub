import { Save } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import { isAxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LessonResponse, LessonUpdateRequest } from '@/types/lessonType';
import { useLessonStore } from '@/stores/lessonStore';
import { updateLesson } from '@/services/lessonService';
import { showError, showSuccess } from '@/hooks/useToast';

type UpdateLessonCardProps = {
  selectedLesson: LessonResponse;
  setSelectedLesson: (lesson: LessonResponse | null) => void;
};

export default function UpdateLessonCard({
  selectedLesson,
  setSelectedLesson,
}: UpdateLessonCardProps) {
  const { courseId } = useParams();
  const { storeUpdateLesson } = useLessonStore();
  const queryClient = useQueryClient();
  const updateLessonMutation = useMutation({
    mutationFn: ({
      courseId,
      lessonId,
      lesson,
    }: {
      courseId: string;
      lessonId: string;
      lesson: LessonUpdateRequest;
    }) => updateLesson(courseId, lessonId, lesson),
    onSuccess: (response: LessonResponse) => {
      storeUpdateLesson(response);
      queryClient.setQueryData<LessonResponse[]>(
        ['lessons'],
        (oldLessons = []) =>
          Array.isArray(oldLessons)
            ? oldLessons.map(lesson =>
                lesson.id === response.id ? response : lesson
              )
            : [response]
      );
      showSuccess('Lesson updated successfully!');
    },
    onError: error => {
      if (isAxiosError(error)) {
        showError(error.response?.data.message);
      } else {
        showError('Something went wrong');
      }
    },
    onSettled: () => {
      setSelectedLesson(null);
    },
  });
  const handleUpdateLesson = () => {
    if (!courseId) {
      console.error('Course ID is missing');
      return;
    }
    if (selectedLesson) {
      const { id, ...lessonData } = selectedLesson;
      updateLessonMutation.mutate({
        courseId,
        lessonId: id,
        lesson: lessonData,
      });
    }
  };
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Edit Lesson: {selectedLesson.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-lesson-title">Lesson Title</Label>
            <Input
              id="edit-lesson-title"
              value={selectedLesson.title}
              onChange={e =>
                setSelectedLesson({
                  ...selectedLesson,
                  title: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-lesson-content">Lesson Content</Label>
            <ReactQuill
              theme="snow"
              value={selectedLesson.content}
              onChange={content =>
                setSelectedLesson({ ...selectedLesson, content })
              }
              style={{ height: '300px' }}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => setSelectedLesson(null)}>
          Cancel
        </Button>
        <Button onClick={handleUpdateLesson}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
