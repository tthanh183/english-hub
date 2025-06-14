import { useState } from 'react';
import { Edit, Eye, Plus, Search, Trash2 } from 'lucide-react';
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
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteExam, getAllExams } from '@/services/examService';
import ExamDialog from '@/pages/admin/exam-management/ExamDialog';
import { ExamResponse } from '@/types/examType';
import GlobalSkeleton from '@/components/GlobalSkeleton';
import { longToString } from '@/utils/timeUtil';
import { showError, showSuccess } from '@/hooks/useToast';
import { DeleteConfirmation } from '@/components/admin/DeleteConfirmation';
import { isAxiosError } from 'axios';

export default function ExamManagementPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddExamOpen, setIsAddExamOpen] = useState<boolean>(false);
  const [isEditExamOpen, setIsEditExamOpen] = useState<boolean>(false);
  const [selectedExam, setSelectedExam] = useState<ExamResponse | null>(null);

  const queryClient = useQueryClient();

  const { data: exams, isLoading } = useQuery<ExamResponse[]>({
    queryKey: ['exams'],
    queryFn: () => getAllExams(),
  });

  const deleteExamMutation = useMutation({
    mutationFn: (examId: string) => deleteExam(examId),
    onSuccess: response => {
      showSuccess(response || 'Exam deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
    onError: error => {
      if (isAxiosError(error)) {
        showError(error.response?.data.message);
      } else {
        showError('Failed to delete exam. Please try again.');
      }
    },
  });

  const handleDeleteExam = (examId: string) => {
    deleteExamMutation.mutate(examId);
  };
  const navigate = useNavigate();

  const filteredExams = exams?.filter(exam =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <GlobalSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exam Management</h1>
          <p className="text-muted-foreground">Manage your platform exams.</p>
        </div>
        <Button
          onClick={() => {
            setIsAddExamOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Exam
        </Button>
        <ExamDialog isOpen={isAddExamOpen} onOpenChange={setIsAddExamOpen} />
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exams..."
            className="pl-8"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">
                <div className="flex justify-end pr-6">Actions</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExams?.map(exam => (
              <TableRow key={exam.id}>
                <TableCell className="font-medium">{exam.title}</TableCell>
                <TableCell>{longToString(exam.duration)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        navigate(`/admin/exams/${exam.id}/questions`)
                      }
                      title="View Questions"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setSelectedExam(exam);
                        setIsEditExamOpen(true);
                      }}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <DeleteConfirmation
                      title="Delete Exam"
                      description={`Are you sure you want to delete exam "${exam.title}"? This action cannot be undone.`}
                      onConfirm={() => handleDeleteExam(exam.id)}
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          title="Delete"
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

      <ExamDialog
        isOpen={isEditExamOpen}
        onOpenChange={setIsEditExamOpen}
        exam={selectedExam}
      />
    </div>
  );
}
