import { Plus, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  UserCreateRequest,
  UserResponse,
  UserRole,
  UserUpdateRequest,
} from '@/types/userType';
import { createUser, updateUser } from '@/services/userService';
import { showError, showSuccess } from '@/hooks/useToast';
import { Spinner } from '@/components/Spinner';

type UserDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  user?: UserResponse | null;
};

export default function UserDialog({
  isOpen,
  onOpenChange,
  user = null,
}: UserDialogProps) {
  const isEditMode = !!user;

  const [userData, setUserData] = useState<
    UserCreateRequest | UserUpdateRequest
  >({
    username: '',
    email: '',
    role: UserRole.USER,
  });

  useEffect(() => {
    if (isOpen && user) {
      setUserData({
        username: user.username,
        email: user.email,
        role: user.role,
      });
    } else if (!isOpen || !user) {
      setUserData({
        username: '',
        email: '',
        role: UserRole.USER,
      });
    }
  }, [isOpen, user]);

  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (response: UserResponse) => {
      queryClient.setQueryData<UserResponse[]>(['users'], (oldUsers = []) => [
        ...oldUsers,
        response,
      ]);
      showSuccess('User added successfully');
    },
    onError: handleError,
    onSettled: handleSettled,
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, user }: { id: string; user: UserUpdateRequest }) =>
      updateUser(id, user),
    onSuccess: (response: UserResponse) => {
      queryClient.setQueryData<UserResponse[]>(['users'], (oldUsers = []) =>
        Array.isArray(oldUsers)
          ? oldUsers.map(u => (u.id === response.id ? response : u))
          : [response]
      );
      showSuccess('User updated successfully');
    },
    onError: handleError,
    onSettled: handleSettled,
  });

  function handleError(error: unknown) {
    if (isAxiosError(error)) {
      showError(error.response?.data.message);
    } else {
      showError('Something went wrong');
    }
  }

  function handleSettled() {
    onOpenChange(false);
  }

  const handleSubmit = () => {
    if (isEditMode && user) {
      updateUserMutation.mutate({
        id: user.id,
        user: userData as UserUpdateRequest,
      });
    } else {
      createUserMutation.mutate(userData as UserCreateRequest);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const isPending = isEditMode
    ? updateUserMutation.isPending
    : createUserMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update user information.'
              : 'Add a new user to your platform.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="username">User Name</Label>
            <Input
              id="username"
              name="username"
              value={userData.username}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={userData.email}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={userData.role}
              onValueChange={value =>
                setUserData({ ...userData, role: value as UserRole })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(UserRole).map(role => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-[150px]"
          >
            {isPending ? (
              <Spinner />
            ) : isEditMode ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
