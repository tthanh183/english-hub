import { useState, useEffect } from 'react';
import MediaUploader from './MediaUploader';
import { Button } from '@/components/ui/button';
import { Spinner } from '../Spinner';
import { Save } from 'lucide-react';
import { isAxiosError } from 'axios';
import { showError, showSuccess } from '@/hooks/useToast';
import { addQuestion, updateQuestion } from '@/services/exerciseService';
import {
  QuestionCreateRequest,
  QuestionResponse,
  QuestionType,
  QuestionUpdateRequest,
} from '@/types/questionType';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { indexToLetter, letterToIndex } from '@/utils/questionUtil';
import { deleteFileFromS3, uploadFileToS3 } from '@/services/s3Service';
import QuestionCard from './QuestionCard';

type Part2DialogProps = {
  exerciseId?: string;
  question?: QuestionResponse;
};

export default function Part2Dialog({
  exerciseId,
  question,
}: Part2DialogProps) {
  const isEditMode = !!question;

  const [title, setTitle] = useState<string>('');

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(
    question?.audioUrl || null
  );

  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(
    question?.correctAnswer ? letterToIndex(question.correctAnswer) : 0
  );

  const [options, setOptions] = useState<string[]>(
    isEditMode
      ? [
          question?.choiceA || '',
          question?.choiceB || '',
          question?.choiceC || '',
        ]
      : ['', '', '']
  );

  const { courseId } = useParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (
      question &&
      question.questionType === QuestionType.PART_2_QUESTION_RESPONSES
    ) {
      setTitle(question.title || '');
      if (question.audioUrl) {
        setAudioPreview(question.audioUrl);
      }

      const newOptions = [
        question.choiceA || '',
        question.choiceB || '',
        question.choiceC || '',
      ];
      setOptions(newOptions);

      if (question.correctAnswer) {
        const index = letterToIndex(question.correctAnswer);
        setCorrectAnswerIndex(index);
      }
    }
  }, [question]);

  useEffect(() => {
    return () => {
      if (audioPreview && !audioPreview.startsWith('http')) {
        URL.revokeObjectURL(audioPreview);
      }
    };
  }, [audioPreview]);

  const saveMutation = useMutation({
    mutationFn: (data: {
      courseId: string;
      exerciseId: string;
      questionData: QuestionCreateRequest;
    }) => {
      if (isEditMode && question) {
        return updateQuestion(
          data.courseId,
          data.exerciseId,
          question.id,
          data.questionData as QuestionUpdateRequest
        );
      } else {
        return addQuestion(
          data.courseId,
          data.exerciseId,
          data.questionData as QuestionCreateRequest
        );
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['questions', variables.exerciseId],
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
    },
  });

  const resetContentState = () => {
    if (audioPreview && !audioPreview.startsWith('http')) {
      URL.revokeObjectURL(audioPreview);
    }
    setAudioFile(null);
    setAudioPreview(null);
    setOptions(['', '', '']);
    setCorrectAnswerIndex(0);
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
    if (!isEditMode && !audioFile) {
      showError('Please upload an audio file');
      return;
    }

    if (isEditMode && audioFile) {
      await deleteFileFromS3(question.audioUrl!);
    }

    const audioUrl = await uploadFileToS3(audioFile!);

    const questionData: QuestionCreateRequest = {
      title: title,
      questionType: QuestionType.PART_2_QUESTION_RESPONSES,
      audioUrl: audioUrl,
      choiceA: options[0],
      choiceB: options[1],
      choiceC: options[2],
      correctAnswer: indexToLetter(correctAnswerIndex),
    };

    saveMutation.mutate({
      courseId: courseId || '',
      exerciseId: exerciseId || '',
      questionData,
    });
  };

  return (
    <>
      <div className="mb-10">
        <div className="w-full max-w-md mx-auto">
          <MediaUploader
            type="audio"
            value={audioPreview}
            onChange={handleAudioChange}
            onClear={handleAudioClear}
            label="Audio File"
            className="max-h-[250px]"
          />
        </div>
      </div>

      <QuestionCard
        title={title}
        setTitle={setTitle}
        options={options}
        setOptions={setOptions}
        correctAnswerIndex={correctAnswerIndex}
        setCorrectAnswerIndex={setCorrectAnswerIndex}
        part="part2"
      />

      <div className="flex justify-end gap-3 mt-8">
        <Button variant="outline" onClick={resetContentState}>
          Reset
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
