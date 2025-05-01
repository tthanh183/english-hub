import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, BarChart3, Calendar, Trophy } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAllExams } from '@/services/examService';
import GlobalSkeleton from '@/components/GlobalSkeleton';
import { longToString } from '@/utils/timeUtil';

export default function ExamPage() {
  const { data: exams, isLoading } = useQuery({
    queryKey: ['exams'],
    queryFn: getAllExams,
  });

  const difficultyColor = {
    Easy: 'bg-green-100 text-green-800 border-green-200',
    Intermediate: 'bg-amber-100 text-amber-800 border-amber-200',
    Hard: 'bg-red-100 text-red-800 border-red-200',
  };

  if (isLoading) {
    return <GlobalSkeleton />;
  }

  const defaultExamData = {
    title: 'TOEIC Test',
    totalQuestions: 200,
    duration: 7200000,
    difficulty: 'Intermediate',
    avgScore: 650,
    attempts: 0,
    createdDate: new Date().toISOString(),
    premium: false,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          TOEIC Mock Tests
        </h1>
        <p className="text-gray-600">
          Practice with real TOEIC tests, updated regularly with detailed
          answers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {exams &&
          exams.map(exam => {
            const displayExam = { ...defaultExamData, ...exam };

            return (
              <Card
                key={displayExam.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full"
              >
                {/* Card Header with Title and Premium Badge - Removed border-b */}
                <CardHeader className="pb-2 space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        {displayExam.title}
                      </CardTitle>
                      <p className="text-xs text-gray-500">TOEIC Full Test</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {displayExam.difficulty === 'Hard' && (
                        <span className="inline-flex">
                          <svg
                            className="w-4 h-4 text-amber-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        </span>
                      )}
                      {displayExam.premium && (
                        <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 text-xs font-medium py-0.5">
                          Premium
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                {/* Card Content with Test Info and Stats */}
                <CardContent className="py-0 px-5 flex-grow">
                  {/* Test Info Row - Subtle separator with padding only */}
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-3 pb-2">
                    <div className="flex gap-3">
                      <div className="flex items-center">
                        <BookOpen className="h-3 w-3 mr-1 text-blue-600" />
                        <span>{displayExam.totalQuestions}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-blue-600" />
                        <span>
                          {longToString(Number(displayExam.duration))}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs px-2 py-0.5 ${
                        difficultyColor[
                          displayExam.difficulty as keyof typeof difficultyColor
                        ] || 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}
                    >
                      {displayExam.difficulty}
                    </Badge>
                  </div>

                  {/* Combined Stats Row - Using shadow divider instead of border */}
                  <div className="flex justify-between items-center pt-1">
                    <div className="flex flex-col">
                      <div className="flex items-center text-xs text-gray-500 mb-0.5">
                        <BarChart3 className="h-3 w-3 mr-1 text-blue-600" />
                        <span>Average Score</span>
                      </div>
                      <div className="font-semibold text-md text-gray-800">
                        {displayExam.avgScore}
                        <span className="text-xs text-gray-500 ml-1">/990</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <div className="flex items-center text-xs text-gray-500 mb-0.5">
                        <Trophy className="h-3 w-3 mr-1 text-amber-600" />
                        <span>Attempts</span>
                      </div>
                      <div className="font-semibold text-md text-gray-800">
                        {displayExam.attempts}
                      </div>
                    </div>
                  </div>
                </CardContent>

                {/* Card Footer - Use shadow separator instead of border */}
                <CardFooter className="flex justify-between items-center pt-3 pb-3 mt-auto bg-gray-50">
                  <div className="flex items-center text-xs text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>
                      {new Date(displayExam.createdDate).toLocaleDateString(
                        'en-US',
                        {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        }
                      )}
                    </span>
                  </div>
                  <Link
                    to={
                      displayExam.premium
                        ? '/pricing'
                        : `/exams/${displayExam.id}`
                    }
                  >
                    <Button
                      size="sm"
                      variant={displayExam.premium ? 'outline' : 'default'}
                      className={
                        displayExam.premium
                          ? 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50 font-medium'
                          : 'bg-blue-600 hover:bg-blue-700 font-medium'
                      }
                    >
                      {displayExam.premium ? 'Upgrade' : 'Start Test'}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-blue-800 mb-2">
              Upgrade to Premium
            </h2>
            <p className="text-blue-700 max-w-xl">
              Get unlimited access to all TOEIC tests, detailed answers, and
              personal score analysis
            </p>
          </div>
          <Link to="/pricing">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              View Premium Plans
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
