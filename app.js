var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const serveIndex = require('serve-index');
const fetch = require('node-fetch');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
app.use('/', serveIndex('public', { icons: true }));

app.use('/users', usersRouter);

app.get('/try-sse', (req, res) => {
  let id = 30;

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  setInterval(function () {
    res.write('id: ' + id++ + '\n');
    res.write('data: ' + new Date().toLocaleString() + '\n\n');
  }, 2000);

});

//node fetch
//到http://localhost:3000/yahoo查看
//像跳板一樣 用戶端跟我要的時候我跟別的主機要 別的主機會認為我是一個用戶端 把資料丟給我 我再丟給用戶
//yahoo圖片比較特別 都是用絕對路徑寫的(主機不同) 所以可以看得到畫面 如果全部都適用react或vue寫的話這邊就看不到了
//實務上可以用到fetch的地方 ex.跟氣象局要資料的時候
app.get('/yahoo', async (req, res) => {
  const r = await fetch('https://tw.yahoo.com/');
  const content = await r.text();
  res.send(content);
});

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