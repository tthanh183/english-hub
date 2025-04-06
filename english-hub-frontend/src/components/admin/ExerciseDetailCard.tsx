import { ExerciseResponse } from '@/types/exerciseType';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Pencil, Trash2, Plus, Image, Mic, FileText, Eye } from 'lucide-react';
import AddQuestionDialog from './AddQuestionDialog';
import { useState } from 'react';

// Mock questions data for demonstration
const mockQuestions = [
  {
    id: 'q-1',
    title: 'What is the main purpose of the memo?',
    type: 'multiple_choice',
    media: [],
    options: [
      {
        id: 'opt-1-1',
        text: 'To announce a new company policy',
        isCorrect: true,
      },
      {
        id: 'opt-1-2',
        text: 'To request feedback from employees',
        isCorrect: false,
      },
      {
        id: 'opt-1-3',
        text: 'To introduce a new staff member',
        isCorrect: false,
      },
      {
        id: 'opt-1-4',
        text: 'To inform about a schedule change',
        isCorrect: false,
      },
    ],
    points: 1,
  },
  {
    id: 'q-2',
    title: 'According to the passage, when will the meeting take place?',
    type: 'multiple_choice',
    media: [],
    options: [
      { id: 'opt-2-1', text: 'Monday morning', isCorrect: false },
      { id: 'opt-2-2', text: 'Wednesday afternoon', isCorrect: true },
      { id: 'opt-2-3', text: 'Friday evening', isCorrect: false },
      { id: 'opt-2-4', text: 'Tuesday at noon', isCorrect: false },
    ],
    points: 1,
  },
  {
    id: 'q-3',
    title: 'What does this image show?',
    type: 'multiple_choice',
    media: [
      {
        type: 'image',
        url: 'https://via.placeholder.com/400x300?text=Office+Meeting',
      },
    ],
    options: [
      { id: 'opt-3-1', text: 'A business meeting', isCorrect: true },
      { id: 'opt-3-2', text: 'A factory floor', isCorrect: false },
      { id: 'opt-3-3', text: 'A corporate party', isCorrect: false },
      { id: 'opt-3-4', text: 'An empty conference room', isCorrect: false },
    ],
    points: 2,
  },
  {
    id: 'q-4',
    title: 'Listen to the conversation and select the appropriate response',
    type: 'multiple_choice',
    media: [{ type: 'audio', url: 'https://example.com/sample-audio.mp3' }],
    options: [
      {
        id: 'opt-4-1',
        text: "Yes, I've been working here for three years",
        isCorrect: false,
      },
      {
        id: 'opt-4-2',
        text: 'No, the meeting was rescheduled',
        isCorrect: true,
      },
      {
        id: 'opt-4-3',
        text: "I think it's on the second floor",
        isCorrect: false,
      },
      { id: 'opt-4-4', text: 'Thank you for asking', isCorrect: false },
    ],
    points: 2,
  },
];

type ExerciseDetailCardProps = {
  selectedExercise?: ExerciseResponse;
  setSelectedExercise?: (exercise: ExerciseResponse | null) => void;
};

export function ExerciseDetailCard({
  selectedExercise,
  setSelectedExercise,
}: ExerciseDetailCardProps) {
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState<boolean>(false);

  // Mock functions for demonstration
  const handleEdit = (question: any) => {
    console.log('Edit question:', question);
  };

  const handleDelete = (questionId: string) => {
    console.log('Delete question:', questionId);
  };

  const handlePreview = (question: any) => {
    console.log('Preview question:', question);
  };

  // Helper to get the correct answer
  const getCorrectAnswer = (question: any): string => {
    const correctOption = question.options?.find((o: any) => o.isCorrect);
    return correctOption?.text || 'No correct answer set';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Questions List</h2>
        <AddQuestionDialog
          isOpen={isAddQuestionOpen}
          onOpenChange={setIsAddQuestionOpen}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Correct Answer</TableHead>
              <TableHead className="text-center">Points</TableHead>
              <TableHead className="w-[140px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockQuestions.map((question, index) => (
              <TableRow key={question.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {question.media?.length > 0 ? (
                      question.media[0].type === 'image' ? (
                        <Avatar className="h-8 w-8 rounded-md">
                          <img
                            src={question.media[0].url}
                            alt=""
                            className="object-cover"
                          />
                        </Avatar>
                      ) : (
                        <div className="h-8 w-8 bg-muted rounded-md flex items-center justify-center">
                          <Mic className="h-4 w-4" />
                        </div>
                      )
                    ) : (
                      <div className="h-8 w-8 bg-muted rounded-md flex items-center justify-center">
                        <FileText className="h-4 w-4" />
                      </div>
                    )}
                    <span className="truncate max-w-[250px]">
                      {question.title}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {question.media?.length > 0
                      ? question.media[0].type === 'image'
                        ? 'Photo Question'
                        : 'Audio Question'
                      : 'Text Question'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="max-w-[200px] truncate">
                    {getCorrectAnswer(question)}
                  </div>
                </TableCell>
                <TableCell className="text-center">{question.points}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePreview(question)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(question)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDelete(question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Empty state */}
      {mockQuestions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-md">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No questions yet</h3>
          <p className="text-muted-foreground mb-4">
            This exercise doesn't have any questions. Add your first question to
            get started.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add First Question
          </Button>
        </div>
      )}
    </div>
  );
}
