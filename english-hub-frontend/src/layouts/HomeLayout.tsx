import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Outlet, useLocation } from 'react-router-dom';
import { ChatButton } from '@/components/home/ChatbotButton';

export default function HomeLayout() {
  const location = useLocation();
  const isExamPage = location.pathname.startsWith('/exams');

  return (
    <div lang="en" className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      {!isExamPage && <ChatButton />}
    </div>
  );
}
