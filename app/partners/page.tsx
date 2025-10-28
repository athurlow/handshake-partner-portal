"use client"
import { useState, useEffect } from 'react'
import SharedLayout from '@/components/shared/SharedLayout'
import { Search, Plus, X, Building2, TrendingUp, DollarSign, Award, Trash2 } from 'lucide-react'

export default function PartnersPage() {
  const [partners, setPartners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    tier: 'Bronze',
    contact: '',
    company_name: '',
    phone: '',
    address: ''
  })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    loadPartners()
  }, [])

  const loadPartners = async () => {
    try {
      const response = await fetch('/api/partners')
      const data = await response.json()
      setPartners(data.results || [])
      setError('')
    } catch (error) {
      console.error('Error loading partners:', error)
      setError('Failed to load partners')
    } finally {
      setLoading(false)
    }
  }

  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          revenue: 0,
          deals: 0,
          status: 'Active',
          growth: 0
        })
      })

      if (response.ok) {
        setShowAddModal(false)
        setFormData({
          name: '',
          tier: 'Bronze',
          contact: '',
          company_name: '',
          phone: '',
          address: ''
        })
        loadPartners()
        alert('Partner added successfully!')
      } else {
        alert('Error adding partner')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error adding partner')
    } finally {
      setSaving(false)
    }
  }

  const handleDeletePartner = async (id: string) => {
    setDeleting(id)

    try {
      const response = await fetch(`/api/partners?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setDeleteConfirm(null)
        loadPartners()
        alert('Partner deleted successfully!')
      } else {
        alert('Error deleting partner')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error deleting partner')
    } finally {
      setDeleting(null)
    }
  }

  const filteredPartners = partners.filter(partner =>
    partner.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.contact?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum': return 'bg-gradient-to-br from-purple-500 to-purple-700'
      case 'Gold': return 'bg-gradient-to-br from-amber-400 to-amber-600'
      case 'Silver': return 'bg-gradient-to-br from-gray-300 to-gray-500'
      default: return 'bg-gradient-to-br from-orange-400 to-orange-600'
    }
  }

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'Platinum': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'Gold': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'Silver': return 'bg-gray-100 text-gray-700 border-gray-200'
      default: return 'bg-orange-100 text-orange-700 border-orange-200'
    }
  }

  return (
    <SharedLayout>
      
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">Partners</h1>
          <p className="text-gray-600 text-lg">Manage your partner network and relationships</p>
        </div>
<div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Partners
            </h1>
            <p className="text-gray-600 mt-2">Manage your partner network and grow together</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="group flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            Add Partner
          </button>
        </div>

        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search partners by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all"
            />
          </div>
        </div>

        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
            <p className="text-gray-600 mt-6 text-lg">Loading partners...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8">
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        )}

        {!loading && !error && filteredPartners.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
            <Building2 size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg mb-4">No partners found</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Add your first partner →
            </button>
          </div>
        )}

        {!loading && filteredPartners.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPartners.map((partner, index) => (
              <div
                key={partner.id}
                className="group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`h-2 ${getTierColor(partner.tier)}`}></div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {partner.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <span>✉️</span> {partner.contact}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 ${getTierBadge(partner.tier)} shadow-sm`}>
                        {partner.tier}
                      </div>
                      <button
                        onClick={() => setDeleteConfirm(partner.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete partner"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <DollarSign size={18} className="text-green-600" />
                        <span className="text-sm font-medium text-gray-700">Revenue</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">
                        ${partner.revenue?.toLocaleString() || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Award size={18} className="text-indigo-600" />
                        <span className="text-sm font-medium text-gray-700">Deals</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{partner.deals || 0}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={18} className="text-purple-600" />
                        <span className="text-sm font-medium text-gray-700">Growth</span>
                      </div>
                      <span className="text-lg font-bold text-green-600">+{partner.growth || 0}%</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <span className={`inline-flex items-center text-sm font-medium ${
                      partner.status === 'Active' ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      <span className={`w-2.5 h-2.5 rounded-full mr-2 ${
                        partner.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                      }`}></span>
                      {partner.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={32} className="text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Partner?</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this partner? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    disabled={deleting === deleteConfirm}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeletePartner(deleteConfirm)}
                    disabled={deleting === deleteConfirm}
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all disabled:opacity-50"
                  >
                    {deleting === deleteConfirm ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Partner Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 transform animate-slideUp">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Add New Partner
                  </h2>
                  <p className="text-gray-500 mt-1">Grow your partner network</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 hover:rotate-90 transition-all"
                >
                  <X size={28} />
                </button>
              </div>

              <form onSubmit={handleAddPartner} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Partner Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Acme Corporation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Partnership Tier
                  </label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({...formData, tier: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="Bronze">🥉 Bronze</option>
                    <option value="Silver">🥈 Silver</option>
                    <option value="Gold">🥇 Gold</option>
                    <option value="Platinum">💎 Platinum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="partner@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 transform hover:scale-105"
                  >
                    {saving ? '✨ Adding...' : '🚀 Add Partner'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
          </div>
    </SharedLayout>
  )
}
