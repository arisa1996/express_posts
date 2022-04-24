
function successHandle(res, data) {
  res.status(200).json({
    status: 'success',
    data
  });
}

function errorHandle (res, errorMessage, errorCode = 400) {
  res.status(errorCode).json({
    status: 'false',
    message: errorMessage
  });
};

module.exports = {
  successHandle,
  errorHandle
};