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
import ExercisePart1Dialog from './ExercisePart1Dialog';
import ExercisePart2Dialog from './ExercisePart2Dialog';
import ExercisePart3Dialog from './ExercisePart3Dialog';
import ExercisePart4Dialog from './ExercisePart4Dialog';
import ExercisePart5Dialog from './ExercisePart5Dialog';
import ExercisePart6Dialog from './ExercisePart6Dialog';
import ExercisePart7Dialog from './ExercisePart7Dialog';

type ExerciseQuestionDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  exerciseId?: string;
  question?: QuestionResponse;
};

export default function ExerciseQuestionDialog({
  isOpen,
  onOpenChange,
  exerciseId,
  question,
}: ExerciseQuestionDialogProps) {
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
          <ExercisePart1Dialog
            exerciseId={exerciseId}
            question={question}
            onClose={() => onOpenChange(false)}
          />
        );

      case QuestionType.PART_2_QUESTION_RESPONSES:
        return (
          <ExercisePart2Dialog
            exerciseId={exerciseId}
            question={question}
            onClose={() => onOpenChange(false)}
          />
        );

      case QuestionType.PART_3_CONVERSATIONS:
        return (
          <ExercisePart3Dialog
            exerciseId={exerciseId}
            question={question}
            onClose={() => onOpenChange(false)}
          />
        );

      case QuestionType.PART_4_TALKS:
        return (
          <ExercisePart4Dialog
            exerciseId={exerciseId}
            question={question}
            onClose={() => onOpenChange(false)}
          />
        );

      case QuestionType.PART_5_INCOMPLETE_SENTENCES:
        return (
          <ExercisePart5Dialog
            exerciseId={exerciseId}
            question={question}
            onClose={() => onOpenChange(false)}
          />
        );

      case QuestionType.PART_6_TEXT_COMPLETION:
        return (
          <ExercisePart6Dialog
            exerciseId={exerciseId}
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
