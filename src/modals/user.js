
const { mongoose, model } = require("mongoose");
const followerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true } // ✅ Adds createdAt and updatedAt to each comment
);

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
    },
    username:{
        type:String,
        required:[true,'Username is required'],
        unique:true
    },
    dob:{
        type:Date,
        required:[true,'Date of Birth is required'],
    },
    password:{
        type:String,
        required:[true,'Password is required'],
    },
    profilePicture:{
        type:String,
        required:[false]
    },
    coverPicture:{
        type:String,
        required:[false]
    },
    bio:{
        type:String,
        required:[false]
    },
    followers:[followerSchema],
    following:[followerSchema]

},{ timestamps: true } )

export default mongoose.models.User || mongoose.model("User", userSchema);