const { mongoose, model } = require("mongoose");


const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    caption:{
      type:String,
      required:true
    },
    photo:{
      type:String,
      required:false
    },
    likes:{
      type:Array,
      required:false
    },
    comments:{
      type:Array,
      required:false
    }
  },
  { timeStamps: true }
);

model.exports = mongoose.model("Post", postSchema);
