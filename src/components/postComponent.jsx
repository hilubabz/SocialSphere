"use client";

import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, UserPlus, } from "lucide-react"
import ImageSlider from "./imageSlider";
import { formatDistanceToNow } from "date-fns";

export default function Post({ postData, userId, setPost }) {


    const toggleLike = async () => {
        if (postData.likes.includes(userId)) {
            const res = await fetch('/apis/removeLike', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ postId: postData._id, userId: userId })
            })
            const result = await res.json()
            console.log(result.message)
            if (result.success) {
                setPost((prevPosts) =>
                    prevPosts.map((post) =>
                        post._id === postData._id
                            ? {
                                ...post,
                                likes: [...post.likes, userId],
                            }
                            : post
                    )
                );
            }
        }
        else {
            const res = await fetch('/apis/likePost', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ postId: postData._id, userId: userId })
            })
            const result = await res.json()
            console.log(result.message)
            if (result.success) {
                setPost((prevPosts) =>
                    prevPosts.map((post) =>
                        post._id === postData._id
                            ? {
                                ...post,
                                likes: [...post.likes, userId],
                            }
                            : post
                    )
                );
            }
        }
    }

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            {/* Post Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full overflow-hidden ring-2 ring-purple-400/50">
                        <img src={postData.userId?.profilePicture} className="h-full w-full object-cover" alt="Profile" />
                    </div>
                    <div>
                        <div className="text-white font-semibold hover:text-purple-300 cursor-pointer transition-colors">
                            {postData.userId?.name}
                        </div>
                        <div className="text-white/60 text-sm">{postData.userId?.username} • {formatDistanceToNow(new Date(postData.createdAt), { addSuffix: true })}</div>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
                        <UserPlus className="w-4 h-4" />
                        <span>Follow</span>
                    </button>
                    <button className="text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Post Content */}
            <div className="p-3 border-b border-white/10">
                <p className="text-white mb-4 leading-relaxed">
                    {postData.caption}
                </p>
            </div>

            {/* Post Image Slider */}
            <ImageSlider photos={postData.photo} />
            {/*Like Comment*/}
            <div className="p-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <button className="flex items-center space-x-2 text-white/70 hover:text-red-400 transition-colors group">
                            <div className="p-2 rounded-full group-hover:bg-red-500/10 transition-colors">
                                <Heart className="w-5 h-5" onClick={toggleLike} />
                            </div>
                            <span className="text-sm font-medium">{postData.likes.length} Likes</span>
                        </button>
                        <button className="flex items-center space-x-2 text-white/70 hover:text-blue-400 transition-colors group">
                            <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                                <MessageCircle className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium">23 Comments</span>
                        </button>
                        <button className="flex items-center space-x-2 text-white/70 hover:text-green-400 transition-colors group">
                            <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
                                <Share className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium">Share</span>
                        </button>
                    </div>
                    <button className="text-white/70 hover:text-purple-400 transition-colors p-2 rounded-full hover:bg-purple-500/10">
                        <Bookmark className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}