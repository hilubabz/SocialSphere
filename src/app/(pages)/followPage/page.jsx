"use client"

import PeopleCard from "@/components/peopleCard";
import { useUserData } from "@/context/userContext";
import { useState, useEffect } from "react";


export default function Page() {
  const [users, setUsers] = useState([])
  const visiblePeople = [1, 2, 3, 4]
  const [check,setCheck]=useState(false)


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
  }, [userData,check])


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
            <div className="grid grid-cols-4 gap-8">
              {users && users.map((person, index) => (

                <PeopleCard key={person._id} userId={userData._id} person={person} check={check} setCheck={setCheck} />

              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
