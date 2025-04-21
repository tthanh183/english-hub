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
import {
  ExamCreateRequest,
  ExamResponse,
  ExamUpdateRequest,
} from '@/types/examType';
import { createExam, updateExam } from '@/services/examService';
import { showError, showSuccess } from '@/hooks/useToast';
import { Spinner } from '@/components/Spinner';

type ExamDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  exam?: ExamResponse | null;
};

export default function ExamDialog({
  isOpen,
  onOpenChange,
  exam = null,
}: ExamDialogProps) {
  const isEditMode = !!exam;

  const [examData, setExamData] = useState<
    ExamCreateRequest | ExamUpdateRequest
  >({
    title: '',
    duration: 60,
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen) {
      if (exam) {
        setExamData({
          title: exam.title,
          duration: exam.duration,
        });
      } else {
        setExamData({
          title: '',
          duration: 60,
        });
      }
    }
  }, [isOpen, exam]);

  const createExamMutation = useMutation({
    mutationFn: createExam,
    onSuccess: (response: ExamResponse) => {
      queryClient.setQueryData<ExamResponse[]>(['exams'], (oldExams = []) => [
        ...oldExams,
        response,
      ]);
      showSuccess('Exam created successfully');
      onOpenChange(false);
    },
    onError: handleError,
  });

  const updateExamMutation = useMutation({
    mutationFn: ({
      examId,
      examData,
    }: {
      examId: string;
      examData: ExamUpdateRequest;
    }) => updateExam(examId, examData),
    onSuccess: (response: ExamResponse) => {
      queryClient.setQueryData<ExamResponse[]>(['exams'], (oldExams = []) =>
        Array.isArray(oldExams)
          ? oldExams.map(e => (e.id === response.id ? response : e))
          : [response]
      );
      showSuccess('Exam updated successfully');
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
    if (!examData.title.trim()) {
      showError('Exam title is required');
      return;
    }

    if (isEditMode && exam) {
      updateExamMutation.mutate({
        examId: exam.id,
        examData: {
          ...examData,
        } as ExamUpdateRequest,
      });
    } else {
      createExamMutation.mutate({
        ...examData,
      } as ExamCreateRequest);
    }
  };

  const isPending = isEditMode
    ? updateExamMutation.isPending
    : createExamMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Exam' : 'Add New Exam'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update exam information.'
              : 'Create a new exam for your platform.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Exam Title</Label>
            <Input
              id="title"
              value={examData.title}
              onChange={e =>
                setExamData({ ...examData, title: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={examData.duration}
              onChange={e =>
                setExamData({ ...examData, duration: Number(e.target.value) })
              }
            />
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
                Add Exam
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
