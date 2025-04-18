import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function LessonPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            Lesson 1: Predict what you will hear
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-gray-500">
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button variant="outline" size="sm" className="text-gray-500">
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-2">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link to="/practice" className="hover:text-blue-600">
            Practice
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link to="/practice/listening/part-1" className="hover:text-blue-600">
            Part 1: Photos
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span>Lesson 1</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold mb-4">1. Question Type</h2>
          <p className="mb-6">
            In this part, you are asked to see a picture and choose the
            statement that most describes the picture. To be able to choose the
            correct answer, you should think of the topic of the picture and
            possible statements.
          </p>

          <h2 className="text-xl font-semibold mb-4">2. Guide to Answer</h2>
          <ul className="space-y-4 mb-6">
            <li>
              <strong>- Before the beginning of the section,</strong> think of
              the theme of the picture as well as brainstorm nouns and verbs
              related to the picture. You should do this because most
              distractors in the TOEIC Part 1 involve the wrong noun or verb.
            </li>
            <li>
              <strong>- Before listening,</strong> you should also predict
              possible statements. Most statements are about:
            </li>
            <li className="ml-6">
              <strong>+ The activity</strong>
              <p className="italic">E.g. The man is writing an email.</p>
            </li>
            <li className="ml-6">
              <strong>+ The general situation</strong>
              <p className="italic">E.g. The meal is ready.</p>
            </li>
            <li className="ml-6">
              <strong>+ Spatial relationships</strong>
              <p className="italic">E.g. next to, near, across from, etc.</p>
            </li>
            <li>
              <strong>
                - Focus while listening and choose the correct statement.
              </strong>
            </li>
          </ul>

          <div className="flex justify-center mt-8 mb-8">
            <Link to="/practice/listening/part-1/test-1">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Start Practice
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
