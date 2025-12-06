export interface User {
  id: string;
  username: string;
  discriminator: string;
  avatarUrl: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  customStatus?: string;
  color?: string;
  memberSince?: string;
}

export interface Message {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'system' | 'voice' | 'file';
  fileSize?: number;
  fileName?: string;
  attachments?: string[];
  reactions?: Record<string, number>;
}

export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  unreadCount?: number;
}

export interface Group {
  id: string;
  name: string;
  iconUrl: string;
  bannerUrl?: string;
  channels: Channel[];
  membersOnline?: number;
  isOwner?: boolean;
  joined?: boolean; // Track if current user is in this group
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'custom';
  customColors: {
    background: string;
    text: string;
    primary: string; // Button color
  };
  enableSnow: boolean;
  customCursor: boolean;
}

export type ViewType = 'auth' | 'dashboard' | 'explore' | 'profile' | 'group' | 'dm' | 'settings';

export interface AppState {
  currentView: ViewType;
  activeGroupId: string | null;
  activeChannelId: string | null;
  activeDmUserId: string | null; // For friend DMs
  user: User | null;
  isAuthenticated: boolean;
  settings: AppSettings;
}