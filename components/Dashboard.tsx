import React, { useState } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../constants';
import { MessageSquare, Search, Phone, Video, UserPlus, CheckCircle, AlertCircle } from 'lucide-react';

interface DashboardProps {
  onFriendSelect: (userId: string) => void;
}

const FriendRow: React.FC<{ user: User; onClick: () => void }> = ({ user, onClick }) => (
    <div 
        onClick={onClick}
        className="glass-panel p-4 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer border border-transparent hover:border-frost-cyan/30"
    >
        <div className="flex items-center gap-4">
            <div className="relative">
                <div className="w-12 h-12 rounded-full p-[1px] bg-gradient-to-tr from-frost-cyan to-transparent">
                     <img src={user.avatarUrl} alt={user.username} className="w-full h-full rounded-full object-cover border-2 border-[#0A0A0F]" />
                </div>
                <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#0A0A0F] ${user.status === 'online' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-gray-500'}`} />
            </div>
            <div>
                <div className="text-base font-bold text-white group-hover:text-frost-cyan transition-colors flex items-center gap-2">
                    {user.username}
                    {user.id === 'frosty-ai' && <span className="text-[10px] bg-frost-cyan/20 text-frost-cyan px-1.5 py-0.5 rounded border border-frost-cyan/30">AI</span>}
                </div>
                <div className="text-xs text-gray-400 font-mono">
                    {user.status === 'online' ? 'Online' : user.status}
                </div>
            </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
            <button 
                onClick={(e) => { e.stopPropagation(); onClick(); }}
                className="p-3 rounded-xl bg-white/5 hover:bg-frost-cyan/20 text-gray-400 hover:text-frost-cyan transition-all" 
                title="Chat"
            >
                <MessageSquare size={18} />
            </button>
            <button 
                onClick={(e) => e.stopPropagation()} 
                className="p-3 rounded-xl bg-white/5 hover:bg-green-500/20 text-gray-400 hover:text-green-400 transition-all hidden md:block" 
                title="Call"
            >
                <Phone size={18} />
            </button>
            <button 
                onClick={(e) => e.stopPropagation()} 
                className="p-3 rounded-xl bg-white/5 hover:bg-pink-500/20 text-gray-400 hover:text-pink-400 transition-all hidden md:block" 
                title="Video"
            >
                <Video size={18} />
            </button>
        </div>
    </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ onFriendSelect }) => {
  const [friends, setFriends] = useState<User[]>([MOCK_USERS['frosty-ai']]);
  const [activeTab, setActiveTab] = useState<'all' | 'online' | 'pending'>('all');
  const [addFriendMode, setAddFriendMode] = useState(false);
  const [searchUsername, setSearchUsername] = useState('');
  const [addFriendStatus, setAddFriendStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const filteredFriends = friends.filter(f => {
      if (activeTab === 'online') return f.status === 'online';
      return true;
  });

  const handleAddFriend = (e: React.FormEvent) => {
      e.preventDefault();
      const targetUser = Object.values(MOCK_USERS).find(u => u.username.toLowerCase() === searchUsername.toLowerCase().trim());
      
      if (targetUser) {
          if (friends.some(f => f.id === targetUser.id)) {
             setAddFriendStatus('error'); // Already friends
             return;
          }
          setFriends(prev => [...prev, targetUser]);
          setAddFriendStatus('success');
          setSearchUsername('');
          setTimeout(() => {
              setAddFriendStatus('idle');
              setAddFriendMode(false);
          }, 1500);
      } else {
          setAddFriendStatus('error');
      }
  };

  return (
    <div className="flex-1 h-full flex flex-col relative overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-8 pb-32">
            
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-tech font-bold text-white mb-2">Friends</h1>
                <div className="flex gap-4 text-sm font-bold text-gray-500 border-b border-white/10 pb-4 items-center">
                    <button 
                        onClick={() => { setActiveTab('all'); setAddFriendMode(false); }}
                        className={`${activeTab === 'all' && !addFriendMode ? 'text-white border-b-2 border-frost-cyan pb-4 -mb-4.5' : 'hover:text-gray-300'} transition-colors`}
                    >
                        All Friends
                    </button>
                    <button 
                         onClick={() => { setActiveTab('online'); setAddFriendMode(false); }}
                        className={`${activeTab === 'online' && !addFriendMode ? 'text-white border-b-2 border-frost-cyan pb-4 -mb-4.5' : 'hover:text-gray-300'} transition-colors`}
                    >
                        Online
                    </button>
                    <button 
                         onClick={() => { setActiveTab('pending'); setAddFriendMode(false); }}
                        className={`${activeTab === 'pending' && !addFriendMode ? 'text-white border-b-2 border-frost-cyan pb-4 -mb-4.5' : 'hover:text-gray-300'} transition-colors`}
                    >
                        Pending
                    </button>
                    
                    <button 
                        onClick={() => setAddFriendMode(!addFriendMode)}
                        className={`ml-auto px-3 py-1 rounded bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500 hover:text-black transition-all flex items-center gap-2 ${addFriendMode ? 'bg-green-500 text-black' : ''}`}
                    >
                        <UserPlus size={16} /> Add Friend
                    </button>
                </div>
            </div>

            {/* Content */}
            {addFriendMode ? (
                <div className="max-w-xl mx-auto mt-10">
                    <h2 className="text-xl font-bold text-white mb-2">Add a Friend</h2>
                    <p className="text-gray-400 mb-6 text-sm">You can add friends with their username. Try 'Ghost'.</p>
                    <form onSubmit={handleAddFriend} className="relative">
                        <input 
                            autoFocus
                            type="text" 
                            placeholder="Enter username..." 
                            className={`w-full bg-black/30 border ${addFriendStatus === 'error' ? 'border-red-500' : (addFriendStatus === 'success' ? 'border-green-500' : 'border-white/20')} rounded-xl py-4 px-6 text-white focus:outline-none focus:border-frost-cyan transition-all`}
                            value={searchUsername}
                            onChange={(e) => { setSearchUsername(e.target.value); setAddFriendStatus('idle'); }}
                        />
                        <button 
                            type="submit"
                            className="absolute right-2 top-2 bottom-2 bg-white/10 hover:bg-white/20 text-white px-6 rounded-lg font-bold transition-all"
                        >
                            Send Request
                        </button>
                    </form>
                    {addFriendStatus === 'success' && (
                        <div className="mt-4 flex items-center gap-2 text-green-500 animate-pulse">
                            <CheckCircle size={20} /> Friend added successfully!
                        </div>
                    )}
                    {addFriendStatus === 'error' && (
                        <div className="mt-4 flex items-center gap-2 text-red-500 animate-pulse">
                            <AlertCircle size={20} /> User not found or already added.
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {filteredFriends.length === 0 ? (
                        <div className="text-center text-gray-500 mt-20">
                            <p>No one is online right now.</p>
                        </div>
                    ) : (
                        filteredFriends.map(user => (
                            <FriendRow 
                                key={user.id} 
                                user={user} 
                                onClick={() => onFriendSelect(user.id)} 
                            />
                        ))
                    )}
                </div>
            )}
        </div>

        {/* Floating Search Bar (Bottom) */}
        <div className="absolute bottom-8 left-0 right-0 px-8 flex justify-center z-20 pointer-events-none">
            <div className="w-full max-w-2xl pointer-events-auto">
                <div className="glass-panel rounded-full p-2 flex items-center shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-frost-cyan/20 backdrop-blur-2xl">
                    <div className="pl-4 pr-3 text-frost-cyan">
                        <Search size={24} />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="flex-1 bg-transparent border-none outline-none text-white px-2 py-3 text-lg placeholder-gray-500"
                    />
                    <div className="pr-2 flex gap-2">
                        <span className="px-3 py-1 rounded-lg bg-white/5 text-xs text-gray-500 font-mono border border-white/5 flex items-center">CTRL+K</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};