import { Button } from '@/components/ui/button';
import { useParams } from 'react-router-dom';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  QuestionCreateRequest,
  QuestionResponse,
  QuestionType,
  QuestionUpdateRequest,
} from '@/types/questionType';
import { Spinner } from '../Spinner';
import MediaUploader from '@/components/admin/MediaUploader';
import {
  addQuestionsToExercise,
  updateQuestionInExercise,
} from '@/services/exerciseService';
import {
  addQuestionsToExam,
  updateQuestionInExam,
} from '@/services/examService';
import { showError, showSuccess } from '@/hooks/useToast';
import { isAxiosError } from 'axios';
import { indexToLetter, letterToIndex } from '@/utils/questionUtil';
import { deleteFileFromS3, uploadFileToS3 } from '@/services/s3Service';
import QuestionCard from './QuestionCard';
import { getAllQuestionByGroupId } from '@/services/questionService';

type Part3DialogProps = {
  exerciseId?: string;
  examId?: string;
  question?: QuestionResponse;
};

export default function Part3Dialog({
  exerciseId,
  examId,
  question,
}: Part3DialogProps) {
  const isEditMode = !!question;
  const queryClient = useQueryClient();

  const { courseId } = useParams();

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [title1, setTitle1] = useState('');
  const [title2, setTitle2] = useState('');
  const [title3, setTitle3] = useState('');

  const [options1, setOptions1] = useState<string[]>(['', '', '', '']);
  const [correctAnswer1Index, setCorrectAnswer1Index] = useState<number>(0);

  const [options2, setOptions2] = useState<string[]>(['', '', '', '']);
  const [correctAnswer2Index, setCorrectAnswer2Index] = useState<number>(0);

  const [options3, setOptions3] = useState<string[]>(['', '', '', '']);
  const [correctAnswer3Index, setCorrectAnswer3Index] = useState<number>(0);

  const [groupQuestions, setGroupQuestions] = useState<QuestionResponse[]>([]);

  useEffect(() => {
    const fetchGroupQuestions = async () => {
      if (isEditMode && question?.groupId) {
        try {
          const questions = await getAllQuestionByGroupId(question.groupId);
          setGroupQuestions(questions);

          if (questions.length >= 3) {
            setAudioPreview(questions[0].audioUrl || null);
            setImagePreview(questions[0].imageUrl || null);

            setTitle1(questions[0].title || '');
            setOptions1([
              questions[0].choiceA || '',
              questions[0].choiceB || '',
              questions[0].choiceC || '',
              questions[0].choiceD || '',
            ]);
            setCorrectAnswer1Index(
              questions[0].correctAnswer
                ? letterToIndex(questions[0].correctAnswer)
                : 0
            );

            setTitle2(questions[1].title || '');
            setOptions2([
              questions[1].choiceA || '',
              questions[1].choiceB || '',
              questions[1].choiceC || '',
              questions[1].choiceD || '',
            ]);
            setCorrectAnswer2Index(
              questions[1].correctAnswer
                ? letterToIndex(questions[1].correctAnswer)
                : 0
            );

            setTitle3(questions[2].title || '');
            setOptions3([
              questions[2].choiceA || '',
              questions[2].choiceB || '',
              questions[2].choiceC || '',
              questions[2].choiceD || '',
            ]);
            setCorrectAnswer3Index(
              questions[2].correctAnswer
                ? letterToIndex(questions[2].correctAnswer)
                : 0
            );
          }
        } catch (error) {
          console.error('Failed to fetch group questions:', error);
        }
      }
    };

    fetchGroupQuestions();
  }, [isEditMode, question]);

  const saveMutation = useMutation({
    mutationFn: async (data: {
      courseId: string;
      exerciseId?: string;
      examId?: string;
      questionData: QuestionCreateRequest[] | QuestionUpdateRequest;
    }) => {
      if (isEditMode && question) {
        if (data.exerciseId) {
          return updateQuestionInExercise(
            data.courseId,
            data.exerciseId,
            question.id,
            data.questionData as QuestionUpdateRequest
          );
        } else if (data.examId) {
          return updateQuestionInExam(
            data.examId,
            question.id,
            data.questionData as QuestionUpdateRequest
          );
        }
      } else {
        if (data.exerciseId) {
          return addQuestionsToExercise(
            data.courseId,
            data.exerciseId,
            data.questionData as QuestionCreateRequest[]
          );
        } else if (data.examId) {
          return addQuestionsToExam(
            data.examId,
            data.questionData as QuestionCreateRequest[]
          );
        }
      }
      throw new Error(
        'Invalid parameters: Either exerciseId + courseId or examId must be provided.'
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['questions', variables.exerciseId || variables.examId],
      });

      showSuccess(
        isEditMode
          ? 'Question updated successfully'
          : 'Questions added successfully'
      );

      resetContentState();
    },
    onError: error => {
      if (isAxiosError(error)) {
        showError(error.response?.data.message);
      } else {
        showError('Something went wrong');
        console.log(error);
      }
    },
  });

  const resetContentState = () => {
    if (audioPreview && !audioPreview.startsWith('http')) {
      URL.revokeObjectURL(audioPreview);
    }
    if (imagePreview && !imagePreview.startsWith('http')) {
      URL.revokeObjectURL(imagePreview);
    }

    setAudioFile(null);
    setAudioPreview(null);
    setImageFile(null);
    setImagePreview(null);

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
      let imageUrl = imagePreview || '';

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

      if (imageFile) {
        if (isEditMode && imagePreview && imagePreview.startsWith('http')) {
          try {
            await deleteFileFromS3(imagePreview);
          } catch (error) {
            console.error('Failed to delete old image file', error);
          }
        }
        imageUrl = await uploadFileToS3(imageFile);
      }

      const question1: QuestionCreateRequest = {
        title: title1,
        questionType: QuestionType.PART_3_CONVERSATIONS,
        audioUrl: audioUrl,
        imageUrl: imageUrl,
        choiceA: options1[0],
        choiceB: options1[1],
        choiceC: options1[2],
        choiceD: options1[3],
        correctAnswer: indexToLetter(correctAnswer1Index),
      };

      const question2: QuestionCreateRequest = {
        title: title2,
        questionType: QuestionType.PART_3_CONVERSATIONS,
        audioUrl: audioUrl,
        imageUrl: imageUrl,
        choiceA: options2[0],
        choiceB: options2[1],
        choiceC: options2[2],
        choiceD: options2[3],
        correctAnswer: indexToLetter(correctAnswer2Index),
      };

      const question3: QuestionCreateRequest = {
        title: title3,
        questionType: QuestionType.PART_3_CONVERSATIONS,
        audioUrl: audioUrl,
        imageUrl: imageUrl,
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

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <MediaUploader
          type="image"
          value={imagePreview}
          onChange={handleImageChange}
          onClear={handleImageClear}
          label="Image File"
        />
        <MediaUploader
          type="audio"
          value={audioPreview}
          onChange={handleAudioChange}
          onClear={handleAudioClear}
          label="Audio File"
        />
      </div>

      <QuestionCard
        title={title1}
        setTitle={setTitle1}
        options={options1}
        setOptions={setOptions1}
        correctAnswerIndex={correctAnswer1Index}
        setCorrectAnswerIndex={setCorrectAnswer1Index}
        part="part3"
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
              {isEditMode ? 'Update Questions' : 'Save Questions'}
            </>
          )}
        </Button>
      </div>
    </>
  );
}
