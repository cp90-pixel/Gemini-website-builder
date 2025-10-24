import React from 'react';

interface HeaderProps {
  onManageApiKey: () => void;
}

const Header: React.FC<HeaderProps> = ({ onManageApiKey }) => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 p-4 sticky top-0 z-10 flex-shrink-0 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <svg className="w-8 h-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.0006 18.26L4.9406 22.2082L6.5226 14.2799L0.587891 8.7918L8.6146 7.84006L12.0006 0.5L15.3866 7.84006L23.4133 8.7918L17.4785 14.2799L19.0605 22.2082L12.0006 18.26ZM12.0006 15.968L16.2473 18.3451L15.2988 13.5718L18.8718 10.2918L14.0393 9.6948L12.0006 5.23122L9.96184 9.6948L5.12932 10.2918L8.70231 13.5718L7.75383 18.3451L12.0006 15.968Z"></path>
        </svg>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Gemini Website Builder
        </h1>
      </div>
      <div>
        <button 
          onClick={onManageApiKey}
          className="p-2 rounded-md hover:bg-slate-700 transition-colors"
          aria-label="Manage API Key"
          title="Manage API Key"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-300" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a4 4 0 100 8 4 4 0 000-8zM2 8a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
