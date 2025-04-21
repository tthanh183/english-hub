import { useState } from 'react';
import { MoreHorizontal, Plus, Search } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAllExams } from '@/services/examService';
import ExamDialog from '@/components/admin/ExamDialog';
import { ExamResponse } from '@/types/examType';
import GlobalSkeleton from '@/components/GlobalSkeleton';

export default function ExamManagementPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddExamOpen, setIsAddExamOpen] = useState<boolean>(false);
  const [isEditExamOpen, setIsEditExamOpen] = useState<boolean>(false);
  const [selectedExam, setSelectedExam] = useState<ExamResponse | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data: exams, isLoading } = useQuery<ExamResponse[]>({
    queryKey: ['exams'],
    queryFn: () => getAllExams(),
  });

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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExams?.map(exam => (
              <TableRow key={exam.id}>
                <TableCell className="font-medium">{exam.title}</TableCell>
                <TableCell>{exam.duration} min</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu
                    open={isDropdownOpen}
                    onOpenChange={setIsDropdownOpen}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onSelect={e => {
                          e.preventDefault();
                          setIsDropdownOpen(false); 
                          setTimeout(() => {
                            setSelectedExam(exam);
                            setIsEditExamOpen(true);
                          }, 100); 
                        }}
                      >
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() =>
                          navigate(`/admin/exams/${exam.id}/questions`)
                        }
                      >
                        View Questions
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
