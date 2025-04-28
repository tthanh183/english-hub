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
import {
  Clock,
  BookOpen,
  BarChart3,
  Calendar,
  Trophy,
} from 'lucide-react';

export default function MockTestsPage() {
  const mockTests = [
    {
      id: 1,
      title: 'TOEIC Full Test 1',
      description:
        'A full TOEIC test with 200 questions, including Listening and Reading sections',
      questions: 200,
      time: 120,
      difficulty: 'Intermediate',
      attempts: 1243,
      avgScore: 650,
      lastUpdated: '15/04/2023',
      premium: false,
    },
    {
      id: 2,
      title: 'TOEIC Full Test 2',
      description:
        'A full TOEIC test with 200 questions, including Listening and Reading sections',
      questions: 200,
      time: 120,
      difficulty: 'Hard',
      attempts: 987,
      avgScore: 680,
      lastUpdated: '22/05/2023',
      premium: false,
    },
    {
      id: 3,
      title: 'TOEIC Full Test 3',
      description:
        'A full TOEIC test with 200 questions, including Listening and Reading sections',
      questions: 200,
      time: 120,
      difficulty: 'Intermediate',
      attempts: 756,
      avgScore: 670,
      lastUpdated: '10/06/2023',
      premium: true,
    },
    {
      id: 4,
      title: 'TOEIC Mini Test 1',
      description:
        'A shortened TOEIC test with 100 questions, 60 minutes duration',
      questions: 100,
      time: 60,
      difficulty: 'Easy',
      attempts: 2156,
      avgScore: 450,
      lastUpdated: '05/03/2023',
      premium: false,
    },
    {
      id: 5,
      title: 'TOEIC Mini Test 2',
      description:
        'A shortened TOEIC test with 100 questions, 60 minutes duration',
      questions: 100,
      time: 60,
      difficulty: 'Intermediate',
      attempts: 1876,
      avgScore: 480,
      lastUpdated: '18/04/2023',
      premium: true,
    },
    {
      id: 6,
      title: 'TOEIC Listening Only',
      description:
        'A test focusing only on the Listening section with 100 questions',
      questions: 100,
      time: 45,
      difficulty: 'Intermediate',
      attempts: 1543,
      avgScore: 380,
      lastUpdated: '25/05/2023',
      premium: false,
    },
  ];

  const difficultyColor = {
    Easy: 'bg-green-100 text-green-800 border-green-200',
    Intermediate: 'bg-amber-100 text-amber-800 border-amber-200',
    Hard: 'bg-red-100 text-red-800 border-red-200',
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
        {mockTests.map(test => (
          <Card
            key={test.id}
            className="overflow-hidden hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{test.title}</CardTitle>
                {test.premium && (
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    Premium
                  </Badge>
                )}
              </div>
              <CardDescription>{test.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <span>{test.questions} questions</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{test.time} minutes</span>
                </div>
                <div className="flex items-center">
                  <Badge
                    variant="outline"
                    className={
                      difficultyColor[
                        test.difficulty as keyof typeof difficultyColor
                      ]
                    }
                  >
                    {test.difficulty}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center text-gray-500 mb-1">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    <span>Average Score</span>
                  </div>
                  <div className="font-semibold">{test.avgScore}/990</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center text-gray-500 mb-1">
                    <Trophy className="h-4 w-4 mr-1" />
                    <span>Attempts</span>
                  </div>
                  <div className="font-semibold">{test.attempts}</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center pt-3 border-t">
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Updated: {test.lastUpdated}</span>
              </div>
              <Link to={test.premium ? '/pricing' : `/exams/${test.id}`}>
                <Button
                  className={
                    test.premium
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }
                >
                  {test.premium ? 'Upgrade' : 'Start'}
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
