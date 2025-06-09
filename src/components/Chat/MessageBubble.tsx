import React from 'react';
import { Message } from '../../types';
import { ProductCard } from './ProductCard';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isBot = message.type === 'bot';
  const timestamp = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`flex max-w-3xl ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isBot ? 'mr-3' : 'ml-3'}`}>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
            isBot 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
              : 'bg-gradient-to-r from-slate-600 to-slate-700'
          }`}>
            {isBot ? (
              <Bot className="h-4 w-4 text-white" />
            ) : (
              <User className="h-4 w-4 text-white" />
            )}
          </div>
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
          <div
            className={`px-4 py-3 rounded-2xl max-w-lg ${
              isBot
                ? 'bg-white border border-slate-200 text-slate-900 rounded-bl-md'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md'
            } shadow-sm`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>

          {/* Products */}
          {message.products && message.products.length > 0 && (
            <div className="mt-3 space-y-3 w-full max-w-2xl">
              {message.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Timestamp */}
          <span className={`text-xs text-slate-500 mt-1 ${isBot ? 'ml-1' : 'mr-1'}`}>
            {timestamp}
          </span>
        </div>
      </div>
    </div>
  );
}