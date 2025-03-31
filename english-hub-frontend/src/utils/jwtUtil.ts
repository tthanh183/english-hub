import { jwtDecode } from 'jwt-decode';

type TokenPayload = {
  sub: string;
  scope: string;
};

export const getUserIdFromToken = (token: string): string => {
  try {
    const decodedToken = jwtDecode<TokenPayload>(token);
    return decodedToken.sub;
  } catch (error) {
    console.error('Error decoding token: ', error);
    return '';
  }
};

export const isAdminFromToken = (token: string): boolean => {
  try {
    const decodedToken = jwtDecode<TokenPayload>(token);
    return decodedToken.scope === 'ADMIN';
  } catch (error) {
    console.error('Error decoding token: ', error);
    return false;
  }
};
