
import React from 'react';
import type { Message, GroundingSource, UploadedFile } from '../types.ts';
import { UserIcon, AiIcon, LinkIcon, FileIcon } from './icons.tsx';

interface ChatMessageProps {
  message: Message;
}

const SourceLink: React.FC<{ source: GroundingSource }> = ({ source }) => (
  <a
    href={source.uri}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 text-sm text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded-full px-3 py-1 transition-colors duration-200"
  >
    <LinkIcon className="h-4 w-4" />
    <span className="truncate">{source.title}</span>
  </a>
);

/**
 * A component that takes a string and renders it with any URLs converted to clickable links.
 */
const LinkifiedText: React.FC<{ text: string }> = ({ text }) => {
  const urlRegex = /(https?:\/\/\S+)/g;
  const parts = text.split(urlRegex);

  return (
    <>
      {parts.map((part, index) => {
        if (part.match(urlRegex)) {
          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline break-all"
            >
              {part}
            </a>
          );
        }
        return part;
      })}
    </>
  );
};

const FilePreview: React.FC<{ file: UploadedFile }> = ({ file }) => {
  if (file.type.startsWith('image/')) {
    return (
      <img
        src={file.data}
        alt={file.name}
        className="w-32 h-32 object-cover rounded-lg border border-gray-600"
      />
    );
  }
  return (
    <div className="w-32 h-32 bg-gray-700 rounded-lg flex flex-col items-center justify-center p-2 border border-gray-600">
      <FileIcon className="w-10 h-10 text-gray-400" />
      <p className="text-xs text-center text-gray-300 mt-2 break-all truncate">{file.name}</p>
    </div>
  );
};


export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUserModel = message.role === 'model';

  return (
    <div className={`flex items-start gap-4 ${isUserModel ? '' : 'justify-end'}`}>
      {isUserModel && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-gray-900">
          <AiIcon className="w-5 h-5" />
        </div>
      )}

      <div className={`max-w-xl ${isUserModel ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-5 py-3 rounded-2xl ${
            isUserModel
              ? 'bg-gray-800 text-gray-200 rounded-bl-none'
              : 'bg-amber-500 text-gray-900 rounded-br-none'
          }`}
        >
          {message.files && message.files.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {message.files.map((file, index) => (
                <FilePreview key={index} file={file} />
              ))}
            </div>
          )}
          {message.text && (
            <p className="whitespace-pre-wrap text-lg leading-tight tracking-wide break-words">
              {isUserModel ? <LinkifiedText text={message.text} /> : message.text}
            </p>
          )}
        </div>
        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
             <p className="text-xs text-gray-400 w-full mb-1">Sources:</p>
            {message.sources.map((source, index) => (
              <SourceLink key={index} source={source} />
            ))}
          </div>
        )}
      </div>

      {!isUserModel && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 order-2">
          <UserIcon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};