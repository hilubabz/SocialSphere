"use client"
import { useUserData } from "@/context/userContext"
import {User} from "lucide-react"
import { useState } from "react"


export default function CreatePost(){
    const {userData,setUserData}=useUserData()
    return(
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                                        {/* <User className="w-6 h-6 text-white" /> */}
                                        <img src={userData.profilePicture} className="h-full w-full object-cover rounded-full"/>
                                    </div>
                                    <div className="flex-1 bg-white/10 rounded-full px-4 py-3 cursor-pointer hover:bg-white/15 transition-colors">
                                        <span className="text-white/60">What's happening?</span>
                                    </div>
                                    <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105">
                                        Post
                                    </button>
                                </div>
                            </div>
    )
}