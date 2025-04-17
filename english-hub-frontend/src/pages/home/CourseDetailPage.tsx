import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight, Check } from 'lucide-react';

export default function CourseDetailPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Luyện nghe TOEIC® Part 1 online miễn phí
        </h1>
        <div className="flex items-center text-sm text-gray-500">
          <Link to="/" className="hover:text-blue-600">
            Trang chủ
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link to="/practice" className="hover:text-blue-600">
            Luyện tập
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span>Part 1: Photos</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="lessons" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="lessons">Bài học</TabsTrigger>
              <TabsTrigger value="practices">Practices</TabsTrigger>
            </TabsList>

            <TabsContent value="lessons" className="border rounded-lg p-6 mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Bài học</h2>
                <div className="text-sm text-gray-500">4/4 Lessons</div>
              </div>

              <div className="space-y-4">
                <Link
                  to="/practice/listening/part-1/lesson-1"
                  className="flex items-center p-4 border rounded-lg hover:bg-gray-50 group"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full mr-4">
                    <span>01</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">
                        Lesson 1: Predict what you will hear
                      </span>
                    </div>
                  </div>
                  <div className="text-green-500">
                    <Check className="h-5 w-5" />
                  </div>
                </Link>

                <Link
                  to="/practice/listening/part-1/lesson-2"
                  className="flex items-center p-4 border rounded-lg hover:bg-gray-50 group"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full mr-4">
                    <span>02</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">
                        Lesson 2: Listen for correct verb
                      </span>
                    </div>
                  </div>
                  <div className="text-green-500">
                    <Check className="h-5 w-5" />
                  </div>
                </Link>

                <Link
                  to="/practice/listening/part-1/lesson-3"
                  className="flex items-center p-4 border rounded-lg hover:bg-gray-50 group"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full mr-4">
                    <span>03</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">
                        Lesson 3: Listen for details
                      </span>
                    </div>
                  </div>
                  <div className="text-green-500">
                    <Check className="h-5 w-5" />
                  </div>
                </Link>

                <Link
                  to="/practice/listening/part-1/lesson-4"
                  className="flex items-center p-4 border rounded-lg hover:bg-gray-50 group"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full mr-4">
                    <span>04</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">
                        Lesson 4: Listen for prepositions and similar sounds
                      </span>
                    </div>
                  </div>
                  <div className="text-green-500">
                    <Check className="h-5 w-5" />
                  </div>
                </Link>
              </div>
            </TabsContent>

            <TabsContent
              value="practices"
              className="border rounded-lg p-6 mt-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Practices</h2>
                <div className="text-sm text-gray-500">0/22 tests</div>
              </div>

              <div className="space-y-4">
                <Link
                  to="/practice/listening/part-1/test-1"
                  className="flex items-center p-4 border rounded-lg hover:bg-gray-50 group"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full mr-4">
                    <span>01</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">Test 1</span>
                    </div>
                    <div className="text-xs text-gray-500">6 questions</div>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-red-200 text-red-500 text-xs">
                    17%
                  </div>
                </Link>

                <Link
                  to="/practice/listening/part-1/test-2"
                  className="flex items-center p-4 border rounded-lg hover:bg-gray-50 group"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full mr-4">
                    <span>02</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">Test 2</span>
                    </div>
                    <div className="text-xs text-gray-500">6 questions</div>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-500 text-xs">
                    0%
                  </div>
                </Link>

                <Link
                  to="/practice/listening/part-1/test-3"
                  className="flex items-center p-4 border rounded-lg hover:bg-gray-50 group"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full mr-4">
                    <span>03</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">Test 3</span>
                    </div>
                    <div className="text-xs text-gray-500">6 questions</div>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-red-200 text-red-500 text-xs">
                    17%
                  </div>
                </Link>

                <Link
                  to="/practice/listening/part-1/test-4"
                  className="flex items-center p-4 border rounded-lg hover:bg-gray-50 group"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full mr-4">
                    <span>04</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">Test 4</span>
                    </div>
                    <div className="text-xs text-gray-500">6 questions</div>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-500 text-xs">
                    0%
                  </div>
                </Link>

                <Link
                  to="/practice/listening/part-1/test-5"
                  className="flex items-center p-4 border rounded-lg hover:bg-gray-50 group"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full mr-4">
                    <span>05</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">Test 5</span>
                    </div>
                    <div className="text-xs text-gray-500">6 questions</div>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-500 text-xs">
                    0%
                  </div>
                </Link>

                <div className="text-center mt-6">
                  <Button
                    variant="outline"
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    Show More 17 Practice Tests
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              Các bài luyện tập khác
            </h3>
            <div className="space-y-3">
              <Link
                to="/practice/listening/part-1"
                className="block p-3 bg-blue-50 text-blue-700 rounded-md font-medium"
              >
                Phần 1: Mô tả tranh
              </Link>
              <Link
                to="/practice/listening/part-2"
                className="block p-3 hover:bg-gray-50 rounded-md"
              >
                Phần 2: Hỏi - Đáp
              </Link>
              <Link
                to="/practice/listening/part-3"
                className="block p-3 hover:bg-gray-50 rounded-md"
              >
                Phần 3: Đoạn hội thoại
              </Link>
              <Link
                to="/practice/listening/part-4"
                className="block p-3 hover:bg-gray-50 rounded-md"
              >
                Phần 4: Bài nói ngắn
              </Link>
              <Link
                to="/practice/reading/part-5"
                className="block p-3 hover:bg-gray-50 rounded-md"
              >
                Phần 5: Hoàn thành câu
              </Link>
              <Link
                to="/practice/reading/part-6"
                className="block p-3 hover:bg-gray-50 rounded-md"
              >
                Phần 6: Hoàn thành đoạn văn
              </Link>
              <Link
                to="/practice/reading/part-7"
                className="block p-3 hover:bg-gray-50 rounded-md"
              >
                Phần 7: Đoạn đơn
              </Link>
              <Link
                to="/practice/reading/part-7-double"
                className="block p-3 hover:bg-gray-50 rounded-md"
              >
                Phần 7: Đoạn kép
              </Link>
              <Link
                to="/practice/reading/part-7-triple"
                className="block p-3 hover:bg-gray-50 rounded-md"
              >
                Phần 7: Đoạn ba
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
