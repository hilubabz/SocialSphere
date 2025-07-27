"use client"

import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, UserPlus, Send, X, Trash } from "lucide-react"
import ImageSlider from "./imageSlider"
import { formatDistanceToNow } from "date-fns"
import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { useUserData } from "@/context/userContext"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { useSocketData } from "@/context/socketContext"


export default function Post({ postData, userId, setPost, selfProfile, comment, setComment, like, setLike, setNewFollow, followers, following, singlePost, friend }) {
  const { userData, setUserData } = useUserData()
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  // const [comment, setComment] = useState([])
  const [isFollower, setIsFollower] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const latestCommentRef = useRef(null)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedFriendId, setSelectedFriendId] = useState(null)
  const router=useRouter()

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
    if (!userData) return;
    setIsFollower(false);
    setIsFollowing(false);
    if (Array.isArray(followers) && followers.includes(postData.userId?._id)) {
      setIsFollower(true);
    }
    if (Array.isArray(following) && following.includes(postData.userId?._id)) {
      setIsFollowing(true);
    }
  }, [userData, postData.userId?._id]);

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
    const isLiked = postData.likes.includes(userId);

    const url = isLiked ? "/apis/removeLike" : "/apis/likePost";

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId: postData._id, userId }),
    });

    const result = await res.json();

    if (result.success) {
      if (singlePost) {
        setPost((prev) => ({
          ...prev,
          likes: isLiked
            ? prev.likes.filter((id) => id !== userId)
            : [...prev.likes, userId],
        }));
      } else {
        setPost((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postData._id
              ? {
                ...post,
                likes: isLiked
                  ? post.likes.filter((id) => id !== userId)
                  : [...post.likes, userId],
              }
              : post,
          ),
        );
      }

      // Optional: update `like` if you're maintaining it separately
      setLike((prev) => (isLiked ? prev - 1 : prev + 1));
    }
  };


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
      const res = await fetch('/apis/followUser', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId: userId, followedId: postData.userId._id })
      })
      const response = await res.json()
      // console.log(response.message)
      if (response.success) {
        setNewFollow(prev => prev + 1)
        setIsFollowing(true);

      }
    }
    catch (e) {
      console.log(e)
    }
  }

  const unfollowUser = async () => {
    try {
      const res = await fetch('/apis/unfollowUser', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId: userId, followedId: postData.userId._id })
      })
      const response = await res.json()
      // console.log(response.message)
      if (response.success) {
        setNewFollow(prev => prev + 1)
        setIsFollowing(false);

      }
    }
    catch (e) {
      console.log(e)
    }
  }

  const handleRemovePost = async () => {
    try {
      const res = await fetch('/apis/removePost', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ _id: postData._id })
      })
      const data = await res.json()
      if (data.success) {
        setPost(prev => prev.filter(post => post._id !== postData._id));
        toast.success("Post Removed Successfully")
        setShowRemoveConfirm(false)
        setShowMoreOptions(false)
      }
      else {
        toast.error("Failed to Remove Post", data.message)
      }
    }
    catch (e) {
      // console.log(e)
      toast.error("An error occured while removing the post")
    }
  }

  const deleteComment = async (commentId) => {
    try {
      const res = await fetch('/apis/deleteComment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postId: postData._id, commentId: commentId })
      })
      const result = await res.json()
      if (result.success) {
        setShowRemoveConfirm(false)
        fetchComment()
      }
      else {
        toast.error('Failed to Delete Comment')
      }
    }
    catch (e) {
      toast.error('Error while deleting comment')
      console.log(e)
    }
  }

  // useEffect(()=>{
  //   socket=io()
  // },[])
  const socketContext=useSocketData()
  if(!socketContext) return <div>Loading....</div>
  const {socket,socketConnected}=socketContext

  const handleShare = async () => {
      try {
            const res = await fetch('/apis/sendMessage', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    senderId: userData._id,
                    receiverId: selectedFriendId,
                    message: `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${postData._id}`,
                    messageType: 'link'
                })
            })
            const result = await res.json()
            if (result.success) {
              toast.success('Link sent successfully')
                socket&&socket.emit('message', { messageId: result._id, senderId: userData._id, senderName: userData.name, receiverId: selectedFriendId, msg: 'Shared a link' })
                router.push(`/message/${selectedFriendId}`)
                // setInput('')
                // setCheckSentMessage(!checkSentMessage)
            }
            else {
                console.log("Failed to send message")
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
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700/30">
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden ring-2 ring-emerald-400/50 flex-shrink-0">
              <img
                src={postData.userId?.profilePicture || "/placeholder.svg"}
                className="h-full w-full object-cover"
                alt="Profile"
              />
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/profile/${postData.userId?._id}`}
                className="text-white font-semibold hover:text-emerald-300 cursor-pointer transition-colors block truncate text-sm sm:text-base"
              >
                {postData.userId?.name}
              </Link>
              <div className="text-gray-400 text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2">
                <span className="truncate">@{postData.userId?.username}</span>
                <span className="flex-shrink-0">•</span>
                <span className="flex-shrink-0">{formatDistanceToNow(new Date(postData.createdAt), { addSuffix: true })}</span>
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
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 flex items-center space-x-1 sm:space-x-2 whitespace-nowrap text-sm sm:text-base" onClick={followUser}>
                    <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Follow Back</span>
                  </button>
                )}

                {isFollower && isFollowing && (
                  <button className="bg-purple-500 hover:bg-purple-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base" onClick={unfollowUser}>
                    <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Friends</span>
                  </button>
                )}
              </div>
            )}
            <div className="relative">
              {(selfProfile||userData.isAdmin) && (<button
                className="text-white/60 hover:text-white p-2 rounded-full hover:bg-gray-700/50 transition-colors"
                onClick={() => setShowMoreOptions((prev) => !prev)}
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>)}
              {showMoreOptions && (
                <div className="absolute right-0 mt-2 w-44 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50 animate-fade-in">
                  <button
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-800 rounded-t-lg font-medium transition-colors flex items-center gap-2"
                    onClick={() => { setShowRemoveConfirm(true); setShowMoreOptions(false); }}
                  >
                    <X className="w-4 h-4" /> Remove Post
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-b-lg transition-colors"
                    onClick={() => setShowMoreOptions(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
              {/* Remove Post Confirmation Dialog */}
              {showRemoveConfirm && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
                  <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-8 w-full max-w-xs flex flex-col items-center animate-fade-in">
                    <h3 className="text-lg font-semibold text-white mb-4">Remove Post?</h3>
                    <p className="text-gray-300 mb-6 text-center">Are you sure you want to remove this post? This action cannot be undone.</p>
                    <div className="flex gap-4 w-full">
                      <button
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors"
                        onClick={handleRemovePost}
                      >
                        Yes, Remove
                      </button>
                      <button
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-colors"
                        onClick={() => setShowRemoveConfirm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
            <div className="flex items-center space-x-4 sm:space-x-6">
              <button className="flex items-center space-x-1.5 sm:space-x-2 text-white/70 hover:text-red-400 transition-colors group">
                <div className="p-1.5 sm:p-2 rounded-full group-hover:bg-red-500/10 transition-colors">
                  <Heart
                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-all ease-in-out duration-400 ${postData.likes.includes(userId) ? "fill-red-600 text-red-600" : ""}`}
                    onClick={toggleLike}
                  />
                </div>
                <span className="text-xs sm:text-sm font-medium">{postData.likes.length}<span className="hidden sm:inline"> Likes</span></span>
              </button>
              <button
                onClick={toggleComments}
                className="flex items-center space-x-1.5 sm:space-x-2 text-white/70 hover:text-emerald-400 transition-colors group"
              >
                <div className="p-1.5 sm:p-2 rounded-full group-hover:bg-emerald-500/10 transition-colors">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-xs sm:text-sm font-medium">{postData.comments.length}<span className="hidden sm:inline"> Comments</span></span>
              </button>
              <button
                onClick={() => setOpen(true)}
                className="flex items-center space-x-1.5 sm:space-x-2 text-white/70 hover:text-emerald-400 transition-colors group"
              >
                <div className="p-1.5 sm:p-2 rounded-full group-hover:bg-emerald-500/10 transition-colors">
                  <Share className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-xs sm:text-sm font-medium"><span className="hidden sm:inline">Share</span></span>
              </button>

              {/* Share Modal Overlay */}
              {open && typeof window !== "undefined" &&
                createPortal(
                  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
                      {/* Close Button */}
                      <button
                        className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <h3 className="text-lg font-semibold text-white mb-4">Select a Friend to Share</h3>

                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {friend.map(f => (
                          <label
                            key={f._id}
                            className="flex items-center space-x-3 p-2 rounded cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="friend"
                              checked={selectedFriendId === f._id}
                              onChange={() => setSelectedFriendId(f._id)}
                              className="form-radio text-emerald-500"
                            />
                            <img
                              src={f.profilePicture}
                              alt={f.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="text-sm">
                              <div className="font-medium text-white">{f.name}</div>
                              <div className="text-gray-500">@{f.username}</div>
                            </div>
                          </label>
                        ))}
                      </div>

                      <button
                        onClick={handleShare}
                        disabled={!selectedFriendId}
                        className="w-full mt-4 bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Share
                      </button>
                    </div>
                  </div>,
                  document.body
                )}
            </div>
            {/* <button className="text-white/70 hover:text-emerald-400 transition-colors p-2 rounded-full hover:bg-emerald-500/10">
              <Bookmark className="w-5 h-5" />
            </button> */}
          </div>
        </div>
      </div>

      {/* Comments Modal Overlay */}
      {showComments && typeof window !== "undefined" && createPortal(
        <div className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-2 sm:p-4`}>
          <div className="bg-gray-800/90 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-gray-700/50 shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-700/40">
              <h2 className="text-white font-semibold text-base sm:text-lg">Comments</h2>
              <button
                onClick={toggleComments}
                className="text-white/60 hover:text-white p-1.5 sm:p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex flex-col overflow-y-auto max-h-[50vh] sm:max-h-[60vh] min-h-[250px] sm:min-h-[300px]">
              {comment.map((comments, index) => (
                <div
                  key={comments._id}
                  ref={index === comment.length - 1 ? latestCommentRef : null}
                  className="p-3 sm:p-4 border-b border-gray-700/30 last:border-b-0 hover:bg-gray-700/30 transition-colors"
                >
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden ring-2 ring-emerald-400/30 flex-shrink-0">
                      <img
                        src={comments.userId?.profilePicture || "/placeholder.svg"}
                        className="h-full w-full object-cover"
                        alt={comments.userId?.name}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap justify-between gap-2 mb-1.5 sm:mb-2">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span className="text-white text-sm sm:text-base font-medium hover:text-emerald-300 cursor-pointer transition-colors truncate max-w-[120px] sm:max-w-none">
                            {comments.userId?.name}
                          </span>
                          <span className="text-gray-400 text-xs sm:text-sm truncate">@{comments.userId?.username}</span>
                          <span className="text-gray-500 text-xs sm:text-sm hidden sm:inline">•</span>
                          <span className="text-gray-400 text-xs sm:text-sm">
                            {formatDistanceToNow(comments.createdAt, { addSuffix: true })}
                          </span>
                        </div>
                        {userData && (comments.userId._id == userData._id||userData.isAdmin) && (
                          <div 
                            className="text-red-700 flex items-center gap-x-1 sm:gap-x-2 cursor-pointer text-sm sm:text-base" 
                            onClick={() => setShowRemoveConfirm(true)}
                          >
                            <Trash className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">Delete</span>
                          </div>
                        )}
                        {showRemoveConfirm && (
                          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
                            <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-4 sm:p-8 w-full max-w-xs flex flex-col items-center animate-fade-in">
                              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Remove Comment?</h3>
                              <p className="text-gray-300 mb-4 sm:mb-6 text-center text-sm sm:text-base">Are you sure you want to remove this comment? This action cannot be undone.</p>
                              <div className="flex gap-2 sm:gap-4 w-full">
                                <button
                                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 text-sm sm:text-base rounded-lg transition-colors"
                                  onClick={() => deleteComment(comments._id)}
                                >
                                  Yes, Remove
                                </button>
                                <button
                                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-colors"
                                  onClick={() => setShowRemoveConfirm(false)}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-white/90 leading-relaxed text-sm sm:text-base break-words">{comments.text}</p>
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
