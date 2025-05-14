import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import HomePage from '@/pages/HomePage';
import VerifyPage from '@/pages/VerifyPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminDashboardLayout from '@/layouts/AdminDashboardLayout';
import CourseManagementPage from '@/pages/admin/CourseManagementPage';
import { ROUTES } from './constants/routes';
import HomeLayout from './layouts/HomeLayout';
import ListeningReadingPage from './pages/home/ListeningReadingPage';
import HomeCourseDetailPage from './pages/home/HomeCourseDetailPage';
import AdminCourseDetailPage from './pages/admin/AdminCourseDetailPage';
import LessonPage from './pages/home/LessonPage';
import ExercisePage from './pages/home/ExercisePage';
import UserManagementPage from '@/pages/admin/UserManagementPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import ExamManagementPage from '@/pages/admin/ExamManagementPage';
import ExamQuestionsManagementPage from './pages/admin/ExamQuestionsManagementPage';
import ExamPage from './pages/home/ExamPage';
import ExamDetailPage from './pages/home/ExamDetailPage';
import ExamResultPage from './pages/home/ExamResultPage';
import DeckManagementPage from './pages/admin/DeckManagementPage';
import FlashCardManagementPage from './pages/admin/FlashCardManagementPage';
import DeckPage from './pages/home/DeckPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.VERIFY} element={<VerifyPage />} />
        {/* <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} /> */}

        <Route path={ROUTES.HOME} element={<HomeLayout />}>
          <Route index element={<HomePage />} />
          <Route
            path={ROUTES.COURSES_LISTENING_READING}
            element={<ListeningReadingPage />}
          />
          <Route
            path={ROUTES.COURSE_DETAIL}
            element={<HomeCourseDetailPage />}
          />
          <Route path={ROUTES.LESSON_DETAIL} element={<LessonPage />} />
          <Route path={ROUTES.EXERCISE_DETAIL} element={<ExercisePage />} />

          <Route path={ROUTES.EXAM} element={<ExamPage />} />
          <Route path={ROUTES.EXAM_DETAIL} element={<ExamDetailPage />} />
          <Route path={ROUTES.EXAM_RESULT} element={<ExamResultPage />} />

          <Route path={ROUTES.DECK} element={<DeckPage />} />
          <Route path={ROUTES.FLASH_CARD} element={<DeckPage />} />
        </Route>

        <Route element={<ProtectedRoute adminRequired={true} />}>
          <Route path={ROUTES.ADMIN} element={<AdminDashboardLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path={ROUTES.ADMIN_USERS} element={<UserManagementPage />} />
            <Route
              path={ROUTES.ADMIN_COURSES}
              element={<CourseManagementPage />}
            />
            <Route
              path={ROUTES.ADMIN_COURSES_DETAIL}
              element={<AdminCourseDetailPage />}
            />
            <Route path={ROUTES.ADMIN_EXAMS} element={<ExamManagementPage />} />
            <Route
              path={ROUTES.ADMIN_EXAM_QUESTIONS}
              element={<ExamQuestionsManagementPage />}
            />

            <Route path={ROUTES.ADMIN_DECKS} element={<DeckManagementPage />} />
            <Route path={ROUTES.ADMIN_FLASHCARDS} element={<FlashCardManagementPage />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
