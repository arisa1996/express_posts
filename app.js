var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var { resErrorProd, resErrorDev } = require('./config/error');

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

var indexRouter = require('./routes/index');
var postsRouter = require('./routes/posts');
var usersRouter = require('./routes/users');

var app = express();

// 發生重大錯誤
process.on("uncaughtException", (err) => {
  // 記錄錯誤下來，等到所有其他服務處理完成，然後停掉該process
  console.error('Not caught Exception =>');
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

mongoose.connect(process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD))
  .then(() => console.log('資料庫連接成功'))
  .catch((err) => { console.error(err) });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// error 404
app.use((req, res) => {
  console.error('404 err');
  res.status(404).json({
    status: 'error',
    message: '無此路由資訊'
  });
});

// error 500 預期next(err)的錯誤
app.use(function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;

  // dev
  if (process.env.NODE_ENV === 'dev') {
    return resErrorDev(err, res);
  }
  // prod
  if (err.name === 'ValidationError') {
    err.message = "資料欄位未填寫正確，請重新輸入！";
    err.isOperational = true;
    return resErrorProd(err, res);
  }
  resErrorProd(err, res);
});

// 未捕捉到的 catch 
process.on('unhandledRejection', (err, promise) => {
  console.error('未捕捉到的 rejection：', promise, '! 原因：', err);
});

module.exports = app;
