import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import MediaUploader from './MediaUploader';
import { Button } from '@/components/ui/button';
import { Spinner } from '../Spinner';
import { Save } from 'lucide-react';
import { isAxiosError } from 'axios';
import { showError, showSuccess } from '@/hooks/useToast';
import { addQuestion, updateQuestion } from '@/services/exerciseService';
import {
  QuestionCreateRequest,
  QuestionResponse,
  QuestionType,
  QuestionUpdateRequest,
} from '@/types/questionType';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { PART2_OPTIONS } from '@/constants/options';
import { indexToLetter, letterToIndex } from '@/utils/questionUtil';
import { deleteFileFromS3, uploadFileToS3 } from '@/services/s3Service';

type Part2DialogProps = {
  exerciseId?: string;
  questionTitle: string;
  question?: QuestionResponse;
};

export default function Part2Dialog({
  exerciseId,
  questionTitle,
  question,
}: Part2DialogProps) {
  const isEditMode = !!question;

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(
    question?.audioUrl || null
  );

  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(
    question?.correctAnswer ? letterToIndex(question.correctAnswer) : 0
  );

  const [options, setOptions] = useState<string[]>(
    isEditMode
      ? [
          question?.choiceA || '',
          question?.choiceB || '',
          question?.choiceC || '',
        ]
      : ['', '', '']
  );

  const { courseId } = useParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (
      question &&
      question.questionType === QuestionType.PART_2_QUESTION_RESPONSES
    ) {
      if (question.audioUrl) {
        setAudioPreview(question.audioUrl);
      }

      setOptions([
        question.choiceA || '',
        question.choiceB || '',
        question.choiceC || '',
      ]);

      if (question.correctAnswer) {
        const index = letterToIndex(question.correctAnswer);
        setCorrectAnswerIndex(index);
      }
    } else if (!question) {
      resetContentState();
    }
  }, [question]);

  useEffect(() => {
    return () => {
      if (audioPreview && !audioPreview.startsWith('http')) {
        URL.revokeObjectURL(audioPreview);
      }
    };
  }, [audioPreview]);

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
          data.questionData as QuestionUpdateRequest
        );
      } else {
        return addQuestion(
          data.courseId,
          data.exerciseId,
          data.questionData as QuestionCreateRequest
        );
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
      resetContentState();
    },
  });

  const resetContentState = () => {
    if (audioPreview && !audioPreview.startsWith('http')) {
      URL.revokeObjectURL(audioPreview);
    }
    setAudioFile(null);
    setAudioPreview(null);
    setOptions(['', '', '']);
    setCorrectAnswerIndex(0);
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
    if (!isEditMode && !audioFile) {
      showError('Please upload an audio file');
      return;
    }

    if (isEditMode && audioFile) {
      await deleteFileFromS3(question.audioUrl!);
    }

    const audioUrl = await uploadFileToS3(audioFile!);

    const questionData: QuestionCreateRequest = {
      title: questionTitle,
      questionType: QuestionType.PART_2_QUESTION_RESPONSES,
      audioUrl: audioUrl,
      choiceA: options[0],
      choiceB: options[1],
      choiceC: options[2],
      correctAnswer: indexToLetter(correctAnswerIndex),
    };

    saveMutation.mutate({
      courseId: courseId || '',
      exerciseId: exerciseId || '',
      questionData,
    });
  };

  return (
    <>
      <div className="mb-6">
        <div className="w-full max-w-md mx-auto">
          <MediaUploader
            type="audio"
            value={audioPreview}
            onChange={handleAudioChange}
            onClear={handleAudioClear}
            label="Audio File"
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
