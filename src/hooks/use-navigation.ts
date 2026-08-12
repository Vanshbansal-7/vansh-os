'use client';

import React from 'react';
import {
  Home,
  Target,
  Briefcase,
  Heart,
  FolderGit2,
  Building2,
  FileText,
  BarChart3,
  Calendar,
  Layers,
  Settings,
  LucideIcon,
} from 'lucide-react';
import { NAVIGATION_CONFIG, NavigationItemConfig } from '@/config/navigation';

const ICON_MAP: Record<NavigationItemConfig['iconName'], LucideIcon> = {
  Home,
  Target,
  Briefcase,
  Heart,
  FolderGit2,
  Building2,
  FileText,
  BarChart3,
  Calendar,
  Layers,
  Settings,
};

export interface ResolvedNavigationItem extends NavigationItemConfig {
  icon: LucideIcon;
}

export function useNavigation() {
  const items: ResolvedNavigationItem[] = React.useMemo(() => {
    return NAVIGATION_CONFIG.filter((item) => item.enabled)
      .sort((a, b) => a.order - b.order)
      .map((item) => ({
        ...item,
        icon: ICON_MAP[item.iconName] || Home,
      }));
  }, []);

  return { items };
}
