"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, Users, ClipboardCheck, BarChart3, Settings, TrendingUp, Bell, RefreshCw } from 'lucide-react';

interface SharedLayoutProps {
  children: React.ReactNode;
}

export default function SharedLayout({ children }: SharedLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname === '/PartnerPortal' || pathname === '/') return 'dashboard';
    if (pathname.includes('/partners')) return 'partners';
    if (pathname.includes('/deals/registration')) return 'registration';
    if (pathname.includes('/leads/distribution')) return 'distribution';
    if (pathname.includes('/analytics')) return 'analytics';
    if (pathname.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/Home' },
    { id: 'partners', icon: Users, label: 'Partners', path: '/partners' },
    { id: 'registration', icon: ClipboardCheck, label: 'Deal Registration', path: '/deal-registration' },
    { id: 'distribution', icon: TrendingUp, label: 'Lead Distribution', path: '/lead-distribution' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const getPageTitle = () => {
    return navItems.find(item => item.id === activeTab)?.label || 'Partner Portal';
  };

  const getPageDescription = () => {
    switch (activeTab) {
      case 'dashboard':
        return "Welcome back! Here's your partner overview";
      case 'partners':
        return "Manage your partner network";
      case 'registration':
        return "Register and manage partner deals";
      case 'distribution':
        return "Manage and optimize lead assignments";
      case 'analytics':
        return "Comprehensive insights into partner performance";
      case 'settings':
        return "Configure your portal settings";
      default:
        return "Manage your data";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white shadow-xl">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight">Partner Portal</h1>
          <p className="text-indigo-200 text-sm mt-1">HubSpot Connected</p>
        </div>
        
        <nav className="mt-6 px-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-white text-indigo-900 shadow-lg'
                  : 'text-indigo-100 hover:bg-indigo-700'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {getPageTitle()}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {getPageDescription()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                <RefreshCw size={16} />
                <span>Last sync: 5 minutes ago</span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
}
