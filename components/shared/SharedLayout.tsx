"use client"
import { ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Settings, LogOut, FileText, TrendingUp, BarChart3 } from 'lucide-react'

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

  const handleLogout = () => {
    window.location.href = '/login'
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#F5E6D3' }}>
      <aside className="w-64 text-white shadow-2xl" style={{ background: 'linear-gradient(to bottom, #2C5F7C, rgba(44, 95, 124, 0.9))' }}>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex-shrink-0 rounded-full overflow-hidden flex items-center justify-center text-2xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
              🤝
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Handshake</h1>
              <p className="text-sm font-medium" style={{ color: '#F4B544' }}>Partner Portal</p>
            </div>
          </div>
        </div>
        
        <nav className="mt-6 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <button key={item.path} onClick={() => router.push(item.path)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200 ${isActive ? 'text-white shadow-lg scale-105' : 'text-white/80 hover:bg-white/10 hover:text-white'}`} style={isActive ? { backgroundColor: '#E86A47' } : {}}>
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 p-4 border-t border-white/10" style={{ width: '256px' }}>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-xl transition-all">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto" style={{ background: 'linear-gradient(to bottom right, #FFF5E6, #FFFFFF, #FFF9E6)' }}>
        {children}
      </main>
    </div>
  )
}
