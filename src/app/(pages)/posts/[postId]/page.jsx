"use client"
import Post from "@/components/postComponent";
import { useUserData } from "@/context/userContext";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function Page() {
    const { postId } = useParams()
    const [postData, setPostData] = useState(false)
    const [followers, setFollowers] = useState(false)
    const [following, setFollowing] = useState(false)
    const [newFollow, setNewFollow] = useState(0)
    const { userData, setUserData } = useUserData()
    const [selfProfile, setSelfProfile] = useState(false)
    const [comment, setComment] = useState([])
    const [like, setLike] = useState(0)
    const singlePost = true
    const [friend, setFriend] = useState()

    const fetchPostData = async () => {
        try {
            if (!postId) return
            const res = await fetch(`/apis/retrieveSinglePost?postId=${postId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const post = await res.json()
            if (post.success) {
                setPostData(post.data)
            }
            else {
                console.log(post.message)
            }

        }
        catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        fetchPostData()
    }, [postId, comment, like])
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
        if (!userData && !postData) return
        if (userData._id == postData._id) {
            setSelfProfile(true)
        }
        else {
            setSelfProfile(false)
        }
    }, [userData, postData])
    // console.log(postData)
    // console.log(followers)
    // console.log(following)
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-6 max-w-7xl mx-auto p-3 sm:p-4 pt-4 sm:pt-6">
                <div className="hidden md:block md:col-span-2 lg:col-span-3"></div>
                <div className="col-span-1 md:col-span-4 lg:col-span-6">
                    {postData && followers && following && (<Post postData={postData} userId={userData._id} setPost={setPostData} selfProfile={selfProfile} comment={comment} setComment={setComment} like={like} setLike={setLike} setNewFollow={setNewFollow} followers={followers} following={following} singlePost={singlePost} friend={friend}/>)}

                    {!postData && (
                        <div className="flex items-center justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                        </div>
                    )}
                </div>
                <div className="hidden md:block md:col-span-2 lg:col-span-3"></div>
            </div>
        </div>
    )
}