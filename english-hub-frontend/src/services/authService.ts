import axiosInstance from '@/services/axiosInstance';
import {
  LoginRequest,
  RegisterRequest,
  VerifyRequest,
} from '@/types/authType';

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
