import React from 'react';
import { ViewType } from '../types';
import { Compass, User, Settings } from 'lucide-react';

interface RightSidebarProps {
  onNavigate: (view: ViewType) => void;
  currentView: ViewType;
}

const NavIcon: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ active, onClick, icon, label }) => {
  return (
    <div className="relative group flex items-center justify-center w-full mb-4 cursor-pointer" onClick={onClick}>
      <div
        className={`absolute right-0 w-1 bg-frost-cyan rounded-l-lg transition-all duration-300 ${
          active ? 'h-8 shadow-[0_0_10px_#0FF7FF]' : 'h-0 group-hover:h-4'
        }`}
      />

      <div
        className={`w-10 h-10 rounded-xl transition-all duration-300 flex items-center justify-center relative ${
          active 
            ? 'text-frost-cyan bg-frost-cyan/10 shadow-[inset_0_0_10px_rgba(15,247,255,0.2)]' 
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
      >
        {icon}
      </div>
      
      <div className="absolute right-16 px-3 py-1 bg-black/80 border border-frost-border rounded-lg text-xs font-tech tracking-wider text-frost-cyan opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 backdrop-blur-md translate-x-2 group-hover:translate-x-0">
        {label}
      </div>
    </div>
  );
};

export const RightSidebar: React.FC<RightSidebarProps> = ({ onNavigate, currentView }) => {
  return (
    <div className="w-[72px] h-full flex flex-col items-center py-4 glass-panel border-l border-white/5 z-50 justify-between">
        
        {/* Top: Home / Dashboard */}
        <div className="mt-2 text-frost-cyan animate-pulse-glow" onClick={() => onNavigate('dashboard')}>
            <div className={`w-12 h-12 rounded-[24px] border-2 border-frost-cyan flex items-center justify-center font-tech font-bold text-xl shadow-neon cursor-pointer hover:rounded-[16px] transition-all ${currentView === 'dashboard' ? 'bg-frost-cyan/20' : ''}`}>
                F
            </div>
        </div>

        {/* Bottom: Navigation */}
        <div className="w-full flex flex-col items-center mb-2">
            <NavIcon 
                active={currentView === 'explore'} 
                onClick={() => onNavigate('explore')} 
                icon={<Compass size={22} />} 
                label="Explore" 
            />
             <NavIcon 
                active={currentView === 'profile'} 
                onClick={() => onNavigate('profile')} 
                icon={<User size={22} />} 
                label="Profile" 
            />
             <NavIcon 
                active={currentView === 'settings'} 
                onClick={() => onNavigate('settings')} 
                icon={<Settings size={22} />} 
                label="Settings" 
            />
        </div>
    </div>
  );
};