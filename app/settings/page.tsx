"use client";

import SharedLayout from '@/components/shared/SharedLayout'
import { Settings as SettingsIcon, Upload, Palette, Save, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useTheme()
  const [localSettings, setLocalSettings] = useState(settings)
  const [logoPreview, setLogoPreview] = useState(settings.logo)
  const [saved, setSaved] = useState(false)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setLogoPreview(result)
        setLocalSettings({ ...localSettings, logo: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    updateSettings(localSettings)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleReset = () => {
    if (confirm('Reset all settings to default? This cannot be undone.')) {
      resetSettings()
      setLocalSettings({
        companyName: 'Partner Portal',
        logo: '',
        primaryColor: '#4F46E5',
        secondaryColor: '#10B981',
        accentColor: '#F59E0B',
      })
      setLogoPreview('')
    }
  }

  return (
    <SharedLayout>
      <div className="p-8 bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <SettingsIcon className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-gray-600 mt-1">Customize your portal appearance</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {saved && (
          <div className="mb-6 bg-green-50 border-2 border-green-200 text-green-700 px-6 py-4 rounded-xl flex items-center gap-3 animate-pulse">
            <Save size={24} />
            <span className="font-bold">Settings saved successfully!</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Company Name */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Company Information</h2>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Company Name</label>
              <input
                type="text"
                value={localSettings.companyName}
                onChange={(e) => setLocalSettings({ ...localSettings, companyName: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Your Company Name"
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Upload size={24} className="text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">Company Logo</h2>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50 overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center p-4">
                      <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                      <p className="text-xs text-gray-500">No logo</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <label className="block">
                  <span className="sr-only">Choose logo file</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gradient-to-r file:from-indigo-500 file:to-purple-600 file:text-white hover:file:from-indigo-600 hover:file:to-purple-700 file:cursor-pointer"
                  />
                </label>
                <p className="mt-2 text-sm text-gray-600">
                  Upload your company logo. Recommended: Square image, max 2MB.
                </p>
                {logoPreview && (
                  <button
                    onClick={() => {
                      setLogoPreview('')
                      setLocalSettings({ ...localSettings, logo: '' })
                    }}
                    className="mt-3 text-sm text-red-600 hover:text-red-700 font-bold"
                  >
                    Remove Logo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Brand Colors */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Palette size={24} className="text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">Brand Colors</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Primary Color */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Primary Color</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={localSettings.primaryColor}
                    onChange={(e) => setLocalSettings({ ...localSettings, primaryColor: e.target.value })}
                    className="h-12 w-20 rounded-xl border-2 border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localSettings.primaryColor}
                    onChange={(e) => setLocalSettings({ ...localSettings, primaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-xl text-sm font-mono"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Sidebar & primary buttons</p>
              </div>

              {/* Secondary Color */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Secondary Color</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={localSettings.secondaryColor}
                    onChange={(e) => setLocalSettings({ ...localSettings, secondaryColor: e.target.value })}
                    className="h-12 w-20 rounded-xl border-2 border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localSettings.secondaryColor}
                    onChange={(e) => setLocalSettings({ ...localSettings, secondaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-xl text-sm font-mono"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Success states & accents</p>
              </div>

              {/* Accent Color */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Accent Color</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={localSettings.accentColor}
                    onChange={(e) => setLocalSettings({ ...localSettings, accentColor: e.target.value })}
                    className="h-12 w-20 rounded-xl border-2 border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localSettings.accentColor}
                    onChange={(e) => setLocalSettings({ ...localSettings, accentColor: e.target.value })}
                    className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-xl text-sm font-mono"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Highlights & warnings</p>
              </div>
            </div>

            {/* Live Preview */}
            <div className="border-t-2 border-gray-200 pt-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Live Preview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  style={{ 
                    background: `linear-gradient(to right, ${localSettings.primaryColor}, ${localSettings.secondaryColor})` 
                  }}
                  className="px-6 py-3 text-white rounded-xl font-bold shadow-lg"
                >
                  Primary Button
                </button>

                <button
                  style={{ backgroundColor: localSettings.secondaryColor }}
                  className="px-6 py-3 text-white rounded-xl font-bold shadow-lg"
                >
                  Secondary Button
                </button>

                <button
                  style={{ backgroundColor: localSettings.accentColor }}
                  className="px-6 py-3 text-white rounded-xl font-bold shadow-lg"
                >
                  Accent Button
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl"
            >
              <Save size={20} />
              Save All Changes
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300 font-bold flex items-center gap-2"
            >
              <RotateCcw size={20} />
              Reset to Default
            </button>
          </div>
        </div>
      </div>
    </SharedLayout>
  )
}
