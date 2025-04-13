import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

const OPTIONS_LETTERS = ['A', 'B', 'C', 'D'];

type QuestionCardProps = {
  title: string;
  setTitle: (title: string) => void;
  options: string[];
  setOptions: (options: string[]) => void;
  correctAnswerIndex: number;
  setCorrectAnswerIndex: (index: number) => void;
};

export default function QuestionCard({
  title,
  setTitle,
  options,
  setOptions,
  correctAnswerIndex,
  setCorrectAnswerIndex,
}: QuestionCardProps) {
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <Card className="mt-6">
      <CardContent>
        <div className="space-y-4">
          <Label htmlFor="q1-title">Title</Label>
          <Input
            id="q1-title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter title"
          />

          <div>
            <Label>Answer Options</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              {[0, 1, 2, 3].map(index => (
                <div
                  key={index}
                  className={`border rounded-md p-4 transition-colors ${
                    index === correctAnswerIndex
                      ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10'
                      : ''
                  }`}
                  onClick={() => setCorrectAnswerIndex(index)}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <RadioGroup
                      value={correctAnswerIndex.toString()}
                      onValueChange={value =>
                        setCorrectAnswerIndex(parseInt(value))
                      }
                      className="flex"
                    >
                      <RadioGroupItem
                        value={index.toString()}
                        id={`q1-option-${OPTIONS_LETTERS[index]}`}
                        checked={index === correctAnswerIndex}
                      />
                    </RadioGroup>
                    <Label
                      htmlFor={`q1-option-${OPTIONS_LETTERS[index]}`}
                      className="flex items-center gap-2 font-medium cursor-pointer"
                    >
                      {OPTIONS_LETTERS[index]}
                      {index === correctAnswerIndex && (
                        <span className="text-xs text-green-600 font-normal">
                          (Correct)
                        </span>
                      )}
                    </Label>
                  </div>
                  <Input
                    id={`q1-option-${OPTIONS_LETTERS[index]}-text`}
                    placeholder={`Enter option ${OPTIONS_LETTERS[index]}`}
                    value={options[index]}
                    onChange={e => handleOptionChange(index, e.target.value)}
                    onClick={e => e.stopPropagation()}
                    className={
                      index === correctAnswerIndex ? 'border-green-500' : ''
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
