import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Eye,
  FileSpreadsheet,
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
import { Input } from '@/components/ui/input';;
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { QuestionResponse, QuestionType } from '@/types/questionType';
import QuestionDialog from '@/components/admin/QuestionDialog';
import ExcelImportDialog from '@/components/admin/ExcelImportDialog';

type Question = {
  id: string;
  title: string;
  choices: { [key: string]: string };
  correctAnswer: string;
  type: string;
  difficulty: 'easy' | 'medium' | 'hard';
};

type ExamDetails = {
  id: string;
  name: string;
  description: string;
  type: string;
  questionCount: number;
};

export default function ExamQuestionsPage() {
  const { examId } = useParams();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isImportDialogOpen, setIsImportDialogOpen] = useState<boolean>(false);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] =
    useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Mock exam details
  const [examDetails] = useState<ExamDetails>({
    id: examId,
    name: 'TOEIC Full Test 1',
    description: 'Complete TOEIC test with Listening and Reading sections',
    type: 'toeic',
    questionCount: 200,
  });

  // Mock questions data
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      title: 'What is the woman probably doing?',
      choices: {
        A: 'Reading a book',
        B: 'Taking a photo',
        C: 'Writing a letter',
        D: 'Cooking dinner',
      },
      correctAnswer: 'B',
      type: QuestionType.PART_1_PHOTOGRAPHS,
      difficulty: 'easy',
    },
    {
      id: '2',
      title: 'Where does this conversation take place?',
      choices: {
        A: 'At a restaurant',
        B: 'At an office',
        C: 'At a hotel',
        D: 'At a store',
      },
      correctAnswer: 'C',
      type: 'listening-part3',
      difficulty: 'medium',
    },
    {
      id: '3',
      title: 'What will the man probably do next?',
      choices: {
        A: 'Go to a meeting',
        B: 'Call a client',
        C: 'Check his email',
        D: 'Leave the office',
      },
      correctAnswer: 'D',
      type: 'listening-part3',
      difficulty: 'medium',
    },
    {
      id: '4',
      title: 'What is the purpose of the announcement?',
      choices: {
        A: 'To introduce a new employee',
        B: 'To announce a schedule change',
        C: 'To remind about a deadline',
        D: 'To inform about a new policy',
      },
      correctAnswer: 'B',
      type: 'listening-part4',
      difficulty: 'hard',
    },
    {
      id: '5',
      title: "The word 'essential' in paragraph 2 is closest in meaning to...",
      choices: {
        A: 'Important',
        B: 'Interesting',
        C: 'Unusual',
        D: 'Complicated',
      },
      correctAnswer: 'A',
      type: 'reading-part5',
      difficulty: 'medium',
    },
    {
      id: '6',
      title:
        'According to the passage, what is the main purpose of the meeting?',
      choices: {
        A: 'To discuss a new project',
        B: 'To review quarterly results',
        C: 'To introduce new team members',
        D: 'To announce company changes',
      },
      correctAnswer: 'D',
      type: 'reading-part7',
      difficulty: 'hard',
    },
  ]);

  // Filter questions based on search term and active tab
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesSearch && question.type === activeTab;
  });

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setIsQuestionDialogOpen(true);
  };

  const handleAddQuestion = () => {
    setEditingQuestion({
      id: '',
      title: '',
      choices: { A: '', B: '', C: '', D: '' },
      correctAnswer: '',
      type: 'listening-part1',
      difficulty: 'medium',
    });
    setIsQuestionDialogOpen(true);
  };


  const handlePreview = (question: Question) => {
    // Implement preview functionality
    console.log('Preview question:', question);
  };

  const handleDelete = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
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
        <Link to="/admin/exams">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {examDetails.name}
          </h1>
          <p className="text-muted-foreground">{examDetails.description}</p>
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
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsImportDialogOpen(true)}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Import from Excel
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap w-full">
          <TabsTrigger value="listening-part1">Part 1</TabsTrigger>
          <TabsTrigger value="listening-part2">Part 2</TabsTrigger>
          <TabsTrigger value="listening-part3">Part 3</TabsTrigger>
          <TabsTrigger value="listening-part4">Part 4</TabsTrigger>
          <TabsTrigger value="reading-part5">Part 5</TabsTrigger>
          <TabsTrigger value="reading-part6">Part 6</TabsTrigger>
          <TabsTrigger value="reading-part7">Part 7</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Questions List</h2>
          <Button size="sm" onClick={handleAddQuestion}>
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
          <QuestionDialog
            isOpen={isQuestionDialogOpen}
            onOpenChange={setIsQuestionDialogOpen}
            examId={examId || ''}
          />
        </div>

        {filteredQuestions.length === 0 ? (
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
                          onClick={() => handlePreview(question)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditQuestion(question)}
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
        )}
      </div>

      <ExcelImportDialog
        isImportDialogOpen={isImportDialogOpen}
        setIsImportDialogOpen={setIsImportDialogOpen}
      />
    </div>
  );
}
