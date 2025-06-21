"use client";
import { Search, Home, Bell, Mail, User } from "lucide-react";
import { useEffect, useState, useContext } from "react";
import { useUserData } from "@/context/userContext";


export default function Navbar() {
  const {userData, setUserData} = useUserData({});

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`/apis/retrieveUserInfo?userId=${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
    //   console.log(data)
      if (data.success) {
        setUserData(data.data);
      } else {
        console.error("Failed to fetch user data:", data.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const userId = JSON.parse(sessionStorage.getItem("login"));
    if (userId) {
      fetchUserData(userId);
    }
  }, []);
  // console.log(userData)
  return (
    <nav className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <img src="/Logo.png" className="w-full h-full object-cover" />
            </div>
            <span className="text-white font-bold text-xl">SocialSphere</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2 text-white hover:text-purple-300 cursor-pointer transition-colors p-2 rounded-xl hover:bg-white/10">
              <Home className="w-5 h-5" />
              <span className="font-medium hidden sm:block">Home</span>
            </div>
            <div className="flex items-center space-x-2 text-white/70 hover:text-purple-300 cursor-pointer transition-colors p-2 rounded-xl hover:bg-white/10">
              <Search className="w-5 h-5" />
              <span className="font-medium hidden sm:block">Explore</span>
            </div>
            <div className="flex items-center space-x-2 text-white/70 hover:text-purple-300 cursor-pointer transition-colors p-2 rounded-xl hover:bg-white/10">
              <Bell className="w-5 h-5" />
              <span className="font-medium hidden sm:block">Notifications</span>
            </div>
            <div className="flex items-center space-x-2 text-white/70 hover:text-purple-300 cursor-pointer transition-colors p-2 rounded-xl hover:bg-white/10">
              <Mail className="w-5 h-5" />
              <span className="font-medium hidden sm:block">Messages</span>
            </div>
            <div className="flex items-center space-x-2 text-white/70 hover:text-purple-300 cursor-pointer transition-colors p-2 rounded-xl hover:bg-white/10">
              <User className="w-5 h-5" />
              <span className="font-medium hidden sm:block">Profile</span>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-purple-400/50 transition-all overflow-hidden">
              {/* <User className="w-4 h-4 text-white" /> */}
              <img src={userData.profilePicture} className="h-full w-full object-cover"/>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
