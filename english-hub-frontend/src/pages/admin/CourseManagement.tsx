import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { BookOpen, FileText, GraduationCap, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAllCourses } from '@/services/courseService';
import AddCourseDialog from '@/components/admin/AddCourseDialog';

// Mock data
const initialCourses = [
  {
    id: 1,
    title: 'Part 1: Photographs',
    category: 'Listening',
    lessons: 12,
    tests: 3,
    status: 'Published',
    lastUpdated: '2023-05-15',
  },
  {
    id: 2,
    title: 'Part 2: Question-Response',
    category: 'Listening',
    lessons: 10,
    tests: 2,
    status: 'Published',
    lastUpdated: '2023-04-20',
  },
  {
    id: 3,
    title: 'Part 3: Conversations',
    category: 'Listening',
    lessons: 15,
    tests: 4,
    status: 'Draft',
    lastUpdated: '2023-06-01',
  },
  {
    id: 4,
    title: 'Part 4: Talks',
    category: 'Listening',
    lessons: 8,
    tests: 2,
    status: 'Published',
    lastUpdated: '2023-03-10',
  },
  {
    id: 5,
    title: 'Part 5: Incomplete Sentences',
    category: 'Reading',
    lessons: 14,
    tests: 5,
    status: 'Published',
    lastUpdated: '2023-05-22',
  },
  {
    id: 6,
    title: 'Part 6: Text Completion',
    category: 'Reading',
    lessons: 14,
    tests: 5,
    status: 'Published',
    lastUpdated: '2023-05-22',
  },
  {
    id: 7,
    title: 'Part 7: Single Passages',
    category: 'Reading',
    lessons: 14,
    tests: 5,
    status: 'Published',
    lastUpdated: '2023-05-22',
  },
  {
    id: 8,
    title: 'Part 7: Double Passages',
    category: 'Reading',
    lessons: 14,
    tests: 5,
    status: 'Published',
    lastUpdated: '2023-05-22',
  },
  {
    id: 9,
    title: 'Part 7: Triple Passages',
    category: 'Reading',
    lessons: 14,
    tests: 5,
    status: 'Published',
    lastUpdated: '2023-05-22',
  },
];

const initialTests = [
  {
    id: 1,
    title: 'Programming Basics Quiz',
    courseId: 1,
    questions: 20,
    duration: '30 minutes',
    status: 'Published',
    lastUpdated: '2023-05-18',
  },
  {
    id: 2,
    title: 'Economics Midterm',
    courseId: 2,
    questions: 15,
    duration: '45 minutes',
    status: 'Published',
    lastUpdated: '2023-04-25',
  },
  {
    id: 3,
    title: 'Data Analysis Assessment',
    courseId: 3,
    questions: 25,
    duration: '60 minutes',
    status: 'Draft',
    lastUpdated: '2023-06-02',
  },
  {
    id: 4,
    title: 'Literature Review',
    courseId: 4,
    questions: 10,
    duration: '40 minutes',
    status: 'Published',
    lastUpdated: '2023-03-15',
  },
  {
    id: 5,
    title: 'Calculus Final Exam',
    courseId: 5,
    questions: 30,
    duration: '90 minutes',
    status: 'Published',
    lastUpdated: '2023-05-25',
  },
];

type Course = (typeof initialCourses)[0];
type Test = (typeof initialTests)[0];

export default function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [tests, setTests] = useState<Test[]>(initialTests);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('courses');
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [isAddTestOpen, setIsAddTestOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    category: 'Computer Science',
    status: 'Draft',
  });
  const [newTest, setNewTest] = useState({
    title: '',
    courseId: 1,
    questions: 10,
    duration: '30 minutes',
    status: 'Draft',
  });

  const courseQuery = useQuery({
    queryKey: ['courses'],
    queryFn: getAllCourses,
    select: data => data,
  });

  const filteredCourses = courses.filter(
    course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTests = tests.filter(
    test =>
      test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCourseTitle(test.courseId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleAddCourse = () => {
    const id = Math.max(...courses.map(course => course.id)) + 1;
    const today = new Date().toISOString().split('T')[0];
    setCourses([
      ...courses,
      {
        ...newCourse,
        id,
        lessons: 0,
        tests: 0,
        lastUpdated: today,
      },
    ]);
    setNewCourse({ title: '', category: 'Computer Science', status: 'Draft' });
    setIsAddCourseOpen(false);
  };

  const handleAddTest = () => {
    const id = Math.max(...tests.map(test => test.id)) + 1;
    const today = new Date().toISOString().split('T')[0];
    setTests([
      ...tests,
      {
        ...newTest,
        id,
        lastUpdated: today,
      },
    ]);
    setNewTest({
      title: '',
      courseId: 1,
      questions: 10,
      duration: '30 minutes',
      status: 'Draft',
    });
    setIsAddTestOpen(false);
  };

  //   const handleDeleteCourse = (id: number) => {
  //     setCourses(courses.filter(course => course.id !== id));
  //     // Also delete associated tests
  //     setTests(tests.filter(test => test.courseId !== id));
  //   };

  //   const handleDeleteTest = (id: number) => {
  //     setTests(tests.filter(test => test.id !== id));
  //   };

  const getCourseTitle = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : 'Unknown Course';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Content Management
          </h1>
          <p className="text-muted-foreground">
            Manage courses, lessons, exercises, and tests for your learning
            platform.
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
          </TabsList>
          {activeTab === 'courses' ? (
            <AddCourseDialog
              isOpen={isAddCourseOpen}
              onOpenChange={setIsAddCourseOpen}
            />
          ) : (
            <Dialog open={isAddTestOpen} onOpenChange={setIsAddTestOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Test
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Test</DialogTitle>
                  <DialogDescription>
                    Create a new test or quiz for a course.
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
                    <Label htmlFor="courseId">Course</Label>
                    <Select
                      value={newTest.courseId.toString()}
                      onValueChange={value =>
                        setNewTest({
                          ...newTest,
                          courseId: Number.parseInt(value),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map(course => (
                          <SelectItem
                            key={course.id}
                            value={course.id.toString()}
                          >
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="questions">Number of Questions</Label>
                    <Input
                      id="questions"
                      type="number"
                      value={newTest.questions.toString()}
                      onChange={e =>
                        setNewTest({
                          ...newTest,
                          questions: Number.parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
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
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
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
                  <Button onClick={handleAddTest}>Add Test</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${activeTab}...`}
              className="pl-8"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="courses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map(course => (
              <Link
                key={course.id}
                to={`/admin/courses/${course.id}`}
                className="block"
              >
                <div className="h-full">
                  <div className="h-full border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{course.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {course.category}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          course.status === 'Published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {course.status}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{course.lessons} lessons</span>
                      </div>
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{course.tests} tests</span>
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-muted-foreground">
                      Last updated: {course.lastUpdated}
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            <div
              className="border rounded-lg p-6 border-dashed flex flex-col items-center justify-center text-center h-full cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
              onClick={() => setIsAddCourseOpen(true)}
            >
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium">Add New Course</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Create a new course for your platform
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTests.map(test => (
              <Link
                key={test.id}
                to={`/dashboard/test-builder?id=${test.id}`}
                className="block"
              >
                <div className="h-full">
                  <div className="h-full border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{test.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {getCourseTitle(test.courseId)}
                        </p>
                      </div>
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
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{test.questions} questions</span>
                      </div>
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{test.duration}</span>
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-muted-foreground">
                      Last updated: {test.lastUpdated}
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            <div
              className="border rounded-lg p-6 border-dashed flex flex-col items-center justify-center text-center h-full cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
              onClick={() => setIsAddTestOpen(true)}
            >
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium">Add New Test</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Create a new test or quiz for your courses
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
