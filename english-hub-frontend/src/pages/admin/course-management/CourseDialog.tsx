import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Plus, Save } from 'lucide-react';
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

import {
  CourseCreateRequest,
  CourseResponse,
  CourseUpdateRequest,
} from '@/types/courseType';
import { createCourse, updateCourse } from '@/services/courseService';
import { showError, showSuccess } from '@/hooks/useToast';
import { Spinner } from '@/components/Spinner';
import { deleteFileFromS3, uploadFileToS3 } from '@/services/s3Service';

type CourseDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  course?: CourseResponse | null;
};

export default function CourseDialog({
  isOpen,
  onOpenChange,
  course = null,
}: CourseDialogProps) {
  const isEditMode = !!course;

  const [courseData, setCourseData] = useState<
    CourseCreateRequest | CourseUpdateRequest
  >({
    title: '',
    description: '',
    imageUrl: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen && course) {
      setCourseData({
        title: course.title,
        description: course.description,
        imageUrl: course.imageUrl,
      });
      setPreviewUrl(course.imageUrl);
    } else {
      setCourseData({
        title: '',
        description: '',
        imageUrl: '',
      });
      setImageFile(null);
      setPreviewUrl(null);
    }
  }, [isOpen, course]);

  const createCourseMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: (response: CourseResponse) => {
      queryClient.setQueryData<CourseResponse[]>(
        ['courses'],
        (oldCourses = []) => [...oldCourses, response]
      );
      showSuccess('Course added successfully');
      onOpenChange(false);
    },
    onError: handleError,
  });

  const updateCourseMutation = useMutation({
    mutationFn: ({
      courseId,
      courseData,
    }: {
      courseId: string;
      courseData: CourseUpdateRequest;
    }) => updateCourse(courseId, courseData),
    onSuccess: (response: CourseResponse) => {
      queryClient.setQueryData<CourseResponse[]>(
        ['courses'],
        (oldCourses = []) =>
          Array.isArray(oldCourses)
            ? oldCourses.map(c => (c.id === response.id ? response : c))
            : [response]
      );
      showSuccess('Course updated successfully');
      onOpenChange(false);
    },
    onError: handleError,
  });

  function handleError(error: unknown) {
    if (isAxiosError(error)) {
      showError(error.response?.data.message || 'An error occurred');
    } else {
      showError('Something went wrong');
    }
  }

  const handleSubmit = async () => {
    if (!courseData.title.trim()) {
      showError('Course title is required');
      return;
    }

    let imageUrl = courseData.imageUrl;

    if (isEditMode && imageFile) {
      await deleteFileFromS3(course.imageUrl!);
      imageUrl = await uploadFileToS3(imageFile);
    }

    if (!isEditMode && imageFile) {
      imageUrl = await uploadFileToS3(imageFile);
    }

    if (isEditMode && course) {
      updateCourseMutation.mutate({
        courseId: course.id,
        courseData: {
          ...courseData,
          imageUrl,
        } as CourseUpdateRequest,
      });
    } else {
      createCourseMutation.mutate({
        ...courseData,
        imageUrl,
      } as CourseCreateRequest);
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

      setImageFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isPending = isEditMode
    ? updateCourseMutation.isPending
    : createCourseMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Course' : 'Add New Course'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update course information.'
              : 'Create a new course for your platform.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              value={courseData.title}
              onChange={e =>
                setCourseData({ ...courseData, title: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter a brief description of the course"
              rows={4}
              value={courseData.description}
              onChange={e =>
                setCourseData({ ...courseData, description: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">
              Course Image{' '}
              {!isEditMode && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required={!isEditMode}
            />
            {previewUrl && (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mt-2 h-32 w-32 object-cover rounded-md"
                />
                {isEditMode && !imageFile && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Current image will be used unless you select a new one.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
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
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Course
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
