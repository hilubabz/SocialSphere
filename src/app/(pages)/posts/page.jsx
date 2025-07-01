"use client"

import CreatePost from "@/components/createPost"
import FollowCard from "@/components/followCard"
import Post from "@/components/postComponent"
import Stats from "@/components/stats"
import { useUserData } from "@/context/userContext"
import { useState, useEffect } from "react"

export default function Page() {
  const { userData, setUserData } = useUserData()
  const [followingPost, setFollowingPost] = useState()
  const [postToggle, setPostToggle] = useState(false)
  const [post, setPost] = useState([])
  useEffect(() => {
    if (!userData?._id) return
    const getPost = async () => {
      const res = await fetch(`/apis/retrievePost?userId=${userData._id}`, {
        method: "GET",
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
        method: "GET",
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
     
      <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto p-4 pt-6">
    
        <div className="col-span-3 space-y-4 sticky top-20 self-start">
          <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/40 shadow-xl">
            <div className="flex items-center space-x-2 mb-4">
              <h3 className="text-white font-semibold">Posts</h3>
            </div>
            <div className="space-y-3">
              <div
                className={`cursor-pointer hover:bg-gray-700/50 p-2 rounded-lg transition-colors ${!postToggle ? "bg-gray-700/60" : ""}`}
              >
                <p className="text-gray-200 font-medium" onClick={() => setPostToggle(false)}>
                  All Posts
                </p>
              </div>
              <div
                className={`cursor-pointer hover:bg-gray-700/50 p-2 rounded-lg transition-colors ${postToggle ? "bg-gray-700/60" : ""}`}
              >
                <p className="text-gray-200 font-medium" onClick={() => setPostToggle(true)}>
                  Following Posts
                </p>
              </div>
            </div>
          </div>
        </div>

       
        <div className="col-span-6 space-y-6">
          <CreatePost />

        

          {!postToggle &&
            post &&
            post.map((val, index) => (
              <Post
                key={index}
                postData={val}
                userId={userData._id}
                setPost={setPost}
                followers={userData.followers}
                following={userData.following}
              />
            ))}
          {postToggle &&
            followingPost &&
            followingPost.map((val, index) => (
              <Post
                key={index}
                postData={val}
                userId={userData._id}
                setPost={setPost}
                followers={userData.followers}
                following={userData.following}
              />
            ))}
        </div>

        
        {/* <div className="col-span-3 space-y-4 sticky top-20 self-start">
          <FollowCard />
        </div> */}
      </div>
    </div>
  )
}
