import { ExerciseCreateRequest, ExerciseResponse } from '@/types/exerciseType';
import axiosInstance from './axiosInstance';
import { QuestionCreateRequest, QuestionResponse } from '@/types/questionType';

export async function getAllExercises(
  courseId: string
): Promise<ExerciseResponse[]> {
  const response = await axiosInstance.get(`/courses/${courseId}/exercises`);
  return response.data.result;
}

export async function createExercise(
  courseId: string,
  exercise: ExerciseCreateRequest
): Promise<ExerciseResponse> {
  const response = await axiosInstance.post(
    `/courses/${courseId}/exercises`,
    exercise
  );
  return response.data.result;
}

export async function updateExercise(
  courseId: string,
  exerciseId: string,
  exercise: ExerciseCreateRequest
): Promise<ExerciseResponse> {
  const response = await axiosInstance.put(
    `/courses/${courseId}/exercises/${exerciseId}`,
    exercise
  );
  return response.data.result;
}

export async function deleteExercise(
  courseId: string,
  exerciseId: string
): Promise<string> {
  const response = await axiosInstance.delete(
    `/courses/${courseId}/exercises/${exerciseId}`
  );
  return response.data.message;
}

export async function addQuestion(
  courseId: string,
  exerciseId: string,
  question: QuestionCreateRequest
): Promise<QuestionResponse> {
  const formData = new FormData();
  formData.append('title', question.title);
  formData.append('questionType', question.questionType);
  if (question.image) {
    formData.append('image', question.image);
  }
  if (question.audio) {
    formData.append('audio', question.audio);
  }
  formData.append('choiceA', question.choiceA);
  formData.append('choiceB', question.choiceB);
  formData.append('choiceC', question.choiceC);
  if (question.choiceD) {
    formData.append('choiceD', question.choiceD);
  }
  formData.append('correctAnswer', question.correctAnswer);

  const response = await axiosInstance.post(
    `/courses/${courseId}/exercises/${exerciseId}/questions`,
    formData
  );
  return response.data.result;
}

export async function getQuestionsFromExercise(
  courseId: string,
  exerciseId: string
): Promise<QuestionResponse[]> {
  const response = await axiosInstance.get(
    `/courses/${courseId}/exercises/${exerciseId}/questions`
  );
  return response.data.result;
}
