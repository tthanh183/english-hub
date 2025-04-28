import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Play,
  Volume2,
  RotateCcw,
  Flag,
  Clock,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

export default function ExamDetailPage() {
  const [currentPart, setCurrentPart] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [showQuestionNav, setShowQuestionNav] = useState(true);

  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Mock test data
  const testParts = [
    { id: 1, name: 'Part 1', questions: 6, description: 'Photos' },
    { id: 2, name: 'Part 2', questions: 25, description: 'Question-Response' },
    { id: 3, name: 'Part 3', questions: 39, description: 'Conversations' },
    { id: 4, name: 'Part 4', questions: 30, description: 'Talks' },
    { id: 5, name: 'Part 5', questions: 30, description: 'Incomplete Sentences' },
    { id: 6, name: 'Part 6', questions: 16, description: 'Text Completion' },
    { id: 7, name: 'Part 7', questions: 54, description: 'Reading Comprehension' },
  ];

  const totalQuestions = testParts.reduce((acc, part) => acc + part.questions, 0);
  const answeredQuestions = Object.keys(selectedAnswers).length;
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;

  // Generate mock questions for the current part
  const generateQuestionsForPart = (partId: number) => {
    const part = testParts.find(p => p.id === partId);
    if (!part) return [];

    return Array.from({ length: part.questions }, (_, i) => {
      const questionNumber = i + 1;
      return {
        id: `${partId}-${questionNumber}`,
        number: questionNumber,
        text:
          partId === 5
            ? `${questionNumber}. The marketing department has prepared ________ for the new product launch next month.`
            : `${questionNumber}. ${
                partId <= 4 ? '[Audio Question]' : 'Question text would appear here'
              }`,
        options:
          partId === 5
            ? [
                { value: 'A', label: 'a variety of materials' },
                { value: 'B', label: 'a various material' },
                { value: 'C', label: 'various of materials' },
                { value: 'D', label: 'variety of material' },
              ]
            : [
                { value: 'A', label: 'Option A' },
                { value: 'B', label: 'Option B' },
                { value: 'C', label: 'Option C' },
                { value: 'D', label: 'Option D' },
              ],
        hasImage: partId === 1,
      };
    });
  };

  const currentPartQuestions = generateQuestionsForPart(currentPart);

  const toggleFlagQuestion = (questionNumber: number) => {
    if (flaggedQuestions.includes(questionNumber)) {
      setFlaggedQuestions(flaggedQuestions.filter(q => q !== questionNumber));
    } else {
      setFlaggedQuestions([...flaggedQuestions, questionNumber]);
    }
  };

  const handleAnswerSelect = (questionId: string, value: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: value,
    });
  };

  const scrollToQuestion = (questionNumber: number) => {
    const ref = questionRefs.current[`${currentPart}-${questionNumber}`];
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveQuestion(questionNumber);

      // Reset active question after a delay
      setTimeout(() => {
        setActiveQuestion(null);
      }, 2000);
    }
  };

  // Reset question refs when part changes
  useEffect(() => {
    questionRefs.current = {};
  }, [currentPart]);

  return (
    <div className={cn('min-h-screen', isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50')}>
      {/* Header */}
      <div className="flex justify-end p-4">
        <div
          className={cn(
            'flex items-center px-4 py-2 rounded-full',
            isDarkMode ? 'bg-gray-700' : 'bg-blue-100'
          )}
        >
          <Clock
            className={cn('h-5 w-5 mr-2', isDarkMode ? 'text-blue-400' : 'text-blue-600')}
          />
          <span className="text-lg font-bold">01:55:38</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row relative">
        {/* Sidebar */}
        <div className="hidden lg:block w-64 mr-8">
          <div
            className={cn(
              'rounded-lg p-4 mb-6 sticky top-24',
              isDarkMode ? 'bg-gray-800' : 'bg-white shadow-sm'
            )}
          >
            <div className="mb-4">
              <h3 className="font-medium mb-2">Progress</h3>
              <Progress value={progressPercentage} className={isDarkMode ? 'bg-gray-700' : ''} />
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
                      ? isDarkMode
                        ? 'bg-blue-900 text-blue-100'
                        : 'bg-blue-100 text-blue-800'
                      : isDarkMode
                      ? 'hover:bg-gray-700'
                      : 'hover:bg-gray-100'
                  )}
                  onClick={() => setCurrentPart(part.id)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{part.name}</span>
                    <span className="text-sm">{part.questions} questions</span>
                  </div>
                  <div className="text-sm opacity-80">{part.description}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2 mt-6">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Pause</Button>
              <Button variant="destructive" className="w-full">
                Submit
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Part header */}
          <div
            className={cn(
              'rounded-lg p-4 mb-6',
              isDarkMode ? 'bg-gray-800' : 'bg-white shadow-sm'
            )}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {testParts.find(p => p.id === currentPart)?.name}:{' '}
                {testParts.find(p => p.id === currentPart)?.description}
              </h2>
              <div className="text-sm">
                {
                  Object.keys(selectedAnswers).filter(key =>
                    key.startsWith(`${currentPart}-`)
                  ).length
                }
                /{testParts.find(p => p.id === currentPart)?.questions} questions answered
              </div>
            </div>
          </div>

          {/* Questions list */}
          <div className="space-y-8 mb-8 lg:pr-20">
            {currentPartQuestions.map(question => (
              <div
                key={question.id}
                ref={el => (questionRefs.current[question.id] = el)}
                className={cn(
                  'rounded-lg p-6 transition-all',
                  activeQuestion === question.number
                    ? isDarkMode
                      ? 'bg-blue-900/20 border border-blue-500'
                      : 'bg-blue-50 border border-blue-200'
                    : isDarkMode
                    ? 'bg-gray-800'
                    : 'bg-white shadow-sm'
                )}
              >
                {/* Question header */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Question {question.number}.</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFlagQuestion(question.number)}
                    className={cn(
                      flaggedQuestions.includes(question.number)
                        ? 'text-red-500 border-red-500'
                        : isDarkMode
                        ? 'border-gray-600'
                        : ''
                    )}
                  >
                    <Flag
                      className={cn(
                        'h-4 w-4 mr-2',
                        flaggedQuestions.includes(question.number)
                          ? 'fill-red-500'
                          : ''
                      )}
                    />
                    {flaggedQuestions.includes(question.number) ? 'Flagged' : 'Flag'}
                  </Button>
                </div>

                {/* Audio player for listening parts */}
                {currentPart <= 4 && (
                  <div
                    className={cn(
                      'p-4 rounded-lg mb-6',
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}
                      >
                        <Play className="h-5 w-5" />
                      </Button>
                      <div className="flex-1">
                        <Slider defaultValue={[20]} max={100} step={1} className="h-2" />
                      </div>
                      <div className="text-sm text-gray-500">00:00 / 00:24</div>
                      <Button variant="ghost" size="icon">
                        <Volume2 className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <div className="text-sm">1x</div>
                    </div>
                  </div>
                )}

                {/* Question content */}
                <div className="mb-6">
                  {/* For Part 1 - Photo */}
                  {question.hasImage && (
                    <div className="flex justify-center mb-6">
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-35HNgMZrimt028keVkliJdvedqWOqa.png"
                        alt={`Question ${question.number}`}
                        width={500}
                        height={400}
                        className="rounded-lg"
                      />
                    </div>
                  )}

                  {/* Question text */}
                  {!question.hasImage && <p className="text-lg mb-4">{question.text}</p>}

                  {/* Answer options */}
                  <RadioGroup
                    value={selectedAnswers[question.id]}
                    onValueChange={value => handleAnswerSelect(question.id, value)}
                    className="space-y-4"
                  >
                    {question.options.map(option => (
                      <div
                        key={option.value}
                        className={cn(
                          'flex items-center space-x-3 p-3 rounded-md',
                          selectedAnswers[question.id] === option.value
                            ? isDarkMode
                              ? 'bg-blue-900'
                              : 'bg-blue-50'
                            : isDarkMode
                            ? 'hover:bg-gray-700'
                            : 'hover:bg-gray-50'
                        )}
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`${question.id}-${option.value}`}
                        />
                        <Label
                          htmlFor={`${question.id}-${option.value}`}
                          className="flex-1 cursor-pointer"
                        >
                          ({option.value}) {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom navigation */}
          <div
            className={cn(
              'rounded-lg overflow-hidden mb-6',
              isDarkMode ? 'bg-gray-800' : 'bg-white shadow-sm'
            )}
          >
            <div className="overflow-x-auto">
              <div className="flex min-w-max">
                {testParts.map(part => (
                  <div
                    key={part.id}
                    className={cn(
                      'px-6 py-4 text-center border-b-2 cursor-pointer min-w-[120px]',
                      currentPart === part.id
                        ? isDarkMode
                          ? 'border-blue-500 text-blue-400'
                          : 'border-blue-600 text-blue-600'
                        : isDarkMode
                        ? 'border-gray-700'
                        : 'border-gray-200'
                    )}
                    onClick={() => setCurrentPart(part.id)}
                  >
                    <div className="font-medium">{part.name}</div>
                    <div className="text-xs mt-1 opacity-80">
                      {
                        Object.keys(selectedAnswers).filter(key =>
                          key.startsWith(`${part.id}-`)
                        ).length
                      }
                      /{part.questions} questions
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile action buttons */}
          <div className="lg:hidden flex space-x-2 mb-6">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Pause</Button>
            <Button variant="destructive" className="flex-1">
              Submit
            </Button>
          </div>
        </div>

        {/* Question navigation sidebar - fixed on right */}
        <div
          className={cn(
            'fixed right-4 top-24 bottom-24 z-40 transition-all duration-300 flex',
            showQuestionNav ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          {/* Toggle button */}
          <Button
            size="sm"
            variant="outline"
            className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full h-24 w-8 rounded-l-md rounded-r-none',
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
            )}
            onClick={() => setShowQuestionNav(!showQuestionNav)}
          >
            {showQuestionNav ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>

          {/* Question numbers */}
          <div
            className={cn(
              'w-16 overflow-y-auto rounded-l-lg p-2 flex flex-col gap-2',
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white shadow-lg'
            )}
          >
            {Array.from(
              { length: testParts[currentPart - 1].questions },
              (_, i) => i + 1
            ).map(num => (
              <button
                key={num}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all',
                  activeQuestion === num
                    ? 'ring-2 ring-offset-2 ring-blue-500'
                    : '',
                  selectedAnswers[`${currentPart}-${num}`]
                    ? isDarkMode
                      ? 'bg-blue-900 text-blue-100'
                      : 'bg-blue-100 text-blue-800'
                    : flaggedQuestions.includes(num)
                    ? isDarkMode
                      ? 'bg-red-900 text-red-100'
                      : 'bg-red-100 text-red-800'
                    : isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-100 hover:bg-gray-200'
                )}
                onClick={() => scrollToQuestion(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Scroll to top button */}
        <Button
          size="icon"
          className="fixed bottom-6 right-6 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-40"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
