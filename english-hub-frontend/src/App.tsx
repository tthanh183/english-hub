import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { ROUTES } from './constants/routes';
import HomePage from '@/pages/home/main/HomePage';
import VerifyPage from '@/pages/VerifyPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminDashboardLayout from '@/layouts/admin-layout/AdminDashboardLayout';
import CourseManagementPage from '@/pages/admin/CourseManagementPage';
import HomeLayout from '@/layouts/home-layout/HomeLayout';
import ListeningReadingPage from './pages/home/ListeningReadingPage';
import HomeCourseDetailPage from './pages/home/HomeCourseDetailPage';
import AdminCourseDetailPage from './pages/admin/AdminCourseDetailPage';
import LessonPage from './pages/home/LessonPage';
import ExercisePage from './pages/home/ExercisePage';
import UserManagementPage from '@/pages/admin/user-management/UserManagementPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import ExamManagementPage from '@/pages/admin/ExamManagementPage';
import ExamQuestionsManagementPage from './pages/admin/ExamQuestionsManagementPage';
import ExamPage from './pages/home/ExamPage';
import ExamDetailPage from './pages/home/ExamDetailPage';
import ExamResultPage from './pages/home/ExamResultPage';
import DeckManagementPage from './pages/admin/DeckManagementPage';
import FlashCardManagementPage from './pages/admin/FlashCardManagementPage';
import DeckPage from './pages/home/DeckPage';
import VocabularyPage from './pages/home/VocabularyPage';
import FlashCardPage from './pages/home/FlashCardPage';
import ReviewTodayPage from './pages/home/ReviewTodayPage';
import ProfilePage from './pages/home/profile/ProfilePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.VERIFY} element={<VerifyPage />} />

        <Route path={ROUTES.HOME} element={<HomeLayout />}>
          <Route index element={<HomePage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
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
          <Route element={<ProtectedRoute adminRequired={false} />}>
            <Route path={ROUTES.EXAM_DETAIL} element={<ExamDetailPage />} />
            <Route path={ROUTES.EXAM_RESULT} element={<ExamResultPage />} />
          </Route>

          <Route path={ROUTES.DECK} element={<DeckPage />} />
          <Route path={ROUTES.VOCABULARY} element={<VocabularyPage />} />
          <Route element={<ProtectedRoute adminRequired={false} />}>
            <Route path={ROUTES.FLASH_CARD} element={<FlashCardPage />} />
            <Route path={ROUTES.REVIEW_TODAY} element={<ReviewTodayPage />} />
          </Route>
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
            <Route
              path={ROUTES.ADMIN_FLASHCARDS}
              element={<FlashCardManagementPage />}
            />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
