export const indexToLetter = (index: number): string => {
  return String.fromCharCode(65 + index);
};

export const letterToIndex = (letter: string): number => {
  return letter.charCodeAt(0) - 65;
};
