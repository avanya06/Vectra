export type DeviceType = 'mobile' | 'desktop' | 'tablet';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
export type Region = 'india' | 'us' | 'eu' | 'global';

export interface Rule {
  id: string;
  type: 'time' | 'device' | 'location' | 'performance';
  condition: string;
  action: 'boost' | 'hide' | 'pin';
  weight: number;
}

export interface LinkItem {
  id?: string;
  _id?: string;
  title: string;
  url: string;
  icon: string;
  basePriority: number;
  rules: Rule[];
  analytics?: {
    clicks: number;
    ctr: number;
  };
  score?: number; // Added by backend
  appliedRules?: string[]; // Added by backend
}

export interface UserContext {
  device: DeviceType;
  timeOfDay: TimeOfDay;
  region: Region;
}

export interface UserProfile {
  username: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  displayMode?: 'default' | 'text_only' | 'avatar_only';
}

export interface SmartHubResponse {
  profile?: UserProfile;
  links: LinkItem[];
  appliedRules: string[];
  context: UserContext;
}

