import React, { useState } from 'react';

interface ApiKeyModalProps {
  onSave: (apiKey: string) => void;
  currentKey?: string;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave, currentKey }) => {
  const [key, setKey] = useState(currentKey || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      onSave(key);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-2">Enter your Gemini API Key</h2>
        <p className="text-slate-400 mb-4 text-sm">
          To use this application, you need a Gemini API key. You can get one from{' '}
          <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
            Google AI Studio
          </a>.
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="apiKey" className="block text-sm font-medium text-slate-300 mb-1">
            API Key
          </label>
          <input
            id="apiKey"
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full p-2 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none text-slate-200"
            placeholder="Enter your API key here"
            autoFocus
          />
          <button
            type="submit"
            disabled={!key.trim()}
            className="mt-4 w-full p-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 transition-colors disabled:bg-cyan-800 disabled:cursor-not-allowed font-semibold"
          >
            Save and Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApiKeyModal;
