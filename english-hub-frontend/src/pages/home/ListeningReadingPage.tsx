import { Link } from 'react-router-dom';

export default function ListeningReadingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
          Luyện thi TOEIC® Listening và Reading
        </h1>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-gray-800">
          Luyện Nghe
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/practice/listening/part-1"
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-L3astkXzD1FKO61hAYia2G9kM7A30i.png"
                alt="Phần 1: Mô tả tranh"
                width={400}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">Phần 1</h3>
              <h4 className="font-bold text-xl mb-3 text-blue-600">
                Mô tả tranh
              </h4>
              <p className="text-sm text-gray-600">
                Thí sinh sẽ nghe 1 lần duy nhất 4 câu mô tả về một bức tranh.
                Sau đó chọn 1 đáp án mô tả đúng nhất bức tranh đó.
              </p>
            </div>
          </Link>

          <Link
            to="/practice/listening/part-2"
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src="/placeholder.svg?height=300&width=400"
                alt="Phần 2: Hỏi - Đáp"
                width={400}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">Phần 2</h3>
              <h4 className="font-bold text-xl mb-3 text-blue-600">
                Hỏi - Đáp
              </h4>
              <p className="text-sm text-gray-600">
                Thí sinh sẽ nghe 1 lần duy nhất 3 câu hỏi đáp cho 1 câu hỏi hoặc
                1 câu nói. Sau đó chọn câu hỏi đáp phù hợp nhất.
              </p>
            </div>
          </Link>

          <Link
            to="/practice/listening/part-3"
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src="/placeholder.svg?height=300&width=400"
                alt="Phần 3: Đoạn hội thoại"
                width={400}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">Phần 3</h3>
              <h4 className="font-bold text-xl mb-3 text-blue-600">
                Đoạn hội thoại
              </h4>
              <p className="text-sm text-gray-600">
                Thí sinh sẽ nghe 1 lần duy nhất các đoạn hội thoại giữa 2 hoặc 3
                người. Mỗi đoạn hội thoại sẽ có 3 câu hỏi, mỗi câu hỏi có 4 lựa
                chọn.
              </p>
            </div>
          </Link>

          <Link
            to="/practice/listening/part-4"
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src="/placeholder.svg?height=300&width=400"
                alt="Phần 4: Bài nói ngắn"
                width={400}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">Phần 4</h3>
              <h4 className="font-bold text-xl mb-3 text-blue-600">
                Bài nói ngắn
              </h4>
              <p className="text-sm text-gray-600">
                Thí sinh sẽ nghe 1 lần duy nhất các bài nói ngắn. Mỗi bài sẽ có
                3 câu hỏi, mỗi câu hỏi có 4 lựa chọn. Thí sinh đọc câu hỏi sau
                đó chọn câu trả lời phù hợp nhất.
              </p>
            </div>
          </Link>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-gray-800">
          Luyện Đọc
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/practice/reading/part-5"
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src="/placeholder.svg?height=300&width=400"
                alt="Phần 5: Hoàn thành câu"
                width={400}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">Phần 5</h3>
              <h4 className="font-bold text-xl mb-3 text-blue-600">
                Hoàn thành câu
              </h4>
              <p className="text-sm text-gray-600">
                Chọn đáp án đúng nhất trong 4 đáp án để hoàn thành câu.
              </p>
            </div>
          </Link>

          <Link
            to="/practice/reading/part-6"
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src="/placeholder.svg?height=300&width=400"
                alt="Phần 6: Hoàn thành đoạn văn"
                width={400}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">Phần 6</h3>
              <h4 className="font-bold text-xl mb-3 text-blue-600">
                Hoàn thành đoạn văn
              </h4>
              <p className="text-sm text-gray-600">
                Chọn đáp án đúng nhất trong 4 đáp án (từ, cụm từ hoặc câu) để
                hoàn thành đoạn văn.
              </p>
            </div>
          </Link>

          <Link
            to="/practice/reading/part-7"
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src="/placeholder.svg?height=300&width=400"
                alt="Phần 7: Đọc hiểu"
                width={400}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">Phần 7</h3>
              <h4 className="font-bold text-xl mb-3 text-blue-600">Đọc hiểu</h4>
              <p className="text-sm text-gray-600">
                Thí sinh sẽ đọc các bài đọc hiểu sau đó chọn đáp án đúng nhất
                cho các câu hỏi.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
