export type FlashCardResponse = {
  id: string;
  word: string;
  meaning: string;
};

export type FlashCardCreateRequest = {
  word: string;
  meaning: string;
};

export type FlashCardUpdateRequest = {
  word: string;
  meaning: string;
};
