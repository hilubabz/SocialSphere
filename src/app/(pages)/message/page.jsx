"use client"

import { useState, useEffect } from "react"
import { Send, Search, MoreVertical, Info } from "lucide-react"
import { useUserData } from "@/context/userContext"

const mockMessages = [
  { id: 1, sender: "Alice", text: "Hi there! How's your day going?", time: "10:30 AM", avatar: "A" },
  {
    id: 2,
    sender: "You",
    text: "Hello! It's going great, thanks for asking. How about you?",
    time: "10:32 AM",
    avatar: "Y",
  },
  {
    id: 3,
    sender: "Alice",
    text: "I'm doing well! Just finished a great book. Do you have any recommendations?",
    time: "10:35 AM",
    avatar: "A",
  },
  { id: 4, sender: "You", text: "Oh, I love reading! What genre are you into?", time: "10:37 AM", avatar: "Y" },
  {
    id: 5,
    sender: "Alice",
    text: "I'm really into sci-fi and fantasy lately. Something with good world-building!",
    time: "10:39 AM",
    avatar: "A",
  },
]

export default function ChatPage() {
  const [messages, setMessages] = useState(mockMessages)
  const [input, setInput] = useState("")
  const [selectedUser, setSelectedUser] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [pasa, setPasa] = useState()
  const { userData, setUserData } = useUserData()

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
        setPasa(res.data)
      } catch (e) {
        console.log(e)
      }
    }
    fetchFriends()
  }, [userData._id])

  console.log(pasa)

  const handleSend = (e) => {
    if (e) e.preventDefault()
    if (!input.trim()) return

    const newMessage = {
      id: messages.length + 1,
      sender: "You",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      avatar: "Y",
    }

    setMessages([...messages, newMessage])
    setInput("")
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar */}
      <div className="w-80 bg-black/20 backdrop-blur-sm border-r border-white/10 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/10">
          <h1 className="text-xl font-bold text-white mb-4">Messages</h1>
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
          {pasa &&
            pasa.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`p-4 border-b border-white/5 hover:bg-white/10 cursor-pointer transition-colors ${
                  selectedUser?.id === user.id ? "bg-white/20 border-r-2 border-r-emerald-400" : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold`}>
                      <img
                        src={user?.profilePicture || "/placeholder.svg"}
                        className="h-full w-full object-cover rounded-full"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white truncate">{user.name}</h3>
                      <span className="text-xs text-gray-400">11:11</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-300 truncate">lastMessage</p>
                      {user.unread > 0 && (
                        <span className="bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          unread
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <header className="p-4 bg-black/20 backdrop-blur-sm border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold`}>
                <img
                  src={selectedUser?.profilePicture || "/placeholder.svg"}
                  className="h-full w-full object-cover rounded-full"
                />
              </div>
            </div>
            <div>
              <h2 className="font-semibold text-white">{selectedUser?.name}</h2>
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
        <main className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex items-end space-x-2 max-w-md ${msg.sender === "You" ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full ${msg.sender === "You" ? "bg-gradient-to-r from-emerald-500 to-emerald-600" : selectedUser.color} flex items-center justify-center text-white text-sm font-semibold`}
                >
                  {msg.avatar}
                </div>
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    msg.sender === "You"
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-br-md"
                      : "bg-white/10 backdrop-blur-sm text-white rounded-bl-md border border-white/20"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === "You" ? "text-emerald-100" : "text-gray-400"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </main>

        {/* Message Input */}
        <div className="p-4 bg-black/20 backdrop-blur-sm border-t border-white/10 sticky bottom-0">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-full focus:ring-emerald-400 focus:border-emerald-400 pr-12 text-white placeholder-gray-400"
                placeholder={`Message ${selectedUser.name}...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleSend(e)
                  }
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="absolute right-2 top-1/5 transform -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-2 rounded-full hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
