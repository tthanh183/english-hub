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
import { Check, X } from 'lucide-react';

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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md border p-6 mb-8">
        <div className="mb-6">
          {currentGroup?.audioUrl && (
            <div className="mb-4">
              <AudioPlayer
                key={currentGroup.audioUrl}
                src={currentGroup.audioUrl}
              />
            </div>
          )}

          {currentGroup?.imageUrl && (
            <div
              className="flex justify-center items-center my-4"
              style={{ height: '400px' }}
            >
              <img
                src={currentGroup.imageUrl}
                alt="TOEIC question"
                className="rounded-lg shadow-md"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>
          )}

          {currentGroup?.passage && (
            <div className="bg-gray-50 p-5 rounded-lg my-6 shadow-inner">
              <p className="text-gray-800 leading-relaxed">
                {currentGroup.passage}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-12">
          {questions.map((question, index) => {
            const isAnswered = !!selectedAnswers[question.id];
            const isCorrect =
              selectedAnswers[question.id] === question.correctAnswer;

            return (
              <div key={question.id} className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  {question.title || `Question ${index + 1}`}
                </h3>

                <RadioGroup
                  value={selectedAnswers[question.id] || ''}
                  onValueChange={value =>
                    handleAnswerChange(question.id, value)
                  }
                  className="space-y-3"
                >
                  {['A', 'B', 'C', 'D'].map(option => {
                    const value =
                      question[`choice${option}` as keyof typeof question];
                    if (value === null) return null;

                    const isSelected = selectedAnswers[question.id] === option;
                    const isCorrectOption = question.correctAnswer === option;

                    // Xác định class cho mỗi option
                    let optionClass =
                      'cursor-pointer flex items-center p-3 rounded-lg border transition-all duration-200';

                    if (isAnswered) {
                      if (isCorrectOption) {
                        optionClass += ' bg-green-50 border-green-500';
                      } else if (isSelected) {
                        optionClass += ' bg-red-50 border-red-500';
                      } else {
                        optionClass += ' bg-gray-50 border-gray-200';
                      }
                    } else {
                      optionClass +=
                        ' hover:bg-blue-50 hover:border-blue-300 border-gray-200';
                    }

                    return (
                      <div
                        key={option}
                        className={optionClass}
                        onClick={() => {
                          if (!isAnswered) {
                            handleAnswerChange(question.id, option);
                          }
                        }}
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0 mr-3 flex items-center justify-center">
                            <RadioGroupItem
                              value={option}
                              id={`${question.id}-${option}`}
                              disabled={isAnswered}
                              className="h-5 w-5"
                            />
                          </div>

                          <div className="flex-1 flex items-center">
                            <Label
                              htmlFor={`${question.id}-${option}`}
                              className={`text-gray-700 cursor-pointer leading-normal pt-0.5 ${
                                isAnswered ? 'cursor-default' : ''
                              }`}
                            >
                              <span className="font-medium">{option}.</span>{' '}
                              {value !== null && value !== undefined
                                ? String(value)
                                : ''}
                            </Label>
                          </div>
                        </div>

                        {isAnswered && (
                          <div className="flex-shrink-0 ml-2 flex items-center">
                            {isSelected && (
                              <span
                                className={`inline-flex items-center text-sm font-medium rounded-full px-2 py-1 ${
                                  isCorrect
                                    ? 'text-green-700 bg-green-100'
                                    : 'text-red-700 bg-red-100'
                                }`}
                              >
                                {isCorrect ? (
                                  <Check className="h-4 w-4 mr-1" />
                                ) : (
                                  <X className="h-4 w-4 mr-1" />
                                )}
                                {isCorrect ? 'Correct' : 'Incorrect'}
                              </span>
                            )}
                            {isCorrectOption && !isSelected && (
                              <span className="inline-flex items-center text-sm font-medium text-green-700 bg-green-100 rounded-full px-2 py-1">
                                <Check className="h-4 w-4 mr-1" />
                                Correct
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between mt-10 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleGroupPrevious}
            disabled={currentGroupIndex === 0}
            className="px-6"
          >
            Previous
          </Button>

          <div className="text-sm font-medium text-gray-500">
            {currentGroupIndex + 1} / {questionGroups?.length || 0}
          </div>

          <Button
            onClick={handleGroupNext}
            disabled={currentGroupIndex === (questionGroups?.length || 0) - 1}
            className="bg-blue-600 hover:bg-blue-700 px-6"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
