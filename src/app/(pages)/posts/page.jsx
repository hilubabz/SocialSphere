"use client";

import CreatePost from "@/components/createPost";
import FollowCard from "@/components/followCard";
import Post from "@/components/postComponent";
import Stats from "@/components/stats";
import Trending from "@/components/trending";
import { useUserData } from "@/context/userContext";
import { useState, useEffect } from "react";


export default function Page() {
    const { userData, setUserData } = useUserData()
    const [followingPost, setFollowingPost] = useState()
    const [postToggle, setPostToggle]=useState(false)
    const [post, setPost] = useState([])
    useEffect(() => {
        if (!userData?._id) return;
        const getPost = async () => {
            const res = await fetch(`/apis/retrievePost?userId=${userData._id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const postData = await res.json()
            if (postData.success) {
                setPost(postData.data.reverse())
            }
        }
        getPost()

        const getFollowingPost = async () => {
            const res = await fetch(`/apis/retrieveFollowingPost?userId=${userData._id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const postData = await res.json()
            if (postData.success) {
                setFollowingPost(postData.data.reverse())
            }
        }
        getFollowingPost()
    }, [userData])
    // console.log(followingPost)

    // console.log(post)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
            {/* Main Content */}
            <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto p-4 pt-6">
                {/* Left Sidebar */}
                <div className="col-span-3 space-y-4 sticky top-20 self-start">
                    {/* Trending */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center space-x-2 mb-4">
                            <h3 className="text-white font-semibold">Posts</h3>
                        </div>
                        <div className="space-y-3">
                            <div className={`cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors ${!postToggle?"bg-white/5":""}`}>
                                <p className="text-white/90 font-medium" onClick={()=>setPostToggle(false)}>All Posts</p>
                            </div>
                            <div className={`cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors ${postToggle?"bg-white/5":""}`}>
                                <p className="text-white/90 font-medium" onClick={()=>setPostToggle(true)}>Following Posts</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Feed */}
                <div className="col-span-6 space-y-6">
                    {/* Create Post */}
                    <CreatePost />

                    {/* Post */}
                    
                    {!postToggle&&post && post.map((val, index) => (
                        <Post key={index} postData={val} userId={userData._id} setPost={setPost} followers={userData.followers} following={userData.following}/>
                    ))}
                    {postToggle&&followingPost && followingPost.map((val, index) => (
                        <Post key={index} postData={val} userId={userData._id} setPost={setPost} followers={userData.followers} following={userData.following}/>
                    ))}
                </div>

                {/* Right Sidebar */}
                <div className="col-span-3 space-y-4 sticky top-20 self-start">
                    {/* Who to Follow */}
                    <FollowCard />

                    {/* Quick Stats */}
                    <Stats />
                </div>
            </div>
        </div>
    );
}