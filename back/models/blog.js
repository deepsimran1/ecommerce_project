const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    contentText: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    editor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    likeCount: {
      type: Number,
      default: 0,
    },

  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
