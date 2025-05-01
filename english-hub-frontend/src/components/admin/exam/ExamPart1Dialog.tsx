import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  QuestionCreateRequest,
  QuestionResponse,
  QuestionType,
  QuestionUpdateRequest,
} from '@/types/questionType';
import { Spinner } from '@/components/Spinner';
import MediaUploader from '@/components/admin/MediaUploader';
import {
  addQuestionToExam,
  updateQuestionInExam,
} from '@/services/examService';
import { showError, showSuccess } from '@/hooks/useToast';
import { isAxiosError } from 'axios';
import { indexToLetter, letterToIndex } from '@/utils/questionUtil';
import { deleteFileFromS3, uploadFileToS3 } from '@/services/s3Service';
import QuestionCard from '../QuestionCard';

type ExamPart1DialogProps = {
  examId?: string;
  question?: QuestionResponse;
  onClose: () => void;
};

export default function ExamPart1Dialog({
  examId,
  question,
  onClose,
}: ExamPart1DialogProps) {
  const isEditMode = !!question;

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    question?.imageUrl || null
  );

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(
    question?.audioUrl || null
  );

  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(0);
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    if (question && question.questionType === QuestionType.PART_1_PHOTOGRAPHS) {
      setTitle(question.title || '');
      if (question.imageUrl) setImagePreview(question.imageUrl);
      if (question.audioUrl) setAudioPreview(question.audioUrl);

      const newOptions = [
        question.choiceA || '',
        question.choiceB || '',
        question.choiceC || '',
        question.choiceD || '',
      ];
      setOptions(newOptions);
      if (question.correctAnswer) {
        const index = letterToIndex(question.correctAnswer);
        setCorrectAnswerIndex(index);
      }
    } else {
      resetContentState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: async (data: {
      examId: string;
      questionData: QuestionCreateRequest;
    }) => {
      if (isEditMode && question) {
        return updateQuestionInExam(
          data.examId,
          question.id,
          data.questionData as QuestionUpdateRequest
        );
      } else {
        return addQuestionToExam(
          data.examId,
          data.questionData as QuestionCreateRequest
        );
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['questions', variables.examId],
      });
      if (isEditMode) {
        showSuccess('Question updated successfully');
      } else {
        showSuccess('Question added successfully');
      }
    },
    onError: error => {
      if (isAxiosError(error)) {
        showError(error.response?.data.message);
      } else {
        showError('Something went wrong');
      }
    },
    onSettled: () => {
      resetContentState();
      onClose();
    },
  });

  const resetContentState = () => {
    if (audioPreview && !audioPreview.startsWith('http')) {
      URL.revokeObjectURL(audioPreview);
    }
    if (imagePreview && !imagePreview.startsWith('http')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
    setAudioFile(null);
    setAudioPreview(null);
    setOptions(['', '', '', '']);
    setCorrectAnswerIndex(0);
    setTitle('');
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleImageClear = () => {
    if (imagePreview && !imagePreview.startsWith('http')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
  };

  const handleAudioChange = (file: File | null) => {
    setAudioFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAudioPreview(previewUrl);
    }
  };

  const handleAudioClear = () => {
    if (audioPreview && !audioPreview.startsWith('http')) {
      URL.revokeObjectURL(audioPreview);
    }
    setAudioFile(null);
    setAudioPreview(null);
  };

  const handleSaveQuestion = async () => {
    if (!title) {
      showError('Please enter a question title');
      return;
    }

    if (!isEditMode && !imageFile) {
      showError('Please upload an image');
      return;
    }

    if (!isEditMode && !audioFile) {
      showError('Please upload an audio file');
      return;
    }

    let imageUrl = imagePreview || '';
    let audioUrl = audioPreview || '';

    if (isEditMode) {
      if (imageFile) {
        if (question.imageUrl) {
          await deleteFileFromS3(question.imageUrl);
        }
        imageUrl = await uploadFileToS3(imageFile);
      }

      if (audioFile) {
        if (question.audioUrl) {
          await deleteFileFromS3(question.audioUrl);
        }
        audioUrl = await uploadFileToS3(audioFile);
      }
    } else {
      imageUrl = await uploadFileToS3(imageFile!);
      audioUrl = await uploadFileToS3(audioFile!);
    }

    const questionData: QuestionCreateRequest = {
      title,
      questionType: QuestionType.PART_1_PHOTOGRAPHS,
      audioUrl,
      imageUrl,
      choiceA: options[0],
      choiceB: options[1],
      choiceC: options[2],
      choiceD: options[3],
      correctAnswer: indexToLetter(correctAnswerIndex),
    };

    saveMutation.mutate({
      examId: examId || '',
      questionData,
    });
  };

  useEffect(() => {
    return () => {
      if (imagePreview && !imagePreview.startsWith('http')) {
        URL.revokeObjectURL(imagePreview);
      }

      if (audioPreview && !audioPreview.startsWith('http')) {
        URL.revokeObjectURL(audioPreview);
      }
    };
  }, [imagePreview, audioPreview]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MediaUploader
          type="image"
          value={imagePreview}
          onChange={handleImageChange}
          onClear={handleImageClear}
          label="Photograph"
        />

        <MediaUploader
          type="audio"
          value={audioPreview}
          onChange={handleAudioChange}
          onClear={handleAudioClear}
          label="Audio File"
        />
      </div>

      <QuestionCard
        title={title}
        setTitle={setTitle}
        options={options}
        setOptions={setOptions}
        correctAnswerIndex={correctAnswerIndex}
        setCorrectAnswerIndex={setCorrectAnswerIndex}
        part="part1"
      />

      <div className="flex justify-end gap-3 mt-8">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          className="gap-1 w-[150px]"
          onClick={handleSaveQuestion}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? (
            <Spinner />
          ) : (
            <>
              <Save className="h-4 w-4 mr-1" />
              {isEditMode ? 'Update Question' : 'Save Question'}
            </>
          )}
        </Button>
      </div>
    </>
  );
}
