"use client"

import CreatePost from "@/components/createPost"
import FollowCard from "@/components/followCard"
import LoadingComponent from "@/components/loadingComponent"
import Post from "@/components/postComponent"
import Stats from "@/components/stats"
import { useUserData } from "@/context/userContext"
import { useState, useEffect } from "react"

export default function Page() {
  const { userData, setUserData } = useUserData()
  const [followingPost, setFollowingPost] = useState()
  const [postToggle, setPostToggle] = useState(false)
  const [post, setPost] = useState()
  const [comment, setComment] = useState([])
  const [like, setLike] = useState(0)
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [newFollow, setNewFollow] = useState(0)
  const [friend, setFriend] = useState([])
  const singlePost = false

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
  }, [userData, comment, like])
  // console.log(followingPost)

  // console.log(post)

  useEffect(() => {
    const fetchFollowerFollowing = async () => {
      try {
        if (!userData) return
        const res = await fetch(`/apis/fetchFollowerFollowing?userId=${userData._id}`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const response = await res.json()
        if (response.success) {
          const data = response.data
          setFollowers(data.followers)
          setFollowing(data.following)
        }
        else {
          console.log("Error fetching followers and following")
        }
      }
      catch (e) {
        console.log(e)
      }
    }
    fetchFollowerFollowing()
  }, [userData, newFollow])
  // console.log(followers,following)

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friendData = await fetch(`/apis/fetchFriends?userId=${userData?._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json.",
          },
        })
        const res = await friendData.json()
        setFriend(res.data)
      } catch (e) {
        console.log(e)
      }
    }
    if(!userData?._id) return
    fetchFriends()
  }, [userData._id])
  if(!post){
    return <LoadingComponent/> 
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 max-w-7xl mx-auto p-4 pt-6">

        <div className="hidden md:block md:col-span-3 space-y-4 sticky top-20 self-start">
          <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-gray-700/40 shadow-xl">
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


        {/* Mobile Post Toggle */}
        <div className="flex md:hidden justify-between items-center w-full bg-gray-800/60 backdrop-blur-lg rounded-xl p-3 mb-4">
          <button
            className={`flex-1 text-center py-2 px-3 rounded-lg transition-colors ${!postToggle ? "bg-emerald-500 text-white" : "text-gray-300"}`}
            onClick={() => setPostToggle(false)}
          >
            All Posts
          </button>
          <button
            className={`flex-1 text-center py-2 px-3 rounded-lg transition-colors ${postToggle ? "bg-emerald-500 text-white" : "text-gray-300"}`}
            onClick={() => setPostToggle(true)}
          >
            Following
          </button>
        </div>

        <div className="col-span-1 md:col-span-6 space-y-4 md:space-y-6">
          <CreatePost />
          {!postToggle &&
            post &&
            post.map((val, index) => (
              <Post
                key={index}
                postData={val}
                userId={userData._id}
                setPost={setPost}
                followers={followers}
                following={following}
                comment={comment}
                setComment={setComment}
                like={like}
                setLike={setLike}
                setNewFollow={setNewFollow}
                singlePost={singlePost}
                friend={friend}
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
                followers={followers}
                following={following}
                comment={comment}
                setComment={setComment}
                like={like}
                setLike={setLike}
                setNewFollow={setNewFollow}
                singlePost={singlePost}
                friend={friend}
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
