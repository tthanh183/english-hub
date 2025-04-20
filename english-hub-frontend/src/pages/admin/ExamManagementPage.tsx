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
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

type Exam = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  duration: number;
  questionCount: number;
  status: 'draft' | 'published' | 'archived';
  type: 'toeic' | 'ielts' | 'general';
};

export default function ExamManagementPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [exams, setExams] = useState<Exam[]>([
    {
      id: '1',
      name: 'TOEIC Full Test 1',
      description: 'Complete TOEIC test with Listening and Reading sections',
      createdAt: '2025-04-01',
      duration: 120,
      questionCount: 200,
      status: 'published',
      type: 'toeic',
    },
    {
      id: '2',
      name: 'IELTS Academic Test',
      description: 'Full IELTS Academic test',
      createdAt: '2025-04-15',
      duration: 170,
      questionCount: 40,
      status: 'published',
      type: 'ielts',
    },
    {
      id: '3',
      name: 'Grammar Assessment',
      description: 'General English grammar assessment',
      createdAt: '2025-04-20',
      duration: 30,
      questionCount: 50,
      status: 'archived',
      type: 'general',
    },
  ]);

  const navigate = useNavigate();

  const filteredExams = exams.filter(
    exam =>
      exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStatusBadge = (status: string) => {
    const statusClasses = {
      draft: 'bg-yellow-100 text-yellow-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-red-100 text-red-800',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status]}`}
      >
        {status}
      </span>
    );
  };

  const renderTypeBadge = (type: string) => {
    const typeClasses = {
      toeic: 'bg-blue-100 text-blue-800',
      ielts: 'bg-purple-100 text-purple-800',
      general: 'bg-gray-100 text-gray-800',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeClasses[type]}`}
      >
        {type.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exam Management</h1>
          <p className="text-muted-foreground">Manage your platform exams.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Exam
        </Button>
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
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExams.map(exam => (
              <TableRow key={exam.id}>
                <TableCell className="font-medium">{exam.name}</TableCell>
                <TableCell>{exam.description}</TableCell>
                <TableCell>{renderTypeBadge(exam.type)}</TableCell>
                <TableCell>{renderStatusBadge(exam.status)}</TableCell>
                <TableCell>{exam.questionCount}</TableCell>
                <TableCell>{exam.duration} min</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
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
    </div>
  );
}
