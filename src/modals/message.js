const mongoose=require('mongoose')

const messageSchema=new mongoose.Schema({
    senderId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:'User'
    },
    receiverId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:'User'
    },
    message:{
        type:String,
        required:true
    }
}, { timestamps: true });

export default mongoose.models.Message || mongoose.model("Message", messageSchema);