import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { BarChart, BookOpen, Home, LogOut, Menu, Users, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useMobile } from '@/hooks/useMobile';
import { cn } from '@/lib/utils';

export default function DashboardLayout() {
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { pathname } = useLocation(); 

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Course Management', href: '/admin/courses', icon: BookOpen },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile sidebar toggle */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'w-64 bg-muted/40 border-r shrink-0 overflow-y-auto h-full flex flex-col',
          isMobile &&
            'fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-in-out',
          isMobile && !sidebarOpen && '-translate-x-full'
        )}
      >
        <div className="p-6">
          <h1 className="text-xl font-bold">Learning Admin</h1>
        </div>
        <nav className="flex-1 px-4 py-2 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className="h-5 w-5 mr-2" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Log out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
