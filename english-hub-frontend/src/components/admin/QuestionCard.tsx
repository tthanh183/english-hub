import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import {
  PART1_OPTIONS,
  PART2_OPTIONS,
  PART3_OPTIONS,
  PART4_OPTIONS,
  PART5_OPTIONS,
  PART6_OPTIONS,
  PART7_OPTIONS,
} from '@/constants/options';

type QuestionCardProps = {
  title: string;
  setTitle: (title: string) => void;
  options: string[];
  setOptions: (options: string[]) => void;
  correctAnswerIndex: number;
  setCorrectAnswerIndex: (index: number) => void;
  part: 'part1' | 'part2' | 'part3' | 'part4' | 'part5' | 'part6';
};

const PART_OPTIONS = {
  part1: PART1_OPTIONS,
  part2: PART2_OPTIONS,
  part3: PART3_OPTIONS,
  part4: PART4_OPTIONS,
  part5: PART5_OPTIONS,
  part6: PART6_OPTIONS,
  part7: PART7_OPTIONS,
};

export default function QuestionCard({
  title,
  setTitle,
  options,
  setOptions,
  correctAnswerIndex,
  setCorrectAnswerIndex,
  part,
}: QuestionCardProps) {
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const optionsList = PART_OPTIONS[part];

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
              {optionsList.map(({ letter, index }) => (
                <div
                  key={letter}
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
                        id={`option-${letter}`}
                        checked={index === correctAnswerIndex}
                      />
                    </RadioGroup>
                    <Label
                      htmlFor={`option-${letter}`}
                      className="flex items-center gap-2 font-medium cursor-pointer"
                    >
                      {letter}
                      {index === correctAnswerIndex && (
                        <span className="text-xs text-green-600 font-normal">
                          (Correct)
                        </span>
                      )}
                    </Label>
                  </div>
                  <Input
                    id={`option-${letter}-text`}
                    placeholder={`Enter option ${letter}`}
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
