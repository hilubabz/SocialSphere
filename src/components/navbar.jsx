"use client";
import { Search, Home, Bell, Mail, User } from "lucide-react";
import { useEffect, useState, useContext } from "react";
import { usePathname } from "next/navigation";
import { useUserData } from "@/context/userContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSocketData } from "@/context/socketContext";


export default function Navbar() {
  const { userData, setUserData } = useUserData(false);
  const [nav, setNav] = useState(1)
  const [logOut, setLogOut] = useState(false)
  const route = useRouter()
  const pathname = usePathname();
  // const {socket,setSocket}=useSocket()

  const socketContext = useSocketData()
  if (!socketContext) return <div>Loading....</div>
  const { socket, socketConnected } = socketContext
  useEffect(() => {
    if (socketConnected) {
      socket.on('message', (message) => {
        // console.log('"'+message.receiverId+'"')
        // console.log(sessionStorage.getItem('login'))
        // console.log('"'+message.receiverId+'"'==sessionStorage.getItem('login'))
        // console.log()
        if ('"' + message.receiverId + '"' === sessionStorage.getItem('login')) {
          if (!pathname.startsWith("/message")) {
            toast(`New Message: ${message.senderName}: ${message.msg}`, {
              autoClose: 3000,
            });
            socket.emit('messageDelivered', message)
          }
        }
      })
    }

  }, [pathname])

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`/apis/retrieveUserInfo?userId=${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      //   console.log(data)
      if (data.success) {
        setUserData(data.data);
        socket&&socket.emit('online', data.data._id)
      } else {
        console.error("Failed to fetch user data:", data.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const userId = JSON.parse(sessionStorage.getItem("login"));
    if (userId) {
      fetchUserData(userId);
    }
  }, []);
  // console.log(userData)

  const logOutUser = () => {
    // console.log(userData._id)
    socket&&socket.emit('offline', userData._id)
    socket&&socket.disconnect()
    sessionStorage.removeItem('login')
    setUserData('')
    route.push('/login')

  }

  return (
    <nav className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link href={'/posts'} className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <img src="/Logo.png" className="w-full h-full object-cover" />
            </div>
            <span className="text-white font-bold text-xl">SocialSphere</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link href={'/posts'} className={`flex items-center space-x-2 text-white/70 hover:text-emerald-300 hover:bg-white/10 cursor-pointer transition-colors p-2 rounded-xl }`} onClick={() => setNav(1)}>
              <Home className="w-5 h-5" />
              <span className="font-medium hidden sm:block">Home</span>
            </Link>
            <Link href={'/followPage'} className="flex items-center space-x-2 text-white/70 hover:text-emerald-300 cursor-pointer transition-colors p-2 rounded-xl hover:bg-white/10">
              <Search className="w-5 h-5" />
              <span className="font-medium hidden sm:block">Explore</span>
            </Link>
            {/* <Link href={'/notifications'} className="flex items-center space-x-2 text-white/70 hover:text-emerald-300 cursor-pointer transition-colors p-2 rounded-xl hover:bg-white/10">
              <Bell className="w-5 h-5" />
              <span className="font-medium hidden sm:block">Notifications</span>
            </Link> */}
            <Link href={'/message'} className="flex items-center space-x-2 text-white/70 hover:text-emerald-300 cursor-pointer transition-colors p-2 rounded-xl hover:bg-white/10">
              <Mail className="w-5 h-5" />
              <span className="font-medium hidden sm:block">Messages</span>
            </Link>
            <Link href={`/profile/${userData._id}`} className={`flex items-center space-x-2 text-white/70 hover:text-emerald-300 hover:bg-white/10 cursor-pointer transition-colors p-2 rounded-xl`}>
              <User className="w-5 h-5" />
              <span className="font-medium hidden sm:block">Profile</span>
            </Link>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-purple-400/50 transition-all relative" onClick={() => setLogOut(!logOut)}>
              <img src={userData.profilePicture} className="h-full w-full object-cover rounded-full" />
              <div className={`absolute top-7 ${logOut ? '' : 'hidden'}`} onClick={logOutUser}>Logout</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
