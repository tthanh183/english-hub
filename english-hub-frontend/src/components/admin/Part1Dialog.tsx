import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  QuestionCreateRequest,
  QuestionResponse,
  QuestionType,
} from '@/types/questionType';
import { Spinner } from '../Spinner';
import MediaUploader from '@/components/admin/MediaUploader';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { addQuestion } from '@/services/exerciseService';
import { useParams } from 'react-router-dom';
import { showError, showSuccess } from '@/hooks/useToast';
import { isAxiosError } from 'axios';

type Part1QuestionContentProps = {
  exerciseId?: string;
  questionTitle: string;
};

// Định nghĩa options cố định cho TOEIC
const TOEIC_OPTIONS = [
  { letter: 'A', index: 0 },
  { letter: 'B', index: 1 },
  { letter: 'C', index: 2 },
  { letter: 'D', index: 3 },
];

export default function Part1QuestionContent({
  exerciseId,
  questionTitle,
}: Part1QuestionContentProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);

  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(0); // Mặc định là A
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
    setAudioFile(null);
    setAudioPreview(null);
    setOptions(['', '', '', '']);
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

  const handleAudioChange = (file: File | null) => {
    setAudioFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAudioPreview(previewUrl);
    }
  };

  const handleAudioClear = () => {
    if (audioPreview) {
      URL.revokeObjectURL(audioPreview);
    }
    setAudioFile(null);
    setAudioPreview(null);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const indexToLetter = (index: number): string => {
    return String.fromCharCode(65 + index);
  };

  const handleAddQuestion = () => {
    if (questionTitle) {
      showError('Please enter a question title');
      return;
    }

    if (!imageFile) {
      showError('Please upload an image');
      return;
    }

    if (!audioFile) {
      showError('Please upload an audio file');
      return;
    }

    const questionData: QuestionCreateRequest = {
      title: questionTitle,
      questionType: QuestionType.PART_1_PHOTOGRAPHS,
      audio: audioFile,
      image: imageFile,
      choiceA: options[0],
      choiceB: options[1],
      choiceC: options[2],
      choiceD: options[3],
      correctAnswer: indexToLetter(correctAnswerIndex),
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

        <MediaUploader
          type="audio"
          value={audioPreview}
          onChange={handleAudioChange}
          onClear={handleAudioClear}
          label="Audio File"
        />
      </div>

      <div className="mt-6">
        <Label>Answer Options</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          {TOEIC_OPTIONS.map(({ letter, index }) => (
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
                  onValueChange={value => {
                    setCorrectAnswerIndex(parseInt(value));
                  }}
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
        <Button
          variant="outline"
          onClick={() => {
            handleImageClear();
            handleAudioClear();
            setOptions(['', '', '', '']);
            setCorrectAnswerIndex(0);
          }}
        >
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
