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
import { isAxiosError } from 'axios';
import { showError, showSuccess } from '@/hooks/useToast';
import { updateUser } from '@/services/userService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '@/stores/userStore';

type EditUserDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectedUser: UserUpdateRequest | null;
  setSelectedUser: (user: UserUpdateRequest | null) => void;
};

export default function UpdateUserDialog({
  isOpen,
  onOpenChange,
  selectedUser,
  setSelectedUser,
}: EditUserDialogProps) {
  const { storeUpdateUser } = useUserStore();
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (response: UserResponse) => {
      storeUpdateUser(response);
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
  const handleEditUser = async () => {
    if (selectedUser) {
      updateMutation.mutate(selectedUser);
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
                value={selectedUser.username}
                onChange={e =>
                  setSelectedUser({
                    ...selectedUser,
                    username: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={selectedUser.email}
                onChange={e =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
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
                    <SelectItem
                      key={role}
                      value={role}
                      defaultValue={UserRole.USER}
                    >
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
          <Button onClick={handleEditUser}>
            {updateMutation.isPending ? 'Updating...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
