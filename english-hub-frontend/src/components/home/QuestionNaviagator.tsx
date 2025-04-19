import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Flag } from 'lucide-react';

interface QuestionNavigatorProps {
  currentIndex: number;
  totalQuestions: number;
  onFlag: () => void;
  getQuestionLink: (index: number) => string;
}

export default function QuestionNavigator({
  currentIndex,
  totalQuestions,
  onFlag,
  getQuestionLink,
}: QuestionNavigatorProps) {
  return (
    <div className="flex justify-between mt-8">
      {currentIndex > 0 ? (
        <Link to={getQuestionLink(currentIndex - 1)}>
          <Button variant="outline">Previous</Button>
        </Link>
      ) : (
        <Button variant="outline" disabled>
          Previous
        </Button>
      )}

      <Button
        variant="outline"
        className="text-blue-600 border-blue-600"
        onClick={onFlag}
      >
        <Flag className="h-4 w-4 mr-2" />
        Flag for review
      </Button>

      {currentIndex < totalQuestions - 1 ? (
        <Link to={getQuestionLink(currentIndex + 1)}>
          <Button className="bg-blue-600 hover:bg-blue-700">Next</Button>
        </Link>
      ) : (
        <Button className="bg-blue-600 hover:bg-blue-700" disabled>
          Next
        </Button>
      )}
    </div>
  );
}
