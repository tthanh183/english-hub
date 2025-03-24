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
import { deactivateUser, getAllUsers } from '@/services/userService';
import AddUserDialog from '@/components/admin/AddUserDialog';
import UpdateUserDialog from '@/components/admin/UpdateUserDialog';
import { showError } from '@/hooks/useToast';
import { isAxiosError } from 'axios';

export default function UserManagement() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddUserOpen, setIsAddUserOpen] = useState<boolean>(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserUpdateRequest | null>(
    null
  );

  const fetchUsers = async () => {
    const response = await getAllUsers();
    setUsers(response.data.result);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = (user: UserResponse) => {
    setUsers([...users, user]);
  };

  const handleUpdateUser = (updatedUser: UserResponse) => {
    setUsers(
      users.map(user => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleDeactivateUser = async (id: string) => {
    try {
      const response = await deactivateUser(id);
      const updatedUser = response.data.result;
      setUsers(
        users.map(user => (user.id === updatedUser.id ? updatedUser : user))
      );
    } catch (error) {
      if (isAxiosError(error)) {
        showError(error.response?.data.message);
      } else {
        showError('Something went wrong');
      }
    }
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
      // [UserRole.USER]: 'bg-purple-100 text-purple-800',
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
          onUserAdded={handleAddUser}
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
            {filteredUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{renderRoleBadge(user.role)}</TableCell>
                <TableCell>{renderStatusBadge(user.status)}</TableCell>
                <TableCell>
                  {new Date(user.joinDate).toISOString().split('T')[0]}
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
                        onClick={() => handleDeactivateUser(user.id)}
                      >
                        {user.status === UserStatus.ACTIVE
                          ? 'Deactivate'
                          : 'Activate'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteUser(user.id)}
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
        onUserUpdated={handleUpdateUser}
      />
    </div>
  );
}
