"use client"

import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, UserPlus, Send, X } from "lucide-react"
import ImageSlider from "./imageSlider"
import { formatDistanceToNow } from "date-fns"
import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { useUserData } from "@/context/userContext"

export default function Post({ postData, userId, setPost, selfProfile, comment, setComment, like, setLike, setNewFollow }) {
  const { userData, setUserData } = useUserData()
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  // const [comment, setComment] = useState([])
  const [isFollower, setIsFollower] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const latestCommentRef = useRef(null)

  useEffect(() => {
    if (showComments) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [showComments])

  useEffect(() => {
    if (userData.followers.includes(postData.userId?._id)) {
      setIsFollower(true)
    }
    if (userData.following.includes(postData.userId?._id)) {
      setIsFollowing(true)
    }
  }, [])

  const fetchComment = async () => {
    setComment([])
    if (!postData?._id) return
    const res = await fetch(`/apis/retrieveComment?postId=${postData._id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const result = await res.json()
    if (result.success) {
      setComment(result.data)
    }
  }

  const toggleLike = async () => {
    if (postData.likes.includes(userId)) {
      const res = await fetch("/apis/removeLike", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: postData._id, userId: userId }),
      })
      const result = await res.json()
      // console.log(result.message)
      if (result.success) {
        setPost((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postData._id
              ? {
                ...post,
                likes: post.likes.filter((id) => id !== userId),
              }
              : post,
          ),
        )
      }
    } else {
      const res = await fetch("/apis/likePost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: postData._id, userId: userId }),
      })
      const result = await res.json()
      // console.log(result.message)
      if (result.success) {
        setPost((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postData._id
              ? {
                ...post,
                likes: [...post.likes, userId],
              }
              : post,
          ),
        )
      }
    }
    setLike(prev => prev + 1)
  }

  const toggleComments = () => {
    fetchComment()
    setShowComments(!showComments)
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (newComment.trim()) {
      const res = await fetch("/apis/addComment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: postData._id, userId: userId, comment: newComment }),
      })
      const result = await res.json()
      fetchComment()
      console.log(result.message)
      setNewComment("")
    }
  }

  useEffect(() => {
    if (latestCommentRef.current) {
      latestCommentRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [comment])

  const followUser = async () => {
    try {
      const res = await fetch('apis/followUser', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId: userId, followedId: postData.userId._id })
      })
      const response = await res.json()
      // console.log(response.message)
      if(response.success){
        setNewFollow(prev=>prev+1)
        setIsFollowing(true);
        
      }
    }
    catch (e) {
      console.log(e)
    }
  }

  const unfollowUser = async () => {
    try {
      const res = await fetch('apis/unfollowUser', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId: userId, followedId: postData.userId._id })
      })
      const response = await res.json()
      // console.log(response.message)
      if(response.success){
        setNewFollow(prev=>prev+1)
        setIsFollowing(false);
        
      }
    }
    catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-gray-700/40 shadow-xl overflow-hidden">
        {/* Post Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/30">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full overflow-hidden ring-2 ring-emerald-400/50">
              <img
                src={postData.userId?.profilePicture || "/placeholder.svg"}
                className="h-full w-full object-cover"
                alt="Profile"
              />
            </div>
            <div>
              <Link
                href={`/profile/${postData.userId?._id}`}
                className="text-white font-semibold hover:text-emerald-300 cursor-pointer transition-colors"
              >
                {postData.userId?.name}
              </Link>
              <div className="text-gray-400 text-sm">
                {postData.userId?.username} • {formatDistanceToNow(new Date(postData.createdAt), { addSuffix: true })}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {!selfProfile && (
              <div className="space-x-2">
                {!isFollowing && !isFollower && (
                  <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 flex items-center space-x-2" onClick={followUser}>
                    <UserPlus className="w-4 h-4" />
                    <span>Follow</span>
                  </button>
                )}

                {isFollowing && !isFollower && (
                  <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 flex items-center space-x-2" onClick={unfollowUser}>
                    <UserPlus className="w-4 h-4" />
                    <span>Following</span>
                  </button>
                )}

                {!isFollowing && isFollower && (
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 flex items-center space-x-2" onClick={followUser}>
                    <UserPlus className="w-4 h-4" />
                    <span>Follow Back</span>
                  </button>
                )}

                {isFollower && isFollowing && (
                  <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 flex items-center space-x-2" onClick={unfollowUser}>
                    <UserPlus className="w-4 h-4" />
                    <span>Friends</span>
                  </button>
                )}
              </div>
            )}
            <button className="text-white/60 hover:text-white p-2 rounded-full hover:bg-gray-700/50 transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Post Content */}
        <div className="p-3 border-b border-gray-700/30">
          <p className="text-white mb-4 leading-relaxed">{postData.caption}</p>
        </div>

        {/* Post Image Slider */}
        <ImageSlider photos={postData.photo} />

        {/*Like Comment*/}
        <div className="p-6 border-t border-gray-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button className="flex items-center space-x-2 text-white/70 hover:text-red-400 transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-red-500/10 transition-colors">
                  <Heart
                    className={`w-5 h-5 transition-all ease-in-out duration-400 ${postData.likes.includes(userId) ? "fill-red-600 text-red-600" : ""}`}
                    onClick={toggleLike}
                  />
                </div>
                <span className="text-sm font-medium">{postData.likes.length} Likes</span>
              </button>
              <button
                onClick={toggleComments}
                className="flex items-center space-x-2 text-white/70 hover:text-emerald-400 transition-colors group"
              >
                <div className="p-2 rounded-full group-hover:bg-emerald-500/10 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">{postData.comments.length} Comments</span>
              </button>
              {/* <button className="flex items-center space-x-2 text-white/70 hover:text-emerald-400 transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-emerald-500/10 transition-colors">
                  <Share className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">Share</span>
              </button> */}
            </div>
            {/* <button className="text-white/70 hover:text-emerald-400 transition-colors p-2 rounded-full hover:bg-emerald-500/10">
              <Bookmark className="w-5 h-5" />
            </button> */}
          </div>
        </div>
      </div>

      {/* Comments Modal Overlay */}
      {showComments && typeof window !== "undefined" && createPortal(
        <div className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4`}>
          <div className="bg-gray-800/90 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/40">
              <h2 className="text-white font-semibold text-lg">Comments</h2>
              <button
                onClick={toggleComments}
                className="text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex flex-col overflow-y-auto max-h-[60vh] min-h-[300px]">
              {comment.map((comments, index) => (
                <div
                  key={comments._id}
                  ref={index === comment.length - 1 ? latestCommentRef : null}
                  className="p-4 border-b border-gray-700/30 last:border-b-0 hover:bg-gray-700/30 transition-colors h-30"
                >
                  <div className="flex items-start space-x-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-emerald-400/30 flex-shrink-0">
                      <img
                        src={comments.userId?.profilePicture || "/placeholder.svg"}
                        className="h-full w-full object-cover"
                        alt={comments.userId?.name}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-white font-medium hover:text-emerald-300 cursor-pointer transition-colors">
                          {comments.userId?.name}
                        </span>
                        <span className="text-gray-400 text-sm">@{comments.userId?.username}</span>
                        <span className="text-gray-500 text-sm">•</span>
                        <span className="text-gray-400 text-sm">
                          {formatDistanceToNow(comments.createdAt, { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-white/90 leading-relaxed">{comments.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Comment Input - Fixed at bottom */}
            <div className="p-6 border-t border-gray-700/40 bg-gray-800/50">
              <form onSubmit={handleAddComment} className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-emerald-400/50 flex-shrink-0">
                  <img
                    src={
                      userData?.profilePicture ||
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"
                    }
                    className="h-full w-full object-cover"
                    alt="Your profile"
                  />
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full bg-gray-700/50 border border-gray-600/50 rounded-full px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-emerald-400 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>, document.body
      )}
    </>
  )
}
