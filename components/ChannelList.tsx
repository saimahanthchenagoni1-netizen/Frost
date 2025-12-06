import React from 'react';
import { Group, Channel, User } from '../types';
import { Hash, Volume2, Mic, Settings, ChevronDown, Plus } from 'lucide-react';

interface ChannelListProps {
  server: Group | null; // Keep 'server' prop name to avoid breaking too much of App.tsx logic immediately, but treat as Group
  activeChannelId: string | null;
  onChannelSelect: (id: string) => void;
  currentUser: User;
}

const ChannelItem: React.FC<{
  channel: Channel;
  isActive: boolean;
  onClick: () => void;
}> = ({ channel, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`group flex items-center px-3 py-2 mx-2 rounded-lg mb-1 cursor-pointer transition-all duration-200 ${
        isActive
          ? 'bg-frost-cyan/10 text-frost-cyan shadow-[inset_0_0_10px_rgba(15,247,255,0.1)] border border-frost-cyan/20'
          : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'
      }`}
    >
      <div className="mr-3 opacity-70">
        {channel.type === 'text' ? <Hash size={18} /> : <Volume2 size={18} />}
      </div>
      <span className={`font-medium truncate text-sm ${isActive ? 'font-bold' : ''}`}>{channel.name}</span>
      
      {channel.type === 'voice' && isActive && (
         <div className="ml-auto flex gap-0.5 items-end h-3">
            <div className="w-0.5 bg-frost-cyan animate-[pulse_0.5s_ease-in-out_infinite] h-2"></div>
            <div className="w-0.5 bg-frost-cyan animate-[pulse_0.8s_ease-in-out_infinite] h-3"></div>
            <div className="w-0.5 bg-frost-cyan animate-[pulse_0.6s_ease-in-out_infinite] h-1.5"></div>
         </div>
      )}

      {channel.unreadCount && channel.unreadCount > 0 && !isActive && (
        <div className="ml-auto w-2 h-2 rounded-full bg-white shadow-[0_0_5px_white]" />
      )}
    </div>
  );
};

export const ChannelList: React.FC<ChannelListProps> = ({ server, activeChannelId, onChannelSelect, currentUser }) => {
  if (!server) return null;

  const textChannels = server.channels.filter(c => c.type === 'text');
  const voiceChannels = server.channels.filter(c => c.type === 'voice');

  return (
    <div className="w-64 h-full glass-panel flex flex-col border-r border-white/5 relative z-40">
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
        <h2 className="font-tech font-bold text-lg tracking-wider text-white truncate max-w-[180px] shadow-sm">
          {server.name}
        </h2>
        <ChevronDown size={18} className="text-gray-400" />
      </div>

      <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        <div className="mb-6">
          <div className="flex items-center justify-between px-4 mb-2 group cursor-pointer">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-gray-300 transition-colors flex items-center gap-1">
              <ChevronDown size={10} /> Text Channels
            </span>
            <Plus size={12} className="text-gray-500 hover:text-white" />
          </div>
          {textChannels.map(c => (
            <ChannelItem
              key={c.id}
              channel={c}
              isActive={activeChannelId === c.id}
              onClick={() => onChannelSelect(c.id)}
            />
          ))}
        </div>

        <div className="mb-4">
           <div className="flex items-center justify-between px-4 mb-2 group cursor-pointer">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-gray-300 transition-colors flex items-center gap-1">
              <ChevronDown size={10} /> Voice Rooms
            </span>
            <Plus size={12} className="text-gray-500 hover:text-white" />
          </div>
          {voiceChannels.map(c => (
            <ChannelItem
              key={c.id}
              channel={c}
              isActive={activeChannelId === c.id}
              onClick={() => onChannelSelect(c.id)}
            />
          ))}
        </div>
      </div>

      <div className="bg-black/40 p-3 flex items-center gap-3 border-t border-white/5 backdrop-blur-md">
        <div className="relative group cursor-pointer">
            <img src={currentUser.avatarUrl} alt="me" className="w-9 h-9 rounded-full border border-white/10" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0A0A0F] rounded-full"></div>
        </div>
        <div className="flex-1 overflow-hidden">
            <div className="text-sm font-bold text-white truncate">{currentUser.username}</div>
            <div className="text-[10px] text-gray-400 truncate">Online</div>
        </div>
        <div className="flex items-center">
            <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                <Mic size={16} />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                <Settings size={16} />
            </button>
        </div>
      </div>
    </div>
  );
};