import axiosInstance from './axiosInstance';
import {
  LessonCreateRequest,
  LessonResponse,
  LessonUpdateRequest,
} from '@/types/lessonType';

export async function getAllLessons(
  courseId: string
): Promise<LessonResponse[]> {
  const response = await axiosInstance.get(`/courses/${courseId}/lessons`);
  return response.data.result;
}

export async function createLesson(
  courseId: string,
  lesson: LessonCreateRequest
): Promise<LessonResponse> {
  const response = await axiosInstance.post(
    `/courses/${courseId}/lessons`,
    lesson
  );
  return response.data.result;
}

export async function updateLesson(
  courseId: string,
  lessonId: string,
  lesson: LessonUpdateRequest
): Promise<LessonResponse> {
  const response = await axiosInstance.put(
    `/courses/${courseId}/lessons/${lessonId}`,
    lesson
  );
  return response.data.result;
}

export async function deleteLesson(
  courseId: string,
  lessonId: string
): Promise<string> {
  const response = await axiosInstance.delete(
    `/courses/${courseId}/lessons/${lessonId}`
  );
  return response.data.message;
}
