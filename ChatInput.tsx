import React, { useState, useRef } from 'react';
import { SendIcon, PaperclipIcon, XCircleIcon, FileIcon } from './icons.tsx';
import type { UploadedFile } from '../types.ts';

interface ChatInputProps {
  onSendMessage: (payload: { prompt: string, files: UploadedFile[] }) => void;
  isLoading: boolean;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};


export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((prompt.trim() || files.length > 0) && !isLoading) {
      const uploadedFiles: UploadedFile[] = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          type: file.type,
          data: await fileToBase64(file),
        }))
      );
      
      onSendMessage({ prompt: prompt.trim(), files: uploadedFiles });
      setPrompt('');
      setFiles([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };


  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border-t border-gray-700">
       {files.length > 0 && (
         <div className="p-4 border-b border-gray-700">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {files.map((file, index) => (
                <div key={index} className="relative group">
                  {file.type.startsWith('image/') ? (
                    <img src={URL.createObjectURL(file)} alt={file.name} className="w-24 h-24 object-cover rounded-lg"/>
                  ) : (
                    <div className="w-24 h-24 bg-gray-700 rounded-lg flex flex-col items-center justify-center p-2">
                        <FileIcon className="w-8 h-8 text-gray-400"/>
                        <p className="text-xs text-center text-gray-300 mt-1 break-all truncate">{file.name}</p>
                    </div>
                  )}
                  <button onClick={() => handleRemoveFile(index)} className="absolute -top-2 -right-2 bg-gray-800 rounded-full text-white hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                    <XCircleIcon className="w-6 h-6"/>
                  </button>
                </div>
              ))}
            </div>
         </div>
       )}
      <form onSubmit={handleSubmit} className="flex items-center gap-3 p-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="w-12 h-12 flex-shrink-0 text-gray-400 rounded-full flex items-center justify-center transition-colors duration-200 disabled:opacity-50 hover:bg-gray-700 focus:outline-none"
        >
          <PaperclipIcon className="w-6 h-6" />
        </button>
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            multiple 
            className="hidden"
            accept="image/*,application/pdf,text/plain"
        />
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Upload a screenshot for analysis or ask a question..."
          rows={1}
          className="flex-grow bg-gray-700 text-gray-200 placeholder-gray-400 text-lg rounded-full py-3 px-6 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow duration-200"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || (!prompt.trim() && files.length === 0)}
          className="w-14 h-14 flex-shrink-0 bg-amber-500 text-gray-900 rounded-full flex items-center justify-center transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <SendIcon className="w-7 h-7" />
          )}
        </button>
      </form>
    </div>
  );
};