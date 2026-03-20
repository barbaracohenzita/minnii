import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Location, Message } from '../types';

interface LocationScreenProps {
  key?: string;
  location: Location;
  messages: Message[];
  isCompleted: boolean;
  onSendMessage: (text: string) => Promise<void>;
  onWordClick: (word: string) => void;
  onReaction: (messageId: string, reaction: string) => void;
}

export function LocationScreen({ location, messages, isCompleted, onSendMessage, onWordClick, onReaction }: LocationScreenProps) {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const text = input.trim();
    setInput('');
    setIsSending(true);
    await onSendMessage(text);
    setIsSending(false);
  };

  const REACTIONS = ['👍', '😂', '🤔'];

  const userMessageCount = messages.filter(m => m.senderId === 'user').length;
  const progressPercent = Math.min((userMessageCount / 3) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-200 flex flex-col h-[calc(100vh-120px)]"
    >
      {/* Progress Bar */}
      <div className="h-1 bg-stone-200 relative overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Location Header */}
      <div className={`bg-gradient-to-r ${location.color} p-6 flex flex-col gap-4 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 opacity-10 text-9xl -mt-4 -mr-4 pointer-events-none">
          {location.icon}
        </div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="text-5xl bg-white/50 p-3 rounded-2xl shadow-sm">
            {location.npc.avatar}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{location.npc.name}</h2>
            <p className="opacity-90 font-medium uppercase tracking-wider text-sm">{location.npc.role} • {location.name}</p>
          </div>
        </div>
        
        <div className="relative z-10 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-xl text-sm italic font-medium">
          ✨ {location.ambient}
        </div>
      </div>

      {isCompleted && (
        <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2 text-center text-sm font-medium text-emerald-800 flex items-center justify-center gap-2">
          <span className="text-emerald-500">✓</span> You've been here before. Push yourself further.
        </div>
      )}

      {/* Chat Area */}
      <div 
        className="flex-1 overflow-y-auto p-6 space-y-6 relative"
        style={{
          backgroundColor: '#fafaf9',
          backgroundImage: `radial-gradient(var(--tw-gradient-from) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px'
        }}
      >
        <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${location.color} pointer-events-none`} />
        
        <div className="relative z-10 space-y-6">
          {messages.map((msg) => {
            const isUser = msg.senderId === 'user';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: isUser ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-3xl mr-3 mt-1 flex-shrink-0"
                  >
                    {location.npc.avatar}
                  </motion.div>
                )}
                <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[75%]`}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className={`p-4 rounded-2xl ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-br-sm shadow-md'
                        : 'bg-white border border-stone-200 text-stone-900 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    <p className="text-lg leading-relaxed whitespace-pre-wrap">
                      {isUser ? msg.text : msg.text.split(/(\s+)/).map((part, i) => {
                        if (/\s+/.test(part)) return part;
                        const cleanWord = part.replace(/[.,!?¿¡"']/g, '');
                        return (
                          <span
                            key={i}
                            onClick={() => cleanWord && onWordClick(cleanWord)}
                            className="cursor-pointer hover:bg-stone-200 hover:text-stone-900 rounded px-0.5 transition-colors"
                            title="Tap to translate & save"
                          >
                            {part}
                          </span>
                        );
                      })}
                    </p>
                  </motion.div>

                  {/* Reactions */}
                  {!isUser && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="flex gap-1.5 mt-2 ml-2"
                    >
                      {REACTIONS.map((reaction, idx) => {
                        const colors = [
                          'hover:bg-emerald-50 hover:border-emerald-300',
                          'hover:bg-amber-50 hover:border-amber-300',
                          'hover:bg-slate-50 hover:border-slate-300'
                        ];
                        const activeColors = [
                          'bg-emerald-100 border-emerald-400 shadow-md',
                          'bg-amber-100 border-amber-400 shadow-md',
                          'bg-slate-100 border-slate-400 shadow-md'
                        ];
                        return (
                          <button
                            key={reaction}
                            onClick={() => onReaction(msg.id, reaction)}
                            className={`text-base p-2 rounded-full transition-all hover:scale-125 border ${
                              msg.reaction === reaction
                                ? activeColors[idx]
                                : `bg-white/90 border-stone-200 ${colors[idx]} shadow-sm`
                            }`}
                          >
                            {reaction}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
          {isSending && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-start w-full"
            >
              <div className="text-3xl mr-3 mt-1 flex-shrink-0">{location.npc.avatar}</div>
              <div className="bg-white border border-stone-200 px-5 py-4 rounded-2xl rounded-bl-sm shadow-sm flex gap-2 items-center h-[52px]">
                <motion.div className="w-2 h-2 bg-stone-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                <motion.div className="w-2 h-2 bg-stone-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                <motion.div className="w-2 h-2 bg-stone-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-stone-200 flex flex-col relative">
        {showHint && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 right-0 p-3 bg-amber-50 border-t border-amber-100 text-amber-900 text-sm font-medium flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
          >
            <span>💡 Try asking: <span className="italic">"{location.hint}"</span></span>
            <button onClick={() => setShowHint(false)} className="text-amber-700 hover:text-amber-900 p-1">✕</button>
          </motion.div>
        )}
        <form onSubmit={handleSubmit} className="p-4 flex gap-3 items-center">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full transition-colors ${showHint ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700'}`}
            title="Get a hint"
          >
            💡
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={`Reply to ${location.npc.name}...`}
            className="flex-1 bg-stone-100 border-transparent focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-3 text-lg transition-all outline-none"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            Speak
          </button>
        </form>
      </div>
    </motion.div>
  );
}
