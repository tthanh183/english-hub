import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import GlobalSkeleton from '@/components/GlobalSkeleton';
import { getQuestionGroupsFromExercise } from '@/services/exerciseService';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import AudioPlayer from '@/components/AudioPlayer';
import { QuestionGroupResponse } from '@/types/questionType';

export default function ExercisePage() {
  const { courseId, exerciseId } = useParams();
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});

  const { data: questionGroups, isLoading: isQuestionsLoading } = useQuery<
    QuestionGroupResponse[]
  >({
    queryKey: ['questions', exerciseId],
    queryFn: () =>
      getQuestionGroupsFromExercise(courseId as string, exerciseId as string),
    enabled: !!exerciseId,
  });

  if (isQuestionsLoading) {
    return <GlobalSkeleton />;
  }

  const currentGroup = questionGroups?.[currentGroupIndex];
  const questions = currentGroup?.questions || [];

  const handleGroupNext = () => {
    if (currentGroupIndex < (questionGroups?.length || 0) - 1) {
      setCurrentGroupIndex(prev => prev + 1);
    }
  };

  const handleGroupPrevious = () => {
    if (currentGroupIndex > 0) {
      setCurrentGroupIndex(prev => prev - 1);
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Timer */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-full shadow-md px-6 py-2 flex items-center">
          <div className="text-xl font-bold text-gray-800">00:00:01</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="mb-4">
          {currentGroup?.audioUrl && (
            <AudioPlayer src={currentGroup.audioUrl} />
          )}

          {currentGroup?.imageUrl && (
            <div className="flex justify-center my-4">
              <img
                src={currentGroup.imageUrl}
                alt="TOEIC question"
                width={200}
                height={200}
                className="rounded-lg"
              />
            </div>
          )}

          {currentGroup?.passage && (
            <div className="bg-gray-50 p-4 rounded-lg my-6">
              <p>{currentGroup.passage}</p>
            </div>
          )}
        </div>

        {/* Questions in group */}
        <div className="space-y-10">
          {questions.map((question, index) => (
            <div key={question.id} className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-3">
                {question.title || `Question ${index + 1}`}
              </h3>
              <RadioGroup
                value={selectedAnswers[question.id] || ''}
                onValueChange={value => handleAnswerChange(question.id, value)}
                className="space-y-3"
              >
                {['A', 'B', 'C', 'D'].map(option => {
                  const value =
                    question[`choice${option}` as keyof typeof question];

                  if (value === null) return null;

                  return (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={option}
                        id={`${question.id}-${option}`}
                      />
                      <Label htmlFor={`${question.id}-${option}`}>
                        {`${option}. ${value || ''}`}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-10">
          <Button
            variant="outline"
            onClick={handleGroupPrevious}
            disabled={currentGroupIndex === 0}
          >
            Previous Group
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleGroupNext}
            disabled={currentGroupIndex === (questionGroups?.length || 0) - 1}
          >
            Next Group
          </Button>
        </div>
      </div>
    </div>
  );
}
