import { Save } from 'lucide-react';
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
import { LessonResponse } from '@/types/lessonType';
import ReactQuill from 'react-quill-new';

type UpdateLessonCardProps = {
  selectedLesson: LessonResponse;
  setSelectedLesson: (lesson: LessonResponse | null) => void;
};

export default function UpdateLessonCard({
  selectedLesson,
  setSelectedLesson,
}: UpdateLessonCardProps) {
  const handleUpdateLesson = () => {
    // Logic to update the lesson
  };
  return (
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
            <Label htmlFor="edit-lesson-content">Lesson Content</Label>
            <ReactQuill
              theme="snow"
              value={selectedLesson.content}
              onChange={content =>
                setSelectedLesson({ ...selectedLesson, content })
              }
              style={{ height: '300px' }}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => setSelectedLesson(null)}>
          Cancel
        </Button>
        <Button onClick={handleUpdateLesson}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
