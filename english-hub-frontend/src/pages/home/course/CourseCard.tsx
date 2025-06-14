import { Link } from 'react-router-dom';

interface CourseCardProps {
  courseId: string;
  title: string;
  description: string;
  imageUrl: string;
}

export default function CourseCard({
  courseId,
  title,
  description,
  imageUrl,
}: CourseCardProps) {
  return (
    <Link
      to={`/courses/${courseId}`}
      className="group bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  );
}
