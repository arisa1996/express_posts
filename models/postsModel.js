const { Schema, model } = require('mongoose')
const postSchema = new Schema(
    {
      content: {
        type: String,
        required: [true, 'Content 未填寫']
      },
      tags: [
        {
          type: String,
          required: [true, '標籤(tags)未填寫'],
        }
      ],
      type: {
        type: String,
        required: [true, '文章類型(type)未填寫']
      },
      image: {
        type: String,
        default: ""
      },
      createdAt: {
        type: Date,
        default: Date.now,
        select: false
      },
      name: {
        type: String,
        required: [true, '貼文姓名未填寫']
      },
      likes: {
        type: Number,
        default: 0
      },
      comments: {
        type: Number,
        default: 0
      }
    }
);
const Post = model('Post', postSchema);

module.exports = Post;