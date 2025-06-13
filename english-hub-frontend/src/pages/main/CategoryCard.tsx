import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  slug: string;
}

export default function CategoryCard({
  title,
  description,
  icon: Icon,
  color,
  slug,
}: CategoryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
      <div
        className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link to={`/${slug}`}>
        <Button
          variant="outline"
          className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          Explore {title}
        </Button>
      </Link>
    </div>
  );
}
