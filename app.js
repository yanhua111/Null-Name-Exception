var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const redis = require('connect-redis')(session)

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const orderRouter = require('./routes/orders');
const pushRouter = require('./routes/notification');


var app = express();
app.get('/', function (req, res) {
  res.send("Hello Server!")
});

/* creating socket.io on port 8000, will be used be used for real time communication from the client,
* event 'locationIn' is listened, 'locationOut' is emitted,
* orderid is received and sent to ensure infomation only available between courier and customer sharing the same order
*/
const server = app.listen(8000);
var socket = require('socket.io');
io = socket(server);
io.sockets.on('connection', (socket) => {
  console.log('new connection')
  socket.on('locationIn', (data) => {
    io.sockets.json.emit('locationOut', { location: data }
    );
  });
})


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
    maxAge: 60 * 24 * 60 * 60 * 1000  //expire in this time(60days)
  },
  store: redis_store
}))


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/order', orderRouter);
app.use('/push', pushRouter);

io.on('connection', (client) => { 
  client.on('event', data => { 
      console.log(data)
  });
  client.on('disconnect', (data) => { 
      console.log(data)
  });
});

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

// app.listen(8000, 'localhost')

module.exports = app;
