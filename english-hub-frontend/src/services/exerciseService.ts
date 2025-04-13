import { ExerciseCreateRequest, ExerciseResponse } from '@/types/exerciseType';
import axiosInstance from './axiosInstance';
import {
  QuestionCreateRequest,
  QuestionResponse,
  QuestionUpdateRequest,
} from '@/types/questionType';

export async function getAllExercises(
  courseId: string
): Promise<ExerciseResponse[]> {
  const response = await axiosInstance.get(`/courses/${courseId}/exercises`);
  return response.data.result;
}

export async function createExercise(
  courseId: string,
  exercise: ExerciseCreateRequest
): Promise<ExerciseResponse> {
  const response = await axiosInstance.post(
    `/courses/${courseId}/exercises`,
    exercise
  );
  return response.data.result;
}

export async function updateExercise(
  courseId: string,
  exerciseId: string,
  exercise: ExerciseCreateRequest
): Promise<ExerciseResponse> {
  const response = await axiosInstance.put(
    `/courses/${courseId}/exercises/${exerciseId}`,
    exercise
  );
  return response.data.result;
}

export async function deleteExercise(
  courseId: string,
  exerciseId: string
): Promise<string> {
  const response = await axiosInstance.delete(
    `/courses/${courseId}/exercises/${exerciseId}`
  );
  return response.data.message;
}

export async function addQuestion(
  courseId: string,
  exerciseId: string,
  question: QuestionCreateRequest
): Promise<QuestionResponse> {
  const response = await axiosInstance.post(
    `/courses/${courseId}/exercises/${exerciseId}/question`,
    question
  );
  return response.data.result;
}

// export async function addQuestions(
//   courseId: string,
//   exerciseId: string,
//   questions: QuestionCreateRequest[]
// ): Promise<QuestionResponse[]> {
//   const formData = new FormData();

//   questions.forEach((question, index) => {
//     formData.append(`questions[${index}].title`, question.title);
//     formData.append(`questions[${index}].questionType`, question.questionType);
//     formData.append(`questions[${index}].choiceA`, question.choiceA);
//     formData.append(`questions[${index}].choiceB`, question.choiceB);
//     formData.append(`questions[${index}].choiceC`, question.choiceC);
//     formData.append(`questions[${index}].choiceD`, question.choiceD ?? '');
//     formData.append(
//       `questions[${index}].correctAnswer`,
//       question.correctAnswer
//     );
//     if (question.audio) {
//       formData.append(`questions[${index}].audio`, question.audio);
//     }
//     if (question.image) {
//       formData.append(`questions[${index}].image`, question.image);
//     }
//     if (question.passage) {
//       formData.append(`questions[${index}].passage`, question.passage);
//     }
//   });

//   const response = await axiosInstance.post(
//     `/courses/${courseId}/exercises/${exerciseId}/questions`,
//     formData
//   );
//   return response.data.result;
// }

export async function updateQuestion(
  courseId: string,
  exerciseId: string,
  questionId: string,
  question: QuestionUpdateRequest
): Promise<QuestionResponse> {
  console.log('updateQuestion', question);
  
  const response = await axiosInstance.put(
    `/courses/${courseId}/exercises/${exerciseId}/questions/${questionId}`,
    question
  );
  return response.data.result;
}

export async function getQuestionsFromExercise(
  courseId: string,
  exerciseId: string
): Promise<QuestionResponse[]> {
  const response = await axiosInstance.get(
    `/courses/${courseId}/exercises/${exerciseId}/questions`
  );
  return response.data.result;
}
