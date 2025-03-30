export type CourseResponse = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CourseCreateRequest = {
  title: string;
  description: string;
  imageUrl: string;
};
