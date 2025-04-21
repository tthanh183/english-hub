export type ExamResponse = {
  id: string;
  title: string;
  duration: number;
  createdDate: Date;
};

export type ExamCreateRequest = {
  title: string;
  duration: number;
};

export type ExamUpdateRequest = {
  title: string;
  duration: number;
};
