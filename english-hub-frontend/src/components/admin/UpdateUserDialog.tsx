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
import { useState } from 'react';

interface EditUserDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectedUser: UserUpdateRequest | null;
  setSelectedUser: (user: UserUpdateRequest | null) => void;
  onUserUpdated: (user: UserResponse) => void;
}

export default function UpdateUserDialog({
  isOpen,
  onOpenChange,
  selectedUser,
  setSelectedUser,
  onUserUpdated,
}: EditUserDialogProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const handleEditUser = async () => {
    if (selectedUser) {
      try {
        setLoading(true);
        const response = await updateUser(selectedUser);
        showSuccess('User updated successfully');
        onUserUpdated(response.data.result);
      } catch (error) {
        if (isAxiosError(error)) {
          showError(error.response?.data.message);
        } else {
          showError('Something went wrong');
        }
      } finally {
        onOpenChange(false);
        setSelectedUser(null);
        setLoading(false);
      }
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
            {loading ? 'Updating...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
