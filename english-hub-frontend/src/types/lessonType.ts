export type LessonResponse = {
  id: string;
  title: string;
  content: string;
  duration: number;
  createdDate: Date;
};

export type LessonCreateRequest = {
  title: string;
  content: string;
  duration: number;
};

export type LessonUpdateRequest = {
  title?: string;
  content?: string;
  duration?: number;
};
