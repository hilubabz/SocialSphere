"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { User, Lock, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"
import { io } from "socket.io-client"

let socket
export default function Page() {
  const [login, setLogin] = useState({ username: "", password: "" })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [id,setId]=useState(null)
  const router = useRouter()


  
  const handleChange = (event) => {
    const { name, value } = event.target
    setLogin({ ...login, [name]: value })
    
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (login.username == "" && login.password == "") {
      setError("Username and Password can't be empty")
    } else if (login.password == "") {
      setError("Password can't be empty")
    } else if (login.username == "") {
      setError("Username can't be empty")
    } else {
      try {
        const response = await fetch("/apis/loginUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(login),
        })
        const res = await response.json()
        if (res.success) {
          setError("Login Successful")
          sessionStorage.setItem("login", JSON.stringify(res.data))
          setId(res.data)
          setTimeout(() => {
            router.push("/posts")
          }, 1000)
        } else {
          setError("Invalid Credentials")
        }
      } catch (err) {
        setError("Something went wrong. Please try again.")
        console.log(err)
      }
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        {/* Main Login Card */}
        <div className="bg-gray-800 rounded-3xl shadow-2xl border border-slate-700/50 p-8 lg:p-10 relative">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gray-800 rounded-3xl blur-xl"></div>

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center w-24 h-16 rounded-2xl mb-4 shadow-lg mx-auto">
                <img src="/Logo.png" className="h-25 w-[150px]" alt="Logo" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-slate-300">Sign in to your account</p>
            </div>

            {/* Login Form */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-slate-200 text-sm font-medium">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    name="username"
                    value={login.username}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-slate-700/80 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    placeholder="Enter your username"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-slate-200 text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="password"
                    name="password"
                    value={login.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-slate-700/80 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Error/Success Message */}
              {error && (
                <div
                  className={`rounded-xl p-3 text-sm border ${
                    error === "Login Successful"
                      ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                      : "bg-red-500/20 border-red-500/50 text-red-300"
                  }`}
                >
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:from-emerald-600/50 disabled:to-emerald-700/50 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center space-x-2 border border-emerald-500/20"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </>
                )}
              </button>

              {/* Forgot Password Link */}
              <div className="text-center">
                <Link
                  href="/forgot-password"
                  className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center mt-6 text-slate-300">
              {"Don't have an account? "}
              <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </div>

      
        

  
      </div>
    </div>
  )
}
