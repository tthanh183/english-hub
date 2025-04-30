import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Save } from 'lucide-react';
import { showError, showSuccess } from '@/hooks/useToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  QuestionCreateRequest,
  QuestionResponse,
  QuestionType,
} from '@/types/questionType';
import { useParams } from 'react-router-dom';
import QuestionCard from './QuestionCard';
import { Spinner } from '../Spinner';

type ExercisePart7DialogProps = {
  exerciseId?: string;
  question?: QuestionResponse;
};

export default function ExercisePart7Dialog({
  exerciseId,
  question,
}: ExercisePart7DialogProps) {
  const isEditMode = !!question;
  const { courseId } = useParams();
  const queryClient = useQueryClient();

  const [passage, setPassage] = useState<string>('');
  const [questions, setQuestions] = useState<
    { title: string; options: string[]; correctAnswerIndex: number }[]
  >([]);

  useEffect(() => {
    if (isEditMode && question?.id) {
      setPassage(question.title || '');

      getRelatedQuestions(question.id)
        .then(relatedQuestions => {
          const updatedQuestions = relatedQuestions.map(q => ({
            title: q.title || '',
            options: [
              q.choiceA || '',
              q.choiceB || '',
              q.choiceC || '',
              q.choiceD || '',
            ],
            correctAnswerIndex: ['A', 'B', 'C', 'D'].indexOf(
              q.correctAnswer || 'A'
            ),
          }));
          setQuestions(updatedQuestions);
        })
        .catch(() => {
          showError('Failed to fetch related questions.');
        });
    } else {
      // Default to 2 questions for new entries
      setQuestions([
        { title: '', options: ['', '', '', ''], correctAnswerIndex: 0 },
        { title: '', options: ['', '', '', ''], correctAnswerIndex: 0 },
      ]);
    }
  }, [isEditMode, question]);

  const saveMutation = useMutation({
    mutationFn: async (data: {
      courseId: string;
      exerciseId?: string;
      examId?: string;
      questionData: QuestionCreateRequest[];
    }) => {
      if (isEditMode && question) {
        return updateQuestion(
          data.courseId,
          data.exerciseId || data.examId || '',
          question.id,
          data.questionData
        );
      } else {
        return addQuestions(
          data.courseId,
          data.exerciseId || data.examId || '',
          data.questionData
        );
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['questions', variables.exerciseId || variables.examId],
      });
      showSuccess(
        isEditMode
          ? 'Questions updated successfully'
          : 'Questions added successfully'
      );
    },
    onError: () => {
      showError('Failed to save questions.');
    },
  });

  const handleSaveQuestions = () => {
    if (!passage.trim()) {
      showError('Please enter the reading passage.');
      return;
    }

    if (questions.some(q => !q.title.trim())) {
      showError('Please fill in all question titles.');
      return;
    }

    if (questions.some(q => q.options.some(option => !option.trim()))) {
      showError('Please fill in all answer options.');
      return;
    }

    const questionData = questions.map(q => ({
      title: q.title,
      questionType: QuestionType.PART_7_READING_COMPREHENSION,
      choiceA: q.options[0],
      choiceB: q.options[1],
      choiceC: q.options[2],
      choiceD: q.options[3],
      correctAnswer: ['A', 'B', 'C', 'D'][q.correctAnswerIndex],
    }));

    saveMutation.mutate({
      courseId: courseId || '',
      exerciseId: exerciseId || '',
      examId: examId || '',
      questionData,
    });
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { title: '', options: ['', '', '', ''], correctAnswerIndex: 0 },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const handleQuestionChange = (
    index: number,
    field: 'title' | 'options' | 'correctAnswerIndex',
    value: any
  ) => {
    const updatedQuestions = [...questions];
    if (field === 'options') {
      updatedQuestions[index].options = value;
    } else {
      updatedQuestions[index][field] = value;
    }
    setQuestions(updatedQuestions);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="p7-passage">Reading Passage</Label>
          <Textarea
            id="p7-passage"
            placeholder="Enter the reading passage"
            rows={8}
            value={passage}
            onChange={e => setPassage(e.target.value)}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="text-base font-medium">Questions</Label>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={handleAddQuestion}
            >
              <Plus className="h-4 w-4" /> Add Question
            </Button>
          </div>

          {questions.map((question, index) => (
            <QuestionCard
              key={index}
              title={question.title}
              setTitle={value => handleQuestionChange(index, 'title', value)}
              options={question.options}
              setOptions={value =>
                handleQuestionChange(index, 'options', value)
              }
              correctAnswerIndex={question.correctAnswerIndex}
              setCorrectAnswerIndex={value =>
                handleQuestionChange(index, 'correctAnswerIndex', value)
              }
              part="part7"
              onRemove={() => handleRemoveQuestion(index)}
              removable
            />
          ))}
        </div>
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
