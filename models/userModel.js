const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
      name: {
        type: String,
        required: [true, '姓名未填寫']
      },
      email: {
        type: String,
        required: [true, 'email未填寫'],
        unique: true,
        lowercase: true,
        select: false
      },
      password: {
        type: String,
        required: [true, '密碼未填寫'],
        minlength: 8,
      },
      sex: {
        type: String,
        enum: ['male', 'female']
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