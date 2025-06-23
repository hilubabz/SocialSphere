"use client";

import Post from "@/components/postComponent";
import { Camera, Edit, Settings, Grid, Bookmark, Heart, MessageCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";


export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('posts');

    const { userId } = useParams()
    const [userData, setUserData] = useState()
    const [selfProfile, setSelfProfile] = useState()
    const [post, setPost] = useState()
    const [sessionUserId,setSessionUserId]=useState()

    useEffect(() => {
        const retrieveUser = async () => {
            if (!userId) return
            setSessionUserId(JSON.parse(sessionStorage.getItem("login")))
            try {
                const res = await fetch(`/apis/retrieveUserInfo?userId=${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                const user = await res.json()
                setUserData(user.data)
            }
            catch (e) {
                console.log(e)
            }
        }
        retrieveUser()

        const retrievePost = async () => {
            try {
                const res = await fetch(`/apis/retrieveSelfPost?userId=${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                const user = await res.json()
                setPost(user.data)
            }
            catch (e) {
                console.log(e)
            }
        }
        retrievePost()
        userId == sessionUserId ? setSelfProfile(true) : setSelfProfile(false)
    }, [userId])

    if (!userData) return <div className="text-white text-center mt-10">Loading...</div>;

    else
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 backdrop-blur-md">
                <div className="max-w-4xl mx-auto px-4 py-8">

                    {/* Cover Photo Section */}
                    <div className="relative mb-8">
                        <div className="h-80 rounded-3xl overflow-hidden relative">
                            <img
                                src={userData.coverPicture}
                                alt="Cover"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                            {selfProfile && (
                                <button className="absolute top-4 right-4 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-lg border border-white/30 rounded-full p-3 text-white hover:from-white/30 hover:to-white/20 transition-all duration-300">
                                    <Camera className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Profile Picture */}
                        <div className="absolute -bottom-16 left-8">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white/50 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl">
                                    <img
                                        src={userData.profilePicture}
                                        alt={userData.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {selfProfile && (
                                    <button className="absolute bottom-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Profile Info Section */}
                    <div className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/30 p-8 mb-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-2">
                                    <h1 className="text-3xl font-bold text-white">{userData.name}</h1>
                                    {selfProfile && (
                                        <button className="text-white/70 hover:text-white p-2 rounded-full hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300">
                                            <Edit className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                                <p className="text-white/70 text-lg mb-4">@{userData.username}</p>
                                <div className="text-white/90 text-base leading-relaxed whitespace-pre-line mb-6">
                                    {userData.bio}
                                </div>
                            </div>

                            {selfProfile && (
                                <button className="bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm border border-white/30 rounded-full p-3 text-white hover:from-white/30 hover:to-white/20 transition-all duration-300">
                                    <Settings className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 mb-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white mb-1">{post && post.length}</div>
                                <div className="text-white/60 text-sm font-medium">Posts</div>
                            </div>
                            <div className="text-center cursor-pointer hover:scale-105 transition-transform duration-300">
                                <div className="text-2xl font-bold text-white mb-1">{(userData.followers)}</div>
                                <div className="text-white/60 text-sm font-medium">Followers</div>
                            </div>
                            <div className="text-center cursor-pointer hover:scale-105 transition-transform duration-300">
                                <div className="text-2xl font-bold text-white mb-1">{(userData.following)}</div>
                                <div className="text-white/60 text-sm font-medium">Following</div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {selfProfile && (
                            <div className="flex gap-3">
                                <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105">
                                    Edit Profile
                                </button>
                                <button className="flex-1 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm border border-white/30 hover:from-white/30 hover:to-white/20 text-white font-medium py-3 px-6 rounded-full transition-all duration-300">
                                    Share Profile
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Tabs Section */}
                    <div className="bg-gradient-to-r from-white/15 via-white/10 to-white/15 backdrop-blur-xl rounded-2xl border border-white/30 mb-8">
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab('posts')}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-l-2xl font-medium transition-all duration-300 ${activeTab === 'posts'
                                    ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border-b-2 border-purple-400'
                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                <Grid className="w-5 h-5" />
                                Posts
                            </button>
                            {selfProfile&&(<button
                                onClick={() => setActiveTab('saved')}
                                className={` flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-r-2xl font-medium transition-all duration-300 ${activeTab === 'saved'
                                    ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border-b-2 border-purple-400'
                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                <Bookmark className="w-5 h-5" />
                                Saved
                            </button>)}
                        </div>
                    </div>

                    {/* Posts Grid */}
                    {(activeTab === 'posts' && post != null) ? (
                        post.length > 0 ? (
                            post.map((val, index) => (
                                <Post key={index} postData={val} userId={sessionUserId} setPost={setPost} />
                            ))
                        ) : (
                            <div className="text-center py-16">
                                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl border border-white/20 p-12 max-w-md mx-auto">
                                    
                                    <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
                                
                                </div>
                            </div>
                        )
                    ) : null}


                    {activeTab === 'saved'&& (
                        <div className="text-center py-16">
                            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl border border-white/20 p-12 max-w-md mx-auto">
                                <Bookmark className="w-16 h-16 text-white/50 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-2">No saved posts yet</h3>
                                <p className="text-white/60">Posts you save will appear here</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
}