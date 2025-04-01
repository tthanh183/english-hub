import { CourseResponse } from '@/types/courseType';
import { create } from 'zustand';

type CourseState = {
  courses: CourseResponse[];
  setCourses: (courses: CourseResponse[]) => void;
  storeUpdateCourse: (updatedCourse: CourseResponse) => void;
  storeCreateCourse: (newCourse: CourseResponse) => void;
  storeDeleteCourse: (courseId: string) => void;
};

export const useCourseStore = create<CourseState>(set => ({
  courses: [],
  setCourses: courses => set({ courses }),
  storeUpdateCourse: (updatedCourse: CourseResponse) =>
    set(state => ({
      courses: state.courses.map(course =>
        course.id === updatedCourse.id ? updatedCourse : course
      ),
    })),
  storeCreateCourse: (newCourse: CourseResponse) =>
    set(state => ({
      courses: [...state.courses, newCourse],
    })),
  storeDeleteCourse: (courseId: string) =>
    set(state => ({
      courses: state.courses.filter(course => course.id !== courseId),
    })),
}));
