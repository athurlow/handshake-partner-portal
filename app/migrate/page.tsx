"use client"
import { useState } from 'react'
import SharedLayout from '@/components/shared/SharedLayout'
import { Download, AlertCircle, CheckCircle, Loader } from 'lucide-react'

export default function MigratePage() {
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleMigrate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/migrate/hubspot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hubspotApiKey: apiKey })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Migration failed')
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SharedLayout>
      <div className="p-8 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
              Import from HubSpot
            </h1>
            <p className="text-gray-600 text-lg">One-time bulk import of existing HubSpot deals</p>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="text-blue-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-blue-900 mb-2">Before You Start</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>Get your HubSpot Private App Access Token</li>
                  <li>Settings - Integrations - Private Apps - Create or View Token</li>
                  <li>Ensure it has read access to deals</li>
                  <li>This will import up to 100 deals</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <form onSubmit={handleMigrate} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  HubSpot Access Token
                </label>
                <input
                  type="password"
                  required
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Your HubSpot API token"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-bold hover:from-orange-700 hover:to-red-700 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Importing...
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    Import Deals from HubSpot
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <div className="flex gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-bold text-red-900">Error</p>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className="mt-6 p-6 bg-green-50 border-2 border-green-200 rounded-xl">
                <div className="flex gap-3 mb-4">
                  <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                  <div>
                    <p className="font-bold text-green-900 text-lg">Success!</p>
                    <p className="text-sm text-green-700">
                      Imported {result.imported} deals from HubSpot
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
            <div className="flex gap-3">
              <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
              <div className="text-sm text-yellow-800">
                <p className="font-bold mb-1">Note:</p>
                <p>This is a one-time import. Going forward webhooks will automatically sync new deals.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SharedLayout>
  )
}
