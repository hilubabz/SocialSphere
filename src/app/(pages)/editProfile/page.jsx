"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, Save, ArrowLeft} from "lucide-react"
import { useUserData } from "@/context/userContext"
import Link from "next/link"
import { toast } from "react-toastify"

export default function EditProfilePage() {
  const { userData, setUserData } = useUserData()

  const [editedData, setEditedData] = useState([])



  const [isLoading, setIsLoading] = useState(false)
  const profileImageRef = useRef(null)
  const coverImageRef = useRef(null)

  useEffect(() => {
    setEditedData(userData)
  }, [userData])
  console.log(editedData)
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFile = async (event) => {
    const file = event.target.files[0];
    const photoName = event.target.name;

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const toastId = toast.loading("Uploading image...");

    try {
      const res = await fetch("/apis/uploadImage", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.url) {
        setEditedData((prev) => ({ ...prev, [photoName]: data.url }));
        toast.update(toastId, { 
          render: "Upload successful!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          closeOnClick: true,
        });
      } else {
        toast.update(toastId, {
          render: "Upload failed",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.update(toastId, {
        render: "Upload error",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/apis/editProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedData),
      })

      const result = await response.json()
      if (result.success) {
        setUserData((prev) => ({
          ...prev,
          ...editedData,
        }))
        alert("Profile updated successfully!")
      } else {
        alert(result.message || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("An error occurred while updating your profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-700/50 transition-all duration-300"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
              <p className="text-gray-400">Update your profile information</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/profile/${userData?._id}`}
              className="bg-gray-700/60 hover:bg-gray-600/70 text-white px-6 py-3 rounded-full font-medium transition-all duration-300"
            >
              Cancel
            </Link>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

       
        <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl border border-gray-700/40 p-8 mb-8 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-6">Photos</h2>

          {/* Cover Photo */}
          <div className="mb-8">
            <label className="block text-gray-300 font-medium mb-4">Cover Photo</label>
            <div className="relative h-48 rounded-2xl overflow-hidden bg-gray-700/50 border-2 border-dashed border-gray-600/50 hover:border-emerald-500/50 transition-colors">
              {editedData.coverPicture ? (
                <img src={editedData.coverPicture || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400">Click to upload cover photo</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => coverImageRef.current?.click()}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-full transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <input
                ref={coverImageRef}
                name="coverPicture"
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
              />
            </div>
          </div>

          {/* Profile Photo */}
          <div>
            <label className="block text-gray-300 font-medium mb-4">Profile Photo</label>
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-emerald-500/50 bg-gray-700/50">
                  <img src={editedData.profilePicture || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <button
                  onClick={() => profileImageRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  ref={profileImageRef}
                  type="file"
                  name="profilePicture"
                  accept="image/*"
                  onChange={handleFile}
                  className="hidden"
                />
              </div>
              <div>
                <p className="text-white font-medium mb-1">Change profile photo</p>
                <p className="text-gray-400 text-sm">JPG, PNG or GIF. Max size 5MB.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl border border-gray-700/40 p-8 mb-8 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 font-medium mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={editedData.name}
                onChange={handleInputChange}
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={editedData.username}
                onChange={handleInputChange}
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-transparent transition-all"
                placeholder="@username"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={editedData.email}
                onChange={handleInputChange}
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-transparent transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-3">Gender</label>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={editedData.gender === "Male"}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all ${editedData.gender === "Male"
                        ? "border-emerald-500 bg-emerald-500/20"
                        : "border-gray-500 hover:border-emerald-400"
                      }`}
                  >
                    {editedData.gender === "Male" && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                  </div>
                  <span className="text-gray-300 hover:text-white transition-colors">Male</span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={editedData.gender === "Female"}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all ${editedData.gender === "Female"
                        ? "border-emerald-500 bg-emerald-500/20"
                        : "border-gray-500 hover:border-emerald-400"
                      }`}
                  >
                    {editedData.gender === "Female" && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                  </div>
                  <span className="text-gray-300 hover:text-white transition-colors">Female</span>
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-300 font-medium mb-2">Bio</label>
              <textarea
                name="bio"
                value={editedData.bio}
                onChange={handleInputChange}
                rows="4"
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-transparent transition-all resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
