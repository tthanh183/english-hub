import { Outlet, useLocation } from 'react-router-dom';

import Header from '@/layouts/HomeLayout/Header';
import Footer from '@/layouts/HomeLayout/Footer';
import Chatbot from '@/layouts/HomeLayout/Chatbot';

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
      {!isExamPage && <Chatbot />}
    </div>
  );
}
