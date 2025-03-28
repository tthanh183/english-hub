import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Search } from 'lucide-react';

import {
  UserResponse,
  UserStatus,
  UserRole,
  UserUpdateRequest,
} from '@/types/userType';
import {
  activateUser,
  deactivateUser,
  getAllUsers,
} from '@/services/userService';
import AddUserDialog from '@/components/admin/AddUserDialog';
import UpdateUserDialog from '@/components/admin/UpdateUserDialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { showError } from '@/hooks/useToast';
import { isAxiosError } from 'axios';
import { format } from 'date-fns';
import { useUserStore } from '@/stores/userStore';

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddUserOpen, setIsAddUserOpen] = useState<boolean>(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserUpdateRequest | null>(
    null
  );
  const { users, setUsers, updateUser } = useUserStore();

  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
    select: data => data.data.result,
  });

  useEffect(() => {
    if (data.length !== users.length) {
      setUsers(data);
    }
  }, [data, users, setUsers]);

  const deactivateUserMutation = useMutation({
    mutationFn: deactivateUser,
    onSuccess: response => {
      const updatedUser = response.data.result;

      queryClient.setQueryData<UserResponse[]>(['users'], (oldUsers = []) =>
        Array.isArray(oldUsers)
          ? oldUsers.map(user =>
              user.id === updatedUser.id ? updatedUser : user
            )
          : []
      );
      updateUser(updatedUser);
    },
    onError: error => {
      if (isAxiosError(error)) {
        showError(error.response?.data.message);
      } else {
        showError('Failed to deactivate user');
      }
      console.log(error);
    },
  });

  const activateUserMutation = useMutation({
    mutationFn: activateUser,
    onSuccess: response => {
      const updatedUser = response.data.result;
      queryClient.setQueryData<UserResponse[]>(['users'], (oldUsers = []) =>
        Array.isArray(oldUsers)
          ? oldUsers.map(user =>
              user.id === updatedUser.id ? updatedUser : user
            )
          : []
      );
      updateUser(updatedUser);
    },
    onError: error => {
      if (isAxiosError(error)) {
        showError(error.response?.data.message);
      } else {
        showError('Failed to activate user');
      }
    },
  });

  const filteredUsers = users.filter(
    (user: UserResponse) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleUserStatus = (id: string, status: UserStatus) => {
    const mutation =
      status === UserStatus.ACTIVE
        ? deactivateUserMutation
        : activateUserMutation;
    mutation.mutate(id);
  };

  const renderStatusBadge = (status: UserStatus) => {
    const statusClasses = {
      [UserStatus.ACTIVE]: 'bg-green-100 text-green-800',
      [UserStatus.UNVERIFIED]: 'bg-yellow-100 text-yellow-800',
      [UserStatus.DEACTIVATED]: 'bg-red-100 text-red-800',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status]}`}
      >
        {status}
      </span>
    );
  };

  const renderRoleBadge = (role: UserRole) => {
    const roleClasses = {
      [UserRole.ADMIN]: 'bg-blue-100 text-blue-800',
      [UserRole.USER]: 'bg-gray-100 text-gray-800',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleClasses[role]}`}
      >
        {role}
      </span>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage your platform users.</p>
        </div>
        <AddUserDialog
          isOpen={isAddUserOpen}
          onOpenChange={setIsAddUserOpen}
          onUserAdded={() =>
            queryClient.invalidateQueries({ queryKey: ['users'] })
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user: UserResponse) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{renderRoleBadge(user.role)}</TableCell>
                <TableCell>{renderStatusBadge(user.status)}</TableCell>
                <TableCell>
                  {format(new Date(user.joinDate), 'yyyy-MM-dd')}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedUser(user);
                          setIsEditUserOpen(true);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleToggleUserStatus(user.id, user.status)
                        }
                      >
                        {user.status === UserStatus.ACTIVE
                          ? 'Deactivate'
                          : 'Activate'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => console.log('Delete user')}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <UpdateUserDialog
        isOpen={isEditUserOpen}
        onOpenChange={setIsEditUserOpen}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        onUserUpdated={() =>
          queryClient.invalidateQueries({ queryKey: ['users'] })
        }
      />
    </div>
  );
}
