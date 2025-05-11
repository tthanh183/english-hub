import {
  DeckCreateRequest,
  DeckResponse,
  DeckUpdateRequest,
} from '@/types/deckType';
import axiosInstance from './axiosInstance';

export async function getAllDecks(): Promise<DeckResponse[]> {
  const response = await axiosInstance.get('/decks');
  return response.data.result;
}

export async function getDeckById(deckId: string): Promise<DeckResponse> {
  const response = await axiosInstance.get(`/decks/${deckId}`);
  return response.data.result;
}

export async function createDeck(
  deckData: DeckCreateRequest
): Promise<DeckResponse> {
  const response = await axiosInstance.post('/decks', deckData);
  return response.data.result;
}

export async function updateDeck(
  deckId: string,
  deckData: DeckUpdateRequest
): Promise<DeckResponse> {
  const response = await axiosInstance.put(`/decks/${deckId}`, deckData);
  return response.data.result;
}

export async function deleteDeck(deckId: string): Promise<string> {
  const response = await axiosInstance.delete(`/decks/${deckId}`);
  return response.data.message;
}
