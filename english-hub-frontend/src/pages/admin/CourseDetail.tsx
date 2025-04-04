import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { ArrowLeft, BookOpen, FileText, Plus, X } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import LessonItem from '@/components/admin/LessonItem';
import { LessonResponse } from '@/types/lessonType';
import AddLessonDialog from '@/components/admin/AddLessonDialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import GlobalSkeleton from '@/components/GlobalSkeleton';
import { deleteLesson, getAllLessons } from '@/services/lessonService';
import UpdateLessonCard from '@/components/admin/UpdateLessonCard';
import { isAxiosError } from 'axios';
import { showError, showSuccess } from '@/hooks/useToast';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import ExerciseItem from '@/components/admin/ExceriseItem';
import { ExerciseResponse } from '@/types/exerciseType';
import { CourseResponse } from '@/types/courseType';
import { getAllExercises } from '@/services/exerciseService';

// Type definitions for exercise structures
type MediaType = {
  type: 'image' | 'audio';
  url: string;
};

type Option = {
  id: string;
  text: string;
  isCorrect?: boolean;
};

type Question = {
  id: string;
  title: string;
  type: string;
  instructions?: string;
  options?: Option[];
  media?: MediaType[];
  correctAnswer?: string | string[];
  points: number;
  imageIndex?: number;
};

type QuestionGroup = {
  id: string;
  title: string;
  audioUrl?: string;
  script?: string;
  imageUrl?: string; // Cho Part 1 (photos)
  questions: Question[];
};

type ToeicExercise = {
  id: string | number;
  title: string;
  section: 'listening' | 'reading';
  type: string;
  difficulty: string;
  estimatedTime: string;
  instructions: string;
  audioUrl?: string;
  passage?: string;
  script?: string;
  images?: string[];
  additionalPassages?: string[];
  questions: Question[];
  questionGroups?: QuestionGroup[];
};

const CourseInitial = {
  title: 'abc',
  description: 'abc',
  imageUrl: 'abc',
  createdDate: new Date(),
  updatedDate: new Date(),
};

export default function CourseDetail() {
  const [course, setCourse] = useState<CourseResponse | null>(CourseInitial);
  const [activeTab, setActiveTab] = useState('lessons');
  const [isAddLessonOpen, setIsAddLessonOpen] = useState<boolean>(false);
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState<boolean>(false);

  const [selectedLesson, setSelectedLesson] = useState<LessonResponse | null>(
    null
  );
  const [selectedExercise, setSelectedExercise] =
    useState<ExerciseResponse | null>(null);

  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [expandedQuestionGroup, setExpandedQuestionGroup] = useState<
    string | null
  >(null);

  const { courseId } = useParams();

  useEffect(() => {
    setSelectedLesson(null);
  }, [activeTab]);

  const queryClient = useQueryClient();

  const { data: lessons = [], isLoading: isLessonsLoading } = useQuery({
    queryKey: ['lessons'],
    queryFn: () => getAllLessons(courseId || ''),
  });

  const { data: exercises = [], isLoading: isExercisesLoading } = useQuery({
    queryKey: ['exercises'],
    queryFn: () => getAllExercises(courseId || ''),
  });

  const deleteLessonMutation = useMutation({
    mutationFn: ({
      courseId,
      lessonId,
    }: {
      courseId: string;
      lessonId: string;
    }) => deleteLesson(courseId, lessonId),
    onSuccess: (response: string, { lessonId }) => {
      queryClient.setQueryData<LessonResponse[]>(
        ['lessons'],
        (oldLessons = []) =>
          Array.isArray(oldLessons)
            ? oldLessons.filter(lesson => lesson.id !== lessonId)
            : []
      );
      showSuccess(response);
    },
    onError: error => {
      if (isAxiosError(error)) {
        showError(error.response?.data.message);
      } else {
        showError('Something went wrong');
      }
    },
  });

  // Hàm tạo ID ngẫu nhiên
  const generateId = () => Math.random().toString(36).substring(2, 9);

  const handleSelectLesson = (id: string) => {
    if (selectedLesson?.id !== id) {
      setSelectedLesson(lessons.find(lesson => lesson.id === id) || null);
    } else {
      setSelectedLesson(null);
    }
  };

  const handleSelectExercise = (id: string) => {
    if (selectedExercise?.id !== id) {
      setSelectedExercise(
        exercises.find(exercise => exercise.id === id) || null
      );
      setIsAddExerciseOpen(true);
    } else {
      setSelectedExercise(null);
      setIsAddExerciseOpen(false);
    }
  };

  const handleDeleteLesson = (id: string) => {
    deleteLessonMutation.mutate({
      courseId: courseId || '',
      lessonId: id,
    });
  };

  const handleDeleteExercise = (id: string) => {
    return id;
  };

  // const handleDeleteExercise = (exerciseIndex: number) => {
  //   const updatedExercises = [...exercises];
  //   updatedExercises.splice(exerciseIndex, 1);
  //   setExercises(updatedExercises);
  // };
  const [newExercise, setNewExercise] = useState<ToeicExercise>({
    id: '',
    title: '',
    section: 'listening',
    type: '',
    difficulty: 'medium',
    estimatedTime: '15 minutes',
    instructions: '',
    audioUrl: '',
    passage: '',
    script: '',
    images: [],
    additionalPassages: [],
    questions: [],
    questionGroups: [],
  });
  // Thêm các hàm xử lý câu hỏi
  // Kiểm tra xem newExercise có tồn tại không trước khi truy cập thuộc tính
  // Kiểm tra xem newExercise có tồn tại không trước khi truy cập thuộc tính
  const addNewQuestion = () => {
    const newQuestion: Question = {
      id: generateId(),
      title: '',
      type: 'multiple_choice',
      options: [],
      points: 1,
    };

    // Tùy chỉnh dựa trên loại bài tập
    if (newExercise?.section === 'listening') {
      if (newExercise?.type === 'photographs') {
        newQuestion.imageIndex = (newExercise?.questions?.length || 0) % 4; // Xoay vòng qua 4 ảnh
        newQuestion.title = `Select the statement that best describes what you see in the picture ${
          newQuestion.imageIndex + 1
        }`;
      } else if (newExercise?.type === 'question_response') {
        newQuestion.title = 'You will hear: (Audio question)';
      }
    }

    setNewExercise({
      ...newExercise,
      questions: [...(newExercise?.questions || []), newQuestion],
    });

    setExpandedQuestion(newQuestion.id);
  };
  const removeQuestion = (questionId: string) => {
    setNewExercise({
      ...newExercise,
      questions: newExercise.questions.filter(q => q.id !== questionId),
    });

    if (expandedQuestion === questionId) {
      setExpandedQuestion(null);
    }
  };

  const expandQuestion = (questionId: string) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  const updateQuestion = (questionId: string, property: string, value: any) => {
    setNewExercise({
      ...newExercise,
      questions: newExercise.questions?.map(q =>
        q.id === questionId ? { ...q, [property]: value } : q
      ),
    });
  };

  // Thêm các hàm xử lý media
  const addMedia = (questionId: string) => {
    const question = newExercise.questions.find(q => q.id === questionId);
    if (!question) return;

    const newMedia = {
      type: 'image',
      url: '',
    };

    updateQuestion(questionId, 'media', [...(question.media || []), newMedia]);
  };

  const removeMedia = (questionId: string, mediaIndex: number) => {
    const question = newExercise.questions.find(q => q.id === questionId);
    if (!question || !question.media) return;

    const newMedia = [...question.media];
    newMedia.splice(mediaIndex, 1);

    updateQuestion(questionId, 'media', newMedia);
  };

  const updateMedia = (
    questionId: string,
    mediaIndex: number,
    property: string,
    value: string
  ) => {
    const question = newExercise.questions.find(q => q.id === questionId);
    if (!question || !question.media) return;

    const newMedia = [...question.media];
    newMedia[mediaIndex] = { ...newMedia[mediaIndex], [property]: value };

    updateQuestion(questionId, 'media', newMedia);
  };

  // Thêm các hàm xử lý option
  const addOption = (questionId: string, defaultText = '') => {
    const question = newExercise.questions.find(q => q.id === questionId);
    if (!question) return;

    const newOption = {
      id: generateId(),
      text: defaultText,
      isCorrect: false,
    };

    updateQuestion(questionId, 'options', [
      ...(question.options || []),
      newOption,
    ]);
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = newExercise.questions.find(q => q.id === questionId);
    if (!question || !question.options) return;

    const newOptions = [...question.options];
    newOptions.splice(optionIndex, 1);

    updateQuestion(questionId, 'options', newOptions);
  };

  const updateOption = (
    questionId: string,
    optionIndex: number,
    property: string,
    value: any
  ) => {
    const question = newExercise.questions.find(q => q.id === questionId);
    if (!question || !question.options) return;

    const newOptions = [...question.options];
    newOptions[optionIndex] = { ...newOptions[optionIndex], [property]: value };

    updateQuestion(questionId, 'options', newOptions);
  };

  // Thêm các helper functions để xử lý questionGroups
  // Function để thêm group mới
  // Cập nhật điều kiện trong hàm addQuestionGroup
  const addQuestionGroup = () => {
    if (
      !newExercise ||
      !['photographs', 'conversations', 'short_talks'].includes(
        newExercise.type
      )
    ) {
      return;
    }

    const groupId = generateId();
    let title = '';

    switch (newExercise.type) {
      case 'photographs':
        title = `Photo ${(newExercise.questionGroups?.length || 0) + 1}`;
        break;
      case 'conversations':
        title = `Conversation ${(newExercise.questionGroups?.length || 0) + 1}`;
        break;
      case 'short_talks':
        title = `Talk ${(newExercise.questionGroups?.length || 0) + 1}`;
        break;
    }

    const newGroup: QuestionGroup = {
      id: groupId,
      title,
      audioUrl: '',
      script: '',
      imageUrl: '',
      questions: [],
    };

    setNewExercise({
      ...newExercise,
      questionGroups: [...(newExercise.questionGroups || []), newGroup],
    });

    setExpandedQuestionGroup(groupId);
  };

  const addStandardQuestionSet = () => {
    if (!newExercise.type) return;

    let newQuestions: Question[] = [];

    // Tạo bộ câu hỏi phù hợp với loại bài tập
    switch (newExercise.type) {
      case 'text_completion':
        // Tìm các blank trong passage
        const text = newExercise.passage || '';
        const blankMatches = text.match(/\[\d+\]/g) || [];

        blankMatches.forEach(match => {
          const blankNumber = match.replace(/\[|\]/g, '');
          newQuestions.push({
            id: generateId(),
            title: `Blank [${blankNumber}]`,
            type: 'multiple_choice',
            points: 1,
            options: [
              { id: generateId(), text: 'Option A', isCorrect: false },
              { id: generateId(), text: 'Option B', isCorrect: false },
              { id: generateId(), text: 'Option C', isCorrect: false },
              { id: generateId(), text: 'Option D', isCorrect: false },
            ],
          });
        });
        break;

      case 'reading_comprehension':
      case 'multiple_passages':
        // Tạo 3 câu hỏi đọc hiểu tiêu chuẩn
        for (let i = 1; i <= 3; i++) {
          newQuestions.push({
            id: generateId(),
            title: `Question ${(newExercise.questions?.length || 0) + i}`,
            type: 'multiple_choice',
            points: 1,
            options: [
              { id: generateId(), text: 'Option A', isCorrect: false },
              { id: generateId(), text: 'Option B', isCorrect: false },
              { id: generateId(), text: 'Option C', isCorrect: false },
              { id: generateId(), text: 'Option D', isCorrect: false },
            ],
          });
        }
        break;

      case 'incomplete_sentences':
        // 3 câu hỏi điền từ
        for (let i = 1; i <= 3; i++) {
          newQuestions.push({
            id: generateId(),
            title: `Sentence ${(newExercise.questions?.length || 0) + i}`,
            type: 'multiple_choice',
            points: 1,
            options: [
              { id: generateId(), text: 'Option A', isCorrect: false },
              { id: generateId(), text: 'Option B', isCorrect: false },
              { id: generateId(), text: 'Option C', isCorrect: false },
              { id: generateId(), text: 'Option D', isCorrect: false },
            ],
          });
        }
        break;
    }

    if (newQuestions.length > 0) {
      setNewExercise({
        ...newExercise,
        questions: [...(newExercise.questions || []), ...newQuestions],
      });

      // Mở editor cho câu hỏi đầu tiên
      setExpandedQuestion(newQuestions[0].id);
    }
  };

  const moveQuestionInGroup = (
    groupId: string,
    questionId: string,
    direction: 'up' | 'down'
  ) => {
    const group = newExercise.questionGroups?.find(g => g.id === groupId);
    if (!group) return;

    const questionIndex = group.questions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) return;

    const newQuestions = [...group.questions];

    if (direction === 'up' && questionIndex > 0) {
      // Di chuyển lên (swap với câu hỏi trước)
      const temp = newQuestions[questionIndex - 1];
      newQuestions[questionIndex - 1] = newQuestions[questionIndex];
      newQuestions[questionIndex] = temp;
    } else if (
      direction === 'down' &&
      questionIndex < newQuestions.length - 1
    ) {
      // Di chuyển xuống (swap với câu hỏi sau)
      const temp = newQuestions[questionIndex + 1];
      newQuestions[questionIndex + 1] = newQuestions[questionIndex];
      newQuestions[questionIndex] = temp;
    }

    updateQuestionGroup(groupId, 'questions', newQuestions);
  };

  // Helper function để nhân đôi câu hỏi
  const duplicateQuestionInGroup = (groupId: string, questionId: string) => {
    const group = newExercise.questionGroups?.find(g => g.id === groupId);
    if (!group) return;

    const question = group.questions.find(q => q.id === questionId);
    if (!question) return;

    const newQuestion = {
      ...question,
      id: generateId(),
      title: `${question.title} (Copy)`,
    };

    updateQuestionGroup(groupId, 'questions', [
      ...group.questions,
      newQuestion,
    ]);
  };

  // Sửa các hàm helper hiện có
  const moveQuestionUp = (groupId: string, questionId: string) =>
    moveQuestionInGroup(groupId, questionId, 'up');

  const moveQuestionDown = (groupId: string, questionId: string) =>
    moveQuestionInGroup(groupId, questionId, 'down');

  // Function để cập nhật thuộc tính của group
  const updateQuestionGroup = (
    groupId: string,
    property: string,
    value: any
  ) => {
    setNewExercise({
      ...newExercise,
      questionGroups: (newExercise.questionGroups || []).map(group =>
        group.id === groupId ? { ...group, [property]: value } : group
      ),
    });
  };

  // Function để xóa group
  const removeQuestionGroup = (groupId: string) => {
    setNewExercise({
      ...newExercise,
      questionGroups: (newExercise.questionGroups || []).filter(
        group => group.id !== groupId
      ),
    });

    if (expandedQuestionGroup === groupId) {
      setExpandedQuestionGroup(null);
    }
  };

  // Function để thêm câu hỏi vào group
  const addQuestionToGroup = (groupId: string) => {
    const group = newExercise.questionGroups?.find(g => g.id === groupId);
    if (!group) return;

    const newQuestion: Question = {
      id: generateId(),
      title: '',
      type: 'multiple_choice',
      options: [],
      points: 1,
    };

    // Tự động tạo câu hỏi dựa trên loại bài tập
    if (newExercise.type === 'photographs') {
      newQuestion.title =
        'Select the statement that best describes what you see in the picture';
    }

    updateQuestionGroup(groupId, 'questions', [
      ...group.questions,
      newQuestion,
    ]);
    setExpandedQuestion(newQuestion.id);
  };

  // Function để xóa câu hỏi khỏi group
  const removeQuestionFromGroup = (groupId: string, questionId: string) => {
    const group = newExercise.questionGroups?.find(g => g.id === groupId);
    if (!group) return;

    updateQuestionGroup(
      groupId,
      'questions',
      group.questions.filter(q => q.id !== questionId)
    );

    if (expandedQuestion === questionId) {
      setExpandedQuestion(null);
    }
  };

  // Function để cập nhật thuộc tính của câu hỏi trong group
  const updateQuestionInGroup = (
    groupId: string,
    questionId: string,
    property: string,
    value: any
  ) => {
    const group = newExercise.questionGroups?.find(g => g.id === groupId);
    if (!group) return;

    updateQuestionGroup(
      groupId,
      'questions',
      group.questions?.map(q =>
        q.id === questionId ? { ...q, [property]: value } : q
      )
    );
  };

  // Function để thêm option vào câu hỏi trong group
  const addOptionToQuestionInGroup = (
    groupId: string,
    questionId: string,
    defaultText = ''
  ) => {
    const group = newExercise.questionGroups?.find(g => g.id === groupId);
    if (!group) return;

    const question = group.questions.find(q => q.id === questionId);
    if (!question) return;

    const newOption = {
      id: generateId(),
      text: defaultText,
      isCorrect: false,
    };

    updateQuestionInGroup(groupId, questionId, 'options', [
      ...(question.options || []),
      newOption,
    ]);
  };

  // Function để xóa option khỏi câu hỏi trong group
  const removeOptionFromQuestionInGroup = (
    groupId: string,
    questionId: string,
    optionIndex: number
  ) => {
    const group = newExercise.questionGroups?.find(g => g.id === groupId);
    if (!group) return;

    const question = group.questions.find(q => q.id === questionId);
    if (!question || !question.options) return;

    const newOptions = [...question.options];
    newOptions.splice(optionIndex, 1);

    updateQuestionInGroup(groupId, questionId, 'options', newOptions);
  };

  // Function để cập nhật option trong câu hỏi thuộc group
  const updateOptionInQuestionInGroup = (
    groupId: string,
    questionId: string,
    optionIndex: number,
    property: string,
    value: any
  ) => {
    const group = newExercise.questionGroups?.find(g => g.id === groupId);
    if (!group) return;

    const question = group.questions.find(q => q.id === questionId);
    if (!question || !question.options) return;

    const newOptions = [...question.options];
    newOptions[optionIndex] = { ...newOptions[optionIndex], [property]: value };

    updateQuestionInGroup(groupId, questionId, 'options', newOptions);
  };

  // Thêm các hàm xử lý passage
  const addAdditionalPassage = () => {
    setNewExercise({
      ...newExercise,
      additionalPassages: [...(newExercise.additionalPassages || []), ''],
    });
  };

  const removeAdditionalPassage = (index: number) => {
    const passages = [...(newExercise.additionalPassages || [])];
    passages.splice(index, 1);
    setNewExercise({
      ...newExercise,
      additionalPassages: passages,
    });
  };

  const updateAdditionalPassage = (index: number, value: string) => {
    const passages = [...(newExercise.additionalPassages || [])];
    passages[index] = value;
    setNewExercise({
      ...newExercise,
      additionalPassages: passages,
    });
  };

  // Helper function để lấy tên phần TOEIC
  const getToeicPartName = (type: string): string => {
    const partNames: Record<string, string> = {
      photographs: 'Part 1: Photographs',
      question_response: 'Part 2: Question-Response',
      conversations: 'Part 3: Conversations',
      short_talks: 'Part 4: Short Talks',
      incomplete_sentences: 'Part 5: Incomplete Sentences',
      text_completion: 'Part 6: Text Completion',
      reading_comprehension: 'Part 7: Single Passage',
      multiple_passages: 'Part 7: Multiple Passages',
    };

    return partNames[type] || type;
  };

  // Helper function để lấy mô tả phần
  const getToeicPartDescription = (type: string): string => {
    const descriptions: Record<string, string> = {
      photographs:
        'Look at a photograph and select the statement that best describes it.',
      question_response: 'Listen to a question and select the best response.',
      conversations: 'Listen to a conversation and answer questions about it.',
      short_talks: 'Listen to a short talk and answer questions about it.',
      incomplete_sentences:
        'Complete sentences with the appropriate word or phrase.',
      text_completion: 'Complete a text with appropriate words or phrases.',
      reading_comprehension: 'Read a passage and answer questions about it.',
      multiple_passages:
        'Read multiple related texts and answer questions about them.',
    };

    return descriptions[type] || '';
  };

  // Function để render các trường nhập liệu dựa trên loại bài tập TOEIC
  const renderExerciseTypeSpecificFields = () => {
    if (!newExercise.section || !newExercise.type) return null;

    // LISTENING SECTION
    if (newExercise.section === 'listening') {
      // PART 1: Photographs
      if (newExercise.type === 'photographs') {
        return (
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">Photographs</h3>
              <Button variant="outline" size="sm" onClick={addQuestionGroup}>
                <Plus className="h-4 w-4 mr-2" />
                Add Photo
              </Button>
            </div>

            <div className="space-y-4">
              {(newExercise.questionGroups || []).length > 0 ? (
                (newExercise.questionGroups || []).map((group, index) => (
                  <Card key={group.id} className="border-2 border-muted">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">
                            Photo {index + 1}: {group.title}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground">
                            {group.questions.length} question(s)
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setExpandedQuestionGroup(
                                expandedQuestionGroup === group.id
                                  ? null
                                  : group.id
                              )
                            }
                          >
                            {expandedQuestionGroup === group.id
                              ? 'Collapse'
                              : 'Edit'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500"
                            onClick={() => removeQuestionGroup(group.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {expandedQuestionGroup === group.id && (
                      <CardContent>
                        <div className="space-y-4">
                          {/* Photo Upload */}
                          <div className="grid gap-2">
                            <Label htmlFor={`group-${group.id}-photo`}>
                              Photo
                            </Label>
                            <div className="h-60 bg-muted rounded flex items-center justify-center">
                              {group.imageUrl ? (
                                <img
                                  src={group.imageUrl}
                                  alt="Photo"
                                  className="max-h-full max-w-full object-contain"
                                />
                              ) : (
                                <span className="text-muted-foreground">
                                  Upload or enter image URL
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2 mt-2">
                              <Input
                                id={`group-${group.id}-photo`}
                                placeholder="Image URL"
                                value={group.imageUrl || ''}
                                onChange={e =>
                                  updateQuestionGroup(
                                    group.id,
                                    'imageUrl',
                                    e.target.value
                                  )
                                }
                                className="flex-1"
                              />
                              <Button variant="secondary" className="shrink-0">
                                Upload
                              </Button>
                            </div>
                          </div>

                          {/* Questions for this photo */}
                          <div className="border-t pt-4 mt-4">
                            <div className="flex items-center justify-between mb-4">
                              <Label>Questions</Label>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addQuestionToGroup(group.id)}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Question
                              </Button>
                            </div>

                            <div className="space-y-3">
                              {group.questions?.map((question, qIndex) => (
                                <div
                                  key={question.id}
                                  className="border rounded-md p-3"
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="text-sm font-medium">
                                        Question {qIndex + 1}:{' '}
                                        {question.title || 'Untitled'}
                                      </h4>
                                      <p className="text-xs text-muted-foreground">
                                        {question.type} • {question.points}{' '}
                                        points
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          expandQuestion(question.id)
                                        }
                                      >
                                        {expandedQuestion === question.id
                                          ? 'Collapse'
                                          : 'Edit'}
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500"
                                        onClick={() =>
                                          removeQuestionFromGroup(
                                            group.id,
                                            question.id
                                          )
                                        }
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Expanded question editor */}
                                  {expandedQuestion === question.id && (
                                    <div className="mt-4 pt-4 border-t">
                                      <div className="grid gap-4 py-2">
                                        <div className="grid gap-2">
                                          <Label
                                            htmlFor={`question-${question.id}-title`}
                                          >
                                            Question Title
                                          </Label>
                                          <Input
                                            id={`question-${question.id}-title`}
                                            placeholder="Enter question title"
                                            value={question.title}
                                            onChange={e =>
                                              updateQuestionInGroup(
                                                group.id,
                                                question.id,
                                                'title',
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>

                                        {/* Multiple choice options */}
                                        <div className="grid gap-2">
                                          <div className="flex justify-between items-center">
                                            <Label>Answer Options</Label>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() =>
                                                addOptionToQuestionInGroup(
                                                  group.id,
                                                  question.id
                                                )
                                              }
                                            >
                                              Add Option
                                            </Button>
                                          </div>

                                          {question.options &&
                                          question.options.length > 0 ? (
                                            <div className="space-y-2">
                                              {question.options?.map(
                                                (option, optionIndex) => (
                                                  <div
                                                    key={option.id}
                                                    className="flex items-center gap-2 border rounded-md p-2"
                                                  >
                                                    <div className="flex items-center space-x-2">
                                                      <Checkbox
                                                        id={`group-${group.id}-option-${option.id}-correct`}
                                                        checked={
                                                          option.isCorrect
                                                        }
                                                        onCheckedChange={checked =>
                                                          updateOptionInQuestionInGroup(
                                                            group.id,
                                                            question.id,
                                                            optionIndex,
                                                            'isCorrect',
                                                            Boolean(checked)
                                                          )
                                                        }
                                                      />
                                                      <Label
                                                        htmlFor={`group-${group.id}-option-${option.id}-correct`}
                                                        className="text-sm font-normal"
                                                      >
                                                        Correct
                                                      </Label>
                                                    </div>
                                                    <Input
                                                      placeholder={`Option ${
                                                        optionIndex + 1
                                                      }`}
                                                      value={option.text}
                                                      onChange={e =>
                                                        updateOptionInQuestionInGroup(
                                                          group.id,
                                                          question.id,
                                                          optionIndex,
                                                          'text',
                                                          e.target.value
                                                        )
                                                      }
                                                      className="flex-1"
                                                    />
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      className="text-red-500 h-8 w-8 p-0"
                                                      onClick={() =>
                                                        removeOptionFromQuestionInGroup(
                                                          group.id,
                                                          question.id,
                                                          optionIndex
                                                        )
                                                      }
                                                    >
                                                      <X className="h-4 w-4" />
                                                    </Button>
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          ) : (
                                            <p className="text-sm text-muted-foreground">
                                              No options added
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}

                              {group.questions.length === 0 && (
                                <div className="text-center p-4 border rounded-md bg-muted/30">
                                  <p className="text-muted-foreground">
                                    No questions added yet. Click "Add Question"
                                    to begin.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))
              ) : (
                <div className="text-center p-8 border rounded-md bg-muted/30">
                  <p className="text-muted-foreground">
                    No photographs added yet. Click "Add Photo" to begin.
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      }

      // PART 2: Question-Response
      if (newExercise.type === 'question_response') {
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="audio-url">Audio File</Label>
              <div className="flex gap-2">
                <Input
                  id="audio-url"
                  placeholder="Audio URL (or upload)"
                  value={newExercise.audioUrl || ''}
                  onChange={e =>
                    setNewExercise({
                      ...newExercise,
                      audioUrl: e.target.value,
                    })
                  }
                  className="flex-1"
                />
                <Button variant="secondary" className="shrink-0">
                  Upload Audio
                </Button>
              </div>
              {newExercise.audioUrl && (
                <div className="mt-2">
                  <audio
                    controls
                    src={newExercise.audioUrl}
                    className="w-full"
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="audio-script">Audio Script</Label>
              <Textarea
                id="audio-script"
                placeholder="Enter the transcript of the questions (optional)"
                rows={4}
                value={newExercise.script || ''}
                onChange={e =>
                  setNewExercise({ ...newExercise, script: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                For part 2, add individual questions below in the Questions
                section
              </p>
            </div>
          </div>
        );
      }

      // PART 3 & 4: Conversations and Short Talks
      if (
        newExercise.type === 'conversations' ||
        newExercise.type === 'short_talks'
      ) {
        return (
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium">
                  {newExercise.type === 'conversations'
                    ? 'Conversations'
                    : 'Short Talks'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Create{' '}
                  {newExercise.type === 'conversations'
                    ? 'conversations'
                    : 'talks'}{' '}
                  with related questions
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={addQuestionGroup}>
                <Plus className="h-4 w-4 mr-2" />
                Add{' '}
                {newExercise.type === 'conversations' ? 'Conversation' : 'Talk'}
              </Button>
            </div>

            <div className="space-y-4">
              {(newExercise.questionGroups || []).length > 0 ? (
                (newExercise.questionGroups || []).map((group, index) => (
                  <Card
                    key={group.id}
                    className={`border-2 ${
                      expandedQuestionGroup === group.id
                        ? 'border-primary'
                        : 'border-muted'
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            {newExercise.type === 'conversations'
                              ? 'Conversation'
                              : 'Talk'}{' '}
                            {index + 1}:
                            <Input
                              value={group.title}
                              onChange={e =>
                                updateQuestionGroup(
                                  group.id,
                                  'title',
                                  e.target.value
                                )
                              }
                              className="h-7 w-full max-w-[240px]"
                              placeholder={`${
                                newExercise.type === 'conversations'
                                  ? 'Conversation'
                                  : 'Talk'
                              } title`}
                            />
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {group.questions.length} question(s)
                            </span>
                            {group.audioUrl && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Has Audio
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setExpandedQuestionGroup(
                                expandedQuestionGroup === group.id
                                  ? null
                                  : group.id
                              )
                            }
                          >
                            {expandedQuestionGroup === group.id
                              ? 'Collapse'
                              : 'Edit'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500"
                            onClick={() => removeQuestionGroup(group.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {expandedQuestionGroup === group.id && (
                      <CardContent>
                        <div className="space-y-4">
                          {/* Audio upload */}
                          <div className="grid gap-2">
                            <Label htmlFor={`group-${group.id}-audio`}>
                              Audio File
                            </Label>
                            <div className="flex gap-2">
                              <Input
                                id={`group-${group.id}-audio`}
                                placeholder="Audio URL for this conversation"
                                value={group.audioUrl || ''}
                                onChange={e =>
                                  updateQuestionGroup(
                                    group.id,
                                    'audioUrl',
                                    e.target.value
                                  )
                                }
                                className="flex-1"
                              />
                              <Button variant="secondary" className="shrink-0">
                                Upload
                              </Button>
                            </div>
                            {group.audioUrl && (
                              <div className="mt-2">
                                <audio
                                  controls
                                  src={group.audioUrl}
                                  className="w-full"
                                />
                              </div>
                            )}
                          </div>

                          {/* Script input */}
                          <div className="grid gap-2">
                            <Label htmlFor={`group-${group.id}-script`}>
                              {newExercise.type === 'conversations'
                                ? 'Conversation Script'
                                : 'Talk Script'}
                            </Label>
                            <Textarea
                              id={`group-${group.id}-script`}
                              placeholder={`Enter the transcript of the ${
                                newExercise.type === 'conversations'
                                  ? 'conversation'
                                  : 'talk'
                              }`}
                              rows={4}
                              value={group.script || ''}
                              onChange={e =>
                                updateQuestionGroup(
                                  group.id,
                                  'script',
                                  e.target.value
                                )
                              }
                            />
                          </div>

                          {/* Questions for this conversation/talk */}
                          <div className="border-t pt-4 mt-4">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <Label className="text-base font-medium">
                                  Questions
                                </Label>
                                <p className="text-xs text-muted-foreground mt-1">
                                  For this{' '}
                                  {newExercise.type === 'conversations'
                                    ? 'conversation'
                                    : 'talk'}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    addMultipleQuestionsToGroup(group.id)
                                  }
                                  title="Add 3 standard questions"
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add 3 Questions
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addQuestionToGroup(group.id)}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Question
                                </Button>
                              </div>
                            </div>

                            <div className="space-y-3">
                              {group.questions?.map((question, qIndex) => (
                                <div
                                  key={question.id}
                                  className={`border rounded-md p-3 ${
                                    expandedQuestion === question.id
                                      ? 'border-primary'
                                      : ''
                                  }`}
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-3">
                                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-muted text-sm font-medium">
                                        {qIndex + 1}
                                      </span>
                                      <div>
                                        <h4 className="text-sm font-medium">
                                          {question.title ||
                                            `Question ${qIndex + 1}`}
                                        </h4>
                                        <p className="text-xs text-muted-foreground">
                                          {question.type} • {question.points}{' '}
                                          points
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          expandQuestion(question.id)
                                        }
                                      >
                                        {expandedQuestion === question.id
                                          ? 'Collapse'
                                          : 'Edit'}
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500"
                                        onClick={() =>
                                          removeQuestionFromGroup(
                                            group.id,
                                            question.id
                                          )
                                        }
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Expanded question editor */}
                                  {expandedQuestion === question.id && (
                                    <div className="mt-4 pt-4 border-t">
                                      <div className="grid gap-4 py-2">
                                        <div className="grid gap-2">
                                          <Label
                                            htmlFor={`group-${group.id}-question-${question.id}-title`}
                                          >
                                            Question Title
                                          </Label>
                                          <Input
                                            id={`group-${group.id}-question-${question.id}-title`}
                                            placeholder="Enter question title"
                                            value={question.title}
                                            onChange={e =>
                                              updateQuestionInGroup(
                                                group.id,
                                                question.id,
                                                'title',
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>

                                        {/* Multiple choice options */}
                                        <div className="grid gap-2">
                                          <div className="flex justify-between items-center">
                                            <Label>Answer Options</Label>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() =>
                                                addOptionToQuestionInGroup(
                                                  group.id,
                                                  question.id
                                                )
                                              }
                                            >
                                              Add Option
                                            </Button>
                                          </div>

                                          {question.options &&
                                          question.options.length > 0 ? (
                                            <div className="space-y-2">
                                              {question.options?.map(
                                                (option, optionIndex) => (
                                                  <div
                                                    key={option.id}
                                                    className="flex items-center gap-2 border rounded-md p-2"
                                                  >
                                                    <div className="flex items-center space-x-2">
                                                      <Checkbox
                                                        id={`group-${group.id}-question-${question.id}-option-${option.id}-correct`}
                                                        checked={
                                                          option.isCorrect
                                                        }
                                                        onCheckedChange={checked =>
                                                          updateOptionInQuestionInGroup(
                                                            group.id,
                                                            question.id,
                                                            optionIndex,
                                                            'isCorrect',
                                                            Boolean(checked)
                                                          )
                                                        }
                                                      />
                                                      <Label
                                                        htmlFor={`group-${group.id}-question-${question.id}-option-${option.id}-correct`}
                                                        className="text-sm font-normal"
                                                      >
                                                        Correct
                                                      </Label>
                                                    </div>
                                                    <Input
                                                      placeholder={`Option ${
                                                        optionIndex + 1
                                                      }`}
                                                      value={option.text}
                                                      onChange={e =>
                                                        updateOptionInQuestionInGroup(
                                                          group.id,
                                                          question.id,
                                                          optionIndex,
                                                          'text',
                                                          e.target.value
                                                        )
                                                      }
                                                      className="flex-1"
                                                    />
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      className="text-red-500 h-8 w-8 p-0"
                                                      onClick={() =>
                                                        removeOptionFromQuestionInGroup(
                                                          group.id,
                                                          question.id,
                                                          optionIndex
                                                        )
                                                      }
                                                    >
                                                      <X className="h-4 w-4" />
                                                    </Button>
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          ) : (
                                            <p className="text-sm text-muted-foreground">
                                              No options added
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}

                              {group.questions.length === 0 && (
                                <div className="text-center p-4 border rounded-md bg-muted/30">
                                  <p className="text-muted-foreground mb-2">
                                    No questions added yet for this{' '}
                                    {newExercise.type === 'conversations'
                                      ? 'conversation'
                                      : 'talk'}
                                    .
                                  </p>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      addMultipleQuestionsToGroup(group.id)
                                    }
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Standard Questions
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))
              ) : (
                <div className="text-center p-8 border rounded-md bg-muted/30">
                  <p className="text-muted-foreground mb-3">
                    No{' '}
                    {newExercise.type === 'conversations'
                      ? 'conversations'
                      : 'talks'}{' '}
                    added yet.
                  </p>
                  <Button variant="outline" onClick={addQuestionGroup}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First{' '}
                    {newExercise.type === 'conversations'
                      ? 'Conversation'
                      : 'Talk'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      }
    }

    // READING SECTION
    if (newExercise.section === 'reading') {
      // PART 5: Incomplete Sentences
      if (newExercise.type === 'incomplete_sentences') {
        return (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Part 5 consists of individual incomplete sentences. Add your
              questions in the Questions section below.
            </p>
            <div className="p-4 border rounded-md bg-muted/20">
              <h4 className="font-medium mb-2">Example Question</h4>
              <p className="mb-3">
                The marketing department _____ a new advertising campaign next
                month.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 border rounded">(A) launch</div>
                <div className="p-2 border rounded">(B) launches</div>
                <div className="p-2 border rounded">(C) will launch</div>
                <div className="p-2 border rounded">(D) launching</div>
              </div>
            </div>
          </div>
        );
      }

      // PART 6: Text Completion
      if (newExercise.type === 'text_completion') {
        return (
          <div className="space-y-4">
            <div className="border rounded-md p-4 space-y-3 bg-card">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-medium">
                    Text Passage with Blanks
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Use [1], [2], [3], etc. to indicate where blanks should
                    appear
                  </p>
                </div>
              </div>

              <Textarea
                id="text-completion-passage"
                placeholder="Enter the passage with blanks indicated by [1], [2], [3], etc."
                rows={8}
                value={newExercise.passage || ''}
                onChange={e =>
                  setNewExercise({
                    ...newExercise,
                    passage: e.target.value,
                  })
                }
                className="font-mono text-sm"
              />

              <div className="p-3 border rounded-md bg-muted/20 mt-2">
                <h4 className="font-medium text-sm mb-2">Example Text</h4>
                <p className="text-sm">
                  The company has announced that it will{' '}
                  <span className="px-1.5 py-0.5 bg-primary/20 rounded-md font-medium">
                    [1]
                  </span>{' '}
                  its operations in Asia next year. This expansion is part of a
                  broader strategy to
                  <span className="px-1.5 py-0.5 bg-primary/20 rounded-md font-medium">
                    [2]
                  </span>{' '}
                  international market share.
                </p>
              </div>
            </div>

            {/* Questions for blanks */}
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-medium">
                    Questions for Blanks
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Create a question for each blank in your text
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Automatically detect blanks and create questions
                      const text = newExercise.passage || '';
                      const blankMatches = text.match(/\[\d+\]/g) || [];

                      if (blankMatches.length === 0) {
                        showError(
                          'Please add blanks marked as [1], [2], etc. in your text first'
                        );
                        return;
                      }

                      // Create questions for blanks that don't already have questions
                      const existingQuestionNumbers = newExercise.questions.map(
                        q =>
                          parseInt(
                            (q.title.match(/Blank \[(\d+)\]/) || [])[1] || '0'
                          )
                      );

                      blankMatches.forEach(match => {
                        const blankNumber = parseInt(
                          match.replace(/\[|\]/g, '')
                        );

                        if (!existingQuestionNumbers.includes(blankNumber)) {
                          const newQuestion: Question = {
                            id: generateId(),
                            title: `Blank [${blankNumber}]`,
                            type: 'multiple_choice',
                            points: 1,
                            options: [
                              {
                                id: generateId(),
                                text: 'Option A',
                                isCorrect: false,
                              },
                              {
                                id: generateId(),
                                text: 'Option B',
                                isCorrect: false,
                              },
                              {
                                id: generateId(),
                                text: 'Option C',
                                isCorrect: false,
                              },
                              {
                                id: generateId(),
                                text: 'Option D',
                                isCorrect: false,
                              },
                            ],
                          };

                          setNewExercise({
                            ...newExercise,
                            questions: [...newExercise.questions, newQuestion],
                          });
                        }
                      });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Auto-Add Questions
                  </Button>
                  <Button variant="outline" size="sm" onClick={addNewQuestion}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Question
                  </Button>
                </div>
              </div>

              {/* Questions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {newExercise.questions.length > 0 ? (
                  newExercise.questions.map((question, index) => (
                    <Card
                      key={question.id}
                      className={
                        expandedQuestion === question.id ? 'border-primary' : ''
                      }
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3">
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/20 text-sm font-medium">
                              {index + 1}
                            </span>
                            <div>
                              <h4 className="text-sm font-medium">
                                {question.title || `Question ${index + 1}`}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {question.options?.length || 0} options
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => expandQuestion(question.id)}
                            >
                              {expandedQuestion === question.id
                                ? 'Collapse'
                                : 'Edit'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500"
                              onClick={() => removeQuestion(question.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      {expandedQuestion === question.id && (
                        <CardContent>
                          <div className="grid gap-3">
                            <div className="grid gap-2">
                              <Label htmlFor={`question-${question.id}-title`}>
                                Title (Blank Reference)
                              </Label>
                              <Input
                                id={`question-${question.id}-title`}
                                placeholder="e.g., Blank [1]"
                                value={question.title}
                                onChange={e =>
                                  updateQuestion(
                                    question.id,
                                    'title',
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            {/* Multiple choice options */}
                            <div className="grid gap-2">
                              <div className="flex justify-between items-center">
                                <Label>Answer Options</Label>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addOption(question.id)}
                                >
                                  Add Option
                                </Button>
                              </div>

                              {question.options &&
                              question.options.length > 0 ? (
                                <div className="space-y-2">
                                  {question.options.map(
                                    (option, optionIndex) => (
                                      <div
                                        key={option.id}
                                        className="flex items-center gap-2 border rounded-md p-2"
                                      >
                                        <div className="flex items-center space-x-2">
                                          <Checkbox
                                            id={`option-${option.id}-correct`}
                                            checked={option.isCorrect}
                                            onCheckedChange={checked =>
                                              updateOption(
                                                question.id,
                                                optionIndex,
                                                'isCorrect',
                                                Boolean(checked)
                                              )
                                            }
                                          />
                                          <Label
                                            htmlFor={`option-${option.id}-correct`}
                                            className="text-sm font-normal"
                                          >
                                            Correct
                                          </Label>
                                        </div>
                                        <Input
                                          placeholder={`Option ${
                                            optionIndex + 1
                                          }`}
                                          value={option.text}
                                          onChange={e =>
                                            updateOption(
                                              question.id,
                                              optionIndex,
                                              'text',
                                              e.target.value
                                            )
                                          }
                                          className="flex-1"
                                        />
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="text-red-500 h-8 w-8 p-0"
                                          onClick={() =>
                                            removeOption(
                                              question.id,
                                              optionIndex
                                            )
                                          }
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    )
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  No options added yet
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center p-6 border rounded-md bg-muted/30">
                    <p className="text-muted-foreground mb-2">
                      No questions added for blanks yet.
                    </p>
                    <Button variant="outline" onClick={addNewQuestion}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Question
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }

      // PART 7: Reading Comprehension (Single and Multiple Passages)
      if (
        ['reading_comprehension', 'multiple_passages'].includes(
          newExercise.type
        )
      ) {
        return (
          <div className="space-y-4">
            {/* Reading Passages */}
            <div className="border rounded-md p-4 space-y-3 bg-card">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-medium">Reading Passage</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {newExercise.type === 'multiple_passages'
                      ? 'Main passage for reading comprehension'
                      : 'Text for reading comprehension'}
                  </p>
                </div>
              </div>

              <Textarea
                id="reading-passage"
                placeholder="Enter the main reading passage text here"
                rows={8}
                value={newExercise.passage || ''}
                onChange={e =>
                  setNewExercise({
                    ...newExercise,
                    passage: e.target.value,
                  })
                }
                className="font-serif text-sm leading-relaxed"
              />

              {newExercise.type === 'multiple_passages' && (
                <div className="space-y-3 mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Additional Passages</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addAdditionalPassage}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Passage
                    </Button>
                  </div>

                  {(newExercise.additionalPassages || []).map(
                    (passage, index) => (
                      <div
                        key={index}
                        className="border rounded-md p-3 space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-medium">
                            Passage {index + 2}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 h-8 w-8 p-0"
                            onClick={() => removeAdditionalPassage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <Textarea
                          placeholder={`Enter text for passage ${index + 2}`}
                          rows={5}
                          value={passage}
                          onChange={e =>
                            updateAdditionalPassage(index, e.target.value)
                          }
                          className="font-serif text-sm leading-relaxed"
                        />
                      </div>
                    )
                  )}

                  {(newExercise.additionalPassages || []).length === 0 && (
                    <div className="text-center p-3 border rounded-md bg-muted/20">
                      <p className="text-sm text-muted-foreground">
                        Multiple passages format requires at least one
                        additional passage
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Reading Questions */}
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-medium">
                    Comprehension Questions
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Add questions based on the reading passage
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Add batch of standard reading questions
                      for (let i = 0; i < 3; i++) {
                        const newQuestion: Question = {
                          id: generateId(),
                          title: `Question ${
                            newExercise.questions.length + i + 1
                          }`,
                          type: 'multiple_choice',
                          points: 1,
                          options: [
                            {
                              id: generateId(),
                              text: 'Option A',
                              isCorrect: false,
                            },
                            {
                              id: generateId(),
                              text: 'Option B',
                              isCorrect: false,
                            },
                            {
                              id: generateId(),
                              text: 'Option C',
                              isCorrect: false,
                            },
                            {
                              id: generateId(),
                              text: 'Option D',
                              isCorrect: false,
                            },
                          ],
                        };

                        setNewExercise({
                          ...newExercise,
                          questions: [...newExercise.questions, newQuestion],
                        });
                      }
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add 3 Questions
                  </Button>
                  <Button variant="outline" size="sm" onClick={addNewQuestion}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Question
                  </Button>
                </div>
              </div>

              {/* Questions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {newExercise.questions.length > 0 ? (
                  newExercise.questions.map((question, index) => (
                    <Card
                      key={question.id}
                      className={
                        expandedQuestion === question.id ? 'border-primary' : ''
                      }
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3">
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-muted text-sm font-medium">
                              {index + 1}
                            </span>
                            <div>
                              <h4 className="text-sm font-medium">
                                {question.title || `Question ${index + 1}`}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {question.options?.length || 0} options
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => expandQuestion(question.id)}
                            >
                              {expandedQuestion === question.id
                                ? 'Collapse'
                                : 'Edit'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500"
                              onClick={() => removeQuestion(question.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      {expandedQuestion === question.id && (
                        <CardContent>
                          <div className="grid gap-3">
                            <div className="grid gap-2">
                              <Label htmlFor={`question-${question.id}-title`}>
                                Question Title
                              </Label>
                              <Input
                                id={`question-${question.id}-title`}
                                placeholder="Enter question text"
                                value={question.title}
                                onChange={e =>
                                  updateQuestion(
                                    question.id,
                                    'title',
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            {/* Multiple choice options */}
                            <div className="grid gap-2">
                              <div className="flex justify-between items-center">
                                <Label>Answer Options</Label>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addOption(question.id)}
                                >
                                  Add Option
                                </Button>
                              </div>

                              {question.options &&
                              question.options.length > 0 ? (
                                <div className="space-y-2">
                                  {question.options.map(
                                    (option, optionIndex) => (
                                      <div
                                        key={option.id}
                                        className="flex items-center gap-2 border rounded-md p-2"
                                      >
                                        <div className="flex items-center space-x-2">
                                          <Checkbox
                                            id={`option-${option.id}-correct`}
                                            checked={option.isCorrect}
                                            onCheckedChange={checked =>
                                              updateOption(
                                                question.id,
                                                optionIndex,
                                                'isCorrect',
                                                Boolean(checked)
                                              )
                                            }
                                          />
                                          <Label
                                            htmlFor={`option-${option.id}-correct`}
                                            className="text-sm font-normal"
                                          >
                                            Correct
                                          </Label>
                                        </div>
                                        <Input
                                          placeholder={`Option ${
                                            optionIndex + 1
                                          }`}
                                          value={option.text}
                                          onChange={e =>
                                            updateOption(
                                              question.id,
                                              optionIndex,
                                              'text',
                                              e.target.value
                                            )
                                          }
                                          className="flex-1"
                                        />
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="text-red-500 h-8 w-8 p-0"
                                          onClick={() =>
                                            removeOption(
                                              question.id,
                                              optionIndex
                                            )
                                          }
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    )
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  No options added yet
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center p-6 border rounded-md bg-muted/30">
                    <p className="text-muted-foreground mb-2">
                      No comprehension questions added yet.
                    </p>
                    <Button variant="outline" onClick={addNewQuestion}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Question
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }
    }

    return null;
  };

  // Đánh số lại các câu hỏi trong một group
  const renumberQuestionsInGroup = (groupId: string) => {
    const group = newExercise.questionGroups?.find(g => g.id === groupId);
    if (!group) return;

    const updatedQuestions = group.questions?.map((question, index) => {
      // Chỉ cập nhật title nếu title theo định dạng "Question X"
      if (/^Question \d+/.test(question.title)) {
        return {
          ...question,
          title: `Question ${index + 1}`,
        };
      }
      return question;
    });

    updateQuestionGroup(groupId, 'questions', updatedQuestions);
  };

  // Hàm thêm nhanh 3 câu hỏi cho một group
  const addMultipleQuestionsToGroup = (groupId: string, count: number = 3) => {
    const group = newExercise.questionGroups?.find(g => g.id === groupId);
    if (!group) return;

    const newQuestions: Question[] = [];

    for (let i = 1; i <= count; i++) {
      const newQuestion: Question = {
        id: generateId(),
        title: `Question ${group.questions.length + i}`,
        type: 'multiple_choice',
        options: [
          { id: generateId(), text: 'Option A', isCorrect: false },
          { id: generateId(), text: 'Option B', isCorrect: false },
          { id: generateId(), text: 'Option C', isCorrect: false },
          { id: generateId(), text: 'Option D', isCorrect: false },
        ],
        points: 1,
      };
      newQuestions.push(newQuestion);
    }

    updateQuestionGroup(groupId, 'questions', [
      ...group.questions,
      ...newQuestions,
    ]);

    // Mở editor cho câu hỏi đầu tiên vừa thêm
    if (newQuestions.length > 0) {
      setExpandedQuestion(newQuestions[0].id);
    }
  };
  // Cập nhật handleAddExercise
  // Cập nhật hàm handleAddExercise để xử lý QuestionGroups

  const handleAddExercise = () => {
    if (!newExercise.title) {
      showError('Exercise title is required');
      return;
    }

    if (!newExercise.section || !newExercise.type) {
      showError('Please select a section and exercise type');
      return;
    }

    // LISTENING SECTION
    if (newExercise.section === 'listening') {
      // Part 1: Kiểm tra photos
      if (newExercise.type === 'photographs') {
        if (
          !newExercise.questionGroups ||
          newExercise.questionGroups.length === 0
        ) {
          showError('You need to add at least one photo');
          return;
        }

        // Kiểm tra từng photo
        for (const group of newExercise.questionGroups) {
          if (!group.imageUrl) {
            showError('Each photo must have an image');
            return;
          }
          if (!group.questions || group.questions.length === 0) {
            showError('Each photo must have at least one question');
            return;
          }
        }
      }

      // Part 2: Kiểm tra audio question-response
      if (newExercise.type === 'question_response') {
        if (!newExercise.audioUrl) {
          showError('Audio file is required for Part 2');
          return;
        }
        if (!newExercise.questions || newExercise.questions.length === 0) {
          showError('At least one question is required');
          return;
        }
      }

      // Part 3/4: Kiểm tra conversations hoặc short talks
      if (
        newExercise.type === 'conversations' ||
        newExercise.type === 'short_talks'
      ) {
        if (
          !newExercise.questionGroups ||
          newExercise.questionGroups.length === 0
        ) {
          showError(
            `At least one ${
              newExercise.type === 'conversations' ? 'conversation' : 'talk'
            } is required`
          );
          return;
        }

        // Kiểm tra từng conversation/talk
        for (const group of newExercise.questionGroups) {
          if (!group.audioUrl) {
            showError(
              `Audio is required for all ${
                newExercise.type === 'conversations' ? 'conversations' : 'talks'
              }`
            );
            return;
          }
          if (!group.questions || group.questions.length === 0) {
            showError(
              `Each ${
                newExercise.type === 'conversations' ? 'conversation' : 'talk'
              } must have at least one question`
            );
            return;
          }
        }
      }
    }

    // READING SECTION
    if (newExercise.section === 'reading') {
      // Part 5: Incomplete Sentences
      if (newExercise.type === 'incomplete_sentences') {
        if (!newExercise.questions || newExercise.questions.length === 0) {
          showError('At least one sentence question is required');
          return;
        }
      }

      // Part 6: Text Completion
      if (newExercise.type === 'text_completion') {
        if (!newExercise.passage) {
          showError('Text passage is required for Part 6');
          return;
        }
        if (!newExercise.questions || newExercise.questions.length === 0) {
          showError(
            'At least one question is required for the text completion'
          );
          return;
        }
      }

      // Part 7: Reading Comprehension
      if (
        ['reading_comprehension', 'multiple_passages'].includes(
          newExercise.type
        )
      ) {
        if (!newExercise.passage) {
          showError('Main reading passage is required');
          return;
        }

        if (
          newExercise.type === 'multiple_passages' &&
          (!newExercise.additionalPassages ||
            newExercise.additionalPassages.length === 0)
        ) {
          showError(
            'Multiple passages require at least one additional passage'
          );
          return;
        }

        if (!newExercise.questions || newExercise.questions.length === 0) {
          showError('At least one question is required for the reading');
          return;
        }
      }
    }

    // Generate ID and add to exercises list
    const id = Math.max(...exercises?.map(e => Number(e.id) || 0), 0) + 1;

    setExercises([
      ...exercises,
      {
        ...newExercise,
        id,
      },
    ]);

    // Reset form
    setNewExercise({
      id: '',
      title: '',
      section: 'listening',
      type: '',
      difficulty: 'medium',
      estimatedTime: '15 minutes',
      instructions: '',
      audioUrl: '',
      passage: '',
      script: '',
      images: [],
      additionalPassages: [],
      questions: [],
      questionGroups: [], // Reset question groups
    });

    // Close dialog
    setIsAddExerciseOpen(false);

    showSuccess('TOEIC exercise created successfully');
  };

  // Các hàm xử lý bài tập
  const handleEditExercise = (id: string | number) => {
    const exercise = exercises.find(ex => ex.id === id);
    if (exercise) {
      setNewExercise({ ...exercise });
      setIsAddExerciseOpen(true);
    }
  };

  const handlePreviewExercise = (id: string | number) => {
    // Implement preview functionality
    console.log(`Preview exercise ${id}`);
  };

  const handleDuplicateExercise = (id: string | number) => {
    const exercise = exercises.find(ex => ex.id === id);
    if (exercise) {
      const duplicate = {
        ...exercise,
        id: Math.max(...exercises?.map(e => Number(e.id) || 0), 0) + 1,
        title: `${exercise.title} (Copy)`,
      };
      setExercises([...exercises, duplicate]);
      showSuccess('Exercise duplicated successfully');
    }
  };

  const handleAssignToLesson = (id: string | number) => {
    // Implement assign to lesson
    console.log(`Assign exercise ${id} to lesson`);
  };

  if (isLessonsLoading || isExercisesLoading) {
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
          <TabsTrigger value="lessons">
            <BookOpen className="h-4 w-4 mr-2" />
            Lesson Structure
          </TabsTrigger>
          <TabsTrigger value="exercises">
            <FileText className="h-4 w-4 mr-2" />
            Exercise Bank
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="space-y-4">
          <div className="grid md:grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Lesson Structure</CardTitle>
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
                      onDelete={() => handleDeleteLesson(lesson.id)}
                    />
                  ))}

                  {lessons.length === 0 && (
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
          <div className="grid md:grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Exercise Bank</CardTitle>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Exercise
                  </Button>
                  <Dialog
                    open={isAddExerciseOpen}
                    onOpenChange={open => {
                      setIsAddExerciseOpen(open);
                      if (!open) {
                        setSelectedExercise(null);
                      }
                    }}
                  >
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Create New TOEIC Exercise</DialogTitle>
                        <DialogDescription>
                          Create a comprehensive exercise following TOEIC test
                          format
                        </DialogDescription>
                      </DialogHeader>

                      {/* Exercise Basic Info */}
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="exercise-title">Exercise Title</Label>
                          <Input
                            id="exercise-title"
                            placeholder="e.g., TOEIC Reading - Incomplete Sentences Practice 1"
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
                            <Label htmlFor="exercise-section">
                              TOEIC Section
                            </Label>
                            <Select
                              value={newExercise.section}
                              onValueChange={value =>
                                setNewExercise({
                                  ...newExercise,
                                  section: value as 'listening' | 'reading',
                                  type: '',
                                })
                              }
                            >
                              <SelectTrigger id="exercise-section">
                                <SelectValue placeholder="Select section" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="listening">
                                  Listening
                                </SelectItem>
                                <SelectItem value="reading">Reading</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="exercise-type">Exercise Type</Label>
                            <Select
                              value={newExercise.type}
                              onValueChange={value =>
                                setNewExercise({ ...newExercise, type: value })
                              }
                            >
                              <SelectTrigger id="exercise-type">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                {newExercise.section === 'listening' ? (
                                  <>
                                    <SelectItem value="photographs">
                                      Part 1: Photographs
                                    </SelectItem>
                                    <SelectItem value="question_response">
                                      Part 2: Question-Response
                                    </SelectItem>
                                    <SelectItem value="conversations">
                                      Part 3: Conversations
                                    </SelectItem>
                                    <SelectItem value="short_talks">
                                      Part 4: Short Talks
                                    </SelectItem>
                                  </>
                                ) : (
                                  <>
                                    <SelectItem value="incomplete_sentences">
                                      Part 5: Incomplete Sentences
                                    </SelectItem>
                                    <SelectItem value="text_completion">
                                      Part 6: Text Completion
                                    </SelectItem>
                                    <SelectItem value="reading_comprehension">
                                      Part 7: Single Passages
                                    </SelectItem>
                                    <SelectItem value="multiple_passages">
                                      Part 7: Multiple Passages
                                    </SelectItem>
                                  </>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="exercise-difficulty">
                              Difficulty Level
                            </Label>
                            <Select
                              value={newExercise.difficulty}
                              onValueChange={value =>
                                setNewExercise({
                                  ...newExercise,
                                  difficulty: value,
                                })
                              }
                            >
                              <SelectTrigger id="exercise-difficulty">
                                <SelectValue placeholder="Select difficulty" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="easy">
                                  Easy (400-600)
                                </SelectItem>
                                <SelectItem value="medium">
                                  Medium (600-800)
                                </SelectItem>
                                <SelectItem value="hard">
                                  Hard (800-990)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="exercise-time">
                              Estimated Time
                            </Label>
                            <Input
                              id="exercise-time"
                              placeholder="e.g., 15 minutes"
                              value={newExercise.estimatedTime}
                              onChange={e =>
                                setNewExercise({
                                  ...newExercise,
                                  estimatedTime: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="exercise-instructions">
                            General Instructions
                          </Label>
                          <Textarea
                            id="exercise-instructions"
                            placeholder="Provide general instructions for this exercise"
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

                        {/* Render fields specific to the exercise type */}
                        {renderExerciseTypeSpecificFields()}
                      </div>

                      {/* Questions Section */}
                      <div className="border-t pt-4 mt-4">
                        <div className="flex items-center justify-between mb-4">
                          <Label>Questions</Label>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={addNewQuestion}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Question
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                for (let i = 0; i < 3; i++) {
                                  addNewQuestion();
                                }
                              }}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add 3 Questions
                            </Button>
                          </div>
                        </div>

                        {/* Questions List - Accordion style */}
                        <div className="space-y-4">
                          {newExercise.questions?.map((question, index) => (
                            <Card key={question.id}>
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <CardTitle className="text-base">
                                      Question {index + 1}:{' '}
                                      {question.title || 'Untitled'}
                                    </CardTitle>
                                    <p className="text-xs text-muted-foreground">
                                      {question.type} • {question.points} points
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        expandQuestion(question.id)
                                      }
                                    >
                                      {expandedQuestion === question.id
                                        ? 'Collapse'
                                        : 'Edit'}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-500"
                                      onClick={() =>
                                        removeQuestion(question.id)
                                      }
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              </CardHeader>

                              {/* Expanded Question Editor */}
                              {expandedQuestion === question.id && (
                                <CardContent>
                                  <div className="grid gap-4 py-2">
                                    <div className="grid gap-2">
                                      <Label
                                        htmlFor={`question-${question.id}-title`}
                                      >
                                        Question Title
                                      </Label>
                                      <Input
                                        id={`question-${question.id}-title`}
                                        placeholder="Enter question title"
                                        value={question.title}
                                        onChange={e =>
                                          updateQuestion(
                                            question.id,
                                            'title',
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>

                                    <div className="grid gap-2">
                                      <Label
                                        htmlFor={`question-${question.id}-type`}
                                      >
                                        Question Type
                                      </Label>
                                      <Select
                                        value={question.type}
                                        onValueChange={value =>
                                          updateQuestion(
                                            question.id,
                                            'type',
                                            value
                                          )
                                        }
                                      >
                                        <SelectTrigger
                                          id={`question-${question.id}-type`}
                                        >
                                          <SelectValue placeholder="Select question type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="multiple_choice">
                                            Multiple Choice
                                          </SelectItem>
                                          <SelectItem value="fill_blank">
                                            Fill in the Blank
                                          </SelectItem>
                                          <SelectItem value="matching">
                                            Matching
                                          </SelectItem>
                                          <SelectItem value="true_false">
                                            True/False
                                          </SelectItem>
                                          <SelectItem value="short_answer">
                                            Short Answer
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="grid gap-2">
                                      <Label
                                        htmlFor={`question-${question.id}-instructions`}
                                      >
                                        Instructions
                                      </Label>
                                      <Textarea
                                        id={`question-${question.id}-instructions`}
                                        placeholder="Enter specific instructions for this question"
                                        value={question.instructions || ''}
                                        onChange={e =>
                                          updateQuestion(
                                            question.id,
                                            'instructions',
                                            e.target.value
                                          )
                                        }
                                        rows={2}
                                      />
                                    </div>

                                    <div className="grid gap-2">
                                      <Label
                                        htmlFor={`question-${question.id}-points`}
                                      >
                                        Points
                                      </Label>
                                      <Input
                                        id={`question-${question.id}-points`}
                                        type="number"
                                        placeholder="Points value"
                                        value={question.points}
                                        onChange={e =>
                                          updateQuestion(
                                            question.id,
                                            'points',
                                            parseInt(e.target.value) || 0
                                          )
                                        }
                                      />
                                    </div>

                                    {/* Media Attachments */}
                                    <div className="grid gap-2">
                                      <div className="flex justify-between items-center">
                                        <Label>Media Attachments</Label>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => addMedia(question.id)}
                                        >
                                          Add Media
                                        </Button>
                                      </div>

                                      {question.media &&
                                      question.media.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-2">
                                          {question.media?.map(
                                            (media, mediaIndex) => (
                                              <div
                                                key={mediaIndex}
                                                className="border rounded-md p-2"
                                              >
                                                <div className="flex justify-between items-center mb-2">
                                                  <Select
                                                    value={media.type}
                                                    onValueChange={value =>
                                                      updateMedia(
                                                        question.id,
                                                        mediaIndex,
                                                        'type',
                                                        value
                                                      )
                                                    }
                                                  >
                                                    <SelectTrigger className="w-28">
                                                      <SelectValue placeholder="Type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="image">
                                                        Image
                                                      </SelectItem>
                                                      <SelectItem value="audio">
                                                        Audio
                                                      </SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 h-8 w-8 p-0"
                                                    onClick={() =>
                                                      removeMedia(
                                                        question.id,
                                                        mediaIndex
                                                      )
                                                    }
                                                  >
                                                    <X className="h-4 w-4" />
                                                  </Button>
                                                </div>

                                                <div className="flex gap-2 mt-2">
                                                  <Input
                                                    placeholder="URL"
                                                    value={media.url}
                                                    onChange={e =>
                                                      updateMedia(
                                                        question.id,
                                                        mediaIndex,
                                                        'url',
                                                        e.target.value
                                                      )
                                                    }
                                                    className="flex-1"
                                                  />
                                                  <Button
                                                    variant="secondary"
                                                    className="shrink-0 h-9"
                                                  >
                                                    Upload
                                                  </Button>
                                                </div>

                                                {/* Preview Media */}
                                                {media.url && (
                                                  <div className="mt-2">
                                                    {media.type === 'image' && (
                                                      <img
                                                        src={media.url}
                                                        alt="Preview"
                                                        className="max-h-32 object-contain mx-auto"
                                                      />
                                                    )}
                                                    {media.type === 'audio' && (
                                                      <audio
                                                        controls
                                                        src={media.url}
                                                        className="w-full"
                                                      />
                                                    )}
                                                  </div>
                                                )}
                                              </div>
                                            )
                                          )}
                                        </div>
                                      ) : (
                                        <p className="text-sm text-muted-foreground">
                                          No media attachments
                                        </p>
                                      )}
                                    </div>

                                    {/* Conditional UI based on question type */}
                                    {question.type === 'multiple_choice' && (
                                      <div className="grid gap-2">
                                        <div className="flex justify-between items-center">
                                          <Label>Answer Options</Label>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              addOption(question.id)
                                            }
                                          >
                                            Add Option
                                          </Button>
                                        </div>

                                        {question.options &&
                                        question.options.length > 0 ? (
                                          <div className="space-y-2">
                                            {question.options?.map(
                                              (option, optionIndex) => (
                                                <div
                                                  key={option.id}
                                                  className="flex items-center gap-2 border rounded-md p-2"
                                                >
                                                  <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                      id={`option-${option.id}-correct`}
                                                      checked={option.isCorrect}
                                                      onCheckedChange={checked =>
                                                        updateOption(
                                                          question.id,
                                                          optionIndex,
                                                          'isCorrect',
                                                          Boolean(checked)
                                                        )
                                                      }
                                                    />
                                                    <Label
                                                      htmlFor={`option-${option.id}-correct`}
                                                      className="text-sm font-normal"
                                                    >
                                                      Correct
                                                    </Label>
                                                  </div>
                                                  <Input
                                                    placeholder={`Option ${
                                                      optionIndex + 1
                                                    }`}
                                                    value={option.text}
                                                    onChange={e =>
                                                      updateOption(
                                                        question.id,
                                                        optionIndex,
                                                        'text',
                                                        e.target.value
                                                      )
                                                    }
                                                    className="flex-1"
                                                  />
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 h-8 w-8 p-0"
                                                    onClick={() =>
                                                      removeOption(
                                                        question.id,
                                                        optionIndex
                                                      )
                                                    }
                                                  >
                                                    <X className="h-4 w-4" />
                                                  </Button>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        ) : (
                                          <p className="text-sm text-muted-foreground">
                                            No options added
                                          </p>
                                        )}
                                      </div>
                                    )}

                                    {/* Fill in the Blanks, Short Answer */}
                                    {(question.type === 'fill_blank' ||
                                      question.type === 'short_answer') && (
                                      <div className="grid gap-2">
                                        <Label
                                          htmlFor={`question-${question.id}-answer`}
                                        >
                                          Correct Answer(s)
                                        </Label>
                                        <Textarea
                                          id={`question-${question.id}-answer`}
                                          placeholder="Enter correct answer(s), separate multiple answers with commas"
                                          value={
                                            Array.isArray(
                                              question.correctAnswer
                                            )
                                              ? question.correctAnswer.join(
                                                  ', '
                                                )
                                              : question.correctAnswer || ''
                                          }
                                          onChange={e => {
                                            const value = e.target.value;
                                            updateQuestion(
                                              question.id,
                                              'correctAnswer',
                                              question.type === 'fill_blank'
                                                ? value
                                                    .split(',')
                                                    .map(v => v.trim())
                                                : value
                                            );
                                          }}
                                          rows={2}
                                        />
                                      </div>
                                    )}

                                    {/* True/False specific */}
                                    {question.type === 'true_false' && (
                                      <div className="grid gap-2">
                                        <Label>Correct Answer</Label>
                                        <RadioGroup
                                          value={
                                            (question.correctAnswer as string) ||
                                            'true'
                                          }
                                          onValueChange={value =>
                                            updateQuestion(
                                              question.id,
                                              'correctAnswer',
                                              value
                                            )
                                          }
                                        >
                                          <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                              value="true"
                                              id={`true-${question.id}`}
                                            />
                                            <Label
                                              htmlFor={`true-${question.id}`}
                                            >
                                              True
                                            </Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                              value="false"
                                              id={`false-${question.id}`}
                                            />
                                            <Label
                                              htmlFor={`false-${question.id}`}
                                            >
                                              False
                                            </Label>
                                          </div>
                                        </RadioGroup>
                                      </div>
                                    )}

                                    {/* Matching Questions */}
                                    {question.type === 'matching' && (
                                      <div className="grid gap-2">
                                        <Label>Matching Pairs</Label>
                                        <div className="border rounded-md p-3">
                                          <p className="text-sm text-muted-foreground mb-2">
                                            For matching questions, add options
                                            with format "Left|Right" to create
                                            matching pairs
                                          </p>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              addOption(
                                                question.id,
                                                'Left|Right'
                                              )
                                            }
                                            className="mb-2"
                                          >
                                            Add Matching Pair
                                          </Button>

                                          {question.options &&
                                          question.options.length > 0 ? (
                                            <div className="space-y-2">
                                              {question.options?.map(
                                                (option, optionIndex) => {
                                                  const [left, right] =
                                                    option.text.split('|');
                                                  return (
                                                    <div
                                                      key={option.id}
                                                      className="flex items-center gap-2 border rounded-md p-2"
                                                    >
                                                      <Input
                                                        placeholder="Left item"
                                                        value={left || ''}
                                                        onChange={e => {
                                                          const newLeft =
                                                            e.target.value;
                                                          updateOption(
                                                            question.id,
                                                            optionIndex,
                                                            'text',
                                                            `${newLeft}|${
                                                              right || ''
                                                            }`
                                                          );
                                                        }}
                                                        className="flex-1"
                                                      />
                                                      <span className="text-muted-foreground">
                                                        |
                                                      </span>
                                                      <Input
                                                        placeholder="Right item"
                                                        value={right || ''}
                                                        onChange={e => {
                                                          const newRight =
                                                            e.target.value;
                                                          updateOption(
                                                            question.id,
                                                            optionIndex,
                                                            'text',
                                                            `${
                                                              left || ''
                                                            }|${newRight}`
                                                          );
                                                        }}
                                                        className="flex-1"
                                                      />
                                                      <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-500 h-8 w-8 p-0"
                                                        onClick={() =>
                                                          removeOption(
                                                            question.id,
                                                            optionIndex
                                                          )
                                                        }
                                                      >
                                                        <X className="h-4 w-4" />
                                                      </Button>
                                                    </div>
                                                  );
                                                }
                                              )}
                                            </div>
                                          ) : (
                                            <p className="text-sm text-muted-foreground">
                                              No matching pairs added
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              )}
                            </Card>
                          ))}

                          {(!newExercise.questions ||
                            newExercise.questions.length === 0) && (
                            <div className="text-center p-8 border rounded-md bg-muted/30">
                              <p className="text-muted-foreground">
                                No questions added yet. Click "Add Question" to
                                begin.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <DialogFooter className="mt-6">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsAddExerciseOpen(false);
                            setSelectedExercise(null);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleAddExercise}>
                          Create Exercise
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {exercises.map((exercise, idx) => (
                    <ExerciseItem
                      key={exercise.id}
                      exercise={exercise}
                      isSelected={selectedExercise?.id === exercise.id}
                      order={idx + 1}
                      onSelect={() => handleSelectExercise(exercise.id)}
                      onDelete={() => handleDeleteExercise(exercise.id)}
                    />
                  ))}

                  {lessons.length === 0 && (
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
      </Tabs>
    </div>
  );
}
