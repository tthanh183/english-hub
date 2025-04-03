import { Plus } from 'lucide-react';
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
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { LessonCreateRequest, LessonResponse } from '@/types/lessonType';
import { createLesson } from '@/services/lessonService';
import { showError, showSuccess } from '@/hooks/useToast';
import { Spinner } from '@/components/Spinner';

type AddLessonDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export default function AddLessonDialog({
  isOpen,
  onOpenChange,
}: AddLessonDialogProps) {
  const [newLesson, setNewLesson] = useState<LessonCreateRequest>({
    title: '',
    duration: 600000,
    content: '',
  });

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
    onError: error => {
      if (isAxiosError(error)) {
        showError(error.response?.data.message);
      } else {
        showError('An unexpected error occurred');
      }
    },
    onSettled: () => {
      onOpenChange(false);
      resetDialogState();
    },
  });

  const resetDialogState = () => {
    setNewLesson({
      title: '',
      duration: 0,
      content: '',
    });
  };

  useEffect(() => {
    if (!isOpen) {
      resetDialogState();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewLesson({
      ...newLesson,
      [name]: value,
    });
  };

  const handleAddLesson = () => {
    if (!courseId) {
      showError('Course ID is missing');
      return;
    }
    console.log('Adding lesson:', newLesson);

    addLessonMutation.mutate({
      courseId,
      lesson: newLesson,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Lesson
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Lesson</DialogTitle>
          <DialogDescription>
            Create a new lesson for the course.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="lesson-title">Lesson Title</Label>
            <Input
              id="lesson-title"
              value={newLesson.title}
              name='title'
              placeholder="Enter lesson title"
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lesson-duration">Duration</Label>
            <Input
              id="lesson-duration"
              placeholder="Enter duration in milliseconds"
              name='duration'
              type="number"
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lesson-content">Content</Label>
            <ReactQuill
              theme="snow"
              value={newLesson.content}
              onChange={content => setNewLesson({ ...newLesson, content })}
              style={{ height: '300px' }}
            />
          </div>
        </div>
        <DialogFooter className="mt-8">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAddLesson}
            className="min-w-[120px]"
            disabled={addLessonMutation.isPending}
          >
            {addLessonMutation.isPending ? <Spinner /> : 'Add Lesson'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
