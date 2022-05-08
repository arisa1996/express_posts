var express = require('express');
var router = express.Router();
var Post = require('../models/postsModel');
const { errorHandle, successHandle } = require('../config/index');

/* 新增單筆 post */
router.post('/', async function(req, res, next) {
  try {
    const data = req.body;
    if (data !== undefined) {
      await Post.create(data);
      const getAllPosts = await Post.find().populate({
        path: 'user',
        select: 'name image'
      });
      successHandle(res, getAllPosts);
    } else {
      errorHandle(res, "請填寫內容");
    }
  }catch(err) {
    errorHandle(res, err);
  }
});

/* 取得所有 post */
router.get('/', async function(req, res, next) {
  try {
    // 貼文時間由新到舊
    const timeSort = req.query.timeSort === "asc" ? "createdAt" : "-createdAt"
    const q = req.query.q !== undefined ? {'content': new RegExp(req.query.q)} : {};
    console.log(req)

    const posts = await Post.find(q).populate({
      path: 'user',
      select: 'name image'
    }).sort(timeSort);
    
    successHandle(res, posts);
  }catch(err) {
    console.log(err)
    errorHandle(res, err);
  }
});

/* 取得單筆 post */
router.get('/:id', async function(req, res, next) {
  try {
    const id = req.params.id
    const post = await Post.find(id);
    if(post !== null){
      successHandle(res, post);
    }else{
      errorHandle(res, '無此文章');
    }
  }catch(err) {
    errorHandle(res, err);
  }
});

/* 修改單筆 post */
router.patch('/:id', async function(req, res, next) {
  try {
    const id = req.params.id
    const data = req.body
    if(data.name && data.content){
      const post = await Post.findByIdAndUpdate(id, data, { new: true });
      if(post !== null){
        successHandle(res, post);
      }else{
        errorHandle(res, '無此文章');
      }
    }else{
      errorHandle(res, '無此文章');
    }
  }catch(err) {
    errorHandle(res, err);
  }
});

/* 刪除單筆 post */
router.delete('/:id', async function(req, res, next) {
  try {
    const id = req.params.id
    const post = await Post.findByIdAndDelete(id);

    if (post !== null) {
      successHandle(res, '刪除成功');
    } else {
      errorHandle(res, '無此文章');
    }
  }catch(err) {
    errorHandle(res, err);
  }
});

/* 刪除全部 post */
router.delete('/', async function(req, res, next) {
  try {
    const posts = await Post.deleteMany({});
    successHandle(res, posts);
  }catch(err) {
    errorHandle(res, err);
  }
});

module.exports = router;
