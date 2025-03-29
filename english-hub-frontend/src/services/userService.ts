import axiosInstance from '@/services/axiosInstance';
import {
  UserCreateRequest,
  UserResponse,
  UserUpdateRequest,
} from '@/types/userType';

export async function getAllUsers(): Promise<UserResponse[]> {
  const response = await axiosInstance.get('/users');
  return response.data.result;
}

export async function createUser(
  user: UserCreateRequest
): Promise<UserResponse> {
  const response = await axiosInstance.post('/users', user);
  return response.data.result;
}

export async function updateUser(
  user: UserUpdateRequest
): Promise<UserResponse> {
  const response = await axiosInstance.put(`/users/${user.id}`, user);
  return response.data.result;
}

export async function deactivateUser(id: string): Promise<UserResponse> {
  const response = await axiosInstance.patch(`/users/${id}/deactivate`);
  return response.data.result;
}

export async function activateUser(id: string): Promise<UserResponse> {
  const response = await axiosInstance.patch(`/users/${id}/activate`);
  return response.data.result;
}
