import axiosInstance from '@/services/axiosInstance';

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  username: string;
};

export type VerifyRequest = {
  email: string;
  verificationCode: string;
};

export const registerUser = async (data: RegisterRequest) => {
  return await axiosInstance.post('/auth/register', data);
};

export const verifyUser = async (data: VerifyRequest) => {
  return await axiosInstance.post('/auth/verify', data);
};

export const login = async (data: LoginRequest) => {
  return await axiosInstance.post('/auth/login', data);
};

export const resendVerificationCode = async (email: string) => {
  return await axiosInstance.post('/auth/resend', { email });
};

export const logout = async () => {
  return await axiosInstance.post('/auth/logout');
};
