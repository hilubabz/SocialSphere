"use client"

import React, { useState,useEffect } from 'react';
import { X, UserPlus } from 'lucide-react';
import { useUserData } from '@/context/userContext';

const PeopleSuggestions = () => {
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [dismissedUsers, setDismissedUsers] = useState(new Set());
  const { userData, setUserData } = useUserData()
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/apis/getUsers?userId=${userData._id}`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json"
          }
        })
        const data = await res.json()
        if (data.success) {
          setUsers(data.data)
        }
      }
      catch (e) {
        console.log(e)
      }

    }

    fetchUsers()
  }, [userData])
  console.log(users)

  const suggestedPeople = [
    {
      id: 1,
      name: "Sarah Johnson",
      username: "sarahj_dev",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=200&h=200&fit=crop&crop=face",
      mutualFollowers: 12,
      isVerified: true
    },
    {
      id: 2,
      name: "Mike Chen",
      username: "mikec_photo",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      mutualFollowers: 8,
      isVerified: false
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      username: "emma_writes",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
      mutualFollowers: 24,
      isVerified: true
    },
    {
      id: 4,
      name: "Alex Thompson",
      username: "alexthompson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      mutualFollowers: 6,
      isVerified: false
    },
    {
      id: 5,
      name: "Lisa Park",
      username: "lisapark_design",
      avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=200&h=200&fit=crop&crop=face",
      mutualFollowers: 18,
      isVerified: true
    },
    {
      id: 6,
      name: "David Kumar",
      username: "davidk_data",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
      mutualFollowers: 15,
      isVerified: false
    },
    {
      id: 7,
      name: "Priya Sharma",
      username: "priya_design",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face",
      mutualFollowers: 9,
      isVerified: true
    },
    {
      id: 8,
      name: "James Wilson",
      username: "jameswilson",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop&crop=face",
      mutualFollowers: 21,
      isVerified: false
    }
  ];

  const handleFollow = (userId) => {
    setFollowedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleDismiss = (userId) => {
    setDismissedUsers(prev => new Set([...prev, userId]));
  };

  const visiblePeople = suggestedPeople.filter(person => !dismissedUsers.has(person.id));

  // Split into exactly 4 on top, 4 on bottom
  const firstRow = visiblePeople.slice(0, 4);
  const secondRow = visiblePeople.slice(4, 8);

  const PersonCard = ({ person, delay = 0 }) => {
    const isFollowed = followedUsers.has(person.id);

    return (
      <div
        className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-6 hover:from-slate-700/80 hover:to-slate-800/80 transition-all duration-500 ease-out border border-slate-600/20 hover:border-slate-500/40 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transform"
        style={{ animationDelay: `${delay}ms` }}
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

              {/* Online indicator */}
              <div className="absolute bottom-1 right-1/2 transform translate-x-6 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-800 shadow-lg"></div>
             
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
            onClick={() => handleFollow(person.id)}
            className={`w-full py-3 px-4 rounded-2xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${isFollowed
                ? 'bg-slate-700/80 text-slate-200 hover:bg-slate-600/80 border border-slate-600/50 hover:border-slate-500/70'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105'
              }`}
          >
            {!isFollowed && <UserPlus className="w-4 h-4" />}
            {isFollowed ? 'Following' : 'Follow'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Header */}
      <div className="relative border-b border-slate-700/50 bg-black/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white text-2xl font-bold tracking-tight mb-1">
                People you may know
              </h1>
              <p className="text-slate-400 text-sm">
                Connect with people in your network
              </p>
            </div>
            <button className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors duration-200">
              See all
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-8 py-12">
        {visiblePeople.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">No more suggestions</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* First Row - 4 people */}
            <div className="grid grid-cols-4 gap-8">
              {users&&users.map((person, index) => (
                <PersonCard key={person._id} person={person} delay={index * 100} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeopleSuggestions;