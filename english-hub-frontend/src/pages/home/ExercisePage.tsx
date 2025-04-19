import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Play, Volume2, RotateCcw, Flag } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import GlobalSkeleton from '@/components/GlobalSkeleton';
import {
  getExerciseById,
  getQuestionsFromExercise,
} from '@/services/exerciseService';
import { useQuery } from '@tanstack/react-query';

export default function ExercisePage() {
  const { courseId, exerciseId } = useParams();

  const { data: exercise, isLoading: isExerciseLoading } = useQuery({
    queryKey: ['exercise'],
    queryFn: () => getExerciseById(courseId as string, exerciseId as string),
    enabled: !!exerciseId,
  });

  const { data: quesitons, isLoading: isQuestionsLoading } = useQuery({
    queryKey: ['questions', exerciseId],
    queryFn: () =>
      getQuestionsFromExercise(courseId as string, exerciseId as string),
    enabled: !!exerciseId,
  });

  if (isExerciseLoading || isQuestionsLoading) {
    return <GlobalSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Timer */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-full shadow-md px-6 py-2 flex items-center">
          <div className="text-xl font-bold text-gray-800">00:00:01</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{exercise?.title}</h2>

          {/* Audio Player */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-blue-600">
                <Play className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <Slider
                  defaultValue={[20]}
                  max={100}
                  step={1}
                  className="h-2"
                />
              </div>
              <div className="text-sm text-gray-500">00:00 / 00:19</div>
              <Button variant="ghost" size="icon">
                <Volume2 className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <div className="text-sm">1x</div>
            </div>
          </div>

          {/* Image */}
          <div className="flex justify-center mb-6">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Mn4MGGRLigONWEKwfmItEHcmyGuAns.png"
              alt="TOEIC question"
              width={400}
              height={300}
              className="rounded-lg"
            />
          </div>

          {/* Answer Options */}
          <RadioGroup className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="A" id="option-A" />
              <Label htmlFor="option-A">(A)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="B" id="option-B" />
              <Label htmlFor="option-B">(B)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="C" id="option-C" />
              <Label htmlFor="option-C">(C)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="D" id="option-D" />
              <Label htmlFor="option-D">(D)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-between mt-8">
          <Button variant="outline" disabled>
            Previous
          </Button>
          <Button variant="outline" className="text-blue-600 border-blue-600">
            <Flag className="h-4 w-4 mr-2" />
            Flag for review
          </Button>
          <Link to="/practice/listening/part-1/test-1/question-2">
            <Button className="bg-blue-600 hover:bg-blue-700">Next</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
