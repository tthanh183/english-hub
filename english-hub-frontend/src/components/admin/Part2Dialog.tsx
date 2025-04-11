import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import MediaUploader from './MediaUploader';
import { Button } from '../ui/button';
import { Spinner } from '../Spinner';
import { Save } from 'lucide-react';
import { isAxiosError } from 'axios';
import { showError, showSuccess } from '@/hooks/useToast';
import { addQuestion } from '@/services/exerciseService';
import {
  QuestionCreateRequest,
  QuestionResponse,
  QuestionType,
} from '@/types/questionType';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

type Part2DialogProps = {
  exerciseId?: string;
  questionTitle: string;
};

export default function Part2Dialog({
  exerciseId,
  questionTitle,
}: Part2DialogProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [correctAnswer, setCorrectAnswer] = useState<string>('A');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);

  const { courseId } = useParams();

  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: ({
      courseId,
      exerciseId,
      questionData,
    }: {
      courseId: string;
      exerciseId: string;
      questionData: QuestionCreateRequest;
    }) => addQuestion(courseId, exerciseId, questionData),
    onSuccess: (response: QuestionResponse) => {
      queryClient.setQueryData<QuestionResponse[]>(
        ['questions', exerciseId],
        (oldQuestions = []) =>
          Array.isArray(oldQuestions) ? [...oldQuestions, response] : [response]
      );
      showSuccess('Question created successfully!');
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
    setImageFile(null);
    setImagePreview(null);
    setOptions(['', '', '', '']);
    setCorrectAnswer(1);
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleImageClear = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddQuestion = () => {
    if (!imageFile) {
      showError('Please upload an image');
      return;
    }

    if (options.some(opt => !opt.trim())) {
      showError('Please fill in all answer options');
      return;
    }

    const questionData: QuestionCreateRequest = {
      title: questionTitle,
      questionType: QuestionType.PART_2_QUESTIONS_RESPONSES,
      image: imageFile,
      choiceA: options[0],
      choiceB: options[1],
      choiceC: options[2],
      correctAnswer: correctAnswer,
    };

    createMutation.mutate({
      courseId: courseId || '',
      exerciseId: exerciseId || '',
      questionData,
    });
  };

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
      </div>

      <div className="mt-6">
        <Label>Answer Options</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          {[1, 2, 3].map(num => (
            <div
              key={num}
              className={`border rounded-md p-4 ${
                num === 1
                  ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10'
                  : ''
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <RadioGroup defaultValue="option1" className="flex">
                  <RadioGroupItem
                    value={`option${num}`}
                    id={`p2-option${num}`}
                    checked={num === 1}
                  />
                </RadioGroup>
                <Label
                  htmlFor={`p2-option${num}`}
                  className="flex items-center gap-2 font-medium"
                >
                  Option {String.fromCharCode(64 + num)}
                  {num === 1 && (
                    <span className="text-xs text-green-600 font-normal">
                      (Correct)
                    </span>
                  )}
                </Label>
              </div>
              <Input
                id={`p2-option${num}-text`}
                placeholder={`Enter option ${num}`}
                value={options[num - 1]}
                onChange={e => handleOptionChange(num - 1, e.target.value)}
                onClick={e => e.stopPropagation()}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-8">
        <Button
          variant="outline"
          onClick={() => {
            handleImageClear();
            setOptions(['', '', '']);
            setCorrectAnswer('A');
          }}
        >
          Cancel
        </Button>
        <Button
          className="gap-1 min-w-[120px]"
          onClick={handleAddQuestion}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? (
            <Spinner />
          ) : (
            <>
              <Save className="h-4 w-4 mr-1" />
              Save Question
            </>
          )}
        </Button>
      </div>
    </>
  );
}
