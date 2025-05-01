import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Save, Trash } from 'lucide-react';
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

type ExercisePart7DialogProps = {
  exerciseId?: string;
  question?: QuestionResponse;
  onClose: () => void;
};

export default function ExercisePart7Dialog({
  exerciseId,
  question,
  onClose,
}: ExercisePart7DialogProps) {
  const isEditMode = !!question;
  const { courseId } = useParams();
  const queryClient = useQueryClient();

  const [passage, setPassage] = useState<string>('');
  const [groupId, setGroupId] = useState<string | null>(null);

  const [questions, setQuestions] = useState<
    { title: string; options: string[]; correctAnswerIndex: number }[]
  >([
    { title: '', options: ['', '', '', ''], correctAnswerIndex: 0 },
    { title: '', options: ['', '', '', ''], correctAnswerIndex: 0 },
  ]);

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
      groupQuestionsQuery.data.length > 0
    ) {
      const sortedQuestions = groupQuestionsQuery.data || [];

      setPassage(sortedQuestions[0].passage || '');

      const updatedQuestions = sortedQuestions.map(q => ({
        title: q.title || '',
        options: [
          q.choiceA || '',
          q.choiceB || '',
          q.choiceC || '',
          q.choiceD || '',
        ],
        correctAnswerIndex: letterToIndex(q.correctAnswer || 'A'),
      }));

      setQuestions(updatedQuestions);
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
        console.log(error);

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
    setQuestions([
      { title: '', options: ['', '', '', ''], correctAnswerIndex: 0 },
      { title: '', options: ['', '', '', ''], correctAnswerIndex: 0 },
    ]);
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
    if (!groupQuestionsQuery.data || groupQuestionsQuery.data.length < 1) {
      throw new Error('Cannot update: Missing question data');
    }

    const sortedQuestions = groupQuestionsQuery.data || [];

    if (data.questionData.length > sortedQuestions.length) {
      const existingQuestions = data.questionData.slice(
        0,
        sortedQuestions.length
      );
      const newQuestions = data.questionData.slice(sortedQuestions.length);

      const updateResults = [];
      for (let i = 0; i < existingQuestions.length; i++) {
        updateResults.push(
          await updateQuestionInExercise(
            data.courseId,
            data.exerciseId,
            sortedQuestions[i].id,
            existingQuestions[i]
          )
        );
      }

      const addResult = await addQuestionsToExercise(
        data.courseId,
        data.exerciseId,
        newQuestions
      );

      return [...updateResults, addResult];
    } else {
      const results = [];
      for (
        let i = 0;
        i < Math.min(data.questionData.length, sortedQuestions.length);
        i++
      ) {
        results.push(
          await updateQuestionInExercise(
            data.courseId,
            data.exerciseId,
            sortedQuestions[i].id,
            data.questionData[i]
          )
        );
      }

      return results;
    }
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { title: '', options: ['', '', '', ''], correctAnswerIndex: 0 },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 2) {
      showError('At least 2 questions are required for Part 7');
      return;
    }

    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const handleSaveQuestions = () => {
    if (!passage.trim()) {
      showError('Please enter the reading passage.');
      return;
    }

    if (questions.length < 2) {
      showError('At least 2 questions are required for Part 7');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].title.trim()) {
        showError(`Please enter the title for question ${i + 1}`);
        return;
      }

      if (questions[i].options.some(option => !option.trim())) {
        showError(`Please fill in all options for question ${i + 1}`);
        return;
      }
    }

    const questionData = questions.map(q => ({
      title: q.title,
      questionType: QuestionType.PART_7_READING_COMPREHENSION,
      passage: passage,
      choiceA: q.options[0],
      choiceB: q.options[1],
      choiceC: q.options[2],
      choiceD: q.options[3],
      correctAnswer: indexToLetter(q.correctAnswerIndex),
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
          <Label htmlFor="p7-passage">Reading Passage</Label>
          <Textarea
            id="p7-passage"
            placeholder="Enter the reading passage"
            rows={10}
            value={passage}
            onChange={e => setPassage(e.target.value)}
            className="font-normal"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="text-base font-medium">
              Questions ({questions.length})
            </Label>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={handleAddQuestion}
            >
              <Plus className="h-4 w-4" /> Add Question
            </Button>
          </div>

          {questions.map((q, index) => (
            <div key={index} className="mb-6 relative">
              <QuestionCard
                title={q.title}
                setTitle={value => {
                  const updatedQuestions = [...questions];
                  updatedQuestions[index].title = value;
                  setQuestions(updatedQuestions);
                }}
                options={q.options}
                setOptions={value => {
                  const updatedQuestions = [...questions];
                  updatedQuestions[index].options = value;
                  setQuestions(updatedQuestions);
                }}
                correctAnswerIndex={q.correctAnswerIndex}
                setCorrectAnswerIndex={value => {
                  const updatedQuestions = [...questions];
                  updatedQuestions[index].correctAnswerIndex = value;
                  setQuestions(updatedQuestions);
                }}
                part="part7"
              />
              {questions.length > 2 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-0 right-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() => handleRemoveQuestion(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
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
