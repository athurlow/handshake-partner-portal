"use client"
import { useState, useEffect } from 'react'
import SharedLayout from '@/components/shared/SharedLayout'
import { TrendingUp, DollarSign, Users, Award, Target, BarChart3, PieChart, Activity } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function AnalyticsPage() {
  const [partners, setPartners] = useState<any[]>([])
  const [deals, setDeals] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [partnersRes, dealsRes, leadsRes] = await Promise.all([
        fetch('/api/partners'),
        fetch('/api/deals'),
        fetch('/api/leads')
      ])
      
      const partnersData = await partnersRes.json()
      const dealsData = await dealsRes.json()
      const leadsData = await leadsRes.json()
      
      setPartners(partnersData.results || [])
      setDeals(dealsData.results || [])
      setLeads(leadsData.results || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate metrics from real data
  const totalRevenue = partners.reduce((sum, p) => sum + (p.revenue || 0), 0)
  const totalDeals = deals.length
  const approvedDeals = deals.filter(d => d.status === 'Approved').length
  const pendingDeals = deals.filter(d => d.status === 'Pending').length
  const totalLeads = leads.length
  const qualifiedLeads = leads.filter(l => l.status === 'Qualified').length
  const conversionRate = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0
  const avgDealValue = totalDeals > 0 ? Math.round(deals.reduce((sum, d) => sum + (d.value || 0), 0) / totalDeals) : 0

  // Partner revenue distribution
  const partnerRevenueData = partners
    .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
    .slice(0, 5)
    .map(p => ({
      name: p.name,
      revenue: p.revenue || 0
    }))

  // Deal status distribution
  const dealStatusData = [
    { name: 'Approved', value: approvedDeals, color: '#10b981' },
    { name: 'Pending', value: pendingDeals, color: '#f59e0b' },
    { name: 'Rejected', value: deals.filter(d => d.status === 'Rejected').length, color: '#ef4444' }
  ].filter(d => d.value > 0)

  // Lead status distribution
  const leadStatusData = [
    { name: 'New', value: leads.filter(l => l.status === 'New').length, color: '#3b82f6' },
    { name: 'Contacted', value: leads.filter(l => l.status === 'Contacted').length, color: '#f59e0b' },
    { name: 'Qualified', value: qualifiedLeads, color: '#10b981' },
    { name: 'Converted', value: leads.filter(l => l.status === 'Converted').length, color: '#8b5cf6' }
  ].filter(d => d.value > 0)

  // Partner tier distribution
  const tierData = [
    { name: 'Platinum', value: partners.filter(p => p.tier === 'Platinum').length, color: '#a855f7' },
    { name: 'Gold', value: partners.filter(p => p.tier === 'Gold').length, color: '#f59e0b' },
    { name: 'Silver', value: partners.filter(p => p.tier === 'Silver').length, color: '#9ca3af' },
    { name: 'Bronze', value: partners.filter(p => p.tier === 'Bronze').length, color: '#ea580c' }
  ].filter(d => d.value > 0)

  // Monthly trend data (simulated - you could calculate from actual dates)
  const monthlyData = [
    { month: 'Jan', revenue: totalRevenue * 0.15, deals: Math.round(totalDeals * 0.15), leads: Math.round(totalLeads * 0.15) },
    { month: 'Feb', revenue: totalRevenue * 0.18, deals: Math.round(totalDeals * 0.18), leads: Math.round(totalLeads * 0.18) },
    { month: 'Mar', revenue: totalRevenue * 0.22, deals: Math.round(totalDeals * 0.22), leads: Math.round(totalLeads * 0.22) },
    { month: 'Apr', revenue: totalRevenue * 0.20, deals: Math.round(totalDeals * 0.20), leads: Math.round(totalLeads * 0.20) },
    { month: 'May', revenue: totalRevenue * 0.25, deals: Math.round(totalDeals * 0.25), leads: Math.round(totalLeads * 0.25) }
  ]

  const stats = [
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: '+28%',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50'
    },
    {
      label: 'Active Partners',
      value: partners.length,
      change: '+12%',
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50'
    },
    {
      label: 'Total Deals',
      value: totalDeals,
      change: `${approvedDeals} approved`,
      icon: Award,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'from-purple-50 to-pink-50'
    },
    {
      label: 'Conversion Rate',
      value: `${conversionRate}%`,
      change: `${qualifiedLeads}/${totalLeads} leads`,
      icon: Target,
      color: 'from-orange-500 to-red-600',
      bgColor: 'from-orange-50 to-red-50'
    }
  ]

  return (
    <SharedLayout>
      <div className="p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Real-time insights and performance metrics</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
            <p className="text-gray-600 mt-6 text-lg">Loading analytics...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`bg-gradient-to-br ${stat.bgColor} rounded-3xl shadow-xl border border-white p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-4 bg-gradient-to-br ${stat.color} rounded-2xl shadow-lg`}>
                      <stat.icon size={32} className="text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                  <h3 className="text-gray-700 font-bold text-lg mb-1">{stat.label}</h3>
                  <p className="text-sm text-green-600 font-semibold">{stat.change}</p>
                </div>
              ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Revenue by Partner */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                    <BarChart3 size={24} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Revenue by Partner</h2>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={partnerRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '2px solid #e5e7eb', 
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[8, 8, 0, 0]} />
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly Trends */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                    <Activity size={24} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Monthly Trends</h2>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '2px solid #e5e7eb', 
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6 }} />
                    <Line type="monotone" dataKey="deals" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 6 }} />
                    <Line type="monotone" dataKey="leads" stroke="#ec4899" strokeWidth={3} dot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* Deal Status */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                    <PieChart size={24} className="text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Deal Status</h2>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <RePieChart>
                    <Pie
                      data={dealStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dealStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
              </div>

              {/* Lead Status */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                    <PieChart size={24} className="text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Lead Status</h2>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <RePieChart>
                    <Pie
                      data={leadStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {leadStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
              </div>

              {/* Partner Tiers */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                    <Award size={24} className="text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Partner Tiers</h2>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <RePieChart>
                    <Pie
                      data={tierData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {tierData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl">
                  <TrendingUp size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Top Performing Partners</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {partners
                  .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
                  .slice(0, 3)
                  .map((partner, index) => (
                    <div
                      key={partner.id}
                      className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                          index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                          'bg-gradient-to-br from-orange-400 to-orange-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg">{partner.name}</h3>
                          <span className="text-sm text-gray-600">{partner.tier} Tier</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">Revenue</span>
                          <span className="font-bold text-green-600">${partner.revenue?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">Deals</span>
                          <span className="font-bold text-indigo-600">{partner.deals}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">Growth</span>
                          <span className="font-bold text-purple-600">+{partner.growth}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </SharedLayout>
  )
}
