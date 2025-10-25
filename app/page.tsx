"use client"
import { useState, useEffect } from 'react'
import SharedLayout from '@/components/shared/SharedLayout'
import { TrendingUp, Users, Award, DollarSign, ArrowRight, Sparkles } from 'lucide-react'

export default function DashboardPage() {
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

  const totalRevenue = partners.reduce((sum, p) => sum + (p.revenue || 0), 0)
  const totalPartners = partners.length
  const totalDeals = deals.length
  const totalLeads = leads.length

  return (
    <SharedLayout>
      <div className="p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 flex items-center gap-3">
            <Sparkles size={48} className="text-purple-600" />
            Welcome to Handshake
          </h1>
          <p className="text-gray-600 text-lg">Your Partner Management Command Center</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
            <p className="text-gray-600 mt-6 text-lg">Loading dashboard...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl p-6 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                    <Users size={32} />
                  </div>
                </div>
                <h3 className="text-white text-opacity-90 text-sm font-semibold mb-2">Total Partners</h3>
                <p className="text-5xl font-bold">{totalPartners}</p>
                <p className="text-white text-opacity-75 text-sm mt-2">Active partnerships</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl shadow-2xl p-6 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                    <DollarSign size={32} />
                  </div>
                </div>
                <h3 className="text-white text-opacity-90 text-sm font-semibold mb-2">Total Revenue</h3>
                <p className="text-5xl font-bold">${(totalRevenue / 1000).toFixed(0)}K</p>
                <p className="text-white text-opacity-75 text-sm mt-2">From all partners</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl shadow-2xl p-6 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                    <Award size={32} />
                  </div>
                </div>
                <h3 className="text-white text-opacity-90 text-sm font-semibold mb-2">Active Deals</h3>
                <p className="text-5xl font-bold">{totalDeals}</p>
                <p className="text-white text-opacity-75 text-sm mt-2">In pipeline</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl shadow-2xl p-6 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                    <TrendingUp size={32} />
                  </div>
                </div>
                <h3 className="text-white text-opacity-90 text-sm font-semibold mb-2">Total Leads</h3>
                <p className="text-5xl font-bold">{totalLeads}</p>
                <p className="text-white text-opacity-75 text-sm mt-2">Being processed</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Users className="text-blue-600" />
                  Top Partners
                </h2>
                <div className="space-y-4">
                  {partners
                    .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
                    .slice(0, 3)
                    .map((partner, index) => (
                      <div key={partner.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                            index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                            index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                            'bg-gradient-to-br from-orange-400 to-orange-600'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{partner.name}</p>
                            <p className="text-sm text-gray-600">{partner.tier} Tier</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">${partner.revenue?.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">{partner.deals} deals</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Award className="text-purple-600" />
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {deals.slice(0, 3).map((deal) => (
                    <div key={deal.id} className="p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-gray-900">{deal.name}</p>
                          <p className="text-sm text-gray-600">{deal.company}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">${deal.value?.toLocaleString()}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            deal.status === 'Approved' ? 'bg-green-100 text-green-700' :
                            deal.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {deal.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Ready to grow your partnerships?</h2>
                  <p className="text-white text-opacity-90">Explore all features and manage your partner network</p>
                </div>
                <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg flex items-center gap-2">
                  Get Started
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </SharedLayout>
  )
}
