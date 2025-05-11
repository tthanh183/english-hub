import {
  FlashCardCreateRequest,
  FlashCardResponse,
  FlashCardUpdateRequest,
} from '@/types/flashCardType';
import axiosInstance from './axiosInstance';

export async function getAllFlashCards(
  deckId: string
): Promise<FlashCardResponse[]> {
  const response = await axiosInstance.get(`/decks/${deckId}/flashcards`);
  return response.data.result;
}
export async function getFlashCardById(
  deckId: string,
  flashCardId: string
): Promise<FlashCardResponse> {
  const response = await axiosInstance.get(
    `/decks/${deckId}/flashcards/${flashCardId}`
  );
  return response.data.result;
}

export async function createFlashCard(
  deckId: string,
  flashCardData: FlashCardCreateRequest
): Promise<FlashCardResponse> {
  const response = await axiosInstance.post(
    `/decks/${deckId}/flashcards`,
    flashCardData
  );
  return response.data.result;
}

export async function updateFlashCard(
  deckId: string,
  flashCardId: string,
  flashCardData: FlashCardUpdateRequest
): Promise<FlashCardResponse> {
  const response = await axiosInstance.put(
    `/decks/${deckId}/flashcards/${flashCardId}`,
    flashCardData
  );
  return response.data.result;
}

export async function deleteFlashCard(
  deckId: string,
  flashCardId: string
): Promise<string> {
  const response = await axiosInstance.delete(
    `/decks/${deckId}/flashcards/${flashCardId}`
  );
  return response.data.message;
}
