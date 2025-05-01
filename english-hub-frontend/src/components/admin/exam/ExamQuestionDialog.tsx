import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  QUESTION_TYPE_DISPLAY,
  QuestionResponse,
  QuestionType,
} from '@/types/questionType';
import ExercisePart7Dialog from './ExercisePart7Dialog';
import ExamPart1Dialog from './ExamPart1Dialog';
import ExamPart2Dialog from './ExamPart2Dialog';
import ExamPart3Dialog from './ExamPart3Dialog';
import ExamPart4Dialog from './ExamPart4Dialog';
import ExamPart5Dialog from './ExamPart5Dialog';
import ExamPart6Dialog from './ExamPart6Dialog';

type ExamQuestionDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  examId?: string;
  question?: QuestionResponse;
};

export default function ExamQuestionDialog({
  isOpen,
  onOpenChange,
  examId,
  question,
}: ExamQuestionDialogProps) {
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
        return (
          <ExamPart1Dialog
            examId={examId}
            question={question}
            onClose={() => onOpenChange(false)}
          />
        );

      case QuestionType.PART_2_QUESTION_RESPONSES:
        return (
          <ExamPart2Dialog
            examId={examId}
            question={question}
            onClose={() => onOpenChange(false)}
          />
        );

      case QuestionType.PART_3_CONVERSATIONS:
        return (
          <ExamPart3Dialog
            examId={examId}
            question={question}
            onClose={() => onOpenChange(false)}
          />
        );

      case QuestionType.PART_4_TALKS:
        return (
          <ExamPart4Dialog
            examId={examId}
            question={question}
            onClose={() => onOpenChange(false)}
          />
        );

      case QuestionType.PART_5_INCOMPLETE_SENTENCES:
        return (
          <ExamPart5Dialog
            examId={examId}
            question={question}
            onClose={() => onOpenChange(false)}
          />
        );

      case QuestionType.PART_6_TEXT_COMPLETION:
        return (
          <ExamPart6Dialog
            examId={examId}
            question={question}
            onClose={() => onOpenChange(false)}
          />
        );

      case QuestionType.PART_7_READING_COMPREHENSION:
        return (
          <ExercisePart7Dialog
            exerciseId={exerciseId}
            question={question}
            onClose={() => onOpenChange(false)}
          />
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
