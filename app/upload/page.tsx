"use client"
import { useState } from 'react'
import SharedLayout from '@/components/shared/SharedLayout'
import { Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react'

export default function UploadPage() {
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'partners' | 'deals' | 'leads') => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')
    setResult(null)

    try {
      const text = await file.text()
      const lines = text.split('\n').filter(l => l.trim())
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
      
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
        const obj: any = {}
        headers.forEach((header, i) => {
          obj[header] = values[i] || ''
        })
        return obj
      })

      // Map CSV data to your schema
      let mapped
      if (type === 'partners') {
        mapped = data.map((row: any) => ({
          name: row.Name || row['Company name'] || row.name || 'Unknown',
          tier: 'Bronze',
          contact: row['Company domain name'] || row.Domain || row.email || '',
          phone: row['Phone Number'] || row.Phone || '',
          status: 'Active',
          revenue: 0,
          deals: 0,
          growth: 0
        }))
      } else if (type === 'deals') {
        mapped = data.map((row: any) => ({
          name: row['Deal Name'] || row.dealname || 'Untitled',
          company: row['Company name'] || row.company || 'Unknown',
          value: parseFloat(row.Amount || row.amount || '0'),
          status: 'Pending',
          partner: null,
          date: new Date().toISOString().split('T')[0]
        }))
      } else {
        mapped = data.map((row: any) => ({
          company: row['Company name'] || row.company || 'Unknown',
          contact: `${row['First Name'] || ''} ${row['Last Name'] || ''}`.trim() || row.Email || 'Unknown',
          email: row.Email || row.email || '',
          phone: row['Phone Number'] || row.phone || '',
          value: 0,
          status: 'New',
          priority: 'Medium',
          date: new Date().toISOString().split('T')[0]
        }))
      }

      // Send to API
      const response = await fetch(`/api/upload/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: mapped })
      })

      const result = await response.json()
      
      if (response.ok) {
        setResult({ type, count: result.count })
      } else {
        setError(result.error || 'Upload failed')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <SharedLayout>
      <div className="p-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Upload from HubSpot
            </h1>
            <p className="text-gray-600 text-lg">Import your HubSpot data via CSV files</p>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
            <div className="flex gap-3">
              <Download className="text-blue-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-blue-900 mb-2">How to Export from HubSpot</h3>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Go to HubSpot CRM → Companies, Deals, or Contacts</li>
                  <li>Click Actions → Export</li>
                  <li>Download the CSV file</li>
                  <li>Upload it here!</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FileText className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Partners</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">Upload Companies CSV from HubSpot</p>
              <label className="block">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileUpload(e, 'partners')}
                  className="hidden"
                />
                <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer">
                  <Upload size={20} />
                  Choose File
                </div>
              </label>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <FileText className="text-purple-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Deals</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">Upload Deals CSV from HubSpot</p>
              <label className="block">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileUpload(e, 'deals')}
                  className="hidden"
                />
                <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all cursor-pointer">
                  <Upload size={20} />
                  Choose File
                </div>
              </label>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <FileText className="text-green-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Leads</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">Upload Contacts CSV from HubSpot</p>
              <label className="block">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileUpload(e, 'leads')}
                  className="hidden"
                />
                <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all cursor-pointer">
                  <Upload size={20} />
                  Choose File
                </div>
              </label>
            </div>
          </div>

          {uploading && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
              <p className="text-gray-600 text-lg">Uploading and processing...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
              <div className="flex gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
                <div>
                  <p className="font-bold text-red-900">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
              <div className="flex gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                <div>
                  <p className="font-bold text-green-900 text-lg">Success!</p>
                  <p className="text-sm text-green-700">
                    Imported {result.count} {result.type} from CSV
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SharedLayout>
  )
}
