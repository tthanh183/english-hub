export type DeckResponse = {
  id: string;
  name: string;
  description: string;
  createdDate: Date;
  updatedDate: Date;
  cardCount: number;
};

export type DeckCreateRequest = {
  name: string;
  description: string;
};

export type DeckUpdateRequest = {
  name: string;
  description: string;
};
