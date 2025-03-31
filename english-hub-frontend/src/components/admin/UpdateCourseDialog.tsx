import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CourseResponse, CourseUpdateRequest } from '@/types/courseType';
import { updateCourse } from '@/services/courseService';
import { useCourseStore } from '@/stores/courseStore';
import { showError, showSuccess } from '@/hooks/useToast';
import { Spinner } from '@/components/Spinner';
import { getPresignedUrl, uploadFileToS3 } from '@/utils/s3UploadUtil';

type UpdateCourseDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectedCourse: CourseResponse | null;
  setSelectedCourse: (course: CourseResponse | null) => void;
};

export default function UpdateCourseDialog({
  isOpen,
  onOpenChange,
  selectedCourse,
  setSelectedCourse,
}: UpdateCourseDialogProps) {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { storeUpdateCourse } = useCourseStore();
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: ({
      courseId,
      course,
    }: {
      courseId: string;
      course: CourseUpdateRequest;
    }) => updateCourse(courseId, course),
    onSuccess: (response: CourseResponse) => {
      storeUpdateCourse(response);
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
    setImage(null);
    setPreviewUrl(null);
    setSelectedCourse(null);
  };

  useEffect(() => {
    if (!isOpen) {
      resetDialogState();
    }
  }, [isOpen]);

  const handleUpdateCourse = async () => {
    if (!selectedCourse) {
      showError('No course selected for update');
      return;
    }

    if (!image) {
      showError('Please select an image file');
      return;
    }

    try {
      const presignedUrl = await getPresignedUrl(image.name);
      const imageUrl = await uploadFileToS3(image, presignedUrl);
      const { id, ...courseData } = selectedCourse;
      updateMutation.mutate({
        courseId: id,
        course: {
          ...courseData,
          imageUrl,
        },
      });
    } catch (error) {
      if (isAxiosError(error)) {
        showError(error.response?.data.message);
      } else {
        showError('Something went wrong');
      }
    }
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
    <Dialog
      open={isOpen && selectedCourse !== null}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
          <DialogDescription>
            Create a new course for your platform.
          </DialogDescription>
        </DialogHeader>
        {selectedCourse && (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                value={selectedCourse.title}
                onChange={e =>
                  setSelectedCourse({
                    ...selectedCourse,
                    title: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter a brief description of the course"
                rows={4}
                value={selectedCourse.description}
                onChange={e =>
                  setSelectedCourse({
                    ...selectedCourse,
                    description: e.target.value,
                  })
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
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdateCourse}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? <Spinner /> : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
