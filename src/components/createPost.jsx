"use client"
import { useUserData } from "@/context/userContext"
import Link from "next/link"



export default function CreatePost() {
  const { userData, setUserData } = useUserData()
  
  return (
    <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-gray-700/40 shadow-xl">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shrink-0">
          {/* <User className="w-6 h-6 text-white" /> */}
          <img
            src={userData.profilePicture || "/placeholder.svg"}
            className="h-full w-full object-cover rounded-full"
          />
        </div>
        <div className="flex-1 bg-gray-700/50 rounded-full px-3 sm:px-4 py-2 sm:py-3 cursor-pointer hover:bg-gray-700/70 transition-colors">
          <span className="text-gray-300 text-sm sm:text-base">What's happening?</span>
        </div>
        <Link href={'/addPost'} className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-3 sm:px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 text-sm sm:text-base shrink-0">
          Post
        </Link>
      </div>
    </div>
  )
}
