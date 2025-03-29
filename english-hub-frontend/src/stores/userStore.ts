import { create } from 'zustand';
import { UserResponse } from '@/types/userType';

type UserState = {
  users: UserResponse[];
  setUsers: (users: UserResponse[]) => void;
  storeUpdateUser: (updatedUser: UserResponse) => void;
  storeCreateUser: (newUser: UserResponse) => void;
};

export const useUserStore = create<UserState>(set => ({
  users: [],
  setUsers: users => set({ users }),
  storeUpdateUser: (updatedUser: UserResponse) =>
    set(state => ({
      users: state.users.map(user =>
        user.id === updatedUser.id ? updatedUser : user
      ),
    })),
  storeCreateUser: (newUser: UserResponse) =>
    set(state => ({
      users: [...state.users, newUser],
    })),
}));
