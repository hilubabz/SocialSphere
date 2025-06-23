
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: { type: String, required: true },
  },
  { timestamps: true } // ✅ Adds createdAt and updatedAt to each comment
);

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    photo: {
      type: [String], // You can make this more specific
      required: false,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
    comments: [commentSchema], // ✅ structured comment array
  },
  { timestamps: true } // For the post itself
);


export default mongoose.models.Post || mongoose.model("Post", postSchema);
