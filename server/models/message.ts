import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  image: {
    type: String,
    default: "https://cdn.pixabay.com/photo/2018/03/10/12/00/teamwork-3213924_1280.jpg",
    minlength: 11,
    maxlength: 1024,
  },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Message =  mongoose.models.Message || mongoose.model("Message", MessageSchema, "messages");

export { Message }