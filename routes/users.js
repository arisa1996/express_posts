var express = require('express');
var router = express.Router();
var User = require('../models/userModel');
const { errorHandle, successHandle, appError } = require('../config/index');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const { getEncryptedPassword, isValidPassword } = require('../config/validation');

const generateSendJWT = (user, status, res) => {
  //產生 JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY
  });

  const output ={
    _id: user._id,
    token
  }
  successHandle(res, output, status);
}

const isAuth = errorHandle(async (req, res, next) => {
  // 確認 token 是否存在
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return appError({ errMessage: "你尚未登入！" }, next);
  }

  // 驗證 token 正確性
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(err)
      } else {
        resolve(payload)
      }
    })
  })
  const currentUser = await User.findById(decoded.id);

  req.user = currentUser;
  next();
});

/* 註冊 */
router.post('/sign_up', errorHandle(async (req, res, next) => {
  const { name, email, password } = req.body;
  const exist = await User.findOne({ email });

  if (!name || !email || !password)
    return appError({ errMessage: "欄位未填寫正確" }, next);
  
  if (!validator.isLength(name, { min: 2 })) 
    return appError({ errMessage: "暱稱至少 2 個字元以上" }, next);
  
  if (!validator.isEmail(email))
    return appError({ errMessage: "Email 格式不正確" }, next);
  
  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minUppercase: 0,
      minSymbols: 0,
    })
  )
    return appError({ errMessage: "密碼需至少 8 碼以上，並英數混合" }, next);
  
  if (exist)
    return appError({ errMessage: "帳號已被註冊，請替換新的 Email" }, next);
  
  const hash = await getEncryptedPassword(password);
  const user = await User.create({ name, email, password: hash });
  generateSendJWT(user, 201, res);
}));

/* 登入 */
router.post('/sign_in', errorHandle(async(req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return appError({ errMessage: "欄位未填寫正確" }, next);

  if (!validator.isEmail(email))
    return appError({ errMessage: "Email 格式不正確" }, next);

  const user = await User.findOne({ email }).select('+password');
  if (user === null)
    return appError({ errMessage: "此帳號尚未註冊" }, next);
  
  const auth = await isValidPassword(password, user.password)
  if(!auth)
    return appError({ errMessage: "密碼不正確" }, next);
  
  generateSendJWT(user, 200, res);
}))

/* 取得個人 */
router.get('/profile/', isAuth, errorHandle(async(req, res, next) => successHandle(res, req.user)))

/* 忘記密碼 */
router.post('/updatePassword', isAuth, errorHandle(async(req,res,next) => {
  const {password, confirmPassword } = req.body;
  if(password !== confirmPassword)
    return appError({ errMessage: "密碼不一致" }, next);
  
  const hash = await getEncryptedPassword(password);
  const user = await User.findByIdAndUpdate(req.user.id,{
    password: hash
  });
  generateSendJWT(user, 200, res)
}))

module.exports = router;