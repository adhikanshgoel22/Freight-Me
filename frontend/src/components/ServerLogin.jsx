import { useState } from 'react'
import { supabase } from '../supabase' // Ensure this points to your configured Supabase client

export default function ServerLogin({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
  
    // Simulate network delay
    setTimeout(() => {
      if (email === 'InstallMe' && password === '2025FrieghtMe*') {
        onLogin() // simulate successful login
      } else {
        setError('Invalid email or password')
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="flex h-screen items-center justify-center bg-blue-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-96 text-center">
        <img src="/logo-placeholder.png" alt="Freight Me" className="mx-auto mb-4 w-28" />
        <h1 className="text-2xl font-bold text-blue-700 mb-4">Server Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 w-full"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
