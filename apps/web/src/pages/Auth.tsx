import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)

  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (isSignUp) {
      if (password.length < 6) {
        setError('Password must be at least 6 characters')
        setLoading(false)
        return
      }
      const { error } = await signUp(email, password, name)
      if (error) {
        setError(error)
      } else {
        setConfirmationSent(true)
      }
    } else {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error)
      } else {
        navigate('/')
      }
    }

    setLoading(false)
  }

  if (confirmationSent) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4">
        <div className="bg-surface-800 border border-surface-600 rounded-lg p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">📧</div>
          <h2 className="text-xl font-bold text-gray-100 mb-2">Check Your Email</h2>
          <p className="text-gray-400 text-sm mb-6">
            We sent a confirmation link to <span className="text-olive-400">{email}</span>.
            Click the link to activate your account.
          </p>
          <button
            onClick={() => {
              setConfirmationSent(false)
              setIsSignUp(false)
            }}
            className="text-sm text-olive-400 hover:text-olive-300 transition-colors"
          >
            ← Back to Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4">
      <div className="bg-surface-800 border border-surface-600 rounded-lg p-8 max-w-md w-full">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100">⚔ Roster Maker</h1>
          <p className="text-sm text-gray-500 mt-2">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="text-xs text-gray-500 uppercase">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 bg-surface-900 border border-surface-600 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-olive-500 transition-colors"
                placeholder="Your name"
              />
            </div>
          )}

          <div>
            <label className="text-xs text-gray-500 uppercase">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 bg-surface-900 border border-surface-600 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-olive-500 transition-colors"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 bg-surface-900 border border-surface-600 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-olive-500 transition-colors"
              placeholder={isSignUp ? 'At least 6 characters' : 'Your password'}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-olive-500 hover:bg-olive-600 disabled:opacity-50 text-white font-semibold transition-colors"
          >
            {loading ? '...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Toggle */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError(null)
            }}
            className="text-sm text-gray-400 hover:text-olive-400 transition-colors"
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        </div>

        {/* Skip / Guest */}
        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            Continue without account →
          </button>
        </div>
      </div>
    </div>
  )
}
