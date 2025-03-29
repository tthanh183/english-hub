import axiosInstance from '@/services/axiosInstance';
import { LoginRequest, RegisterRequest, VerifyRequest } from '@/types/authType';

export async function register(data: RegisterRequest) {
  const response = await axiosInstance.post('/auth/register', data);
  return response.data.result;
}

export async function verifyEmail(data: VerifyRequest) {
  const response = await axiosInstance.post('/auth/verify-email', data);
  return response.data.result;
}

export async function login(data: LoginRequest) {
  const response = await axiosInstance.post('/auth/login', data);
  return response.data.result;
}

export async function resendVerificationCode(email: string) {
  const response = await axiosInstance.post('/auth/resend', { email });
  return response.data.result;
}

export async function logout() {
  const response = await axiosInstance.post('/auth/logout');
  return response.data.result;
}
