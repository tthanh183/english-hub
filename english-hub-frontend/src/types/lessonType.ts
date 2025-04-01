export type LessonResponse = {
  id: string;
  title: string;
  content: string;
  duration: number;
};

export type LessonCreateRequest = {
  title: string;
  content: string;
  duration: number;
};
