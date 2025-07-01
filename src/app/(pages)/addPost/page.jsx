"use client"
import { useState } from "react"
import { ImagePlus, Send, Sparkles, Hash, AtSign } from "lucide-react"
import { useUserData } from "@/context/userContext"
import { useRouter } from "next/navigation"


export default function Page() {
  const [caption, setCaption] = useState("")
  const [images, setImages] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const { userData, setUserData } = useUserData()
  const router=useRouter()

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (reader.result) {
          const mimeType = file.type
          const base64 = reader.result.split(",")[1]
          const dataUrl = `data:${mimeType};base64,${base64}`
          setImages((prev) => [...prev, dataUrl])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImages((prev) => [...prev, e.target.result])
      }
      reader.readAsDataURL(file)
    })
  }

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
    if(data.success){
      router.push('/posts')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Sparkles className="text-emerald-400" />
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
              <div className="absolute bottom-3 right-3 flex gap-2">
                <Hash className="text-emerald-400 w-4 h-4" />
                <AtSign className="text-emerald-400 w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-right">
              <span className="text-gray-400 text-sm">{caption.length}/280</span>
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
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                isDragging ? "border-emerald-400 bg-emerald-900/20" : "border-gray-600 bg-gray-700/50 hover:bg-gray-700"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <ImagePlus className="mx-auto mb-4 text-emerald-400 w-12 h-12" />
              {/* <p className="text-white mb-2 text-lg">Drag & drop images here</p> */}
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

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-gray-400 text-sm">Share your creativity with the community ✨</p>
      </div>
    </div>
  )
}
