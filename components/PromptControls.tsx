import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface PromptControlsProps {
  history: ChatMessage[];
  message: string;
  setMessage: (msg: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
}

const conversationStarters = [
  "Create a personal portfolio for a photographer",
  "A landing page for a new mobile app called 'Connectify'",
  "A website for a local bakery named 'Sugar & Spice'",
];

const LoadingIcon: React.FC = () => (
    <svg className="animate-spin h-5 w-5 text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const PromptControls: React.FC<PromptControlsProps> = ({ history, message, setMessage, onSendMessage, isLoading }) => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isLoading]);
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-800/50">
      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        {history.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-lg p-3 rounded-lg ${msg.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
              {msg.parts.map((part, partIndex) => (
                <p key={partIndex} className="text-sm whitespace-pre-wrap break-words">{part.text}</p>
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="max-w-lg p-3 rounded-lg bg-slate-700 text-slate-200 flex items-center gap-2">
                    <LoadingIcon />
                    <span className="text-sm">Thinking...</span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-slate-700 bg-slate-800/50">
        {history.length === 0 && !isLoading && (
            <div className="mb-3">
                <h3 className="text-sm font-medium text-slate-400 mb-2">Start a conversation:</h3>
                <div className="grid grid-cols-1 gap-2">
                    {conversationStarters.map((p) => (
                        <button
                            key={p}
                            onClick={() => setMessage(p)}
                            disabled={isLoading}
                            className="text-xs text-left p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-slate-300"
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>
        )}
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Change the background to dark blue..."
            className="w-full p-3 pr-14 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow resize-none text-slate-200"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={onSendMessage}
            disabled={isLoading || !message.trim()}
            className="absolute right-2 bottom-2 p-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 transition-colors disabled:bg-cyan-800 disabled:cursor-not-allowed flex items-center justify-center"
            aria-label="Send message"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
             </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptControls;