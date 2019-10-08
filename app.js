var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const redis = require('connect-redis')(session)

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const orderRouter = require('./routes/orders');


var app = express();
// const env = process.env.NODE_ENV


// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

/*analyse session*/
const redis_client = require('./bin/database/redis');
const redis_store = new redis({
  client: redis_client
});
app.use(session({
  secret: 'saVe_On_4396_A',
  cookie: {
    // path: '/', //default 
    // httpOnly: true, //default
    maxAge: 24 * 60 * 60 * 1000  //expire in this time
  },
  store: redis_store
}))


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/order', orderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(8000, 'localhost')

module.exports = app;
