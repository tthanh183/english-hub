export type CourseResponse = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdDate: Date;
  updatedDate: Date;
};

export type CourseCreateRequest = {
  title: string;
  description: string;
  imageUrl: string;
};

export type CourseUpdateRequest = {
  title: string;
  description: string;
  imageUrl: string;
};
