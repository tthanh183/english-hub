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
import { UserResponse, UserRole, UserUpdateRequest } from '@/types/userType';
import { showError, showSuccess } from '@/hooks/useToast';
import { updateUser } from '@/services/userService';
import { Spinner } from '@/components/Spinner';

type UpdateUserDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectedUser: UserResponse | null;
  setSelectedUser: (user: UserResponse | null) => void;
};

export default function UpdateUserDialog({
  isOpen,
  onOpenChange,
  selectedUser,
  setSelectedUser,
}: UpdateUserDialogProps) {

  const queryClient = useQueryClient();
  const updateUserMutation = useMutation({
    mutationFn: ({ id, user }: { id: string; user: UserUpdateRequest }) =>
      updateUser(id, user),
    onSuccess: (response: UserResponse) => {
      queryClient.setQueryData<UserResponse[]>(['users'], (oldUsers = []) =>
        Array.isArray(oldUsers)
          ? oldUsers.map(user => (user.id === response.id ? response : user))
          : [response]
      );
      showSuccess('User updated successfully');
    },
    onError: error => {
      if (isAxiosError(error)) {
        showError(error.response?.data.message);
      } else {
        showError('Something went wrong');
      }
    },
    onSettled: () => {
      onOpenChange(false);
      setSelectedUser(null);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (selectedUser) {
      setSelectedUser({
        ...selectedUser,
        [name]: value,
      });
    }
  };

  const handleEditUser = async () => {
    if (selectedUser) {
      const { id, ...userData } = selectedUser;
      await updateUserMutation.mutateAsync({
        id,
        user: userData as UserUpdateRequest,
      });
    }
  };

  return (
    <Dialog open={isOpen && selectedUser !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update user information.</DialogDescription>
        </DialogHeader>
        {selectedUser && (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                name="username" 
                value={selectedUser.username}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                name="email" 
                type="email"
                value={selectedUser.email}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={selectedUser.role}
                onValueChange={value =>
                  setSelectedUser({ ...selectedUser, role: value as UserRole })
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
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleEditUser}
            disabled={updateUserMutation.isPending} 
            className='min-w-[120px]'
          >
            {updateUserMutation.isPending ? <Spinner /> : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
