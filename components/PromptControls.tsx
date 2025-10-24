import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface PromptControlsProps {
  history: ChatMessage[];
  message: string;
  setMessage: (msg: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  annotationImage: string | null;
  clearAnnotation: () => void;
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

const PromptControls: React.FC<PromptControlsProps> = ({ history, message, setMessage, onSendMessage, isLoading, annotationImage, clearAnnotation }) => {
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
              {msg.parts.map((part, partIndex) => {
                if (part.inlineData) {
                  return <img key={partIndex} src={`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`} className="rounded-md max-w-full mb-2 border-2 border-slate-500/50" alt="Annotation context" />;
                }
                if (part.text) {
                  return <p key={partIndex} className="text-sm whitespace-pre-wrap break-words">{part.text}</p>;
                }
                return null;
              })}
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
        {history.length === 0 && !isLoading && !annotationImage && (
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
        {annotationImage && (
            <div className="mb-2 relative w-32 h-20 border border-slate-600 rounded-md overflow-hidden">
                <img src={annotationImage} alt="Annotation thumbnail" className="object-cover w-full h-full" />
                <button 
                    onClick={clearAnnotation}
                    className="absolute top-1 right-1 bg-slate-900/50 text-white rounded-full p-0.5 hover:bg-slate-900/80 transition-colors"
                    aria-label="Clear annotation"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        )}
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={annotationImage ? "Describe the change for the circled area..." : "Change the background to dark blue..."}
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