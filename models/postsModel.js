const { Schema, model } = require('mongoose')
const postSchema = new Schema(
    {
      user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: [true, 'user ID 未填寫'],
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
        default: Date.now
      },
      likes: [
        {
          type: Schema.ObjectId,
          ref: "user",
        },
      ]
    },
    // Mongoose 檔案的內部修訂號
    {
      versionKey: false
    }
);
const Post = model('Post', postSchema);

module.exports = Post;