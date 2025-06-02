import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
      const res = await axios.post('http://localhost:5000/server-login', {
        username,
        password,
      })

      // Your backend sends back { user } on success
      if (res.data.user) {
        localStorage.setItem('server_auth', 'true')
        onLogin?.(res.data.user)
        navigate("/server/view")
      } else {
        setError('Invalid username or password')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err?.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

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


// import { useState } from "react"
// import { Button } from "../components/ui/button.tsx"
// import { Input } from "../components/ui/input.tsx"
// import { Label } from "../components/ui/Label.tsx"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/Card.tsx"
// import { LogIn, User, Key } from "lucide-react"
// import { useToast } from "../hooks/use-toast.ts"
// import axios from "axios"
// import Header from "./Navbar.jsx"

// export default function ServerLogin({ onLogin }) {
//   const [username, setusername] = useState("")
//   const [password, setPassword] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState(null)
//   const { toast } = useToast()

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setError(null)

//     try {
//       const res = await axios.post("http://localhost:5000/server-login", {
//         username,
//         password,
//       })

//       onLogin?.(res.data.user)
//       toast({
//         title: "Login Successful",
//         description: "Welcome back!",
//         x
//       })
//     } catch (err) {
//       const message = err?.response?.data?.error || "Login failed"
//       setError(message)
//       toast({
//         title: "Login Failed",
//         description: message,
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      
//       <div className="w-full max-w-md">
        
//         {/* Logo & Heading */}
//         <div className="text-center mb-8">
//           <div className="flex justify-center mb-4">
//             <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
//               <LogIn className="w-8 h-8 text-white" />
//             </div>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
//           <p className="text-gray-600">Sign in to your account</p>
//         </div>

//         {/* Login Form */}
//         <Card className="shadow-xl">
//           <CardHeader>
//             <CardTitle className="text-2xl text-center">Login</CardTitle>
//             <CardDescription className="text-center">
//               Enter your credentials to access your account
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="username">username</Label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                   <Input
//                     id="username"
//                     type="text"
//                     placeholder="Enter your username"
//                     value={username}
//                     onChange={(e) => setusername(e.target.value)}
//                     className="pl-10"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <div className="relative">
//                   <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                   <Input
//                     id="password"
//                     type="password"
//                     placeholder="Enter your password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="pl-10"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="flex items-center justify-between text-sm">
//                 <label className="flex items-center space-x-2">
//                   <input type="checkbox" className="rounded" />
//                   <span className="text-gray-600">Remember me</span>
//                 </label>
//                 <a href="#" className="text-blue-600 hover:underline">
//                   Forgot password?
//                 </a>
//               </div>

//               {error && <p className="text-sm text-red-600">{error}</p>}

//               <Button type="submit" className="w-full" disabled={isLoading}>
//                 {isLoading ? "Signing in..." : "Sign in"}
//               </Button>
//             </form>

//             <div className="mt-6 text-center">
//               <p className="text-sm text-gray-600">
//                 Don’t have an account?{" "}
//                 <a href="#" className="text-blue-600 hover:underline font-medium">
//                   Sign up
//                 </a>
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }
