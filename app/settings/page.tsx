"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SharedLayout from '@/components/shared/SharedLayout'
import { User, Bell, Lock, Database, Upload, Download, Palette, Image } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const [exporting, setExporting] = useState(false)
  const [primaryColor, setPrimaryColor] = useState('#6366f1')

  const handleExport = async (type: 'partners' | 'deals' | 'leads') => {
    setExporting(true)
    try {
      const response = await fetch(`/api/${type}`)
      const data = await response.json()
      const items = data.results || []

      if (items.length === 0) {
        alert(`No ${type} to export`)
        return
      }

      const headers = Object.keys(items[0]).join(',')
      const rows = items.map((item: any) => 
        Object.values(item).map(v => `"${v}"`).join(',')
      )
      const csv = [headers, ...rows].join('\n')

      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `handshake-${type}-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
      alert('Export failed')
    } finally {
      setExporting(false)
    }
  }

  return (
    <SharedLayout>
      <div className="p-8 bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">Settings</h1>
            <p className="text-gray-600 text-lg">Manage your account and data</p>
          </div>

          <div className="space-y-6">
            {/* Data Management Section */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                    <Database size={32} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Data Management</h2>
                    <p className="text-blue-100 text-sm">Import and export your HubSpot data</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Import Section */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Upload className="text-blue-600" size={24} />
                    <h3 className="text-xl font-bold text-gray-900">Import from HubSpot</h3>
                  </div>
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
                    <p className="text-sm text-blue-900 font-semibold mb-2">How to import:</p>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Export data from HubSpot (CRM → Actions → Export)</li>
                      <li>Click the import button below</li>
                      <li>Upload your CSV files</li>
                      <li>Your data will be synced automatically!</li>
                    </ol>
                  </div>
                  <button
                    onClick={() => router.push('/upload')}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-shadow duration-300 shadow-lg flex items-center justify-center gap-2"
                  >
                    <Upload size={20} />
                    Import CSV Files
                  </button>
                </div>

                <div className="border-t-2 border-gray-100"></div>

                {/* Export Section */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Download className="text-green-600" size={24} />
                    <h3 className="text-xl font-bold text-gray-900">Export Your Data</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Download your data as CSV files for backup or analysis</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => handleExport('partners')}
                      disabled={exporting}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-shadow duration-300 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Download size={18} />
                      Export Partners
                    </button>
                    
                    <button
                      onClick={() => handleExport('deals')}
                      disabled={exporting}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-4 rounded-xl font-bold hover:from-purple-600 hover:to-purple-700 transition-shadow duration-300 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Download size={18} />
                      Export Deals
                    </button>
                    
                    <button
                      onClick={() => handleExport('leads')}
                      disabled={exporting}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-shadow duration-300 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Download size={18} />
                      Export Leads
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Branding & Customization Section */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                    <Palette size={32} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Branding & Customization</h2>
                    <p className="text-purple-100 text-sm">Customize your portal appearance</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Logo Upload */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Image className="text-purple-600" size={24} />
                    <h3 className="text-xl font-bold text-gray-900">Company Logo</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center border-2 border-purple-200">
                      <Image className="text-purple-400" size={40} />
                    </div>
                    <div className="flex-1">
                      <label className="block">
                        <input type="file" accept="image/*" className="hidden" />
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-shadow duration-300 cursor-pointer inline-flex items-center gap-2">
                          <Upload size={18} />
                          Upload Logo
                        </div>
                      </label>
                      <p className="text-sm text-gray-500 mt-2">PNG, JPG or SVG. Max 2MB.</p>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-gray-100"></div>

                {/* Color Customization */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Palette className="text-purple-600" size={24} />
                    <h3 className="text-xl font-bold text-gray-900">Brand Colors</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Primary Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-16 h-16 rounded-xl border-2 border-gray-200 cursor-pointer"
                        />
                        <div className="flex-1">
                          <input
                            type="text"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Secondary Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          defaultValue="#ec4899"
                          className="w-16 h-16 rounded-xl border-2 border-gray-200 cursor-pointer"
                        />
                        <div className="flex-1">
                          <input
                            type="text"
                            defaultValue="#ec4899"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-shadow duration-300 shadow-lg">
                    Save Brand Settings
                  </button>
                </div>
              </div>
            </div>

            {/* Account Section */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <User size={24} className="text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Your Company"
                  />
                </div>
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-shadow duration-300 shadow-lg">
                  Save Account Settings
                </button>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Bell size={24} className="text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
              </div>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
                  <span className="text-gray-700">Email notifications for new deals</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
                  <span className="text-gray-700">Weekly performance reports</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded" />
                  <span className="text-gray-700">Partner status updates</span>
                </label>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-100 rounded-xl">
                  <Lock size={24} className="text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Security</h2>
              </div>
              <button className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:from-red-700 hover:to-pink-700 transition-shadow duration-300 shadow-lg">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </SharedLayout>
  )
}
