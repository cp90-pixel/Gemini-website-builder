import React, { useState, useCallback, useEffect } from 'react';
import { Chat } from '@google/genai';
import Header from './components/Header';
import PromptControls from './components/PromptControls';
import ResultDisplay from './components/ResultDisplay';
import { startChatSession, extractHtmlContent } from './services/geminiService';
import { ViewMode, ChatMessage, ChatMessagePart } from './types';
import ApiKeyModal from './components/ApiKeyModal';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Preview);

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      setIsKeyModalOpen(true);
    }
  }, []);
  
  useEffect(() => {
    if (apiKey) {
      try {
        const chat = startChatSession(apiKey);
        setChatSession(chat);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to start chat session.');
      }
    } else {
      setChatSession(null);
    }
  }, [apiKey]);

  const handleSaveApiKey = (key: string) => {
    if (key.trim()) {
      setApiKey(key.trim());
      localStorage.setItem('gemini_api_key', key.trim());
      setIsKeyModalOpen(false);
    }
  };

  const handleSendMessage = useCallback(async () => {
    if (!currentMessage.trim() || isLoading || !chatSession) return;

    setIsLoading(true);
    setError(null);

    const userMessageParts: ChatMessagePart[] = [{ text: currentMessage }];

    const userMessage: ChatMessage = {
      role: 'user',
      parts: userMessageParts,
    };
    
    setHistory(prev => [...prev, userMessage]);
    
    const messageToSend = {
      message: userMessageParts.map(p => ({ text: p.text }))
    };

    setCurrentMessage('');

    try {
      // @ts-ignore - a bug in the library type definition
      const response = await chatSession.sendMessage(messageToSend);
      const modelResponseText = response.text;
      
      const modelMessage: ChatMessage = {
        role: 'model',
        parts: [{ text: modelResponseText }],
      };
      setHistory(prev => [...prev, modelMessage]);

      const html = extractHtmlContent(modelResponseText);
      if (html) {
        setGeneratedHtml(html);
        setViewMode(ViewMode.Preview);
      }

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`API Error: ${errorMessage}. Please check your API key and network connection.`);
      const errorBotMessage: ChatMessage = {
          role: 'model',
          parts: [{ text: `Sorry, I encountered an error: ${errorMessage}` }]
      };
      setHistory(prev => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [currentMessage, isLoading, chatSession]);

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 font-sans">
      {isKeyModalOpen && <ApiKeyModal onSave={handleSaveApiKey} currentKey={apiKey || ''} />}
      <Header onManageApiKey={() => setIsKeyModalOpen(true)} />
      {apiKey ? (
        <main className="flex-grow flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-1/3 lg:w-1/4 h-auto md:h-full border-t md:border-t-0 md:border-r border-slate-700 flex-shrink-0">
            <PromptControls
              history={history}
              message={currentMessage}
              setMessage={setCurrentMessage}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
          <div className="flex-grow w-full md:w-2/3 lg:w-3/4 h-full">
            <ResultDisplay
              htmlContent={generatedHtml}
              isLoading={isLoading && !generatedHtml}
              error={error}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          </div>
        </main>
      ) : (
         <div className="flex-grow flex items-center justify-center">
            {!isKeyModalOpen && (
                 <div className="text-center text-slate-500">
                    <p className="mb-4">Please set your Gemini API key to start building.</p>
                    <button 
                        onClick={() => setIsKeyModalOpen(true)}
                        className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded-md shadow-lg hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 transition-colors"
                    >
                        Set API Key
                    </button>
                 </div>
            )}
        </div>
      )}
    </div>
  );
};

export default App;
