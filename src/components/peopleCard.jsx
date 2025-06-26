"use client"
import { X, UserPlus } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PeopleCard({ person, userId, check, setCheck }) {
  const [isFollower, setIsFollower] = useState(false)

  useEffect(() => {
    if (person?.following.includes(userId)) {
      setIsFollower(true)
    }
  }, [])

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

  const handleDismiss = (personId) => {
    // Add your dismiss logic here
    console.log('Dismissing person:', personId)
  }

  return (
    <div className="group relative bg-gray-800/60 backdrop-blur-xl rounded-3xl p-6 hover:bg-gray-700/70 transition-all duration-500 ease-out border border-gray-600/40 hover:border-emerald-500/60 hover:shadow-2xl hover:shadow-emerald-500/15 hover:-translate-y-3 transform w-72 shadow-lg">
      {/* Dismiss Button */}
      <button
        onClick={() => handleDismiss(person.id)}
        className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-200 p-2 rounded-full hover:bg-gray-700/50 transition-all duration-300 z-10"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Profile Section */}
      <div className="text-center">
        <div className="relative mb-4">
          <div className="relative">
            <img
              src={person.profilePicture || "/placeholder.svg"}
              alt={person.name}
              className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-emerald-500/50 group-hover:ring-emerald-400/70 transition-all duration-300 shadow-lg"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-gray-900/20 via-transparent to-transparent mx-auto w-20 h-20"></div>

          </div>
        </div>

        {/* User Info */}
        <div className="mb-4">
          <h3 className="text-white text-base font-bold mb-1 tracking-tight">{person.username}</h3>
          <p className="text-emerald-400 text-sm mb-2 font-medium">{person.name}</p>

          {person.mutualFollowers.length != 0 && (
            <div className="bg-emerald-900/30 rounded-xl p-2 mb-3 border border-emerald-500/30">
              <p className="text-gray-300 text-sm flex flex-col items-center justify-center gap-1">
                <span className="font-medium">
                  Followed by <span className="text-emerald-400 font-semibold">{person.mutualFollowerName}</span>
                </span>
                {person.mutualFollowers.length != 1 && (
                  <span className="text-xs text-gray-400">
                    & {person.mutualFollowers.length - 1} other mutual followers
                  </span>
                )}
              </p>
            </div>
          )}

          {person.mutualFollowers.length == 0 && (
            <div className="bg-gray-700/60 rounded-xl p-2 mb-3 border border-gray-600/50">
              <p className="text-gray-300 text-sm flex flex-col items-center justify-center gap-1">
                <span className="font-medium text-emerald-400">Suggested For You</span>
                <span className="text-xs text-gray-400">
                  {isFollower ? (
                    <span className="bg-emerald-900/50 text-emerald-400 px-2 py-1 rounded-full font-medium border border-emerald-500/30">
                      Follows You
                    </span>
                  ) : (
                    <span className="text-gray-500">New connection</span>
                  )}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={() => followUser(person._id)}
          className="w-full py-3 px-5 rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95"
        >
          <UserPlus className="w-5 h-5" />
          {isFollower ? "Follow Back" : "Follow"}
        </button>
      </div>
    </div>
  );
};