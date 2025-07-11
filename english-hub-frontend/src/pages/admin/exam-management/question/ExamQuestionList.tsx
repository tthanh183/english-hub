import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { QuestionResponse, QuestionType } from '@/types/questionType';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteQuestionFromExam,
  getExamById,
  getQuestionsFromExam,
} from '@/services/examService';
import { Spinner } from '@/components/Spinner';
import { ExamResponse } from '@/types/examType';
import ExamQuestionDialog from '@/pages/admin/exam-management/question/ExamQuestionDialog';
import { showError, showSuccess } from '@/hooks/useToast';
import { DeleteConfirmation } from '@/components/admin/DeleteConfirmation';
import { ROUTES } from '@/constants/routes';
import { isAxiosError } from 'axios';

export default function ExamQuestionList() {
  const { examId } = useParams();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState<boolean>(false);
  const [isEditQuestionOpen, setIsEditQuestionOpen] = useState<boolean>(false);
  const [selectedQuestion, setSelectedQuestion] =
    useState<QuestionResponse | null>(null);
  const [exam, setExam] = useState<ExamResponse | null>(null);

  useEffect(() => {
    const fetchExam = async () => {
      if (examId) {
        try {
          const exam = await getExamById(examId);
          setExam(exam);
        } catch (error) {
          console.error('Failed to fetch exam:', error);
        }
      }
    };

    fetchExam();
  }, [examId]);

  const queryClient = useQueryClient();

  const { data: questions = [], isLoading } = useQuery<QuestionResponse[]>({
    queryKey: ['questions', examId],
    queryFn: () => getQuestionsFromExam(examId || ''),
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (questionId: string) =>
      deleteQuestionFromExam(examId || '', questionId),
    onSuccess: message => {
      showSuccess(message || 'Question deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['questions', examId] });
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

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesTab =
      activeTab === 'all' || question.questionType === activeTab;

    return matchesSearch && matchesTab;
  });

  const handleEditQuestion = (question: QuestionResponse) => {
    setSelectedQuestion(question);
    setIsEditQuestionOpen(true);
  };

  const handleAddQuestion = () => {
    setSelectedQuestion(null);
    setIsAddQuestionOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteQuestionMutation.mutate(id);
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
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link to={ROUTES.ADMIN_EXAMS}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{exam?.title}</h1>
          <p className="text-muted-foreground">{exam?.duration}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            className="pl-8"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value={QuestionType.PART_1_PHOTOGRAPHS}>
            Part 1
          </TabsTrigger>
          <TabsTrigger value={QuestionType.PART_2_QUESTION_RESPONSES}>
            Part 2
          </TabsTrigger>
          <TabsTrigger value={QuestionType.PART_3_CONVERSATIONS}>
            Part 3
          </TabsTrigger>
          <TabsTrigger value={QuestionType.PART_4_TALKS}>Part 4</TabsTrigger>
          <TabsTrigger value={QuestionType.PART_5_INCOMPLETE_SENTENCES}>
            Part 5
          </TabsTrigger>
          <TabsTrigger value={QuestionType.PART_6_TEXT_COMPLETION}>
            Part 6
          </TabsTrigger>
          <TabsTrigger value={QuestionType.PART_7_READING_COMPREHENSION}>
            Part 7
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Questions List</h2>
          <Button size="sm" onClick={handleAddQuestion}>
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
          <ExamQuestionDialog
            isOpen={isAddQuestionOpen}
            onOpenChange={setIsAddQuestionOpen}
            examId={examId || ''}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner />
            <span className="ml-2">Loading questions...</span>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border rounded-md">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No questions yet</h3>
            <p className="text-muted-foreground mb-4">
              This exam doesn't have any questions. Add your first question to
              get started.
            </p>
            <Button onClick={handleAddQuestion}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Question
            </Button>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="w-[140px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuestions.map((question, index) => (
                  <TableRow key={question.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium truncate max-w-[300px]">
                        {question.title}
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
            </Table>
          </div>
        )}
      </div>

      {selectedQuestion && (
        <ExamQuestionDialog
          isOpen={isEditQuestionOpen}
          onOpenChange={setIsEditQuestionOpen}
          examId={examId || ''}
          question={selectedQuestion}
        />
      )}
    </div>
  );
}
