import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  FileSpreadsheet,
  Plus,
  Search,
  Upload,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

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
      type: 'listening-part1',
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

    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'listening')
      return matchesSearch && question.type.startsWith('listening');
    if (activeTab === 'reading')
      return matchesSearch && question.type.startsWith('reading');
    if (activeTab === 'easy')
      return matchesSearch && question.difficulty === 'easy';
    if (activeTab === 'medium')
      return matchesSearch && question.difficulty === 'medium';
    if (activeTab === 'hard')
      return matchesSearch && question.difficulty === 'hard';

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

  const handleUpdateQuestion = () => {
    if (!editingQuestion) return;

    if (editingQuestion.id) {
      // Update existing question
      setQuestions(prev =>
        prev.map(q => (q.id === editingQuestion.id ? editingQuestion : q))
      );
    } else {
      // Add new question
      const newId = (
        Math.max(...questions.map(q => Number.parseInt(q.id))) + 1
      ).toString();
      setQuestions(prev => [...prev, { ...editingQuestion, id: newId }]);
    }

    setEditingQuestion(null);
    setIsQuestionDialogOpen(false);
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleDeleteSelected = () => {
    setQuestions(prev => prev.filter(q => !selectedQuestions.includes(q.id)));
    setSelectedQuestions([]);
    setSelectAll(false);
  };

  const handleSelectQuestion = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedQuestions(prev => [...prev, id]);
    } else {
      setSelectedQuestions(prev => prev.filter(itemId => itemId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedQuestions(filteredQuestions.map(q => q.id));
    } else {
      setSelectedQuestions([]);
    }
  };

  const getQuestionTypeBadge = (type: string) => {
    if (type.startsWith('listening-part1'))
      return <Badge className="bg-blue-500">Listening Part 1</Badge>;
    if (type.startsWith('listening-part2'))
      return <Badge className="bg-blue-500">Listening Part 2</Badge>;
    if (type.startsWith('listening-part3'))
      return <Badge className="bg-blue-500">Listening Part 3</Badge>;
    if (type.startsWith('listening-part4'))
      return <Badge className="bg-blue-500">Listening Part 4</Badge>;
    if (type.startsWith('reading-part5'))
      return <Badge className="bg-purple-500">Reading Part 5</Badge>;
    if (type.startsWith('reading-part6'))
      return <Badge className="bg-purple-500">Reading Part 6</Badge>;
    if (type.startsWith('reading-part7'))
      return <Badge className="bg-purple-500">Reading Part 7</Badge>;
    return <Badge>{type}</Badge>;
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            Easy
          </Badge>
        );
      case 'medium':
        return (
          <Badge
            variant="outline"
            className="border-yellow-500 text-yellow-500"
          >
            Medium
          </Badge>
        );
      case 'hard':
        return (
          <Badge variant="outline" className="border-red-500 text-red-500">
            Hard
          </Badge>
        );
      default:
        return null;
    }
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
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleAddQuestion}>
            <Plus className="mr-2 h-4 w-4" /> Add Question
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsImportDialogOpen(true)}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Import from Excel
          </Button>
          {selectedQuestions.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteSelected}
            >
              Delete Selected ({selectedQuestions.length})
            </Button>
          )}
        </div>
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
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="all">All Questions</TabsTrigger>
          <TabsTrigger value="listening">Listening</TabsTrigger>
          <TabsTrigger value="reading">Reading</TabsTrigger>
          <TabsTrigger value="listening-part1">Part 1</TabsTrigger>
          <TabsTrigger value="listening-part2">Part 2</TabsTrigger>
          <TabsTrigger value="listening-part3">Part 3</TabsTrigger>
          <TabsTrigger value="listening-part4">Part 4</TabsTrigger>
          <TabsTrigger value="reading-part5">Part 5</TabsTrigger>
          <TabsTrigger value="reading-part6">Part 6</TabsTrigger>
          <TabsTrigger value="reading-part7">Part 7</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Questions</CardTitle>
          <CardDescription>
            {filteredQuestions.length} question
            {filteredQuestions.length !== 1 ? 's' : ''} in this exam.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all questions"
                  />
                </TableHead>
                <TableHead>Question</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">
                  Difficulty
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Correct Answer
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No questions found. Add a new question or adjust your
                    search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredQuestions.map(question => (
                  <TableRow key={question.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedQuestions.includes(question.id)}
                        onCheckedChange={checked =>
                          handleSelectQuestion(question.id, !!checked)
                        }
                        aria-label={`Select question ${question.id}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium truncate max-w-[300px]">
                        {question.title}
                      </div>
                      <div className="flex items-center gap-2 md:hidden mt-1">
                        {getQuestionTypeBadge(question.type)}
                        {getDifficultyBadge(question.difficulty)}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getQuestionTypeBadge(question.type)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getDifficultyBadge(question.difficulty)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {question.correctAnswer}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditQuestion(question)}
                        className="mr-2"
                      >
                        View / Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteQuestion(question.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog for View/Edit Question */}
      <Dialog
        open={isQuestionDialogOpen}
        onOpenChange={setIsQuestionDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingQuestion?.id ? 'Edit Question' : 'Add New Question'}
            </DialogTitle>
            <DialogDescription>
              {editingQuestion?.id
                ? 'Update the question details below.'
                : 'Fill in the details to create a new question.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="question-type" className="text-sm font-medium">
                Question Type
              </label>
              <Select
                value={editingQuestion?.type || 'listening-part1'}
                onValueChange={value =>
                  setEditingQuestion(prev =>
                    prev ? { ...prev, type: value } : null
                  )
                }
              >
                <SelectTrigger id="question-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="listening-part1">
                    Listening - Part 1
                  </SelectItem>
                  <SelectItem value="listening-part2">
                    Listening - Part 2
                  </SelectItem>
                  <SelectItem value="listening-part3">
                    Listening - Part 3
                  </SelectItem>
                  <SelectItem value="listening-part4">
                    Listening - Part 4
                  </SelectItem>
                  <SelectItem value="reading-part5">
                    Reading - Part 5
                  </SelectItem>
                  <SelectItem value="reading-part6">
                    Reading - Part 6
                  </SelectItem>
                  <SelectItem value="reading-part7">
                    Reading - Part 7
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="question-difficulty"
                className="text-sm font-medium"
              >
                Difficulty
              </label>
              <Select
                value={editingQuestion?.difficulty || 'medium'}
                onValueChange={(value: 'easy' | 'medium' | 'hard') =>
                  setEditingQuestion(prev =>
                    prev ? { ...prev, difficulty: value } : null
                  )
                }
              >
                <SelectTrigger id="question-difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="question-title" className="text-sm font-medium">
                Question Text
              </label>
              <Textarea
                id="question-title"
                placeholder="Enter question text"
                value={editingQuestion?.title || ''}
                onChange={e =>
                  setEditingQuestion(prev =>
                    prev ? { ...prev, title: e.target.value } : null
                  )
                }
                rows={3}
              />
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium">Answer Choices</label>
              {['A', 'B', 'C', 'D'].map(choice => (
                <div key={choice} className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center bg-muted rounded-md">
                    {choice}
                  </div>
                  <Input
                    placeholder={`Choice ${choice}`}
                    value={editingQuestion?.choices[choice] || ''}
                    onChange={e =>
                      setEditingQuestion(prev =>
                        prev
                          ? {
                              ...prev,
                              choices: {
                                ...prev.choices,
                                [choice]: e.target.value,
                              },
                            }
                          : null
                      )
                    }
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Correct Answer</label>
              <RadioGroup
                value={editingQuestion?.correctAnswer || ''}
                onValueChange={value =>
                  setEditingQuestion(prev =>
                    prev ? { ...prev, correctAnswer: value } : null
                  )
                }
                className="flex space-x-4"
              >
                {['A', 'B', 'C', 'D'].map(choice => (
                  <div key={choice} className="flex items-center space-x-2">
                    <RadioGroupItem value={choice} id={`choice-${choice}`} />
                    <Label htmlFor={`choice-${choice}`}>{choice}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsQuestionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateQuestion}>
              {editingQuestion?.id ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for Import from Excel */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Import Questions from Excel</DialogTitle>
            <DialogDescription>
              Upload an Excel file to import questions for this exam.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center">
              <FileSpreadsheet className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">Upload Questions Excel File</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop your Excel file here, or click to browse
              </p>
              <Input
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                id="question-file-upload"
              />
              <label htmlFor="question-file-upload">
                <Button variant="outline" className="cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  Select File
                </Button>
              </label>
            </div>
            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
              <Button size="sm">Upload and Process</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
