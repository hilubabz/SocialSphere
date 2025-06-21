import {User,Users} from "lucide-react"

export default function FollowCard(){
    return(
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center space-x-2 mb-4">
                            <Users className="w-5 h-5 text-purple-400" />
                            <h3 className="text-white font-semibold">Who to follow</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">Sarah Johnson</p>
                                        <p className="text-white/50 text-sm">@sarahj</p>
                                    </div>
                                </div>
                                <button className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-sm font-medium transition-colors">
                                    Follow
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-teal-400 flex items-center justify-center">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">Mike Chen</p>
                                        <p className="text-white/50 text-sm">@mikec</p>
                                    </div>
                                </div>
                                <button className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-sm font-medium transition-colors">
                                    Follow
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-red-400 flex items-center justify-center">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">Emma Davis</p>
                                        <p className="text-white/50 text-sm">@emmad</p>
                                    </div>
                                </div>
                                <button className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-sm font-medium transition-colors">
                                    Follow
                                </button>
                            </div>
                        </div>
                    </div>
    )
}