"use client"
import { useState } from "react"
import { ImagePlus, Send} from "lucide-react"
import { useUserData } from "@/context/userContext"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"



export default function Page() {
  const [caption, setCaption] = useState("")
  const [images, setImages] = useState([])
  const { userData, setUserData } = useUserData()
  const router = useRouter()

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const toastId = toast.loading("Uploading images...");

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/apis/uploadImage", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (data.url) {
          setImages((prev) => [...prev, data.url]);
        } else {
          throw new Error("Failed to get URL from server");
        }
      }

      toast.update(toastId, {
        render: "All images uploaded!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
      });
    } catch (err) {
      console.error("Image upload error:", err);
      toast.update(toastId, {
        render: "One or more uploads failed",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };




  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    const res = await fetch("/apis/addPost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userData._id,
        caption: caption,
        photo: images,
        createdAt: Date.now(),
      }),
    })
    const data = await res.json()
    if (data.success) {
      router.push('/posts')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            Create Post
          </h1>
          <p className="text-gray-300">Share your moment with the world</p>
        </div>

        {/* Main Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-3xl p-8 shadow-xl">
          {/* Caption Section */}
          <div className="mb-8">
            <label className="block text-white font-semibold mb-4 text-lg">What's on your mind?</label>
            <div className="relative">
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your caption here... Use #hashtags and @mentions"
                className="w-full p-4 bg-gray-700 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 resize-none transition-all duration-300 min-h-[120px]"
                rows="4"
              />
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="mb-8">
            <label className="block text-white font-semibold mb-4 text-lg">Add Images</label>

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-xl border border-gray-600"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 `}

            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <ImagePlus className="mx-auto mb-4 text-emerald-400 w-12 h-12" />
              <p className="text-gray-400 text-sm">Click to browse</p>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={!caption.trim() && images.length === 0}
              onClick={handleSubmit}
            >
              <Send className="w-5 h-5" />
              Share Post
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
