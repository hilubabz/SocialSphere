"use client";
import Link from "next/link";
import { useState } from "react";
import { User, Lock, LogIn, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
export default function Page() {
  const [login, setLogin] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router=useRouter(null)

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLogin({ ...login, [name]: value });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (login.username == "" && login.password == "") {
      setError("Username and Password can't be empty");
    } else if (login.password == "") {
      setError("Password can't be empty");
    } else if (login.username == "") {
      setError("Username can't be empty");
    } else {
      try {
        const response = await fetch("/apis/loginUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(login),
        });
        let res = await response.json();
        if (res.success) {
          setError("Login Successful");
          sessionStorage.setItem("login", JSON.stringify(res.data));
          setTimeout(()=>{
            router.push('/posts')
          },2000)
        } else {
          setError("Invalid Credentials");
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
        console.log(err)
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Login Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center w-24 h-16  rounded-2xl mb-4 shadow-lg mx-auto">
                {/* <Sparkles className="w-8 h-8 text-white" />*/}
                <img src="/logo.png" className="h-20 w-[200px]" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-white/70">Sign in to your account</p>
            </div>

            {/* Login Form */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-white/90 text-sm font-medium">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/3 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <input
                    type="text"
                    name="username"
                    value={login.username}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                    placeholder="Enter your username"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-white/90 text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/3 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <input
                    type="password"
                    name="password"
                    value={login.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Error/Success Message */}
              {error && (
                <div
                  className={`rounded-xl p-3 text-sm ${
                    error === "Login Successful"
                      ? "bg-green-500/20 border border-green-500/30 text-green-200"
                      : "bg-red-500/20 border border-red-500/30 text-red-200"
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
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-purple-500/50 disabled:to-pink-500/50 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
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
                  className="text-purple-300 hover:text-purple-200 text-sm font-medium transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>
            <div className="text-center mt-6 text-white/70">
              Don't have an account? 
              <Link
                href={"/register"}
                className="text-purple-300 hover:text-purple-200 font-medium transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>

        {/* Sign Up Link */}

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-500/10 rounded-full blur-xl"></div>
      </div>
    </div>
  );
}
