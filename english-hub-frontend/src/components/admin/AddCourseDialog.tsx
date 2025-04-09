import { isAxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CourseCreateRequest, CourseResponse } from '@/types/courseType';
import { createCourse } from '@/services/courseService';
import { showError, showSuccess } from '@/hooks/useToast';
import { Spinner } from '@/components/Spinner';

type AddCourseDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AddCourseDialog({
  isOpen,
  onOpenChange,
}: AddCourseDialogProps) {
  const [newCourse, setNewCourse] = useState<CourseCreateRequest>({
    title: '',
    description: '',
    image: null,
  });
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const courseMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: (response: CourseResponse) => {
      queryClient.setQueryData<CourseResponse[]>(
        ['courses'],
        (oldCourses = []) => [...oldCourses, response]
      );
      showSuccess('Course added successfully');
    },
    onError: error => {
      if (isAxiosError(error)) {
        showError(error.response?.data.message);
      } else {
        showError('Something went wrong');
      }
    },
    onSettled: () => {
      onOpenChange(false);
      resetDialogState();
    },
  });

  const resetDialogState = () => {
    setNewCourse({ title: '', description: '', image: null });
    setImage(null);
    setPreviewUrl(null);
  };

  useEffect(() => {
    if (!isOpen) {
      resetDialogState();
    }
  }, [isOpen]);

  const handleAddCourse = async () => {
    if (!image) {
      showError('Please select an image file');
      return;
    }
    courseMutation.mutate({
      title: newCourse.title,
      description: newCourse.description,
      image: image,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        showError('Invalid file type. Only JPEG, PNG, and GIF are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showError('File size exceeds the 5MB limit');
        return;
      }

      setImage(file);

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
          <DialogDescription>
            Create a new course for your platform.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              value={newCourse.title}
              onChange={e =>
                setNewCourse({ ...newCourse, title: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter a brief description of the course"
              rows={4}
              value={newCourse.description}
              onChange={e =>
                setNewCourse({ ...newCourse, description: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">Course Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-2 h-32 w-32 object-fill"
              />
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddCourse} disabled={courseMutation.isPending}>
            {courseMutation.isPending ? <Spinner /> : 'Add Course'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
