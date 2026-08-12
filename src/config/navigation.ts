export interface NavigationItemConfig {
  id: string;
  title: string;
  route: string;
  iconName: 'Home' | 'Target' | 'Briefcase' | 'Heart' | 'FolderGit2' | 'Building2' | 'FileText' | 'BarChart3' | 'Calendar' | 'Layers' | 'Settings';
  order: number;
  permission: 'PUBLIC' | 'FOUNDER_ONLY' | 'AUTHENTICATED';
  enabled: boolean;
  badge?: string;
}

export const NAVIGATION_CONFIG: NavigationItemConfig[] = [
  {
    id: 'vijaypath',
    title: 'Vijaypath',
    route: '/',
    iconName: 'Home',
    order: 1,
    permission: 'AUTHENTICATED',
    enabled: true,
  },
  {
    id: 'companies',
    title: 'Companies',
    route: '/companies',
    iconName: 'Building2',
    order: 2,
    permission: 'AUTHENTICATED',
    enabled: true,
  },
  {
    id: 'documents',
    title: 'Documents',
    route: '/documents',
    iconName: 'FileText',
    order: 3,
    permission: 'AUTHENTICATED',
    enabled: true,
  },
  {
    id: 'analytics',
    title: 'Analytics',
    route: '/analytics',
    iconName: 'BarChart3',
    order: 4,
    permission: 'AUTHENTICATED',
    enabled: true,
  },
  {
    id: 'calendar',
    title: 'Calendar',
    route: '/calendar',
    iconName: 'Calendar',
    order: 5,
    permission: 'AUTHENTICATED',
    enabled: true,
  },
  {
    id: 'system',
    title: 'System',
    route: '/system',
    iconName: 'Settings',
    order: 6,
    permission: 'AUTHENTICATED',
    enabled: true,
  },
  // Disabled items (Removed from active Left Sidebar)
  {
    id: 'mission_center',
    title: 'Mission Center',
    route: '/mission',
    iconName: 'Target',
    order: 7,
    permission: 'AUTHENTICATED',
    enabled: false,
  },
  {
    id: 'career_navigator',
    title: 'Career Navigator',
    route: '/career',
    iconName: 'Briefcase',
    order: 8,
    permission: 'AUTHENTICATED',
    enabled: false,
  },
  {
    id: 'life_command',
    title: 'Life Command',
    route: '/life',
    iconName: 'Heart',
    order: 9,
    permission: 'AUTHENTICATED',
    enabled: false,
  },
  {
    id: 'projects_hub',
    title: 'Projects Hub',
    route: '/projects',
    iconName: 'FolderGit2',
    order: 10,
    permission: 'AUTHENTICATED',
    enabled: false,
  },
  {
    id: 'resources',
    title: 'Resources',
    route: '/resources',
    iconName: 'Layers',
    order: 11,
    permission: 'AUTHENTICATED',
    enabled: false,
  },
];
