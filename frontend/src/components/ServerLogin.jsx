import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
async function getHashedString(input) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const base64 = btoa(String.fromCharCode(...hashArray));

  // URL-safe Base64 encoding (Base64URL)
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export default function ServerLogin({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
const handleSubmit = async (e) => {
  e.preventDefault()
  setError(null)
  setLoading(true)

  try {
    const res = await axios.post('https://freight-me-1.onrender.com/server-login', {
      username,
      password,
    });

    if (res.data.user) {
      localStorage.setItem('server_auth', 'true');
      onLogin?.(res.data.user);

      // ✅ Hash the username using SHA-256
      const hashedUsername = await getHashedString(username);
      
      // Redirect to /server/{hashedUsername}
      navigate(`/server/${hashedUsername}`);
    } else {
      setError('Invalid username or password');
    }
  } catch (err) {
    console.error('Login error:', err);
    setError(err?.response?.data?.error || 'Login failed');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex h-screen items-center justify-center bg-blue-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-96 text-center">
        <img src="/logo-placeholder.png" alt="Freight Me" className="mx-auto mb-4 w-28" />
        <h1 className="text-2xl font-bold text-blue-700 mb-4">Server Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              className="w-full p-2 border rounded-md"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
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


