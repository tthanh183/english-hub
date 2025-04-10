import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ImagePreviewProps = {
  src: string;
  alt?: string;
  onRemove?: () => void;
  className?: string;
  editable?: boolean;
};

export default function ImagePreview({
  src,
  alt = 'Image preview',
  onRemove,
  className = '',
  editable = false,
}: ImagePreviewProps) {
  return (
    <div className={`relative ${className}`}>
      <img src={src} alt={alt} className="w-full h-56 object-contain" />

      {editable && onRemove && (
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 rounded-full"
          onClick={e => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
