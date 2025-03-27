import axiosInstance from '@/services/axiosInstance';
import { UserCreateRequest, UserUpdateRequest } from '@/types/userType';

export const getAllUsers = async () => {
  return await axiosInstance.get('/users');
};

export const createUser = async (user: UserCreateRequest) => {
  return await axiosInstance.post('/users', user);
};

export const updateUser = async (user: UserUpdateRequest) => {
  return await axiosInstance.put(`/users/${user.id}`, user);
};

export const deactivateUser = async (id: string) => {
  return await axiosInstance.patch(`/users/${id}/deactivate`);
};

export const activateUser = async (id: string) => {
  return await axiosInstance.patch(`/users/${id}/activate`);
};
