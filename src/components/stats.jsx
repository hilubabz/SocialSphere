export default function Stats(){
    return(
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                        <h3 className="text-white font-semibold mb-4">Your Activity</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-white/70">Posts this week</span>
                                <span className="text-white font-semibold">12</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/70">Followers gained</span>
                                <span className="text-green-400 font-semibold">+24</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/70">Total likes</span>
                                <span className="text-white font-semibold">1,247</span>
                            </div>
                        </div>
                    </div>
    )
}