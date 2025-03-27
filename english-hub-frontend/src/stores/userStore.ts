import { create } from 'zustand';
import { UserResponse } from '@/types/userType';

type UserState = {
  users: UserResponse[];
  setUsers: (users: UserResponse[]) => void;
  updateUser: (updatedUser: UserResponse) => void;
}

export const useUserStore = create<UserState>(set => ({
  users: [],
  setUsers: users => set({ users }),
  updateUser: updatedUser =>
    set(state => ({
      users: state.users.map(user =>
        user.id === updatedUser.id ? updatedUser : user
      ),
    })),
}));
