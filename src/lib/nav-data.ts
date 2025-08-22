
import { LayoutGrid, Calendar, Map, Route, Sparkles, Shield } from 'lucide-react';

export const topNavItems = [
  { href: '/', labelKey: 'home', icon: LayoutGrid },
  { href: '/calendar', labelKey: 'calendar', icon: Calendar },
  { href: '/map', labelKey: 'map', icon: Map },
  { href: '/guide', labelKey: 'touristGuide', icon: Route },
  { href: '/suggestions', labelKey: 'forYou', icon: Sparkles },
];

export const bottomNavItems = [
    { href: '/admin', labelKey: 'admin', icon: Shield },
];
