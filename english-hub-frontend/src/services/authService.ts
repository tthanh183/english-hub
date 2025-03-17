import axiosInstance from './axiosInstance';

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface VerifyRequest {
  email: string;
  code: string;
}

export const registerUser = async (data: RegisterRequest) => {
  return axiosInstance.post('/auth/register', data);
};

export const verifyUser = async (data: VerifyRequest) => {
  return axiosInstance.post('/auth/verify', data);
};

export const login = async (email: string, password: string) => {
  return axiosInstance.post('/auth/login', { email, password });
};

export const logout = async () => {
  return axiosInstance.post('/auth/logout');
};
