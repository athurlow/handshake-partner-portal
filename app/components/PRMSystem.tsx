"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, Users, ClipboardCheck, BarChart3, Settings, TrendingUp, Bell, RefreshCw } from 'lucide-react';
import PartnersTab from './partners/PartnersTab';
import type { DashboardStats, Partner, Notification } from '@/types';

export default function PartnerPortal() {
  const router = useRouter();
  const pathname = usePathname();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topPartners, setTopPartners] = useState<Partner[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Determine active tab from pathname
  const getActiveTab = () => {
    if (pathname === '/PartnerPortal') return 'dashboard';
    if (pathname.includes('/partners')) return 'partners';
    if (pathname.includes('/deals/registration')) return 'registration';
    if (pathname.includes('/leads/distribution')) return 'distribution';
    if (pathname.includes('/analytics')) return 'analytics';
    if (pathname.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardData();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, partnersRes, notificationsRes] = await Promise.all([
        fetch('/api/analytics/overview'),
        fetch('/api/partners/top'),
        fetch('/api/notifications'),
      ]);

      const statsData = await statsRes.json();
      const partnersData = await partnersRes.json();
      const notificationsData = await notificationsRes.json();

      setStats(statsData);
      setTopPartners(partnersData);
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/PartnerPortal' },
    { id: 'partners', icon: Users, label: 'Partners', path: '/partners' },
    { id: 'registration', icon: ClipboardCheck, label: 'Deal Registration', path: '/deals/registration' },
    { id: 'distribution', icon: TrendingUp, label: 'Lead Distribution', path: '/leads/distribution' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'partners':
        return <PartnersTab />;
      case 'dashboard':
        return renderDashboard();
      default:
        return (
          <div className="p-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
              <p className="text-gray-500">This section is under development</p>
            </div>
          </div>
        );
    }
  };

  const renderDashboard = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading dashboard...</div>
        </div>
      );
    }

    return (
      <div className="p-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Partners */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <Users size={24} className="text-indigo-600" />
              </div>
              <span className="flex items-center gap-1 text-green-600 text-sm font-semibold bg-green-50 px-3 py-1 rounded-full">
                <TrendingUp size={16} />
                {stats?.monthlyGrowth.partners}%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Partners</h3>
            <p className="text-3xl font-bold text-gray-900">{stats?.totalPartners}</p>
            <p className="text-xs text-gray-500 mt-2">+{stats?.monthlyGrowth.partners}% from last month</p>
          </div>

          {/* Pipeline Value */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-50 rounded-lg">
                <TrendingUp size={24} className="text-emerald-600" />
              </div>
              <span className="flex items-center gap-1 text-green-600 text-sm font-semibold bg-green-50 px-3 py-1 rounded-full">
                <TrendingUp size={16} />
                {stats?.monthlyGrowth.revenue}%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Pipeline Value</h3>
            <p className="text-3xl font-bold text-gray-900">${stats?.pipelineValue.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">+{stats?.monthlyGrowth.revenue}% from last month</p>
          </div>

          {/* Active Deals */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-50 rounded-lg">
                <ClipboardCheck size={24} className="text-amber-600" />
              </div>
              <span className="text-gray-700 text-sm font-semibold bg-gray-100 px-3 py-1 rounded-full">
                8 closing this month
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Active Deals</h3>
            <p className="text-3xl font-bold text-gray-900">{stats?.activeDeals}</p>
            <p className="text-xs text-gray-500 mt-2">8 deals closing this month</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {notifications.slice(0, 3).map((notification) => (
                <div key={notification.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg mt-1">
                      <Bell size={16} className="text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 text-sm font-medium">{notification.text}</p>
                      <p className="text-gray-500 text-xs mt-1">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Partners */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">Top Performing Partners</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {topPartners.map((partner, index) => (
                <div key={partner.name} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                        index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                        'bg-gradient-to-br from-orange-300 to-orange-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{partner.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            partner.tier === 'Platinum' ? 'bg-purple-100 text-purple-700' :
                            partner.tier === 'Gold' ? 'bg-amber-100 text-amber-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {partner.tier}
                          </span>
                          <span className="text-xs text-gray-500">{partner.deals} deals</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${partner.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* HubSpot Sync Status */}
        <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-semibold text-gray-900">HubSpot Sync</p>
                <p className="text-sm text-gray-600">Connected • Last sync: 5 minutes ago</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors shadow-sm">
              Sync Now
            </button>
          </div>
        </div>
      </div>
    );
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
                {navItems.find(item => item.id === activeTab)?.label}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {activeTab === 'dashboard' ? "Welcome back! Here's your partner overview" : 
                 activeTab === 'partners' ? "Manage your partner network" :
                 "Manage your data"}
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

        {/* Content */}
        {renderContent()}
      </main>
    </div>
  );
}
