import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
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
import { PART2_OPTIONS } from '@/constants/options';
import { indexToLetter } from '@/utils/questionUtil';

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

  // Sử dụng index thay vì string để đơn giản hóa logic
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(0); // 0 = A, 1 = B, 2 = C

  // Sửa mảng options chỉ còn 3 phần tử, phù hợp với Part 2
  const [options, setOptions] = useState<string[]>(['', '', '']);

  const { courseId } = useParams();
  const queryClient = useQueryClient();

  // Nếu chưa có hàm indexToLetter trong utils, thêm ở đây
  const convertIndexToLetter = (index: number): string => {
    return String.fromCharCode(65 + index); // 65 = 'A'
  };

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
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
    setOptions(['', '', '']);
    setCorrectAnswerIndex(0); // Reset về A
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
      correctAnswer: convertIndexToLetter(correctAnswerIndex), // Chuyển từ index sang A, B, C
    };

    createMutation.mutate({
      courseId: courseId || '',
      exerciseId: exerciseId || '',
      questionData,
    });
  };

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <>
      <div className="mb-6">
        <div className="w-full max-w-md mx-auto">
          <MediaUploader
            type="image"
            value={imagePreview}
            onChange={handleImageChange}
            onClear={handleImageClear}
            label="Photograph"
            className="max-h-[250px]"
          />
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <Label className="text-base font-medium">Answer Options</Label>
          <span className="text-sm text-muted-foreground">
            Select the correct answer
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          {PART2_OPTIONS.map(({ letter, index }) => (
            <div
              key={letter}
              className={`border rounded-md p-4 transition-colors ${
                index === correctAnswerIndex
                  ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10'
                  : ''
              }`}
              onClick={() => setCorrectAnswerIndex(index)}
            >
              <div className="flex items-center gap-2 mb-3">
                <RadioGroup
                  value={correctAnswerIndex.toString()}
                  onValueChange={value =>
                    setCorrectAnswerIndex(parseInt(value))
                  }
                  className="flex"
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${letter}`}
                    checked={index === correctAnswerIndex}
                  />
                </RadioGroup>
                <Label
                  htmlFor={`option-${letter}`}
                  className="flex items-center gap-2 font-medium cursor-pointer"
                >
                  {letter}
                  {index === correctAnswerIndex && (
                    <span className="text-xs text-green-600 font-normal">
                      (Correct)
                    </span>
                  )}
                </Label>
              </div>
              <Input
                id={`option-${letter}-text`}
                placeholder={`Enter option ${letter}`}
                value={options[index]}
                onChange={e => handleOptionChange(index, e.target.value)}
                onClick={e => e.stopPropagation()}
                className={
                  index === correctAnswerIndex ? 'border-green-500' : ''
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <Button variant="outline" onClick={resetContentState}>
          Reset
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
