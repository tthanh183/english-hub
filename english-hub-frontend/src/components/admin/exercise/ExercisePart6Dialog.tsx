import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { Spinner } from '@/components/Spinner';
import {
  QuestionCreateRequest,
  QuestionResponse,
  QuestionType,
  QuestionUpdateRequest,
} from '@/types/questionType';
import {
  addQuestionsToExercise,
  updateQuestionInExercise,
} from '@/services/exerciseService';
import { getAllQuestionByGroupId } from '@/services/questionService';
import { useParams } from 'react-router-dom';
import { showError, showSuccess } from '@/hooks/useToast';
import { isAxiosError } from 'axios';
import { indexToLetter, letterToIndex } from '@/utils/questionUtil';
import QuestionCard from '@/components/admin/QuestionCard';

type ExercisePart6DialogProps = {
  exerciseId?: string;
  question?: QuestionResponse;
  onClose: () => void;
};

export default function ExercisePart6Dialog({
  exerciseId,
  question,
  onClose,
}: ExercisePart6DialogProps) {
  const isEditMode = !!question;
  const { courseId } = useParams();
  const queryClient = useQueryClient();

  const [passage, setPassage] = useState<string>('');
  const [groupId, setGroupId] = useState<string | null>(null);

  const [titles, setTitles] = useState<string[]>(['', '', '', '']);
  const [options, setOptions] = useState<string[][]>([
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
  ]);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([0, 0, 0, 0]);

  useEffect(() => {
    if (isEditMode && question?.groupId) {
      setGroupId(question.groupId);
    }
  }, [isEditMode, question]);

  const groupQuestionsQuery = useQuery({
    queryKey: ['groupQuestions', groupId],
    queryFn: async () => {
      if (!isEditMode || !groupId || !exerciseId) return null;
      return getAllQuestionByGroupId(groupId);
    },
    enabled: !!isEditMode && !!groupId && !!exerciseId,
  });

  useEffect(() => {
    if (
      isEditMode &&
      groupQuestionsQuery.data &&
      groupQuestionsQuery.data.length === 4
    ) {
      const sortedQuestions = groupQuestionsQuery.data || [];

      setPassage(question.passage || '');

      const updatedTitles = sortedQuestions.map(q => q.title || '');
      const updatedOptions = sortedQuestions.map(q => [
        q.choiceA || '',
        q.choiceB || '',
        q.choiceC || '',
        q.choiceD || '',
      ]);
      const updatedCorrectAnswers = sortedQuestions.map(q =>
        letterToIndex(q.correctAnswer || 'A')
      );

      setTitles(updatedTitles);
      setOptions(updatedOptions);
      setCorrectAnswers(updatedCorrectAnswers);
    }
  }, [isEditMode, groupQuestionsQuery.data, question]);

  const saveMutation = useMutation({
    mutationFn: async (data: {
      courseId: string;
      exerciseId: string;
      questionData: QuestionCreateRequest[];
    }) => {
      if (isEditMode && groupQuestionsQuery.data) {
        return handleUpdateQuestions(data);
      } else {
        return handleAddQuestions(data);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['questions', variables.exerciseId],
      });

      if (groupId) {
        queryClient.invalidateQueries({
          queryKey: ['groupQuestions', groupId],
        });
      }

      showSuccess(
        isEditMode
          ? 'Questions updated successfully'
          : 'Questions added successfully'
      );

      onClose();
    },
    onError: error => {
      if (isAxiosError(error)) {
        showError(error.response?.data.message);
      } else {
        showError('Something went wrong');
      }
    },
    onSettled: () => {
      if (!isEditMode) {
        resetContentState();
      }
    },
  });

  const resetContentState = () => {
    setPassage('');
    setTitles(['', '', '', '']);
    setOptions([
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
    ]);
    setCorrectAnswers([0, 0, 0, 0]);
  };

  const handleAddQuestions = async (data: {
    courseId: string;
    exerciseId: string;
    questionData: QuestionCreateRequest[];
  }) => {
    return addQuestionsToExercise(
      data.courseId,
      data.exerciseId,
      data.questionData
    );
  };

  const handleUpdateQuestions = async (data: {
    courseId: string;
    exerciseId: string;
    questionData: QuestionUpdateRequest[];
  }) => {
    if (!groupQuestionsQuery.data || groupQuestionsQuery.data.length !== 4) {
      throw new Error('Cannot update: Missing question data');
    }

    const sortedQuestions = [...groupQuestionsQuery.data].sort((a, b) =>
      (a.title || '').localeCompare(b.title || '')
    );

    const updatedQuestions = data.questionData.map((q, index) => ({
      ...q,
      id: sortedQuestions[index].id,
    }));

    const results = [];
    for (const question of updatedQuestions) {
      if (!question.id) {
        throw new Error('Missing question ID for update');
      }

      results.push(
        await updateQuestionInExercise(
          data.courseId,
          data.exerciseId,
          question.id,
          question
        )
      );
    }

    return results;
  };

  const handleSaveQuestions = () => {
    if (!passage.trim()) {
      showError('Please enter the passage.');
      return;
    }

    for (let i = 0; i < titles.length; i++) {
      if (!titles[i].trim()) {
        showError(`Please enter the title for question ${i + 1}`);
        return;
      }

      if (options[i].some(option => !option.trim())) {
        showError(`Please fill in all options for question ${i + 1}`);
        return;
      }
    }

    const questionData = titles.map((title, index) => ({
      title,
      questionType: QuestionType.PART_6_TEXT_COMPLETION,
      passage: passage, 
      choiceA: options[index][0],
      choiceB: options[index][1],
      choiceC: options[index][2],
      choiceD: options[index][3],
      correctAnswer: indexToLetter(correctAnswers[index]),
    }));

    saveMutation.mutate({
      courseId: courseId || '',
      exerciseId: exerciseId || '',
      questionData,
    });
  };

  if (isEditMode && groupQuestionsQuery.isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner />
        <span className="ml-2">Loading questions...</span>
      </div>
    );
  }

  if (isEditMode && groupQuestionsQuery.isError) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>Failed to load questions in this group.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => groupQuestionsQuery.refetch()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="p6-passage">Text Passage</Label>
          <Textarea
            id="p6-passage"
            placeholder="Enter the passage with blanks (use '[____]' to indicate blanks)"
            rows={8}
            value={passage}
            onChange={e => setPassage(e.target.value)}
            className="font-normal"
          />
        </div>

        {titles.map((title, index) => (
          <QuestionCard
            key={index}
            title={title}
            setTitle={value => {
              const updatedTitles = [...titles];
              updatedTitles[index] = value;
              setTitles(updatedTitles);
            }}
            options={options[index]}
            setOptions={value => {
              const updatedOptions = [...options];
              updatedOptions[index] = value;
              setOptions(updatedOptions);
            }}
            correctAnswerIndex={correctAnswers[index]}
            setCorrectAnswerIndex={value => {
              const updatedCorrectAnswers = [...correctAnswers];
              updatedCorrectAnswers[index] = value;
              setCorrectAnswers(updatedCorrectAnswers);
            }}
            part="part6"
          />
        ))}
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          className="gap-1 w-[150px]"
          onClick={handleSaveQuestions}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? (
            <Spinner />
          ) : (
            <>
              <Save className="h-4 w-4 mr-1" />
              {isEditMode ? 'Update Questions' : 'Save Questions'}
            </>
          )}
        </Button>
      </div>
    </>
  );
}
