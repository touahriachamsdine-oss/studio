
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Shield, Users, FileCheck2, Bell, BarChart3, Download, LayoutDashboard } from 'lucide-react';
import type { Dictionary } from '@/lib/dictionary';
import type { Locale } from '@/i18n-config';
import Image from 'next/image';

interface AdminSidebarProps {
  dictionary: Dictionary['admin'] & Pick<Dictionary, 'appName' | 'dashboard'>;
  locale: Locale;
}

export default function AdminSidebar({ dictionary, locale }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: `/${locale}/admin`, label: dictionary.dashboard, icon: LayoutDashboard },
    { href: `/${locale}/admin/approvals`, label: dictionary.approveRejectProfessionals, icon: FileCheck2 },
    { href: `/${locale}/admin/users`, label: dictionary.viewUserActivity, icon: Users },
    { href: `/${locale}/admin/subscriptions`, label: dictionary.editSubscriptions, icon: Shield },
    { href: `/${locale}/admin/notifications`, label: dictionary.sendNotifications, icon: Bell },
    { href: `/${locale}/admin/export`, label: dictionary.exportData, icon: Download },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-center">
          <Image
            src="https://i.ibb.co/Nd6gPzC8/Whats-App-Image-2025-06-30-at-1-36-22-PM-removebg-preview.png"
            alt="thiq bi logo"
            width={120}
            height={40}
            className="h-9 w-auto object-contain transition-all group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8"
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label, side: 'right' }}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
