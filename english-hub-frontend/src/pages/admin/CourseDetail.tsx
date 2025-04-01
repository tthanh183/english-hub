import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Copy,
  FileText,
  MoreHorizontal,
  Plus,
  Save,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import LessonItem from '@/components/admin/LessonItem';
import { LessonResponse } from '@/types/lessonType';
import AddLessonDialog from '@/components/admin/AddLessonDialog';
import { useLessonStore } from '@/stores/lessonStore';
import { useQuery } from '@tanstack/react-query';
import GlobalSkeleton from '@/components/GlobalSkeleton';
import { getAllLessons } from '@/services/lessonService';
import UpdateLessonCard from '@/components/admin/UpdateLessonCard';

// Mock data

const initialCourse = {
  id: 1,
  title: 'Introduction to Programming',
  description:
    'Learn the fundamentals of programming with this comprehensive course.',
  category: 'Computer Science',
  status: 'Draft',
  modules: [
    {
      id: 1,
      title: 'Getting Started with Programming',
      description: 'An introduction to programming concepts and tools.',
      lessons: [],
    },
    {
      id: 2,
      title: 'Variables and Data Types',
      description:
        'Understanding how to store and manipulate data in programming.',
    },
  ],
};

const initialExercises = [
  {
    id: 1,
    title: 'Variable Declaration Practice',
    type: 'Coding',
    difficulty: 'Easy',
    estimatedTime: '15 minutes',
    instructions:
      'Declare three variables: an integer, a string, and a boolean. Initialize them with appropriate values.',
    solution: `// Integer variable\nlet count = 42;\n\n// String variable\nlet message = "Hello, World!";\n\n// Boolean variable\nlet isActive = true;`,
  },
  {
    id: 2,
    title: 'Data Types Quiz',
    type: 'Multiple Choice',
    difficulty: 'Easy',
    estimatedTime: '10 minutes',
    questions: [
      {
        question:
          'Which of the following is NOT a primitive data type in most programming languages?',
        options: ['Integer', 'String', 'Boolean', 'Array'],
        answer: 'Array',
      },
      {
        question:
          'What will be the value of x after this code? let x = 5; x = x + 2;',
        options: ['5', '7', '2', 'Error'],
        answer: '7',
      },
    ],
  },
  {
    id: 3,
    title: 'Loop Challenge',
    type: 'Coding',
    difficulty: 'Medium',
    estimatedTime: '20 minutes',
    instructions: 'Write a for loop that prints the numbers from 1 to 10.',
    solution: `for (let i = 1; i <= 10; i++) {\n  console.log(i);\n}`,
  },
];

const initialTests = [
  {
    id: 1,
    title: 'Programming Basics Quiz',
    description: 'Test your understanding of basic programming concepts',
    duration: '30 minutes',
    questions: 15,
    status: 'Published',
  },
  {
    id: 2,
    title: 'Variables and Data Types Test',
    description: 'Comprehensive test on variables and data types',
    duration: '45 minutes',
    questions: 20,
    status: 'Draft',
  },
];

export default function CourseBuilderPage() {
  //   const router = useRouter();
  const [course, setCourse] = useState(initialCourse);
  const [exercises, setExercises] = useState(initialExercises);
  const [tests, setTests] = useState(initialTests);
  const [activeTab, setActiveTab] = useState('structure');
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);
  const [isAddTestOpen, setIsAddTestOpen] = useState(false);

  const [newExercise, setNewExercise] = useState({
    title: '',
    type: 'Coding',
    difficulty: 'Medium',
    estimatedTime: '15 minutes',
    instructions: '',
    solution: '',
  });
  const [newTest, setNewTest] = useState({
    title: '',
    description: '',
    duration: '30 minutes',
    status: 'Draft',
  });
  const [editingCourse, setEditingCourse] = useState(false);
  const [editedCourse, setEditedCourse] = useState({
    title: course.title,
    description: course.description,
    category: course.category,
  });
  const [isEditingLesson, setIsEditingLesson] = useState<boolean>(false);
  const [selectedLesson, setSelectedLesson] = useState<LessonResponse | null>(
    null
  );

  const { courseId } = useParams();
  const { lessons, setLessons } = useLessonStore();
  const { data = [], isLoading } = useQuery({
    queryKey: ['lessons'],
    queryFn: () => (courseId ? getAllLessons(courseId) : Promise.resolve([])),
  });

  useEffect(() => {
    if (data.length !== lessons.length) {
      setLessons(data);
    }
  }, [data, lessons, setLessons]);

  const handleAddExercise = () => {
    if (!newExercise.title) return;

    const id = Math.max(...exercises.map(e => e.id), 0) + 1;
    setExercises([
      ...exercises,
      {
        id,
        title: newExercise.title,
        type: newExercise.type,
        difficulty: newExercise.difficulty,
        estimatedTime: newExercise.estimatedTime,
        instructions: newExercise.instructions,
        solution: newExercise.solution,
      },
    ]);

    setNewExercise({
      title: '',
      type: 'Coding',
      difficulty: 'Medium',
      estimatedTime: '15 minutes',
      instructions: '',
      solution: '',
    });

    setIsAddExerciseOpen(false);
  };

  const handleAddTest = () => {
    if (!newTest.title) return;

    const id = Math.max(...tests.map(t => t.id), 0) + 1;
    setTests([
      ...tests,
      {
        id,
        title: newTest.title,
        description: newTest.description,
        duration: newTest.duration,
        questions: 0,
        status: newTest.status,
      },
    ]);

    setNewTest({
      title: '',
      description: '',
      duration: '30 minutes',
      status: 'Draft',
    });

    setIsAddTestOpen(false);
  };

  const handleSelectLesson = (id: string) => {
    if (!isEditingLesson) {
      setSelectedLesson(lessons.find(lesson => lesson.id === id) || null);
      setIsEditingLesson(true);
    } else {
      if (selectedLesson?.id !== id) {
        setSelectedLesson(lessons.find(lesson => lesson.id === id) || null);
        setIsEditingLesson(true);
      } else {
        setSelectedLesson(null);
        setIsEditingLesson(false);
      }
    }
  };

  const handleDeleteLesson = () => {
    // const updatedModules = [...course.modules];
    // const updatedLessons = [...updatedModules[moduleIndex].lessons];
    // updatedLessons.splice(lessonIndex, 1);
    // // Update order for remaining lessons
    // updatedLessons.forEach((lesson, idx) => {
    //   lesson.order = idx + 1;
    // });
    // updatedModules[moduleIndex] = {
    //   ...updatedModules[moduleIndex],
    //   lessons: updatedLessons,
    // };
    // setCourse({
    //   ...course,
    //   modules: updatedModules,
    // });
    // setActiveLesson(null);
  };

  const handleMoveLesson = (
    moduleIndex: number,
    lessonIndex: number,
    direction: 'up' | 'down'
  ) => {
    if (
      (direction === 'up' && lessonIndex === 0) ||
      (direction === 'down' &&
        lessonIndex === course.modules[moduleIndex].lessons.length - 1)
    ) {
      return;
    }

    const updatedModules = [...course.modules];
    const updatedLessons = [...updatedModules[moduleIndex].lessons];

    const newIndex = direction === 'up' ? lessonIndex - 1 : lessonIndex + 1;

    // Swap lessons
    const temp = updatedLessons[lessonIndex];
    updatedLessons[lessonIndex] = updatedLessons[newIndex];
    updatedLessons[newIndex] = temp;

    // Update order
    updatedLessons.forEach((lesson, idx) => {
      lesson.order = idx + 1;
    });

    updatedModules[moduleIndex] = {
      ...updatedModules[moduleIndex],
      lessons: updatedLessons,
    };

    setCourse({
      ...course,
      modules: updatedModules,
    });
  };

  const handleSaveCourseDetails = () => {
    setCourse({
      ...course,
      title: editedCourse.title,
      description: editedCourse.description,
      category: editedCourse.category,
    });
    setEditingCourse(false);
  };

  const handleDeleteExercise = (exerciseIndex: number) => {
    const updatedExercises = [...exercises];
    updatedExercises.splice(exerciseIndex, 1);
    setExercises(updatedExercises);
  };

  const handleDeleteTest = (testIndex: number) => {
    const updatedTests = [...tests];
    updatedTests.splice(testIndex, 1);
    setTests(updatedTests);
  };

  if (isLoading) {
    return <GlobalSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/admin/courses">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
          <p className="text-muted-foreground">{course.description}</p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="structure">
            <BookOpen className="h-4 w-4 mr-2" />
            Course Structure
          </TabsTrigger>
          <TabsTrigger value="exercises">
            <FileText className="h-4 w-4 mr-2" />
            Exercise Bank
          </TabsTrigger>
        </TabsList>

        <TabsContent value="structure" className="space-y-4">
          <div className="grid md:grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Lessons</CardTitle>
                  <AddLessonDialog
                    isOpen={isAddLessonOpen}
                    onOpenChange={setIsAddLessonOpen}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lessons.map((lesson, idx) => (
                    <LessonItem
                      key={lesson.id}
                      lesson={lesson}
                      isSelected={selectedLesson?.id === lesson.id}
                      order={idx + 1}
                      onSelect={() => handleSelectLesson(lesson.id)}
                      onDelete={handleDeleteLesson}
                    />
                  ))}

                  {course.modules.flatMap(module => module.lessons).length ===
                    0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No lessons yet</h3>
                      <p className="text-muted-foreground mb-4">
                        This course doesn't have any lessons. Add your first
                        lesson to get started.
                      </p>
                      <Button onClick={() => setIsAddLessonOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Lesson
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {selectedLesson && (
              <UpdateLessonCard
                selectedLesson={selectedLesson}
                setSelectedLesson={setSelectedLesson}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="exercises" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Exercise Bank</h2>
            <Dialog
              open={isAddExerciseOpen}
              onOpenChange={setIsAddExerciseOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Exercise
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Exercise</DialogTitle>
                  <DialogDescription>
                    Create a new exercise for your course.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="exercise-title">Exercise Title</Label>
                    <Input
                      id="exercise-title"
                      value={newExercise.title}
                      onChange={e =>
                        setNewExercise({
                          ...newExercise,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="exercise-type">Exercise Type</Label>
                      <Select
                        value={newExercise.type}
                        onValueChange={value =>
                          setNewExercise({ ...newExercise, type: value })
                        }
                      >
                        <SelectTrigger id="exercise-type">
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Coding">Coding</SelectItem>
                          <SelectItem value="Multiple Choice">
                            Multiple Choice
                          </SelectItem>
                          <SelectItem value="Fill in the Blank">
                            Fill in the Blank
                          </SelectItem>
                          <SelectItem value="Matching">Matching</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exercise-difficulty">Difficulty</Label>
                      <Select
                        value={newExercise.difficulty}
                        onValueChange={value =>
                          setNewExercise({ ...newExercise, difficulty: value })
                        }
                      >
                        <SelectTrigger id="exercise-difficulty">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exercise-time">Estimated Time</Label>
                    <Input
                      id="exercise-time"
                      value={newExercise.estimatedTime}
                      onChange={e =>
                        setNewExercise({
                          ...newExercise,
                          estimatedTime: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exercise-instructions">Instructions</Label>
                    <Textarea
                      id="exercise-instructions"
                      rows={3}
                      value={newExercise.instructions}
                      onChange={e =>
                        setNewExercise({
                          ...newExercise,
                          instructions: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exercise-solution">
                      Solution or Answer Key
                    </Label>
                    <Textarea
                      id="exercise-solution"
                      rows={5}
                      value={newExercise.solution}
                      onChange={e =>
                        setNewExercise({
                          ...newExercise,
                          solution: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddExerciseOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddExercise}>Add Exercise</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exercises.map((exercise, index) => (
              <Card key={exercise.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{exercise.title}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit Exercise</DropdownMenuItem>
                        <DropdownMenuItem>Preview Exercise</DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteExercise(index)}
                        >
                          Delete Exercise
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted">
                        {exercise.type}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted">
                        {exercise.difficulty}
                      </span>
                      <span className="inline-flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {exercise.estimatedTime}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {exercise.instructions}
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    Assign to Lesson
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {exercises.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No exercises yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't created any exercises yet. Add your first exercise
                  to get started.
                </p>
                <Button onClick={() => setIsAddExerciseOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Exercise
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
