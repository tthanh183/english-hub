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
import { Pencil, Trash2, Plus, FileText } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import {
  deleteQuestionFromExercise,
  getQuestionsFromExercise,
} from '@/services/exerciseService';
import { QuestionResponse, QuestionType } from '@/types/questionType';
import ExerciseQuestionDialog from './ExerciseQuestionDialog';
import { showError, showSuccess } from '@/hooks/useToast';
import { DeleteConfirmation } from '../../../../../components/admin/DeleteConfirmation';
import { isAxiosError } from 'axios';

type ExerciseQuestionListCardProps = {
  selectedExercise?: ExerciseResponse;
};

export default function ExerciseQuestionList({
  selectedExercise,
}: ExerciseQuestionListCardProps) {
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState<boolean>(false);
  const [isEditQuestionOpen, setIsEditQuestionOpen] = useState<boolean>(false);

  const [selectedQuestion, setSelectedQuestion] =
    useState<QuestionResponse | null>(null);

  const { courseId } = useParams();

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['questions', selectedExercise?.id],
    queryFn: () =>
      getQuestionsFromExercise(courseId || '', selectedExercise?.id || ''),
    enabled: !!selectedExercise?.id,
  });

  const queryClient = useQueryClient();
  const deleteQuestionMutation = useMutation({
    mutationFn: (questionId: string) =>
      deleteQuestionFromExercise(
        courseId || '',
        selectedExercise?.id || '',
        questionId
      ),
    onSuccess: message => {
      showSuccess(message);
      queryClient.invalidateQueries({
        queryKey: ['questions', selectedExercise?.id],
      });
    },
    onError: error => {
      if (isAxiosError(error)) {
        showError(
          error.response?.data.message || 'An unexpected error occurred'
        );
      } else {
        showError('Failed to delete question. Please try again.');
      }
    },
  });

  const handleAddQuestion = () => {
    setSelectedQuestion(null);
    setIsAddQuestionOpen(true);
  };

  const handleEditQuestion = (question: QuestionResponse) => {
    setSelectedQuestion(question);
    setIsEditQuestionOpen(true);
  };

  const handleDelete = (questionId: string) => {
    deleteQuestionMutation.mutate(questionId);
  };

  const getQuestionTypeDisplay = (question: QuestionResponse): string => {
    const typeMappings: Record<string, string> = {
      [QuestionType.PART_1_PHOTOGRAPHS]: 'Part 1',
      [QuestionType.PART_2_QUESTION_RESPONSES]: 'Part 2',
      [QuestionType.PART_3_CONVERSATIONS]: 'Part 3',
      [QuestionType.PART_4_TALKS]: 'Part 4',
      [QuestionType.PART_5_INCOMPLETE_SENTENCES]: 'Part 5',
      [QuestionType.PART_6_TEXT_COMPLETION]: 'Part 6',
      [QuestionType.PART_7_READING_COMPREHENSION]: 'Part 7',
    };

    return typeMappings[question.questionType] || question.questionType;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Questions List</h2>
        <Button size="sm" onClick={handleAddQuestion}>
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
        <ExerciseQuestionDialog
          isOpen={isAddQuestionOpen}
          onOpenChange={setIsAddQuestionOpen}
          exerciseId={selectedExercise?.id || ''}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : questions.length > 0 ? (
        <div className="rounded-md border">
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="w-[140px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((question, index) => (
                <TableRow key={question.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {question.title.length > 50 ? (
                        <p className="text-sm font-medium text-muted-foreground truncate max-w-[700px]">
                          {question.title}
                        </p>
                      ) : (
                        <p className="text-sm font-medium text-muted-foreground">
                          {question.title}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {getQuestionTypeDisplay(question)}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditQuestion(question)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <DeleteConfirmation
                        title="Delete Question"
                        description="Are you sure you want to delete this question? This action cannot be undone."
                        onConfirm={() => handleDelete(question.id)}
                        trigger={
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            disabled={deleteQuestionMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {selectedQuestion && (
              <ExerciseQuestionDialog
                isOpen={isEditQuestionOpen}
                onOpenChange={setIsEditQuestionOpen}
                exerciseId={selectedExercise?.id}
                question={selectedQuestion}
              />
            )}
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-md">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No questions yet</h3>
          <p className="text-muted-foreground mb-4">
            This exercise doesn't have any questions. Add your first question to
            get started.
          </p>
          <Button onClick={handleAddQuestion}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Question
          </Button>
        </div>
      )}
    </div>
  );
}
