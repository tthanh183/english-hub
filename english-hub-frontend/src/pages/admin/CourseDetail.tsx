import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
  Edit,
  FileText,
  GraduationCap,
  Grip,
  MoreHorizontal,
  Plus,
  Save,
  Trash,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import LessonItem from '@/components/admin/LessonItem';
import { LessonResponse } from '@/types/lessonType';
import { set } from 'date-fns';

// Mock data

const lessons: LessonResponse[] = [
  {
    id: '1',
    title: 'What is Programming?',
    duration: '20 minutes',
    content:
      'Programming is the process of creating a set of instructions that tell a computer how to perform a task...',
  },
  {
    id: '2',
    title: 'Setting Up Your Development Environment',
    duration: '30 minutes',
    content:
      "In this lesson, we'll set up the tools you need to start programming...",
  },
  {
    id: '3',
    title: 'Introduction to Variables',
    duration: '25 minutes',
    content:
      'Variables are used to store information to be referenced and manipulated in a computer program...',
  },
  {
    id: '4',
    title: 'Working with Data Types',
    duration: '35 minutes',
    content:
      'Data types are classifications of data that tell the compiler or interpreter how the programmer intends to use the data...',
  },
  {
    id: '5',
    title: 'Variable Practice',
    duration: '45 minutes',
    content: 'Practice creating and using variables with these exercises...',
  },
];

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
  const [activeModule, setActiveModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState<number | null>(null);
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);
  const [isAddTestOpen, setIsAddTestOpen] = useState(false);
  const [newModule, setNewModule] = useState({
    title: '',
    description: '',
  });
  const [newLesson, setNewLesson] = useState({
    title: '',
    type: 'Theory',
    duration: '30 minutes',
    content: '',
  });
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

  const handleAddModule = () => {
    if (!newModule.title) return;

    const id = Math.max(...course.modules.map(m => m.id), 0) + 1;
    setCourse({
      ...course,
      modules: [
        ...course.modules,
        {
          id,
          title: newModule.title,
          description: newModule.description,
          lessons: [],
        },
      ],
    });
    setNewModule({ title: '', description: '' });
    setIsAddModuleOpen(false);
    setActiveModule(course.modules.length);
  };

  const handleAddLesson = () => {
    if (!newLesson.title || activeModule === null) return;

    const moduleIndex = activeModule;
    const module = course.modules[moduleIndex];
    const id =
      Math.max(...course.modules.flatMap(m => m.lessons.map(l => l.id)), 0) + 1;
    const order = module.lessons.length + 1;

    const updatedModules = [...course.modules];
    updatedModules[moduleIndex] = {
      ...module,
      lessons: [
        ...module.lessons,
        {
          id,
          title: newLesson.title,
          type: newLesson.type,
          duration: newLesson.duration,
          content: newLesson.content,
          order,
        },
      ],
    };

    setCourse({
      ...course,
      modules: updatedModules,
    });

    setNewLesson({
      title: '',
      type: 'Theory',
      duration: '30 minutes',
      content: '',
    });

    setIsAddLessonOpen(false);
  };

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
                  <Dialog
                    open={isAddLessonOpen}
                    onOpenChange={setIsAddLessonOpen}
                  >
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Lesson
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Lesson</DialogTitle>
                        <DialogDescription>
                          Create a new lesson for the course.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="lesson-title">Lesson Title</Label>
                          <Input
                            id="lesson-title"
                            value={newLesson.title}
                            onChange={e =>
                              setNewLesson({
                                ...newLesson,
                                title: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="lesson-type">Lesson Type</Label>
                          <Select
                            value={newLesson.type}
                            onValueChange={value =>
                              setNewLesson({ ...newLesson, type: value })
                            }
                          >
                            <SelectTrigger id="lesson-type">
                              <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Theory">Theory</SelectItem>
                              <SelectItem value="Exercise">Exercise</SelectItem>
                              <SelectItem value="Video">Video</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="lesson-duration">Duration</Label>
                          <Input
                            id="lesson-duration"
                            value={newLesson.duration}
                            onChange={e =>
                              setNewLesson({
                                ...newLesson,
                                duration: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="lesson-content">Content</Label>
                          <Textarea
                            id="lesson-content"
                            rows={5}
                            value={newLesson.content}
                            onChange={e =>
                              setNewLesson({
                                ...newLesson,
                                content: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsAddLessonOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleAddLesson}>Add Lesson</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Edit Lesson: {selectedLesson.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-lesson-title">Lesson Title</Label>
                      <Input
                        id="edit-lesson-title"
                        value={selectedLesson.title}
                        onChange={e =>
                          setSelectedLesson({
                            ...selectedLesson,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-lesson-content">
                        Lesson Content
                      </Label>
                      <Textarea
                        id="edit-lesson-content"
                        rows={8}
                        value={selectedLesson.content}
                        onChange={e =>
                          setSelectedLesson({
                            ...selectedLesson,
                            content: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setActiveLesson(null)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setActiveLesson(null)}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
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
