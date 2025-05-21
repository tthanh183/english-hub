import { FlashCardResponse } from '@/types/flashCardType';
import axiosInstance from './axiosInstance';

type ReviewRequest = {
  flashCardId: string;
  rating: number;
};

export async function getTodayReview(): Promise<FlashCardResponse[]> {  
  const response = await axiosInstance.get('/reviews/today');
  console.log('review', response.data.result);
  
  return response.data.result;
}

export async function updateReview(review: ReviewRequest): Promise<void> {  
  console.log('review', review);
  
  await axiosInstance.post('/reviews', review);
}
