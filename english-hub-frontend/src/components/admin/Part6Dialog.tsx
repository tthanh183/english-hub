import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { Spinner } from '../Spinner';
import {
  QuestionCreateRequest,
  QuestionResponse,
  QuestionType,
  QuestionUpdateRequest,
} from '@/types/questionType';
import { addQuestionsToExercise, updateQuestionInExercise } from '@/services/exerciseService';
import { getAllQuestionByGroupId } from '@/services/questionService';
import { useParams } from 'react-router-dom';
import { showError, showSuccess } from '@/hooks/useToast';
import { isAxiosError } from 'axios';
import { indexToLetter, letterToIndex } from '@/utils/questionUtil';
import QuestionCard from './QuestionCard';

type Part6DialogProps = {
  exerciseId?: string;
  examId?: string;
  question?: QuestionResponse;
};

export default function Part6Dialog({
  exerciseId,
  examId,
  question,
}: Part6DialogProps) {
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
      if (!isEditMode || !groupId || (!exerciseId && !examId)) return null;
      return getAllQuestionByGroupId(groupId);
    },
    enabled: !!isEditMode && !!groupId && (!!exerciseId || !!examId),
  });

  useEffect(() => {
    if (
      isEditMode &&
      groupQuestionsQuery.data &&
      groupQuestionsQuery.data.length === 4
    ) {
      const sortedQuestions = [...groupQuestionsQuery.data].sort((a, b) =>
        (a.title || '').localeCompare(b.title || '')
      );

      setPassage(question?.title || '');

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
      exerciseId?: string;
      examId?: string;
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
        queryKey: ['questions', variables.exerciseId || variables.examId],
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
    },
    onError: error => {
      if (isAxiosError(error)) {
        showError(error.response?.data.message);
      } else {
        showError('Something went wrong');
      }
    },
  });

  const handleAddQuestions = async (data: {
    courseId: string;
    exerciseId?: string;
    examId?: string;
    questionData: QuestionCreateRequest[];
  }) => {
    return addQuestionsToExercise(
      data.courseId,
      data.exerciseId || data.examId || '',
      data.questionData
    );
  };

  const handleUpdateQuestions = async (data: {
    courseId: string;
    exerciseId?: string;
    examId?: string;
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
          data.exerciseId || data.examId || '',
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

    const questionData = titles.map((title, index) => ({
      title,
      questionType: QuestionType.PART_6_TEXT_COMPLETION,
      choiceA: options[index][0],
      choiceB: options[index][1],
      choiceC: options[index][2],
      choiceD: options[index][3],
      correctAnswer: indexToLetter(correctAnswers[index]),
    }));

    saveMutation.mutate({
      courseId: courseId || '',
      exerciseId: exerciseId || '',
      examId: examId || '',
      questionData,
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="p6-passage">Text Passage</Label>
          <Textarea
            id="p6-passage"
            placeholder="Enter the passage with blanks (use '[____]' to indicate blanks)"
            rows={6}
            value={passage}
            onChange={e => setPassage(e.target.value)}
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
        <Button
          variant="outline"
          onClick={() => queryClient.invalidateQueries()}
        >
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
