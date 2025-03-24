import axiosInstance from '@/services/axiosInstance';
import { UserCreateRequest } from '@/types/userType';

export const getAllUsers = async () => {
  return await axiosInstance.get('/users');
};

export const createUser = async (user: UserCreateRequest) => {
  return await axiosInstance.post('/users', user);
};
