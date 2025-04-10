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

export async function getCourseById(courseId: string): Promise<CourseResponse> {
  const response = await axiosInstance.get(`/courses/${courseId}`);
  return response.data.result;
}

export async function createCourse(
  course: CourseCreateRequest
): Promise<CourseResponse> {
  const formData = new FormData();
  formData.append('title', course.title);
  formData.append('description', course.description);
  if (course.image) {
    formData.append('image', course.image);
  }

  const response = await axiosInstance.post('/courses', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.result;
}

export async function updateCourse(
  courseId: string,
  course: CourseUpdateRequest
): Promise<CourseResponse> {
  const formData = new FormData();
  formData.append('title', course.title);
  formData.append('description', course.description);
  if (course.image) {
    formData.append('image', course.image);
  }

  const response = await axiosInstance.put(`/courses/${courseId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.result;
}

export async function deleteCourse(courseId: string): Promise<string> {
  const response = await axiosInstance.delete(`/courses/${courseId}`);
  return response.data.message;
}
