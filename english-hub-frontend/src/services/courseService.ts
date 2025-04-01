import {
  CourseCreateRequest,
  CourseResponse,
  CourseUpdateRequest,
} from '@/types/courseType';
import axiosInstance from './axiosInstance';

export async function getAllCourses(): Promise<CourseResponse[]> {
  const response = await axiosInstance.get('/courses');
  return response.data.result;
}

export async function createCourse(
  course: CourseCreateRequest
): Promise<CourseResponse> {
  const response = await axiosInstance.post('/courses', course);
  return response.data.result;
}

export async function updateCourse(
  courseId: string,
  course: CourseUpdateRequest
): Promise<CourseResponse> {
  const response = await axiosInstance.put(`/courses/${courseId}`, course);
  return response.data.result;
}

export async function deleteCourse(courseId: string): Promise<string> {
  const response = await axiosInstance.delete(`/courses/${courseId}`);
  return response.data.result;
}
