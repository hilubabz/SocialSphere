"use client"
import { User, Users } from "lucide-react"

export default function FollowCard() {
  return (
    <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/40 shadow-xl">
      <div className="flex items-center space-x-2 mb-4">
        <Users className="w-5 h-5 text-emerald-400" />
        <h3 className="text-white font-semibold">Who to follow</h3>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">Sarah Johnson</p>
              <p className="text-gray-400 text-sm">@sarahj</p>
            </div>
          </div>
          <button className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 hover:border-emerald-500/50 text-white px-3 py-1 rounded-full text-sm font-medium transition-colors">
            Follow
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">Mike Chen</p>
              <p className="text-gray-400 text-sm">@mikec</p>
            </div>
          </div>
          <button className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 hover:border-emerald-500/50 text-white px-3 py-1 rounded-full text-sm font-medium transition-colors">
            Follow
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">Emma Davis</p>
              <p className="text-gray-400 text-sm">@emmad</p>
            </div>
          </div>
          <button className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 hover:border-emerald-500/50 text-white px-3 py-1 rounded-full text-sm font-medium transition-colors">
            Follow
          </button>
        </div>
      </div>
    </div>
  )
}
