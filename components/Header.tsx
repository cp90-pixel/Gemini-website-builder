import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 p-4 sticky top-0 z-10 flex-shrink-0">
      <div className="mx-auto flex items-center justify-start">
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.0006 18.26L4.9406 22.2082L6.5226 14.2799L0.587891 8.7918L8.6146 7.84006L12.0006 0.5L15.3866 7.84006L23.4133 8.7918L17.4785 14.2799L19.0605 22.2082L12.0006 18.26ZM12.0006 15.968L16.2473 18.3451L15.2988 13.5718L18.8718 10.2918L14.0393 9.6948L12.0006 5.23122L9.96184 9.6948L5.12932 10.2918L8.70231 13.5718L7.75383 18.3451L12.0006 15.968Z"></path>
          </svg>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Gemini Website Builder
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
