import { QuestionResponse } from '@/types/questionType';
import axiosInstance from './axiosInstance';

export async function getAllQuestionByGroupId(
  groupId: string
): Promise<QuestionResponse[]> {
  const response = await axiosInstance.get(`/questions/group/${groupId}`);
  console.log(response.data.result);
  
  return response.data.result;
}
