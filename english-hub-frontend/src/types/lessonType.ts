export type LessonResponse = {
  id: string;
  title: string;
  content: string;
  duration: string;
};

export type LessonCreateRequest = {
  title: string;
  content: string;
  duration: number;
};
