export type ExerciseResponse = {
  id: string;
  title: string;
  questionNum: number;
  createdDate: Date;
};

export type ExerciseCreateRequest = {
  title: string;
};

export type ExerciseUpdateRequest = {
  title: string;
};
