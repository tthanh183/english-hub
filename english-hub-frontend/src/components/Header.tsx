import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Header() {
  const menuItems = [
    { title: 'TOEIC® Test Pro', href: '/toeic-test-pro' },
    { title: 'Learning Path', href: '/learning-path' },
    { title: 'Practice L&R', href: '/practice/listening-reading' },
    { title: 'Practice S&W', href: '/practice/speaking-writing' },
    { title: 'Mock Tests', href: '/mock-tests' },
    { title: 'Grammar', href: '/grammar' },
    { title: 'Vocabulary', href: '/vocabulary' },
    { title: 'Blog', href: '/blog' },
  ];

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
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
