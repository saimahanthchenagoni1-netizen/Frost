import { Group, User, Message } from './types';

export const CURRENT_USER: User = {
  id: 'user-1',
  username: 'FrostByte',
  discriminator: '2025',
  avatarUrl: 'https://picsum.photos/id/64/200/200',
  status: 'online',
  color: '#0FF7FF',
  customStatus: 'Chilling in the mainframe',
  memberSince: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
};

export const DM_GROUP_ID = 'dm';

export const INITIAL_GROUPS: Group[] = [
  {
    id: 'group-1',
    name: 'CyberPunk Squad',
    iconUrl: 'https://picsum.photos/id/237/100/100',
    bannerUrl: 'https://picsum.photos/id/237/800/200',
    membersOnline: 12,
    isOwner: true,
    channels: [
      { id: 'c1-general', name: 'general', type: 'text', unreadCount: 0 },
      { id: 'c1-memes', name: 'memes', type: 'text', unreadCount: 3 },
      { id: 'c1-voice', name: 'Voice Lounge', type: 'voice' },
    ],
  },
  {
    id: 'group-2',
    name: 'React Devs',
    iconUrl: 'https://picsum.photos/id/119/100/100',
    bannerUrl: 'https://picsum.photos/id/119/800/200',
    membersOnline: 856,
    isOwner: false,
    channels: [
      { id: 'c2-general', name: 'general', type: 'text' },
      { id: 'c2-help', name: 'code-help', type: 'text' },
    ],
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    userId: 'frosty-ai',
    content: 'System online. I am Frosty AI. How can I assist you today?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    type: 'text',
  }
];

export const MOCK_USERS: Record<string, User> = {
  'frosty-ai': {
    id: 'frosty-ai',
    username: 'Frosty AI',
    discriminator: 'BOT',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Frosty',
    status: 'online',
    color: '#0FF7FF',
    memberSince: 'Jan 1, 2024',
  },
  // Hidden user to be found via search
  'ghost-user': {
    id: 'ghost-user',
    username: 'Ghost',
    discriminator: '0000',
    avatarUrl: 'https://picsum.photos/id/1/200/200',
    status: 'offline',
    memberSince: 'Dec 12, 2023',
  }
};