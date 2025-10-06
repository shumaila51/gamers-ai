import React from 'react';
import { GAMELOFT_LOGO_BASE64, GARENA_LOGO_BASE64 } from './assets.ts';

interface ExamplePromptsProps {
  onPromptClick: (prompt: string) => void;
  isLoading: boolean;
}

const prompts = [
  "What are the best sensitivity settings for headshots?",
  "Tell me about the latest Free Fire tournament.",
  "Who is the best Free Fire player in the world right now?",
  "What are some popular games by Gameloft?",
];

export const ExamplePrompts: React.FC<ExamplePromptsProps> = ({ onPromptClick, isLoading }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-300">
      <div className="text-center bg-gray-900/30 backdrop-blur-sm p-8 rounded-xl">
        <div className="flex justify-center items-center gap-8 mb-6">
            <img
                src={GAMELOFT_LOGO_BASE64}
                alt="Gameloft Logo"
                className="w-24 h-24 rounded-full border-2 border-amber-500 object-cover"
            />
            <img
                src={GARENA_LOGO_BASE64}
                alt="Garena Logo"
                className="w-24 h-24 rounded-full border-2 border-amber-500 object-cover"
            />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white tracking-wider">TWO LEGENDS PRO</h1>
        <p className="text-xl text-gray-400 mt-2">Your AI Assistant for Garena & Gameloft</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 w-full max-w-3xl">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptClick(prompt)}
            disabled={isLoading}
            className="p-4 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg text-left text-lg hover:bg-gray-700/80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};