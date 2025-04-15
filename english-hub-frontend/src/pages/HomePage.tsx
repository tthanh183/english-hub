import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CategoryCard } from '@/components/home/category-card';
import { PracticeCard } from '@/components/home/practice-card';
import { BookOpen, Headphones, MessageSquare, FileText } from 'lucide-react';

export default function HomePage() {
  const categories = [
    {
      title: 'Listening Practice',
      description: 'Improve your English listening skills effectively',
      icon: Headphones,
      color: 'bg-blue-100 text-blue-700',
      slug: 'listening-reading',
    },
    {
      title: 'Reading Practice',
      description: 'Enhance your English reading comprehension',
      icon: BookOpen,
      color: 'bg-indigo-100 text-indigo-700',
      slug: 'listening-reading',
    },
    {
      title: 'Vocabulary',
      description: 'Learn English vocabulary effectively',
      icon: MessageSquare,
      color: 'bg-purple-100 text-purple-700',
      slug: 'vocabulary',
    },
    {
      title: 'Grammar',
      description: 'Master English grammar',
      icon: FileText,
      color: 'bg-cyan-100 text-cyan-700',
      slug: 'grammar',
    },
  ];

  const practiceTests = [
    {
      title: 'TOEIC Full Test 1',
      description: 'Reading and Listening sections - 2 hours',
      questions: 200,
      time: 120,
      difficulty: 'Intermediate',
      category: 'TOEIC',
    },
    {
      title: 'TOEIC Full Test 2',
      description: 'Reading and Listening sections - 2 hours',
      questions: 200,
      time: 120,
      difficulty: 'Hard',
      category: 'TOEIC',
    },
    {
      title: 'TOEIC Mini Test 1',
      description: 'Quick practice with selected questions',
      questions: 50,
      time: 30,
      difficulty: 'Easy',
      category: 'TOEIC',
    },
    {
      title: 'TOEIC Listening Only',
      description: 'Focus on improving listening skills',
      questions: 100,
      time: 45,
      difficulty: 'Intermediate',
      category: 'TOEIC',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
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
              <Link to="/practice/toeic">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Start Learning for Free
                </Button>
              </Link>
              <Link to="/practice/listening-reading">
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

        {/* Categories Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
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

        {/* Practice Tests Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
                  TOEIC Practice Tests
                </h2>
                <p className="text-gray-600 mt-2">
                  Prepare for your exam with comprehensive practice tests.
                </p>
              </div>
              <Link to="/practice/all" className="mt-4 md:mt-0">
                <Button
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  View All Tests
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {practiceTests.map((test, index) => (
                <PracticeCard key={index} {...test} />
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <p className="text-blue-100">Practice Exercises</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">10,000+</div>
                <p className="text-blue-100">Active Learners</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">95%</div>
                <p className="text-blue-100">Success Rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center text-gray-800">
              What Our Learners Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">
                      {['NT', 'TH', 'LM'][i - 1]}
                    </div>
                    <div className="ml-4">
                      <div className="font-medium">
                        {['Nguyen Thao', 'Tran Huy', 'Le Minh'][i - 1]}
                      </div>
                      <div className="text-sm text-gray-500">
                        {['TOEIC 950', 'TOEIC 920', 'TOEIC 890'][i - 1]}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    {
                      [
                        'EnglishMaster helped me improve my TOEIC score by 200 points in just 2 months. The practice tests are very similar to the real exam.',
                        'The personalized learning path is exactly what I needed. I can focus on my weaknesses and track my progress easily.',
                        'The pronunciation exercises and feedback helped me become more confident in speaking English. Highly recommended!',
                      ][i - 1]
                    }
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
