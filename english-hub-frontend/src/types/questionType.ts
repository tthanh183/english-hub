export enum QuestionType {
  PART_1_PHOTOGRAPHS = 'PART_1_PHOTOGRAPHS',
  PART_2_QUESTION_RESPONSES = 'PART_2_QUESTION_RESPONSES',
  PART_3_CONVERSATIONS = 'PART_3_CONVERSATIONS',
  PART_4_TALKS = 'PART_4_TALKS',
  PART_5_INCOMPLETE_SENTENCES = 'PART_5_INCOMPLETE_SENTENCES',
  PART_6_TEXT_COMPLETION = 'PART_6_TEXT_COMPLETION',
  PART_7_READING_COMPREHENSION = 'PART_7_READING_COMPREHENSION',
}

export const QUESTION_TYPE_DISPLAY = {
  [QuestionType.PART_1_PHOTOGRAPHS]: 'Part 1: Photographs',
  [QuestionType.PART_2_QUESTION_RESPONSES]: 'Part 2: Questions & Responses',
  [QuestionType.PART_3_CONVERSATIONS]: 'Part 3: Conversations',
  [QuestionType.PART_4_TALKS]: 'Part 4: Talks',
  [QuestionType.PART_5_INCOMPLETE_SENTENCES]: 'Part 5: Incomplete Sentences',
  [QuestionType.PART_6_TEXT_COMPLETION]: 'Part 6: Text Completion',
  [QuestionType.PART_7_READING_COMPREHENSION]: 'Part 7: Reading Comprehension',
};

export type QuestionCreateRequest = {
  title: string;
  questionType: QuestionType;
  audioUrl: string;
  imageUrl: string;
  passage?: string;
  choiceA: string;
  choiceB: string;
  choiceC: string;
  choiceD?: string;
  correctAnswer: string;
};

export type QuestionUpdateRequest = {
  title: string;
  questionType: QuestionType;
  audio?: File | null;
  image?: File | null;
  passage?: string;
  choiceA: string;
  choiceB: string;
  choiceC: string;
  choiceD?: string;
  correctAnswer: string;
};

export type QuestionResponse = {
  id: string;
  title: string;
  questionType: QuestionType;
  audioUrl?: string;
  imageUrl?: string;
  passage?: string;
  choiceA?: string;
  choiceB?: string;
  choiceC?: string;
  choiceD?: string;
  correctAnswer: string;
};
