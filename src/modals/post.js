const { mongoose} = require("mongoose");

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
      type: Array,
      required: false,
    },
    likes: {
      type: Array,
      required: false,
      ref:"User"
    },
    comments: {
      type: Array,
      required: false,
      ref:"User"
    },
  },
  { timestamps: true }  // <== corrected here
);

export default mongoose.models.Post || mongoose.model("Post", postSchema);
