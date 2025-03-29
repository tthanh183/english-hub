import axiosInstance from '@/services/axiosInstance';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  VerifyRequest,
} from '@/types/authType';
import { UserResponse } from '@/types/userType';

export async function register(data: RegisterRequest): Promise<UserResponse> {
  const response = await axiosInstance.post('/auth/register', data);
  return response.data.result;
}

export async function verifyEmail(data: VerifyRequest): Promise<string> {
  const response = await axiosInstance.post('/auth/verify', data);
  return response.data.message;
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await axiosInstance.post('/auth/login', data);
  return response.data.result;
}

export async function resendVerificationCode(email: string): Promise<string> {
  const response = await axiosInstance.post('/auth/resend', { email });
  return response.data.result;
}

export async function logout(): Promise<string> {
  const response = await axiosInstance.post('/auth/logout');
  return response.data.result;
}
