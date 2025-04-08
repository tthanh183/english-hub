import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Image, Mic, X } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { useRef, useState } from 'react';

export default function Part1QuestionContent() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioName, setAudioName] = useState<string>('');
  const audioInputRef = useRef<HTMLInputElement>(null);

  const [correctAnswer, setCorrectAnswer] = useState<number>(1);
  const [options, setOptions] = useState<string[]>(['', '', '', '']);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Tạo URL xem trước cho ảnh đã chọn
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Ở đây bạn có thể thêm code để upload ảnh lên server
      console.log('File selected:', file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Xử lý upload audio
  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setAudioName(file.name);

      // Ở đây bạn có thể gọi API để upload audio lên server
      console.log('Audio file selected:', file);
    }
  };

  // Xử lý xóa audio
  const handleRemoveAudio = () => {
    setAudioFile(null);
    setAudioName('');
    if (audioInputRef.current) {
      audioInputRef.current.value = '';
    }
  };

  // Xử lý thay đổi nội dung đáp án
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Photograph</Label>
          <div
            className="border-2 border-dashed rounded-lg overflow-hidden"
            onClick={() => !imagePreview && fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-auto h-56 object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  onClick={e => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="p-6 flex flex-col items-center justify-center gap-2 text-center aspect-video">
                <Image className="h-8 w-8 text-gray-400" />
                <div className="text-sm text-gray-500">
                  Drag and drop an image, or click to browse
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={e => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Upload Image
                </Button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Audio File</Label>
          <div
            className="border-2 border-dashed rounded-lg overflow-hidden"
            onClick={() => !audioFile && audioInputRef.current?.click()}
          >
            {audioFile ? (
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 bg-primary/10 rounded-md flex items-center justify-center">
                    <Mic className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium truncate max-w-[200px]">
                      {audioName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8 w-8 rounded-full p-0"
                  onClick={e => {
                    e.stopPropagation();
                    handleRemoveAudio();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="p-6 flex flex-col items-center justify-center gap-2 text-center aspect-video">
                <Mic className="h-8 w-8 text-gray-400" />
                <div className="text-sm text-gray-500">
                  Drag and drop an audio file, or click to browse
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={e => {
                    e.stopPropagation();
                    audioInputRef.current?.click();
                  }}
                >
                  Upload Audio
                </Button>
              </div>
            )}
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleAudioUpload}
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Label>Answer Options</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          {[1, 2, 3, 4].map(num => (
            <div
              key={num}
              className={`border rounded-md p-4 ${
                num === correctAnswer
                  ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10'
                  : ''
              }`}
              onClick={() => setCorrectAnswer(num)}
            >
              <div className="flex items-center gap-2 mb-3">
                <RadioGroup
                  value={`option${correctAnswer}`}
                  onValueChange={value => {
                    const optionNum = parseInt(value.replace('option', ''));
                    setCorrectAnswer(optionNum);
                  }}
                  className="flex"
                >
                  <RadioGroupItem
                    value={`option${num}`}
                    id={`option${num}`}
                    checked={num === correctAnswer}
                  />
                </RadioGroup>
                <Label
                  htmlFor={`option${num}`}
                  className="flex items-center gap-2 font-medium cursor-pointer"
                >
                  Option {String.fromCharCode(64 + num)}
                  {num === correctAnswer && (
                    <span className="text-xs text-green-600 font-normal">
                      (Correct)
                    </span>
                  )}
                </Label>
              </div>
              <Input
                id={`option${num}-text`}
                placeholder={`Enter option ${num}`}
                value={options[num - 1]}
                onChange={e => handleOptionChange(num - 1, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
