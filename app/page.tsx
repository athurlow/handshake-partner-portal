"use client";

// import { useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { useAuth } from '@/contexts/AuthContext'
import SharedLayout from '@/components/shared/SharedLayout'
import { Users, TrendingUp, ClipboardCheck, Bell, DollarSign, Sparkles, Award, Zap, ArrowUp } from 'lucide-react'

export default function Home() {
  // AUTHENTICATION DISABLED FOR DEVELOPMENT
  // const { user, loading } = useAuth()
  // const router = useRouter()

  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push('/login')
  //   }
  // }, [user, loading, router])

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
  //         <p className="text-white font-bold">Loading...</p>
  //       </div>
  //     </div>
  //   )
  // }

  // if (!user) {
  //   return null
  // }

  const notifications = [
    { id: 1, text: 'New deal registered by TechCorp Solutions', time: '2 hours ago', type: 'success', icon: ClipboardCheck },
    { id: 2, text: 'Lead assigned to Global Systems Inc', time: '4 hours ago', type: 'info', icon: Users },
    { id: 3, text: 'Innovation Partners approved for Silver tier', time: '1 day ago', type: 'award', icon: Award },
  ]

  const topPartners = [
    { name: 'Global Systems Inc', revenue: 420000, deals: 8, tier: 'Platinum', growth: '+28%', rank: 1, color: 'from-yellow-400 to-orange-500' },
    { name: 'TechCorp Solutions', revenue: 285000, deals: 6, tier: 'Gold', growth: '+18%', rank: 2, color: 'from-gray-300 to-gray-500' },
    { name: 'Innovation Partners', revenue: 195000, deals: 5, tier: 'Silver', growth: '+15%', rank: 3, color: 'from-orange-400 to-red-500' },
  ]

  return (
    <SharedLayout>
      <div className="p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg animate-pulse">
              <Sparkles className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Welcome Back!
              </h1>
              <p className="text-gray-600 mt-1">Here's your partner performance overview</p>
            </div>
          </div>
        </div>

        {/* KPI Cards with Gradients and Animations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Partners */}
          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            
            <div className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-indigo-50 rounded-xl">
                  <Users size={28} className="text-indigo-600" />
                </div>
                <div className="flex items-center gap-1 px-3 py-1.5 bg-green-50 rounded-full">
                  <ArrowUp size={14} className="text-green-600" />
                  <span className="text-green-600 text-sm font-bold">12%</span>
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-2">Total Partners</h3>
              <p className="text-4xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                3
              </p>
              <p className="text-xs text-gray-500">+12% from last month</p>
              
              {/* Animated Progress Bar */}
              <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-pulse" style={{ width: '75%' }} />
              </div>
            </div>
          </div>

          {/* Pipeline Value */}
          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            
            <div className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-50 rounded-xl">
                  <DollarSign size={28} className="text-emerald-600" />
                </div>
                <div className="flex items-center gap-1 px-3 py-1.5 bg-green-50 rounded-full">
                  <ArrowUp size={14} className="text-green-600" />
                  <span className="text-green-600 text-sm font-bold">28%</span>
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-2">Pipeline Value</h3>
              <p className="text-4xl font-bold bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                $195K
              </p>
              <p className="text-xs text-gray-500">+28% from last month</p>
              
              {/* Animated Progress Bar */}
              <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full animate-pulse" style={{ width: '85%' }} />
              </div>
            </div>
          </div>

          {/* Active Deals */}
          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            
            <div className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-50 rounded-xl">
                  <ClipboardCheck size={28} className="text-amber-600" />
                </div>
                <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 rounded-full">
                  <Zap size={14} className="text-amber-600" />
                  <span className="text-amber-600 text-sm font-bold">8 closing</span>
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-2">Active Deals</h3>
              <p className="text-4xl font-bold bg-gradient-to-br from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
                2
              </p>
              <p className="text-xs text-gray-500">8 deals closing this month</p>
              
              {/* Animated Progress Bar */}
              <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Notifications - Flashy Style */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600">
              <div className="flex items-center gap-2">
                <Bell className="text-white" size={20} />
                <h3 className="text-lg font-bold text-white">Recent Activity</h3>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div key={notification.id} className="p-4 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 cursor-pointer group">
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300 ${
                      notification.type === 'success' ? 'bg-green-100' :
                      notification.type === 'info' ? 'bg-blue-100' :
                      'bg-purple-100'
                    }`}>
                      <notification.icon size={18} className={
                        notification.type === 'success' ? 'text-green-600' :
                        notification.type === 'info' ? 'text-blue-600' :
                        'text-purple-600'
                      } />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 text-sm font-medium group-hover:text-indigo-600 transition-colors">
                        {notification.text}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Partners - Premium Leaderboard */}
          <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-black/10">
              <div className="flex items-center gap-2">
                <Award className="text-yellow-300" size={24} />
                <h3 className="text-lg font-bold text-white">Top Performers</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {topPartners.map((partner, index) => (
                <div
                  key={partner.name}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-4 hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${partner.color} flex items-center justify-center text-white font-bold text-2xl shadow-xl`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white text-lg">{partner.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-sm ${
                          partner.tier === 'Platinum' ? 'bg-purple-400/30 text-purple-100' :
                          partner.tier === 'Gold' ? 'bg-amber-400/30 text-amber-100' :
                          'bg-gray-400/30 text-gray-100'
                        }`}>
                          {partner.tier}
                        </span>
                        <span className="text-white/70 text-xs">{partner.deals} deals</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <p className="font-bold text-white text-xl">${partner.revenue.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-green-400/20 rounded-full">
                      <TrendingUp size={14} className="text-green-300" />
                      <span className="text-green-300 font-bold text-sm">{partner.growth}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* HubSpot Sync Status - Enhanced */}
        <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">HubSpot Integration</p>
                <p className="text-sm text-gray-600">Connected • Last sync: 5 minutes ago</p>
              </div>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium">
              Sync Now
            </button>
          </div>
        </div>
      </div>
    </SharedLayout>
  )
}
