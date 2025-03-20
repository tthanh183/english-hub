import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart, Users, BookOpen, LogOut, Menu, X, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMobile } from '@/hooks/useMobile';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'User Management', href: '/admin/dashboard/users', icon: Users },
    {
      name: 'Content Management',
      href: '/admin/dashboard/content',
      icon: BookOpen,
    },
    { name: 'Analytics', href: '/admin/dashboard/analytics', icon: BarChart },
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
        className={`w-64 bg-muted/40 border-r shrink-0 overflow-y-auto h-full flex flex-col ${
          isMobile &&
          'fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-in-out'
        } ${isMobile && !sidebarOpen && '-translate-x-full'}`}
      >
        <div className="p-6">
          <h1 className="text-xl font-bold">Learning Admin</h1>
        </div>
        <nav className="flex-1 px-4 py-2 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
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

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
