import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  CheckCircle2,
  XCircle,
  Medal,
  ChevronRight,
  FileText,
} from 'lucide-react';
import GlobalSkeleton from '@/components/GlobalSkeleton';
import { ExamSubmissionResponse } from '@/types/questionType';
import { cn } from '@/lib/utils';

export default function ExamResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [result, setResult] = useState<ExamSubmissionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.examResult) {
      setResult(location.state.examResult);
      setLoading(false);
    } else {
      setError(
        'No result information available. Please return to the exam page and submit again.'
      );
      setLoading(false);
    }
  }, [location.state]);

  if (loading) {
    return <GlobalSkeleton />;
  }

  if (error || !result) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Error Loading Result
        </h1>
        <p className="text-gray-700 mb-8">{error || 'Result not found'}</p>
        <Button onClick={() => navigate('/exams')}>Back to Exams</Button>
      </div>
    );
  }

  // Calculate score percentage
  const scorePercentage = (result.totalScore / result.maxScore) * 100;

  // Data for charts
  const scoreDistributionData = [
    { name: 'Listening', value: result.listeningScore },
    { name: 'Reading', value: result.readingScore },
  ];

  const COLORS = ['#0088FE', '#00C49F'];

  // Create part data for the detail tab
  const partData = [
    { id: 1, name: 'Part 1: Photographs', type: 'Listening' },
    { id: 2, name: 'Part 2: Question-Response', type: 'Listening' },
    { id: 3, name: 'Part 3: Conversations', type: 'Listening' },
    { id: 4, name: 'Part 4: Talks', type: 'Listening' },
    { id: 5, name: 'Part 5: Incomplete Sentences', type: 'Reading' },
    { id: 6, name: 'Part 6: Text Completion', type: 'Reading' },
    { id: 7, name: 'Part 7: Reading Comprehension', type: 'Reading' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold">TOEIC Exam Results</h1>
                <p className="text-gray-500">
                  Completed on {new Date(result.completedAt).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate('/exams')}>
                  Back to Exams
                </Button>
                <Button>
                  <FileText className="mr-2 h-4 w-4" /> Download PDF
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6 text-center">
                  <Medal className="mx-auto h-8 w-8 text-blue-600 mb-2" />
                  <div className="text-4xl font-bold text-blue-700">
                    {result.totalScore}
                  </div>
                  <div className="text-sm text-blue-600">Total Score</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 px-4">
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Score</span>
                      <span className="font-medium">
                        {result.totalScore}/{result.maxScore}
                      </span>
                    </div>
                    <Progress value={scorePercentage} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="bg-blue-100 rounded p-2 text-center">
                      <div className="text-lg font-bold text-blue-800">
                        {result.listeningScore}
                      </div>
                      <div className="text-xs text-blue-700">Listening</div>
                    </div>

                    <div className="bg-green-100 rounded p-2 text-center">
                      <div className="text-lg font-bold text-green-800">
                        {result.readingScore}
                      </div>
                      <div className="text-xs text-green-700">Reading</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="parts">Part Details</TabsTrigger>
                <TabsTrigger value="answers">Your Answers</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Score Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={scoreDistributionData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, value, percent }) =>
                              `${name}: ${value} (${(percent * 100).toFixed(
                                0
                              )}%)`
                            }
                          >
                            {scoreDistributionData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">Strengths</h3>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          <li>Strong performance in Reading Comprehension</li>
                          <li>Good understanding of grammar patterns</li>
                          <li>Effective time management</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium">Areas for Improvement</h3>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          <li>Focus more on listening to conversations</li>
                          <li>Practice with photograph descriptions</li>
                          <li>
                            Improve vocabulary related to business contexts
                          </li>
                        </ul>
                      </div>

                      <div className="pt-4">
                        <h3 className="font-medium mb-2">
                          Recommended Practice
                        </h3>
                        <div className="space-y-2">
                          {[
                            'Listening Practice Sets',
                            'Vocabulary Building',
                            'Business English',
                          ].map(topic => (
                            <Link
                              key={topic}
                              to="/exercises"
                              className="flex items-center justify-between p-2 bg-blue-50 rounded hover:bg-blue-100"
                            >
                              <span>{topic}</span>
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="parts" className="p-4">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Performance by Part</h3>

                  <div className="space-y-4">
                    {partData.map(part => (
                      <Card key={part.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <h4 className="font-medium">{part.name}</h4>
                              <Badge
                                variant={
                                  part.type === 'Listening'
                                    ? 'default'
                                    : 'outline'
                                }
                              >
                                {part.type}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold">
                                {part.type === 'Listening'
                                  ? Math.round(result.listeningScore / 4)
                                  : Math.round(result.readingScore / 3)}
                              </div>
                              <div className="text-xs text-gray-500">
                                Estimated score
                              </div>
                            </div>
                          </div>
                          <Progress
                            value={
                              part.type === 'Listening'
                                ? ((result.listeningScore / 495) * 100) / 4
                                : ((result.readingScore / 495) * 100) / 3
                            }
                            className="h-2"
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="answers" className="p-4">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Your Answers</h3>
                    <div className="text-sm text-gray-500">
                      Detailed answers will be available soon
                    </div>
                  </div>

                  {/* Placeholder for answer review - In a real app you would map through actual answers */}
                  <div className="space-y-4">
                    {[1, 2, 3].map(num => (
                      <Card key={num}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div
                              className={cn(
                                'mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center',
                                num % 2 === 0 ? 'bg-green-100' : 'bg-red-100'
                              )}
                            >
                              {num % 2 === 0 ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h4 className="font-medium">Question {num}</h4>
                                <div className="text-sm">
                                  {num % 2 === 0 ? 'Correct' : 'Incorrect'}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                Sample question content would appear here. This
                                is placeholder text.
                              </p>
                              <div className="mt-3 grid grid-cols-2 gap-2">
                                <div
                                  className={cn(
                                    'p-2 rounded text-sm',
                                    num % 2 === 0
                                      ? 'bg-green-50 border border-green-200'
                                      : 'bg-gray-50 border border-gray-200'
                                  )}
                                >
                                  <div className="text-xs text-gray-500">
                                    Your answer
                                  </div>
                                  <div className="font-medium">
                                    {String.fromCharCode(65 + (num % 4))}
                                  </div>
                                </div>
                                <div
                                  className={cn(
                                    'p-2 rounded text-sm',
                                    'bg-green-50 border border-green-200'
                                  )}
                                >
                                  <div className="text-xs text-gray-500">
                                    Correct answer
                                  </div>
                                  <div className="font-medium">
                                    {num % 2 === 0
                                      ? String.fromCharCode(65 + (num % 4))
                                      : String.fromCharCode(
                                          65 + ((num + 1) % 4)
                                        )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center">
          <h3 className="text-xl font-medium mb-4">
            Keep improving your English skills
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center"
            >
              <div className="text-lg font-medium">Practice Tests</div>
              <div className="text-sm text-gray-500">
                Try more TOEIC practice tests
              </div>
            </Button>
            <Button className="h-auto py-4 flex flex-col items-center">
              <div className="text-lg font-medium">Study Plan</div>
              <div className="text-sm text-gray-200">
                Get a personalized study plan
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center"
            >
              <div className="text-lg font-medium">Weak Areas</div>
              <div className="text-sm text-gray-500">
                Focus on improving weak areas
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
