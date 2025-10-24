import React, { useState, useCallback, useEffect } from 'react';
import { Chat } from '@google/genai';
import Header from './components/Header';
import PromptControls from './components/PromptControls';
import ResultDisplay from './components/ResultDisplay';
import { startChatSession, extractHtmlContent } from './services/geminiService';
import { ViewMode, ChatMessage, ChatMessagePart } from './types';

const App: React.FC = () => {
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Preview);
  const [isAnnotating, setIsAnnotating] = useState<boolean>(false);
  const [annotationImage, setAnnotationImage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const chat = startChatSession();
      setChatSession(chat);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start chat session.');
    }
  }, []);

  const handleAnnotationComplete = (imageDataUrl: string) => {
    setAnnotationImage(imageDataUrl);
    setIsAnnotating(false);
  };

  const handleSendMessage = useCallback(async () => {
    if (!currentMessage.trim() || isLoading || !chatSession) return;

    setIsLoading(true);
    setError(null);

    const userMessageParts: ChatMessagePart[] = [];
    if (annotationImage) {
      userMessageParts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: annotationImage.split(',')[1], // remove data:image/jpeg;base64,
        }
      });
    }
    userMessageParts.push({ text: currentMessage });

    const userMessage: ChatMessage = {
      role: 'user',
      parts: userMessageParts,
    };
    
    setHistory(prev => [...prev, userMessage]);
    
    const messageToSend = {
      message: userMessageParts.map(p => {
        if (p.inlineData) return { inlineData: p.inlineData };
        return { text: p.text };
      })
    };

    setCurrentMessage('');
    setAnnotationImage(null);

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
      setError(errorMessage);
      const errorBotMessage: ChatMessage = {
          role: 'model',
          parts: [{ text: `Sorry, I encountered an error: ${errorMessage}` }]
      };
      setHistory(prev => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [currentMessage, isLoading, chatSession, annotationImage]);

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 font-sans">
      <Header />
      <main className="flex-grow flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/3 lg:w-1/4 h-auto md:h-full border-t md:border-t-0 md:border-r border-slate-700 flex-shrink-0">
          <PromptControls
            history={history}
            message={currentMessage}
            setMessage={setCurrentMessage}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            annotationImage={annotationImage}
            clearAnnotation={() => setAnnotationImage(null)}
          />
        </div>
        <div className="flex-grow w-full md:w-2/3 lg:w-3/4 h-full">
          <ResultDisplay
            htmlContent={generatedHtml}
            isLoading={isLoading && !generatedHtml}
            error={error}
            viewMode={viewMode}
            setViewMode={setViewMode}
            isAnnotating={isAnnotating}
            setIsAnnotating={setIsAnnotating}
            onAnnotationComplete={handleAnnotationComplete}
          />
        </div>
      </main>
    </div>
  );
};

export default App;