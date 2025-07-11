import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Flag,
  Clock,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getQuestionGroupsFromExam, submitExam } from '@/services/examService';
import { useParams, useNavigate } from 'react-router-dom';
import { QuestionGroupResponse, QuestionType } from '@/types/questionType';
import GlobalSkeleton from '@/components/GlobalSkeleton';
import AudioPlayer from '@/components/AudioPlayer';
import { isAxiosError } from 'axios';
import { showError } from '@/hooks/useToast';

const testParts = [
  {
    id: 1,
    name: 'Part 1',
    questions: 6,
    questionType: QuestionType.PART_1_PHOTOGRAPHS,
  },
  {
    id: 2,
    name: 'Part 2',
    questions: 25,
    questionType: QuestionType.PART_2_QUESTION_RESPONSES,
  },
  {
    id: 3,
    name: 'Part 3',
    questions: 39,
    questionType: QuestionType.PART_3_CONVERSATIONS,
  },
  {
    id: 4,
    name: 'Part 4',
    questions: 30,
    questionType: QuestionType.PART_4_TALKS,
  },
  {
    id: 5,
    name: 'Part 5',
    questions: 30,
    questionType: QuestionType.PART_5_INCOMPLETE_SENTENCES,
  },
  {
    id: 6,
    name: 'Part 6',
    questions: 16,
    questionType: QuestionType.PART_6_TEXT_COMPLETION,
  },
  {
    id: 7,
    name: 'Part 7',
    questions: 54,
    questionType: QuestionType.PART_7_READING_COMPREHENSION,
  },
];

export default function ExamDetailPage() {
  const [currentPart, setCurrentPart] = useState(1);
  const [currentGroupQuestions, setCurrentGroupQuestions] = useState<
    QuestionGroupResponse[]
  >([]);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<string[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [showQuestionNav, setShowQuestionNav] = useState(true);
  const [timeLeft, setTimeLeft] = useState(120 * 60);
  const [showConfirm, setShowConfirm] = useState(false);

  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { examId } = useParams();
  const navigate = useNavigate();

  const totalQuestions = testParts.reduce(
    (acc, part) => acc + part.questions,
    0
  );
  const answeredQuestions = Object.keys(selectedAnswers).length;
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;

  const { data: questions, isLoading } = useQuery<QuestionGroupResponse[]>({
    queryKey: ['questions', examId],
    queryFn: () => getQuestionGroupsFromExam(examId as string),
  });

  useEffect(() => {
    const currentQuestionType = testParts.find(
      part => part.id === currentPart
    )?.questionType;

    const currentPartQuestions =
      questions?.filter(
        question => question.questionType === currentQuestionType
      ) || [];

    setCurrentGroupQuestions(currentPartQuestions);
  }, [currentPart, questions]);

  const toggleFlagQuestion = (questionId: string) => {
    if (flaggedQuestions.includes(questionId)) {
      setFlaggedQuestions(flaggedQuestions.filter(id => id !== questionId));
    } else {
      setFlaggedQuestions([...flaggedQuestions, questionId]);
    }
  };

  const handleAnswerSelect = (questionId: string, value: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: value,
    });
  };

  const scrollToQuestion = (questionId: string) => {
    const ref = questionRefs.current[questionId];
    if (ref) {
      const elementRect = ref.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      const middleOfElement =
        absoluteElementTop - window.innerHeight / 2 + elementRect.height / 2;

      window.scrollTo({
        top: middleOfElement,
        behavior: 'smooth',
      });

      setActiveQuestion(questionId);

      setTimeout(() => {
        setActiveQuestion(null);
      }, 2000);
    }
  };

  useEffect(() => {
    questionRefs.current = {};
  }, [currentPart]);

  const getAllQuestionsForCurrentPart = () => {
    return currentGroupQuestions.flatMap(group => group.questions || []);
  };

  const getQuestionNavWidth = () => {
    const questionCount = getAllQuestionsForCurrentPart().length;

    if (questionCount <= 2) {
      return 'w-28';
    } else if (questionCount <= 9) {
      return 'w-36';
    } else if (questionCount <= 16) {
      return 'w-40';
    } else {
      return 'w-48';
    }
  };

  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const confirmSubmit = () => {
    setShowConfirm(true);
  };

  const submitMutation = useMutation({
    mutationFn: ({
      examId,
      answers,
    }: {
      examId: string;
      answers: Record<string, string>;
    }) => submitExam(examId, answers),
    onSuccess: result => {
      navigate(`/exams/exam-results/${result.id}`, {
        state: { examResult: result },
      });
    },
    onError: error => {
      if (isAxiosError(error)) {
        showError(
          error.response?.data.message || 'An unexpected error occurred'
        );
      } else {
        showError('Failed to submit exam. Please try again later.');
      }
    },
  });

  const handleSubmitExam = () => {
    setShowConfirm(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    submitMutation.mutate({
      examId: examId as string,
      answers: selectedAnswers,
    });
  };

  const autoSubmitExam = useCallback(async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    submitMutation.mutate({
      examId: examId as string,
      answers: selectedAnswers,
    });
  }, [selectedAnswers, examId, submitMutation]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          autoSubmitExam();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [autoSubmitExam]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const message =
        'If you leave now, your exam progress will be lost. Are you sure?';
      e.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  if (isLoading) {
    return <GlobalSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50 flex justify-center py-3 bg-gray-50">
        <div
          className={`flex items-center px-6 py-2 rounded-full ${
            timeLeft < 300 ? 'bg-red-100' : 'bg-blue-100'
          } shadow-sm`}
        >
          <Clock
            className={`h-5 w-5 mr-2 ${
              timeLeft < 300 ? 'text-red-600' : 'text-blue-600'
            }`}
          />
          <span className="text-lg font-bold">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row relative">
        <div className="hidden lg:block w-64 mr-8">
          <div className="rounded-lg p-4 mb-6 sticky top-24 bg-white shadow-sm">
            <div className="mb-4">
              <h3 className="font-medium mb-2">Progress</h3>
              <Progress value={progressPercentage} />
              <div className="flex justify-between mt-2 text-sm">
                <span>
                  {answeredQuestions}/{totalQuestions} questions
                </span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
            </div>

            <div className="space-y-3">
              {testParts.map(part => (
                <div
                  key={part.id}
                  className={cn(
                    'p-3 rounded-md cursor-pointer transition-colors',
                    currentPart === part.id
                      ? 'bg-blue-100 text-blue-800'
                      : 'hover:bg-gray-100'
                  )}
                  onClick={() => setCurrentPart(part.id)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{part.name}</span>
                    <span className="text-sm">{part.questions} questions</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 mt-6">
              <Button
                variant="destructive"
                className="w-full"
                onClick={confirmSubmit}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="space-y-8 mb-8 lg:pr-20">
            <div className="rounded-lg p-6 bg-white shadow-sm">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {testParts.find(p => p.id === currentPart)?.name}
                </h2>
                <div className="text-sm">
                  {
                    getAllQuestionsForCurrentPart().filter(
                      q => selectedAnswers[q.id]
                    ).length
                  }
                  /{testParts.find(p => p.id === currentPart)?.questions}{' '}
                  questions answered
                </div>
              </div>
            </div>

            {currentGroupQuestions.map(groupQuestion => (
              <div
                key={groupQuestion.id}
                className="rounded-lg p-6 bg-white shadow-sm"
              >
                {groupQuestion.audioUrl && (
                  <div className="mb-6">
                    <AudioPlayer
                      key={groupQuestion.audioUrl}
                      src={groupQuestion.audioUrl}
                    />
                  </div>
                )}

                {groupQuestion.imageUrl && (
                  <div
                    className="flex justify-center items-center my-2"
                    style={{ height: '400px' }}
                  >
                    <img
                      src={groupQuestion.imageUrl}
                      alt="TOEIC question"
                      className="rounded-lg shadow-sm"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                )}

                {groupQuestion.passage && (
                  <div className="bg-gray-50 p-4 rounded-lg my-6">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: groupQuestion.passage,
                      }}
                    />
                  </div>
                )}

                <div className="space-y-10">
                  {groupQuestion.questions.map((question, index) => (
                    <div
                      key={question.id}
                      ref={el => {
                        questionRefs.current[question.id] = el;
                      }}
                      className={cn(
                        'border-t pt-6 first:border-0',
                        activeQuestion === question.id
                          ? 'bg-blue-50 border border-blue-200'
                          : ''
                      )}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold">
                          {question.title || `Question ${index + 1}`}
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleFlagQuestion(question.id)}
                          className={
                            flaggedQuestions.includes(question.id)
                              ? 'text-red-500 border-red-500'
                              : ''
                          }
                        >
                          <Flag
                            className={cn(
                              'h-4 w-4 mr-2',
                              flaggedQuestions.includes(question.id)
                                ? 'fill-red-500'
                                : ''
                            )}
                          />
                          {flaggedQuestions.includes(question.id)
                            ? 'Flagged'
                            : 'Flag'}
                        </Button>
                      </div>

                      <RadioGroup
                        value={selectedAnswers[question.id] || ''}
                        onValueChange={value =>
                          handleAnswerSelect(question.id, value)
                        }
                        className="space-y-0.5"
                      >
                        {['A', 'B', 'C', 'D'].map(option => {
                          const value =
                            question[
                              `choice${option}` as keyof typeof question
                            ];
                          if (value === null) return null;

                          const isSelected =
                            selectedAnswers[question.id] === option;

                          return (
                            <div
                              key={option}
                              className={`flex items-center space-x-4 p-2 rounded-lg transition-all duration-200 cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-100 border border-blue-300'
                                  : 'hover:bg-gray-50'
                              }`}
                              onClick={() =>
                                handleAnswerSelect(question.id, option)
                              }
                            >
                              <div className="flex-shrink-0">
                                <RadioGroupItem
                                  value={option}
                                  id={`${question.id}-${option}`}
                                  className="h-5 w-5"
                                />
                              </div>

                              <Label
                                htmlFor={`${question.id}-${option}`}
                                className="flex-1 text-gray-700 cursor-pointer py-1"
                              >
                                {`${option}. ${value || ''}`}
                              </Label>
                            </div>
                          );
                        })}
                      </RadioGroup>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:hidden flex space-x-2 mb-6">
            <Button
              variant="destructive"
              className="flex-1"
              onClick={confirmSubmit}
            >
              Submit
            </Button>
          </div>
        </div>

        <div
          className={cn(
            'fixed right-4 top-24 bottom-24 z-40 transition-all duration-300 flex',
            showQuestionNav ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <Button
            size="sm"
            variant="outline"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full h-24 w-8 rounded-l-md rounded-r-none bg-white shadow-md"
            onClick={() => setShowQuestionNav(!showQuestionNav)}
          >
            {showQuestionNav ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>

          <div
            className={`${getQuestionNavWidth()} overflow-y-auto rounded-l-lg p-2 flex flex-col gap-2 bg-white shadow-xl`}
          >
            <div className="text-center mb-1 text-sm font-medium text-gray-500">
              Questions
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {getAllQuestionsForCurrentPart().map((question, idx) => {
                const questionNumber =
                  question.title?.match(/Question (\d+)/i)?.[1] || idx + 1;

                return (
                  <button
                    key={question.id}
                    className={cn(
                      'w-10 h-10 rounded-md flex items-center justify-center text-sm font-medium transition-all shadow-sm',
                      activeQuestion === question.id
                        ? 'ring-2 ring-offset-1 ring-blue-500'
                        : '',
                      selectedAnswers[question.id]
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : flaggedQuestions.includes(question.id)
                        ? 'bg-red-50 text-red-800 border border-red-300'
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    )}
                    onClick={() => scrollToQuestion(question.id)}
                    title={`Go to question ${questionNumber}`}
                  >
                    {questionNumber}

                    {flaggedQuestions.includes(question.id) && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="border-t my-2 pt-2">
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="flex items-center">
                  <div className="w-3 h-3 rounded-sm bg-blue-100 border border-blue-300 mr-1"></div>
                  Answered
                </span>
                <span>{Object.keys(selectedAnswers).length}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center">
                  <div className="w-3 h-3 rounded-sm bg-red-50 border border-red-300 mr-1"></div>
                  Flagged
                </span>
                <span>{flaggedQuestions.length}</span>
              </div>
            </div>
          </div>
        </div>

        <Button
          size="icon"
          className="fixed bottom-6 right-6 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-40"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Exam</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit your exam? You have answered{' '}
              {answeredQuestions} out of {totalQuestions} questions. You won't
              be able to make changes after submission.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmitExam}
              disabled={submitMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {submitMutation.isPending ? 'Submitting...' : 'Submit Exam'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
