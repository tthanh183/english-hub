import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Medal, ArrowLeft } from 'lucide-react';
import GlobalSkeleton from '@/components/GlobalSkeleton';
import { ExamSubmissionResponse } from '@/types/questionType';
import { ROUTES } from '@/constants/routes';

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
      setError('No result information available.');
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

  const scorePercentage = (result.totalScore / result.maxScore) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(ROUTES.EXAM)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Exams
        </Button>

        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Your TOEIC Result</h1>
          <p className="text-gray-600">
            Completed on {new Date(result.completedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Medal className="h-10 w-10 text-blue-600" />
            </div>
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {result.totalScore}
            </div>
            <div className="text-gray-500 mb-4">out of {result.maxScore}</div>
            <Progress value={scorePercentage} className="max-w-md mx-auto" />
            <div className="text-sm text-gray-500 mt-2">
              {Math.round(scorePercentage)}% Score
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Listening</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold mb-2 text-blue-600">
              {result.listeningScore}
            </div>
            <div className="text-gray-500">out of 495</div>
            <Progress
              value={(result.listeningScore / 495) * 100}
              className="mt-3"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Reading</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold mb-2 text-blue-600">
              {result.readingScore}
            </div>
            <div className="text-gray-500">out of 495</div>
            <Progress
              value={(result.readingScore / 495) * 100}
              className="mt-3"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
