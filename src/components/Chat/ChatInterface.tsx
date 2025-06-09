import React, { useState, useRef, useEffect } from 'react';
import { Send, RotateCcw, Sparkles } from 'lucide-react';
import { Message } from '../../types';
import { apiService } from '../../services/api';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { v4 as uuidv4 } from 'uuid';

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Add welcome message
    const welcomeMessage: Message = {
      id: uuidv4(),
      type: 'bot',
      content: "👋 Hello! I'm your TechMart shopping assistant. I can help you find the perfect electronics, compare prices, and answer any questions about our products. What are you looking for today?",
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: uuidv4(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await apiService.sendMessage(inputMessage.trim(), sessionId);
      setSessionId(response.sessionId);
      
      // Simulate typing delay for better UX
      setTimeout(() => {
        setMessages(prev => [...prev, response.message]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: uuidv4(),
        type: 'bot',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetConversation = () => {
    setSessionId(null);
    const welcomeMessage: Message = {
      id: uuidv4(),
      type: 'bot',
      content: "👋 Hello! I'm your TechMart shopping assistant. I can help you find the perfect electronics, compare prices, and answer any questions about our products. What are you looking for today?",
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMessage]);
  };

  const quickPrompts = [
    "Show me laptops under $1000",
    "What's the best smartphone for photography?",
    "Find wireless headphones",
    "Compare gaming laptops"
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Chat Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">TechMart Assistant</h2>
              <p className="text-sm text-slate-500">Your personal shopping helper</p>
            </div>
          </div>
          <button
            onClick={resetConversation}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset Chat</span>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
          
          {/* Quick Prompts - Show only when conversation is short */}
          {messages.length <= 2 && (
            <div className="mt-6">
              <p className="text-sm text-slate-600 mb-3 text-center">Try asking me about:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(prompt)}
                    className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-md border-t border-slate-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about products, prices, or anything else..."
                className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}