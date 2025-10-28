"use client"
import { ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Settings, LogOut, FileText, TrendingUp, BarChart3 } from 'lucide-react'
import { authService } from '@/lib/auth'

interface SharedLayoutProps {
  children: ReactNode
}

export default function SharedLayout({ children }: SharedLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/partners', icon: Users, label: 'Partners' },
    { path: '/deals/registration', icon: FileText, label: 'Deals' },
    { path: '/leads/distribution', icon: TrendingUp, label: 'Leads' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ]

  const handleLogout = async () => {
    try {
      await authService.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      window.location.href = '/login'
    }
  }

  return (
    <div className="flex h-screen">
      <aside className="w-64 text-white shadow-2xl" style={{ background: 'linear-gradient(135deg, #E86A47 0%, #F4B544 100%)' }}>
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex-shrink-0 rounded-full overflow-hidden flex items-center justify-center text-2xl bg-white/20 backdrop-blur-sm">
              🤝
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">Handshake</h1>
              <p className="text-sm font-medium text-white/90">Partner Portal</p>
            </div>
          </div>
        </div>
        
        <nav className="mt-6 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <button 
                key={item.path} 
                onClick={() => router.push(item.path)} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200 font-medium ${
                  isActive 
                    ? 'bg-white text-orange-600 shadow-lg scale-105' 
                    : 'text-white/90 hover:bg-white/20 hover:text-white hover:scale-105'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 p-4 border-t border-white/20" style={{ width: '256px' }}>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all backdrop-blur-sm"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto" style={{ background: 'linear-gradient(135deg, #FFF5E6 0%, #FFF9E6 50%, #FFE4CC 100%)' }}>
        {children}
      </main>
    </div>
  )
}
