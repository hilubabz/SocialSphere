"use client"

import { useState, useEffect } from "react"
import { Shield} from "lucide-react"
import { useUserData } from "@/context/userContext"

export default function AdminPortal() {
  const[users,setUsers]=useState([])
  const [admin,setAdmin]=useState(false)
  const {userData,setUserData}=useUserData()

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toISOString().split('T')[0] 
  }
  

  useEffect(()=>{
    const fetchUsers=async ()=>{
        try{
            const result=await fetch('/apis/fetchUsersAdmin',{
                method:"GET",
                headers:{
                    'Content-Type':'application/json'
                }
            })
            const data=await result.json()
            if(data.success)
                setUsers(data.data)
            else{
                console.log(data.message)
            }
        }
        catch(e){
            console.log(e)
        }
    }
    fetchUsers()
  },[userData,admin])

  const handleAdmin=async (id,isAdmin)=>{
    try{
        if(isAdmin){
            const result=await fetch('/apis/removeAdmin',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({_id:id})
            })
            if(result){
                setAdmin(!admin)
            }
        }
        else{
            const result=await fetch('/apis/makeAdmin',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({_id:id})
            })
            if(result){
                setAdmin(!admin)
            }
        }
    }
    catch(e){
        console.log(e)
    }
  }
  if(!userData.isAdmin){
    return(
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-8 max-w-md w-full text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
                <p className="text-gray-300 mb-6">You don't have permission to access the admin portal. Please contact an administrator if you believe this is a mistake.</p>
                <button 
                    onClick={() => window.history.back()} 
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                    Go Back
                </button>
            </div>
        </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Admin Portal</h1>
        </div>

        {/* Users Table */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="px-6 py-4 text-left">User</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Role</th>
                  <th className="px-6 py-4 text-left">Join Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => userData._id!=user._id&&(
                  <tr key={user._id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.profilePicture}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isAdmin == true
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.isAdmin?'Admin':'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{formatDate(user.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title="Make Admin"
                          onClick={()=>handleAdmin(user._id,user.isAdmin)}
                        >
                          <Shield className="w-5 h-5 text-purple-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  )
}
