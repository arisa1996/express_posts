
function successHandle(res, data) {
  res.status(200).json({
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
};

module.exports = {
  successHandle,
  errorHandle,
  appError
};