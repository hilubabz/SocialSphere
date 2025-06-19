"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { User, Mail, Lock, Calendar, Upload, Camera, Plus } from "lucide-react";

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
  });
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");
  const [valid, setValid] = useState(false);
  const [registered, setRegistered] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [coverPicture, setCoverPicture] = useState(null);

  const profilePictureRef = useRef(null);
  const coverPictureRef = useRef(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRegInfo({ ...regInfo, [name]: value });
  };

  const handleFile = (event) => {
    const file = event.target.files[0];
    const photoName = event.target.name;

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const mimeType = file.type;
          const base64 = reader.result.split(",")[1];
          const dataUrl = `data:${mimeType};base64,${base64}`;
          setRegInfo({ ...regInfo, [photoName]: dataUrl });

          photoName === "profilePicture"
            ? setProfilePicture(dataUrl)
            : setCoverPicture(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRePass = (event) => {
    const val = event.target.value;
    setRePassword(val);
  };

  const handleFirstSubmit = async (event) => {
    event.preventDefault();
    const datas = ["name", "email", "username", "dob", "gender", "password"];
    if (datas.some((val) => regInfo[val] === "") || rePassword === "") {
      setError("Fill all the fields");
    } else if (regInfo.password != rePassword) {
      setError("Password and Repassword do not match");
    } else {
      try {
        const res = await fetch("/apis/registerUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(regInfo),
        });
        const data = await res.json();
        setError(data.error);
        setValid(data.success);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleSecondSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch("/apis/addUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(regInfo),
      });
      const data = await res.json();
      setRegistered(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="grid lg:grid-cols-2 min-h-[800px]">
          {/* Left Panel - Registration Form */}
          <div className={`relative p-8 lg:p-12 flex flex-col justify-center transition-all duration-1000 ease-in-out ${
            valid ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
                <p className="text-white/70">Join our community today</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-white/90 text-sm font-medium">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/3 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                      <input
                        type="text"
                        name="name"
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/90 text-sm font-medium">Username</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/3 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                      <input
                        type="text"
                        name="username"
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                        placeholder="Choose username"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-white/90 text-sm font-medium">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/3 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-white/90 text-sm font-medium">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/3 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                      <input
                        type="date"
                        name="dob"
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/90 text-sm font-medium">Gender</label>
                    <div className="flex space-x-4 pt-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="Male"
                          onChange={handleChange}
                          className="w-4 h-4 text-purple-400 bg-white/10 border-white/20 focus:ring-purple-400"
                        />
                        <span className="text-white/90">Male</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="Female"
                          onChange={handleChange}
                          className="w-4 h-4 text-purple-400 bg-white/10 border-white/20 focus:ring-purple-400"
                        />
                        <span className="text-white/90">Female</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-white/90 text-sm font-medium">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/3 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                    <input
                      type="password"
                      name="password"
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                      placeholder="Create password"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-white/90 text-sm font-medium">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/3 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                    <input
                      type="password"
                      name="rePassword"
                      onChange={handleRePass}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                      placeholder="Confirm password"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-200 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  onClick={handleFirstSubmit}
                >
                  Create Account
                </button>

                <div className="text-center text-white/70">
                  Already have an account?{" "}
                  <Link href="/login" className="text-purple-300 hover:text-purple-200 font-medium transition-colors">
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Profile Setup */}
          <div className={`relative p-8 lg:p-12 flex flex-col justify-center transition-all duration-1000 ease-in-out ${
            valid ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}>
            <div className="absolute inset-0 bg-gradient-to-bl from-white/5 to-transparent"></div>
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-2">Setup Profile</h2>
                <p className="text-white/70">Customize your profile</p>
              </div>

              <div className="space-y-8">
                {/* Cover Photo Section */}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    name="coverPicture"
                    onChange={handleFile}
                    ref={coverPictureRef}
                    className="hidden"
                  />
                  <div
                    onClick={() => coverPictureRef.current.click()}
                    className="relative w-full h-40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border-2 border-dashed border-white/30 cursor-pointer hover:border-white/50 transition-all duration-300 overflow-hidden group"
                  >
                    {coverPicture ? (
                      <img
                        src={coverPicture}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60 group-hover:text-white/80 transition-colors">
                        <Upload className="w-8 h-8 mb-2" />
                        <span>Upload Cover Photo</span>
                      </div>
                    )}
                  </div>

                  {/* Profile Photo */}
                  <input
                    type="file"
                    accept="image/*"
                    name="profilePicture"
                    onChange={handleFile}
                    ref={profilePictureRef}
                    className="hidden"
                  />
                  <div
                    onClick={() => profilePictureRef.current.click()}
                    className="absolute -bottom-16 left-[37%] transform -translate-x-1/2 w-32 h-32 rounded-full border-4 border-white/20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 cursor-pointer hover:border-white/40 transition-all duration-300 overflow-hidden group"
                  >
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60 group-hover:text-white/80 transition-colors">
                        <Camera className="w-8 h-8 mb-1" />
                        <span className="text-xs">Photo</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* User Info */}
                <div className="pt-16 text-center space-y-4">
                  <h3 className="text-2xl font-bold text-white">{regInfo.name || "Your Name"}</h3>
                  <p className="text-purple-300">@{regInfo.username || "username"}</p>

                  <div className="space-y-2">
                    <label className="text-white/90 text-sm font-medium block">Bio</label>
                    <textarea
                      name="bio"
                      onChange={handleChange}
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all resize-none h-24"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    onClick={handleSecondSubmit}
                  >
                    Complete Registration
                  </button>

                  {registered && (
                    <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-3 text-green-200 text-sm mt-4">
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
  );
}