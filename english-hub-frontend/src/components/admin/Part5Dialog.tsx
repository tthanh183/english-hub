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
import { Spinner } from '../Spinner';
import { addQuestion, updateQuestion } from '@/services/exerciseService';
import { useParams } from 'react-router-dom';
import { showError, showSuccess } from '@/hooks/useToast';
import { isAxiosError } from 'axios';
import { indexToLetter, letterToIndex } from '@/utils/questionUtil';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

type Part5DialogProps = {
  exerciseId?: string;
  examId?: string;
  question?: QuestionResponse;
};

export default function Part5Dialog({
  exerciseId,
  examId,
  question,
}: Part5DialogProps) {
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
      exerciseId?: string;
      examId?: string;
      questionData: QuestionCreateRequest;
    }) => {
      if (isEditMode && question) {
        return updateQuestion(
          data.courseId,
          data.exerciseId || data.examId || '',
          question.id,
          data.questionData as QuestionUpdateRequest
        );
      } else {
        return addQuestion(
          data.courseId,
          data.exerciseId || data.examId || '',
          data.questionData as QuestionCreateRequest
        );
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['questions', variables.exerciseId || variables.examId],
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
      if (!isEditMode) {
        resetContentState();
      }
    },
  });

  const resetContentState = () => {
    setSentence('');
    setOptions(['', '', '', '']);
    setCorrectAnswerIndex(0);
  };

  const handleSaveQuestion = async () => {
    if (!sentence) {
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
      examId: examId || '',
      questionData,
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="p5-sentence">Incomplete Sentence</Label>
          <Textarea
            id="p5-sentence"
            placeholder="Enter the incomplete sentence (use '____' to indicate the blank)"
            rows={3}
            value={sentence}
            onChange={e => setSentence(e.target.value)}
          />
        </div>

        <div>
          <Label>Answer Options</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            {options.map((option, index) => (
              <div
                key={index}
                className={`border rounded-md p-4 ${
                  index === correctAnswerIndex
                    ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10'
                    : ''
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <RadioGroup
                    value={indexToLetter(correctAnswerIndex)}
                    onValueChange={value =>
                      setCorrectAnswerIndex(letterToIndex(value))
                    }
                    className="flex"
                  >
                    <RadioGroupItem
                      value={indexToLetter(index)}
                      id={`p5-option${index}`}
                    />
                  </RadioGroup>
                  <Label
                    htmlFor={`p5-option${index}`}
                    className="flex items-center gap-2 font-medium"
                  >
                    Option {String.fromCharCode(65 + index)}
                    {index === correctAnswerIndex && (
                      <span className="text-xs text-green-600 font-normal">
                        (Correct)
                      </span>
                    )}
                  </Label>
                </div>
                <Input
                  id={`p5-option${index}-text`}
                  placeholder={`Enter option ${index + 1}`}
                  value={option}
                  onChange={e => {
                    const newOptions = [...options];
                    newOptions[index] = e.target.value;
                    setOptions(newOptions);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <Button variant="outline" onClick={() => resetContentState()}>
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
