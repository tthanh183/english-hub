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
import { addQuestions, updateQuestions } from '@/services/exerciseService';
import { useParams } from 'react-router-dom';
import { showError, showSuccess } from '@/hooks/useToast';
import { isAxiosError } from 'axios';
import { indexToLetter, letterToIndex } from '@/utils/questionUtil';
import { deleteFileFromS3, uploadFileToS3 } from '@/services/s3Service';
import QuestionCard from './QuestionCard';

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

  const [title1, setTitle1] = useState('');
  const [title2, setTitle2] = useState('');
  const [title3, setTitle3] = useState('');

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

      <QuestionCard
        title={title1}
        setTitle={setTitle1}
        options={options1}
        setOptions={setOptions1}
        correctAnswerIndex={correctAnswer1Index}
        setCorrectAnswerIndex={setCorrectAnswer1Index}
        part="part1"
      />

      <QuestionCard
        title={title2}
        setTitle={setTitle2}
        options={options2}
        setOptions={setOptions2}
        correctAnswerIndex={correctAnswer2Index}
        setCorrectAnswerIndex={setCorrectAnswer2Index}
        part="part3"
      />

      <QuestionCard
        title={title3}
        setTitle={setTitle3}
        options={options3}
        setOptions={setOptions3}
        correctAnswerIndex={correctAnswer3Index}
        setCorrectAnswerIndex={setCorrectAnswer3Index}
        part="part3"
      />
      
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
