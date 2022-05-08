const { Schema, model } = require('mongoose')
const postSchema = new Schema(
    {
      user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: [true, '名稱必填'],
      },
      content: {
        type: String,
        required: [true, 'Content 未填寫']
      },
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
      likes: [
        {
          type: Schema.ObjectId,
          ref: "user",
        },
      ]
    },
    {
      versionKey: false
    }
);
const Post = model('Post', postSchema);

module.exports = Post;