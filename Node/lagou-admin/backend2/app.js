const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// const cors=require('cors')跨域

//cookie和session的用法
const cookieSession=require('cookie-session')

const usersRouter = require('./routes/users');
const positionsRouter=require('./routes/positions')
const mobileRouter=require('./routes/mobile')

const app = express();

//解决跨域问题服务端处理办法
// app.use(cors)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//设置cookie,session
app.use(cookieSession({
  name:'session',
  keys:['key1','key2']
}))

app.use('/api/users',usersRouter)
app.use('/api/positions',positionsRouter)
app.use('/mobile',mobileRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
