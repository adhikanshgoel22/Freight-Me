import { useInRouterContext, useNavigate } from 'react-router-dom'
import { useState } from 'react'

import Dashboard from '../components/Dashboard'
import Login from '../components/Login'

export default function Home() {
  const isInsideRouter = useInRouterContext()
  console.log("Is inside <BrowserRouter>?", isInsideRouter) // boolean true or false

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return isLoggedIn ? (
    <Dashboard />
  ) : (
    <Login onLogin={() => setIsLoggedIn(true)} />
  )
}
