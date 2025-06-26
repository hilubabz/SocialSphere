"use client"
import { useUserData } from "@/context/userContext"

export default function CreatePost() {
  const { userData, setUserData } = useUserData()
  return (
    <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/40 shadow-xl">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center">
          {/* <User className="w-6 h-6 text-white" /> */}
          <img
            src={userData.profilePicture || "/placeholder.svg"}
            className="h-full w-full object-cover rounded-full"
          />
        </div>
        <div className="flex-1 bg-gray-700/50 rounded-full px-4 py-3 cursor-pointer hover:bg-gray-700/70 transition-colors">
          <span className="text-gray-300">What's happening?</span>
        </div>
        <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105">
          Post
        </button>
      </div>
    </div>
  )
}
