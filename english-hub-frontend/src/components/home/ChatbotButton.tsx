import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import { ChatbotPanel } from '@/components/home/ChatbotPanel';
import { cn } from '@/lib/utils';

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50',
          'bg-blue-600 hover:bg-blue-700 p-0 flex items-center justify-center'
        )}
        aria-label="Open English Learning Assistant"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>
      <ChatbotPanel />
    </>
  );
}
