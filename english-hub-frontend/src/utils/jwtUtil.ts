import { jwtDecode } from 'jwt-decode';

export const getUserIdFromToken = (token: string): string => {
  const decodedToken = jwtDecode(token);
  return decodedToken.sub || '';
};
