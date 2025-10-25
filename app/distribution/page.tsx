"use client"
import { useState, useEffect } from 'react'
import SharedLayout from '@/components/shared/SharedLayout'
import { Users, TrendingUp, Award, AlertCircle, ArrowRight, Clock, Plus, X } from 'lucide-react'

export default function LeadDistributionPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [partners, setPartners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    company: '',
    contact: '',
    email: '',
    phone: '',
    value: '',
    assigned_to: '',
    status: 'New',
    priority: 'Medium',
    notes: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [leadsRes, partnersRes] = await Promise.all([
        fetch('/api/leads'),
        fetch('/api/partners')
      ])
      
      const leadsData = await leadsRes.json()
      const partnersData = await partnersRes.json()
      
      setLeads(leadsData.results || [])
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
      const response = await fetch('/api/leads', {
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
          company: '',
          contact: '',
          email: '',
          phone: '',
          value: '',
          assigned_to: '',
          status: 'New',
          priority: 'Medium',
          notes: ''
        })
        loadData()
        alert('Lead added successfully!')
      } else {
        alert('Error adding lead')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error adding lead')
    } finally {
      setSaving(false)
    }
  }

  // Calculate stats from real data
  const totalLeads = leads.length
  const qualifiedLeads = leads.filter(l => l.status === 'Qualified').length
  const conversionRate = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0
  
  // Group leads by partner
  const partnerStats = partners.map(partner => {
    const partnerLeads = leads.filter(l => l.assigned_to === partner.name)
    const convertedLeads = partnerLeads.filter(l => l.status === 'Qualified' || l.status === 'Converted').length
    const convRate = partnerLeads.length > 0 ? Math.round((convertedLeads / partnerLeads.length) * 100) : 0
    
    return {
      id: partner.id,
      name: partner.name,
      tier: partner.tier,
      leadsAssigned: partnerLeads.length,
      leadsConverted: convertedLeads,
      conversionRate: convRate,
      avgResponseTime: '3.5 hours',
      capacity: Math.min(Math.round((partnerLeads.length / 20) * 100), 100),
      status: 'active'
    }
  })

  const distributionRules = [
    { name: 'Geographic Territory', enabled: true, description: 'Assign based on partner location' },
    { name: 'Industry Expertise', enabled: true, description: 'Match partner specialization' },
    { name: 'Capacity Management', enabled: true, description: 'Balance workload across partners' },
    { name: 'Performance Based', enabled: false, description: 'Prioritize high-performing partners' },
  ]

  const getTierColor = (tier: string) => {
    const colors = {
      Platinum: 'bg-purple-100 text-purple-700',
      Gold: 'bg-amber-100 text-amber-700',
      Silver: 'bg-gray-100 text-gray-700',
      Bronze: 'bg-orange-100 text-orange-700'
    }
    return colors[tier as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      New: 'bg-blue-100 text-blue-700',
      Contacted: 'bg-yellow-100 text-yellow-700',
      Qualified: 'bg-green-100 text-green-700',
      Unqualified: 'bg-red-100 text-red-700',
      Converted: 'bg-purple-100 text-purple-700'
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    )
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      Urgent: 'text-red-600',
      High: 'text-orange-600',
      Medium: 'text-yellow-600',
      Low: 'text-green-600'
    }
    return colors[priority as keyof typeof colors] || 'text-gray-600'
  }

  return (
    <SharedLayout>
      <div className="p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Lead Distribution
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Manage and distribute leads to partners</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <Plus size={24} />
            Add New Lead
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Users size={28} className="text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-semibold mb-1">Total Leads</p>
            <p className="text-4xl font-bold text-gray-900">{totalLeads}</p>
            <p className="text-xs text-green-600 mt-2">Active pipeline</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <TrendingUp size={28} className="text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-semibold mb-1">Conversion Rate</p>
            <p className="text-4xl font-bold text-gray-900">{conversionRate}%</p>
            <p className="text-xs text-green-600 mt-2">Qualified leads</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
                <Clock size={28} className="text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-semibold mb-1">Avg Response</p>
            <p className="text-4xl font-bold text-gray-900">3.5h</p>
            <p className="text-xs text-gray-500 mt-2">Partner response time</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <Award size={28} className="text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-semibold mb-1">Active Partners</p>
            <p className="text-4xl font-bold text-gray-900">{partners.length}</p>
            <p className="text-xs text-gray-500 mt-2">Accepting leads</p>
          </div>
        </div>

        {/* Partner Performance & Distribution Rules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">Partner Performance</h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
                </div>
              ) : partnerStats.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No partners available</p>
              ) : (
                partnerStats.map((partner) => (
                  <div 
                    key={partner.id}
                    className="mb-6 pb-6 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-gray-900 text-lg">{partner.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTierColor(partner.tier)}`}>
                            {partner.tier}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-gray-600 font-medium">Leads Assigned</p>
                            <p className="font-bold text-gray-900 text-xl">{partner.leadsAssigned}</p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-gray-600 font-medium">Converted</p>
                            <p className="font-bold text-green-600 text-xl">{partner.leadsConverted}</p>
                          </div>
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <p className="text-gray-600 font-medium">Conv. Rate</p>
                            <p className="font-bold text-gray-900 text-xl">{partner.conversionRate}%</p>
                          </div>
                          <div className="bg-amber-50 p-3 rounded-lg">
                            <p className="text-gray-600 font-medium">Avg Response</p>
                            <p className="font-bold text-gray-900 text-xl">{partner.avgResponseTime}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 font-semibold">Capacity Usage</span>
                        <span className="font-bold text-gray-900">{partner.capacity}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            partner.capacity > 80 ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                            partner.capacity > 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 
                            'bg-gradient-to-r from-green-500 to-green-600'
                          }`}
                          style={{ width: `${partner.capacity}%` }}
                        />
                      </div>
                      {partner.capacity > 80 && (
                        <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-100 px-4 py-3 rounded-xl mt-2 font-semibold">
                          <AlertCircle size={16} />
                          <span>Partner approaching capacity limit</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">Distribution Rules</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {distributionRules.map((rule, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 border border-gray-100"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-gray-900 text-sm">{rule.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        rule.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {rule.enabled ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{rule.description}</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-bold">
                Configure Rules
              </button>
            </div>
          </div>
        </div>

        {/* Recent Distributions Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-6 rounded-t-2xl flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">All Leads</h2>
            <button className="text-white hover:text-gray-200 text-sm font-bold flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all">
              View All
              <ArrowRight size={16} />
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase">Company</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase">Contact</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase">Assigned To</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase">Value</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase">Priority</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase">Status</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all">
                      <td className="px-8 py-5">
                        <p className="font-bold text-gray-900">{lead.company}</p>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-sm text-gray-900 font-medium">{lead.contact}</p>
                        <p className="text-xs text-gray-500">{lead.email}</p>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-sm font-semibold text-indigo-600">{lead.assigned_to || 'Unassigned'}</p>
                      </td>
                      <td className="px-8 py-5">
                        <p className="font-bold text-green-600 text-lg">${lead.value?.toLocaleString()}</p>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`font-bold ${getPriorityColor(lead.priority)}`}>
                          {lead.priority}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        {getStatusBadge(lead.status)}
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-sm text-gray-600">{new Date(lead.date).toLocaleDateString()}</p>
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-8 py-16 text-center">
                        <Users size={64} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg mb-4">No leads yet</p>
                        <button
                          onClick={() => setShowModal(true)}
                          className="text-indigo-600 hover:text-indigo-700 font-bold text-lg"
                        >
                          Add your first lead →
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Lead Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Add New Lead
                  </h2>
                  <p className="text-gray-500 mt-2 text-lg">Fill in the lead information</p>
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
                    <label className="block text-sm font-bold text-gray-700 mb-3">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all text-lg"
                      placeholder="Acme Corporation"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Contact Person *</label>
                    <input
                      type="text"
                      required
                      value={formData.contact}
                      onChange={(e) => setFormData({...formData, contact: e.target.value})}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all text-lg"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all text-lg"
                      placeholder="john@acme.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all text-lg"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Value ($) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.value}
                      onChange={(e) => setFormData({...formData, value: e.target.value})}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all text-lg"
                      placeholder="50000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Assign to Partner</label>
                    <select
                      value={formData.assigned_to}
                      onChange={(e) => setFormData({...formData, assigned_to: e.target.value})}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all text-lg"
                    >
                      <option value="">Select Partner</option>
                      {partners.map(partner => (
                        <option key={partner.id} value={partner.name}>{partner.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all text-lg"
                    >
                      <option value="Low">🟢 Low</option>
                      <option value="Medium">🟡 Medium</option>
                      <option value="High">🟠 High</option>
                      <option value="Urgent">🔴 Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all text-lg"
                    >
                      <option value="New">🆕 New</option>
                      <option value="Contacted">📞 Contacted</option>
                      <option value="Qualified">✅ Qualified</option>
                      <option value="Unqualified">❌ Unqualified</option>
                      <option value="Converted">🎉 Converted</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-3">Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all text-lg"
                      placeholder="Additional notes about this lead..."
                      rows={3}
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
                    className="flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 transform hover:scale-105"
                  >
                    {saving ? '✨ Adding...' : '🚀 Add Lead'}
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
