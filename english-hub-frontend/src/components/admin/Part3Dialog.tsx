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
import { addQuestions, updateQuestions } from '@/services/exerciseService';
import { useParams } from 'react-router-dom';
import { showError, showSuccess } from '@/hooks/useToast';
import { isAxiosError } from 'axios';
import { indexToLetter, letterToIndex } from '@/utils/questionUtil';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { deleteFileFromS3, uploadFileToS3 } from '@/services/s3Service';

const OPTIONS_LETTERS = ['A', 'B', 'C', 'D'];

type Part3DialogProps = {
  exerciseId?: string;
  questionTitle: string;
  questions?: QuestionResponse[];
};

export default function Part3Dialog({
  exerciseId,
  questionTitle,
  questions,
}: Part3DialogProps) {
  const isEditMode = !!questions;
  const { courseId } = useParams();
  const queryClient = useQueryClient();

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);

  const [options1, setOptions1] = useState<string[]>(['', '', '', '']);
  const [correctAnswer1Index, setCorrectAnswer1Index] = useState<number>(0);

  const [options2, setOptions2] = useState<string[]>(['', '', '', '']);
  const [correctAnswer2Index, setCorrectAnswer2Index] = useState<number>(0);

  const [options3, setOptions3] = useState<string[]>(['', '', '', '']);
  const [correctAnswer3Index, setCorrectAnswer3Index] = useState<number>(0);

  useEffect(() => {
    if (isEditMode && questions?.length === 3) {
      if (questions[0].audioUrl) setAudioPreview(questions[0].audioUrl);

      setOptions1([
        questions[0].choiceA || '',
        questions[0].choiceB || '',
        questions[0].choiceC || '',
        questions[0].choiceD || '',
      ]);
      setCorrectAnswer1Index(letterToIndex(questions[0].correctAnswer));

      setOptions2([
        questions[1].choiceA || '',
        questions[1].choiceB || '',
        questions[1].choiceC || '',
        questions[1].choiceD || '',
      ]);
      setCorrectAnswer2Index(letterToIndex(questions[1].correctAnswer));

      setOptions3([
        questions[2].choiceA || '',
        questions[2].choiceB || '',
        questions[2].choiceC || '',
        questions[2].choiceD || '',
      ]);
      setCorrectAnswer3Index(letterToIndex(questions[2].correctAnswer));
    }
  }, [questions, isEditMode]);

  const saveMutation = useMutation({
    mutationFn: async (data: {
      courseId: string;
      exerciseId: string;
      questionData: QuestionCreateRequest[];
    }) => {
      if (isEditMode && questions) {
        return handleUpdateQuestion(data);
      } else {
        return handleAddQuestion(data);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['questions', variables.exerciseId],
      });

      showSuccess(
        isEditMode
          ? 'Question updated successfully'
          : 'Question added successfully'
      );
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
    setAudioFile(null);
    setAudioPreview(null);

    setOptions1(['', '', '', '']);
    setCorrectAnswer1Index(0);

    setOptions2(['', '', '', '']);
    setCorrectAnswer2Index(0);

    setOptions3(['', '', '', '']);
    setCorrectAnswer3Index(0);
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

  const handleOption1Change = (index: number, value: string) => {
    const newOptions = [...options1];
    newOptions[index] = value;
    setOptions1(newOptions);
  };

  const handleOption2Change = (index: number, value: string) => {
    const newOptions = [...options2];
    newOptions[index] = value;
    setOptions2(newOptions);
  };

  const handleOption3Change = (index: number, value: string) => {
    const newOptions = [...options3];
    newOptions[index] = value;
    setOptions3(newOptions);
  };

  const handleSaveQuestion = async () => {
    if (!questionTitle) {
      showError('Please enter a question title');
      return;
    }

    if (!isEditMode && !audioFile) {
      showError('Please upload an audio file');
      return;
    }

    if (isEditMode) {
      if (audioFile) {
        await deleteFileFromS3(questions[0].audioUrl!);
      }
    }

    const audioUrl = await uploadFileToS3(audioFile!);

    const question1: QuestionCreateRequest = {
      title: questionTitle,
      questionType: QuestionType.PART_3_CONVERSATIONS,
      audioUrl: audioUrl,
      choiceA: options1[0],
      choiceB: options1[1],
      choiceC: options1[2],
      choiceD: options1[3],
      correctAnswer: indexToLetter(correctAnswer1Index),
    };

    const question2: QuestionCreateRequest = {
      title: questionTitle,
      questionType: QuestionType.PART_3_CONVERSATIONS,
      audioUrl: audioUrl,
      choiceA: options2[0],
      choiceB: options2[1],
      choiceC: options2[2],
      choiceD: options2[3],
      correctAnswer: indexToLetter(correctAnswer2Index),
    };

    const question3: QuestionCreateRequest = {
      title: questionTitle,
      questionType: QuestionType.PART_3_CONVERSATIONS,
      audioUrl: audioUrl,
      choiceA: options3[0],
      choiceB: options3[1],
      choiceC: options3[2],
      choiceD: options3[3],
      correctAnswer: indexToLetter(correctAnswer3Index),
    };

    saveMutation.mutate({
      courseId: courseId || '',
      exerciseId: exerciseId || '',
      questionData: [question1, question2, question3],
    });
  };

  const handleAddQuestion = async (data: {
    courseId: string;
    exerciseId: string;
    questionData: QuestionCreateRequest[];
  }) => {
    return addQuestions(data.courseId, data.exerciseId, data.questionData);
  };

  const handleUpdateQuestion = async (data: {
    courseId: string;
    exerciseId: string;
    questionData: QuestionCreateRequest[];
  }) => {
    return updateQuestions(data.courseId, data.exerciseId, data.questionData);
  };

  useEffect(() => {
    return () => {
      if (audioPreview && !audioPreview.startsWith('http')) {
        URL.revokeObjectURL(audioPreview);
      }
    };
  }, [audioPreview]);

  return (
    <>
      <div className="mb-10">
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

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Question 1</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Answer Options</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {[0, 1, 2, 3].map(index => (
                  <div
                    key={index}
                    className={`border rounded-md p-4 transition-colors ${
                      index === correctAnswer1Index
                        ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10'
                        : ''
                    }`}
                    onClick={() => setCorrectAnswer1Index(index)}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <RadioGroup
                        value={correctAnswer1Index.toString()}
                        onValueChange={value => {
                          setCorrectAnswer1Index(parseInt(value));
                        }}
                        className="flex"
                      >
                        <RadioGroupItem
                          value={index.toString()}
                          id={`q1-option-${OPTIONS_LETTERS[index]}`}
                          checked={index === correctAnswer1Index}
                        />
                      </RadioGroup>
                      <Label
                        htmlFor={`q1-option-${OPTIONS_LETTERS[index]}`}
                        className="flex items-center gap-2 font-medium cursor-pointer"
                      >
                        {OPTIONS_LETTERS[index]}
                        {index === correctAnswer1Index && (
                          <span className="text-xs text-green-600 font-normal">
                            (Correct)
                          </span>
                        )}
                      </Label>
                    </div>
                    <Input
                      id={`q1-option-${OPTIONS_LETTERS[index]}-text`}
                      placeholder={`Enter option ${OPTIONS_LETTERS[index]}`}
                      value={options1[index]}
                      onChange={e => handleOption1Change(index, e.target.value)}
                      onClick={e => e.stopPropagation()}
                      className={
                        index === correctAnswer1Index ? 'border-green-500' : ''
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Question 2</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Answer Options</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {[0, 1, 2, 3].map(index => (
                  <div
                    key={index}
                    className={`border rounded-md p-4 transition-colors ${
                      index === correctAnswer2Index
                        ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10'
                        : ''
                    }`}
                    onClick={() => setCorrectAnswer2Index(index)}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <RadioGroup
                        value={correctAnswer2Index.toString()}
                        onValueChange={value => {
                          setCorrectAnswer2Index(parseInt(value));
                        }}
                        className="flex"
                      >
                        <RadioGroupItem
                          value={index.toString()}
                          id={`q2-option-${OPTIONS_LETTERS[index]}`}
                          checked={index === correctAnswer2Index}
                        />
                      </RadioGroup>
                      <Label
                        htmlFor={`q2-option-${OPTIONS_LETTERS[index]}`}
                        className="flex items-center gap-2 font-medium cursor-pointer"
                      >
                        {OPTIONS_LETTERS[index]}
                        {index === correctAnswer2Index && (
                          <span className="text-xs text-green-600 font-normal">
                            (Correct)
                          </span>
                        )}
                      </Label>
                    </div>
                    <Input
                      id={`q2-option-${OPTIONS_LETTERS[index]}-text`}
                      placeholder={`Enter option ${OPTIONS_LETTERS[index]}`}
                      value={options2[index]}
                      onChange={e => handleOption2Change(index, e.target.value)}
                      onClick={e => e.stopPropagation()}
                      className={
                        index === correctAnswer2Index ? 'border-green-500' : ''
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Question 3</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Answer Options</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {[0, 1, 2, 3].map(index => (
                  <div
                    key={index}
                    className={`border rounded-md p-4 transition-colors ${
                      index === correctAnswer3Index
                        ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10'
                        : ''
                    }`}
                    onClick={() => setCorrectAnswer3Index(index)}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <RadioGroup
                        value={correctAnswer3Index.toString()}
                        onValueChange={value => {
                          setCorrectAnswer3Index(parseInt(value));
                        }}
                        className="flex"
                      >
                        <RadioGroupItem
                          value={index.toString()}
                          id={`q3-option-${OPTIONS_LETTERS[index]}`}
                          checked={index === correctAnswer3Index}
                        />
                      </RadioGroup>
                      <Label
                        htmlFor={`q3-option-${OPTIONS_LETTERS[index]}`}
                        className="flex items-center gap-2 font-medium cursor-pointer"
                      >
                        {OPTIONS_LETTERS[index]}
                        {index === correctAnswer3Index && (
                          <span className="text-xs text-green-600 font-normal">
                            (Correct)
                          </span>
                        )}
                      </Label>
                    </div>
                    <Input
                      id={`q3-option-${OPTIONS_LETTERS[index]}-text`}
                      placeholder={`Enter option ${OPTIONS_LETTERS[index]}`}
                      value={options3[index]}
                      onChange={e => handleOption3Change(index, e.target.value)}
                      onClick={e => e.stopPropagation()}
                      className={
                        index === correctAnswer3Index ? 'border-green-500' : ''
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
