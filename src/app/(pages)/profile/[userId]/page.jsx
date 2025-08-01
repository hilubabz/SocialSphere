"use client"

import LoadingComponent from "@/components/loadingComponent"
import Post from "@/components/postComponent"
import { useSocketData } from "@/context/socketContext"
import { useUserData } from "@/context/userContext"
import { Camera, Edit, Settings, Grid, Bookmark, UserPlus,X } from "lucide-react"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { toast } from "react-toastify"


export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts")
  const { userData, setUserData } = useUserData()
  const [isFollower, setIsFollower] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const { userId } = useParams()
  const [profileUser, setprofileUser] = useState()
  const [selfProfile, setSelfProfile] = useState()
  const [post, setPost] = useState()
  const [sessionUserId, setSessionUserId] = useState()
  const [comment, setComment] = useState([])
  const [like, setLike] = useState(0)
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [newFollow, setNewFollow] = useState(0)
  const [friend, setFriend] = useState()
  const [open, setOpen] = useState(false)
  const [selectedFriendId, setSelectedFriendId] = useState(null)

  const router = useRouter()

  useEffect(() => {
    setSessionUserId(JSON.parse(sessionStorage.getItem("login")))
  }, [])

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

  useEffect(() => {
    const retrieveUser = async () => {
      if (!userId) return

      try {
        const res = await fetch(`/apis/retrieveUserInfo?userId=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
        const user = await res.json()
        setprofileUser(user.data)
      } catch (e) {
        console.log(e)
      }
    }
    retrieveUser()

    const retrievePost = async () => {
      try {
        const res = await fetch(`/apis/retrieveSelfPost?userId=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
        const user = await res.json()
        setPost(user.data)
      } catch (e) {
        console.log(e)
      }
    }
    retrievePost()
    userId == sessionUserId ? setSelfProfile(true) : setSelfProfile(false)
  }, [userId, sessionUserId])

  useEffect(() => {
    if (!userData || !profileUser) return;
    if (Array.isArray(followers) && followers.includes(profileUser._id)) {
      setIsFollower(true);
    }
    if (Array.isArray(following) && following.includes(profileUser._id)) {
      setIsFollowing(true);
    }
  }, [profileUser, userData]);
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
    fetchFriends()
  }, [userData._id])

  // useEffect(() => {
  //   socket = io()
  // }, [])
  const socketContext=useSocketData()
  if(!socketContext) return <div>Loading...</div>
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
          message: `${process.env.NEXT_PUBLIC_BASE_URL}/profile/${userId}`,
          messageType: 'link'
        })
      })
      const result = await res.json()
      if (result.success) {
        toast.success('Link sent successfully')
        socket.emit('message', { messageId: result._id, senderId: userData._id, senderName: userData.name, receiverId: selectedFriendId, msg: 'Shared a link' })
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

  if (!profileUser) return <LoadingComponent/>
  else
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Cover Photo Section */}
          <div className="relative mb-8">
            <div className="h-80 rounded-3xl overflow-hidden relative">
              <img
                src={profileUser.coverPicture || "/placeholder.svg"}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              {selfProfile && (
                <button className="absolute top-4 right-4 bg-gray-800/60 backdrop-blur-lg border border-gray-600/50 rounded-full p-3 text-white hover:bg-gray-700/70 transition-all duration-300" onClick={() => router.push('/editProfile')}>
                  <Camera className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Profile Picture */}
            <div className="absolute -bottom-16 left-8 z-10">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-emerald-500/50 bg-gray-800/60 backdrop-blur-xl">
                  <img
                    src={profileUser.profilePicture || "/placeholder.svg"}
                    alt={profileUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {selfProfile && (
                  <button className="absolute bottom-2 right-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full p-2 text-white hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg" onClick={() => router.push('/editProfile')}>
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl border border-gray-700/40 p-8 mb-8 shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-3xl font-bold text-white">{profileUser.name}</h1>
                  {selfProfile && (
                    <button className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-emerald-500/20 transition-all duration-300" onClick={() => router.push('/editProfile')}>
                      <Edit className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <p className="text-emerald-400 text-lg mb-4">@{profileUser.username}</p>
                <div className="text-gray-200 text-base leading-relaxed whitespace-pre-line mb-6">
                  {profileUser.bio}
                </div>
              </div>

              {/* {selfProfile && (
                <button className="bg-gray-700/60 backdrop-blur-sm border border-gray-600/50 rounded-full p-3 text-white hover:bg-gray-600/70 transition-all duration-300">
                  <Settings className="w-5 h-5" />
                </button>
              )} */}
              {!selfProfile && (
                <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
                  <UserPlus className="w-4 h-4" />
                  {!isFollowing && !isFollower && <span>Follow</span>}
                  {isFollowing && !isFollower && <span>Following</span>}
                  {!isFollowing && isFollower && <span>Follow Back</span>}
                  {isFollower && isFollowing && <span>Friends</span>}
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{post && post.length}</div>
                <div className="text-gray-400 text-sm font-medium">Posts</div>
              </div>
              <div className="text-center cursor-pointer hover:scale-105 transition-transform duration-300">
                <div className="text-2xl font-bold text-white mb-1">{profileUser.followers.length}</div>
                <div className="text-gray-400 text-sm font-medium">Followers</div>
              </div>
              <div className="text-center cursor-pointer hover:scale-105 transition-transform duration-300">
                <div className="text-2xl font-bold text-white mb-1">{profileUser.following.length}</div>
                <div className="text-gray-400 text-sm font-medium">Following</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {selfProfile && (
                <button className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105" onClick={() => router.push('/editProfile')}>
                  Edit Profile
                </button>
              )}
              <button className="flex-1 bg-gray-700/60 backdrop-blur-sm border border-gray-600/50 hover:bg-gray-600/70 text-white font-medium py-3 px-6 rounded-full transition-all duration-300" onClick={() => setOpen(true)}>
                Share Profile
              </button>
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
          </div>

          {/* Tabs Section */}
          <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-700/40 mb-8 shadow-xl">
            <div className="flex">
              <button
                onClick={() => setActiveTab("posts")}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-l-2xl font-medium transition-all duration-300 ${activeTab === "posts"
                  ? "bg-gradient-to-r from-emerald-500/30 to-emerald-600/30 text-white border-b-2 border-emerald-400"
                  : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                  }`}
              >
                <Grid className="w-5 h-5" />
                Posts
              </button>
              {/* {selfProfile && (
                <button
                  onClick={() => setActiveTab("saved")}
                  className={` flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-r-2xl font-medium transition-all duration-300 ${
                    activeTab === "saved"
                      ? "bg-gradient-to-r from-emerald-500/30 to-emerald-600/30 text-white border-b-2 border-emerald-400"
                      : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                  }`}
                >
                  <Bookmark className="w-5 h-5" />
                  Saved
                </button>
              )} */}
            </div>
          </div>

          {/* Posts Grid */}
          {activeTab === "posts" && post != null ? (
            post.length > 0 ? (
              post.map((val, index) => (
                <Post key={index} postData={val} userId={sessionUserId} setPost={setPost} selfProfile={selfProfile} comment={comment} setComment={setComment} followers={followers} following={following} setNewFollow={setNewFollow} newFollow={newFollow} friend={friend} />
              ))
            ) : (
              <div className="text-center py-16">
                <div className="bg-gray-800/60 backdrop-blur-lg rounded-3xl border border-gray-700/40 p-12 max-w-md mx-auto shadow-xl">
                  <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
                </div>
              </div>
            )
          ) : null}

          {/* {activeTab === "saved" && (
            <div className="text-center py-16">
              <div className="bg-gray-800/60 backdrop-blur-lg rounded-3xl border border-gray-700/40 p-12 max-w-md mx-auto shadow-xl">
                <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No saved posts yet</h3>
                <p className="text-gray-400">Posts you save will appear here</p>
              </div>
            </div>
          )} */}
        </div>
      </div>
    )
}
