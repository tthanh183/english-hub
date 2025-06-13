import { Outlet, useLocation } from 'react-router-dom';

import Header from '@/layouts/home-layout/Header';
import Footer from '@/layouts/home-layout/Footer';
import Chatbot from '@/layouts/home-layout/Chatbot';

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
