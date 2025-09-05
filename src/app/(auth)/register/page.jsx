"use client"

import Link from "next/link"
import { useState, useRef } from "react"
import { User, Mail, Lock, Calendar, Upload, Camera, ArrowRight, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

export default function Page() {
  const [regInfo, setRegInfo] = useState({
    name: "",
    email: "",
    username: "",
    dob: "",
    gender: "",
    password: "",
    profilePicture: "",
    coverPicture: "",
    bio: "",
  })
  const [rePassword, setRePassword] = useState("")
  const [error, setError] = useState("")
  const [valid, setValid] = useState(false)
  const [registered, setRegistered] = useState("")
  const [profilePicture, setProfilePicture] = useState(null)
  const [coverPicture, setCoverPicture] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const profilePictureRef = useRef(null)
  const coverPictureRef = useRef(null)

  const handleChange = (event) => {
    const { name, value } = event.target
    setRegInfo({ ...regInfo, [name]: value })
  }

  const handleFile = async (event) => {
    const file = event.target.files[0];
    const photoName = event.target.name;

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const toastId = toast.loading("Uploading image...");

    try {
      const res = await fetch("/apis/uploadImage", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.url) {
        setRegInfo((prev) => ({ ...prev, [photoName]: data.url }));
        if (photoName === "profilePicture") setProfilePicture(data.url);
        else setCoverPicture(data.url);

        toast.update(toastId, {
          render: "Upload successful!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          closeOnClick: true,
        });
      } else {
        toast.update(toastId, {
          render: "Upload failed",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.update(toastId, {
        render: "Upload error",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };



  const handleRePass = (event) => {
    const val = event.target.value
    setRePassword(val)
  }

  const handleFirstSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    const datas = ["name", "email", "username", "dob", "gender", "password"]
    if (datas.some((val) => regInfo[val] === "") || rePassword === "") {
      setError("Fill all the fields")
    } else if (regInfo.password != rePassword) {
      setError("Password and Repassword do not match")
    } else {
      try {
        const res = await fetch("/apis/registerUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(regInfo),
        })
        const data = await res.json()
        setError(data.error)
        setValid(data.success)
      } catch (e) {
        console.log(e)
      }
    }
    setIsLoading(false)
  }

  const handleSecondSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch("/apis/addUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(regInfo),
      })
      const data = await res.json()
      setRegistered(data.data)
      if (data.success) {
        setTimeout(() => {
          router.push('/login')
        }, 1000)
      }
    } catch (e) {
      console.log(e)
    }
    setIsLoading(false)
  }
  console.log(regInfo)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-8 md:p-4 overflow-hidden">
      <div className="shadow-2xl shadow-emerald-500/10 rounded-2xl w-full">
        <div className="w-full max-w-2xl mx-auto bg-gray-800 rounded-2xl shadow-2xl shadow-emerald-500/20 border border-gray-700 overflow-hidden">
          {/* Progress Indicator */}
          <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${!valid ? "bg-emerald-500 text-white" : "bg-green-500 text-white"
                    }`}
                >
                  {!valid ? "1" : <Check className="w-4 h-4" />}
                </div>
                <span className="ml-2 text-xs sm:text-sm font-medium text-gray-200">Account Details</span>
              </div>
              <div
                className={`w-12 h-px transition-colors duration-300 ${valid ? "bg-green-300" : "bg-emerald-300"}`}
              ></div>
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${valid ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-500"
                    }`}
                >
                  2
                </div>
                <span className={`ml-2 text-xs sm:text-sm font-medium transition-colors duration-300 ${valid ? "text-gray-200" : "text-gray-500"}`}>
                  Profile Setup
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Registration Form */}
            <div
              className={`p-4 sm:p-8 lg:p-12 transition-all duration-500 ease-in-out ${valid
                ? "transform -translate-x-full opacity-0 pointer-events-none absolute inset-0"
                : "transform translate-x-0 opacity-100 relative"
                }`}
            >
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-2">
                    Create Account
                  </h1>
                  <p className="text-gray-400">Join our community today</p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-gray-200 text-sm font-medium">Full Name</label>
                      <div className="relative">
                        <User className="text-emerald-500 w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="text"
                          name="name"
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-400"
                          placeholder="Enter your name"
                          disabled={isLoading}
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-gray-200 text-sm font-medium">Username</label>
                      <div className="relative">
                        <User className="text-emerald-500 w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="text"
                          name="username"
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-400"
                          placeholder="Choose username"
                          disabled={isLoading}
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-gray-200 text-sm font-medium">Email Address</label>
                    <div className="relative">
                      <Mail className="text-emerald-500 w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="email"
                        name="email"
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-400"
                        placeholder="Enter your email"
                        disabled={isLoading}
                        autoComplete="off"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-gray-200 text-sm font-medium">Date of Birth</label>
                      <div className="relative">
                        <Calendar className="text-emerald-500 w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="date"
                          name="dob"
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-400"
                          disabled={isLoading}
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-gray-200 text-sm font-medium">Gender</label>
                      <div className="flex space-x-6 pt-3">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value="Male"
                            onChange={handleChange}
                            disabled={isLoading}
                            autoComplete="off"
                            className="w-4 h-4 text-emerald-500 focus:ring-emerald-500"
                          />
                          <span className="text-gray-200">Male</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value="Female"
                            onChange={handleChange}
                            disabled={isLoading}
                            autoComplete="off"
                            className="w-4 h-4 text-emerald-500 focus:ring-emerald-500"
                          />
                          <span className="text-gray-200">Female</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-gray-200 text-sm font-medium">Password</label>
                    <div className="relative">
                      <Lock className="text-emerald-500 w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="password"
                        name="password"
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-400"
                        placeholder="Create password"
                        disabled={isLoading}
                        autoComplete="off"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-gray-200 text-sm font-medium">Confirm Password</label>
                    <div className="relative">
                      <Lock className="text-emerald-500 w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="password"
                        name="rePassword"
                        onChange={handleRePass}
                        className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-400"
                        placeholder="Confirm password"
                        disabled={isLoading}
                        autoComplete="off"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-red-300 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                    disabled={isLoading}
                    onClick={handleFirstSubmit}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Please Wait...</span>
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-5 h-5" />
                        <span>Continue</span>
                      </>
                    )}
                  </button>

                  <div className="text-center text-gray-400">
                    Already have an account?{" "}
                    <Link href="/login" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium">
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Setup */}
            <div
              className={`p-4 sm:p-8 lg:p-12 transition-all duration-500 ease-in-out w-full max-w-[40rem] mx-auto ${valid
                ? "transform translate-x-0 opacity-100 relative"
                : "transform translate-x-full opacity-0 pointer-events-none absolute inset-0"
                }`}
            >
              <div className="mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-2">
                    Setup Profile
                  </h2>
                  <p className="text-gray-400">Customize your profile</p>
                </div>

                <div className="space-y-8">
                
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      name="coverPicture"
                      onChange={handleFile}
                      ref={coverPictureRef}
                      disabled={isLoading}
                      autoComplete="off"
                      className="hidden"
                    />
                    <div
                      onClick={() => coverPictureRef.current.click()}
                      className="relative w-full h-24 sm:h-32 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl border-2 border-dashed border-gray-500 cursor-pointer hover:border-emerald-400 hover:from-gray-600 hover:to-gray-500 transition-all duration-200 overflow-hidden group"
                    >
                      {coverPicture ? (
                        <img
                          src={coverPicture || "/placeholder.svg"}
                          alt="Cover"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 group-hover:text-emerald-400 transition-colors">
                          <Upload className="w-6 h-6 mb-2" />
                          <span className="text-sm font-medium">Upload Cover Photo</span>
                        </div>
                      )}
                    </div>

                
                    <input
                      type="file"
                      accept="image/*"
                      name="profilePicture"
                      onChange={handleFile}
                      ref={profilePictureRef}
                      disabled={isLoading}
                      autoComplete="off"
                      className="hidden"
                    />
                    <div
                      onClick={() => profilePictureRef.current.click()}
                      className="absolute -bottom-12 left-1/2 transform-translate-x-1/2 w-24 h-24 rounded-full border-4 border-gray-800 bg-gradient-to-br from-gray-700 to-gray-600 cursor-pointer hover:from-gray-600 hover:to-gray-500 transition-all duration-200 overflow-hidden group shadow-lg"
                      style={{ marginLeft: "-3rem" }}
                    >
                      {profilePicture ? (
                        <img
                          src={profilePicture || "/placeholder.svg"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 group-hover:text-emerald-400 transition-colors">
                          <Camera className="w-6 h-6 mb-1" />
                          <span className="text-xs font-medium">Photo</span>
                        </div>
                      )}
                    </div>
                  </div>

            
                  <div className="pt-12 text-center space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-100">{regInfo.name || "Your Name"}</h3>
                      <p className="text-emerald-600 font-medium">@{regInfo.username || "username"}</p>
                    </div>

                    <div className="space-y-2 text-left">
                      <label className="text-gray-200 text-sm font-medium block">Bio</label>
                      <textarea
                        name="bio"
                        onChange={handleChange}
                        placeholder="Tell us about yourself..."
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none h-20 text-gray-100 placeholder-gray-400"
                        disabled={isLoading}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                      disabled={isLoading}
                      onClick={handleSecondSubmit}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Registering...</span>
                        </>
                      ) : (
                        <>
              
                          <span>Register</span>
                        </>
                      )}
                    </button>

                    {registered && (
                      <div className="bg-green-900/50 border border-green-700 rounded-lg p-3 text-green-300 text-sm">
                        {registered}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
