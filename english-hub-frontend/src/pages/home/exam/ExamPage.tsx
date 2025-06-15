import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Clock, BookOpen, Calendar, Trophy } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAllExams } from '@/services/examService';
import GlobalSkeleton from '@/components/GlobalSkeleton';
import { longToString } from '@/utils/timeUtil';
import { useAuthStore } from '@/stores/authStore';
import { showError } from '@/hooks/useToast';

export default function ExamPage() {
  const { data: exams, isLoading } = useQuery({
    queryKey: ['exams'],
    queryFn: getAllExams,
  });

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const navigate = useNavigate();

  const handleStartTest = (examId: string) => {
    if (!isAuthenticated) {
      showError('You need to login first');
      return;
    } else {
      navigate(`/exams/${examId}`);
    }
  };

  if (isLoading) {
    return <GlobalSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          TOEIC Mock Tests
        </h1>
        <p className="text-gray-600">
          Practice with real TOEIC tests, updated regularly with the latest
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {exams &&
          exams.map(exam => {
            return (
              <Card
                key={exam.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full"
              >
                <CardHeader className="pb-2 space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        {exam.title}
                      </CardTitle>
                      <p className="text-xs text-gray-500">TOEIC Full Test</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="py-0 px-5 flex-grow">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-3 pb-2">
                    <div className="flex gap-3">
                      <div className="flex items-center">
                        <BookOpen className="h-3 w-3 mr-1 text-blue-600" />
                        <span>200</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-blue-600" />
                        <span>{longToString(Number(exam.duration))}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-start pt-1">
                    <div className="flex flex-col">
                      <div className="flex items-center text-xs text-gray-500 mb-0.5">
                        <Trophy className="h-3 w-3 mr-1 text-green-600" />
                        <span>Highest Score</span>
                      </div>
                      <div className="font-semibold text-md text-gray-800">
                        {exam.highestScore > 0 ? (
                          <span className="text-green-600">
                            {exam.highestScore}
                            <span className="text-xs text-gray-500 ml-1">
                              /990
                            </span>
                          </span>
                        ) : (
                          <span className="text-gray-400">--</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <div className="flex items-center text-xs text-gray-500 mb-0.5">
                        <Trophy className="h-3 w-3 mr-1 text-amber-600" />
                        <span>Attempts</span>
                      </div>
                      <div className="font-semibold text-md text-gray-800">
                        {exam.attempts}
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between items-center pt-3 pb-3 mt-auto bg-gray-50">
                  <div className="flex items-center text-xs text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>
                      {new Date(exam.createdDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-700 font-medium"
                    onClick={() => handleStartTest(exam.id)}
                  >
                    Start Test
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-blue-800 mb-2">
              📈 Improve Your TOEIC Score
            </h2>
            <p className="text-blue-700 max-w-xl">
              Join thousands of learners who achieved their target scores
              through consistent practice and improvement
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/decks">
              <Button
                size="lg"
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                Study Vocabulary
              </Button>
            </Link>
            <Link to="/exam">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Take Test
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
