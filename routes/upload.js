const express = require('express');
const router = express.Router();
const { errorHandle, successHandle, appError, isAuth } = require('../config/index');
const sizeOf = require('image-size');
const { ImgurClient } = require('imgur');
const upload = require('../config/image');

router.post('/', isAuth, upload, errorHandle(async (req, res, next)=> {
    if(!req.files.length) {
      return appError({ errMessage: "尚未上傳檔案" }, next);
    }
    const dimensions = sizeOf(req.files[0].buffer);
    if(dimensions.width !== dimensions.height) {
      return appError({ errMessage: "圖片長寬不符合 1:1 尺寸。" }, next);
    }
    if (300 > dimensions.width) {
      return appError({ errMessage: "解析度寬度至少 300 像素以上" }, next);
    }
    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENTID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN,
    });
    const response = await client.upload({
      image: req.files[0].buffer.toString('base64'),
      type: 'base64',
      album: process.env.IMGUR_ALBUM_ID
    });

    successHandle(res, {
      imgUrl: response.data.link
    });
}));

module.exports = router;