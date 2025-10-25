"use client"
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { LayoutDashboard, Users, ClipboardCheck, BarChart3, Settings, LogOut, User } from 'lucide-react'
import { authService } from '@/lib/auth'

export default function SharedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        try {
          const userProfile = await authService.getProfile(currentUser.id)
          setProfile(userProfile)
        } catch (profileError) {
          // Profile doesn't exist yet, that's okay
          console.log('No profile found, using user data only')
        }
      }
    } catch (error) {
      // User not logged in, that's okay
      console.log('No user session found')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.signOut()
      setUser(null)
      setProfile(null)
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { id: 'partners', icon: Users, label: 'Partners', path: '/partners' },
    { id: 'registration', icon: ClipboardCheck, label: 'Deal Registration', path: '/registration' },
    { id: 'distribution', icon: BarChart3, label: 'Lead Distribution', path: '/distribution' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
  ]

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User'
  const displayEmail = user?.email || ''

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white shadow-xl flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight">🤝 Handshake</h1>
          <p className="text-indigo-200 text-sm mt-1">Partner Management</p>
        </div>
        
        <nav className="mt-6 px-3 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id)
                router.push(item.path)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all duration-200 ${
                pathname === item.path
                  ? 'bg-white text-indigo-900 shadow-lg'
                  : 'text-indigo-100 hover:bg-indigo-700'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Section at Bottom */}
        {user && (
          <div className="p-4 border-t border-indigo-700">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={20} />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-medium text-sm truncate">{displayName}</p>
                  <p className="text-indigo-200 text-xs truncate">{displayEmail}</p>
                </div>
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-xl py-2 z-20">
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        router.push('/settings')
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
