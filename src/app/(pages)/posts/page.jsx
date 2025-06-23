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
    const [post, setPost] = useState([])
    useEffect(() => {
        if(!userData?._id) return;
        const getPost = async () => {
            const res = await fetch(`/apis/retrievePost?userId=${userData._id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const postData=await res.json()
            if(postData.success){
                setPost(postData.data)
            }
        }
        getPost()
    }, [userData])

    // console.log(post)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
            {/* Main Content */}
            <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto p-4 pt-6">
                {/* Left Sidebar */}
                <div className="col-span-3 space-y-4 sticky top-20 self-start">
                    {/* Trending */}
                    <Trending />
                </div>

                {/* Main Feed */}
                <div className="col-span-6 space-y-6">
                    {/* Create Post */}
                    <CreatePost />

                    {/* Post */}
                    {post && post.map((val,index) => (
                        <Post key={index} postData={val} userId={userData._id} setPost={setPost}/>
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