import { CourseCreateRequest, CourseResponse } from '@/types/courseType';
import axiosInstance from './axiosInstance';

export async function getAllCourses(): Promise<CourseResponse[]> {
  const response = await axiosInstance.get('/courses');
  return response.data.result;
}

export async function createCourse(
  course: CourseCreateRequest
): Promise<CourseResponse> {
  console.log('Creating course:', course);

  const response = await axiosInstance.post('/courses', course);
  return response.data.result;
}
