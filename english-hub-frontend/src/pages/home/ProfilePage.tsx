import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserById } from '@/services/userService';
import { useAuthStore } from '@/stores/authStore';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserStatus } from '@/types/userType';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import ChangePasswordForm from '@/components/home/ChangePasswordForm';

export default function ProfilePage() {
  const userId = useAuthStore(state => state.userId);
  const [activeTab, setActiveTab] = useState('profile');

  const { data: userData, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId || ''),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case UserStatus.UNVERIFIED:
        return 'bg-amber-100 text-amber-800';
      case UserStatus.DEACTIVATED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = () => {
    if (!userData) return 'U';
    if (userData.username) return userData.username.charAt(0).toUpperCase();
    return userData.email.charAt(0).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
        <p className="text-muted-foreground">Unable to load user profile.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="container max-w-4xl py-10 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">My Account</h1>

        <Tabs
          defaultValue="profile"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  View your account details and information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 bg-blue-100 text-blue-600 text-xl">
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="mt-3 text-center">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${getStatusColor(
                          userData.status
                        )}`}
                      >
                        {userData.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Username
                        </h3>
                        <p className="text-base font-medium">
                          {userData.username}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Email
                        </h3>
                        <p className="text-base font-medium">
                          {userData.email}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Role
                        </h3>
                        <p className="text-base font-medium">{userData.role}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Join Date
                        </h3>
                        <p className="text-base font-medium">
                          {format(new Date(userData.joinDate), 'PPP')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChangePasswordForm onSuccess={() => setActiveTab('profile')} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
