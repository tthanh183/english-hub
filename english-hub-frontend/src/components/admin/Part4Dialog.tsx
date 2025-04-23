import { QuestionResponse } from '@/types/questionType';
import { Label } from '@radix-ui/react-label';
import { Mic, Plus, Trash } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type Part2DialogProps = {
  exerciseId?: string;
  question?: QuestionResponse;
};

export default function Part4Dialog({
  exerciseId,
  question,
}: Part2DialogProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Talk Audio</Label>
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
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <Label className="text-base font-medium">Questions</Label>
          <Button variant="outline" size="sm" className="gap-1">
            <Plus className="h-4 w-4" /> Add Question
          </Button>
        </div>

        <Card className="mb-4">
          <CardHeader className="py-3 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Question 1</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="py-3 px-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="p4-q1">Question Text</Label>
                <Input id="p4-q1" placeholder="Enter the question" />
              </div>

              <div>
                <Label className="mb-2 block">Answer Options</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map(num => (
                    <div
                      key={num}
                      className={`border rounded-md p-3 ${
                        num === 1
                          ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10'
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <RadioGroup defaultValue="q1-option1" className="flex">
                          <RadioGroupItem
                            value={`p4-q1-option${num}`}
                            id={`p4-q1-option${num}`}
                            checked={num === 1}
                          />
                        </RadioGroup>
                        <Label
                          htmlFor={`p4-q1-option${num}`}
                          className="flex items-center gap-2"
                        >
                          Option {String.fromCharCode(64 + num)}
                          {num === 1 && (
                            <span className="text-xs text-green-600 font-normal">
                              (Correct)
                            </span>
                          )}
                        </Label>
                      </div>
                      <Input
                        id={`p4-q1-option${num}-text`}
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
    </div>
  );
}
