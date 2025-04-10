import { useState, useRef, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Mic } from 'lucide-react';
import ImagePreview from '@/components/ImagePreview';
import AudioPlayer from '@/components/AudioPlayer';
import { Label } from '@/components/ui/label';

type MediaType = 'image' | 'audio';

type MediaUploaderProps = {
  type: MediaType;
  value?: string | null;
  onChange?: (file: File | null) => void;
  onClear?: () => void;
  label?: string;
  accept?: string;
  className?: string;
  placeholder?: string;
  icon?: ReactNode;
};

export default function MediaUploader({
  type,
  value,
  onChange,
  onClear,
  label,
  accept,
  className = '',
  placeholder,
  icon,
}: MediaUploaderProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultAccept = type === 'image' ? 'image/*' : 'audio/*';
  const defaultPlaceholder =
    type === 'image'
      ? 'Drag and drop an image, or click to browse'
      : 'Drag and drop an audio file, or click to browse';
  const defaultIcon =
    type === 'image' ? (
      <ImageIcon className="h-8 w-8 text-gray-400" />
    ) : (
      <Mic className="h-8 w-8 text-gray-400" />
    );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const fileType = type === 'image' ? 'image/' : 'audio/';
    if (!selectedFile.type.startsWith(fileType)) {
      alert(`Please select a valid ${type} file`);
      return;
    }

    const previewUrl = URL.createObjectURL(selectedFile);
    setPreview(previewUrl);
    setFile(selectedFile);

    if (onChange) {
      onChange(selectedFile);
    }
  };

  const handleRemove = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(null);
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (onClear) {
      onClear();
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label>{label}</Label>}
      <div
        className="border-2 border-dashed rounded-lg overflow-hidden cursor-pointer"
        onClick={() => !preview && fileInputRef.current?.click()}
      >
        {preview ? (
          type === 'image' ? (
            <ImagePreview
              src={preview}
              onRemove={handleRemove}
              editable={true}
            />
          ) : (
            <AudioPlayer
              src={preview}
              fileName={file?.name}
              fileSize={file?.size}
              onRemove={handleRemove}
              editable={true}
            />
          )
        ) : (
          <div className="p-6 flex flex-col items-center justify-center gap-2 text-center aspect-video">
            {icon || defaultIcon}
            <div className="text-sm text-gray-500">
              {placeholder || defaultPlaceholder}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={e => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              {`Upload ${type === 'image' ? 'Image' : 'Audio'}`}
            </Button>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept || defaultAccept}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
