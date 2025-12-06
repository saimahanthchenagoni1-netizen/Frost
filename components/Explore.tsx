import React from 'react';
import { Search, Music, Gamepad2, Code, Zap, LogIn, ArrowRight, Plus } from 'lucide-react';
import { Group } from '../types';

interface ExploreProps {
    groups: Group[];
    onJoinGroup: (id: string) => void;
    onGroupSelect: (id: string) => void;
    onCreateGroup: () => void;
}

export const Explore: React.FC<ExploreProps> = ({ groups, onJoinGroup, onGroupSelect, onCreateGroup }) => {
  const categories = [
    { name: 'Gaming', icon: <Gamepad2 size={20} />, color: 'text-purple-400' },
    { name: 'Music', icon: <Music size={20} />, color: 'text-pink-400' },
    { name: 'Tech', icon: <Code size={20} />, color: 'text-blue-400' },
    { name: 'General', icon: <Zap size={20} />, color: 'text-yellow-400' },
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 relative">
            {/* Create Button */}
            <button 
                onClick={onCreateGroup}
                className="absolute right-0 top-0 px-4 py-2 bg-frost-cyan/10 text-frost-cyan border border-frost-cyan/30 rounded-lg font-bold text-sm hover:bg-frost-cyan hover:text-black transition-all flex items-center gap-2"
            >
                <Plus size={16} /> Create Group
            </button>

          <h1 className="text-4xl font-tech font-bold text-white mb-4">Discover Communities</h1>
          <div className="relative max-w-lg mx-auto">
            <input 
              type="text" 
              placeholder="Search for groups..." 
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-frost-cyan focus:shadow-neon transition-all"
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-3 justify-center mb-12 flex-wrap">
          {categories.map(cat => (
            <button key={cat.name} className="flex items-center gap-2 px-6 py-2 rounded-full glass-panel hover:bg-white/10 hover:scale-105 transition-all">
              <span className={cat.color}>{cat.icon}</span>
              <span className="font-bold text-sm">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Featured Grid (All Groups in System) */}
        <h2 className="text-xl font-bold mb-6 text-frost-cyan">Active Groups</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {groups.map(group => (
             <div key={group.id} className="glass-card rounded-2xl overflow-hidden group cursor-pointer h-72 relative flex flex-col">
                {/* Banner */}
                <div className="h-28 bg-cover bg-center" style={{ backgroundImage: `url(${group.bannerUrl})` }} />
                
                {/* Content */}
                <div className="p-4 relative flex-1 flex flex-col">
                  <div className="absolute -top-10 left-4 w-16 h-16 rounded-xl border-4 border-[#0A0A0F] overflow-hidden bg-black">
                     <img src={group.iconUrl} className="w-full h-full object-cover" />
                  </div>
                  <div className="mt-6 mb-2">
                     <h3 className="font-bold text-lg group-hover:text-frost-cyan transition-colors truncate">{group.name}</h3>
                     <p className="text-gray-400 text-sm mt-1 line-clamp-2">A community for {group.name} enthusiasts.</p>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between">
                      <div className="text-xs font-mono text-gray-500 flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500" /> {group.membersOnline} Online
                      </div>
                      
                      {group.joined ? (
                          <button 
                            onClick={() => onGroupSelect(group.id)}
                            className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 flex items-center gap-2 transition-colors"
                          >
                             Open <ArrowRight size={14} />
                          </button>
                      ) : (
                          <button 
                            onClick={() => onJoinGroup(group.id)}
                            className="px-4 py-1.5 rounded-lg bg-frost-cyan text-black font-bold text-sm hover:shadow-[0_0_15px_#0FF7FF] transition-all flex items-center gap-2"
                          >
                              Join <LogIn size={14} />
                          </button>
                      )}
                  </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};