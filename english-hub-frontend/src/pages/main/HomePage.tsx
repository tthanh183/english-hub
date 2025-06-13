import { Link } from 'react-router-dom';
import {
  BookOpen,
  Headphones,
  MessageSquare,
  FileText,
  Clock,
  Users,
  Trophy,
  Star,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import CategoryCard from '@/pages/main/CategoryCard';
import { ROUTES } from '@/constants/routes';

export default function HomePage() {
  const categories = [
    {
      title: 'Listening Practice',
      description: 'Improve your English listening skills effectively',
      icon: Headphones,
      color: 'bg-blue-100 text-blue-700',
      slug: 'courses/listening-reading',
    },
    {
      title: 'Reading Practice',
      description: 'Enhance your English reading comprehension',
      icon: BookOpen,
      color: 'bg-indigo-100 text-indigo-700',
      slug: 'courses/listening-reading',
    },
    {
      title: 'Mock Exams',
      description: 'Master English grammar with interactive exercises',
      icon: FileText,
      color: 'bg-cyan-100 text-cyan-700',
      slug: 'grammar',
    },
    {
      title: 'Vocabulary',
      description: 'Learn English vocabulary effectively',
      icon: MessageSquare,
      color: 'bg-purple-100 text-purple-700',
      slug: 'decks',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-blue-50 to-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
              Improve Your English Skills
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Interactive lessons, personalized learning paths, and practical
              exercises to help you master English.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={ROUTES.HOME}>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Start Learning for Free
                </Button>
              </Link>
              <Link to={ROUTES.EXAM}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Practice TOEIC
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-2">
            <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center text-gray-800">
              Choose Your Learning Path
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {categories.map(category => (
                <CategoryCard key={category.title} {...category} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-blue-400 to-blue-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center bg-white/20 rounded-full px-4 py-2 mb-6">
                <Trophy className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">
                  TOEIC Practice Center
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Master TOEIC with Confidence
              </h2>

              <p className="text-xl mb-8 text-blue-100">
                Take comprehensive practice exams designed to mirror the real
                TOEIC exam experience
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-3xl font-bold mb-2">25+</div>
                  <p className="text-blue-100">Practice Exams</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-3xl font-bold mb-2">5,000+</div>
                  <p className="text-blue-100">Questions</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-3xl font-bold mb-2">95%</div>
                  <p className="text-blue-100">Success Rate</p>
                </div>
              </div>

              <Link to={ROUTES.EXAM}>
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  Start Practice Exam
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Why Choose Our Platform?
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Everything you need to succeed in your English learning journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Flexible Learning
                </h3>
                <p className="text-gray-600">
                  Study at your own pace with 24/7 access to all materials and
                  practice exams
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Content</h3>
                <p className="text-gray-600">
                  Created by experienced English teachers and TOEIC experts
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Proven Results</h3>
                <p className="text-gray-600">
                  Join thousands of successful learners who achieved their
                  target scores
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
