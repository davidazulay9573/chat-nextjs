import mongoose from "mongoose";
import { z } from 'zod'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    unique: true,
  },
  image: {
    url: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2018/03/10/12/00/teamwork-3213924_1280.jpg",
      minlength: 11,
      maxlength: 1024,
    },
    alt: {
      type: String,
      minlength: 6,
      maxlength: 255,
      default: "profile picture",
    },
    _id: {
      type: mongoose.Types.ObjectId,
      default: new mongoose.Types.ObjectId(),
    },
  },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const User = mongoose.models.User || mongoose.model("User", userSchema, "users");

export {User}