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
import { indexToLetter, letterToIndex } from '@/utils/questionUtil';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const OPTIONS_LETTERS = ['A', 'B', 'C', 'D'];

type Part3DialogProps = {
  exerciseId?: string;
  questionTitle: string;
  question?: QuestionResponse;
};

export default function Part3Dialog({
  exerciseId,
  questionTitle,
  question,
}: Part3DialogProps) {
  const isEditMode = !!question;
  const { courseId } = useParams();
  const queryClient = useQueryClient();

  // Audio state
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(
    question?.audioUrl || null
  );

  // Question 1
  const [question1, setQuestion1] = useState(question?.question1Text || '');
  const [options1, setOptions1] = useState<string[]>([
    question?.question1OptionA || '',
    question?.question1OptionB || '',
    question?.question1OptionC || '',
    question?.question1OptionD || '',
  ]);
  const [correctAnswer1, setCorrectAnswer1] = useState<number>(
    question?.question1CorrectAnswer
      ? letterToIndex(question.question1CorrectAnswer)
      : 0
  );

  // Question 2
  const [question2, setQuestion2] = useState(question?.title || '');
  const [options2, setOptions2] = useState<string[]>([
    question?.choiceA || '',
    question?.question2OptionB || '',
    question?.question2OptionC || '',
    question?.question2OptionD || '',
  ]);
  const [correctAnswer2, setCorrectAnswer2] = useState<number>(
    question?.question2CorrectAnswer
      ? letterToIndex(question.question2CorrectAnswer)
      : 0
  );

  // Question 3
  const [question3, setQuestion3] = useState(question?.question3Text || '');
  const [options3, setOptions3] = useState<string[]>([
    question?.question3OptionA || '',
    question?.question3OptionB || '',
    question?.question3OptionC || '',
    question?.question3OptionD || '',
  ]);
  const [correctAnswer3, setCorrectAnswer3] = useState<number>(
    question?.question3CorrectAnswer
      ? letterToIndex(question.question3CorrectAnswer)
      : 0
  );

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
    setAudioFile(null);
    setAudioPreview(null);

    setQuestion1('');
    setOptions1(['', '', '', '']);
    setCorrectAnswer1(0);

    setQuestion2('');
    setOptions2(['', '', '', '']);
    setCorrectAnswer2(0);

    setQuestion3('');
    setOptions3(['', '', '', '']);
    setCorrectAnswer3(0);
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

  const handleSaveQuestion = () => {
    if (!questionTitle) {
      showError('Please enter a question title');
      return;
    }

    if (!isEditMode && !audioFile) {
      showError('Please upload an audio file');
      return;
    }

    if (!question1 || !question2 || !question3) {
      showError('Please enter all question texts');
      return;
    }

    // Check all options are filled for each question
    if (options1.some(opt => !opt.trim())) {
      showError('Please fill all options for Question 1');
      return;
    }

    if (options2.some(opt => !opt.trim())) {
      showError('Please fill all options for Question 2');
      return;
    }

    if (options3.some(opt => !opt.trim())) {
      showError('Please fill all options for Question 3');
      return;
    }

    const questionData: QuestionCreateRequest = {
      title: questionTitle,
      questionType: QuestionType.PART_3_CONVERSATIONS,
      audio: audioFile,

      // Question 1
      question1Text: question1,
      question1OptionA: options1[0],
      question1OptionB: options1[1],
      question1OptionC: options1[2],
      question1OptionD: options1[3],
      question1CorrectAnswer: indexToLetter(correctAnswer1),

      // Question 2
      question2Text: question2,
      question2OptionA: options2[0],
      question2OptionB: options2[1],
      question2OptionC: options2[2],
      question2OptionD: options2[3],
      question2CorrectAnswer: indexToLetter(correctAnswer2),

      // Question 3
      question3Text: question3,
      question3OptionA: options3[0],
      question3OptionB: options3[1],
      question3OptionC: options3[2],
      question3OptionD: options3[3],
      question3CorrectAnswer: indexToLetter(correctAnswer3),
    };

    saveMutation.mutate({
      courseId: courseId || '',
      exerciseId: exerciseId || '',
      questionData,
    });
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
      <div className="grid grid-cols-1 gap-6">
        <MediaUploader
          type="audio"
          value={audioPreview}
          onChange={handleAudioChange}
          onClear={handleAudioClear}
          label="Audio Conversation"
        />
      </div>

      {/* Question 1 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Question 1</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="question1">Question Text</Label>
              <Input
                id="question1"
                value={question1}
                onChange={e => setQuestion1(e.target.value)}
                placeholder="Enter question 1"
                className="mt-2"
              />
            </div>

            <div>
              <Label>Answer Options</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {[0, 1, 2, 3].map(index => (
                  <div
                    key={index}
                    className={`border rounded-md p-4 transition-colors ${
                      index === correctAnswer1
                        ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10'
                        : ''
                    }`}
                    onClick={() => setCorrectAnswer1(index)}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <RadioGroup
                        value={correctAnswer1.toString()}
                        onValueChange={value => {
                          setCorrectAnswer1(parseInt(value));
                        }}
                        className="flex"
                      >
                        <RadioGroupItem
                          value={index.toString()}
                          id={`q1-option-${OPTIONS_LETTERS[index]}`}
                          checked={index === correctAnswer1}
                        />
                      </RadioGroup>
                      <Label
                        htmlFor={`q1-option-${OPTIONS_LETTERS[index]}`}
                        className="flex items-center gap-2 font-medium cursor-pointer"
                      >
                        {OPTIONS_LETTERS[index]}
                        {index === correctAnswer1 && (
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
                        index === correctAnswer1 ? 'border-green-500' : ''
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question 2 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Question 2</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="question2">Question Text</Label>
              <Input
                id="question2"
                value={question2}
                onChange={e => setQuestion2(e.target.value)}
                placeholder="Enter question 2"
                className="mt-2"
              />
            </div>

            <div>
              <Label>Answer Options</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {[0, 1, 2, 3].map(index => (
                  <div
                    key={index}
                    className={`border rounded-md p-4 transition-colors ${
                      index === correctAnswer2
                        ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10'
                        : ''
                    }`}
                    onClick={() => setCorrectAnswer2(index)}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <RadioGroup
                        value={correctAnswer2.toString()}
                        onValueChange={value => {
                          setCorrectAnswer2(parseInt(value));
                        }}
                        className="flex"
                      >
                        <RadioGroupItem
                          value={index.toString()}
                          id={`q2-option-${OPTIONS_LETTERS[index]}`}
                          checked={index === correctAnswer2}
                        />
                      </RadioGroup>
                      <Label
                        htmlFor={`q2-option-${OPTIONS_LETTERS[index]}`}
                        className="flex items-center gap-2 font-medium cursor-pointer"
                      >
                        {OPTIONS_LETTERS[index]}
                        {index === correctAnswer2 && (
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
                        index === correctAnswer2 ? 'border-green-500' : ''
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question 3 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Question 3</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="question3">Question Text</Label>
              <Input
                id="question3"
                value={question3}
                onChange={e => setQuestion3(e.target.value)}
                placeholder="Enter question 3"
                className="mt-2"
              />
            </div>

            <div>
              <Label>Answer Options</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {[0, 1, 2, 3].map(index => (
                  <div
                    key={index}
                    className={`border rounded-md p-4 transition-colors ${
                      index === correctAnswer3
                        ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10'
                        : ''
                    }`}
                    onClick={() => setCorrectAnswer3(index)}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <RadioGroup
                        value={correctAnswer3.toString()}
                        onValueChange={value => {
                          setCorrectAnswer3(parseInt(value));
                        }}
                        className="flex"
                      >
                        <RadioGroupItem
                          value={index.toString()}
                          id={`q3-option-${OPTIONS_LETTERS[index]}`}
                          checked={index === correctAnswer3}
                        />
                      </RadioGroup>
                      <Label
                        htmlFor={`q3-option-${OPTIONS_LETTERS[index]}`}
                        className="flex items-center gap-2 font-medium cursor-pointer"
                      >
                        {OPTIONS_LETTERS[index]}
                        {index === correctAnswer3 && (
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
                        index === correctAnswer3 ? 'border-green-500' : ''
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
