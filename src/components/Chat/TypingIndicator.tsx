import React from 'react';
import { Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-end">
        <div className="flex-shrink-0 mr-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}