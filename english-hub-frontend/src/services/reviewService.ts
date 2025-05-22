import { FlashCardResponse } from '@/types/flashCardType';
import axiosInstance from './axiosInstance';

type ReviewRequest = {
  flashCardId: string;
  rating: number;
};

export async function getTodayReview(): Promise<FlashCardResponse[]> {  
  const response = await axiosInstance.get('/reviews/today');  
  return response.data.result;
}

export async function updateReview(review: ReviewRequest): Promise<void> {    
  await axiosInstance.post('/reviews', review);
}
