const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
      name: {
        type: String,
        required: [true, '姓名未填寫']
      },
      email: {
        type: String,
        required: [true, 'email未填寫']
      },
      password: {
        type: String,
        required: [true, '密碼未填寫'],
      },
      gender: {
        type: Number,
        default: 1,
      },
      image: {
        type: String,
        default: "https://fakeimg.pl/50x50/"
      },
      createdAt: {
        type: Date,
        default: Date.now,
        select: false
      }
    },
    { versionKey: false }
);
const User = model('User', userSchema);

module.exports = User;