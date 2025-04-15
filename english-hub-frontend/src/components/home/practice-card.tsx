import { Clock, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PracticeCardProps {
  title: string;
  description: string;
  questions: number;
  time: number;
  difficulty: string;
  category: string;
}

export function PracticeCard({
  title,
  description,
  questions,
  time,
  difficulty,
  category,
}: PracticeCardProps) {
  const difficultyColor =
    {
      Easy: 'bg-green-100 text-green-800',
      Intermediate: 'bg-amber-100 text-amber-800',
      Hard: 'bg-red-100 text-red-800',
    }[difficulty] || 'bg-gray-100 text-gray-800';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            {category}
          </Badge>
          <Badge variant="outline" className={difficultyColor}>
            {difficulty}
          </Badge>
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <div className="flex items-center mr-4">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{questions} questions</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{time} minutes</span>
          </div>
        </div>
        <Link
          to={`/practice/${category.toLowerCase()}/${title
            .toLowerCase()
            .replace(/\s+/g, '-')}`}
        >
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Start Practice
          </Button>
        </Link>
      </div>
    </div>
  );
}
