export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY: '/verify',
  PROFILE: '/profile',
  CHANGE_PASSWORD: '/change-password',
  FORGOT_PASSWORD: '/forgot-password',

  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_COURSES: '/admin/courses',
  ADMIN_COURSES_DETAIL: '/admin/courses/:courseId',
  ADMIN_EXAMS: '/admin/exams',
  ADMIN_EXAM_QUESTIONS: '/admin/exams/:examId/questions',
  ADMIN_DECKS: '/admin/decks',
  ADMIN_FLASHCARDS: '/admin/decks/:deckId',

  COURSES: '/courses',
  COURSES_LISTENING_READING: '/courses/listening-reading',
  COURSES_GRAMMAR: '/courses/grammar',
  COURSES_VOCABULARY: '/courses/vocabulary',

  COURSE_DETAIL: '/courses/:courseId',
  LESSON_DETAIL: '/courses/:courseId/lessons/:lessonId',
  EXERCISE_DETAIL: '/courses/:courseId/exercises/:exerciseId',

  EXAM: '/exams',
  EXAM_DETAIL: '/exams/:examId',
  EXAM_RESULT: '/exams/exam-results/:examId',

  DECK: '/decks',
  VOCABULARY: '/decks/:deckId/vocabularies',
  FLASH_CARD: '/decks/:deckId/flashcards',
  REVIEW_TODAY: '/review/today',
};
