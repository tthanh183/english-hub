export type ExerciseResponse = {
  id: string;
  title: string;
  questionNum: number;
};

export type ExerciseCreateRequest = {
  title: string;
  content: string;
  duration: number;
};

export type ExerciseUpdateRequest = {
  title?: string;
  content?: string;
  duration?: number;
};
