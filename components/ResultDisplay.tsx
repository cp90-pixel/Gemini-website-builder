import React from 'react';
import { ViewMode } from '../types';

interface ResultDisplayProps {
  htmlContent: string;
  isLoading: boolean;
  error: string | null;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const LoadingSkeleton: React.FC = () => (
    <div className="p-8 w-full h-full animate-pulse bg-slate-800">
        <div className="h-16 bg-slate-700 rounded-md mb-8 w-1/3"></div>
        <div className="space-y-4">
            <div className="h-6 bg-slate-700 rounded-md w-full"></div>
            <div className="h-6 bg-slate-700 rounded-md w-5/6"></div>
            <div className="h-6 bg-slate-700 rounded-md w-full"></div>
            <div className="h-6 bg-slate-700 rounded-md w-3/4"></div>
        </div>
        <div className="h-48 bg-slate-700 rounded-md mt-12 w-full"></div>
    </div>
);

const InitialState: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8 text-center bg-slate-800/50">
     <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
        <path d="m15 5 3 3"/>
    </svg>
    <h3 className="text-xl font-semibold">Your Website Appears Here</h3>
    <p className="mt-2 max-w-md">Start the conversation in the panel on the left. Describe the website you want to build, then refine it with follow-up messages.</p>
  </div>
);


const ResultDisplay: React.FC<ResultDisplayProps> = ({ htmlContent, isLoading, error, viewMode, setViewMode }) => {

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSkeleton />;
    }
    if (error && !htmlContent) { // Only show full-screen error if there's no content to display
      return (
        <div className="flex flex-col items-center justify-center h-full text-red-400 p-8 bg-slate-800/50">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <h3 className="text-xl font-semibold">An Error Occurred</h3>
          <p className="mt-2 text-sm text-red-300 bg-red-900/50 p-3 rounded-md w-full max-w-lg text-center">{error}</p>
        </div>
      );
    }
    if (!htmlContent) {
      return <InitialState />;
    }
    if (viewMode === ViewMode.Preview) {
      return (
        <iframe
          srcDoc={htmlContent}
          title="Website Preview"
          className="w-full h-full border-0 bg-white"
          sandbox="allow-scripts allow-same-origin"
        />
      );
    }
    if (viewMode === ViewMode.Code) {
      return (
        <div className="w-full h-full bg-slate-900 overflow-auto">
          <pre className="text-sm p-4"><code className="language-html text-slate-300 whitespace-pre-wrap break-all">{htmlContent}</code></pre>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="flex-shrink-0 bg-slate-800 p-2 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-2">
            <button
                onClick={() => setViewMode(ViewMode.Preview)}
                disabled={!htmlContent}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${viewMode === ViewMode.Preview ? 'bg-cyan-600 text-white' : 'bg-transparent text-slate-300 hover:bg-slate-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                Preview
            </button>
            <button
                onClick={() => setViewMode(ViewMode.Code)}
                disabled={!htmlContent}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${viewMode === ViewMode.Code ? 'bg-cyan-600 text-white' : 'bg-transparent text-slate-300 hover:bg-slate-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                Code
            </button>
        </div>
      </div>
      <div className="flex-grow relative overflow-hidden bg-slate-800/50">
        {renderContent()}
      </div>
    </div>
  );
};

export default ResultDisplay;