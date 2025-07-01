import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username:{
    type:String,
    required:true
  },
  gender:{
    type:String,
    required:true
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture:{
    type:String,
    required:true
  },
  coverPicture:{
    type:String,
    required:true
  },
  bio:{
    type:String,
    required:true
  },
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);