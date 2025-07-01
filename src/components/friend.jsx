"use client"

export default function Friend({ user, setSelectedUser, selectedUser, message, onlineUsers }) {


    const msg = message.filter(val => (val.senderId == user._id || val.receiverId == user._id))
    const latestMessage = msg[msg.length - 1]
    // console.log(latestMessage)

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    return (
        <div
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`p-4 border-b border-white/5 hover:bg-white/10 cursor-pointer transition-colors ${selectedUser?._id === user._id ? "bg-white/20 border-r-2 border-r-emerald-400" : "bg-transparent"
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
                    {onlineUsers.includes(user._id)&&(<div className="h-4 w-4 rounded-full bg-green-500 absolute bottom-[1px] right-[-4px]"></div>)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white truncate">{user.name}</h3>
                        <span className="text-xs text-gray-400">{latestMessage ? formatTime(latestMessage.createdAt) : ''}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-300 truncate">{latestMessage ? latestMessage?.message : 'Tap to Message'}</p>
                        {user.unread > 0 && (
                            <span className="bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                unread
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}