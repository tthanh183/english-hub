import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { sendChatMessage } from '@/services/chatbotService';

type Message = {
  id: string;
  content: string;
  timestamp: Date;
  isUser: boolean; 
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      content:
        "👋 Hi! I'm your English assistant. How can I help you today? You can ask me about English vocabulary, grammar, pronunciation or any other language-related questions.",
      timestamp: new Date(),
      isUser: false,
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      timestamp: new Date(),
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(input);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        timestamp: new Date(),
        isUser: false,
      };

      setMessages(prev => [...prev, assistantMessage]);
      scrollToBottom();
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, something went wrong. Please try again.',
        timestamp: new Date(),
        isUser: false,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="w-[400px] rounded-lg shadow-xl border border-gray-200 bg-white flex flex-col overflow-hidden animate-fade-in mb-4 max-h-[85vh]">
          <div className="flex items-center justify-between px-6 py-4 bg-blue-600">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-white border border-blue-200">
                <AvatarImage
                  src="/placeholder.svg?height=32&width=32"
                  alt="AI Assistant"
                />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <span className="font-semibold text-white text-lg">
                English Assistant
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-blue-700"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div
            ref={chatContainerRef}
            className="flex-1 px-5 py-4 overflow-y-auto h-[550px] scroll-smooth"
          >
            <div className="space-y-6">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <Avatar
                    className={`h-8 w-8 mt-1 flex-shrink-0 ${
                      message.isUser ? 'order-2 ml-2' : 'order-1 mr-2'
                    }`}
                  >
                    {message.isUser ? (
                      <AvatarFallback className="bg-green-100 text-green-600">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    ) : (
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-lg shadow-sm break-words
                      ${
                        message.isUser
                          ? 'bg-green-100 text-green-900 order-1'
                          : 'bg-gray-50 text-gray-800 order-2 border border-gray-100'
                      }
                    `}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <Avatar className="h-8 w-8 mr-2 mt-1">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="max-w-[80%] px-4 py-3 bg-gray-50 text-gray-800 border border-gray-100 rounded-lg shadow-sm">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce"></div>
                      <div
                        className="h-2 w-2 bg-gray-300 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-gray-300 rounded-full animate-bounce"
                        style={{ animationDelay: '0.4s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-end gap-2">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question..."
                className="min-h-[60px] resize-none text-base border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                rows={3}
                autoFocus
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                size="icon"
                className="bg-blue-600 hover:bg-blue-700 h-[60px] w-[60px] rounded-md"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <Button
        onClick={() => setIsOpen(v => !v)}
        className="rounded-lg w-14 h-14 shadow-lg bg-blue-600 hover:bg-blue-700 p-0 flex items-center justify-center"
        aria-label={isOpen ? 'Close chat' : 'Open English Assistant'}
      >
        {isOpen ? (
          <X className="h-4 w-4" />
        ) : (
          <MessageCircle className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
