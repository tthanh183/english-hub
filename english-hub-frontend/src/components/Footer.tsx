import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

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
                  to="/practice/listening"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  TOEIC Listening
                </Link>
              </li>
              <li>
                <Link
                  to="/practice/reading"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  TOEIC Reading
                </Link>
              </li>
              <li>
                <Link
                  to="/practice/speaking"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  TOEIC Speaking
                </Link>
              </li>
              <li>
                <Link
                  to="/practice/writing"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  TOEIC Writing
                </Link>
              </li>
              <li>
                <Link
                  to="/mock-tests"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Mock Tests
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Learn English</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/grammar"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Grammar
                </Link>
              </li>
              <li>
                <Link
                  to="/vocabulary"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Vocabulary
                </Link>
              </li>
              <li>
                <Link
                  to="/pronunciation"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Pronunciation
                </Link>
              </li>
              <li>
                <Link
                  to="/learning-path"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Learning Path
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
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
                  to="/about"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
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
            &copy; {new Date().getFullYear()} EnglishHub. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
