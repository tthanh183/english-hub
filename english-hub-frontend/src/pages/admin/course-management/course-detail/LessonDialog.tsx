import { Plus, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import {
  LessonCreateRequest,
  LessonResponse,
  LessonUpdateRequest,
} from '@/types/lessonType';
import { createLesson, updateLesson } from '@/services/lessonService';
import { showError, showSuccess } from '@/hooks/useToast';
import { Spinner } from '@/components/Spinner';

type LessonDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  lesson?: LessonResponse | null;
};

export default function LessonDialog({
  isOpen,
  onOpenChange,
  lesson = null,
}: LessonDialogProps) {
  const isEditMode = !!lesson;

  const [lessonData, setLessonData] = useState<
    LessonCreateRequest | LessonUpdateRequest
  >({
    title: '',
    duration: 0,
    content: '',
  });

  useEffect(() => {
    if (isOpen && lesson) {
      setLessonData({
        title: lesson.title,
        duration: lesson.duration || 0,
        content: lesson.content || '',
      });
    } else {
      setLessonData({
        title: '',
        duration: 0,
        content: '',
      });
    }
  }, [isOpen, lesson]);

  const { courseId } = useParams();
  const queryClient = useQueryClient();

  const addLessonMutation = useMutation({
    mutationFn: ({
      courseId,
      lesson,
    }: {
      courseId: string;
      lesson: LessonCreateRequest;
    }) => createLesson(courseId, lesson),
    onSuccess: (response: LessonResponse) => {
      queryClient.setQueryData<LessonResponse[]>(
        ['lessons'],
        (oldLessons = []) => [...oldLessons, response]
      );
      showSuccess('Lesson added successfully');
    },
    onError: handleError,
    onSettled: handleSettled,
  });

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
      queryClient.setQueryData<LessonResponse[]>(
        ['lessons'],
        (oldLessons = []) =>
          Array.isArray(oldLessons)
            ? oldLessons.map(l => (l.id === response.id ? response : l))
            : [response]
      );
      showSuccess('Lesson updated successfully!');
    },
    onError: handleError,
    onSettled: handleSettled,
  });

  function handleError(error: unknown) {
    if (isAxiosError(error)) {
      showError(error.response?.data.message);
    } else {
      showError('Something went wrong');
    }
  }

  function handleSettled() {
    onOpenChange(false);
    resetDialogState();
  }

  const resetDialogState = () => {
    setLessonData({
      title: '',
      duration: 600000,
      content: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLessonData({
      ...lessonData,
      [name]: name === 'duration' ? Number(value) : value,
    });
  };

  const handleSubmit = () => {
    if (!courseId) {
      showError('Course ID is missing');
      return;
    }

    if (!lessonData.title?.trim()) {
      showError('Lesson title is required');
      return;
    }

    if (isEditMode && lesson) {
      updateLessonMutation.mutate({
        courseId,
        lessonId: lesson.id,
        lesson: lessonData as LessonUpdateRequest,
      });
    } else {
      addLessonMutation.mutate({
        courseId,
        lesson: lessonData as LessonCreateRequest,
      });
    }
  };

  const isPending = isEditMode
    ? updateLessonMutation.isPending
    : addLessonMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? `Edit Lesson: ${lesson?.title}` : 'Add New Lesson'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update lesson information.'
              : 'Create a new lesson for the course.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="lesson-title">Lesson Title</Label>
            <Input
              id="lesson-title"
              name="title"
              value={lessonData.title}
              placeholder="Enter lesson title"
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lesson-duration">Duration (milliseconds)</Label>
            <Input
              id="lesson-duration"
              name="duration"
              type="number"
              value={lessonData.duration}
              placeholder="Enter duration in milliseconds"
              onChange={handleChange}
            />
            <p className="text-xs text-muted-foreground">
              Example: 600000 ms = 10 minutes
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lesson-content">Content</Label>
            <div style={{ width: '100%', overflow: 'hidden' }}>
              <ReactQuill
                theme="snow"
                value={lessonData.content}
                onChange={content => setLessonData({ ...lessonData, content })}
                style={{
                  height: '200px',
                  maxHeight: '250px',
                  marginBottom: '50px',
                  width: '100%',
                }}
                modules={{
                  toolbar: [
                    ['bold', 'italic', 'underline'],
                    ['blockquote', 'code-block'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['link', 'image'],
                    ['clean'],
                  ],
                }}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-[150px]"
          >
            {isPending ? (
              <Spinner />
            ) : isEditMode ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Lesson
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
