"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type ThemeSettings = {
  companyName: string
  logo: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
}

type ThemeContextType = {
  settings: ThemeSettings
  updateSettings: (newSettings: Partial<ThemeSettings>) => void
  resetSettings: () => void
}

const defaultSettings: ThemeSettings = {
  companyName: 'Partner Portal',
  logo: '',
  primaryColor: '#4F46E5', // Indigo
  secondaryColor: '#10B981', // Emerald
  accentColor: '#F59E0B', // Amber
}

const ThemeContext = createContext<ThemeContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  resetSettings: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(defaultSettings)

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('portalSettings')
    if (saved) {
      try {
        setSettings(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load settings:', e)
      }
    }
  }, [])

  const updateSettings = (newSettings: Partial<ThemeSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    localStorage.setItem('portalSettings', JSON.stringify(updated))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    localStorage.removeItem('portalSettings')
  }

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </ThemeContext.Provider>
  )
}
