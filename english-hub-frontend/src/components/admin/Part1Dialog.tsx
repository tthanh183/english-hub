import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
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
import { addQuestion, updateQuestion } from '@/services/exerciseService';
import { useParams } from 'react-router-dom';
import { showError, showSuccess } from '@/hooks/useToast';
import { isAxiosError } from 'axios';
import { PART1_OPTIONS } from '@/constants/options';
import { indexToLetter, letterToIndex } from '@/utils/questionUtil';
import { deleteFileFromS3, uploadFileToS3 } from '@/services/s3Service';

type Part1QuestionContentProps = {
  exerciseId?: string;
  questionTitle: string;
  question?: QuestionResponse;
};

export default function Part1QuestionContent({
  exerciseId,
  questionTitle,
  question,
}: Part1QuestionContentProps) {
  const isEditMode = !!question;

  const [imageFile, setImageFile] = useState<File | null>();
  const [imagePreview, setImagePreview] = useState<string | null>(
    question?.imageUrl || null
  );

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(
    question?.audioUrl || null
  );

  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(0);
  const [options, setOptions] = useState<string[]>(['', '', '', '']);

  useEffect(() => {
    if (question && question.questionType === QuestionType.PART_1_PHOTOGRAPHS) {
      if (question.imageUrl) setImagePreview(question.imageUrl);
      if (question.audioUrl) setAudioPreview(question.audioUrl);

      const newOptions = [
        question.choiceA || '',
        question.choiceB || '',
        question.choiceC || '',
        question.choiceD || '',
      ];
      setOptions(newOptions);
      if (question.correctAnswer) {
        const index = letterToIndex(question.correctAnswer);
        setCorrectAnswerIndex(index);
      }
    }
  }, [question]);

  const { courseId } = useParams();

  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: (data: {
      courseId: string;
      exerciseId: string;
      questionData: QuestionCreateRequest;
    }) => {
      if (isEditMode && question) {
        return updateQuestion(
          data.courseId,
          data.exerciseId,
          question.id,
          data.questionData
        );
      } else {
        return addQuestion(data.courseId, data.exerciseId, data.questionData);
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
      if (!isEditMode) {
        resetContentState();
      }
    },
  });

  const resetContentState = () => {
    setImageFile(null);
    setImagePreview(null);
    setAudioFile(null);
    setAudioPreview(null);
    setOptions(['', '', '', '']);
    setCorrectAnswerIndex(0);
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleImageClear = () => {
    if (imagePreview && !imagePreview.startsWith('http')) {
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
    if (audioPreview && !audioPreview.startsWith('http')) {
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

  const handleSaveQuestion = async () => {
    if (!questionTitle) {
      showError('Please enter a question title');
      return;
    }

    if (!isEditMode && !imageFile) {
      showError('Please upload an image');
      return;
    }

    if (!isEditMode && !audioFile) {
      showError('Please upload an audio file');
      return;
    }

    if (isEditMode) {
      if (imageFile) {
        deleteFileFromS3(question.imageUrl!);
      }
      if (audioFile) {
        deleteFileFromS3(question.audioUrl!);
      }
    }

    const audioUrl = await uploadFileToS3(audioFile!);
    const imageUrl = await uploadFileToS3(imageFile!);

    const questionData: QuestionCreateRequest = {
      title: questionTitle,
      questionType: QuestionType.PART_1_PHOTOGRAPHS,
      audioUrl: audioUrl,
      imageUrl: imageUrl,
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

  useEffect(() => {
    return () => {
      if (imagePreview && !imagePreview.startsWith('http')) {
        URL.revokeObjectURL(imagePreview);
      }

      if (audioPreview && !audioPreview.startsWith('http')) {
        URL.revokeObjectURL(audioPreview);
      }
    };
  }, [imagePreview, audioPreview]);

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
          {PART1_OPTIONS.map(({ letter, index }) => (
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
