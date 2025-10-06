import React, { useState, useEffect, useRef } from 'react';
import type { Message, UploadedFile } from './types.ts';
import { runQuery } from './services/geminiService.ts';
import { ChatMessage } from './components/ChatMessage.tsx';
import { ChatInput } from './components/ChatInput.tsx';
import { ExamplePrompts } from './components/ExamplePrompts.tsx';
import { AiIcon } from './components/icons.tsx';
import { GAMELOFT_LOGO_BASE64, GARENA_LOGO_BASE64 } from './components/assets.ts';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (payload: { prompt: string, files: UploadedFile[] }) => {
    const { prompt, files } = payload;
    
    if (!prompt && files.length === 0) return;

    setError(null);
    const userMessage: Message = { role: 'user', text: prompt, files };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { text, sources } = await runQuery(prompt, files);
      const modelMessage: Message = { role: 'model', text, sources };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      // Revert optimistic user message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    handleSendMessage({ prompt, files: [] });
  };

  return (
    <div className="h-screen w-screen bg-gray-900/70 text-white flex flex-col font-teko">
      <header className="flex items-center justify-center gap-4 p-4 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 shadow-lg">
        <img src={GAMELOFT_LOGO_BASE64} alt="Gameloft Logo" className="w-10 h-10 rounded-full border-2 border-amber-500 object-cover" />
        <img src={GARENA_LOGO_BASE64} alt="Garena Logo" className="w-10 h-10 rounded-full border-2 border-amber-500 object-cover" />
        <h1 className="text-4xl font-bold tracking-widest text-amber-400">
          TWO LEGENDS PRO
        </h1>
      </header>
      
      <main className="flex-grow overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto h-full">
          {messages.length === 0 && !isLoading ? (
            <ExamplePrompts onPromptClick={handlePromptClick} isLoading={isLoading} />
          ) : (
            <div className="space-y-6">
              {messages.map((msg, index) => (
                <ChatMessage key={index} message={msg} />
              ))}
               {isLoading && messages.length > 0 && messages[messages.length-1].role === 'user' && (
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-gray-900">
                    <AiIcon className="w-5 h-5" />
                  </div>
                  <div className="max-w-xl">
                    <div className="px-5 py-3 rounded-2xl bg-gray-800 rounded-bl-none flex items-center space-x-2">
                        <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-0"></span>
                        <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-200"></span>
                        <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-400"></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
          {error && (
            <div className="mt-4 text-center p-3 bg-red-500/20 text-red-300 border border-red-500 rounded-lg">
              <p><strong>Oops! Something went wrong.</strong></p>
              <p>{error}</p>
            </div>
          )}
        </div>
      </main>

      <footer className="w-full max-w-4xl mx-auto">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </footer>
    </div>
  );
}