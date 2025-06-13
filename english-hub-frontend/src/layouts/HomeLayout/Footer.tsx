import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

import { ROUTES } from '@/constants/routes';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-400">
              EnglishHub
            </h3>
            <p className="text-gray-300 mb-4">
              Helping you achieve high scores in the TOEIC exam through
              interactive lessons and practical exercises.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">TOEIC Practice</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to={ROUTES.COURSES_LISTENING_READING}
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  TOEIC Listening
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.COURSES_LISTENING_READING}
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  TOEIC Reading
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  TOEIC Speaking
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  TOEIC Writing
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.EXAM}
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Mock Exams
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Learn English</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Grammar
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.DECK}
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Vocabulary
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Pronunciation
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Learning Path
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Information</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} EnglishHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
