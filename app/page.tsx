"use client"
import { useState, useEffect } from 'react'
import SharedLayout from '@/components/shared/SharedLayout'
import { TrendingUp, Users, Award, DollarSign, RefreshCw, Sparkles, AlertCircle } from 'lucide-react'

export default function DashboardPage() {
  const [partners, setPartners] = useState<any[]>([])
  const [deals, setDeals] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [showSyncModal, setShowSyncModal] = useState(false)
  const [hubspotKey, setHubspotKey] = useState('')
  const [syncResult, setSyncResult] = useState<any>(null)

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

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault()
    setSyncing(true)
    setSyncResult(null)

    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hubspotApiKey: hubspotKey })
      })

      const data = await response.json()

      if (response.ok) {
        setSyncResult(data)
        loadData() // Refresh dashboard data
        setTimeout(() => {
          setShowSyncModal(false)
          setHubspotKey('')
        }, 3000)
      } else {
        setSyncResult({ error: data.error })
      }
    } catch (error: any) {
      setSyncResult({ error: error.message })
    } finally {
      setSyncing(false)
    }
  }

  const totalRevenue = partners.reduce((sum, p) => sum + (p.revenue || 0), 0)

  return (
    <SharedLayout>
      <div className="p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 flex items-center gap-3">
              <Sparkles size={48} className="text-purple-600" />
              Welcome to Handshake
            </h1>
            <p className="text-gray-600 text-lg">Your Partner Management Command Center</p>
          </div>
          
          <button
            onClick={() => setShowSyncModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
          >
            <RefreshCw size={20} />
            Sync from HubSpot
          </button>
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
                <p className="text-5xl font-bold">{partners.length}</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl shadow-2xl p-6 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                    <DollarSign size={32} />
                  </div>
                </div>
                <h3 className="text-white text-opacity-90 text-sm font-semibold mb-2">Total Revenue</h3>
                <p className="text-5xl font-bold">${(totalRevenue / 1000).toFixed(0)}K</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl shadow-2xl p-6 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                    <Award size={32} />
                  </div>
                </div>
                <h3 className="text-white text-opacity-90 text-sm font-semibold mb-2">Active Deals</h3>
                <p className="text-5xl font-bold">{deals.length}</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl shadow-2xl p-6 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                    <TrendingUp size={32} />
                  </div>
                </div>
                <h3 className="text-white text-opacity-90 text-sm font-semibold mb-2">Total Leads</h3>
                <p className="text-5xl font-bold">{leads.length}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
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

              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Award className="text-purple-600" />
                  Recent Deals
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
          </>
        )}

        {/* Sync Modal */}
        {showSyncModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <RefreshCw size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Sync from HubSpot</h2>
                  <p className="text-sm text-gray-600">Pull latest data from your CRM</p>
                </div>
              </div>

              {!syncResult ? (
                <form onSubmit={handleSync} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      HubSpot API Key
                    </label>
                    <input
                      type="password"
                      required
                      value={hubspotKey}
                      onChange={(e) => setHubspotKey(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Your HubSpot API key"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowSyncModal(false)}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={syncing}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {syncing ? (
                        <>
                          <RefreshCw className="animate-spin" size={20} />
                          Syncing...
                        </>
                      ) : (
                        'Sync Now'
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  {syncResult.error ? (
                    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                      <div className="flex gap-3">
                        <AlertCircle className="text-red-600" size={20} />
                        <div>
                          <p className="font-bold text-red-900">Error</p>
                          <p className="text-sm text-red-700">{syncResult.error}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-green-50 border-2 border-green-200 rounded-xl">
                      <p className="font-bold text-green-900 text-lg mb-2">Success!</p>
                      <p className="text-sm text-green-700">
                        Synced {syncResult.synced?.total || 0} items from HubSpot
                      </p>
                      <div className="mt-4 space-y-1 text-sm">
                        <p>Partners: {syncResult.synced?.partners || 0}</p>
                        <p>Deals: {syncResult.synced?.deals || 0}</p>
                        <p>Leads: {syncResult.synced?.leads || 0}</p>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => setShowSyncModal(false)}
                    className="w-full mt-4 px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 font-bold"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </SharedLayout>
  )
}
