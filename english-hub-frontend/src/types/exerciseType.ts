export type ExerciseResponse = {
  id: string;
  title: string;
  questionNum: number;
};

export type ExerciseCreateRequest = {
  title: string;
};

export type ExerciseUpdateRequest = {
  title: string;
};
