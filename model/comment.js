const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const commentSchema = new Schema(
  {
    commentId: { type: String, required: true },
    username: { type: String, required: true },
    comment: { type: String, required: true },
    likes: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
