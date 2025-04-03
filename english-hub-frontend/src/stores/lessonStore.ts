import { LessonResponse } from '@/types/lessonType';
import { create } from 'zustand';

type LessonState = {
  lessons: LessonResponse[];
  setLessons: (lessons: LessonResponse[]) => void;
  storeUpdateLesson: (updatedLesson: LessonResponse) => void;
  storeCreateLesson: (newLesson: LessonResponse) => void;
  storeDeleteLesson: (id: string) => void;
};

export const useLessonStore = create<LessonState>(set => ({
  lessons: [],
  setLessons: lessons => set({ lessons }),
  storeUpdateLesson: (updatedLesson: LessonResponse) =>
    set(state => ({
      lessons: state.lessons.map(lesson =>
        lesson.id === updatedLesson.id ? updatedLesson : lesson
      ),
    })),
  storeCreateLesson: (newLesson: LessonResponse) =>
    set(state => ({
      lessons: [...state.lessons, newLesson],
    })),
  storeDeleteLesson: (id: string) =>
    set(state => ({
      lessons: state.lessons.filter(lesson => lesson.id !== id),
    })),
}));
