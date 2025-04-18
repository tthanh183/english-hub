import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  breadcrumbData: { name: string; link?: string }[];
}

export default function Breadcrumb({ breadcrumbData }: BreadcrumbProps) {
  return (
    <div className="flex items-center text-sm text-gray-500">
      {breadcrumbData.map((item, index) => {
        const isLast = index === breadcrumbData.length - 1;

        return (
          <div key={index} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
            {isLast ? (
              <span>{item.name}</span>
            ) : (
              <Link to={item.link || '#'} className="hover:text-blue-600">
                {item.name}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
