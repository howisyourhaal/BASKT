import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, ArrowRight, CornerDownLeft, Loader2, RefreshCw } from 'lucide-react';
import { ProductCategory } from '../types';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  followUpSuggestions?: string[];
  recommendedCategory?: ProductCategory;
  recommendedSearchTerm?: string;
}

interface ShoppingConciergeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRecommendation: (searchTerm: string, category?: ProductCategory) => void;
  currentCategory: ProductCategory;
}

const STARTER_PROMPTS = [
  'I need a computer mouse for office work',
  'Timeless Swiss watch under $1,200',
  'Woody signature perfume with long sillage',
  'Everyday luxury leather crossbody bag',
  'Best Japanese A5 Wagyu for home dinner',
];

export const ShoppingConciergeDrawer: React.FC<ShoppingConciergeDrawerProps> = ({
  isOpen,
  onClose,
  onApplyRecommendation,
  currentCategory,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hello! I'm your BASKT Shopping Concierge. If you know what kind of item you need but haven't settled on a specific model, I can ask a few quick questions to narrow down the right features and find you the lowest prices.",
      followUpSuggestions: [
        'I need a mouse for my desk setup',
        'Looking for a Swiss watch',
        'Niche luxury perfume recommendation',
        'Designer everyday bag',
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          currentCategory,
        }),
      });

      if (!response.ok) {
        throw new Error('Concierge service unavailable');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "Here are my top recommendations based on your preferences.",
        followUpSuggestions: data.followUpSuggestions || [],
        recommendedCategory: data.recommendedCategory,
        recommendedSearchTerm: data.recommendedSearchTerm,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-err-${Date.now()}`,
          role: 'assistant',
          content:
            "I'm here to help narrow down what features matter most to you! Tell me whether you prioritize silent operation, ergonomics, travel portability, or battery life.",
          followUpSuggestions: ['Silent Clicks', 'Ergonomic Support', 'Wireless Dual-device'],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content:
          "What are you shopping for today? Tell me what you have in mind and I will narrow down the exact right specifications for your budget.",
        followUpSuggestions: STARTER_PROMPTS.slice(0, 4),
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-neutral-900 text-white rounded-lg">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900">BASKT AI Concierge</h2>
              <div className="text-[11px] text-neutral-500">Personalized feature narrowing & deals</div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleResetChat}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200/60 transition-colors"
              title="Reset conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-neutral-900 text-white rounded-br-xs'
                    : 'bg-neutral-100 text-neutral-800 rounded-bl-xs border border-neutral-200/60'
                }`}
              >
                {msg.content}
              </div>

              {/* Recommendation Callout Button */}
              {msg.recommendedSearchTerm && (
                <div className="mt-2 w-full max-w-[85%]">
                  <button
                    onClick={() => {
                      onApplyRecommendation(msg.recommendedSearchTerm!, msg.recommendedCategory);
                      onClose();
                    }}
                    className="w-full p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl text-left transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-[10px] uppercase font-bold text-emerald-800">
                        Recommended Deal Match
                      </div>
                      <div className="text-xs font-semibold text-neutral-900">
                        {msg.recommendedSearchTerm}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-emerald-800 shrink-0">
                      <span>Compare</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                </div>
              )}

              {/* Interactive Quick Reply Suggestion Chips */}
              {msg.followUpSuggestions && msg.followUpSuggestions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                  {msg.followUpSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(suggestion)}
                      className="text-[11px] font-medium bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-300 rounded-lg px-2.5 py-1 text-left transition-colors shadow-2xs hover:border-neutral-900"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-neutral-500 bg-neutral-100 p-3 rounded-2xl max-w-[70%]">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-700" />
              <span>Analyzing product attributes & best prices...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-neutral-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g. I need a mouse with silent clicks..."
              disabled={isLoading}
              className="flex-1 text-xs py-2.5 px-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white rounded-xl transition-colors shrink-0 shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-[10px] text-neutral-400 mt-1.5 text-center">
            AI concierge narrows specs and links directly to verified store deals
          </div>
        </div>
      </div>
    </div>
  );
};
