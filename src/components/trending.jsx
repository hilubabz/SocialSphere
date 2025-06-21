import {TrendingUp} from "lucide-react"

export default function Trending(){
    return(
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center space-x-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-purple-400" />
                            <h3 className="text-white font-semibold">Trending</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                                <p className="text-white/90 font-medium">#WebDevelopment</p>
                                <p className="text-white/50 text-sm">15.2K posts</p>
                            </div>
                            <div className="cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                                <p className="text-white/90 font-medium">#ReactJS</p>
                                <p className="text-white/50 text-sm">8.7K posts</p>
                            </div>
                            <div className="cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                                <p className="text-white/90 font-medium">#Design</p>
                                <p className="text-white/50 text-sm">12.4K posts</p>
                            </div>
                        </div>
                    </div>
    )
}