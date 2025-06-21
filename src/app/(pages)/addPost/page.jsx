"use client";
import { useState } from "react";
import { ImagePlus, Send, Sparkles, Hash, AtSign } from "lucide-react";
import { useUserData } from "@/context/userContext";

export default function Page() {
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const { userData, setUserData } = useUserData();

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (reader.result) {
          const mimeType = file.type;
          const base64 = reader.result.split(",")[1];
          const dataUrl = `data:${mimeType};base64,${base64}`;
          setImages((prev) => [...prev, dataUrl]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages((prev) => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // const post = { userId: userData._id.toString(), caption:caption, photo:images };
    // let res=await addPost(post)
    // console.log(res)
    const res = await fetch("/apis/addPost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userData._id,
        caption: caption,
        photo: images,
        createdAt:Date.now()
      }),
    });
    let data=await res.json()
    console.log(data.message)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Sparkles className="text-purple-400" />
            Create Post
          </h1>
          <p className="text-purple-200 opacity-80">
            Share your moment with the world
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Caption Section */}
          <div className="mb-8">
            <label className="block text-white font-semibold mb-4 text-lg">
              What's on your mind?
            </label>
            <div className="relative">
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your caption here... Use #hashtags and @mentions"
                className="w-full p-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none transition-all duration-300 min-h-[120px]"
                rows="4"
              />
              <div className="absolute bottom-3 right-3 flex gap-2">
                <Hash className="text-purple-300 w-4 h-4" />
                <AtSign className="text-purple-300 w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-right">
              <span className="text-purple-200 text-sm">
                {caption.length}/280
              </span>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="mb-8">
            <label className="block text-white font-semibold mb-4 text-lg">
              Add Images
            </label>

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-xl border border-white/20"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm"
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
                isDragging
                  ? "border-purple-400 bg-purple-400/10"
                  : "border-white/30 bg-white/5 hover:bg-white/10"
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
              <ImagePlus className="mx-auto mb-4 text-purple-300 w-12 h-12" />
              <p className="text-white mb-2 text-lg">Drag & drop images here</p>
              <p className="text-purple-200 text-sm">or click to browse</p>
            </div>
          </div>

          {/* Post Button */}
          <div className="flex justify-end">
            <button
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-3"
              disabled={!caption.trim() && images.length === 0}
              onClick={handleSubmit}
            >
              <Send className="w-5 h-5" />
              Share Post
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-purple-200 opacity-60 text-sm">
            Share your creativity with the community ✨
          </p>
        </div>
      </div>
    </div>
  );
}
