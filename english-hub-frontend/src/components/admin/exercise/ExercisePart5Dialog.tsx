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
import {
  addQuestionToExercise,
  updateQuestionInExercise,
} from '@/services/exerciseService';
import { useParams } from 'react-router-dom';
import { showError, showSuccess } from '@/hooks/useToast';
import { isAxiosError } from 'axios';
import { indexToLetter, letterToIndex } from '@/utils/questionUtil';
import QuestionCard from '@/components/admin/QuestionCard';

type ExercisePart5DialogProps = {
  exerciseId?: string;
  question?: QuestionResponse;
  onClose: () => void;
};

export default function ExercisePart5Dialog({
  exerciseId,
  question,
  onClose,
}: ExercisePart5DialogProps) {
  const isEditMode = !!question;
  const { courseId } = useParams();
  const queryClient = useQueryClient();

  const [sentence, setSentence] = useState<string>('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(0);

  useEffect(() => {
    if (isEditMode && question) {
      setSentence(question.title || '');
      setOptions([
        question.choiceA || '',
        question.choiceB || '',
        question.choiceC || '',
        question.choiceD || '',
      ]);
      if (question.correctAnswer) {
        setCorrectAnswerIndex(letterToIndex(question.correctAnswer));
      }
    }
  }, [isEditMode, question]);

  const saveMutation = useMutation({
    mutationFn: (data: {
      courseId: string;
      exerciseId: string;
      questionData: QuestionCreateRequest;
    }) => {
      if (isEditMode && question) {
        return updateQuestionInExercise(
          data.courseId,
          data.exerciseId,
          question.id,
          data.questionData as QuestionUpdateRequest
        );
      } else {
        return addQuestionToExercise(
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
      onClose();
    },
  });

  const resetContentState = () => {
    setSentence('');
    setOptions(['', '', '', '']);
    setCorrectAnswerIndex(0);
  };

  const handleSaveQuestion = async () => {
    if (!sentence.trim()) {
      showError('Please enter the incomplete sentence.');
      return;
    }

    if (options.some(option => !option.trim())) {
      showError('Please fill in all answer options.');
      return;
    }

    const questionData: QuestionCreateRequest = {
      title: sentence,
      questionType: QuestionType.PART_5_INCOMPLETE_SENTENCES,
      choiceA: options[0],
      choiceB: options[1],
      choiceC: options[2],
      choiceD: options[3],
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
      <div className="space-y-6">
        <QuestionCard
          title={sentence}
          setTitle={setSentence}
          options={options}
          setOptions={setOptions}
          correctAnswerIndex={correctAnswerIndex}
          setCorrectAnswerIndex={setCorrectAnswerIndex}
          part="part5"
        />
      </div>

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
