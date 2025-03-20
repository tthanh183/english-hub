import { jwtDecode } from 'jwt-decode';

type TokenPayload = {
  sub: string;
  scope: string;
};

export const getUserIdFromToken = (token: string): string => {
  try {
    const decodedToken = jwtDecode<TokenPayload>(token);
    return decodedToken.sub || '';
  } catch (error) {
    console.error('Invalid token', error);
    return '';
  }
};

export const isAdminFromToken = (token: string): boolean => {
  try {
    const decodedToken = jwtDecode<TokenPayload>(token);
    return decodedToken.scope === 'Admin';
  } catch (error) {
    console.error('Invalid token', error);
    return false;
  }
};
