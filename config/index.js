const jwt = require('jsonwebtoken');
var User = require('../models/userModel');

function successHandle(res, data, status=200) {
  res.status(status).json({
    status: 'success',
    data
  });
}

// 捕捉未定義err，只要內部有error都會跑到catch，再由app.js的統一捕捉
const errorHandle = (fun) => {
  return function(req, res, next) {
    fun(req, res, next).catch(function (error) {
      return next(error);
    });
  }
}

// 捕捉自定義可預期err
const appError = ({ httpStatus = 400, errMessage }, next) => {
  const error = new Error(errMessage);
  error.statusCode = httpStatus;
  error.isOperational = true;
  next(error);
}

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
        reject(appError({ httpStatus: 401, errMessage: err }, next))
      } else {
        resolve(payload)
      }
    })
  })
  const currentUser = await User.findById(decoded.id);

  req.user = currentUser;
  next();
});

module.exports = {
  successHandle,
  errorHandle,
  appError,
  generateSendJWT,
  isAuth
};