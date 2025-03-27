import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus } from 'lucide-react';
import { UserCreateRequest, UserRole } from '@/types/userType';
import { useState } from 'react';
import { createUser } from '@/services/userService';
import { showError, showSuccess } from '@/hooks/useToast';
import { isAxiosError } from 'axios';
import { Spinner } from '../Spinner';
import { useMutation } from '@tanstack/react-query';

type AddUserDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onUserAdded: () => void;
};

export default function AddUserDialog({
  isOpen,
  onOpenChange,
  onUserAdded,
}: AddUserDialogProps) {
  const [newUser, setNewUser] = useState<UserCreateRequest>({
    username: '',
    email: '',
    role: UserRole.USER,
  });
  const addMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      onUserAdded();
      showSuccess('User added successfully');
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
    },
  });

  const handleAddUser = async () => {
    addMutation.mutate(newUser);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Add a new user to your platform.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="username">User Name</Label>
            <Input
              id="username"
              value={newUser.username}
              onChange={e =>
                setNewUser({ ...newUser, username: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={newUser.email}
              onChange={e => setNewUser({ ...newUser, email: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={newUser.role}
              onValueChange={value =>
                setNewUser({ ...newUser, role: value as UserRole })
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
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddUser}>
            {addMutation.isPending ? <Spinner /> : 'Add User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
