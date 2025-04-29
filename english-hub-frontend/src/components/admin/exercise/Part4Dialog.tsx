import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  QuestionCreateRequest,
  QuestionResponse,
  QuestionType,
  QuestionUpdateRequest,
} from '@/types/questionType';
import { Spinner } from '@/components/Spinner';
import MediaUploader from '@/components/admin/MediaUploader';
import {
  addQuestionsToExercise,
  updateQuestionInExercise,
} from '@/services/exerciseService';
import { getAllQuestionByGroupId } from '@/services/questionService';
import { useParams } from 'react-router-dom';
import { showError, showSuccess } from '@/hooks/useToast';
import { isAxiosError } from 'axios';
import { indexToLetter, letterToIndex } from '@/utils/questionUtil';
import { deleteFileFromS3, uploadFileToS3 } from '@/services/s3Service';
import QuestionCard from '../QuestionCard';

type ExercisePart4DialogProps = {
  exerciseId?: string;
  question?: QuestionResponse;
};

export default function ExercisePart4Dialog({
  exerciseId,
  question,
}: ExercisePart4DialogProps) {
  const isEditMode = !!question;
  const { courseId } = useParams();
  const queryClient = useQueryClient();

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);

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
    if (isEditMode && question?.groupId) {
      setGroupId(question.groupId);
    }
  }, [isEditMode, question]);

  const groupQuestionsQuery = useQuery({
    queryKey: ['groupQuestions', groupId],
    queryFn: async () => {
      if (!isEditMode || !groupId || (!exerciseId && !examId)) return null;
      return getAllQuestionByGroupId(groupId);
    },
    enabled: !!isEditMode && !!groupId && (!!exerciseId || !!examId),
  });

  useEffect(() => {
    if (
      isEditMode &&
      groupQuestionsQuery.data &&
      groupQuestionsQuery.data.length === 3
    ) {
      const sortedQuestions = [...groupQuestionsQuery.data].sort((a, b) =>
        (a.title || '').localeCompare(b.title || '')
      );

      if (sortedQuestions[0].audioUrl) {
        setAudioPreview(sortedQuestions[0].audioUrl);
      }

      setTitle1(sortedQuestions[0].title || '');
      setTitle2(sortedQuestions[1].title || '');
      setTitle3(sortedQuestions[2].title || '');

      setOptions1([
        sortedQuestions[0].choiceA || '',
        sortedQuestions[0].choiceB || '',
        sortedQuestions[0].choiceC || '',
        sortedQuestions[0].choiceD || '',
      ]);
      if (sortedQuestions[0].correctAnswer) {
        setCorrectAnswer1Index(letterToIndex(sortedQuestions[0].correctAnswer));
      }

      setOptions2([
        sortedQuestions[1].choiceA || '',
        sortedQuestions[1].choiceB || '',
        sortedQuestions[1].choiceC || '',
        sortedQuestions[1].choiceD || '',
      ]);
      if (sortedQuestions[1].correctAnswer) {
        setCorrectAnswer2Index(letterToIndex(sortedQuestions[1].correctAnswer));
      }

      setOptions3([
        sortedQuestions[2].choiceA || '',
        sortedQuestions[2].choiceB || '',
        sortedQuestions[2].choiceC || '',
        sortedQuestions[2].choiceD || '',
      ]);
      if (sortedQuestions[2].correctAnswer) {
        setCorrectAnswer3Index(letterToIndex(sortedQuestions[2].correctAnswer));
      }
    }
  }, [isEditMode, groupQuestionsQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async (data: {
      courseId: string;
      exerciseId?: string;
      examId?: string;
      questionData: QuestionCreateRequest[];
    }) => {
      if (isEditMode && groupQuestionsQuery.data) {
        return handleUpdateQuestion(data);
      } else {
        return handleAddQuestion(data);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['questions', variables.exerciseId || variables.examId],
      });

      if (groupId) {
        queryClient.invalidateQueries({
          queryKey: ['groupQuestions', groupId],
        });
      }

      showSuccess(
        isEditMode
          ? 'Questions updated successfully'
          : 'Questions added successfully'
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
    if (audioPreview && !audioPreview.startsWith('http')) {
      URL.revokeObjectURL(audioPreview);
    }

    setAudioFile(null);
    setAudioPreview(null);

    setTitle1('');
    setTitle2('');
    setTitle3('');

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
    try {
      if (!title1 || !title2 || !title3) {
        showError('Please enter titles for all questions');
        return;
      }

      if (!isEditMode && !audioFile && !audioPreview) {
        showError('Please upload an audio file');
        return;
      }

      let audioUrl = audioPreview || '';

      if (audioFile) {
        if (isEditMode && audioPreview && audioPreview.startsWith('http')) {
          try {
            await deleteFileFromS3(audioPreview);
          } catch (error) {
            console.error('Failed to delete old audio file', error);
          }
        }

        audioUrl = await uploadFileToS3(audioFile);
      }

      const question1: QuestionCreateRequest = {
        title: title1,
        questionType: QuestionType.PART_4_TALKS,
        audioUrl: audioUrl,
        choiceA: options1[0],
        choiceB: options1[1],
        choiceC: options1[2],
        choiceD: options1[3],
        correctAnswer: indexToLetter(correctAnswer1Index),
      };

      const question2: QuestionCreateRequest = {
        title: title2,
        questionType: QuestionType.PART_4_TALKS,
        audioUrl: audioUrl,
        choiceA: options2[0],
        choiceB: options2[1],
        choiceC: options2[2],
        choiceD: options2[3],
        correctAnswer: indexToLetter(correctAnswer2Index),
      };

      const question3: QuestionCreateRequest = {
        title: title3,
        questionType: QuestionType.PART_4_TALKS,
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
        examId: examId || '',
        questionData: [question1, question2, question3],
      });
    } catch (error) {
      console.error('Error during save operation:', error);
      showError('Failed to save questions');
    }
  };

  const handleAddQuestion = async (data: {
    courseId: string;
    exerciseId?: string;
    examId?: string;
    questionData: QuestionCreateRequest[];
  }) => {
    return addQuestionsToExercise(
      data.courseId,
      data.exerciseId || data.examId || '',
      data.questionData
    );
  };

  const handleUpdateQuestion = async (data: {
    courseId: string;
    exerciseId?: string;
    examId?: string;
    questionData: QuestionUpdateRequest[];
  }) => {
    if (!groupQuestionsQuery.data || groupQuestionsQuery.data.length !== 3) {
      throw new Error('Cannot update: Missing question data');
    }

    const sortedQuestions = [...groupQuestionsQuery.data].sort((a, b) =>
      (a.title || '').localeCompare(b.title || '')
    );

    const updatedQuestions = [
      { ...data.questionData[0], id: sortedQuestions[0].id },
      { ...data.questionData[1], id: sortedQuestions[1].id },
      { ...data.questionData[2], id: sortedQuestions[2].id },
    ];

    const results = [];
    for (const question of updatedQuestions) {
      if (!question.id) {
        throw new Error('Missing question ID for update');
      }

      results.push(
        await updateQuestionInExercise(
          data.courseId,
          data.exerciseId || data.examId || '',
          question.id,
          question
        )
      );
    }

    return results;
  };

  useEffect(() => {
    return () => {
      if (audioPreview && !audioPreview.startsWith('http')) {
        URL.revokeObjectURL(audioPreview);
      }
    };
  }, [audioPreview]);

  if (isEditMode && groupQuestionsQuery.isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner />
        <span className="ml-2">Loading questions...</span>
      </div>
    );
  }

  if (isEditMode && groupQuestionsQuery.isError) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>Failed to load questions in this group.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => groupQuestionsQuery.refetch()}
        >
          Try Again
        </Button>
      </div>
    );
  }

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
        part="part4"
      />

      <QuestionCard
        title={title2}
        setTitle={setTitle2}
        options={options2}
        setOptions={setOptions2}
        correctAnswerIndex={correctAnswer2Index}
        setCorrectAnswerIndex={setCorrectAnswer2Index}
        part="part4"
      />

      <QuestionCard
        title={title3}
        setTitle={setTitle3}
        options={options3}
        setOptions={setOptions3}
        correctAnswerIndex={correctAnswer3Index}
        setCorrectAnswerIndex={setCorrectAnswer3Index}
        part="part4"
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
              {isEditMode ? 'Update Questions' : 'Save Questions'}
            </>
          )}
        </Button>
      </div>
    </>
  );
}
