"use client"
import { useState, useEffect } from 'react'
import SharedLayout from '@/components/shared/SharedLayout'
import { FileText, Clock, CheckCircle, XCircle, Plus, X, Building2, DollarSign, TrendingUp } from 'lucide-react'

export default function DealRegistrationPage() {
  const [deals, setDeals] = useState<any[]>([])
  const [partners, setPartners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    value: '',
    status: 'Pending',
    partner: '',
    description: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [dealsRes, partnersRes] = await Promise.all([
        fetch('/api/deals'),
        fetch('/api/partners')
      ])
      
      const dealsData = await dealsRes.json()
      const partnersData = await partnersRes.json()
      
      setDeals(dealsData.results || [])
      setPartners(partnersData.results || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          value: parseFloat(formData.value) || 0,
          date: new Date().toISOString().split('T')[0]
        })
      })

      if (response.ok) {
        setShowModal(false)
        setFormData({
          name: '',
          company: '',
          value: '',
          status: 'Pending',
          partner: '',
          description: ''
        })
        loadData()
        alert('Deal registered successfully!')
      } else {
        alert('Error registering deal')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error registering deal')
    } finally {
      setSaving(false)
    }
  }

  const stats = [
    { label: 'Total Deals', value: deals.length, icon: FileText, color: 'from-blue-500 to-blue-600' },
    { label: 'Pending', value: deals.filter(d => d.status === 'Pending').length, icon: Clock, color: 'from-yellow-500 to-yellow-600' },
    { label: 'Approved', value: deals.filter(d => d.status === 'Approved').length, icon: CheckCircle, color: 'from-green-500 to-green-600' },
    { label: 'Rejected', value: deals.filter(d => d.status === 'Rejected').length, icon: XCircle, color: 'from-red-500 to-red-600' },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="text-green-500" size={20} />
      case 'Pending': return <Clock className="text-yellow-500" size={20} />
      case 'Rejected': return <XCircle className="text-red-500" size={20} />
      default: return <FileText className="text-gray-500" size={20} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700 border-green-200'
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <SharedLayout>
      <div className="p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Deal Registration
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Register and track your partnership deals</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <Plus size={24} />
            Register New Deal
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-4 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg`}>
                  <stat.icon size={28} className="text-white" />
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <h3 className="text-gray-600 font-semibold text-lg">{stat.label}</h3>
            </div>
          ))}
        </div>

        {/* Deals Table */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
            <p className="text-gray-600 mt-6 text-lg">Loading deals...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white">Registered Deals</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Deal Name</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Company</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Value</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Partner</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {deals.map((deal, index) => (
                    <tr 
                      key={deal.id}
                      className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(deal.status)}
                          <span className="font-semibold text-gray-900">{deal.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-gray-700">{deal.company}</td>
                      <td className="px-8 py-5">
                        <span className="font-bold text-green-600 text-lg">
                          ${deal.value?.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-indigo-600 font-medium">{deal.partner || 'N/A'}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(deal.status)}`}>
                          {deal.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-gray-600">
                        {new Date(deal.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {deals.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-8 py-16 text-center">
                        <FileText size={64} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg mb-4">No deals registered yet</p>
                        <button
                          onClick={() => setShowModal(true)}
                          className="text-purple-600 hover:text-purple-700 font-bold text-lg"
                        >
                          Register your first deal →
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Register Deal Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-8 transform animate-slideUp">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                    Register New Deal
                  </h2>
                  <p className="text-gray-500 mt-2 text-lg">Fill in the deal information</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 hover:rotate-90 transition-all duration-300"
                >
                  <X size={32} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Deal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all text-lg"
                      placeholder="Enterprise Software License"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all text-lg"
                      placeholder="Acme Corporation"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Deal Value ($) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.value}
                      onChange={(e) => setFormData({...formData, value: e.target.value})}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all text-lg"
                      placeholder="50000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Assign to Partner
                    </label>
                    <select
                      value={formData.partner}
                      onChange={(e) => setFormData({...formData, partner: e.target.value})}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all text-lg"
                    >
                      <option value="">Select Partner</option>
                      {partners.map(partner => (
                        <option key={partner.id} value={partner.name}>{partner.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all text-lg"
                    >
                      <option value="Pending">⏳ Pending</option>
                      <option value="Approved">✅ Approved</option>
                      <option value="Rejected">❌ Rejected</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Deal Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all text-lg"
                      placeholder="Provide additional details about this deal..."
                      rows={4}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-8 py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-bold text-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 transform hover:scale-105"
                  >
                    {saving ? '✨ Registering...' : '🚀 Register Deal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </SharedLayout>
  )
}
