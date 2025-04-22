import {
  ExamCreateRequest,
  ExamResponse,
  ExamUpdateRequest,
} from '@/types/examType';
import axiosInstance from './axiosInstance';
import { QuestionResponse } from '@/types/questionType';

export async function getAllExams(): Promise<ExamResponse[]> {
  const response = await axiosInstance.get('/exams');
  return response.data.result;
}

export async function getExamById(examId: string): Promise<ExamResponse> {
  const response = await axiosInstance.get(`/exams/${examId}`);
  return response.data.result;
}

export async function createExam(
  exam: ExamCreateRequest
): Promise<ExamResponse> {
  const response = await axiosInstance.post('/exams', exam);
  return response.data.result;
}

export async function updateExam(
  examId: string,
  exam: ExamUpdateRequest
): Promise<ExamResponse> {
  const response = await axiosInstance.put(`/exams/${examId}`, exam);
  return response.data.result;
}

export async function deleteExam(examId: string): Promise<string> {
  const response = await axiosInstance.delete(`/exams/${examId}`);
  return response.data.message;
}

export async function getQuestionsFromExam(
  examId: string
): Promise<QuestionResponse[]> {
  const response = await axiosInstance.get(`/exams/${examId}/questions`);
  return response.data.result;
}
