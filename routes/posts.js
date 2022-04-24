var express = require('express');
var router = express.Router();
var Post = require('../models/postsModel');
const { errorHandle, successHandle } = require('../config/index');

/* 新增單筆 post */
router.post('/', function(req, res, next) {
  try {
    const newPost = Post.create();
    successHandle(res, newPost);
  }catch(err) {
    errorHandle(res, err);
  }
});

/* 取得所有 post */
router.get('/', function(req, res, next) {
  try {
    const posts = Post.find();
    successHandle(res, posts);
  }catch(err) {
    errorHandle(res, err);
  }
});

/* 取得單筆 post */
router.get('/:id', function(req, res, next) {
  try {
    const post = Post.find({
      _id: req.params.id
    });
    successHandle(res, post);
  }catch(err) {
    errorHandle(res, err);
  }
});

/* 修改單筆 post */
router.patch('/:id', function(req, res, next) {
  try {
    const post = Post.updateOne({
      _id: req.params.id,
      $set: req.body
    });
    successHandle(res, post);
  }catch(err) {
    errorHandle(res, err);
  }
});

/* 刪除單筆 post */
router.delete('/:id', function(req, res, next) {
  try {
    const post = Post.deleteOne({
      _id: req.params.id
    });
    successHandle(res, post);
  }catch(err) {
    errorHandle(res, err);
  }
});

/* 刪除全部 post */
router.delete('/', function(req, res, next) {
  try {
    const posts = Post.deleteMany({});
    successHandle(res, posts);
  }catch(err) {
    errorHandle(res, err);
  }
});

module.exports = router;
