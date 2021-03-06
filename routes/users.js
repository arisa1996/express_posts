var express = require('express');
var router = express.Router();
var User = require('../models/userModel');
const { errorHandle, successHandle, appError, generateSendJWT, isAuth } = require('../config/index');
const validator = require('validator');
const { getEncryptedPassword, isValidPassword } = require('../config/validation');


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

/* 取得會員資料 */
router.get('/profile/', isAuth, errorHandle(async(req, res, next) => successHandle(res, req.user)))

/* 忘記密碼 */
router.post('/updatePassword', isAuth, errorHandle(async(req, res, next) => {
  const {password, confirmPassword } = req.body;
  if(password !== confirmPassword)
    return appError({ errMessage: "密碼不一致" }, next);
  
  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minUppercase: 0,
      minSymbols: 0,
    })
  )
    return appError({ errMessage: "密碼需至少 8 碼以上，並英數混合" }, next);
  
  const hash = await getEncryptedPassword(password);
  const user = await User.findByIdAndUpdate(req.user.id,{
    password: hash
  });
  generateSendJWT(user, 200, res)
}))

/* 更新會員資料 */
router.patch('/updateProfile', isAuth, errorHandle(async(req, res, next) => {
  const { name, sex, image } = req.body;

    if (!name || !sex) {
      return appError({ errMessage: "欄位未填寫正確" }, next);
    }

    if (!["male", "female"].includes(sex)) {
      return appError({ errMessage: "性別填寫錯誤" }, next);
    }

    if (!validator.isLength(name, { min: 2 })) 
    return appError({ errMessage: "暱稱至少 2 個字元以上" }, next);

    const updateData = {
      name,
      sex,
      image
    };

    const id = req.user.id;
    User.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
      function (err, user) {
        if (err) {
          return appError({ errMessage: "更新會員失敗" }, next);
        } else {
          successHandle(res, user);
        }
      }
    );
}))

module.exports = router;