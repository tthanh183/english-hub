import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
        {exams.map(exam => (
          <Card
            key={exam.id}
            className="overflow-hidden hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{exam.title}</CardTitle>
                {exam.premium && (
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    Premium
                  </Badge>
                )}
              </div>
              <CardDescription>{exam.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <span>200 questions</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{longToString(exam.duration)} minutes</span>
                </div>
                <div className="flex items-center">
                  <Badge
                    variant="outline"
                    className={
                      difficultyColor[
                        exam.difficulty as keyof typeof difficultyColor
                      ]
                    }
                  >
                    {exam.difficulty}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center text-gray-500 mb-1">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    <span>Average Score</span>
                  </div>
                  <div className="font-semibold">{exam.avgScore}/990</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center text-gray-500 mb-1">
                    <Trophy className="h-4 w-4 mr-1" />
                    <span>Attempts</span>
                  </div>
                  <div className="font-semibold">{exam.attempts}</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center pt-3 border-t">
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Updated: {exam.lastUpdated}</span>
              </div>
              <Link to={exam.premium ? '/pricing' : `/exams/${exam.id}`}>
                <Button
                  className={
                    exam.premium
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }
                >
                  {exam.premium ? 'Upgrade' : 'Start'}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
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
