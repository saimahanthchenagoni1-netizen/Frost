import React, { useState, useEffect, useRef } from 'react';
import { Channel, Message, Group, User } from '../types';
import { Hash, Plus, Gift, Smile, Send, Mic, MoreHorizontal, Phone, Video, FileText, ChevronLeft } from 'lucide-react';
import { MOCK_USERS, INITIAL_MESSAGES } from '../constants';
import { generateAIResponse } from '../services/geminiService';

interface ChatAreaProps {
  channel: Channel | undefined;
  group: Group | null;
  currentUser: User;
  onBack: () => void;
}

const VoiceVisualizer: React.FC<{ isActive: boolean }> = ({ isActive }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();

    useEffect(() => {
        if (!isActive || !canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        let t = 0;
        const draw = () => {
            if (!ctx || !canvasRef.current) return;
            const width = canvasRef.current.width;
            const height = canvasRef.current.height;
            ctx.clearRect(0, 0, width, height);
            
            ctx.beginPath();
            ctx.moveTo(0, height / 2);
            
            for (let i = 0; i < width; i++) {
                const y = height / 2 + Math.sin(i * 0.05 + t) * (Math.random() * 20) * Math.sin(t * 0.5);
                ctx.lineTo(i, y);
            }
            
            ctx.strokeStyle = '#0FF7FF';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#0FF7FF';
            ctx.stroke();
            
            t += 0.2;
            animationRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isActive]);

    return (
        <div className={`h-20 w-full glass-panel rounded-xl mb-4 flex items-center justify-center overflow-hidden relative transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 hidden'}`}>
             <div className="absolute top-2 left-3 text-[10px] text-frost-cyan font-bold tracking-widest animate-pulse flex items-center gap-2">
                 <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                 VOICE TYPING ACTIVE...
             </div>
             <canvas ref={canvasRef} width={600} height={80} className="w-full h-full" />
        </div>
    );
};

const MessageItem: React.FC<{ msg: Message; isSameUser: boolean; currentUser: User }> = ({ msg, isSameUser, currentUser }) => {
  const isMe = msg.userId === currentUser.id;
  // Fallback lookup if not found in MOCK_USERS
  const user = isMe ? currentUser : (MOCK_USERS[msg.userId] || {
      id: msg.userId,
      username: 'Unknown User', 
      avatarUrl: 'https://picsum.photos/200', 
      color: '#fff',
      discriminator: '0000',
      status: 'offline'
  });

  return (
    <div className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} ${isSameUser ? 'mt-1' : 'mt-6'}`}>
       <div className={`flex max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
          {/* Avatar */}
          {!isSameUser && !isMe && (
            <div className="w-8 h-8 rounded-full flex-shrink-0 cursor-pointer hover:scale-110 transition-transform bg-black">
                <img src={user.avatarUrl} alt={user.username} className="w-full h-full rounded-full object-cover" />
            </div>
          )}
          {isSameUser && !isMe && <div className="w-8" />} {/* Spacer */}

          {/* Bubble */}
          <div className="flex flex-col">
             {!isSameUser && !isMe && (
                 <span className="text-xs text-gray-400 mb-1 ml-1 flex items-center gap-1">
                    {user.username} 
                    {user.id === 'frosty-ai' && <span className="text-[10px] bg-frost-cyan/20 text-frost-cyan px-1 rounded border border-frost-cyan/30">BOT</span>}
                 </span>
             )}
             
             <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed relative group transition-all duration-200 ${
                 isMe 
                   ? 'glass-bubble-me text-white rounded-tr-none' 
                   : 'glass-bubble-other text-gray-200 rounded-tl-none'
             }`}>
                {msg.type === 'file' ? (
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <FileText size={24} className="text-frost-cyan" />
                        </div>
                        <div>
                            <div className="font-bold">{msg.fileName}</div>
                            <div className="text-xs opacity-70">{(msg.fileSize! / 1024 / 1024).toFixed(2)} MB</div>
                        </div>
                    </div>
                ) : (
                    msg.content
                )}
                
                <div className={`absolute top-0 bottom-0 ${isMe ? '-left-12' : '-right-12'} w-10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity`}>
                   <button className="text-gray-400 hover:text-white"><MoreHorizontal size={14} /></button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export const ChatArea: React.FC<ChatAreaProps> = ({ channel, group, currentUser, onBack }) => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isVoiceTyping, setIsVoiceTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      if (channel?.id === 'dm-frosty-ai') {
          setMessages(INITIAL_MESSAGES);
      } else {
          setMessages([]);
      }
  }, [channel?.id]);

  useEffect(() => {
      if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
  }, [messages, channel]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      userId: currentUser.id,
      content: inputValue,
      timestamp: new Date().toISOString(),
      type: 'text',
    };

    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
    
    // AI Check
    const isAIContext = (channel?.id === 'dm-frosty-ai');

    if (isAIContext) {
        setIsTyping(true);
        const history = messages.slice(-5).map(m => {
            const uName = m.userId === currentUser.id ? 'User' : 'Frosty';
            return `${uName}: ${m.content}`;
        });
        
        try {
            const responseText = await generateAIResponse(history, newMsg.content);
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                userId: 'frosty-ai',
                content: responseText,
                timestamp: new Date().toISOString(),
                type: 'text',
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (e) {
            console.error(e);
        } finally {
            setIsTyping(false);
        }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > 200) {
          alert("File too large. Max limit is 200MB.");
          return;
      }

      // Mock upload
      const newMsg: Message = {
          id: Date.now().toString(),
          userId: currentUser.id,
          content: '',
          type: 'file',
          fileName: file.name,
          fileSize: file.size,
          timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, newMsg]);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleVoiceTyping = () => {
      if (!isVoiceTyping) {
          setIsVoiceTyping(true);
          // Simulate voice input appearing
          setTimeout(() => {
              setInputValue(prev => prev + " This is simulated voice text...");
              setIsVoiceTyping(false);
          }, 3000);
      } else {
          setIsVoiceTyping(false);
      }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!channel) return null;

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-[#0A0A0F]">
        {/* Ambient Glow */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-frost-cyan/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 glass-panel z-10">
        <div className="flex items-center gap-3">
             <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                <ChevronLeft size={24} />
            </button>
            <div className="w-8 h-8 rounded-lg bg-frost-cyan/10 flex items-center justify-center text-frost-cyan">
                <Hash size={18} />
            </div>
            <div>
                <h3 className="font-bold text-white text-base leading-none">{channel.name}</h3>
                <span className="text-xs text-gray-500">
                    {group ? `Topic: ${channel.name}` : 'Encrypted Direct Connection'}
                </span>
            </div>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
            <Phone size={20} className="hover:text-white cursor-pointer" />
            <Video size={20} className="hover:text-white cursor-pointer" />
            <div className="w-px h-6 bg-white/10" />
            <div className="relative w-48 hidden md:block">
                <input type="text" placeholder="Search..." className="w-full bg-black/30 border border-white/10 rounded-md py-1 px-2 text-xs focus:border-frost-cyan/50 outline-none transition-colors" />
            </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 pt-4 space-y-2 z-10" ref={scrollRef}>
        {messages.map((msg, idx) => {
          const prevMsg = messages[idx - 1];
          const isSameUser = prevMsg && prevMsg.userId === msg.userId && (new Date(msg.timestamp).getTime() - new Date(prevMsg.timestamp).getTime() < 5 * 60 * 1000);
          return <MessageItem key={msg.id} msg={msg} isSameUser={!!isSameUser} currentUser={currentUser} />;
        })}
        
        {isTyping && (
            <div className="mt-4 flex items-center gap-2 px-4 animate-pulse">
                 <span className="text-xs text-frost-cyan font-mono">Frosty AI is thinking...</span>
            </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 pt-2 z-10">
        <VoiceVisualizer isActive={isVoiceTyping} />
        
        <div className="glass-panel rounded-2xl p-2 flex items-center gap-2 relative">
          <input 
             type="file" 
             ref={fileInputRef} 
             className="hidden" 
             onChange={handleFileUpload} 
          />
          <button 
             onClick={() => fileInputRef.current?.click()}
             className="p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
          >
            <Plus size={20} />
          </button>
          
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-white px-2 placeholder-gray-500 font-light"
            placeholder={`Message ${channel.name}`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <div className="flex items-center gap-1 pr-2">
            <button className="p-2 text-gray-400 hover:text-frost-cyan transition-colors hover:bg-frost-cyan/10 rounded-lg">
                <Gift size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-yellow-400 transition-colors hover:bg-yellow-400/10 rounded-lg">
                <Smile size={20} />
            </button>
            <button 
                className={`p-2 transition-colors rounded-lg ${isVoiceTyping ? 'text-red-500 animate-pulse bg-red-500/10' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                onClick={toggleVoiceTyping}
                title="Voice Typing"
            >
                <Mic size={20} />
            </button>
             <button 
                className="p-2 bg-frost-cyan/10 text-frost-cyan hover:bg-frost-cyan hover:text-black transition-all rounded-xl shadow-[0_0_10px_rgba(15,247,255,0.2)] hover:shadow-[0_0_20px_rgba(15,247,255,0.5)]"
                onClick={handleSend}
            >
                <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};