import axiosInstance from './axiosInstance';
import { LessonCreateRequest, LessonResponse } from '@/types/lessonType';

export async function getAllLessons(): Promise<LessonResponse[]> {
  const response = await axiosInstance.get('/lessons');
  return response.data.result;
}

export async function createLesson(
  courseId: string,
  lesson: LessonCreateRequest
): Promise<LessonResponse> {
  const response = await axiosInstance.post(`/courses/${courseId}/lessons`, lesson);
  return response.data.result;
}
