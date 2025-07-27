"use client"

import LoadingComponent from "@/components/loadingComponent";
import PeopleCard from "@/components/peopleCard";
import { useUserData } from "@/context/userContext";
import { useState, useEffect } from "react";

export default function Page() {
  const [users, setUsers] = useState([])
  const visiblePeople = [1, 2, 3, 4]
  const [check, setCheck] = useState(false)
  
  const { userData, setUserData } = useUserData()
  
  useEffect(() => {
    const fetchUser = async () => {
      const user = await fetch(`/apis/getUsers?userId=${userData._id}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        }
      })
      const res = await user.json()
      if (res.success) {
        setUsers(res.data);
      }
    }
    fetchUser()
  }, [userData, check])
  if(!users){
    return <LoadingComponent/>
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Header */}
      <div className="relative border-b border-gray-700/60 bg-gray-800/70 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white text-3xl font-bold tracking-tight mb-2">People you may know</h1>
              <p className="text-emerald-400 text-base font-medium">Connect with people in your network</p>
            </div>
            <button className="text-emerald-400 text-sm font-semibold hover:text-emerald-300 transition-colors duration-200 bg-emerald-500/10 hover:bg-emerald-500/20 px-4 py-2 rounded-lg border border-emerald-500/30">
              See all
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-8 py-16">
        {visiblePeople.length === 0 ? (
          <div className="text-center py-24">
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-lg p-12 max-w-md mx-auto">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                
              </div>
              <p className="text-white text-lg font-medium">No more suggestions</p>
              <p className="text-emerald-400 text-sm mt-2">Check back later for new connections</p>
            </div>
          </div>
        ) : (
          <div className="space-y-16">
            <div className="flex flex-wrap gap-8 justify-center">
              {users &&
                users.map((person, index) => (
                  <div key={person?._id} className="transform hover:scale-105 transition-transform duration-300">
                    <PeopleCard userId={userData?._id} person={person} check={check} setCheck={setCheck} />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      
    </div>
  );
};