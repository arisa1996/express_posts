var express = require('express');
var router = express.Router();
var User = require('../models/userModel');
const { errorHandle, successHandle, appError } = require('../config/index');

/* 新增單筆 user */
router.post('/', errorHandle(async (req, res, next) => {
  const data = req.body;
  await User.create({
    name: data.name,
    email: data.email,
    password: data.password
  });
  successHandle(res, '新增會員成功');
}));

/* 取得單筆 user */
router.get('/:id',errorHandle(async (req, res, next) => {
  const id = req.params.id
  const user = await User.find(id);
  if(user !== null){
    successHandle(res, user);
  }else{
    appError({ errMessage: "無此會員" }, next);
  }
}));

module.exports = router;