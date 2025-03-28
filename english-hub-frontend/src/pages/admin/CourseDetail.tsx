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
  ChevronDown,
  ChevronUp,
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
import {Link} from 'react-router-dom';

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
      lessons: [
        {
          id: 1,
          title: 'What is Programming?',
          type: 'Theory',
          duration: '20 minutes',
          content:
            'Programming is the process of creating a set of instructions that tell a computer how to perform a task...',
          order: 1,
        },
        {
          id: 2,
          title: 'Setting Up Your Development Environment',
          type: 'Theory',
          duration: '30 minutes',
          content:
            "In this lesson, we'll set up the tools you need to start programming...",
          order: 2,
        },
      ],
    },
    {
      id: 2,
      title: 'Variables and Data Types',
      description:
        'Understanding how to store and manipulate data in programming.',
      lessons: [
        {
          id: 3,
          title: 'Introduction to Variables',
          type: 'Theory',
          duration: '25 minutes',
          content:
            'Variables are used to store information to be referenced and manipulated in a computer program...',
          order: 1,
        },
        {
          id: 4,
          title: 'Working with Data Types',
          type: 'Theory',
          duration: '35 minutes',
          content:
            'Data types are classifications of data that tell the compiler or interpreter how the programmer intends to use the data...',
          order: 2,
        },
        {
          id: 5,
          title: 'Variable Practice',
          type: 'Exercise',
          duration: '45 minutes',
          content:
            'Practice creating and using variables with these exercises...',
          order: 3,
        },
      ],
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

  const handleDeleteModule = (moduleIndex: number) => {
    const updatedModules = [...course.modules];
    updatedModules.splice(moduleIndex, 1);
    setCourse({
      ...course,
      modules: updatedModules,
    });

    if (activeModule >= moduleIndex) {
      setActiveModule(Math.max(0, activeModule - 1));
    }
  };

  const handleDeleteLesson = (moduleIndex: number, lessonIndex: number) => {
    const updatedModules = [...course.modules];
    const updatedLessons = [...updatedModules[moduleIndex].lessons];
    updatedLessons.splice(lessonIndex, 1);

    // Update order for remaining lessons
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

    setActiveLesson(null);
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
        <div className="flex-1">
          {!editingCourse ? (
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {course.title}
                </h1>
                <p className="text-muted-foreground">{course.description}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingCourse(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="course-title">Course Title</Label>
                <Input
                  id="course-title"
                  value={editedCourse.title}
                  onChange={e =>
                    setEditedCourse({ ...editedCourse, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-description">Description</Label>
                <Textarea
                  id="course-description"
                  value={editedCourse.description}
                  onChange={e =>
                    setEditedCourse({
                      ...editedCourse,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-category">Category</Label>
                <Select
                  value={editedCourse.category}
                  onValueChange={value =>
                    setEditedCourse({ ...editedCourse, category: value })
                  }
                >
                  <SelectTrigger id="course-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">
                      Computer Science
                    </SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Humanities">Humanities</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingCourse(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveCourseDetails}>Save Changes</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="structure">
            <BookOpen className="h-4 w-4 mr-2" />
            Course Structure
          </TabsTrigger>
          <TabsTrigger value="exercises">
            <FileText className="h-4 w-4 mr-2" />
            Exercise Bank
          </TabsTrigger>
          <TabsTrigger value="tests">
            <GraduationCap className="h-4 w-4 mr-2" />
            Mock Tests
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
                  {course.modules
                    .flatMap(module => module.lessons)
                    .map((lesson, lessonIndex) => (
                      <div
                        key={lesson.id}
                        className={`flex items-center p-3 rounded-md border ${
                          activeLesson === lessonIndex
                            ? 'border-primary bg-muted/50'
                            : ''
                        }`}
                      >
                        <div className="flex items-center mr-2">
                          <Grip className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center mr-2">
                              {lesson.order}
                            </div>
                            <div>
                              <div className="font-medium truncate">
                                {lesson.title}
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted">
                                  {lesson.type}
                                </span>
                                <span className="mx-2">•</span>
                                <Clock className="h-3 w-3 mr-1" />
                                {lesson.duration}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              setActiveLesson(
                                lessonIndex === activeLesson
                                  ? null
                                  : lessonIndex
                              )
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                            onClick={() => handleDeleteLesson(0, lessonIndex)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
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

            {activeLesson !== null &&
              course.modules.flatMap(module => module.lessons)[
                activeLesson
              ] && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>
                      Edit Lesson:{' '}
                      {
                        course.modules.flatMap(module => module.lessons)[
                          activeLesson
                        ].title
                      }
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-lesson-title">Lesson Title</Label>
                        <Input
                          id="edit-lesson-title"
                          value={
                            course.modules.flatMap(module => module.lessons)[
                              activeLesson
                            ].title
                          }
                          onChange={e => {
                            const updatedLessons = course.modules.flatMap(
                              module => module.lessons
                            );
                            updatedLessons[activeLesson].title = e.target.value;
                            setCourse({
                              ...course,
                              modules: [
                                {
                                  ...course.modules[0],
                                  lessons: updatedLessons,
                                },
                              ],
                            });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-lesson-content">
                          Lesson Content
                        </Label>
                        <Textarea
                          id="edit-lesson-content"
                          rows={8}
                          value={
                            course.modules.flatMap(module => module.lessons)[
                              activeLesson
                            ].content
                          }
                          onChange={e => {
                            const updatedLessons = course.modules.flatMap(
                              module => module.lessons
                            );
                            updatedLessons[activeLesson].content =
                              e.target.value;
                            setCourse({
                              ...course,
                              modules: [
                                {
                                  ...course.modules[0],
                                  lessons: updatedLessons,
                                },
                              ],
                            });
                          }}
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

        <TabsContent value="tests" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Mock Tests</h2>
            <Dialog open={isAddTestOpen} onOpenChange={setIsAddTestOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Test
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Mock Test</DialogTitle>
                  <DialogDescription>
                    Create a new test for your course.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="test-title">Test Title</Label>
                    <Input
                      id="test-title"
                      value={newTest.title}
                      onChange={e =>
                        setNewTest({ ...newTest, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="test-description">Description</Label>
                    <Textarea
                      id="test-description"
                      value={newTest.description}
                      onChange={e =>
                        setNewTest({ ...newTest, description: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="test-duration">Duration</Label>
                    <Input
                      id="test-duration"
                      value={newTest.duration}
                      onChange={e =>
                        setNewTest({ ...newTest, duration: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="test-status">Status</Label>
                    <Select
                      value={newTest.status}
                      onValueChange={value =>
                        setNewTest({ ...newTest, status: value })
                      }
                    >
                      <SelectTrigger id="test-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddTestOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddTest}>Create Test</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {tests.map((test, index) => (
              <Card key={test.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{test.title}</CardTitle>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        test.status === 'Published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {test.status}
                    </span>
                  </div>
                  <CardDescription>{test.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{test.duration}</span>
                    </div>
                    <div>
                      <span>{test.questions} questions</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Test
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500"
                    onClick={() => handleDeleteTest(index)}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {tests.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No tests yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't created any mock tests yet. Create your first test
                  to get started.
                </p>
                <Button onClick={() => setIsAddTestOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Test
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
