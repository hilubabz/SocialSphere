"use client"
import { X, UserPlus } from 'lucide-react';
import { useState } from 'react';

export default function PeopleCard({ person, userId, check,setCheck}) {
  const followUser = async () => {
    try {
      const res = await fetch('apis/followUser', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId: userId, followedId: person._id })
      })
      const response = await res.json()
      console.log(response.message)
      setCheck(!check)
    }
    catch (e) {
      console.log(e)
    }
  }
  return (
    <div
      className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-6 hover:from-slate-700/80 hover:to-slate-800/80 transition-all duration-500 ease-out border border-slate-600/20 hover:border-slate-500/40 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transform"
    >
      {/* Dismiss Button */}
      <button
        onClick={() => handleDismiss(person.id)}
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white p-2 rounded-full hover:bg-black/30 transition-all duration-300 z-10"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Profile Section */}
      <div className="text-center">
        <div className="relative mb-4">
          <div className="relative">
            <img
              src={person.profilePicture}
              alt={person.name}
              className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-gradient-to-r from-blue-400/30 to-purple-400/30 group-hover:ring-blue-400/50 transition-all duration-300"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/30 via-transparent to-transparent mx-auto w-20 h-20"></div>

          </div>
        </div>

        {/* User Info */}
        <div className="mb-5">
          <h3 className="text-white text-base font-semibold mb-1 tracking-tight">
            {person.username}
          </h3>
          <p className="text-slate-300 text-sm mb-2 font-light">
            {person.name}
          </p>
          <p className="text-slate-400 text-xs flex items-center justify-center gap-1">
            <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
            {person.mutualFollowers} mutual followers
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => followUser(person._id)}
          className={`w-full py-3 px-4 rounded-2xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105
              }`}
        >
          <UserPlus className="w-4 h-4" />
          Follow
        </button>
      </div>
    </div>
  );
};