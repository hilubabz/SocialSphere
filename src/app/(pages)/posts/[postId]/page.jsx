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
    const singlePost=true

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
        if (userData._id == postData._id){
            setSelfProfile(true)
        }
        else{
            setSelfProfile(false)
        }
    }, [userData, postData])
    // console.log(postData)
    // console.log(followers)
    // console.log(following)

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto p-4 pt-6 ">
                <div className="col-span-3"></div>
                <div className="col-span-6">
                    {postData &&followers&&following&& (<Post postData={postData} userId={userData._id} setPost={setPostData} selfProfile={selfProfile} comment={comment} setComment={setComment} like={like} setLike={setLike} setNewFollow={setNewFollow} followers={followers} following={following} singlePost={singlePost} />)}

                    {!postData && <div>Loading...</div>}
                </div>
                <div className="col-span-3"></div>
            </div>
        </div>
    )
}