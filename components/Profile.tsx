import React, { useState } from 'react';
import { Edit2, Zap, Save, Calendar } from 'lucide-react';
import { User } from '../types';

interface ProfileProps {
  user: User | null;
  onUpdateUser: (updatedUser: Partial<User>) => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [statusInput, setStatusInput] = useState(user?.customStatus || '');

  if (!user) return null;

  const handleSaveStatus = () => {
    onUpdateUser({ customStatus: statusInput });
    setIsEditingStatus(false);
  };

  return (
    <div className="flex-1 h-full flex items-center justify-center p-6 relative overflow-hidden">
        {/* Content */}
        <div className="glass-card w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col">
            
            {/* 1. Banner (Top) */}
            <div className="h-48 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 relative w-full">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <button className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-white/20 transition-colors text-white">
                    <Edit2 size={16} />
                </button>
                
                {/* 2. Avatar (Overlay on Banner) */}
                <div className="absolute -bottom-16 left-8">
                     <div className="w-32 h-32 rounded-full p-1 bg-[#0A0A0F] relative group">
                        <img src={user.avatarUrl} className="w-full h-full rounded-full object-cover border-4 border-[#0A0A0F] group-hover:scale-105 transition-transform" />
                        <div className={`absolute bottom-2 right-2 w-6 h-6 border-4 border-[#0A0A0F] rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`} />
                     </div>
                </div>
            </div>

            {/* 3. User Info (Below Banner) */}
            <div className="px-8 pb-8 pt-20"> {/* pt-20 to clear the avatar overlap */}
                
                {/* Username Section */}
                <div className="flex flex-col mb-6">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        {user.username} 
                    </h1>
                    <p className="text-gray-400 font-mono text-sm">#{user.discriminator}</p>
                </div>

                {/* Status / What I'm Doing */}
                <div className="mb-6">
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Current Status</h3>
                    {isEditingStatus ? (
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={statusInput}
                                onChange={(e) => setStatusInput(e.target.value)}
                                className="flex-1 bg-black/30 border border-frost-cyan/50 rounded-lg px-3 py-2 text-white focus:outline-none"
                                placeholder="What are you doing?"
                            />
                            <button onClick={handleSaveStatus} className="p-2 bg-frost-cyan text-black rounded-lg">
                                <Save size={18} />
                            </button>
                        </div>
                    ) : (
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group cursor-pointer" onClick={() => setIsEditingStatus(true)}>
                             <div className="flex items-center gap-3">
                                <Zap className="text-yellow-400" size={20} />
                                <p className="text-gray-200 italic">"{user.customStatus || "Just chilling..."}"</p>
                             </div>
                             <Edit2 size={14} className="text-gray-600 group-hover:text-white transition-colors" />
                        </div>
                    )}
                </div>

                {/* Member Since (Accurate) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                        <div className="p-2 bg-white/5 rounded-lg text-frost-cyan">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase">Member Since</h3>
                            <p className="font-mono text-white text-sm">{user.memberSince || 'Oct 24, 2023'}</p>
                        </div>
                    </div>
                </div>

                {/* Note: Global Profile Roles are hidden as per requirements */}
            </div>
        </div>
    </div>
  );
};