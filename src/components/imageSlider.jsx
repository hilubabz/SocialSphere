"use client"

import { useState } from "react";


export default function ImageSlider({ photos }) {
  const [current, setCurrent] = useState(0);

  if (!Array.isArray(photos) || photos.length === 0) return null;

  const prevImage = () =>
    setCurrent((current - 1 + photos.length) % photos.length);
  const nextImage = () => setCurrent((current + 1) % photos.length);

return (
    <div className="relative group w-full h-96 overflow-hidden">
        <div
            className="w-full h-full flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
        >
            {photos.map((photo, idx) => (
                <img
                    key={idx}
                    src={photo}
                    className="w-full h-96 object-contain flex-shrink-0"
                    alt={`Post content ${idx + 1}`}
                    draggable={false}
                />
            ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {photos.length > 1 && (
            <>
                <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/70 transition"
                    aria-label="Previous image"
                >
                    &#8592;
                </button>
                <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/70 transition"
                    aria-label="Next image"
                >
                    &#8594;
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                    {photos.map((_, idx) => (
                        <span
                            key={idx}
                            className={`block w-2 h-2 rounded-full ${
                                idx === current ? "bg-white" : "bg-white/40"
                            }`}
                        ></span>
                    ))}
                </div>
            </>
        )}
    </div>
);
}
