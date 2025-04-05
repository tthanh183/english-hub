import { ExerciseCreateRequest, ExerciseResponse } from '@/types/exerciseType';
import axiosInstance from './axiosInstance';

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

export async function deleteExercise(
  courseId: string,
  exerciseId: string
): Promise<string> {
  const response = await axiosInstance.delete(
    `/courses/${courseId}/exercises/${exerciseId}`
  );
  return response.data.message;
}
