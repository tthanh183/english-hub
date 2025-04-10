import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
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

export default function Part1QuestionContent({
  exerciseId,
  questionTitle,
}: Part1QuestionContentProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);

  const [correctAnswer, setCorrectAnswer] = useState<number>(1);
  const [options, setOptions] = useState<string[]>(['', '', '', '']);

  const { courseId } = useParams();

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

  const handleAddQuestion = () => {
    if (!imageFile) {
      showError('Please upload an image');
      return;
    }

    if (!audioFile) {
      showError('Please upload an audio file');
      return;
    }

    if (options.some(opt => !opt.trim())) {
      showError('Please fill in all answer options');
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
      correctAnswer: options[0],
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
          {[1, 2, 3, 4].map(num => (
            <div
              key={num}
              className={`border rounded-md p-4 ${
                num === correctAnswer
                  ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10'
                  : ''
              }`}
              onClick={() => setCorrectAnswer(num)}
            >
              <div className="flex items-center gap-2 mb-3">
                <RadioGroup
                  value={`option${correctAnswer}`}
                  onValueChange={value => {
                    const optionNum = parseInt(value.replace('option', ''));
                    setCorrectAnswer(optionNum);
                  }}
                  className="flex"
                >
                  <RadioGroupItem
                    value={`option${num}`}
                    id={`option${num}`}
                    checked={num === correctAnswer}
                  />
                </RadioGroup>
                <Label
                  htmlFor={`option${num}`}
                  className="flex items-center gap-2 font-medium cursor-pointer"
                >
                  Option {String.fromCharCode(64 + num)}
                  {num === correctAnswer && (
                    <span className="text-xs text-green-600 font-normal">
                      (Correct)
                    </span>
                  )}
                </Label>
              </div>
              <Input
                id={`option${num}-text`}
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
            handleAudioClear();
            setOptions(['', '', '', '']);
            setCorrectAnswer(1);
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
