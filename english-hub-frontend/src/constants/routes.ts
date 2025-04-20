export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY: '/verify',
  FORGOT_PASSWORD: '/forgot-password',

  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_COURSES: '/admin/courses',
  ADMIN_COURSES_DETAIL: '/admin/courses/:courseId',
  ADMIN_TESTS: '/admin/tests',
  ADMIN_TESTS_DETAIL: '/admin/tests/:testId',

  COURSES: '/courses',
  COURSES_LISTENING_READING: '/courses/listening-reading',
  COURSES_GRAMMAR: '/courses/grammar',
  COURSES_VOCABULARY: '/courses/vocabulary',

  COURSE_DETAIL: '/courses/:courseId',
  LESSON_DETAIL: '/courses/:courseId/lessons/:lessonId',
  EXERCISE_DETAIL: '/courses/:courseId/exercises/:exerciseId',
};
