import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Save,
  Trash,
  Plus,
  Mic,
  Image,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';


type AddQuestionDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export default function AddQuestionDialog({
  isOpen,
  onOpenChange,
}: AddQuestionDialogProps) {
  const [selectedPart, setSelectedPart] = useState('part1');
  const [selectedQuestions, setSelectedQuestions] = useState([1, 2, 3]);

  // Mock questions for demonstration
  const availableQuestions = [
    { id: 1, title: 'Office Building', type: 'Photograph', selected: true },
    { id: 2, title: 'People in Meeting', type: 'Photograph', selected: true },
    { id: 3, title: 'Airport Terminal', type: 'Photograph', selected: true },
    { id: 4, title: 'Restaurant Scene', type: 'Photograph', selected: false },
    { id: 5, title: 'City Street', type: 'Photograph', selected: false },
    { id: 6, title: 'Train Station', type: 'Photograph', selected: false },
    { id: 7, title: 'Office Desk', type: 'Photograph', selected: false },
    { id: 8, title: 'Conference Room', type: 'Photograph', selected: false },
  ];

  const toggleQuestionSelection = id => {
    if (selectedQuestions.includes(id)) {
      setSelectedQuestions(selectedQuestions.filter(qId => qId !== id));
    } else {
      setSelectedQuestions([...selectedQuestions, id]);
    }
  };

  const moveQuestion = (id, direction) => {
    const currentIndex = selectedQuestions.indexOf(id);
    if (currentIndex === -1) return;

    const newQuestions = [...selectedQuestions];

    if (direction === 'up' && currentIndex > 0) {
      // Swap with previous item
      [newQuestions[currentIndex], newQuestions[currentIndex - 1]] = [
        newQuestions[currentIndex - 1],
        newQuestions[currentIndex],
      ];
    } else if (
      direction === 'down' &&
      currentIndex < selectedQuestions.length - 1
    ) {
      // Swap with next item
      [newQuestions[currentIndex], newQuestions[currentIndex + 1]] = [
        newQuestions[currentIndex + 1],
        newQuestions[currentIndex],
      ];
    }

    setSelectedQuestions(newQuestions);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </DialogTrigger>
      
      {/* Dialog được thiết kế lại để sử dụng không gian hiệu quả hơn */}
      <DialogContent className="min-w-[90vw] w-[1200px] max-h-[90vh] p-0 gap-0 overflow-auto">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl">Add New Question</DialogTitle>
          <DialogDescription>
            Create a new TOEIC question for your exercise
          </DialogDescription>
        </DialogHeader>
        
        {/* Main content area with scrolling */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left sidebar - Common question metadata */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Basic Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Question Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter a descriptive title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="part">TOEIC Part</Label>
                    <Select
                      defaultValue="part1"
                      onValueChange={value => setSelectedPart(value)}
                    >
                      <SelectTrigger id="part">
                        <SelectValue placeholder="Select part" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="part1">
                          Part 1: Photographs
                        </SelectItem>
                        <SelectItem value="part2">
                          Part 2: Question-Response
                        </SelectItem>
                        <SelectItem value="part3">
                          Part 3: Conversations
                        </SelectItem>
                        <SelectItem value="part4">Part 4: Talks</SelectItem>
                        <SelectItem value="part5">
                          Part 5: Incomplete Sentences
                        </SelectItem>
                        <SelectItem value="part6">
                          Part 6: Text Completion
                        </SelectItem>
                        <SelectItem value="part7">
                          Part 7: Reading Comprehension
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger id="difficulty">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (optional)</Label>
                    <Input
                      id="tags"
                      placeholder="business, office, travel, etc."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="points">Points</Label>
                    <Input
                      id="points"
                      type="number"
                      defaultValue="1"
                      min="1"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right main content - Part-specific form fields */}
            <div className="lg:col-span-3">
              <Tabs value={selectedPart} onValueChange={setSelectedPart}>
                <TabsList className="grid grid-cols-7">
                  <TabsTrigger value="part1">Part 1</TabsTrigger>
                  <TabsTrigger value="part2">Part 2</TabsTrigger>
                  <TabsTrigger value="part3">Part 3</TabsTrigger>
                  <TabsTrigger value="part4">Part 4</TabsTrigger>
                  <TabsTrigger value="part5">Part 5</TabsTrigger>
                  <TabsTrigger value="part6">Part 6</TabsTrigger>
                  <TabsTrigger value="part7">Part 7</TabsTrigger>
                </TabsList>
                
                {/* Part 1: Photographs */}
                <TabsContent value="part1" className="pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Part 1: Photographs</CardTitle>
                      <CardDescription>
                        Upload a photograph, audio file, and create four answer options
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Photograph</Label>
                          <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 text-center aspect-video">
                            <Image className="h-8 w-8 text-gray-400" />
                            <div className="text-sm text-gray-500">
                              Drag and drop an image, or click to browse
                            </div>
                            <Button variant="outline" size="sm">
                              Upload Image
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Audio File</Label>
                          <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 text-center aspect-video">
                            <Mic className="h-8 w-8 text-gray-400" />
                            <div className="text-sm text-gray-500">
                              Drag and drop an audio file, or click to browse
                            </div>
                            <Button variant="outline" size="sm">
                              Upload Audio
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <div className="space-y-2">
                          <Label htmlFor="p1-transcript">Audio Transcript</Label>
                          <Textarea
                            id="p1-transcript"
                            placeholder="Enter the transcript of what is said in the audio"
                            rows={3}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Label>Answer Options</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                          {[1, 2, 3, 4].map(num => (
                            <div
                              key={num}
                              className={`border rounded-md p-4 ${
                                num === 1 ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10' : ''
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <RadioGroup defaultValue="option1" className="flex">
                                  <RadioGroupItem
                                    value={`option${num}`}
                                    id={`option${num}`}
                                    checked={num === 1}
                                  />
                                </RadioGroup>
                                <Label htmlFor={`option${num}`} className="flex items-center gap-2 font-medium">
                                  Option {String.fromCharCode(64 + num)}
                                  {num === 1 && (
                                    <span className="text-xs text-green-600 font-normal">
                                      (Correct)
                                    </span>
                                  )}
                                </Label>
                              </div>
                              <Input
                                id={`option${num}-text`}
                                placeholder={`Enter option ${num}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Part 2: Question-Response */}
                <TabsContent value="part2" className="pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Part 2: Question-Response</CardTitle>
                      <CardDescription>
                        Upload an audio file with a question and create three answer options
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label>Audio Question</Label>
                        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 text-center">
                          <Mic className="h-8 w-8 text-gray-400" />
                          <div className="text-sm text-gray-500">
                            Drag and drop an audio file, or click to browse
                          </div>
                          <Button variant="outline" size="sm">
                            Upload Audio
                          </Button>
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="space-y-2">
                          <Label htmlFor="transcript">Question Transcript</Label>
                          <Textarea
                            id="transcript"
                            placeholder="Enter the transcript of the audio question"
                            rows={3}
                          />
                        </div>
                      </div>

                      <div className="mt-6">
                        <Label>Answer Options</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                          {[1, 2, 3].map(num => (
                            <div
                              key={num}
                              className={`border rounded-md p-4 ${
                                num === 1 ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10' : ''
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <RadioGroup defaultValue="option1" className="flex">
                                  <RadioGroupItem
                                    value={`option${num}`}
                                    id={`p2-option${num}`}
                                    checked={num === 1}
                                  />
                                </RadioGroup>
                                <Label htmlFor={`p2-option${num}`} className="flex items-center gap-2 font-medium">
                                  Option {String.fromCharCode(64 + num)}
                                  {num === 1 && (
                                    <span className="text-xs text-green-600 font-normal">
                                      (Correct)
                                    </span>
                                  )}
                                </Label>
                              </div>
                              <Input
                                id={`p2-option${num}-text`}
                                placeholder={`Enter option ${num}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Part 3: Conversations */}
                <TabsContent value="part3" className="pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Part 3: Conversations</CardTitle>
                      <CardDescription>
                        Upload an audio conversation and create multiple questions with options
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Audio Conversation</Label>
                          <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 text-center aspect-square max-h-60">
                            <Mic className="h-8 w-8 text-gray-400" />
                            <div className="text-sm text-gray-500">
                              Drag and drop an audio file, or click to browse
                            </div>
                            <Button variant="outline" size="sm">
                              Upload Audio
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="p3-transcript">Conversation Transcript</Label>
                          <Textarea
                            id="p3-transcript"
                            placeholder="Enter the transcript of the conversation"
                            rows={10}
                            className="h-full min-h-[200px]"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <Label as="h3" className="text-base font-medium">Questions</Label>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Plus className="h-4 w-4" /> Add Question
                          </Button>
                        </div>

                        {/* Question 1 */}
                        <Card className="mb-4">
                          <CardHeader className="py-3 px-4">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">Question 1</CardTitle>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="py-3 px-4">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="p3-q1">Question Text</Label>
                                <Input id="p3-q1" placeholder="Enter the question" />
                              </div>

                              <div>
                                <Label className="mb-2 block">Answer Options</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {[1, 2, 3, 4].map(num => (
                                    <div
                                      key={num}
                                      className={`border rounded-md p-3 ${
                                        num === 1 ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10' : ''
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 mb-2">
                                        <RadioGroup defaultValue="q1-option1" className="flex">
                                          <RadioGroupItem
                                            value={`q1-option${num}`}
                                            id={`q1-option${num}`}
                                            checked={num === 1}
                                          />
                                        </RadioGroup>
                                        <Label htmlFor={`q1-option${num}`} className="flex items-center gap-2">
                                          Option {String.fromCharCode(64 + num)}
                                          {num === 1 && (
                                            <span className="text-xs text-green-600 font-normal">
                                              (Correct)
                                            </span>
                                          )}
                                        </Label>
                                      </div>
                                      <Input
                                        id={`q1-option${num}-text`}
                                        placeholder={`Enter option ${num}`}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Question 2 */}
                        <Card>
                          <CardHeader className="py-3 px-4">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">Question 2</CardTitle>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="py-3 px-4">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="p3-q2">Question Text</Label>
                                <Input id="p3-q2" placeholder="Enter the question" />
                              </div>

                              <div>
                                <Label className="mb-2 block">Answer Options</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {[1, 2, 3, 4].map(num => (
                                    <div
                                      key={num}
                                      className={`border rounded-md p-3 ${
                                        num === 1 ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10' : ''
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 mb-2">
                                        <RadioGroup defaultValue="q2-option1" className="flex">
                                          <RadioGroupItem
                                            value={`q2-option${num}`}
                                            id={`q2-option${num}`}
                                            checked={num === 1}
                                          />
                                        </RadioGroup>
                                        <Label htmlFor={`q2-option${num}`} className="flex items-center gap-2">
                                          Option {String.fromCharCode(64 + num)}
                                          {num === 1 && (
                                            <span className="text-xs text-green-600 font-normal">
                                              (Correct)
                                            </span>
                                          )}
                                        </Label>
                                      </div>
                                      <Input
                                        id={`q2-option${num}-text`}
                                        placeholder={`Enter option ${num}`}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Content for other parts would follow the same pattern */}
                <TabsContent value="part4" className="pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Part 4: Talks</CardTitle>
                      <CardDescription>
                        Upload an audio talk and create multiple questions with options
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Similar layout to Part 3 */}
                      <div className="text-muted-foreground">
                        Content for Part 4 would follow a similar structure to Part 3
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="part5" className="pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Part 5: Incomplete Sentences</CardTitle>
                      <CardDescription>
                        Create an incomplete sentence with four answer options
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="p5-sentence">Incomplete Sentence</Label>
                        <Textarea
                          id="p5-sentence"
                          placeholder="Enter the incomplete sentence (use '____' to indicate the blank)"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label>Answer Options</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                          {[1, 2, 3, 4].map(num => (
                            <div
                              key={num}
                              className={`border rounded-md p-4 ${
                                num === 1 ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10' : ''
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <RadioGroup defaultValue="option1" className="flex">
                                  <RadioGroupItem
                                    value={`option${num}`}
                                    id={`p5-option${num}`}
                                    checked={num === 1}
                                  />
                                </RadioGroup>
                                <Label htmlFor={`p5-option${num}`} className="flex items-center gap-2 font-medium">
                                  Option {String.fromCharCode(64 + num)}
                                  {num === 1 && (
                                    <span className="text-xs text-green-600 font-normal">
                                      (Correct)
                                    </span>
                                  )}
                                </Label>
                              </div>
                              <Input
                                id={`p5-option${num}-text`}
                                placeholder={`Enter option ${num}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="p5-explanation">Explanation (Optional)</Label>
                        <Textarea
                          id="p5-explanation"
                          placeholder="Explain why the correct answer is correct"
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="part6" className="pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Part 6: Text Completion</CardTitle>
                      <CardDescription>
                        Create a text passage with blanks and answer options for each blank
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Placeholder for part 6 content */}
                      <div className="text-muted-foreground">
                        Content for Part 6 would go here
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="part7" className="pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Part 7: Reading Comprehension</CardTitle>
                      <CardDescription>
                        Create a reading passage with multiple questions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Placeholder for part 7 content */}
                      <div className="text-muted-foreground">
                        Content for Part 7 would go here
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        
        {/* Footer always visible at the bottom */}
        <DialogFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="gap-1">
            <Save className="h-4 w-4" /> Save Question
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
