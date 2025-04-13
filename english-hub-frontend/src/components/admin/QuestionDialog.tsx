import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trash, Plus, Mic } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  QUESTION_TYPE_DISPLAY,
  QuestionResponse,
  QuestionType,
} from '@/types/questionType';
import Part1Dialog from '@/components/admin/Part1Dialog';
import Part2Dialog from './Part2Dialog';
import Part3Dialog from './Part3Dialog';

type QuestionDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  exerciseId?: string;
  question?: QuestionResponse;
};

export default function QuestionDialog({
  isOpen,
  onOpenChange,
  exerciseId,
  question,
}: QuestionDialogProps) {
  const isEditMode = !!question;

  const [selectedPart, setSelectedPart] = useState<QuestionType>(
    isEditMode ? question.questionType : QuestionType.PART_1_PHOTOGRAPHS
  );

  useEffect(() => {
    if (question) {
      setSelectedPart(question.questionType);
    } else {
      setSelectedPart(QuestionType.PART_1_PHOTOGRAPHS);
    }
  }, [question]);

  useEffect(() => {
    if (!isOpen && !isEditMode) {
      setSelectedPart(QuestionType.PART_1_PHOTOGRAPHS);
    }
  }, [isOpen, isEditMode]);

  const getPartDescription = (part: string): string => {
    switch (part) {
      case QuestionType.PART_1_PHOTOGRAPHS:
        return 'Upload a photograph, audio file, and create four answer options';
      case QuestionType.PART_2_QUESTION_RESPONSES:
        return 'Upload an audio file with a question and create three answer options';
      case QuestionType.PART_3_CONVERSATIONS:
        return 'Upload an audio conversation and create multiple questions with options';
      case QuestionType.PART_4_TALKS:
        return 'Upload an audio talk and create multiple questions with options';
      case QuestionType.PART_5_INCOMPLETE_SENTENCES:
        return 'Create an incomplete sentence with four answer options';
      case QuestionType.PART_6_TEXT_COMPLETION:
        return 'Create a text passage with blanks and answer options for each blank';
      case QuestionType.PART_7_READING_COMPREHENSION:
        return 'Create a reading passage with multiple questions';
      default:
        return '';
    }
  };

  const renderPartContent = (part: string) => {
    switch (part) {
      case QuestionType.PART_1_PHOTOGRAPHS:
        return <Part1Dialog exerciseId={exerciseId} question={question} />;

      case QuestionType.PART_2_QUESTION_RESPONSES:
        return <Part2Dialog exerciseId={exerciseId} question={question} />;

      case QuestionType.PART_3_CONVERSATIONS:
        return <Part3Dialog exerciseId={exerciseId} question={question} />;

      case QuestionType.PART_4_TALKS:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Talk Audio</Label>
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 text-center aspect-square max-h-60">
                  <Mic className="h-8 w-8 text-gray-400" />
                  <div className="text-sm text-gray-500">
                    Drag and drop an audio file, or click to browse
                  </div>
                  <Button variant="outline" size="sm">
                    Upload Audio
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="p4-transcript">Talk Transcript</Label>
                <Textarea
                  id="p4-transcript"
                  placeholder="Enter the transcript of the talk"
                  rows={10}
                  className="h-full min-h-[200px]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base font-medium">Questions</Label>
                <Button variant="outline" size="sm" className="gap-1">
                  <Plus className="h-4 w-4" /> Add Question
                </Button>
              </div>

              {/* Question 1 */}
              <Card className="mb-4">
                <CardHeader className="py-3 px-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Question 1</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="py-3 px-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="p4-q1">Question Text</Label>
                      <Input id="p4-q1" placeholder="Enter the question" />
                    </div>

                    <div>
                      <Label className="mb-2 block">Answer Options</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map(num => (
                          <div
                            key={num}
                            className={`border rounded-md p-3 ${
                              num === 1
                                ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10'
                                : ''
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <RadioGroup
                                defaultValue="q1-option1"
                                className="flex"
                              >
                                <RadioGroupItem
                                  value={`p4-q1-option${num}`}
                                  id={`p4-q1-option${num}`}
                                  checked={num === 1}
                                />
                              </RadioGroup>
                              <Label
                                htmlFor={`p4-q1-option${num}`}
                                className="flex items-center gap-2"
                              >
                                Option {String.fromCharCode(64 + num)}
                                {num === 1 && (
                                  <span className="text-xs text-green-600 font-normal">
                                    (Correct)
                                  </span>
                                )}
                              </Label>
                            </div>
                            <Input
                              id={`p4-q1-option${num}-text`}
                              placeholder={`Enter option ${num}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case QuestionType.PART_5_INCOMPLETE_SENTENCES:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="p5-sentence">Incomplete Sentence</Label>
              <Textarea
                id="p5-sentence"
                placeholder="Enter the incomplete sentence (use '____' to indicate the blank)"
                rows={3}
              />
            </div>

            <div>
              <Label>Answer Options</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {[1, 2, 3, 4].map(num => (
                  <div
                    key={num}
                    className={`border rounded-md p-4 ${
                      num === 1
                        ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <RadioGroup defaultValue="option1" className="flex">
                        <RadioGroupItem
                          value={`option${num}`}
                          id={`p5-option${num}`}
                          checked={num === 1}
                        />
                      </RadioGroup>
                      <Label
                        htmlFor={`p5-option${num}`}
                        className="flex items-center gap-2 font-medium"
                      >
                        Option {String.fromCharCode(64 + num)}
                        {num === 1 && (
                          <span className="text-xs text-green-600 font-normal">
                            (Correct)
                          </span>
                        )}
                      </Label>
                    </div>
                    <Input
                      id={`p5-option${num}-text`}
                      placeholder={`Enter option ${num}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="p5-explanation">Explanation (Optional)</Label>
              <Textarea
                id="p5-explanation"
                placeholder="Explain why the correct answer is correct"
                rows={3}
              />
            </div>
          </div>
        );

      case QuestionType.PART_6_TEXT_COMPLETION:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="p6-passage">Text Passage</Label>
              <Textarea
                id="p6-passage"
                placeholder="Enter the passage with blanks (use '[____]' to indicate blanks)"
                rows={6}
              />
            </div>

            <div className="border rounded-md p-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-medium">Blank 1</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {[1, 2, 3, 4].map(num => (
                  <div
                    key={num}
                    className={`border rounded-md p-4 ${
                      num === 1
                        ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <RadioGroup defaultValue="option1" className="flex">
                        <RadioGroupItem
                          value={`b1-option${num}`}
                          id={`b1-option${num}`}
                          checked={num === 1}
                        />
                      </RadioGroup>
                      <Label
                        htmlFor={`b1-option${num}`}
                        className="flex items-center gap-2 font-medium"
                      >
                        Option {String.fromCharCode(64 + num)}
                        {num === 1 && (
                          <span className="text-xs text-green-600 font-normal">
                            (Correct)
                          </span>
                        )}
                      </Label>
                    </div>
                    <Input
                      id={`b1-option${num}-text`}
                      placeholder={`Enter option ${num}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-medium">Blank 2</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {[1, 2, 3, 4].map(num => (
                  <div
                    key={num}
                    className={`border rounded-md p-4 ${
                      num === 2
                        ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <RadioGroup defaultValue="option2" className="flex">
                        <RadioGroupItem
                          value={`b2-option${num}`}
                          id={`b2-option${num}`}
                          checked={num === 2}
                        />
                      </RadioGroup>
                      <Label
                        htmlFor={`b2-option${num}`}
                        className="flex items-center gap-2 font-medium"
                      >
                        Option {String.fromCharCode(64 + num)}
                        {num === 2 && (
                          <span className="text-xs text-green-600 font-normal">
                            (Correct)
                          </span>
                        )}
                      </Label>
                    </div>
                    <Input
                      id={`b2-option${num}-text`}
                      placeholder={`Enter option ${num}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button variant="outline" size="sm" className="gap-1 mt-2">
              <Plus className="h-4 w-4" /> Add Another Blank
            </Button>
          </div>
        );

      case QuestionType.PART_7_READING_COMPREHENSION:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="p7-passage">Reading Passage</Label>
              <Textarea
                id="p7-passage"
                placeholder="Enter the reading passage"
                rows={8}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base font-medium">Questions</Label>
                <Button variant="outline" size="sm" className="gap-1">
                  <Plus className="h-4 w-4" /> Add Question
                </Button>
              </div>

              {/* Question 1 */}
              <Card className="mb-4">
                <CardHeader className="py-3 px-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Question 1</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="py-3 px-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="p7-q1">Question Text</Label>
                      <Input id="p7-q1" placeholder="Enter the question" />
                    </div>

                    <div>
                      <Label className="mb-2 block">Answer Options</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map(num => (
                          <div
                            key={num}
                            className={`border rounded-md p-3 ${
                              num === 1
                                ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10'
                                : ''
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <RadioGroup
                                defaultValue="q1-option1"
                                className="flex"
                              >
                                <RadioGroupItem
                                  value={`p7-q1-option${num}`}
                                  id={`p7-q1-option${num}`}
                                  checked={num === 1}
                                />
                              </RadioGroup>
                              <Label
                                htmlFor={`p7-q1-option${num}`}
                                className="flex items-center gap-2"
                              >
                                Option {String.fromCharCode(64 + num)}
                                {num === 1 && (
                                  <span className="text-xs text-green-600 font-normal">
                                    (Correct)
                                  </span>
                                )}
                              </Label>
                            </div>
                            <Input
                              id={`p7-q1-option${num}-text`}
                              placeholder={`Enter option ${num}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-3 px-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Question 2</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="py-3 px-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="p7-q2">Question Text</Label>
                      <Input id="p7-q2" placeholder="Enter the question" />
                    </div>

                    <div>
                      <Label className="mb-2 block">Answer Options</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map(num => (
                          <div
                            key={num}
                            className={`border rounded-md p-3 ${
                              num === 2
                                ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10'
                                : ''
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <RadioGroup
                                defaultValue="q2-option2"
                                className="flex"
                              >
                                <RadioGroupItem
                                  value={`p7-q2-option${num}`}
                                  id={`p7-q2-option${num}`}
                                  checked={num === 2}
                                />
                              </RadioGroup>
                              <Label
                                htmlFor={`p7-q2-option${num}`}
                                className="flex items-center gap-2"
                              >
                                Option {String.fromCharCode(64 + num)}
                                {num === 2 && (
                                  <span className="text-xs text-green-600 font-normal">
                                    (Correct)
                                  </span>
                                )}
                              </Label>
                            </div>
                            <Input
                              id={`p7-q2-option${num}-text`}
                              placeholder={`Enter option ${num}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6 text-center text-muted-foreground">
            Please select a TOEIC part from the dropdown
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[90vw] w-[1200px] max-h-[90vh] p-0 gap-0 overflow-auto flex flex-col">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl">
            {isEditMode ? 'Edit Question' : 'Add New Question'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Edit this TOEIC question'
              : 'Create a new TOEIC question for your exercise'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="part">TOEIC Part</Label>
                    <Select
                      defaultValue={selectedPart}
                      onValueChange={value =>
                        setSelectedPart(value as QuestionType)
                      }
                      value={selectedPart}
                      disabled={isEditMode}
                    >
                      <SelectTrigger id="part">
                        <SelectValue placeholder="Select part" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(QuestionType).map(([, value]) => (
                          <SelectItem key={value} value={value}>
                            {QUESTION_TYPE_DISPLAY[value as QuestionType]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedPart}</CardTitle>
                  <CardDescription>
                    {getPartDescription(selectedPart)}
                  </CardDescription>
                </CardHeader>
                <CardContent>{renderPartContent(selectedPart)}</CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
