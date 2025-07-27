const LoadingComponent = () => (
    <div className="w-full inset-0 bg-gray-900/95 backdrop-blur-sm flex flex-col items-center justify-center min-h-screen z-50">
        <div className="relative flex flex-col items-center">
            <img
                src="/Logo.png"
                alt="SocialSphere Logo"
                className="w-16 h-16 sm:w-20 sm:h-20 mb-6 animate-pulse"
            />
            <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-white/70 text-sm sm:text-base font-medium animate-pulse">
                Loading...
            </p>
        </div>
    </div>
);

export default LoadingComponent;