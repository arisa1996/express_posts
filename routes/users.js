var express = require('express');
var router = express.Router();
var User = require('../models/userModel');
const { errorHandle, successHandle } = require('../config/index');

/* 新增單筆 user */
router.post('/', async function(req, res, next) {
  try {
    const data = req.body;
    await User.create({
      name: data.name,
      email: data.email,
      password: data.password
    });
    successHandle(res, '新增會員成功');
  }catch(err) {
    errorHandle(res, err);
  }
});

/* 取得單筆 user */
router.get('/:id', async function(req, res, next) {
  try {
    const id = req.params.id
    const user = await User.find(id);
    if(user !== null){
      successHandle(res, user);
    }else{
      errorHandle(res, '無此會員');
    }
  }catch(err) {
    errorHandle(res, err);
  }
});

module.exports = router;