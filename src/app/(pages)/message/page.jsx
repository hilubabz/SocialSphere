"use client"

import { useState, useEffect, useRef } from "react"
import { Send, Search, MoreVertical, Info, MessageCircleMore } from "lucide-react"
import { useUserData } from "@/context/userContext"
import Friend from "@/components/friend"
import { useSocketData } from "@/context/socketContext"

let socket
export default function ChatPage() {
    const [userMessage, setUserMessage] = useState([])
    const [selectedUserMessage, setSelectedUserMessage] = useState([])
    const [input, setInput] = useState("")
    const [selectedUser, setSelectedUser] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [friend, setFriend] = useState()
    const { userData, setUserData } = useUserData()
    const [checkSentMessage, setCheckSentMessage] = useState(false)
    const [newMessage, setNewMessage] = useState(0)
    const [onlineUsers, setOnlineUsers] = useState([])
    const bottomRef = useRef(null)


    // console.log("Online Users: ",onlineUsers)


    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

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

    useEffect(() => {
        const fetchMessages = async () => {
            const res = await fetch(`/apis/retrieveMessage?userId=${userData._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const result = await res.json()
            setUserMessage(result.data)
        }
        fetchMessages()
    }, [userData._id, checkSentMessage, newMessage])
    // console.log(userMessage)
    useEffect(() => {
        let res = userMessage.filter(val => (val.senderId == selectedUser._id || val.receiverId == selectedUser._id))
        setSelectedUserMessage(res)
    }, [selectedUser, userMessage])

    const socketContext = useSocketData()
    if (!socketContext) return
    const { socket, socketConnected } = socketContext

    useEffect(() => {
        if (!socketConnected || !socket || !userData?._id) return

        // Emit online status when component mounts
        socket.emit('online', userData._id)

        // Set up event listeners
        const handleOnlineUsers = (users) => {
            setOnlineUsers(users)
        }

        const handleMessageUpdates = () => {
            setNewMessage(prev => prev + 1)
        }

        // Add event listeners
        socket.on('onlineUsers', handleOnlineUsers)
        socket.on('message_delivered', handleMessageUpdates)
        socket.on('messageDelivered', handleMessageUpdates)
        socket.on('messageSeen', handleMessageUpdates)
        socket.on('offlineUsers', handleOnlineUsers)

        // Cleanup function
        return () => {
            socket.off('onlineUsers', handleOnlineUsers)
            socket.off('message_delivered', handleMessageUpdates)
            socket.off('messageDelivered', handleMessageUpdates)
            socket.off('messageSeen', handleMessageUpdates)
            socket.off('offlineUsers', handleOnlineUsers)
        }
    }, [socketConnected, socket, userData?._id])
    console.log('Online Users: ', onlineUsers)
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedUserMessage]);

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Sidebar */}
            <div className="w-full md:w-80 bg-black/20 backdrop-blur-sm border-r border-white/10 flex flex-col">
                {/* Sidebar Header */}
                <div className="p-3 sm:p-4 border-b border-white/10">
                    <h1 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Messages</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-emerald-400 focus:border-emerald-400 text-white placeholder-gray-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Users List */}
                <div className="flex-1 overflow-y-auto">
                    {friend &&
                        [...friend]
                            .sort((a, b) => {
                                const aMsgs = userMessage.filter(
                                    (msg) =>
                                        (msg.senderId === a._id && msg.receiverId === userData._id) ||
                                        (msg.receiverId === a._id && msg.senderId === userData._id)
                                );
                                const bMsgs = userMessage.filter(
                                    (msg) =>
                                        (msg.senderId === b._id && msg.receiverId === userData._id) ||
                                        (msg.receiverId === b._id && msg.senderId === userData._id)
                                );
                                const aLatest = aMsgs.length > 0 ? Math.max(...aMsgs.map((m) => new Date(m.createdAt).getTime())) : 0;
                                const bLatest = bMsgs.length > 0 ? Math.max(...bMsgs.map((m) => new Date(m.createdAt).getTime())) : 0;
                                return bLatest - aLatest;
                            })
                            .map((user) => (
                                <Friend key={user._id} user={user} setSelectedUser={setSelectedUser} selectedUser={selectedUser} message={userMessage} onlineUsers={onlineUsers} />
                            ))}
                </div>
            </div>

            {/* Main Chat Area */}

            <div className="hidden md:flex flex-col items-center justify-center flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-center px-6">
                <div className="bg-white/5 rounded-full p-6 mb-6">
                    <MessageCircleMore className="w-10 h-10 text-emerald-400" />
                </div>
                <h2 className="text-3xl font-semibold text-white mb-2">Start Messaging</h2>
            </div>
        </div>
    )
}
