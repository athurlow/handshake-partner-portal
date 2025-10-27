"use client"
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #E86A47 0%, #F4B544 100%)' }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden shadow-xl" style={{ backgroundColor: '#FFFFFF' }}>
            <img src="/images/logo.png" alt="Handshake" className="w-full h-full" style={{ objectFit: 'cover', objectPosition: 'center', transform: 'scale(1.3)' }} onError={(e) => { const target = e.target as HTMLImageElement; target.style.display = 'none'; target.parentElement!.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 5rem;">🤝</div>'; }} />
          </div>
          <h1 className="text-4xl font-bold mb-2 text-white drop-shadow-lg">Welcome Back</h1>
          <p className="text-white/90">Sign in to your Handshake account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 border-2 rounded-xl" style={{ borderColor: '#E5E7EB' }} placeholder="you@company.com" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-12 py-3 border-2 rounded-xl" style={{ borderColor: '#E5E7EB' }} placeholder="Enter your password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full text-white py-3 rounded-xl font-bold" style={{ background: 'linear-gradient(to right, #E86A47, #F4B544)' }}>
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don&apos;t have an account?{' '}
              <button onClick={() => router.push('/signup')} className="font-bold hover:underline" style={{ color: '#E86A47' }}>
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
