import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button.tsx"
import { Input } from "../components/ui/input.tsx"
import { Label } from "../components/ui/Label.tsx"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card.tsx"
import { LogIn, User, Key } from "lucide-react"
import { useToast } from "../hooks/use-toast.ts"
import axios from "axios"

export default function Login({ onLogin }) {
  

useEffect(() => {
  const savedEmail = localStorage.getItem("rememberedEmail");
  const savedPassword = localStorage.getItem("rememberedPassword");

  if (savedEmail && savedPassword) {
    setEmail(savedEmail);
    setPassword(savedPassword);
    setRememberMe(true);
  }
}, []);

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { toast } = useToast()
  const navigate = useNavigate()
  const [rememberMe, setRememberMe] = useState(false)

  // Simple hash (not secure, for demo only)
  const hashString = (str) => {
    return btoa(str).replace(/=/g, "")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const res = await axios.post("https://freight-me-1.onrender.com/login", {
        email,
        password,
      })

      const user = res.data.user

      // Store user in local/session storage
      if (rememberMe) {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("rememberedEmail", email);
  localStorage.setItem("rememberedPassword", password);
} else {
  sessionStorage.setItem("user", JSON.stringify(user));
  localStorage.removeItem("rememberedEmail");
  localStorage.removeItem("rememberedPassword");
}


      // Generate user hash from email or ID
      const userHash = hashString(user.email || user.id || email)

      // Callback to update parent state if needed
      onLogin?.(user)

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      })

      // Redirect directly to the client table with hash
      navigate(`/table/${userHash}`);

    } catch (err) {
      const message = err?.response?.data?.error || "Login failed"
      setError(message)
      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Heading */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <LogIn className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="text"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <span className="text-gray-600">Remember me</span>
                </label>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
