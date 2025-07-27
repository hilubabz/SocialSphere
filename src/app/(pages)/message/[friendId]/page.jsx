"use client"

import { useState, useEffect, useRef } from "react"
import { Send, Search, MoreVertical, Info, MessageCircleMore } from "lucide-react"
import { useUserData } from "@/context/userContext"
import Friend from "@/components/friend"
import { io } from "socket.io-client"
import { useParams, useRouter } from "next/navigation"
import { useSocketData } from "@/context/socketContext"


export default function ChatPage() {
    const router = useRouter()
    const [userMessage, setUserMessage] = useState([])
    const [selectedUserMessage, setSelectedUserMessage] = useState([])
    const [input, setInput] = useState("")
    const [selectedUser, setSelectedUser] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [friend, setFriend] = useState([])
    const { userData, setUserData } = useUserData()
    const [checkSentMessage, setCheckSentMessage] = useState(false)
    const [newMessage, setNewMessage] = useState(0)
    const [onlineUsers, setOnlineUsers] = useState([])
    const bottomRef = useRef(null)
    const { friendId } = useParams()

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
            if (!userData?._id) return; // Guard clause

            try {
                const friendData = await fetch(`/apis/fetchFriends?userId=${userData._id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const res = await friendData.json();
                setFriend(res.data);

                const selected = res.data.find(val => val._id === friendId);
                if (selected) {
                    setSelectedUser(selected);
                }
            } catch (e) {
                console.log(e);
            }
        };

        fetchFriends();
    }, [userData?._id, friendId]);

    // console.log(friendId)

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
        if(!userData?._id) return
        fetchMessages()
    }, [userData._id, checkSentMessage, newMessage])
    // console.log(userMessage)
    useEffect(() => {
        if (selectedUser?._id && userMessage) {
            let res = userMessage.filter(val => (val.senderId === selectedUser._id || val.receiverId === selectedUser._id))
            setSelectedUserMessage(res)
        } else {
            setSelectedUserMessage([])
        }
    }, [selectedUser, userMessage])


    const socketContext = useSocketData()
    if (!socketContext) return <div>Loading....</div>
    const { socket, socketConnected } = socketContext

    useEffect(() => {
        if (!userData?._id || !socketConnected || !socket) return

        // Set up socket event listeners
        const handleMessage = (msg) => {
            if (userData._id === msg.receiverId || userData._id === msg.senderId) {
                if (userData._id === msg.receiverId) {
                    socket.emit('messageDelivered', msg)
                }
                setNewMessage(prev => prev + 1)
            }
        }

        const handleOnlineUsers = (users) => {
            setOnlineUsers(users)
        }

        const handleMessageUpdates = () => {
            setNewMessage(prev => prev + 1)
        }

        // Add event listeners
        socket.on('message', handleMessage)
        socket.on('onlineUsers', handleOnlineUsers)
        socket.on('message_delivered', handleMessageUpdates)
        socket.on('messageDelivered', handleMessageUpdates)
        socket.on('messageSeen', handleMessageUpdates)
        socket.on('offlineUsers', handleOnlineUsers)

        // Emit that user is online
        socket.emit('online', userData._id)

        // Cleanup function
        return () => {
            socket.off('message', handleMessage)
            socket.off('onlineUsers', handleOnlineUsers)
            socket.off('message_delivered', handleMessageUpdates)
            socket.off('messageDelivered', handleMessageUpdates)
            socket.off('messageSeen', handleMessageUpdates)
            socket.off('offlineUsers', handleOnlineUsers)
        }
    }, [userData?._id, socketConnected, socket])
    console.log('Online Users: ', onlineUsers)
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedUserMessage]);


    const sendMessage = async (e, receiverId) => {
        e.preventDefault()
        try {
            let msgType = 'text'
            const regex = /\b((https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[^\s]*)?)/gi;
            if (input.match(regex)) {
                msgType = 'link'
            }
            const res = await fetch('/apis/sendMessage', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    senderId: userData._id,
                    receiverId: receiverId,
                    message: input,
                    messageType: msgType
                })
            })
            const result = await res.json()
            if (result.success) {
                socket.emit('message', { messageId: result._id, senderId: userData._id, senderName: userData.name, receiverId: receiverId, msg: input })
                setInput('')
                setCheckSentMessage(!checkSentMessage)
            }
            else {
                console.log("Failed to send message")
            }
        }
        catch (e) {
            console.log(e)
        }
    }


    useEffect(() => {
        if (!selectedUser && !selectedUserMessage && !userData) return

        else {
            selectedUserMessage.map((message) => {
                if (message.status == 'delivered' && message.receiverId == userData._id) {
                    socket.emit('messageSeen', message._id)
                }
            })
        }
    }, [selectedUser, selectedUserMessage])

    const handleLink = (message) => {
        const regex = /\b((https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[^\s]*)?)/gi;
        const link = message.match(regex);

        if (link && link.length > 0) {
            let url = link[0];
            if (!/^https?:\/\//i.test(url)) {
                url = 'https://' + url; // Add https:// if missing
            }
            window.location.href = url;
        }
    };


    return (
        <div className="flex h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Sidebar */}
            <div className={`${selectedUser ? 'hidden md:flex' : 'flex'} w-full md:w-80 bg-black/20 backdrop-blur-sm border-r border-white/10 flex-col`}>
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
            {selectedUser && (<div className="flex-1 flex flex-col w-full">
                {/* Chat Header */}
                <header className="p-3 sm:p-4 bg-black/20 backdrop-blur-sm border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <button 
                            onClick={() => router.push('/message')} 
                            className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="relative">
                            <div className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold`}>
                                <img
                                    src={selectedUser?.profilePicture || "/placeholder.svg"}
                                    className="h-full w-full object-cover rounded-full"
                                />
                            </div>
                        </div>
                        <div>
                            <h2 className="font-semibold text-white">{selectedUser?.name}</h2>
                            {onlineUsers.includes(selectedUser?._id) && <div className="text-green-500 text-sm">Active Now</div>}
                            {!onlineUsers.includes(selectedUser?._id) && <div className="text-gray-500 text-sm">Offline</div>}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <Info className="w-5 h-5 text-gray-300" />
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <MoreVertical className="w-5 h-5 text-gray-300" />
                        </button>
                    </div>
                </header>

                {/* Messages Area */}
                <main className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 pb-24 md:pb-20">
                    {selectedUserMessage.map((msg) => (
                        <div key={msg._id} className={`flex ${msg.senderId === userData._id ? "justify-end" : "justify-start"}`}>
                            <div className={`flex items-end space-x-2 max-w-[85%] sm:max-w-md ${msg.senderId === userData._id ? "flex-row-reverse space-x-reverse" : ""}`}>
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold`}
                                    style={msg.senderId === userData._id ? {} : { backgroundColor: selectedUser.color }}
                                >
                                    <img src={msg.senderId === userData._id ? userData.profilePicture : selectedUser.profilePicture} alt="profile" className="h-full w-full object-cover rounded-full" />
                                </div>
                                <div className="flex flex-col items-end w-full">
                                    <div
                                        className={`px-4 py-2 rounded-2xl ${msg.senderId === userData._id
                                            ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-br-md"
                                            : "bg-white/10 backdrop-blur-sm text-white rounded-bl-md border border-white/20"
                                            }`}
                                    >
                                        {msg.messageType != 'link' && <p className="text-sm">{msg.message}</p>}
                                        {msg.messageType == 'link' && <p onClick={() => handleLink(msg.message)} className="text-sm text-blue-700 underline cursor-pointer">{msg.message}</p>}
                                        <p className={`text-xs mt-1 ${msg.senderId === userData._id ? "text-emerald-100" : "text-gray-400"}`}>
                                            {formatTime(msg.createdAt)}
                                        </p>
                                    </div>
                                    {/* Message status for sent messages */}
                                    {msg.senderId === userData._id && (
                                        <div className="flex items-center gap-1 mt-1 mr-2">
                                            {msg.status === "seen" && (
                                                <>
                                                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                                                    <span className="text-xs text-green-400 font-medium">Seen</span>
                                                </>
                                            )}
                                            {msg.status === "delivered" && msg.status !== "seen" && (
                                                <>
                                                    <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
                                                    <span className="text-xs text-blue-400 font-medium">Delivered</span>
                                                </>
                                            )}
                                            {(!msg.status || msg.status === "sent") && (
                                                <>
                                                    <span className="w-2 h-2 rounded-full bg-gray-400 inline-block"></span>
                                                    <span className="text-xs text-gray-400 font-medium">Sent</span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    ))}
                    <div ref={bottomRef} />
                </main>

                {/* Message Input */}
                <div className="p-2 sm:p-4 bg-black/20 backdrop-blur-sm border-t border-white/10 fixed bottom-[2.75rem] left-0 right-0 md:sticky md:bottom-0 z-20 mb-2">
                    <div className="flex items-center space-x-2 sm:space-x-3 max-w-full px-2">
                        <form className="flex-1 relative" onSubmit={(e) => sendMessage(e, selectedUser._id)}>
                            <input
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-full focus:ring-emerald-400 focus:border-emerald-400 pr-10 sm:pr-12 text-white placeholder-gray-400 text-sm sm:text-base"
                                placeholder={`Message ${selectedUser.name}...`}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}

                            />
                            <button
                                onClick={(e) => sendMessage(e, selectedUser._id)}
                                disabled={!input.trim()}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-2 rounded-full hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>)}
            {!selectedUser && (
                <div className="hidden md:flex flex-col items-center justify-center flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-center px-6">
                    <div className="bg-white/5 rounded-full p-6 mb-6">
                        <MessageCircleMore className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h2 className="text-3xl font-semibold text-white mb-2">Start Messaging</h2>
                </div>
            )}
        </div>
    )
}
