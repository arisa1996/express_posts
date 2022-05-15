var express = require('express');
var router = express.Router();
var Post = require('../models/postsModel');
const { errorHandle, successHandle, appError } = require('../config/index');

/* 新增單筆 post */
router.post('/', errorHandle(async (req, res, next) => {
  const data = req.body;
  const user = await User.findById(data.userId).exec();

  if (data === undefined) {
    appError({ errMessage: "未填寫內容" }, next);
    return;
  }

  if (user === null) {
    appError({ errMessage: "此 User 不存在" }, next);
    return;
  }

  await Post.create(data);
  const getAllPosts = await Post.find().populate({
    path: 'user',
    select: 'name image'
  });
  successHandle(res, getAllPosts);
}));

/* 取得所有 post */
router.get('/', errorHandle(async (req, res) => {
  // 貼文時間由新到舊
  const timeSort = req.query.timeSort === "asc" ? "createdAt" : "-createdAt";
  const q = req.query.q !== undefined ? {'content': new RegExp(req.query.q)} : {};

  const posts = await Post.find(q).populate({
    path: 'user',
    select: 'name image'
  }).sort(timeSort);
  
  successHandle(res, posts);
}));

/* 取得單筆 post */
router.get('/:id', errorHandle(async (req, res, next) => {
  const id = req.params.id
  const post = await Post.find(id);
  if (post === null) {
    appError({ errMessage: "無此文章" }, next);
    return;
  }
  
  successHandle(res, post);
}));

/* 修改單筆 post */
router.patch('/:id', errorHandle(async (req, res, next) => {
  const id = req.params.id
  const data = req.body

  if(data.name && data.content){
    const post = await Post.findByIdAndUpdate(id, data, { new: true });
    if(post !== null){
      successHandle(res, post);
    }else{
      appError({ errMessage: "無此文章" }, next);
    }
  }else{
    appError({ errMessage: "格式錯誤或無該筆資料" }, next);
  }
}));

/* 刪除單筆 post */
router.delete('/:id', errorHandle(async (req, res, next) => {
  const id = req.params.id
  const post = await Post.findByIdAndDelete(id);

  if (post !== null) {
    successHandle(res, '刪除成功');
  } else {
    appError({ errMessage: "文章不存在" }, next);
  }
}));

/* 刪除全部 post */
router.delete('/', errorHandle(async (req, res, next) => {
  const posts = await Post.deleteMany({});
  successHandle(res, posts);
}));

module.exports = router;
