import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, User, Settings, LogOut, Key } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuthStore } from '@/stores/authStore';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useQuery } from '@tanstack/react-query';
import { getUserById } from '@/services/userService';
import { useMemo } from 'react';
import { showSuccess } from '@/hooks/useToast';

export default function Header() {
  const navigate = useNavigate();

  const menuItems = [
    { title: 'TOEIC® Test Pro', href: '/toeic-test-pro' },
    { title: 'Learning Path', href: '/learning-path' },
    { title: 'Practice L&R', href: '/courses/listening-reading' },
    { title: 'Practice S&W', href: '/courses/speaking-writing' },
    { title: 'Mock Tests', href: '/exams' },
    { title: 'Vocabulary', href: '/decks' },
  ];

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const userId = useAuthStore(state => state.userId);
  const logout = useAuthStore(state => state.logout);

  const { data: userData, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId || ''),
    enabled: !!userId && isAuthenticated,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const handleLogout = () => {
    logout();
    showSuccess('Logged out successfully');

    setTimeout(() => {
      navigate('/login');
    }, 300);
  };

  const initials = useMemo(() => {
    if (!userData) return 'U';
    if (userData.username) return userData.username.charAt(0).toUpperCase();
    if (userData.email) return userData.email.charAt(0).toUpperCase();
    return 'U';
  }, [userData]);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-blue-600">EnglishHub</span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-6">
            {menuItems.map(item => (
              <Link
                key={item.title}
                to={item.href}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-8">
                  {menuItems.map(item => (
                    <Link
                      key={item.title}
                      to={item.href}
                      className="text-lg font-medium py-2 hover:text-blue-600"
                    >
                      {item.title}
                    </Link>
                  ))}
                  <div className="mt-8">
                    {isAuthenticated ? (
                      <div className="space-y-3">
                        {!isLoading && userData && (
                          <div className="flex items-center gap-3 p-2 rounded-md bg-gray-50">
                            <Avatar className="h-10 w-10 bg-blue-100 text-blue-600">
                              <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {userData?.username || userData?.email}
                              </p>
                              <p className="text-sm text-gray-500">
                                {userData?.email}
                              </p>
                            </div>
                          </div>
                        )}
                        <Link to="/profile" className="block w-full">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                          >
                            <User className="h-4 w-4 mr-2" /> My Profile
                          </Button>
                        </Link>
                        <Link to="/settings" className="block w-full">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                          >
                            <Settings className="h-4 w-4 mr-2" /> Account
                            Settings
                          </Button>
                        </Link>
                        <Link to="/change-password" className="block w-full">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                          >
                            <Key className="h-4 w-4 mr-2" /> Change Password
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleLogout}
                          className="w-full justify-start text-red-600"
                        >
                          <LogOut className="h-4 w-4 mr-2" /> Logout
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full"
                      >
                        <Link to="/login">Login</Link>
                      </Button>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full p-0 overflow-hidden border border-gray-200"
                  >
                    {isLoading ? (
                      <div className="animate-pulse bg-gray-200 h-full w-full" />
                    ) : (
                      <Avatar className="bg-blue-100 text-blue-600">
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userData?.username || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userData?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Account Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
