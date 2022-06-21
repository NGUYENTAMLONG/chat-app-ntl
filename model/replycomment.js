const mongoose = require("mongoose");
const Comment = require("./comment");
const Schema = mongoose.Schema;
const replySchema = new Schema(
  {
    replyId: { type: String, required: true },
    username: { type: String, required: true },
    reply: { type: String, required: true },
    likes: { type: Number, required: true, default: 0 },
    commentId: { type: String, required: true, ref: Comment },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Reply", replySchema);
