import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
    
   sender : { required: true,  type: mongoose.Schema.Types.ObjectId, ref: "User" },
   receiving: { required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" },
   createdAt: { type: Date, default: Date.now },
});

const Message =  mongoose.models.Message || mongoose.model("Message", MessageSchema, "messages");

export { Message }