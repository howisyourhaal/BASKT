import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Loader2, ArrowRight, CornerDownRight, Tag } from 'lucide-react';

interface AIScoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProductQuery: (query: string, category?: string) => void;
  currentCategory?: string;
  currentSearch?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  suggestedRefinements?: string[];
  recommendedQuery?: string;
  matchedCategory?: string;
  curatorTip?: string;
}

const STARTER_PROMPTS = [
  'I need a productive mouse for work, what should I choose?',
  'Looking for a versatile everyday Swiss watch under S$1,000',
  'Recommend a signature niche perfume that lasts in Singapore heat',
  'Need a rugged waterproof everyday bag for laptop and commute',
  'What is the highest grade organic honey for immunity?',
];

export const AIScoutDrawer: React.FC<AIScoutDrawerProps> = ({
  isOpen,
  onClose,
  onSelectProductQuery,
  currentCategory,
  currentSearch,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hello! I am your BASKT Shopping Scout. If you know what kind of elevated good you need but are unsure about brands, calibers, or technical features, tell me your use case and I will help narrow down the selection.',
      suggestedRefinements: [
        'Office Silent Mouse',
        'Swiss Automatic Watch <$1k',
        'Woody Amber Perfume',
        'Waterproof Messenger Bag',
      ],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg = textToSend.trim();
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history,
          currentCategory,
          currentSearch,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get recommendation');
      }

      const assistantPayload = data.result || data.fallback;
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: assistantPayload.reply || 'Here are my refined recommendations for you.',
          suggestedRefinements: assistantPayload.suggestedRefinements || [],
          recommendedQuery: assistantPayload.recommendedSearchQuery,
          matchedCategory: assistantPayload.matchedCategory,
          curatorTip: assistantPayload.curatorTip,
        },
      ]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            'I experienced a connection hiccup with our curation intelligence, but based on your request, I suggest prioritizing items with official Singapore local warranty and direct freight.',
          suggestedRefinements: ['Next-Day Singapore Delivery', 'Official Local Warranty'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefinementClick = (refinement: string) => {
    handleSendMessage(`Narrow selection to: ${refinement}`);
  };

  const handleApplyQuery = (query: string, category?: string) => {
    onSelectProductQuery(query, category);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/40 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-stone-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-950 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">BASKT Concierge Scout</h3>
              <p className="text-xs text-stone-500">Feature recommendation & taste refinement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-stone-950 text-white rounded-br-xs'
                    : 'bg-stone-100 text-stone-800 border border-stone-200/80 rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Curator Tip */}
                {msg.curatorTip && (
                  <div className="mt-2.5 pt-2 border-t border-stone-200/70 text-xs text-amber-800 font-medium">
                    💡 <span className="font-semibold">BASKT Buying Note:</span> {msg.curatorTip}
                  </div>
                )}
              </div>

              {/* Recommended Comparison Shortcut */}
              {msg.recommendedQuery && (
                <div className="mt-2 w-[88%]">
                  <button
                    type="button"
                    onClick={() => handleApplyQuery(msg.recommendedQuery!, msg.matchedCategory)}
                    className="w-full p-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-300/80 text-amber-950 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer shadow-xs"
                  >
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-amber-700" />
                      <span>Compare prices for "{msg.recommendedQuery}"</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Interactive Refinement Chips */}
              {msg.suggestedRefinements && msg.suggestedRefinements.length > 0 && (
                <div className="mt-2 max-w-[88%] flex flex-wrap gap-1.5">
                  {msg.suggestedRefinements.map((ref, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleRefinementClick(ref)}
                      className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <CornerDownRight className="w-3 h-3 text-stone-400" />
                      <span>{ref}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 p-3 bg-stone-100 text-stone-600 rounded-xl text-xs w-max animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-700" />
              <span>Analyzing product attributes & Singapore landed tariffs...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Starter prompts if few messages */}
        {messages.length <= 2 && (
          <div className="px-5 pb-2">
            <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
              Suggested inquiries:
            </div>
            <div className="flex flex-col gap-1">
              {STARTER_PROMPTS.slice(0, 3).map(prompt => (
                <button
                  key={prompt}
                  onClick={() => handleSendMessage(prompt)}
                  className="text-left px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg text-xs text-stone-700 transition-colors truncate cursor-pointer"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 border-t border-stone-200 bg-white">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="e.g. I need a mouse for gaming or long coding hours..."
              className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-950 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="p-2.5 bg-stone-950 hover:bg-stone-800 disabled:bg-stone-200 text-white rounded-xl transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[11px] text-stone-400 mt-2 text-center">
            AI Scout narrows feature specs & maps to authentic verified vendors.
          </p>
        </div>
      </div>
    </div>
  );
};
