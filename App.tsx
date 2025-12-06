import React, { useState, useEffect } from 'react';
import { RightSidebar } from './components/RightSidebar';
import { ChannelList } from './components/ChannelList';
import { ChatArea } from './components/ChatArea';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { Explore } from './components/Explore';
import { Profile } from './components/Profile';
import { Settings } from './components/Settings';
import { INITIAL_GROUPS, MOCK_USERS } from './constants';
import { AppState, ViewType, Group, Channel, AppSettings, User } from './types';
import { Plus } from 'lucide-react';

// Initialize joined state for mocks
const PREPARED_GROUPS = INITIAL_GROUPS.map(g => ({ ...g, joined: g.id === 'group-1' }));

const DEFAULT_SETTINGS: AppSettings = {
    theme: 'dark',
    customColors: { background: '#0A0A0F', text: '#ffffff', primary: '#0FF7FF' },
    enableSnow: true,
    customCursor: false
};

const SnowEffect = () => (
    <div className="fixed inset-0 pointer-events-none z-[1]" aria-hidden="true">
        {Array.from({ length: 50 }).map((_, i) => (
            <div 
                key={i}
                className="absolute bg-white rounded-full opacity-30 animate-[fall_linear_infinite]"
                style={{
                    width: Math.random() * 3 + 'px',
                    height: Math.random() * 3 + 'px',
                    left: Math.random() * 100 + 'vw',
                    top: -10 + 'px',
                    animationDuration: Math.random() * 5 + 5 + 's',
                    animationDelay: Math.random() * 5 + 's'
                }}
            />
        ))}
        <style>{`
            @keyframes fall {
                to { transform: translateY(110vh); }
            }
        `}</style>
    </div>
);

const CustomCursor = () => {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', move);
        return () => window.removeEventListener('mousemove', move);
    }, []);
    return (
        <div 
            className="fixed w-6 h-6 border-2 border-frost-cyan rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
            style={{ left: pos.x, top: pos.y }}
        >
            <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>
    );
};

export default function App() {
  // Synchronous State Initialization (Runs once on load)
  const [appState, setAppState] = useState<AppState>(() => {
      // 1. Try to load user
      const storedUserJSON = localStorage.getItem('frost_current_user');
      const storedUser = storedUserJSON ? JSON.parse(storedUserJSON) : null;
      
      // 2. Try to load settings
      const storedSettingsJSON = localStorage.getItem('frost_settings');
      const storedSettings = storedSettingsJSON ? JSON.parse(storedSettingsJSON) : DEFAULT_SETTINGS;

      // 3. Return initial state
      return {
        currentView: storedUser ? 'dashboard' : 'auth',
        activeGroupId: null,
        activeChannelId: null,
        activeDmUserId: null,
        user: storedUser,
        isAuthenticated: !!storedUser,
        settings: storedSettings
      };
  });

  const [groups, setGroups] = useState<Group[]>(PREPARED_GROUPS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  // Save Settings when changed
  const handleSettingsUpdate = (newSettings: AppSettings) => {
      setAppState(prev => ({ ...prev, settings: newSettings }));
      localStorage.setItem('frost_settings', JSON.stringify(newSettings));
  };

  const handleUpdateUser = (updated: Partial<User>) => {
      if (!appState.user) return;
      const newUser = { ...appState.user, ...updated };
      setAppState(prev => ({ ...prev, user: newUser }));
      localStorage.setItem('frost_current_user', JSON.stringify(newUser));
  };

  // --- Auth Handlers ---
  const handleLogin = (user: User) => {
      setAppState(prev => ({
          ...prev,
          isAuthenticated: true,
          user: user,
          currentView: 'dashboard'
      }));
      localStorage.setItem('frost_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
      localStorage.removeItem('frost_current_user');
      setAppState(prev => ({ ...prev, isAuthenticated: false, user: null, currentView: 'auth' }));
  };

  // --- Nav Handlers ---
  const handleNavigate = (view: ViewType) => {
    setAppState(prev => ({
      ...prev,
      currentView: view,
      activeGroupId: null // Deselect group when going to global tabs
    }));
  };

  // --- Group Handlers ---
  const handleGroupSelect = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      setAppState(prev => ({
        ...prev,
        currentView: 'group',
        activeGroupId: groupId,
        activeChannelId: group.channels[0].id,
      }));
    }
  };

  const handleCreateGroup = () => {
      if(!newGroupName.trim()) return;
      
      const newGroup: Group = {
          id: `group-${Date.now()}`,
          name: newGroupName,
          iconUrl: `https://picsum.photos/seed/${Date.now()}/100/100`,
          bannerUrl: `https://picsum.photos/seed/${Date.now() + 1}/800/200`,
          membersOnline: 1,
          isOwner: true,
          joined: true, // Auto-join
          channels: [
              { id: `c-${Date.now()}-1`, name: 'general', type: 'text' },
              { id: `c-${Date.now()}-2`, name: 'voice-chat', type: 'voice' },
          ]
      };
      setGroups(prev => [...prev, newGroup]);
      setNewGroupName('');
      setShowCreateModal(false);
      handleGroupSelect(newGroup.id); // Auto switch to new group
  };

  const handleJoinGroup = (groupId: string) => {
      setGroups(prev => prev.map(g => g.id === groupId ? { ...g, joined: true } : g));
      handleGroupSelect(groupId);
  };

  const handleChannelSelect = (channelId: string) => {
    setAppState(prev => ({ ...prev, activeChannelId: channelId }));
  };

  const handleFriendSelect = (userId: string) => {
      setAppState(prev => ({
          ...prev,
          currentView: 'dm',
          activeGroupId: null,
          activeDmUserId: userId
      }));
  };

  // Derived
  const activeGroup = groups.find(g => g.id === appState.activeGroupId) || null;
  const activeChannel = activeGroup 
    ? activeGroup.channels.find(c => c.id === appState.activeChannelId) 
    : undefined;
  
  const dmUser = appState.activeDmUserId ? MOCK_USERS[appState.activeDmUserId] : null;
  const dmChannel: Channel | undefined = dmUser ? {
      id: `dm-${dmUser.id}`,
      name: dmUser.username,
      type: 'text'
  } : undefined;

  // Custom Styles Construction
  const appStyle = appState.settings.theme === 'custom' ? {
      backgroundColor: appState.settings.customColors.background,
      color: appState.settings.customColors.text,
  } : (appState.settings.theme === 'light' ? {
      backgroundColor: '#f3f4f6',
      color: '#111827'
  } : {}); // Default is dark/tailwind classes

  const cursorClass = appState.settings.customCursor ? 'cursor-none' : '';

  // View Routing
  if (!appState.isAuthenticated) {
      return (
        <div style={appStyle} className={`min-h-screen ${cursorClass} text-white`}>
            {appState.settings.enableSnow && <SnowEffect />}
            {appState.settings.customCursor && <CustomCursor />}
            <LandingPage onLogin={handleLogin} />
        </div>
      );
  }

  return (
    <div style={appStyle} className={`flex w-full h-screen bg-frost-dark overflow-hidden font-sans text-white selection:bg-frost-cyan selection:text-black ${cursorClass} transition-colors duration-500`}>
      {appState.settings.enableSnow && <SnowEffect />}
      {appState.settings.customCursor && <CustomCursor />}

      {/* 1. Main Content Router (Left/Center) */}
      <div className="flex-1 flex overflow-hidden relative z-10">
          
          {appState.currentView === 'dashboard' && (
              <Dashboard onFriendSelect={handleFriendSelect} />
          )}

          {appState.currentView === 'explore' && (
              <Explore 
                  groups={groups} 
                  onJoinGroup={handleJoinGroup} 
                  onGroupSelect={handleGroupSelect}
                  onCreateGroup={() => setShowCreateModal(true)}
              />
          )}

          {appState.currentView === 'profile' && (
              <Profile user={appState.user} onUpdateUser={handleUpdateUser} />
          )}

          {appState.currentView === 'settings' && (
              <Settings settings={appState.settings} onSave={handleSettingsUpdate} onLogout={handleLogout} />
          )}

          {appState.currentView === 'group' && activeGroup && appState.user && (
              <>
                 <ChannelList 
                    server={activeGroup} 
                    activeChannelId={appState.activeChannelId}
                    onChannelSelect={handleChannelSelect}
                    currentUser={appState.user}
                 />
                 <ChatArea 
                    channel={activeChannel}
                    group={activeGroup}
                    currentUser={appState.user}
                    onBack={() => handleNavigate('dashboard')}
                 />
              </>
          )}
          
          {appState.currentView === 'dm' && dmChannel && appState.user && (
               <ChatArea 
                    channel={dmChannel}
                    group={null} // It's a DM
                    currentUser={appState.user}
                    onBack={() => handleNavigate('dashboard')}
               />
          )}

          {/* Fallback */}
          {appState.currentView === 'group' && !activeGroup && (
               <div className="flex-1 flex items-center justify-center text-gray-500">
                   Group not found.
               </div>
          )}
      </div>

      {/* 2. Group Sidebar (Right) - Holds Groups + Navigation */}
      <RightSidebar 
          onNavigate={handleNavigate}
          currentView={appState.currentView === 'group' ? 'dashboard' : appState.currentView}
      />

      {/* Create Group Modal */}
      {showCreateModal && (
            <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
                <div className="glass-panel w-full max-w-sm p-8 rounded-3xl border border-white/20 shadow-2xl relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-frost-cyan to-blue-500" />
                    <h3 className="text-2xl font-tech font-bold text-white mb-2">Create Community</h3>
                    <p className="text-gray-400 text-sm mb-6">Launch a new node in the network.</p>
                    
                    <form onSubmit={(e) => { e.preventDefault(); handleCreateGroup(); }}>
                        <div className="space-y-1 mb-6">
                            <label className="text-xs font-bold text-frost-cyan uppercase ml-1">Group Name</label>
                            <input 
                                autoFocus
                                type="text" 
                                placeholder="e.g. Neon Runners" 
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-frost-cyan focus:shadow-neon outline-none transition-all placeholder-gray-600"
                                value={newGroupName}
                                onChange={e => setNewGroupName(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button 
                                type="button"
                                onClick={() => setShowCreateModal(false)}
                                className="px-5 py-2.5 text-sm font-bold text-gray-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="px-6 py-2.5 text-sm bg-frost-cyan text-black font-bold rounded-xl hover:shadow-neon hover:scale-105 transition-all flex items-center gap-2"
                            >
                                <Plus size={16} strokeWidth={3} /> Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>
      )}

      {/* Global Texture Overlay */}
      <div className="pointer-events-none fixed inset-0 z-[100] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
    </div>
  );
}