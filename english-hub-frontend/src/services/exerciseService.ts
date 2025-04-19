import { ExerciseCreateRequest, ExerciseResponse } from '@/types/exerciseType';
import axiosInstance from './axiosInstance';
import {
  QuestionCreateRequest,
  QuestionGroupResponse,
  QuestionResponse,
  QuestionUpdateRequest,
} from '@/types/questionType';

export async function getAllExercises(
  courseId: string
): Promise<ExerciseResponse[]> {
  const response = await axiosInstance.get(`/courses/${courseId}/exercises`);
  return response.data.result;
}

export async function getExerciseById(
  courseId: string,
  exerciseId: string
): Promise<ExerciseResponse> {
  const response = await axiosInstance.get(
    `/courses/${courseId}/exercises/${exerciseId}`
  );
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
  const response = await axiosInstance.post(
    `/courses/${courseId}/exercises/${exerciseId}/question`,
    question
  );
  return response.data.result;
}

export async function updateQuestion(
  courseId: string,
  exerciseId: string,
  questionId: string,
  question: QuestionUpdateRequest
): Promise<QuestionResponse> {
  console.log('updateQuestion', question);

  const response = await axiosInstance.put(
    `/courses/${courseId}/exercises/${exerciseId}/questions/${questionId}`,
    question
  );
  return response.data.result;
}

export async function addQuestions(
  courseId: string,
  exerciseId: string,
  questions: QuestionCreateRequest[]
): Promise<QuestionResponse[]> {
  const response = await axiosInstance.post(
    `/courses/${courseId}/exercises/${exerciseId}/questions`,
    questions
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

export async function getQuestionGroupsFromExercise(
  courseId: string,
  exerciseId: string
): Promise<QuestionGroupResponse[]> {
  const response = await axiosInstance.get(
    `/courses/${courseId}/exercises/${exerciseId}/questions/groups`
  );
  console.log('getQuestionGroupsFromExercise', response.data.result);

  return response.data.result;
}
