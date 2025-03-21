import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart, BookOpen, Home, LogOut, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/useMobile';

export default function AdminSideBar() {
  const [sidebarOpen] = useState(false);
  const isMobile = useMobile();
  const { pathname } = useLocation(); 

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'User Management', href: '/dashboard/users', icon: Users },
    { name: 'Content Management', href: '/dashboard/content', icon: BookOpen },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart },
  ];

  return (
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
            to={item.href} // Thay 'href' bằng 'to' để phù hợp với Link từ react-router-dom
            className={cn(
              'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all', // Đảm bảo có hiệu ứng chuyển tiếp
              pathname === item.href
                ? 'bg-primary text-primary-foreground shadow-lg' // Khi tab đang chọn
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground' // Khi tab chưa chọn
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
  );
}
