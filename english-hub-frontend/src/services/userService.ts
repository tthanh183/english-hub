import axiosInstance from '@/services/axiosInstance';

export const getAllUsers = async () => {
  return await axiosInstance.get('/users');
};
