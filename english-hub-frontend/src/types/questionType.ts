export enum QuestionType {
  PART_1_PHOTOGRAPHS = 'Part 1: Photographs',
  PART_2_QUESTIONS_RESPONSES = 'Part 2: Questions-Responses',
  PART_3_CONVERSATIONS = 'Part 3: Conversations',
  PART_4_TALKS = 'Part 4: Talks',
  PART_5_INCOMPLETE_SENTENCES = 'Part 5: Incomplete Sentences',
  PART_6_TEXT_COMPLETION = 'Part 6: Text Completion',
  PART_7_READING_COMPREHENSION = 'Part 7: Reading Comprehension',
}

export type QuestionCreateRequest = {
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
  audio?: string;
  image?: string;
  passage?: string;
  choiceA?: string;
  choiceB?: string;
  choiceC?: string;
  choiceD?: string;
  correctAnswer: string;
};
